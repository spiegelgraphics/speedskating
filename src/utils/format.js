import { timeParse, timeFormat } from 'd3';

export const NA_STRING = '—';
export const CURRENCY_FORMAT = '$,.0f';
export const PERCENT_FORMAT = '.1%';
export const INTEGER_FORMAT = ',.0f';
export const FLOAT_FORMAT = ',.1f';

const timeFormatRace = () => (value) => {
    const minuteValue = value / 1000 / 60;
    const minutes = Math.floor(minuteValue);
    const seconds = ((minuteValue % 1) * 60).toFixed(2);
    const secondsStr = `${seconds}`.replace('.', ',')
    return `${minutes}:${secondsStr.padStart(5, '0')}`;
};

const indicatorFormats = {
    'millisecond': timeFormat('%L'),
    'racetime': timeFormatRace()
};

export const formatValue = (value, indicatorId) => {
    const formatter = indicatorFormats[indicatorId];
    return formatter(value);
};

export const parseSplitTime = (value) => {
    if (!/:/g.test(value)) value = `0:${value}`;
    const [ minutes, seconds ] = value.split(':');
    return Math.round((parseFloat(minutes) * 60 + parseFloat(seconds)) * 1000);
};