import { writable, derived } from 'svelte/store';

import { animationDetails } from '$stores/data';

export const clock = writable(0);
export const raceClock = writable(0);

export const sectorCompletes = (() => {
    const { set, update, subscribe } = writable([]);
    let stdRemoveInterval = 2000;
    let tid;

    const reset = () => {
        clearTimeout(tid);
        set([]);
    };

    const remove = () => {
        update(values => values.slice(1));
    };

    const add = (obj, { oneOnly = false, removeInterval = stdRemoveInterval } = {}) => {
        if (oneOnly) {
            set([obj]);
        } else {
            update(values => [...values, obj]);
        }
        tid = setTimeout(remove, removeInterval);
    };

    return {
        add,
        reset,
        subscribe
    };
})();

export const clockStep = derived(animationDetails, $animationDetails => {
    const { speed, step } = $animationDetails;
    return speed * step;
});

export const realClockStep = derived(animationDetails, $animationDetails => {
    const { speed, step } = $animationDetails;
    return speed * Math.max(16.66, step);
});