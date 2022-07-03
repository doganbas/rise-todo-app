import {Select} from 'formik-antd';
import {Select as AntdSelect} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import React, {FunctionComponent, useEffect} from 'react';
import {todoPriorityActionCreators, TodoPriorityState} from '../../stores/todoPriorityStore';
import {ApplicationLanguageState} from '../../stores/applicationLanguageStore';
import PriorityDataHelper from '../../helpers/priorityDataHelper';
import {TodoPriorityModel} from '../../models/todoPriorityModel';
import {ApplicationStates} from '../../stores/applicationStore';
import {CustomThunkDispatch} from '../../types';

const PrioritySelect: FunctionComponent<{ name: string, placeholder?: string, onChange?: (value: TodoPriorityModel | undefined) => void, defaultValue?: string | undefined, addAllOption?: boolean, allOptionTitle?: string, isNotFormik?: boolean }> = (props) => {
    const dispatch = useDispatch<CustomThunkDispatch>();
    const todoPriorityState = useSelector<ApplicationStates, TodoPriorityState>(states => states.TodoPriorityState);
    const languageState = useSelector<ApplicationStates, ApplicationLanguageState>(states => states.ApplicationLanguageState);

    useEffect(() => {
        dispatch(todoPriorityActionCreators.checkTodoPriorityData());
    }, []);

    const handleChangePriority = (value: string): void => {
        const selectedItem = todoPriorityState.priorityList.find(nq => nq.uuid == value);
        if (props.onChange && value != '-1')
            props.onChange(selectedItem);
        else if (props.onChange)
            props.onChange(undefined);
    }

    const RenderSelect = props.isNotFormik ? AntdSelect : Select;

    return (
        <RenderSelect name={props.name} onChange={handleChangePriority} defaultValue={props.defaultValue} loading={todoPriorityState.isFetching} size="large" style={{width: '100%'}} placeholder={props.placeholder}>
            {
                props.addAllOption &&
                <option key="all" value="-1">{props.allOptionTitle}</option>
            }
            {
                !todoPriorityState.isFetching &&
                todoPriorityState.priorityList.map(item => <Select.Option key={item.uuid} value={item.uuid}>{PriorityDataHelper.translatePriorityName(item, languageState.activeLanguage?.globalName)}</Select.Option>)
            }
        </RenderSelect>
    )
}

export default PrioritySelect;
