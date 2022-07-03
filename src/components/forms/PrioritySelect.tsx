import {Select} from 'formik-antd'
import {useDispatch, useSelector} from 'react-redux';
import React, {FunctionComponent, useEffect} from 'react';
import {todoPriorityActionCreators, TodoPriorityState} from '../../stores/todoPriorityStore';
import {ApplicationLanguageState} from '../../stores/applicationLanguageStore';
import {TodoPriorityModel} from '../../models/todoPriorityModel';
import {ApplicationStates} from '../../stores/applicationStore';
import applicationConfig from '../../config/applicationConfig';
import {CustomThunkDispatch} from '../../types';

const PrioritySelect: FunctionComponent<{ name: string, placeholder?: string, onChange?: (value: TodoPriorityModel | undefined) => void, defaultValue?: TodoPriorityModel | undefined }> = (props) => {
    const dispatch = useDispatch<CustomThunkDispatch>();
    const todoPriorityState = useSelector<ApplicationStates, TodoPriorityState>(states => states.TodoPriorityState);
    const languageState = useSelector<ApplicationStates, ApplicationLanguageState>(states => states.ApplicationLanguageState);

    useEffect(() => {
        dispatch(todoPriorityActionCreators.checkTodoPriorityData());
    }, []);

    const translatePriorityName = (item: TodoPriorityModel): string => {
        const activeLanguage = languageState.activeLanguage?.globalName ?? applicationConfig.languageInfo.activeLanguage;
        return item.name.find(nq => nq.languageGlobalName == activeLanguage)?.value ?? '-';
    }

    const handleChangePriority = (value: string): void => {
        const selectedItem = todoPriorityState.priorityList.find(nq => nq.uuid == value);
        if (props.onChange)
            props.onChange(selectedItem);
    }

    return (
        <Select name={props.name} onChange={handleChangePriority} defaultValue={props.defaultValue} loading={todoPriorityState.isFetching} size="large" style={{width: '100%'}} placeholder={props.placeholder}>
            {
                !todoPriorityState.isFetching &&
                todoPriorityState.priorityList.map(item => <Select.Option key={item.uuid} value={item.uuid}>{translatePriorityName(item)}</Select.Option>)
            }
        </Select>
    )
}

export default PrioritySelect;
