<script>
    // Time display
    import { formatValue } from '$utils/format';

    export let clock;
    export let speed;
</script>

<div class="timer">
    <span class="time">
        {formatValue(clock, 'racetime')}
    </span>
    {#if (speed && speed > 1)}
        <span class="speed">
            ({Math.round(speed * 10) / 10}x)
        </span>
    {/if}
</div>

<style lang="scss">
    .timer {
        display: flex;
        align-items: center;
        height: 100%;
        margin: 0 1rem;
        color: $basic-black;
        font-size: 1.25rem;
        user-select: none;

        @media (prefers-color-scheme: dark) {
            color: $basic-white-dark;
        }

        .time {
            width: 4.5rem;
        }

        .speed {
            font-size: 0.75rem;
            color: $shade-dark-dark;
        }
    }
</style>