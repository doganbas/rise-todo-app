import {Provider} from 'react-redux';
import React, {useEffect} from 'react';
import {PersistGate} from 'redux-persist/integration/react';
import ApplicationProvider from './components/providers/ApplicationProvider';
import TestComponent from './components/test/TestComponent';
import {setFetchApiDefault} from './config/fetchApiConfig';
import {persistStorage, store} from './config/storeConfig';
import '/src/assets/styles/base.scss';

const App = () => {

    useEffect(() => {
        setFetchApiDefault();
    }, []);

    return (
        <Provider store={store}>
            <PersistGate persistor={persistStorage}>
                <ApplicationProvider>
                    <TestComponent/>
                </ApplicationProvider>
            </PersistGate>
        </Provider>
    )
}

export default App;
