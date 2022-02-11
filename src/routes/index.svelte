<script>
    import { params } from '$stores/params';
    import { setup, trackData } from '$stores/data';
    import { css } from '$utils/actions';

    import TextAlignEmbed from '$lib/utils/TextAlignEmbed.svelte';
    import SizeDetector from '$lib/utils/SizeDetector.svelte';
    import Header from '$lib/header/Header.svelte';
    import Animation from '$lib/animation/Animation.svelte';
    import Controls from '$lib/controls/Controls.svelte';
    import Sources from '$lib/sources/Sources.svelte';

    let width;
    let height;
    let isInView = false;
    let isDeactivated = false;
    let animationReady = false;

    $: ({ title, subtitle, sources } = $setup);
    $: ({
        min_height,
        max_height_mobile,
        max_height: presetHeight,
        left_right_padding,
        text_align_disabled
    } = $params);

    $: height = Math.max(min_height, Math.min(presetHeight, 1.3 * width / $trackData.aspectRatio));
</script>

<div class="app-wrapper">
    <TextAlignEmbed
        disabled={text_align_disabled}
    >
        <SizeDetector
            bind:width={width}
            bind:inView={isInView}
        >
            <div
                class="wrapper"
                class:ready={isInView && animationReady}
                use:css={{
                    height,
                    left_right_padding
                }}
            >
                <Header
                    title={title}
                    subtitle={subtitle}
                    textAlign={text_align_disabled}
                />
                <Animation
                    bind:isReady={animationReady}
                />
                <Controls
                    isReady={isInView && animationReady}
                    bind:isDeactivated={isDeactivated}
                    textAlign={text_align_disabled}
                />
                <Sources
                    sources={sources}
                    textAlign={text_align_disabled}
                />
            </div>
        </SizeDetector>
    </TextAlignEmbed>
</div>

<style lang="scss">
    .app-wrapper {
        width: 100%;
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        min-height: calc(var(--height) * 1px);
        padding: 0 calc(var(--left_right_padding, 0) * 1rem);
        opacity: 0.0;
        box-sizing: border-box;
        transition: opacity 0.1s;

        @media (prefers-color-scheme: dark) {
            background-color: $basic-black-dark;
        }

        &.ready {
            opacity: 1.0;
        }
    }
</style>