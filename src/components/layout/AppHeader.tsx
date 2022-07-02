import React, {FunctionComponent} from 'react';
import applicationConfig from '../../config/applicationConfig';
import HeaderFunctions from './HeaderFunctions';
import {appLogo} from '../../assets/images';

const AppHeader: FunctionComponent = () => (
    <header className="c-layout__header">
        <div className="c-container-padding">
            <div className="c-layout__header-content">
                <a href={applicationConfig.brandInfo.brandLink} className="c-layout__header-logo" title={applicationConfig.brandInfo.brandName} target="_blank" rel="external noreferrer">
                    <img src={appLogo} alt={applicationConfig.brandInfo.brandName} width={60} height="auto"/>
                </a>
                <div className="c-layout__header-functions">
                    <HeaderFunctions/>
                </div>
            </div>
        </div>
    </header>
)

export default AppHeader;
