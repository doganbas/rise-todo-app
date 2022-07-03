import {useTranslation} from 'react-i18next';
import {Nullable} from '../types';

export class ValidationService {
    _translate = useTranslation();

    public checkString(value?: Nullable<string>, labelName = '', require = false, min = 0, max = 0): Nullable<string> {
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
}
