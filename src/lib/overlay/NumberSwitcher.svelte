<script>
    // Number switching animation (used for countdown)
    import { fly } from 'svelte/transition';

    export let i;
    export let delay = 0;
    export let deactivate = false;

    const offset = 50;
    const duration = 600;
</script>

<span
    class="number-switcher"
>
    {#key i}
        <span
            class="number"
            in:fly={{y: -offset, duration, opacity: 0, delay}}
            out:fly|local={{y: offset, duration: deactivate ? 0 : duration, opacity: 0}}
        >
            {i}
        </span>
    {/key}
</span>

<style lang="scss">
    .number-switcher {
        position: relative;
        display: inline-block;
        width: 2rem;
        height: auto;
        text-align: center;

        @media (min-width: 500px) {
            width: 2.5rem;
        }

        .number {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            transform: translateY(-50%);
        }
    }
</style>