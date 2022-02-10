import { scaleLinear, scalePow } from 'd3';

export const getPositionScale = ({ times, sectors, startingExponent }) => {
    const powScale = scalePow()
        .exponent(startingExponent)
        .domain(times.slice(0, 2))
        .range(sectors.slice(0, 2))
        .clamp(true);

    const linearScale = scaleLinear()
        .domain(times.slice(1))
        .range(sectors.slice(1))
        .clamp(true);

    const fn = (value) => {
        if (value < times[1]) return powScale(value);
        return linearScale(value);
    }

    fn.domain = () => [times[0], times.slice(-1)[0]];
    fn.range = () => [sectors[0], sectors.slice(-1)[0]];

    return fn;
};

export const getNormalOffsetCoords = (
    { x: x0, y: y0 },
    { x: x1, y: y1 },
    { x: x2, y: y2 },
    offset = 0
) => {
    const normal = {
        x: y2 - y1,
        y: -x2 + x1
    };

    return {
        x: x0 + normal.x * offset,
        y: y0 + normal.y * offset
    };
};

export const getRange = (start, end, step = 1) => {
    const len = Math.floor((end - start) / step) + 1;
    return Array(len).fill().map((_, i) => start + (i * step));
};