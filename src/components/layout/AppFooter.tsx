import {Modal, notification} from 'antd';
import {useTranslation} from 'react-i18next';
import React, {FunctionComponent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import applicationConfig from '../../config/applicationConfig';
import {todoActionCreators, TodoState} from '../../stores/todoStore';
import {ApplicationStates} from '../../stores/applicationStore';
import {CustomThunkDispatch} from '../../types';

const AppFooter: FunctionComponent = () => {
    const todoState = useSelector<ApplicationStates, TodoState>(states => states.TodoState);
    const dispatch = useDispatch<CustomThunkDispatch>();
    const {t} = useTranslation();

    const handleClickClearTodoList = () => {
        Modal.confirm({
            title: t('todo-delete-all-item-confirm-title', 'Tüm görevleri silmek istiyor musunuz?'),
            icon: <ExclamationCircleOutlined/>,
            content: t('todo-delete-all-item-confirm-content', 'Onay vermeniz durumunda tüm kayıtlı görevler silinecektir.'),
            okText: t('confirm-ok-button-text', 'Onayla'),
            cancelText: t('confirm-cancel-button-text', 'Vazgeç'),
            onOk() {
                dispatch(todoActionCreators.clearTodo());
                notification['success']({
                    message: t('notification-success-title', 'Görev Başarıyla Tamamlandı!'),
                    description: t('todo-delete-all-item-success', 'Kayıtlı tüm görevler başarıyla silinmiştir.')
                });
            }
        });
    }

    return (
        <footer className="c-layout__footer" data-testid="app-layout-footer">
            <div className="c-container-padding">
                <div className="c-layout__footer-content">
                    <a href={applicationConfig.brandInfo.brandLink} className="c-layout__footer-link" title={t('footer-repository-link-title', 'repository')} target="_blank" rel="external noreferrer">
                        <i className="fa-brands fa-git"></i>
                        <span>{t('footer-repository-link-text', 'repository')}</span>
                    </a>
                    <p className="c-layout__footer-copy">
                        &copy;&nbsp;{new Date().getFullYear()}&nbsp;{applicationConfig.brandInfo.companyName}
                        {
                            todoState.todoList.length > 0 &&
                            // eslint-disable-next-line jsx-a11y/anchor-is-valid
                            <>| <a onClick={handleClickClearTodoList} data-testid="todo-clear-all">{t('todo-delete-all-item', 'Tüm Veriyi Temizle')}</a></>
                        }
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default AppFooter;
