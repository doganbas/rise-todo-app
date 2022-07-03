import React, {FunctionComponent, PropsWithChildren} from 'react';
import ApplicationErrorProvider from './ApplicationErrorProvider';
import ApplicationLanguageProvider from './ApplicationLanguageProvider';
import ApplicationLoaderProvider from './ApplicationLoaderProvider';

const ApplicationProvider: FunctionComponent<PropsWithChildren> = (props) => {
    return (
        <ApplicationErrorProvider>
            <ApplicationLoaderProvider>
                <ApplicationLanguageProvider>
                    {props.children}
                </ApplicationLanguageProvider>
            </ApplicationLoaderProvider>
        </ApplicationErrorProvider>
    )
}

export default ApplicationProvider;
