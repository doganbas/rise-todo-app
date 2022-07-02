import {LoaderType} from '../enums/loaderType';
import {Nullable} from '../types';

export interface ApplicationLoaderModel {
    loaderId: string,
    visibleText: Nullable<string>,
    startTime: Date,
    loaderType: LoaderType
}