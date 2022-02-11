<script>
    // Wrapper to detect the width and height of a container
    // Needed instead of bind:clientWidth etc. because of CMS issues
    import { onMount } from 'svelte';

    import { viewport } from '$utils/actions';

    export let width = undefined;
    export let height = undefined;
    export let inView = false;

    let tid;
    let container;

    function handleResize() {
        clearTimeout(tid);
        ({ width, height } = container.getBoundingClientRect());
    }

    function throttleResize() {
        clearTimeout(tid);
        tid = setTimeout(handleResize, 100);
    }

    onMount(() => {
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
            throttleResize();
        }, 125);

        new ResizeObserver(throttleResize).observe(container);

        return () => clearTimeout(tid);
    });
</script>

<svelte:window on:resize={throttleResize} />

<div
    class="size-detector"
    bind:this={container}
    use:viewport
    on:enterViewport={() => inView = true}
    on:exitViewport={() => {}}
>
    <slot />
</div>

<style lang="scss">
    .size-detector {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>