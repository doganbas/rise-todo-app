import {LanguageLocalizationModel} from '../models/languageModel';
import {DataType} from '../enums/dataType';

const localizationsTr = [
    {key: 'application-loader-title', value: 'Bekleyen yükleme(ler) mevcut', dataType: DataType.string}
] as LanguageLocalizationModel[];

const localizationsEn = [
    {key: 'application-loader-title', value: 'Pending download(s) available', dataType: DataType.string}
] as LanguageLocalizationModel[];

export {localizationsTr, localizationsEn};