import {Helmet} from 'react-helmet';
import {useTranslation} from 'react-i18next';
import React, {FunctionComponent} from 'react';
import applicationConfig from '../../config/applicationConfig';

const AppHelmet: FunctionComponent = () => {
    const {t} = useTranslation();
    return (
        <Helmet>
            <title>{t(applicationConfig.defaultMeta.title.name, applicationConfig.defaultMeta.title.defaultTranslation)}</title>
            <meta name="keywords" content={t(applicationConfig.defaultMeta.keyword.name, applicationConfig.defaultMeta.keyword.defaultTranslation)}/>
            <meta name="abstract" content={t(applicationConfig.defaultMeta.abstract.name, applicationConfig.defaultMeta.abstract.defaultTranslation)}/>
            <meta name="description" content={t(applicationConfig.defaultMeta.description.name, applicationConfig.defaultMeta.description.defaultTranslation)}/>
            {
                applicationConfig.defaultMeta.otherMeta.map(item => <meta key={item.metaName} name={item.metaName} content={item.value}/>)
            }
        </Helmet>
    )
}

export default AppHelmet;
