import moment from 'moment';
import i18next from 'i18next';
import {useDispatch, useSelector} from 'react-redux';
import React, {FunctionComponent, PropsWithChildren, useEffect} from 'react';
import {applicationLanguageActionCreators, ApplicationLanguageState} from '../../stores/applicationLanguageStore';
import {ApplicationStates} from '../../stores/applicationStore';
import {CustomThunkDispatch, Nullable} from '../../types';
import {LanguageModel} from '../../models/languageModel';

const ApplicationLanguageProvider: FunctionComponent<PropsWithChildren> = (props) => {
    const dispatch = useDispatch<CustomThunkDispatch>();
    const languageState = useSelector<ApplicationStates, ApplicationLanguageState>(state => state.ApplicationLanguageState);

    useEffect(() => {
        dispatch(applicationLanguageActionCreators.initLocalizationSystem());
    }, []);

    useEffect(() => {
        let deviceLanguage = navigator.language;
        if (deviceLanguage.indexOf('-') > -1)
            deviceLanguage = deviceLanguage.split('-')[0].toLowerCase();
        if (deviceLanguage != languageState.deviceLanguage)
            dispatch(applicationLanguageActionCreators.setDeviceLanguage(deviceLanguage));

        if (languageState.completeLocalization && !languageState.activeLanguage) {
            let selectedLanguage: Nullable<LanguageModel> = languageState.languageList.filter(nq => nq.globalName == deviceLanguage)[0];
            if (!selectedLanguage)
                selectedLanguage = languageState.languageList[0];
            dispatch(applicationLanguageActionCreators.changeApplicationLanguage(selectedLanguage));
        } else if ((!languageState.completeLocalization) || (languageState.completeLocalization && !i18next.isInitialized)) {
            dispatch(applicationLanguageActionCreators.initLocalizationSystem());
        }

        if (languageState.activeLanguage) {
            import(`moment/locale/${languageState.activeLanguage.globalName}`).then(() => {
                moment.locale(languageState?.activeLanguage?.globalName ?? 'tr');
            });
        }

    }, [languageState]);

    return (
        <>
            {
                languageState.completeLocalization && languageState.activeLanguage && i18next.isInitialized ? props.children : <div/>
            }
        </>
    );
};

export default ApplicationLanguageProvider;
