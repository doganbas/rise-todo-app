import {ApplicationTranslationModel} from './applicationTranslationModel';
import {LoaderType} from '../enums/loaderType';
import {Nullable} from '../types';

export interface ApplicationLoaderModel {
    loaderId: string,
    visibleText: Nullable<ApplicationTranslationModel>,
    startTime: Date,
    loaderType: LoaderType
}
