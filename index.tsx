import React from 'react';
import ReactDOM from 'react-dom';
import App from './src';

ReactDOM.render(<App/>, document.getElementById('react-app'));

if ((module as any).hot) {
    (module as any).hot.accept('./src', () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const NewApp = require('./src/index').default;
        ReactDOM.render(<NewApp/>, document.getElementById('react-app'));
    });
}
