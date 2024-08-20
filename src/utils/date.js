import moment from 'moment';
import _ from 'lodash';

export function getDatesList(st, et) {
    let dateArray = [];
    let indexMap = {};
    let currentDate = moment(st);
    let stopDate = moment(et);
    let index = 0;
    while (currentDate <= stopDate) {
        let fd = moment(currentDate).format('YYYY-MM-DD');
        dateArray.push(fd);
        indexMap[fd] = index;
        currentDate = moment(currentDate).add(1, 'days');
        index++;
    }
    return [dateArray, indexMap];
}

export function dateFormat(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1 >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)}-${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()}`;
}

export function datetimeFormat(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1 >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)}-${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()} ${date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()}:${date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()}`;
}

export function timeFormat(date) {
    return `${date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()}:${date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()}`;
}

export function datetimeFormatSeconds(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1 >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)}-${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()} ${date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()}:00`;
}

export function datetimeFormatMinute(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1 >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)}-${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()} ${date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()}`;
}

export function dateFormatOfMinute(date) {
    return `${date.getMonth() + 1 >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)}-${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()} ${date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()}`;
}

export function datetimeFormatMinuteMobile(date) {
    return `${date.getFullYear()}/${date.getMonth() + 1 >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)}/${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()} ${date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()}`;
}

export function datetimeFormatSecondsMobile(date) {
    return `${date.getFullYear()}/${date.getMonth() + 1 >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)}/${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()} ${date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()}:00`;
}

/**
 * 计算时间差。 单位：分钟
 * @param date1
 * @param date2
 * @returns {number | *}
 */
export function duration(date1, date2) {
    let dd1 = new Date(date1);
    let dd2 = new Date(date2);
    let d1 = dd1.getTime();
    let d2 = dd2.getTime();
    return _.round(((d1 - d2) / 1000) / 60) + 1;
}

/**
 * 持续时间格式化 （秒级时间戳）
 * @param duration
 */
export function durationFormat(duration) {

    if (duration < 0) {
        duration = -duration;
    }
    const time = {
        '天': Math.floor(duration / (24 * 60 * 60)),
        '小时': Math.floor(duration / (60 * 60)) % 24,
        '分钟': Math.floor(duration / 60) % 60,
        '秒': Math.floor(duration) % 60,
    };
    return Object.entries(time).filter(val => val[1] != 0).map(([k, v]) => `${v}${k}`).join(' ');
}