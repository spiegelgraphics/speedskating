<script>
    // Control bar
    import { onDestroy } from 'svelte';
    
    import { browser } from '$app/env';
    import { clock, clockStep } from '$stores/clock';
    import { animationDetails } from '$stores/data';

    import TextAlignEmbed from '$lib/utils/TextAlignEmbed.svelte';
    import PlayButton from '$lib/controls/PlayButton.svelte';
    import TimeDisplay from '$lib/controls/TimeDisplay.svelte';
    import ProgressBar from '$lib/controls/ProgressBar.svelte';

    export let isReady = false;
    export let isDeactivated = false;
    export let textAlign = false;

    let afId;
    let isRunning = true;
    let isCompleted = false;
    let frameCounter = 0;

    function run(startTime) {
        let previousTimeStamp;

        function update(timeStamp) {
            if ($clock > totalLength || !isRunning || isDeactivated) {
                cancelAnimationFrame(afId);
                frameCounter = 0;
                return;
            }
            const diff = (timeStamp - (previousTimeStamp || startTime)) * speed;
            if (diff >= $clockStep) {
                $clock += diff;
                previousTimeStamp = timeStamp;
                frameCounter++;
            }
            afId = requestAnimationFrame(update);
        }
        afId = requestAnimationFrame(update);
    }

    onDestroy(() => browser && cancelAnimationFrame(afId));

    $: ({ countdown, starting, raceLength, ending, speed, step } = $animationDetails);
    $: totalLength = countdown + starting + raceLength + ending;

    $: isCompleted = $clock > totalLength;
    $: isRunning = !isCompleted;

    $: browser && isReady && isRunning && $clockStep && !isDeactivated && run(performance.now());
    $: isCompleted && isRunning && clock.set(0);

    $: raceClock = Math.max(0, Math.min(raceLength, $clock - countdown - starting));
</script>

<TextAlignEmbed
    disabled={!textAlign}
>
    <div class="controls">
        <PlayButton
            bind:isRunning={isRunning}
        />
        <TimeDisplay
            clock={raceClock}
            speed={speed}
        />
        <ProgressBar
            bind:value={$clock}
            maxValue={totalLength}
            bind:pointerPressed={isDeactivated}
            step={step}
        />
    </div>
</TextAlignEmbed>

<style lang="scss"> 
    .controls {
        display: flex;
        width: 100%;
        height: 2rem;
        padding: 0;
        touch-action: none;
        box-sizing: border-box;
    }
</style>