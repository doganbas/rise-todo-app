import fetchApi from 'axios';
import applicationConfig from './applicationConfig';
import isDev from '../helpers/devDetect';

export const fetchApiConfig = {
    withCredentials: false,
    timeout: 30000,
    baseURL: createBaseUrl(),
    headers: {
        common: {
            'accept-language': applicationConfig.languageInfo.activeLanguage
        },
    }
}

export function setFetchApiDefault(): void {
    fetchApi.defaults.baseURL = fetchApiConfig.baseURL;
    fetchApi.defaults.timeout = fetchApiConfig.timeout;
    fetchApi.defaults.withCredentials = fetchApiConfig.withCredentials;
    fetchApi.defaults.headers.common = fetchApiConfig.headers.common;
}

export function createBaseUrl(): string {
    let apiRootUrl = isDev() ? applicationConfig.apiInfo.apiDevUrl : applicationConfig.apiInfo.apiUrl;
    if (apiRootUrl.substring(apiRootUrl.length - 1) === '/')
        apiRootUrl = apiRootUrl.substring(0, apiRootUrl.length - 1);

    return apiRootUrl;
}