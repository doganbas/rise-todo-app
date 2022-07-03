import {ApplicationTranslationModel} from './applicationTranslationModel';

export interface ApplicationMetaModel {
    pageTitle?: ApplicationTranslationModel[],
    pageKeywords?: string,
    pageDescription?: ApplicationTranslationModel,
    pageAbstract?: ApplicationTranslationModel,
    metaList?: ApplicationMetaListModel[],
    breadList?: ApplicationBreadMenuModel[]
}

export interface ApplicationMetaListModel {
    metaName: string,
    value: string
}

export interface ApplicationBreadMenuModel {
    title: ApplicationTranslationModel,
    menuName?: string,
    externalLink?: string,
    params?: string[]
}