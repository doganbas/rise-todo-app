import i18next from 'i18next';
import {Button} from 'antd';
import {connect} from 'react-redux';
import React, {PureComponent} from 'react';
import {Player} from '@lottiefiles/react-lottie-player';
import * as ApplicationLanguageStore from '../../stores/applicationLanguageStore';
import warningAnimationData from '../../assets/animations/system-warning.json';
import networkAnimationData from '../../assets/animations/network-error.json';
import * as ApplicationErrorStore from '../../stores/applicationErrorStore';
import errorAnimationData from '../../assets/animations/system-error.json';
import {ApplicationStates} from '../../stores/applicationStore';
import applicationConfig from '../../config/applicationConfig';
import {ExceptionType} from '../../enums/exceptionType';
import {appLogo} from '../../assets/images';
import isDev from '../../helpers/devDetect';

type ApplicationErrorProviderPropsType = {
    applicationErrorState: ApplicationErrorStore.ApplicationErrorState,
    applicationLanguageState: ApplicationLanguageStore.ApplicationLanguageState,
    children?: React.ReactNode
} & typeof ApplicationErrorStore.applicationErrorActionCreators;

class ApplicationErrorProvider extends PureComponent<ApplicationErrorProviderPropsType> {

    async componentDidMount() {
        window.addEventListener('online', this.handleConnectionStatus);
        window.addEventListener('offline', this.handleConnectionStatus);
        if (!isDev())
            window.addEventListener('error', this.handleErrorCatchError);
        this.handleConnectionStatus();
    }

    componentWillUnmount() {
        window.removeEventListener('online', this.handleConnectionStatus);
        window.removeEventListener('offline', this.handleConnectionStatus);
        if (!isDev())
            window.removeEventListener('error', this.handleErrorCatchError);
    }

    handleConnectionStatus = () => {
        this.props.setConnectionStatus(navigator.onLine);
    };

    handleErrorCatchError = (errorEvent: ErrorEvent) => {
        if (errorEvent.filename.indexOf('vendor_bundle') < 0)
            this.props.generateApplicationError(errorEvent.error.message, ExceptionType.error, '500', true);
        setTimeout(() => {
            console.clear()
        }, 400);
    };

    handleClearErrors = () => {
        this.props.clearApplicationError(true);
    };

    handleReloadApplication = () => {
        localStorage.clear();
        this.props.clearApplicationError(true);
        window.location.reload();
    };

    render() {
        return (
            <>
                {
                    (this.props.applicationErrorState.exceptionType !== ExceptionType.fatal && this.props.applicationErrorState.exceptionType !== ExceptionType.error) && this.props.applicationErrorState.internetConnection &&
                    this.props.children
                }
                {
                    this.props.applicationErrorState.internetConnection && (this.props.applicationErrorState.exceptionType === ExceptionType.fatal || this.props.applicationErrorState.exceptionType === ExceptionType.error) &&
                    this.renderStandardError()
                }
                {
                    this.props.applicationErrorState.internetConnection && (this.props.applicationErrorState.exceptionType === ExceptionType.warning || this.props.applicationErrorState.exceptionType === ExceptionType.info) &&
                    this.renderWarningInfo()
                }
                {
                    this.renderNetworkError()
                }
            </>
        );
    }

    renderStandardError = () => {
        return (
            <div className="c-provider c-provider--error" data-testid="app-error">
                <div className="c-provider-container">
                    <div className="c-provider__image">
                        <a href={applicationConfig.brandInfo.brandLink} title={applicationConfig.brandInfo.brandName} className="c-provider__image-logo" target="_blank" rel="external noreferrer">
                            <img src={appLogo} alt={applicationConfig.brandInfo.brandName} width={60} height="auto"/>
                        </a>
                    </div>
                    <div className="c-provider__content">
                        <div className="c-provider__content-effect">
                            <Player src={errorAnimationData} autoplay={true} loop={true} style={{width: 'auto', height: '400px'}}/>
                        </div>
                        <div className="c-provider__content-message">
                            <strong className="c-provider__content-message-title-code">{this.props.applicationErrorState.errorCode}</strong>
                            <span className="c-provider__content-message-title">{(i18next.t('error-page-title', 'Bir Hata Olu??tu') ?? 'Bir Hata Olu??tu').toString()}</span>
                            {
                                this.props.applicationErrorState.errorMessage &&
                                <div className="c-provider__content-message-line">
                                    <strong>{(i18next.t('error-message-title', 'Hata Mesaj??') ?? 'Hata Mesaj??').toString()}</strong>
                                    <em/>
                                    <span>{this.props.applicationErrorState.errorMessage}</span>
                                </div>
                            }
                        </div>
                        <div className="c-provider__content-buttons">
                            {
                                this.props.applicationErrorState.exceptionType !== ExceptionType.fatal &&
                                <Button type="primary" size="large" block={true} onClick={this.handleClearErrors} className="c-provider__content-buttons-item">
                                    {(i18next.t('ignore-error', 'Hatay?? Yok Say') ?? 'Hatay?? Yok Say').toString()}
                                </Button>
                            }
                            <Button type="primary" danger={true} size="large" block={true} onClick={this.handleReloadApplication} className="c-provider__content-buttons-item c-provider__content-buttons--danger">
                                {(i18next.t('reload-application', 'Uygulamay?? Yeniden Y??kle') ?? 'Uygulamay?? Yeniden Y??kle').toString()}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderWarningInfo = () => {
        return (
            <div className="c-provider c-provider__warning" data-testid="app-warning">
                <div className="c-provider__content c-provider__warning-content">
                    <div className="c-provider__content-effect">
                        <Player src={warningAnimationData} autoplay={true} loop={true} style={{width: 'auto', height: '250px'}}/>
                    </div>
                    <div className="c-provider__content-message">
                        <strong className="c-provider__content-message-title-code">{this.props.applicationErrorState.errorCode}</strong>
                        <span className="c-provider__content-message-title">{(i18next.t('error-page-title', 'Bir Hata Olu??tu') ?? 'Bir Hata Olu??tu').toString()}</span>
                        {
                            this.props.applicationErrorState.errorMessage &&
                            <div className="c-provider__content-message-line">
                                <strong>{(i18next.t('error-message-title', 'Hata Mesaj??') ?? 'Hata Mesaj??').toString()}</strong>
                                <em/>
                                <span>{this.props.applicationErrorState.errorMessage}</span>
                            </div>
                        }
                    </div>
                    <div className="c-provider__content-buttons">
                        {
                            this.props.applicationErrorState.exceptionType !== ExceptionType.fatal &&
                            <Button type="primary" block={true} size="large" onClick={this.handleClearErrors} className="c-provider__content-buttons-item">
                                {i18next.t('ignore-error', 'Hatay?? Yok Say')?.toString()}
                            </Button>
                        }
                        <Button type="primary" danger={true} block={true} size="large" onClick={this.handleReloadApplication} className="c-provider__content-buttons-item c-provider__content-buttons--danger">
                            {i18next.t('reload-application', 'Uygulamay?? Yeniden Y??kle')?.toString()}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    renderNetworkError = () => {
        return (
            <div className={`c-provider c-provider__network ${!this.props.applicationErrorState.internetConnection ? 'c-provider__network--show' : ''}`} data-testid="app-error-connection">
                <div className="c-provider-container">
                    <div className="c-provider__image">
                        <a href={applicationConfig.brandInfo.brandLink} title={applicationConfig.brandInfo.brandName} className="c-provider__image-logo" target="_blank" rel="external noreferrer">
                            <img src={appLogo} alt={applicationConfig.brandInfo.brandName} width={60} height="auto"/>
                        </a>
                    </div>
                    <div className="c-provider__content">
                        <div className="c-provider__content-effect">
                            <Player src={networkAnimationData} autoplay={true} loop={true} style={{width: 'auto', height: '350px'}}/>
                        </div>
                        <div className="c-provider__network-message">
                            <strong className="c-provider c-provider__network-message-title">{(i18next.t('connection-error-title', '??nternet Ba??lant??s?? Bulunamad??') ?? '??nternet Ba??lant??s?? Bulunamad??').toString()}</strong>
                            <span className="c-provider c-provider__network-message-info">{(i18next.t('connection-error-content', '??nternet ba??lant??s?? bulunamad??. L??tfen ba??lant??n??z?? kontrol ediniz. Ba??lant?? sa??land?????? zaman kald??????n??z yerden devam edebilirsiniz.') ?? '??nternet ba??lant??s?? bulunamad??. L??tfen ba??lant??n??z?? kontrol ediniz. Ba??lant?? sa??land?????? zaman kald??????n??z yerden devam edebilirsiniz.').toString()}</span>
                        </div>
                        <div className="c-provider__content-buttons">
                            <Button type="primary" danger={true} block={true} size="large" onClick={this.handleReloadApplication} className="c-provider__content-buttons-item c-provider__content-buttons--danger">
                                {(i18next.t('reload-application', 'Uygulamay?? Yeniden Y??kle') ?? 'Uygulamay?? Yeniden Y??kle').toString()}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default connect((state: ApplicationStates) => ({applicationErrorState: state.ApplicationErrorState, applicationLanguageState: state.ApplicationLanguageState}), {...ApplicationErrorStore.applicationErrorActionCreators})(ApplicationErrorProvider as any);
