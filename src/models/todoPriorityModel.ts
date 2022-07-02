export interface TodoPriorityModel {
    uuid: string,
    name: TodoPriorityLocalizationModel[]
}

export interface TodoPriorityLocalizationModel {
    languageGlobalName: string,
    value: string
}
