import { readable } from 'svelte/store';

const defaultParams = {
    config_path: 'config.json',
    min_height: 320,
    max_height: 500,
    left_right_padding: 0,
    text_align_disabled: true,
    intermediate_times: false,
    debug: false
};

export const params = readable(defaultParams, set => {
    // here we usually inject parameters from the CMS
    const completeParams = {
        ...defaultParams
        // CMS parameters
    };
    set(completeParams);
});