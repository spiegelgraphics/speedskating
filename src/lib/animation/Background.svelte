<script>
    // Animation background selector
    import SpeedskatingArena from '$lib/animation/SpeedskatingArena.svelte';

    export let type;
    export let width;
    export let height;
</script>

<div
    class="background"
    style="width: {width}px;
           height: {height}px;"
>
    {#if (type === 'speedskating')}
        <SpeedskatingArena />
    {/if}
</div>

<style lang="scss">
    .background {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: auto;
    }
</style>