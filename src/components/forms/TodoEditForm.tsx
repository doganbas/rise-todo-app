import {useTranslation} from 'react-i18next';
import {Formik, FormikHelpers} from 'formik';
import {Button, Col, Row, Space} from 'antd';
import React, {FunctionComponent} from 'react';
import {Form, Input, SubmitButton} from 'formik-antd';
import {TodoModel} from '../../models/todoModel';
import PrioritySelect from './PrioritySelect';

const TodoEditForm: FunctionComponent<{ todoItem: TodoModel | undefined, onComplete: (todoItem: TodoModel) => void, onCancel: () => void }> = (props) => {
    const {t} = useTranslation();

    const fieldTitles = {
        jobTitle: t('todo-add-form-job-title-label', 'Göre Adı'),
        jobPriority: t('todo-add-form-job-pritiory-label', 'Görev Önceliği')
    }

    const handleChangeForm = (values: TodoModel, action: FormikHelpers<TodoModel>) => {
        action.setSubmitting(true);
        props.onComplete(values);
    }

    return (
        <div className="c-todo-edit" data-testid={`todo-edit-modal-${props.todoItem?.jobTitle}`}>
            <div className="c-todo-edit-container">
                <h2 className="c-todo-edit__title">{t('todo-edit-form-title', 'Görevi Düzenle')}</h2>
                <Formik
                    initialValues={props.todoItem ?? {uuid: ''}}
                    onSubmit={handleChangeForm}
                    enableReinitialize={true}
                >
                    <Form layout="vertical" validateTrigger="onSubmit" className="c-todo-edit__form">
                        <Row gutter={[10, 10]}>
                            <Col xxl={24}>
                                <Form.Item name="jobTitle" label={fieldTitles.jobTitle}>
                                    <Input name="jobTitle" size="large" placeholder={fieldTitles.jobTitle} disabled data-testid="todo-edit-form-job-title"/>
                                </Form.Item>
                            </Col>
                            <Col xxl={24}>
                                <Form.Item name="jobPriority" label={fieldTitles.jobPriority}>
                                    <PrioritySelect name="jobPriority" placeholder={t('todo-add-form-job-priority-chose', 'Seçiniz')}/>
                                </Form.Item>
                            </Col>
                            <Col xxl={24}>
                                <Space size="middle" align="center">
                                    <Button type="primary" danger size="large" onClick={props.onCancel}>{t('confirm-cancel-button-text', 'Onayla')}</Button>
                                    <SubmitButton type="primary" size="large" data-testid="todo-edit-form-submit">{t('modal-save-button-text', 'Kaydet')}</SubmitButton>
                                </Space>
                            </Col>
                        </Row>
                    </Form>
                </Formik>
            </div>
        </div>
    )
}

export default TodoEditForm;
