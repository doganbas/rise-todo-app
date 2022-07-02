import {Progress} from 'antd';
import React, {FunctionComponent} from 'react';
import {Nullable} from '../../types';

const CircleBox: FunctionComponent<{ title: Nullable<string>, content: Nullable<string>, color: Nullable<string>, iconType: Nullable<string>, percent: number }> = (props) => {
    return (
        <div className="c-circle-box" style={{backgroundColor: props.color ?? '#fff'}}>
            <div className="c-circle-box-content">
                <div className="c-circle-box__circle">
                    <Progress type="circle" percent={parseInt(props.percent?.toString() ?? '0')} width={140} format={e => `%${e}`} strokeColor="#fff"/>
                </div>
                <div className="c-circle-box__text">
                    <strong>{props.title}</strong>
                    <p>{props.content}</p>
                </div>
            </div>
        </div>
    );
};

export default CircleBox;