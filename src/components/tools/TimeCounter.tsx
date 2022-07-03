import React, {FunctionComponent, useEffect, useState} from 'react';
import DateHelper from '../../helpers/dateHelper';

const TimeCounter: FunctionComponent<{ startDate: Date, textStyle: string }> = ({startDate, textStyle}) => {
    const [timeLeft, setTimeLeft] = useState<number>(DateHelper.timeDiff(startDate, null, 'second'));

    useEffect(() => {
        const activeInterval = setInterval(() => {
            setTimeLeft(DateHelper.timeDiff(startDate, null, 'second'));
        }, 1000);

        return (() => {
            clearInterval(activeInterval)
        })
    }, []);

    return (
        <span className={textStyle}>{timeLeft}s</span>
    );

};

export default TimeCounter;
