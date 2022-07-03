import storage from 'redux-persist/lib/storage';

const persistConfiguration = {
    key: 'root',
    storage: storage,
    whitelist: ([
        'TodoPriorityState',
        'TodoState'
    ]),
    blacklist: [
        'ApplicationErrorState',
        'ApplicationLoaderState'
    ]
};

export default persistConfiguration;
