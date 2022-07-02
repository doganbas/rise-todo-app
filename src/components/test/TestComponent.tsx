import React from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {applicationLanguageActionCreators} from '../../stores/applicationLanguageStore';
import {applicationLoaderActionCreators} from '../../stores/applicationLoaderStore';
import {applicationErrorActionCreators} from '../../stores/applicationErrorStore';
import {ExceptionType} from '../../enums/exceptionType';
import {LoaderType} from '../../enums/loaderType';
import {CustomThunkDispatch} from '../../types';

const TestComponent = () => {
    const dispatch = useDispatch<CustomThunkDispatch>();
    const {t} = useTranslation();

    function handleSetFatalError() {
        dispatch(applicationErrorActionCreators.generateApplicationError('Örnek bir hata içeriği genel olarak içerik tam burada olacaktır.', ExceptionType.fatal, '500', true));
    }

    function handleSetError() {
        dispatch(applicationErrorActionCreators.generateApplicationError('Örnek bir geçiştirilebilir hata içeriği genel olarak içerik tam burada olacaktır.', ExceptionType.error, '500', true));
    }

    function handleSetWarning() {
        dispatch(applicationErrorActionCreators.generateApplicationError('Test', ExceptionType.warning, '403', true));
    }

    function handleGenerateError() {
        throw new Error('I crashed!');
    }

    function handleSetLoader(type: LoaderType, loaderId: string) {
        dispatch(applicationLoaderActionCreators.showGlobalLoader('Test Yüklemesi', loaderId, type));
    }

    function handleClearLoader() {
        dispatch(applicationLoaderActionCreators.hideAllLoader());
    }

    function handleChangeLanguage(languageName: string) {
        dispatch(applicationLanguageActionCreators.changeApplicationLanguage(languageName));
    }

    return (
        <div>
            <span>Hata Denemeleri</span>
            <input type="button" onClick={() => handleSetFatalError()} value="Create Fatal Error"/>
            <input type="button" onClick={() => handleSetError()} value="Create Error"/>
            <input type="button" onClick={() => handleSetWarning()} value="Create Warning"/>
            <input type="button" onClick={() => handleGenerateError()} value="Generate Error"/>
            <hr/>
            <span>Yükleme Denemeleri</span>
            <input type="button" onClick={() => handleSetLoader(LoaderType.inclusive, 'xx1')} value="Create Inclusive Loader"/>
            <input type="button" onClick={() => handleSetLoader(LoaderType.overlay, 'xx2')} value="Create Overlay Loader"/>
            <input type="button" onClick={() => handleSetLoader(LoaderType.custom, 'xx4')} value="Create Custom Loader"/>
            <input type="button" onClick={() => handleClearLoader()} value="Yüklemeleri Temizle"/>
            <hr/>
            <span>Dil Denemeleri</span>
            <input type="button" onClick={() => handleChangeLanguage('tr')} value="Türkçe Göster"/>
            <input type="button" onClick={() => handleChangeLanguage('en')} value="İngilizce Göster"/>
            <span>{t('test-value', 'Test İçeriği')}</span>
        </div>
    );
};

export default TestComponent;
