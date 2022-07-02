import React from 'react';
import {FunctionComponent, PropsWithChildren} from 'react';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';

const Layout: FunctionComponent<PropsWithChildren> = (props) => {

    return (
        <div className="c-layout">
            <AppHeader/>
            <main className="c-layout__content">
                {/*
                    ///TODO: Create Job Form
                    ///TODO: Job List
                */}
            </main>
            <AppFooter/>
        </div>
    )
}

export default Layout;
