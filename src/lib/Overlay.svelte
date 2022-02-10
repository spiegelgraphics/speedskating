<script>
    import TextAlignEmbed from '$lib/TextAlignEmbed.svelte';
    import Countdown from '$lib/Countdown.svelte';
    import Results from '$lib/Results.svelte';
    
    export let clock;
    export let details;
    export let results;
    export let height;
    export let textAlign;
    export let showsResults = false;

    $: ({ countdown, starting, raceLength, ending, speed, result } = details);
    $: isBefore = clock < countdown + starting;
    $: isAfter = clock > countdown + starting + raceLength;
    $: show = isBefore || isAfter;

    $: trueClock = clock / speed;

    $: showsResults = isAfter;
</script>

{#if (show)}
    <div
        class="overlay"
        class:blur={isAfter}
    >
        {#if (isAfter)}
            <div class="background"></div>
        {/if}
        <TextAlignEmbed
            disabled={textAlign}
        >
            {#if (isBefore)}
                <Countdown
                    clock={trueClock}
                    maxValue={countdown / speed}
                    height={height}
                />
            {:else if (isAfter)}
                <Results
                    results={results}
                    config={result}
                />
            {/if}
        </TextAlignEmbed>
    </div>
{/if}

<style lang="scss">
    .overlay {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1000;
        isolation: isolate;
        pointer-events: none;

        &.blur {
            backdrop-filter: blur(6px);
        }

        .background {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 0;
            opacity: 0.95;
            background-color: $basic-white;

            @media (prefers-color-scheme: dark) {
                opacity: 0.85;
                background-color: $basic-black-dark;
            }
        }
    }
</style>