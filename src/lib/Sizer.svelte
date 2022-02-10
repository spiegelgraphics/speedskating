<script>
    import { css } from '$utils/actions';

    export let width;
    export let height;
    export let horizontal = false;
</script>

<div
    class="sizer"
    class:horizontal={horizontal}
    use:css={{
        width,
        height: horizontal ? null : height
    }}
>
    <slot />
</div>

<style lang="scss">
    .sizer {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 10;
        isolation: isolate;
        width: calc(var(--width) * 1px);
        height: calc(var(--height) * 1px);
        margin: auto;

        &.horizontal {
            height: 100%;
            margin: 0 auto;
        }
    }
</style>