import {useTranslation} from 'react-i18next';
import React, {FunctionComponent} from 'react';
import applicationConfig from '../../config/applicationConfig';

const AppFooter: FunctionComponent = () => {
    const {t} = useTranslation();

    return (
        <footer className="c-layout__footer">
            <div className="c-container-padding">
                <div className="c-layout__footer-content">
                    <a href={applicationConfig.brandInfo.brandLink} className="c-layout__footer-link" title={t('footer-repository-link-title', 'repository')} target="_blank" rel="external noreferrer">
                        <i className="fa-brands fa-git"></i>
                        <span>{t('footer-repository-link-text', 'repository')}</span>
                    </a>
                    <p className="c-layout__footer-copy">
                        &copy;&nbsp;{new Date().getFullYear()}&nbsp;{applicationConfig.brandInfo.companyName}
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default AppFooter;
