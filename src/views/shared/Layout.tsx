import React from 'react';
import {FunctionComponent, PropsWithChildren} from 'react';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';
import {Helmet} from 'react-helmet';
import applicationConfig from '../../config/applicationConfig';
import {useTranslation} from 'react-i18next';

const Layout: FunctionComponent<PropsWithChildren> = (props) => {
    const {t} = useTranslation();

    return (
        <>
            <Helmet>
                <title>{t(applicationConfig.defaultMeta.title.name, applicationConfig.defaultMeta.title.defaultTranslation)}</title>
                <meta name="keywords" content={t(applicationConfig.defaultMeta.keyword.name, applicationConfig.defaultMeta.keyword.defaultTranslation)}/>
                <meta name="abstract" content={t(applicationConfig.defaultMeta.abstract.name, applicationConfig.defaultMeta.abstract.defaultTranslation)}/>
                <meta name="description" content={t(applicationConfig.defaultMeta.description.name, applicationConfig.defaultMeta.description.defaultTranslation)}/>
                {
                    applicationConfig.defaultMeta.otherMeta.map(item => <meta key={item.metaName} name={item.metaName} content={item.value}/>)
                }
            </Helmet>
            <div className="c-layout">
                <AppHeader/>
                <main className="c-layout__content">
                    {/*
                    ///TODO: Create Job Form
                    ///TODO: Job List
                */}
                </main>
                <AppFooter/>
            </div>
        </>
    )

}

export default Layout;
