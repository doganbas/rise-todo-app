import {Col, notification, Row} from 'antd';
import {useTranslation} from 'react-i18next';
import {PlusOutlined} from '@ant-design/icons';
import React, {FunctionComponent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Form, Input, SubmitButton} from 'formik-antd';
import {Formik, FormikHelpers, FormikProps} from 'formik';
import {todoActionCreators, TodoState} from '../../stores/todoStore';
import {ValidationService} from '../../service/validationService';
import {ApplicationStates} from '../../stores/applicationStore';
import generateUUID from '../../helpers/uuidHelper';
import {TodoModel} from '../../models/todoModel';
import {CustomThunkDispatch} from '../../types';
import PrioritySelect from './PrioritySelect';

const TodoAddForm: FunctionComponent = () => {
    const dispatch = useDispatch<CustomThunkDispatch>();
    const todoState = useSelector<ApplicationStates, TodoState>(states => states.TodoState);
    const validationService = new ValidationService();
    const {t} = useTranslation();

    const fieldTitles = {
        jobTitle: t('todo-add-form-job-title-label', 'Göre Adı'),
        jobPriority: t('todo-add-form-job-pritiory-label', 'Görev Önceliği')
    }

    const handleChangeForm = (values: TodoModel, action: FormikHelpers<TodoModel>) => {
        action.setSubmitting(true);
        values.uuid = generateUUID();

        if (todoState.todoList.find(nq => nq.jobTitle == values.jobTitle)) {
            notification['error']({
                message: t('todo-add-form-dublicate-error-title', 'Hata!'),
                description: t('todo-add-form-dublicate-error-message', 'Eklemek istediğiniz görev daha önce listeye eklenmiştir. Lütfen farklı bir görev tanımı deneyiniz.'),
            });
            action.setSubmitting(false);
            return;
        }

        dispatch(todoActionCreators.addTodo(values));
        action.resetForm();
        action.setSubmitting(false);
    }

    const handleValidateForm = (values: TodoModel): Partial<TodoModel> => {
        const errors: Partial<TodoModel> = {};

        const validateJobTitle = validationService.checkString(values.jobTitle, fieldTitles.jobTitle, true, 5, 255);
        const validateJobPriority = validationService.checkString(values.jobPriority, fieldTitles.jobPriority, true);

        if (validateJobTitle)
            errors.jobTitle = validateJobTitle;

        if (validateJobPriority)
            errors.jobPriority = validateJobPriority;

        return errors;
    }

    const renderFormContent = (formik: FormikProps<TodoModel>) => {
        return (
            <Form layout="vertical" validateTrigger="onSubmit" className="c-todo-add__form">
                <Row gutter={[20, 20]}>
                    <Col xs={24} md={8} lg={14} xxl={16}>
                        <Form.Item name="jobTitle" label={fieldTitles.jobTitle} validateStatus={formik.errors.jobTitle && 'error'} help={formik.errors.jobTitle}>
                            <Input name="jobTitle" size="large" placeholder={fieldTitles.jobTitle}/>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8} lg={6} xxl={6}>
                        <Form.Item name="jobPriority" label={fieldTitles.jobPriority} validateStatus={formik.errors.jobPriority && 'error'} help={formik.errors.jobPriority}>
                            <PrioritySelect name="jobPriority" placeholder={t('todo-add-form-job-priority-chose', 'Seçiniz')}/>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8} lg={4} xxl={2}>
                        <Form.Item name="button" label=" " className="c-todo-add__form-button">
                            <SubmitButton type="primary" icon={<PlusOutlined/>} size="large" block={true}>{t('todo-add-form-submit-text', 'Oluştur')}</SubmitButton>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        )
    }

    return (
        <div className="c-todo-add">
            <div className="c-container-padding">
                <h1 className="c-todo-add__title">{t('todo-add-form-title', 'Yeni Görev Oluştur')}</h1>
                <Formik
                    initialValues={{uuid: ''}}
                    onSubmit={handleChangeForm}
                    validate={handleValidateForm}
                >
                    {renderFormContent}
                </Formik>
            </div>
        </div>
    )
}

export default TodoAddForm;
