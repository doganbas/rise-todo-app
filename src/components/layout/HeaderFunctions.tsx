import {Menu} from 'antd';
import React, {FunctionComponent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ExportOutlined, GlobalOutlined, ImportOutlined, SettingOutlined} from '@ant-design/icons';
import {applicationLanguageActionCreators, ApplicationLanguageState} from '../../stores/applicationLanguageStore';
import {ApplicationStates} from '../../stores/applicationStore';
import {LanguageModel} from '../../models/languageModel';
import {DevConsole} from '../../helpers/consoleHelper';
import {CustomThunkDispatch} from '../../types';

const HeaderFunctions: FunctionComponent = () => {
    const dispatch = useDispatch<CustomThunkDispatch>();
    const languageStore = useSelector<ApplicationStates, ApplicationLanguageState>(states => states.ApplicationLanguageState);

    const handleClickImportData = () => {
        DevConsole.log('Import data click');
        ///TODO: Import data from excel
    };

    const handleClickExportData = () => {
        DevConsole.log('Export data click');
        ///TODO: Export data to excel
    };

    const handleClickChangeLanguage = (item: LanguageModel) => {
        dispatch(applicationLanguageActionCreators.changeApplicationLanguage(item.globalName));
    }

    const renderMenuItems = (item: LanguageModel) => {
        return (
            <Menu.Item key={`language-${item.globalName}`} icon={<span>{item.globalName.substring(0, 1).toUpperCase()}</span>} className={languageStore.activeLanguage?.globalName == item.globalName ? 'ant-menu-item-selected' : ''} onClick={() => handleClickChangeLanguage(item)}>
                {item.name}
            </Menu.Item>
        )
    }

    return (
        <Menu mode="horizontal" selectable={false}>
            <Menu.SubMenu key="importexport" title="Veri Aktarımı" icon={<SettingOutlined/>}>
                <Menu.Item key="import-data" icon={<ImportOutlined/>} onClick={handleClickImportData}>
                    İçerik Aktar
                </Menu.Item>
                <Menu.Item key="export-data" icon={<ExportOutlined/>} onClick={handleClickExportData}>
                    Dışarı Aktar
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="language" title="Dil Seçimi" icon={<GlobalOutlined/>}>
                {
                    languageStore.languageList &&
                    languageStore.languageList.map(renderMenuItems)
                }
            </Menu.SubMenu>
        </Menu>
    )
}

export default HeaderFunctions;
