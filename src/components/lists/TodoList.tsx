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
    }, [dispatch]);

    useEffect(() => {
        let newData = todoState.todoList;

        if (filterName)
            newData = newData?.filter(nq => (nq.jobTitle?.toLowerCase().indexOf(filterName.toLowerCase()) ?? -1) > -1) ?? [];
        if (filterPriority)
            newData = newData?.filter(nq => nq.jobPriority === filterPriority) ?? [];

        setTodoList(newData);
    }, [todoState.todoList, filterName, filterPriority]);

    const handleClickEditButton = (todoItem: TodoModel) => {
        setEditModal({todoItem: todoItem, isVisible: true});
    }

    const handleClickDeleteButton = (todoItem: TodoModel) => {
        Modal.confirm({
            title: t('todo-delete-item-confirm-title', 'Se??mi?? oldu??unuz g??revi silmek istiyor musunuz?'),
            icon: <ExclamationCircleOutlined/>,
            content: t('todo-delete-item-confirm-content', 'Se??mi?? oldu??unuz g??rev kal??c?? olarak silinecektir.'),
            okText: t('confirm-ok-button-text', 'Onayla'),
            cancelText: t('confirm-cancel-button-text', 'Vazge??'),
            onOk() {
                dispatch(todoActionCreators.removeTodo(todoItem));
                notification['success']({
                    message: t('notification-success-title', 'G??rev Ba??ar??yla Tamamland??!'),
                    description: t('todo-delete-item-success', '\'{{todo_name}}\' isimli g??rev ba??ar?? ile kald??r??lm????t??r.', {todo_name: todoItem.jobTitle})
                });
            }
        });
    }

    const handleUpdateTodoItem = (todoItem: TodoModel) => {
        dispatch(todoActionCreators.updateTodo(todoItem));
        setEditModal({todoItem: undefined, isVisible: false});
        notification['success']({
            message: t('notification-success-title', 'G??rev Ba??ar??yla Tamamland??!'),
            description: t('todo-update-item-success', '\'{{todo_name}}\' isimli g??rev ??nceli??i ba??ar?? ile de??i??tirilmi??tir.', {todo_name: todoItem.jobTitle})
        });
    }

    const renderJobName = (jobName: string, todoItem: TodoModel): React.ReactNode => {
        const activePriority = todoPriorityState.priorityList.find(nq => nq.uuid === todoItem.jobPriority);
        const activePriorityName = !activePriority ? '' : PriorityDataHelper.translatePriorityName(activePriority, languageState.activeLanguage?.globalName);
        return (
            <span className="c-todo-list__filter-job-name" style={{color: activePriority?.color ?? '#000'}} data-testid={`todo-list-item-${jobName}`}>{jobName} <em data-testid={`todo-list-item-${activePriorityName}`}>{activePriorityName}</em></span>
        )
    }

    const renderPriorityName = (priorityUUID: string): React.ReactNode => {
        const activePriority = todoPriorityState.priorityList.find(nq => nq.uuid === priorityUUID);
        if (activePriority) {
            return (<Tag color={activePriority.color}>{PriorityDataHelper.translatePriorityName(activePriority, languageState.activeLanguage?.globalName)}</Tag>)
        }
        return (<span>-</span>)
    }

    const sortDataByPriotiry = (a: TodoModel, b: TodoModel) => {
        const aPriority = todoPriorityState.priorityList.find(nq => nq.uuid === a.jobPriority)?.order ?? 0;
        const bPriority = todoPriorityState.priorityList.find(nq => nq.uuid === b.jobPriority)?.order ?? 0;
        return aPriority - bPriority;
    }

    const sortDataByTitle = (a: TodoModel, b: TodoModel) => {
        const sortA = a.jobTitle ?? '';
        const sortB = b.jobTitle ?? '';

        return sortA < sortB ? -1 : sortA > sortB ? 1 : 0
    }

    return (
        <div className="c-container-padding">
            <div className="c-todo-list" data-testid="todo-list">
                <div className="c-todo-list__title">
                    <h2 className="c-todo-list__title-text">{t('todo-list-title', 'G??rev Listesi')}</h2>
                    <span className="c-todo-list__title-count">{todoState.todoList.length + '/' + (todoList?.length ?? 0)}</span>
                </div>
                <div className="c-todo-list__filter">
                    <Row gutter={[20, 20]}>
                        <Col xs={24} md={12} lg={14} xxl={16}>
                            <Input
                                placeholder={t('todo-add-form-job-title-label', 'G??re Ad??')}
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
                                placeholder={t('todo-filter-chose-priority', '??ncelik Durumu Se??in')}
                                allOptionTitle={t('todo-filter-priority-all', '??ncelik (T??m??)')}
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
                            title={t('todo-add-form-job-title-label', 'G??re Ad??').toString()}
                            key="jobTitle"
                            dataIndex="jobTitle"
                            width={'70%'}
                            sorter={sortDataByTitle}
                            render={renderJobName}
                        />
                        <Table.Column
                            title={t('todo-add-form-job-pritiory-label', 'G??rev ??nceli??i').toString()}
                            key="jobPriority"
                            dataIndex="jobPriority"
                            width={'28%'}
                            responsive={['sm', 'md', 'lg', 'xl', 'xxl']}
                            sorter={sortDataByPriotiry}
                            render={renderPriorityName}
                            defaultSortOrder="ascend"
                        />
                        <Table.Column
                            title={t('todo-table-actions', '????lemler').toString()}
                            key="action"
                            render={(_: object, record: TodoModel) => (
                                <Space size="middle">
                                    <Tooltip placement="top" title={t('todo-table-edit-action-title', 'G??ncelle')}>
                                        <Button type="primary" icon={<EditOutlined/>} size="middle" onClick={() => handleClickEditButton(record)} data-testid={`todo-list-item-edit-${record.jobTitle}`}/>
                                    </Tooltip>
                                    <Tooltip placement="top" title={t('todo-table-delete-action-title', 'Sil')}>
                                        <Button type="primary" icon={<DeleteOutlined/>} size="middle" onClick={() => handleClickDeleteButton(record)} data-testid={`todo-list-item-remove-${record.jobTitle}`} danger/>
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

