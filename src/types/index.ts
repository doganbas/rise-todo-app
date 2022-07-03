import {Action} from 'redux';
import {ThunkDispatch} from 'redux-thunk';
import {ApplicationStates} from '../stores/applicationStore';

export type decimal = number;
export type double = number;
export type float = number;
export type Nullable<T> = T | null;
export type IndexedString<T> = { [key: string]: T };
export type IndexedNumber<T> = { [key: number]: T };
export type CustomAny = number | string | object | undefined;
export type CustomThunkDispatch = ThunkDispatch<ApplicationStates, null, Action<string>>;