import {Action, Reducer} from 'redux';
import i18n, {Resource} from 'i18next';
import fetchApi from 'axios';
import {initReactI18next} from 'react-i18next';
import {LanguageModel} from '../models/languageModel';
import {applicationErrorActionCreators} from './applicationErrorStore';
import {ApplicationStates, AppThunkAction} from './applicationStore';
import applicationConfig from '../config/applicationConfig';
import {CustomThunkDispatch, Nullable} from '../types';
import {createBaseUrl} from '../config/fetchApiConfig';
import {ExceptionType} from '../enums/exceptionType';
import {DevConsole} from '../helpers/consoleHelper';
import {DataType} from '../enums/dataType';
import isDev from '../helpers/devDetect';

export interface ApplicationLanguageState {
    activeLanguage: Nullable<LanguageModel>,
    deviceLanguage: Nullable<string>,
    languageList: LanguageModel[],
    completeLocalization: boolean
}

interface ChangeApplicationLanguage {
    type: 'CHANGE_APPLICATION_LANGUAGE',
    activeLanguage: LanguageModel
}

interface SetDeviceLanguage {
    type: 'SET_DEVICE_LANGUAGE',
    deviceLanguage: Nullable<string>
}

interface CompleteApplicationLocalizationAction {
    type: 'COMPLETE_APPLICATION_LOCALIZATION',
    completeLocalization: boolean,
    languageList: LanguageModel[]
}

export type KnownAction = ChangeApplicationLanguage | SetDeviceLanguage | CompleteApplicationLocalizationAction;

const unloadedState: ApplicationLanguageState = {
    activeLanguage: null,
    deviceLanguage: null,
    languageList: [],
    completeLocalization: false
}

export const applicationLanguageActionCreators = {
    changeApplicationLanguage: (activeLanguage: LanguageModel | string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const globalDispatch = dispatch as CustomThunkDispatch;
        const activeState = getState() as ApplicationStates;
        if (typeof activeLanguage == 'string') {
            let inLanguage = activeState.ApplicationLanguageState.languageList.filter(nq => nq.globalName == activeLanguage)[0];
            if (inLanguage == null)
                inLanguage = activeState.ApplicationLanguageState.languageList[0];
            activeLanguage = inLanguage;
        }

        const globalName = activeLanguage.globalName;
        if (activeState.ApplicationLanguageState.languageList.filter(nq => nq.globalName == globalName).length > 0) {
            if (!activeState?.ApplicationLanguageState?.activeLanguage || activeState.ApplicationLanguageState.activeLanguage.globalName != activeLanguage.globalName) {
                dispatch({type: 'CHANGE_APPLICATION_LANGUAGE', activeLanguage: activeLanguage});
                i18n.changeLanguage(activeLanguage.globalName).catch((ex) => {
                    DevConsole.error(ex);
                });
            }
        } else {
            globalDispatch(applicationErrorActionCreators.generateApplicationError('Seçtiğiniz dil sistemde bulunamadığı için dil değişimi tamamlanamadı.', ExceptionType.error, '500', true));
        }
    },
    setDeviceLanguage: (deviceLanguage: Nullable<string>): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (getState()?.ApplicationLanguageState?.activeLanguage != deviceLanguage) {
            dispatch({type: 'SET_DEVICE_LANGUAGE', deviceLanguage: deviceLanguage});
        }
    },
    initLocalizationSystem: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (!i18n.isInitialized) {
            const globalDispatch = dispatch as CustomThunkDispatch;
            const languageList = applicationConfig.languageInfo.languageList;
            const activeLanguage = getState().ApplicationLanguageState.activeLanguage?.globalName ?? applicationConfig.languageInfo.activeLanguage;
            const resourceList: Resource = {};
            const allLanguages: string[] = [];
            languageList.forEach(nq => {
                const finalItems: { [key: string]: Nullable<string> | Nullable<number> | Nullable<object>; } = {}
                nq.localization.forEach(sq => {
                    finalItems[sq.key] = sq.value;
                });
                resourceList[nq.globalName] = {translation: finalItems};
                allLanguages.push(nq.globalName);
            });

            i18n.use(initReactI18next)
                .init({
                    resources: resourceList,
                    fallbackLng: allLanguages,
                    keySeparator: false,
                    interpolation: {
                        escapeValue: false
                    },
                    saveMissing: true,
                    missingKeyHandler: (lng, ns, key, fallbackValue) => {
                        globalDispatch(applicationLanguageActionCreators.pushNewLocalizationItem([...lng], ns, key, fallbackValue));
                    },
                    debug: isDev(),
                    lng: activeLanguage
                }, (err) => {
                    if (err) {
                        globalDispatch(applicationErrorActionCreators.generateApplicationError('Dil verileri yüklenirken bir hata meydana geldi.', ExceptionType.fatal, '500', true));
                        dispatch({type: 'COMPLETE_APPLICATION_LOCALIZATION', completeLocalization: false, languageList: []});
                    } else {
                        if (activeLanguage)
                            applicationConfig.languageInfo.activeLanguage = activeLanguage;
                        fetchApi.defaults.baseURL = createBaseUrl();
                        fetchApi.defaults.headers.common['accept-language'] = applicationConfig.languageInfo.activeLanguage;
                        dispatch({type: 'COMPLETE_APPLICATION_LOCALIZATION', completeLocalization: true, languageList: languageList});
                    }
                })
                .then(() => {
                    dispatch({type: 'COMPLETE_APPLICATION_LOCALIZATION', completeLocalization: true, languageList: languageList});
                });

            i18n.on('languageChanged', function (lng) {
                if (lng)
                    applicationConfig.languageInfo.activeLanguage = lng;
                fetchApi.defaults.baseURL = createBaseUrl();
                fetchApi.defaults.headers.common['accept-language'] = applicationConfig.languageInfo.activeLanguage;
            });
        } else if (!getState().ApplicationLanguageState.completeLocalization) {
            dispatch({type: 'COMPLETE_APPLICATION_LOCALIZATION', completeLocalization: true, languageList: []});
        }
    },
    pushNewLocalizationItem: (languages: string[], namespace: string, transKey: string, defaultTrans?: Nullable<string>): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const activeState = getState() as ApplicationStates;
        const activeLanguageList = activeState.ApplicationLanguageState.languageList;
        activeLanguageList.forEach(activeLanguage => {
            if (activeLanguage.localization.filter(nq => nq.key == transKey).length <= 0) {
                activeLanguage.localization.push({
                    value: defaultTrans ?? transKey,
                    key: transKey,
                    dataType: DataType.string
                });
                i18n.addResource(activeLanguage.globalName, namespace, transKey, (defaultTrans ?? transKey));
            }
        });

        dispatch({type: 'COMPLETE_APPLICATION_LOCALIZATION', completeLocalization: true, languageList: activeLanguageList});
    }
}

export const applicationLanguageReducer: Reducer<ApplicationLanguageState> = (state: ApplicationLanguageState | undefined, incomingAction: Action): ApplicationLanguageState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'COMPLETE_APPLICATION_LOCALIZATION':
            return {
                ...state,
                completeLocalization: true,
                languageList: action.languageList
            }
        case 'SET_DEVICE_LANGUAGE':
            return {
                ...state,
                deviceLanguage: action.deviceLanguage
            }
        case 'CHANGE_APPLICATION_LANGUAGE':
            return {
                ...state,
                activeLanguage: action.activeLanguage
            }
    }

    return state || unloadedState;
}