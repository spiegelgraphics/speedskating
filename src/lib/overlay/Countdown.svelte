<script>
    // Starting countdown
    import { css } from '$utils/actions';

    import NumberSwitcher from '$lib/overlay/NumberSwitcher.svelte';

    export let clock;
    export let maxValue;
    export let height;

    $: number = Math.ceil((maxValue - clock) / 1000);
</script>

<div
    class="countdown"
    use:css={{height}}
>
    <div class="number">
        <NumberSwitcher
            i={number}
        />
    </div>
</div>

<style lang="scss">
    .countdown {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1000;
        isolation: isolate;
    }

    .number {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: #000000;
        font-size: calc(var(--height) * 1px);

        @media (prefers-color-scheme: dark) {
            color: #f1efed;
        }
    }
</style>