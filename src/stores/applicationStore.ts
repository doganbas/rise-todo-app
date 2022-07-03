import * as ApplicationErrorStore from './applicationErrorStore';
import * as ApplicationLoaderStore from './applicationLoaderStore';
import * as ApplicationLanguageStore from './applicationLanguageStore';
import * as TodoPriorityStore from './todoPriorityStore';
import * as TodoStore from './todoStore';

export interface ApplicationStates {
    ApplicationErrorState: ApplicationErrorStore.ApplicationErrorState,
    ApplicationLanguageState: ApplicationLanguageStore.ApplicationLanguageState,
    ApplicationLoaderState: ApplicationLoaderStore.ApplicationLoaderState,
    TodoPriorityState: TodoPriorityStore.TodoPriorityState,
    TodoState: TodoStore.TodoState
}

export const ApplicationReducers = {
    ApplicationErrorState: ApplicationErrorStore.applicationErrorReducer,
    ApplicationLanguageState: ApplicationLanguageStore.applicationLanguageReducer,
    ApplicationLoaderState: ApplicationLoaderStore.applicationLoaderReducer,
    TodoPriorityState: TodoPriorityStore.todoPriorityReducer,
    TodoState: TodoStore.todoReducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationStates): void;
}
