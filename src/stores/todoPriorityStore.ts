import {Action, Reducer} from 'redux';
import fetchApi, {AxiosError} from 'axios';
import {applicationLoaderActionCreators} from './applicationLoaderStore';
import {applicationErrorActionCreators} from './applicationErrorStore';
import {ApplicationStates, AppThunkAction} from './applicationStore';
import {TodoPriorityModel} from '../models/todoPriorityModel';
import applicationConfig from '../config/applicationConfig';
import {CustomThunkDispatch, Nullable} from '../types';
import {ExceptionType} from '../enums/exceptionType';
import generateUUID from '../helpers/uuidHelper';
import DateHelper from '../helpers/dateHelper';
import {LoaderType} from '../enums/loaderType';

export interface TodoPriorityState {
    priorityList: TodoPriorityModel[],
    isFetching: boolean,
    lastSync: Nullable<Date>
}

interface RequestTodoPriotiryAction {
    type: 'REQUEST_TODO_PRIORITY_ACTION'
}

interface ReceiveTodoPriorityAction {
    type: 'RECEIVE_TODO_PRIORITY_ACTION',
    priorityList: TodoPriorityModel[]
}

type KnownAction = RequestTodoPriotiryAction | ReceiveTodoPriorityAction;

const unloadedState: TodoPriorityState = {
    priorityList: [],
    isFetching: false,
    lastSync: null
};

export const todoPriorityActionCreators = {
    checkTodoPriorityData: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const globalDispatch = dispatch as CustomThunkDispatch;
        const activeState = getState() as ApplicationStates;

        if (!activeState.TodoPriorityState.isFetching && (activeState.TodoPriorityState.lastSync == null || activeState.TodoPriorityState.priorityList.length === 0 || DateHelper.timeDiff(activeState.TodoPriorityState.lastSync, null, 'hour') > 12))
            globalDispatch(todoPriorityActionCreators.getTodoPriorityData());
    },
    getTodoPriorityData: (): AppThunkAction<KnownAction> => (dispatch) => {
        const loaderId = generateUUID();
        const globalDispatch = dispatch as CustomThunkDispatch;

        fetchApi.get<TodoPriorityModel[]>(applicationConfig.serviceUrls.getPriorityList).then((response) => {
            const responseData = response.data;
            dispatch({type: 'RECEIVE_TODO_PRIORITY_ACTION', priorityList: responseData});
        }).catch((exception: AxiosError) => {
            globalDispatch(applicationErrorActionCreators.generateApplicationError(exception.message, ExceptionType.error, exception.code, true));
            dispatch({type: 'RECEIVE_TODO_PRIORITY_ACTION', priorityList: []});
        }).finally(() => {
            globalDispatch(applicationLoaderActionCreators.hideGlobalLoader(loaderId));
        })

        globalDispatch(applicationLoaderActionCreators.showGlobalLoader({name: 'fetch-todo-priority-list', defaultTranslation: 'Durum verileride sunucudan alınıyor...'}, loaderId, LoaderType.inclusive));
        dispatch({type: 'REQUEST_TODO_PRIORITY_ACTION'});
    }
}

export const todoPriorityReducer: Reducer<TodoPriorityState> = (state: TodoPriorityState | undefined, incomingAction: Action): TodoPriorityState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_TODO_PRIORITY_ACTION':
            return {
                ...state,
                isFetching: true
            }
        case 'RECEIVE_TODO_PRIORITY_ACTION':
            return {
                priorityList: action.priorityList,
                isFetching: false,
                lastSync: action.priorityList.length > 0 ? new Date() : null
            }
    }

    return state || unloadedState;
}
