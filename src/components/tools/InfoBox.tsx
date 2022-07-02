import React, {FunctionComponent} from 'react';
import {Nullable} from '../../types';

const InfoBox: FunctionComponent<{ type: 'success' | 'warning' | 'error' | 'info' | 'custom', title: Nullable<string>, content: Nullable<string>, color?: Nullable<string>, iconType?: Nullable<string>, routeLink?: Nullable<string> }> = (props) => {
    let color = props.color;
    let iconType = props.iconType;

    switch (props.type) {
        case 'success':
            color = '#3ba328';
            iconType = 'fas fa-check';
            break;
        case 'warning':
            color = '#ffb818';
            iconType = 'fas fa-exclamation-triangle';
            break;
        case 'error':
            color = '#d12b2b';
            iconType = 'fas fa-times';
            break;
        case 'info':
            color = '#191f33';
            iconType = 'fas fa-exclamation';
            break;
        case 'custom':
            color = color ?? '#191f33';
            iconType = iconType ?? 'fas fa-exclamation';
            break;
    }

    return (
        <div className="c-info-box">
            <div className="c-info-box__icon">
                <i className={iconType} style={{color: color}}/>
            </div>
            <div className="c-info-box__content">
                <strong style={{color: color}}>{props.title}</strong>
                <p>{props.content}</p>
            </div>
        </div>
    );
};

export default InfoBox;