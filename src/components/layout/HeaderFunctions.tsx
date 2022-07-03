import exceljs from 'exceljs';
import {useTranslation} from 'react-i18next';
import React, {FunctionComponent} from 'react';
import {Button, Dropdown, Menu, Space} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {DownOutlined, ExportOutlined, GlobalOutlined, SettingOutlined} from '@ant-design/icons';
import {applicationLanguageActionCreators, ApplicationLanguageState} from '../../stores/applicationLanguageStore';
import PriorityDataHelper from '../../helpers/priorityDataHelper';
import {TodoPriorityState} from '../../stores/todoPriorityStore';
import {ApplicationStates} from '../../stores/applicationStore';
import {LanguageModel} from '../../models/languageModel';
import DateHelper from '../../helpers/dateHelper';
import {TodoState} from '../../stores/todoStore';
import {CustomThunkDispatch} from '../../types';

const HeaderFunctions: FunctionComponent = () => {
    const dispatch = useDispatch<CustomThunkDispatch>();
    const todoState = useSelector<ApplicationStates, TodoState>(states => states.TodoState);
    const todoPriorityState = useSelector<ApplicationStates, TodoPriorityState>(states => states.TodoPriorityState);
    const languageState = useSelector<ApplicationStates, ApplicationLanguageState>(states => states.ApplicationLanguageState);
    const {t} = useTranslation();

    const handleClickExportData = () => {
        const todoPriorityList = todoPriorityState.priorityList;
        const workbook = new exceljs.Workbook();
        const workSheet = workbook.addWorksheet(t('export-excel-worksheet-name', 'Görev Listesi'));
        const titleBgStyle: exceljs.Fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FF000000'
            }
        };
        const titleFont: Partial<exceljs.Font> = {
            color: {
                argb: 'FFFFFFFF'
            },
            bold: true
        }
        workSheet.getCell(1, 1).value = 'Görev Adı';
        workSheet.getCell(1, 1).style.fill = titleBgStyle;
        workSheet.getCell(1, 1).font = titleFont;
        workSheet.getCell(1, 2).value = 'Öncelik';
        workSheet.getCell(1, 2).style.fill = titleBgStyle;
        workSheet.getCell(1, 2).font = titleFont;
        workSheet.getCell(1, 3).value = 'Ekleme Tarihi';
        workSheet.getCell(1, 3).style.fill = titleBgStyle;
        workSheet.getCell(1, 3).font = titleFont;
        workSheet.getColumn(1).width = 90;
        workSheet.getColumn(2).width = 30;
        workSheet.getColumn(3).width = 30;

        todoState.todoList.forEach((item, index) => {
            const itemPriority = todoPriorityList.find(nq => nq.uuid == item.jobPriority) ?? todoPriorityList.sort((a, b) => a.order - b.order)[0];
            workSheet.getCell(index + 2, 1).value = item.jobTitle;
            workSheet.getCell(index + 2, 2).value = PriorityDataHelper.translatePriorityName(itemPriority, languageState.activeLanguage?.globalName);
            workSheet.getCell(index + 2, 2).style.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: `FF${itemPriority.color.replace('#', '').toUpperCase()}`
                }
            };
            workSheet.getCell(index + 2, 3).value = DateHelper.toString(item.addTime ?? new Date());
        });

        workbook.xlsx.writeBuffer().then(function (xls64) {
            const a = document.createElement('a');
            const data = new Blob([xls64], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            const url = URL.createObjectURL(data);
            a.href = url;
            a.download = `${t('export-excel-file-name', 'gorev-listesi')}.xlsx`;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }).catch(function (error) {
            console.log(error.message);
        });
    };

    const handleClickChangeLanguage = (item: LanguageModel) => {
        dispatch(applicationLanguageActionCreators.changeApplicationLanguage(item.globalName));
    }

    const renderMenuItems = (item: LanguageModel) => {
        return (
            <Menu.Item key={`language-${item.globalName}`} className={languageState.activeLanguage?.globalName == item.globalName ? 'ant-menu-item-selected' : ''} onClick={() => handleClickChangeLanguage(item)}>
                {item.name}
            </Menu.Item>
        )
    }

    const renderDataMenu = () => {
        return (
            <Menu key="import-export-data" title={t('data-transfer', 'Veri Aktarımı')}>
                <Menu.Item key="export-data" icon={<ExportOutlined/>} onClick={handleClickExportData}>
                    {t('export-data', 'Dışarı Aktar')}
                </Menu.Item>
            </Menu>
        )
    }

    const renderLanguageMenu = () => {
        return (
            <Menu key="language" title={t('select-app-language', 'Dil Seçimi')}>
                {
                    languageState.languageList &&
                    languageState.languageList.map(renderMenuItems)
                }
            </Menu>
        )
    }

    return (
        <>
            <Dropdown overlay={renderDataMenu}>
                <Button className="c-layout__header-functions-item" size="middle">
                    <Space>
                        <SettingOutlined/>
                        {t('data-transfer', 'Veri Aktarımı')}
                    </Space>
                </Button>
            </Dropdown>
            <Dropdown overlay={renderLanguageMenu}>
                <Button className="c-layout__header-functions-item" size="middle">
                    <Space>
                        <GlobalOutlined/>
                        {t('select-app-language', 'Dil Seçimi')}
                        <DownOutlined/>
                    </Space>
                </Button>
            </Dropdown>
        </>
    )
}

export default HeaderFunctions;
