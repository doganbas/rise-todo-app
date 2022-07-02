export interface TodoPriorityModel {
    uuid: string,
    name: TodoPriorityLocalizationModel[],
    order: number,
    color: string
}

export interface TodoPriorityLocalizationModel {
    languageGlobalName: string,
    value: string
}
