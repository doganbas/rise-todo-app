import {useTranslation} from 'react-i18next';
import {Nullable} from '../types';

export class ValidationService {
    _translate = useTranslation();

    public checkString(value: Nullable<string>, labelName = '', require = false, min = 0, max = 0): Nullable<string> {
        if (require && !value)
            return this._translate.t('validation-required', '\'{{name}}\' isimli alan boş bırakılamaz.', {name: labelName});

        if (!require && !value)
            return null;

        if (require && value && min && value.length < min && !max)
            return this._translate.t('validation-string-min', '\'{{name}}\' isimli alan değeri en az {{min}} karakterden oluşmalıdır.', {name: labelName, min: min});

        if (value && max && value.length > max && !min)
            return this._translate.t('validation-string-max', '\'{{name}}\' isimli alan değeri en fazla {{max}} karakterden oluşmalıdır.', {name: labelName, max: max});

        if (value && min && max && (value.length < min || value.length > max))
            return this._translate.t('validation-string-length', '\'{{name}}\' isimli alan değeri en en {{min}} en fazla {{max}} karakterden oluşmalıdır.', {name: labelName, min: min, max: max});

        return null;
    }

    public checkNumeric(value: Nullable<string>, labelName = '', require = false, min = 0, max = 0): Nullable<string> {
        if (require && (!value || value == '0'))
            return this._translate.t('validation-required', '\'{{name}}\' isimli alan boş bırakılamaz.', {name: labelName});

        if (!require && !value)
            return null;

        const parsedValue = parseFloat(value ?? '');
        if (isNaN(parsedValue))
            return this._translate.t('validation-numeric', '\'{{name}}\' isimli alan sayısal bir ifadeden oluşmalıdır.', {name: labelName});

        if (require && value && min && parsedValue < min && !max)
            return this._translate.t('validation-numeric-min', '\'{{name}}\' isimli alan değeri en düşük {{min}} olmalıdır.', {name: labelName, min: min});

        if (value && max && parsedValue > max && !min)
            return this._translate.t('validation-numeric-max', '\'{{name}}\' isimli alan değeri en yüksek {{max}} olmalıdır.', {name: labelName, max: max});

        if (value && min && max && (parsedValue < min || parsedValue > max))
            return this._translate.t('validation-numeric-length', '\'{{name}}\' isimli alan değeri en düşük {{min}} en yüksek {{max}} olmalıdır.', {name: labelName, min: min, max: max});

        return null;
    }

    public checkMail(value: Nullable<string>, labelName: string, require = false): Nullable<string> {
        if (require && !value)
            return this._translate.t('validation-required', '\'{{name}}\' isimli alan boş bırakılamaz.', {name: labelName});

        if (!require && !value)
            return null;

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value ?? ''))
            return this._translate.t('validation-mail-address', '\'{{name}}\' isimli alan mail adresi formatında olmalıdır. Örn; info@doganbas.com', {name: labelName});

        return null;
    }
}
