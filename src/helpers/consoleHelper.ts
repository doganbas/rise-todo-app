import {CustomAny} from '../types';
import isDev from './devDetect';

export class Console {
    public static log(message?: CustomAny, ...optionalParams: CustomAny[]): void {
        console.log('%cLog', 'background-color: #7c2231; color: #fff; padding: 3px 8px;', ':', message, ...optionalParams);
    }

    public static warn(message?: CustomAny, ...optionalParams: CustomAny[]): void {
        console.warn('%cWarning', 'background-color: #7c2231; color: #fff; padding: 3px 8px;', ':', message, ...optionalParams);
    }

    public static error(message?: CustomAny, ...optionalParams: CustomAny[]): void {
        console.error('%cError', 'background-color: #7c2231; color: #fff; padding: 3px 8px;', ':', message, ...optionalParams);
    }
}

export class DevConsole {
    public static log(message?: CustomAny, ...optionalParams: CustomAny[]): void {
        if (isDev())
            console.log('%cDev Log', 'background-color: #7c2231; color: #fff; padding: 3px 8px;', ':', message, ...optionalParams);
    }

    public static warn(message?: CustomAny, ...optionalParams: CustomAny[]): void {
        if (isDev())
            console.warn('%cDev Warning', 'background-color: #7c2231; color: #fff; padding: 3px 8px;', ':', message, ...optionalParams);
    }

    public static error(message?: CustomAny, ...optionalParams: CustomAny[]): void {
        if (isDev())
            console.error('%cDev Error', 'background-color: #7c2231; color: #fff; padding: 3px 8px;', ':', message, ...optionalParams);
    }
}