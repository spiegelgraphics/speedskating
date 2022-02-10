<script>
    import * as createREGL from 'regl';

    import { sectorCompletes, realClockStep } from '$stores/clock';
    import { params } from '$stores/params';
    import { initCanvas, createDrawDots } from '$utils/webgl';

    import Athlete from '$lib/Athlete.svelte';

    export let results;
    export let details;
    export let trackCoordinates;
    export let clock;
    export let width;
    export let height;

    let canvas;
    let regl;
    let draw;
    let currentCoords = [];
    let sizes = [];
    let colors = [];
    let opacities = [];

    function handleSectorComplete(e) {
        if (!$params.intermediate_times) return; 
        const { detail } = e;
        sectorCompletes.add(detail);
    }

    $: ({
        countdown,
        starting,
        raceLength,
        sectors = [],
        starting_exponent: startingExponent,
        track_offset_factor: trackOffsetFactor,
        resolution,
        trail_length
    } = details);

    // Assemble data for single athletes
    $: athletes = results.map((result, i) => {
        return {
            ...result,
            coordinates: trackCoordinates[i % trackCoordinates.length],
        };
    }).reverse();

    // Setup coordinates container
    $: coordinatesContainer = Array(athletes.length).fill();

    // Set pure animation clock
    $: localClock = Math.max(0, clock - countdown - starting);

    // Reset intermediate times display
    $: localClock > raceLength && sectorCompletes.reset();

    // WebGL logic
    $: if (canvas) {
        initCanvas(canvas, width, height);
        regl = createREGL({
            canvas: canvas,
            pixelRatio: window.devicePixelRatio || 1,
            attributes: {
                depth: false,
                antialias: true
            }
        });
        draw = createDrawDots(regl);
    }

    $: if (draw) {
        const coords = currentCoords.flat();
        draw({
            coords,
            sizes: sizes.flat(),
            colors: colors.flat(),
            opacities: opacities.flat(),
            n: coords.length
        });
    }
</script>

<canvas
    class="athletes"
    bind:this={canvas}
/>
{#each athletes as data, i}
    <Athlete
        data={data}
        sectors={sectors}
        startingExponent={startingExponent}
        localClock={localClock}
        resolution={resolution}
        trailLength={trail_length}
        bind:currentCoords={currentCoords[i]}
        bind:colors={colors[i]}
        bind:sizes={sizes[i]}
        bind:opacities={opacities[i]}
        on:sectorComplete={handleSectorComplete}
    />
{/each}

<style lang="scss">
    .athletes {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 50;
    }
</style>