import thunk from 'redux-thunk';
import logger from 'redux-logger'
import {combineReducers} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import {ApplicationReducers} from '../stores/applicationStore';
import persistConfiguration from './persistConfiguration';

//Middleware
const middleware = process.env.NODE_ENV === 'development' ? [thunk, logger] : [thunk];

//Reducers
const rootReducer = combineReducers({...ApplicationReducers});

//Persist Config
const persistedReducer = persistReducer(persistConfiguration, rootReducer);

//Create Dev Tools
const enhancers = [];
const windowIfDefined = typeof window === 'undefined' ? null : window;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
}

//Configure Redux Store
const store = configureStore({reducer: persistedReducer, middleware: [...middleware, ...enhancers]});

//Create Persist Storage
const persistStorage = persistStore(store);

export {store, persistStorage};
