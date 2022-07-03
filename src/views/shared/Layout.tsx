import React, {FunctionComponent, PropsWithChildren} from 'react';
import NewTodoForm from '../../components/forms/TodoAddForm';
import AppHelmet from '../../components/layout/AppHelmet';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';

const Layout: FunctionComponent<PropsWithChildren> = (props) => {

    return (
        <div className="c-layout">
            <AppHelmet/>
            <AppHeader/>
            <main className="c-layout__content">
                <NewTodoForm/>
            </main>
            <AppFooter/>
        </div>
    )

}

export default Layout;
