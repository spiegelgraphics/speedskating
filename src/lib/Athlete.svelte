<script>
    import { createEventDispatcher } from 'svelte';
    import { scaleLinear, sum, interpolateHclLong } from 'd3';

    import { getPositionScale } from '$utils/math';
    import { getWebGLColor } from '$utils/webgl';

    export let data;
    export let sectors;
    export let currentCoords = [];
    export let sizes = [];
    export let colors = [];
    export let opacities = [];
    export let startingExponent;
    export let trailLength;
    export let localClock;
    export let resolution;

    const dispatch = createEventDispatcher();

    let numCoords = 0;
    
    function notifySectorComplete(sectorComplete) {
        if (!sectorComplete || sectorComplete < 1) return;
        dispatch('sectorComplete', {
            ...data,
            sectorComplete,
            sectorTime: cumulativeTimes[sectorComplete]
        });
    }

    $: ({
        id,
        cumulativeTimes,
        finishTimeMs,
        size,
        opacity,
        background_color,
        trail_color = background_color,
        coordinates
    } = data);

    // Create position scale
    $: positionScale = getPositionScale({
        times: cumulativeTimes,
        sectors: sectors,
        startingExponent
    });

    // Get the current position and coordinates
    $: position = positionScale(localClock);
    $: positionIndex = Math.floor(position * resolution);
    $: finished = position >= 1;
    $: {
        currentCoords = finished ? [] : coordinates.slice(Math.max(0, positionIndex - trailLength + 1), positionIndex + 1);
        numCoords = currentCoords.length;
    }

    // Sizes
    $: sizes = Array.from({length: numCoords}).map((_, i) => size * (i + 1) / numCoords);

    // Colors
    $: colorScale = scaleLinear(interpolateHclLong)
        .domain([0, numCoords - 1])
        .range([trail_color, background_color])
        .clamp(true);
    $: colors = Array.from({length: numCoords}).map((_, i) => getWebGLColor(numCoords === 1 ? background_color : colorScale(i)));

    // Opacities
    $: opacities = Array.from({length: numCoords}).map(() => opacity);

    // Check athlete position and notify intermediate timer
    $: sectorsComplete = sum(sectors.map(d => position > d)) - 1;
    $: notifySectorComplete(sectorsComplete);
</script>