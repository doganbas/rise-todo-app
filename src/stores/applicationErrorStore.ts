import {Action, Reducer} from 'redux';
import {ExceptionType} from '../enums/exceptionType';
import {AppThunkAction} from './applicationStore';
import {Nullable} from '../types';

export interface ApplicationErrorState {
    isVisible: boolean,
    exceptionType: ExceptionType,
    errorCode: Nullable<string>,
    errorMessage: Nullable<string>,
    internetConnection: boolean
}

interface SetApplicationErrorAction {
    type: 'SET_APPLICATION_ERROR',
    isVisible: boolean,
    exceptionType: ExceptionType,
    errorCode: Nullable<string>,
    errorMessage: Nullable<string>,
}

interface ClearApplicationErrorAction {
    type: 'CLEAR_APPLICATION_ERROR'
}

interface ChangeConnectionAction {
    type: 'CHANGE_CONNECTION_STATUS',
    isOnline: boolean
}

export type KnownAction = SetApplicationErrorAction | ClearApplicationErrorAction | ChangeConnectionAction;

const unloadedState: ApplicationErrorState = {
    isVisible: false,
    exceptionType: ExceptionType.undefined,
    errorCode: null,
    errorMessage: null,
    internetConnection: true
};

export const applicationErrorActionCreators = {
    generateApplicationError: (message: string, exceptionType: ExceptionType, errorCode: Nullable<string> = null, isShowing = false): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({
            type: 'SET_APPLICATION_ERROR',
            isVisible: isShowing,
            exceptionType: exceptionType,
            errorCode: errorCode,
            errorMessage: message,
        });
    },
    clearApplicationError: (cleanForce = false): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (!(appState && appState.ApplicationErrorState && appState.ApplicationErrorState.exceptionType === ExceptionType.fatal) || cleanForce)
            dispatch({type: 'CLEAR_APPLICATION_ERROR'});
    },
    setConnectionStatus: (activeStatus: boolean): AppThunkAction<KnownAction> => (dispatch, getState) => {
        if (getState() && getState().ApplicationErrorState && getState().ApplicationErrorState.internetConnection !== activeStatus)
            dispatch({type: 'CHANGE_CONNECTION_STATUS', isOnline: activeStatus});
    }
}

export const applicationErrorReducer: Reducer<ApplicationErrorState> = (state: ApplicationErrorState | undefined, incomingAction: Action): ApplicationErrorState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    switch (action.type) {
        case 'CHANGE_CONNECTION_STATUS':
            return {
                ...state,
                internetConnection: action.isOnline
            };
        case 'SET_APPLICATION_ERROR': {
            return {
                ...state,
                isVisible: action.isVisible,
                exceptionType: action.exceptionType,
                errorCode: action.errorCode,
                errorMessage: action.errorMessage,
            };
        }
        case 'CLEAR_APPLICATION_ERROR':
            return {
                ...unloadedState,
                internetConnection: state.internetConnection
            };
    }

    return state;
};
