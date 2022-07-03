import moment from 'moment';
import {Nullable} from '../types';

export default class DateHelper {
    static timeDiff(startTime: Nullable<Date>, endTime: Nullable<Date>, diffType: 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year' = 'hour'): number {
        const startTimeLocal = moment(startTime ?? undefined);
        const endTimeLocal = moment(endTime ?? undefined);

        return endTimeLocal.diff(startTimeLocal, diffType);
    }

    static toString(date: Date, format = 'DD MMMM yyyy - dddd'): string {
        return moment(date).format(format);
    }
}