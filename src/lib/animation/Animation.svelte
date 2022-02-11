<script>
    // Wrapper for the core animation
    import { trackData, animationDetails, athleteResults } from '$stores/data';
    import { clock, sectorCompletes } from '$stores/clock';
    import { params } from '$stores/params';

    import Track from '$lib/animation/Track.svelte';
    import Sizer from '$lib/utils/Sizer.svelte';
    import IntermediateDisplay from '$lib/animation/IntermediateDisplay.svelte';
    import Athletes from '$lib/animation/Athletes.svelte';
    import Overlay from '$lib/overlay/Overlay.svelte';

    export let isReady = false;

    let trackCoordinates;
    let trackWidth;
    let trackHeight;
    let endCoordinate = {};
    let tracksReady = false;
    let showsResults = false;

    $: ({ intermediate_display } = $trackData);

    $: isReady = tracksReady;
</script>

<div class="animation">
    <Track
        data={$trackData}
        details={$animationDetails}
        bind:coordinates={trackCoordinates}
        bind:endCoordinate={endCoordinate}
        bind:containerWidth={trackWidth}
        bind:containerHeight={trackHeight}
        bind:isReady={tracksReady}
    />
    <Sizer
        width={trackWidth}
        height={trackHeight}
    >
        {#if ($animationDetails.type === 'speedskating')}
            <IntermediateDisplay
                data={$sectorCompletes}
                x={endCoordinate.x}
                y={endCoordinate.y}
                config={intermediate_display}
            />
        {/if}
        {#if (tracksReady && !showsResults)}
            <Athletes
                results={$athleteResults}
                details={$animationDetails}
                trackCoordinates={trackCoordinates}
                clock={$clock}
                width={trackWidth}
                height={trackHeight}
            />
        {/if}
    </Sizer>
    <Overlay
        clock={$clock}
        details={$animationDetails}
        results={$athleteResults}
        height={Math.max(48, trackHeight / 3)}
        textAlign={!$params.text_align_disabled}
        bind:showsResults={showsResults}
    />
</div>

<style lang="scss">
    .animation {
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        pointer-events: none;
    }
</style>