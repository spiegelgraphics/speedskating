const pathToArray = path => path.split(/(?=[a-zA-Z])/g);

const stripFirstPathOperation = path => {
    const arr = pathToArray(path);
    return arr.slice(1).join('');
};

export const fusePaths = (paths) => {
    if (!paths && !paths.length) return null;

    const start = paths[0];
    const others = paths
        .slice(1)
        .map(d => stripFirstPathOperation(d));

    const fused = [start, ...others].reduce((acc, cur) => `${acc}${cur}`, '');

    return fused;
};

export const getDistance = ({ x: x1 = 0, y: y1 = 0 }, { x: x2 = 0, y: y2 = 0 }) => {
    return Math.hypot(x2 - x1, y2 - y1);
};