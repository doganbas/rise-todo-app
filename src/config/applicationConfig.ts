import {ApplicationTranslationModel} from '../models/applicationTranslationModel';
import {localizationsEn, localizationsTr} from './localizationConfiguration';
import {ApplicationMetaListModel} from '../models/applicationMetaModel';
import {LanguageModel} from '../models/languageModel';

const applicationConfig = {
    apiInfo: {
        apiUrl: '',
        apiDevUrl: '',
        maxFetchSecond: 200
    },
    serviceUrls: {
        getPriorityList: ''
    },
    settings: {
        loadTimeOut: 15
    },
    languageInfo: {
        activeLanguage: 'tr',
        languageList: [
            {
                name: 'Türkçe',
                smallName: 'tr',
                globalName: 'tr',
                flagPath: '',
                localization: localizationsTr
            },
            {
                name: 'English',
                smallName: 'en',
                globalName: 'en',
                flagPath: '',
                localization: localizationsEn
            }
        ] as LanguageModel[]
    },
    defaultMeta: {
        title: {name: 'meta-default-title', defaultTranslation: 'Serkan DOĞANBAŞ | Rise TODO App'} as ApplicationTranslationModel,
        keyword: {name: 'meta-default-keyword', defaultTranslation: 'todo, todo app, serkan doğanbaş'} as ApplicationTranslationModel,
        description: {name: 'meta-default-description', defaultTranslation: 'Rise Frontend Assessment Project.'} as ApplicationTranslationModel,
        abstract: {name: 'meta-default-abstract', defaultTranslation: 'Rise Frontend Assessment Project.'} as ApplicationTranslationModel,
        otherMeta: [
            {metaName: 'viewport', value: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no'},
            {metaName: 'theme-color', value: '#000000'}
        ] as ApplicationMetaListModel[]
    },
    brandInfo: {
        companyName: 'Serkan DOĞANBAŞ',
        brandName: 'Rise TODO App',
        companyLink: '//github.com/doganbas',
        brandLink: '//github.com/doganbas/rise-todo-app'
    },
}

export default applicationConfig;