<script>
    import TextAlignEmbed from '$lib/TextAlignEmbed.svelte';

    export let title;
    export let subtitle;
    export let textAlign = false;
</script>

<TextAlignEmbed
    disabled={!textAlign}
>
    <div class="header">
        <h2>
            {title}
        </h2>
        {#if (subtitle)}
            <h3>
                {@html subtitle}
            </h3>
        {/if}
    </div>
</TextAlignEmbed>

<style lang="scss">
    .header {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        width: 100%;
        height: 100%;
        margin: 0.5rem 0;

        h2 {
            margin: 0;
            color: $basic-black;
            font-size: 1.5rem;
            font-weight: 700;
            line-height: 1.05;
            letter-spacing: 0;
            opacity: 1;

            @media (prefers-color-scheme: dark) {
                color: $basic-white-dark;
            }
        }

        h3 {
            margin: 0;
            color: $basic-black;
            font-weight: 400;
            font-size: 1rem;
            text-align: left;

            @media (prefers-color-scheme: dark) {
                color: $basic-white-dark;
            }
        }
    }
</style>