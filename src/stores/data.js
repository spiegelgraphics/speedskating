import { derived } from 'svelte/store';
import { json, autoType } from 'd3';
import { maxBy } from 'lodash-es';

import { parseSplitTime } from '$utils/format';

import { params } from '$stores/params';

const config = derived(params, async ($params, set) => {
    const { config_path } = $params;
    try {
        const data = await json(config_path, autoType);
        set(data);
    } catch {
        set({});
    }
}, {});

export const race = derived(config, $config => {
    const { race = {} } = $config;
    return race;
});

export const setup = derived(race, $race => {
    const { setup = {} } = $race;
    return setup;
});

export const results = derived(race, $race => {
    const { results = [] } = $race;
    return results.map(result => {
        const { times, finish_time } = result;
        const cumulativeTimes = [0, ...times.map(d => parseSplitTime(d))];
        const finishTimeMs = parseSplitTime(finish_time);
        return {
            ...result,
            times,
            cumulativeTimes,
            finish_time: finish_time.replace('.', ','),
            finishTimeMs
        };
    });
});

export const athletes = derived([config, params], ([$config, $params]) => {
    const { athletes = [] } = $config;
    const { flag_server } = $params;
    const flaggedAthletes = athletes.map(athlete => {
        const flagPath = `${flag_server}${athlete.iso}.svg`;
        return {
            ...athlete,
            flagPath
        }
    })
    return flaggedAthletes;
});

export const trackData = derived(config, $config => {
    const { race = {}, tracks = {} } = $config;
    if (!race || !tracks) return {};
    const { setup: { type } = {} } = race;
    const track = tracks[type];
    const { parent_svg = {} } = track || {};
    return {
        ...track,
        aspectRatio: parent_svg.width / parent_svg.height
    };
});

export const animationDetails = derived([results, setup], ([$results, $setup]) => {
    const { speed, countdown, starting, ending } = $setup;
    const { finishTimeMs: raceLength } = maxBy($results, 'finishTimeMs') || {};
    return {
        ...$setup,
        countdown: countdown * speed,
        starting: starting * speed,
        ending: ending * speed,
        raceLength
    };
});

export const athleteResults = derived([athletes, results], ([$athletes, $results]) => {
    const combined = $results.map((result, id) => {
        const { athlete_id } = result;
        const athlete = $athletes.find(d => d.athlete_id === athlete_id);
        return {
            id,
            ...athlete,
            ...result
        };
    });

    return combined;
});