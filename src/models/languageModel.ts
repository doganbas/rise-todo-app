import {DataType} from '../enums/dataType';
import {Nullable} from '../types';

export interface LanguageModel {
    name: string,
    smallName: string,
    globalName: string,
    flagPath: Nullable<string>,
    localization: LanguageLocalizationModel[],
}

export interface LanguageLocalizationModel {
    key: string,
    value: Nullable<string>,
    dataType: Nullable<DataType>
}
