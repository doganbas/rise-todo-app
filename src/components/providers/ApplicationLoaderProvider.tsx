import i18next from 'i18next';
import {useDispatch, useSelector} from 'react-redux';
import {Player} from '@lottiefiles/react-lottie-player';
import React, {FunctionComponent, PropsWithChildren, useEffect} from 'react';
import {applicationLoaderActionCreators, ApplicationLoaderState} from '../../stores/applicationLoaderStore';
import waitingAnimation from '../../assets/animations/waiting-animation.json';
import {ApplicationStates} from '../../stores/applicationStore';
import applicationConfig from '../../config/applicationConfig';
import {CustomThunkDispatch, Nullable} from '../../types';
import {appLoading, appLogo} from '../../assets/images';
import {LoaderType} from '../../enums/loaderType';
import DateHelper from '../../helpers/dateHelper';
import TimeCounter from '../tools/TimeCounter';

let loaderInterval: Nullable<NodeJS.Timeout> = null;
const ApplicationLoaderProvider: FunctionComponent<PropsWithChildren> = (props) => {
    const dispatch = useDispatch<CustomThunkDispatch>();
    const loaderState = useSelector<ApplicationStates, ApplicationLoaderState>(state => state.ApplicationLoaderState);

    useEffect(() => {
        const overLoader = loaderState?.loaderItems.filter(nq => nq.loaderType == LoaderType.inclusive) ?? [];
        if (overLoader.length > 0)
            document.body.classList.add('c-loader__body');
        else
            document.body.classList.remove('c-loader__body');

        if (loaderInterval)
            clearInterval(loaderInterval);

        if (loaderState && loaderState.loaderItems.length > 0) {
            loaderInterval = setInterval(() => checkProviderTime(loaderState), 1000);
            checkProviderTime(loaderState);
        }
    }, [loaderState]);

    useEffect(() => {
        return () => {
            document.body.classList.remove('c-loader__body');
        }
    })

    const checkProviderTime = (inLoaderState: ApplicationLoaderState) => {
        if (inLoaderState && inLoaderState.loaderItems.length) {
            const removeList = inLoaderState.loaderItems.map((item) => {
                const elapsedNow = DateHelper.timeDiff(item.startTime, null, 'second');
                const maxElapse = applicationConfig.settings.loadTimeOut;

                if (maxElapse <= elapsedNow)
                    return item.loaderId;
            });
            removeList.map(item => item && dispatch(applicationLoaderActionCreators.hideGlobalLoader(item)));
        }
    };

    const renderFullLoader = () => {
        return (
            <div className="c-provider c-provider__loader">
                <div className="c-provider-container">
                    <div className="c-provider__image">
                        <a href={applicationConfig.brandInfo.brandLink} title={applicationConfig.brandInfo.brandName} className="c-provider__image-logo" target="_blank" rel="external noreferrer">
                            <img src={appLogo} alt={applicationConfig.brandInfo.brandName} width={60} height="auto"/>
                        </a>
                    </div>
                    <div className="c-provider__loader-content c-provider__content">
                        <strong className="c-provider__loader-content-title">{(i18next.t('application-loader-title', 'Bekleyen Yükleme(ler) mevcut') ?? 'Bekleyen Yükleme(ler) mevcut').toString()}</strong>
                        <div className="c-provider__loader-list">
                            {
                                loaderState.loaderItems.map(item => (
                                    <div className="c-provider__loader-list-item" key={item.loaderId}>
                                        <div className="c-provider__loader-list-item-effect">
                                            <img src={appLoading} alt="App Loading"/>
                                        </div>
                                        <span className="c-provider__loader-list-item-text">{item.visibleText ?? (i18next.t('undefined-loader-text', 'Bilinmeyen yükleme...' ?? 'Bilinmeyen yükleme...')).toString()}</span>
                                        <TimeCounter startDate={item.startTime} textStyle="c-provider__loader-list-item-counter"/>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    const renderOverboxLoader = () => {
        return (
            <div className="c-provider c-provider__loading">
                <div className="c-provider__content c-provider__loading-container">
                    <div className="c-provider__content-effect">
                        <Player src={waitingAnimation} autoplay={true} loop={true} style={{width: 'auto', height: '250px'}}/>
                    </div>
                    <div className="c-provider__loading-content">
                        <strong className="c-provider__loading-content-title">{(i18next.t('application-loader-title', 'Bekleyen Yükleme(ler) mevcut') ?? 'Bekleyen Yükleme(ler) mevcut').toString()}</strong>
                        <div className="c-provider__loader-list">
                            {
                                loaderState.loaderItems.map(item => (
                                    <div className="c-provider__loader-list-item" key={item.loaderId}>
                                        <div className="c-provider__loader-list-item-effect">
                                            <img src={appLoading} alt="App Loading"/>
                                        </div>
                                        <span className="c-provider__loader-list-item-text">{item.visibleText ?? (i18next.t('undefined-loader-text', 'Bilinmeyen yükleme...' ?? 'Bilinmeyen yükleme...')).toString()}</span>
                                        <TimeCounter startDate={item.startTime} textStyle="c-provider__loader-list-item-counter"/>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <>
            {
                props.children
            }
            {
                loaderState.isVisible && loaderState.loaderItems.filter(nq => nq.loaderType == LoaderType.inclusive).length > 0 &&
                renderFullLoader()
            }
            {
                loaderState.isVisible && loaderState.loaderItems.filter(nq => nq.loaderType == LoaderType.overlay).length > 0 &&
                renderOverboxLoader()
            }
        </>
    );
};

export default ApplicationLoaderProvider;
