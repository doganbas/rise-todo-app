import {TodoPriorityModel} from '../models/todoPriorityModel';
import {CustomThunkDispatch, Nullable} from '../types';
import {ApplicationStates, AppThunkAction} from './applicationStore';
import {Action, Reducer} from 'redux';
import DateHelper from '../helpers/dateHelper';
import generateUUID from '../helpers/uuidHelper';
import {applicationLoaderActionCreators} from './applicationLoaderStore';
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

        if (DateHelper.timeDiff(activeState.TodoPriorityState.lastSync, null, 'hour') < 12)
            globalDispatch(todoPriorityActionCreators.getTodoPriorityData());
    },
    getTodoPriorityData: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const loaderId = generateUUID();
        const globalDispatch = dispatch as CustomThunkDispatch;

        ///TODO Fetch data from NodeJs
        const fakeModel: TodoPriorityModel[] = [
            {uuid: generateUUID(), name: [{languageGlobalName: 'tr', value: 'Acil'}, {languageGlobalName: 'en', value: 'Urgent'}]},
            {uuid: generateUUID(), name: [{languageGlobalName: 'tr', value: 'Önemli'}, {languageGlobalName: 'en', value: 'Important'}]},
            {uuid: generateUUID(), name: [{languageGlobalName: 'tr', value: 'Normal'}, {languageGlobalName: 'en', value: 'Normal'}]},
        ];
        setTimeout(() => {
            dispatch({type: 'RECEIVE_TODO_PRIORITY_ACTION', priorityList: fakeModel});
            globalDispatch(applicationLoaderActionCreators.hideGlobalLoader(loaderId));
        }, 4000);

        globalDispatch(applicationLoaderActionCreators.showGlobalLoader('Durum verileride sunucudan alınıyor...', loaderId, LoaderType.inclusive));
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
