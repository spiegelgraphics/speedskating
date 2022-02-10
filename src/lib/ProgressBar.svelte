<script>
    import { css } from '$utils/actions';

    export let value;
    export let maxValue;
    export let pointerPressed = false;
    export let step;

    let container;

    function setValue(x) {
        const { width } = container.getBoundingClientRect();
        value = maxValue * x / width;
    }

    function handlePointerdown(e) {
        pointerPressed = true;
        const { layerX: x } = e;
        setValue(x);
    }

    function handlePointermove(e) {
        if (!pointerPressed) return;
        const { layerX: x } = e;
        setValue(x);
    }

    function handlePointerup() {
        pointerPressed = false;
    }

    $: progress = Math.round(100 * 100 * value / maxValue) / 100;
</script>

<div
    class="progress-bar"
    on:pointerdown={handlePointerdown}
    on:pointermove={handlePointermove}
    on:pointerup={handlePointerup}
    bind:this={container}
>
    <div
        class="progress-bar-inner"
        class:enable-transition={!pointerPressed}
        style="width: {progress}%;"
        use:css={{step}}
    ></div>
</div>

<style lang="scss">
    .progress-bar {
        flex: 1;
        position: relative;
        height: 100%;
        box-sizing: border-box;
        cursor: pointer;
    }

    .progress-bar-inner {
        position: absolute;
        top: 50%;
        height: 0.5rem;
        margin: auto;
        border: none;
        border-radius: 1.5px;
        background-color: $shade-lighter;
        transform: translateY(-50%);

        &.enable-transition {
            transition: width calc(var(--step) * 1ms + 50ms);
        }
    }
</style>