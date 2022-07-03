import React, {FunctionComponent} from 'react';
import NewTodoForm from '../../components/forms/TodoAddForm';
import AppHelmet from '../../components/layout/AppHelmet';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';
import TodoList from '../../components/lists/TodoList';

const Layout: FunctionComponent = () => {

    return (
        <div className="c-layout">
            <AppHelmet/>
            <AppHeader/>
            <main className="c-layout__content">
                <NewTodoForm/>
                <TodoList/>
            </main>
            <AppFooter/>
        </div>
    )

}

export default Layout;
