import {Provider} from 'react-redux';
import React, {useEffect} from 'react';
import {PersistGate} from 'redux-persist/integration/react';
import ApplicationProvider from './components/providers/ApplicationProvider';
import {setFetchApiDefault} from './config/fetchApiConfig';
import {persistStorage, store} from './config/storeConfig';
import Layout from './views/shared/Layout';
import '/src/assets/styles/base.scss';

const App = () => {

    useEffect(() => {
        setFetchApiDefault();
    }, []);

    return (
        <Provider store={store}>
            <PersistGate persistor={persistStorage}>
                <ApplicationProvider>
                    <Layout/>
                </ApplicationProvider>
            </PersistGate>
        </Provider>
    )
}

export default App;
