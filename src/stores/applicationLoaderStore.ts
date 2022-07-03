import {Action, Reducer} from 'redux';
import {ApplicationTranslationModel} from '../models/applicationTranslationModel';
import {ApplicationLoaderModel} from '../models/applicationLoaderModel';
import {AppThunkAction} from './applicationStore';
import {LoaderType} from '../enums/loaderType';
import {Nullable} from '../types';

export interface ApplicationLoaderState {
    isVisible: boolean,
    loaderItems: ApplicationLoaderModel[]
}

interface ShowGlobalLoaderAction {
    type: 'SHOW_GLOBAL_LOADER',
    newLoaders: ApplicationLoaderModel[]
}

interface HideGlobalLoaderAction {
    type: 'HIDE_GLOBAL_LOADER',
    newLoaders: ApplicationLoaderModel[],
    isVisible: boolean
}

export type KnownAction = ShowGlobalLoaderAction | HideGlobalLoaderAction;

const unloadedState: ApplicationLoaderState = {
    isVisible: false,
    loaderItems: []
};

export const applicationLoaderActionCreators = {
    showGlobalLoader: (stateText: Nullable<ApplicationTranslationModel>, loaderId: string, loaderType: LoaderType): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const allLoaders: ApplicationLoaderModel[] = getState()?.ApplicationLoaderState?.loaderItems ?? [];
        const activeLoaderIndex = allLoaders.findIndex(nq => nq.loaderId === loaderId);
        if (activeLoaderIndex > -1)
            allLoaders.splice(activeLoaderIndex, 1);
        allLoaders.push({loaderId: loaderId, startTime: new Date(), loaderType: loaderType, visibleText: stateText});
        dispatch({type: 'SHOW_GLOBAL_LOADER', newLoaders: allLoaders});
    },
    hideGlobalLoader: (loaderId: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const allLoaders: ApplicationLoaderModel[] = getState()?.ApplicationLoaderState?.loaderItems ?? [];
        const activeLoaderIndex = allLoaders.findIndex(nq => nq.loaderId === loaderId);
        if (activeLoaderIndex > -1)
            allLoaders.splice(activeLoaderIndex, 1);
        const isVisible = allLoaders.length > 0;

        dispatch({type: 'HIDE_GLOBAL_LOADER', newLoaders: allLoaders, isVisible: isVisible});
    },
    hideAllLoader: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({type: 'HIDE_GLOBAL_LOADER', newLoaders: [], isVisible: false});
    }
};

export const applicationLoaderReducer: Reducer<ApplicationLoaderState> = (state: ApplicationLoaderState | undefined, incomingAction: Action): ApplicationLoaderState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'SHOW_GLOBAL_LOADER': {
            return {
                isVisible: true,
                loaderItems: action.newLoaders,

            }
        }
        case 'HIDE_GLOBAL_LOADER': {
            return {
                isVisible: action.isVisible,
                loaderItems: action.newLoaders
            }
        }
    }

    return state || unloadedState;
};
