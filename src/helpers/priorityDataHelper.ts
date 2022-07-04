import {TodoPriorityModel} from '../models/todoPriorityModel';
import applicationConfig from '../config/applicationConfig';

export default class PriorityDataHelper {
    static translatePriorityName(item: TodoPriorityModel, activeLanguage?: string): string {
        activeLanguage = activeLanguage ?? applicationConfig.languageInfo.activeLanguage;
        return item.name.find(nq => nq.languageGlobalName === activeLanguage)?.value ?? '-';
    }
}
