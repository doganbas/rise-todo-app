import {Action, Reducer} from 'redux';
import {ApplicationStates, AppThunkAction} from './applicationStore';
import {TodoModel} from '../models/todoModel';
import {CustomThunkDispatch} from '../types';

export interface TodoState {
    todoList: TodoModel[]
}

interface UpdateTodoListAction {
    type: 'UPDATE_TODO_LIST_ACTION',
    todoList: TodoModel[]
}

interface ClearTodoListAction {
    type: 'CLEAR_TODO_LIST_ACTION'
}

type KnownAction = UpdateTodoListAction | ClearTodoListAction;

const unloadedState: TodoState = {
    todoList: []
}

export const todoActionCreators = {
    addTodo: (todoItem: TodoModel): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const globalDispatch = dispatch as CustomThunkDispatch;
        const activeState = getState() as ApplicationStates;
        if ((activeState?.TodoState.todoList.filter(nq => nq.uuid == todoItem.uuid).length ?? 0) > 0) {
            globalDispatch(todoActionCreators.updateTodo(todoItem));
            return;
        }
        dispatch({type: 'UPDATE_TODO_LIST_ACTION', todoList: [...activeState.TodoState.todoList, todoItem]});
    },
    updateTodo: (todoItem: TodoModel): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const globalDispatch = dispatch as CustomThunkDispatch;
        const activeState = getState() as ApplicationStates;
        const updateList = [...activeState.TodoState.todoList];
        const removeItem = updateList.findIndex(nq => nq.uuid == todoItem.uuid);
        if (removeItem < 0) {
            globalDispatch(todoActionCreators.addTodo(todoItem));
            return;
        }
        updateList.splice(removeItem, 1);
        updateList.push(todoItem);
        dispatch({type: 'UPDATE_TODO_LIST_ACTION', todoList: updateList});
    },
    removeTodo: (todoItem: TodoModel): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const activeState = getState() as ApplicationStates;
        const updateList = [...activeState.TodoState.todoList];
        const removeItem = updateList.findIndex(nq => nq.uuid == todoItem.uuid);
        updateList.splice(removeItem, 1);
        dispatch({type: 'UPDATE_TODO_LIST_ACTION', todoList: updateList});
    },
    clearTodo: (): AppThunkAction<KnownAction> => (dispatch) => {
        dispatch({type: 'CLEAR_TODO_LIST_ACTION'});
    }
}

export const todoReducer: Reducer<TodoState> = (state: TodoState | undefined, incomingAction: Action): TodoState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'UPDATE_TODO_LIST_ACTION':
            return {
                ...state,
                todoList: action.todoList
            }
        case 'CLEAR_TODO_LIST_ACTION':
            return {
                todoList: []
            }
    }

    return state || undefined;
}
