import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import React, {FunctionComponent, useEffect, useState} from 'react';
import {Button, Col, Input, Modal, notification, Row, Space, Table, Tag, Tooltip} from 'antd';
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined, SearchOutlined} from '@ant-design/icons';
import {todoPriorityActionCreators, TodoPriorityState} from '../../stores/todoPriorityStore';
import {ApplicationLanguageState} from '../../stores/applicationLanguageStore';
import PriorityDataHelper from '../../helpers/priorityDataHelper';
import {ApplicationStates} from '../../stores/applicationStore';
import PrioritySelect from '../forms/PrioritySelect';
import {todoActionCreators, TodoState} from '../../stores/todoStore';
import {TodoModel} from '../../models/todoModel';
import {CustomThunkDispatch} from '../../types';
import TodoEditForm from '../forms/TodoEditForm';

const TodoList: FunctionComponent = () => {
    const dispatch = useDispatch<CustomThunkDispatch>();
    const todoPriorityState = useSelector<ApplicationStates, TodoPriorityState>(states => states.TodoPriorityState);
    const languageState = useSelector<ApplicationStates, ApplicationLanguageState>(states => states.ApplicationLanguageState);
    const todoState = useSelector<ApplicationStates, TodoState>(states => states.TodoState);
    const {t} = useTranslation();
    const [todoList, setTodoList] = useState<TodoModel[]>();
    const [filterName, setFilterName] = useState<string | undefined>();
    const [filterPriority, setFilterPriority] = useState<string | undefined>();
    const [editModal, setEditModal] = useState<{ todoItem?: TodoModel, isVisible: boolean }>({isVisible: false});

    useEffect(() => {
        dispatch(todoPriorityActionCreators.checkTodoPriorityData());
    }, []);

    useEffect(() => {
        let newData = todoState.todoList;
        console.log(filterName, filterPriority, newData);

        if (filterName)
            newData = newData?.filter(nq => (nq.jobTitle?.toLowerCase().indexOf(filterName.toLowerCase()) ?? -1) > -1) ?? [];
        if (filterPriority)
            newData = newData?.filter(nq => nq.jobPriority == filterPriority) ?? [];

        setTodoList(newData);
    }, [todoState.todoList, filterName, filterPriority]);

    const handleClickEditButton = (todoItem: TodoModel) => {
        console.log(todoItem);
        setEditModal({todoItem: todoItem, isVisible: true});
    }

    const handleClickDeleteButton = (todoItem: TodoModel) => {
        Modal.confirm({
            title: t('todo-delete-item-confirm-title', 'Seçmiş olduğunuz görevi silmek istiyor musunuz?'),
            icon: <ExclamationCircleOutlined/>,
            content: t('todo-delete-item-confirm-content', 'Seçmiş olduğunuz görev kalıcı olarak silinecektir.'),
            okText: t('confirm-ok-button-text', 'Onayla'),
            cancelText: t('confirm-cancel-button-text', 'Vazgeç'),
            onOk() {
                dispatch(todoActionCreators.removeTodo(todoItem));
                notification['success']({
                    message: t('notification-success-title', 'Görev Başarıyla Tamamlandı!'),
                    description: t('todo-delete-item-success', '\'{{todo_name}}\' isimli görev başarı ile kaldırılmıştır.', {todo_name: todoItem.jobTitle})
                });
            }
        });
    }

    const handleUpdateTodoItem = (todoItem: TodoModel) => {
        dispatch(todoActionCreators.updateTodo(todoItem));
        setEditModal({todoItem: undefined, isVisible: false});
        notification['success']({
            message: t('notification-success-title', 'Görev Başarıyla Tamamlandı!'),
            description: t('todo-update-item-success', '\'{{todo_name}}\' isimli görev önceliği başarı ile değiştirilmiştir.', {todo_name: todoItem.jobTitle})
        });
    }

    const renderJobName = (jobName: string, todoItem: TodoModel): React.ReactNode => {
        const activePriority = todoPriorityState.priorityList.find(nq => nq.uuid == todoItem.jobPriority);
        return (
            <span className="c-todo-list__filter-job-name" style={{color: activePriority?.color ?? '#000'}}>{jobName} <em>{activePriority && PriorityDataHelper.translatePriorityName(activePriority, languageState.activeLanguage?.globalName)}</em></span>
        )
    }

    const renderPriorityName = (priorityUUID: string): React.ReactNode => {
        const activePriority = todoPriorityState.priorityList.find(nq => nq.uuid == priorityUUID);
        if (activePriority) {
            return (<Tag color={activePriority.color}>{PriorityDataHelper.translatePriorityName(activePriority, languageState.activeLanguage?.globalName)}</Tag>)
        }
        return (<span>-</span>)
    }

    const sortDataByPriotiry = (a: TodoModel, b: TodoModel) => {
        const aPriority = todoPriorityState.priorityList.find(nq => nq.uuid == a.jobPriority)?.order ?? 0;
        const bPriority = todoPriorityState.priorityList.find(nq => nq.uuid == b.jobPriority)?.order ?? 0;
        return aPriority - bPriority;
    }

    const sortDataByTitle = (a: TodoModel, b: TodoModel) => {
        const sortA = a.jobTitle ?? '';
        const sortB = b.jobTitle ?? '';

        return sortA < sortB ? -1 : sortA > sortB ? 1 : 0
    }

    return (
        <div className="c-container-padding">
            <div className="c-todo-list">
                <div className="c-todo-list__title">
                    <h2 className="c-todo-list__title-text">{t('todo-list-title', 'Görev Listesi')}</h2>
                    <span className="c-todo-list__title-count">{todoState.todoList.length + '/' + (todoList?.length ?? 0)}</span>
                </div>
                <div className="c-todo-list__filter">
                    <Row gutter={[20, 20]}>
                        <Col xs={24} md={12} lg={14} xxl={16}>
                            <Input
                                placeholder={t('todo-add-form-job-title-label', 'Göre Adı')}
                                key="filter-name"
                                size="large"
                                prefix={<SearchOutlined/>}
                                onChange={(element) => setFilterName(element.target.value)}
                            />
                        </Col>
                        <Col xs={24} md={12} lg={10} xxl={8}>
                            <PrioritySelect
                                name="filter-priority"
                                onChange={(data) => {
                                    setFilterPriority(data?.uuid);
                                }}
                                placeholder={t('todo-filter-chose-priority', 'Öncelik Durumu Seçin')}
                                allOptionTitle={t('todo-filter-priority-all', 'Öncelik (Tümü)')}
                                defaultValue="-1"
                                addAllOption={true}
                                isNotFormik={true}
                            />
                        </Col>
                    </Row>
                </div>
                <div className="c-todo-list__table">
                    <Table dataSource={todoList} pagination={false}>
                        <Table.Column
                            title={t('todo-add-form-job-title-label', 'Göre Adı').toString()}
                            key="jobTitle"
                            dataIndex="jobTitle"
                            width={'70%'}
                            sorter={sortDataByTitle}
                            render={renderJobName}
                        />
                        <Table.Column
                            title={t('todo-add-form-job-pritiory-label', 'Görev Önceliği').toString()}
                            key="jobPriority"
                            dataIndex="jobPriority"
                            width={'28%'}
                            responsive={['sm', 'md', 'lg', 'xl', 'xxl']}
                            sorter={sortDataByPriotiry}
                            render={renderPriorityName}
                            defaultSortOrder="ascend"
                        />
                        <Table.Column
                            title={t('todo-table-actions', 'İşlemler').toString()}
                            key="action"
                            render={(_: object, record: TodoModel) => (
                                <Space size="middle">
                                    <Tooltip placement="top" title={t('todo-table-edit-action-title', 'Güncelle')}>
                                        <Button type="primary" icon={<EditOutlined/>} size="middle" onClick={() => handleClickEditButton(record)}/>
                                    </Tooltip>
                                    <Tooltip placement="top" title={t('todo-table-delete-action-title', 'Sil')}>
                                        <Button type="primary" icon={<DeleteOutlined/>} size="middle" onClick={() => handleClickDeleteButton(record)} danger/>
                                    </Tooltip>
                                </Space>
                            )}
                        />
                    </Table>
                </div>

                <Modal footer={false} visible={editModal.isVisible} closable={false}>
                    <TodoEditForm
                        todoItem={editModal.todoItem}
                        onComplete={handleUpdateTodoItem}
                        onCancel={() => {
                            setEditModal({todoItem: undefined, isVisible: false});
                        }}
                    />
                </Modal>
            </div>
        </div>
    )
}

export default TodoList;
