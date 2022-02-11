<script>
    // Sources
    import TextAlignEmbed from '$lib/utils/TextAlignEmbed.svelte';

    export let sources;
    export let textAlign = false;
</script>

<TextAlignEmbed
    disabled={!textAlign}
>
    <div class="sources">
        <p>
            {sources}
        </p>
    </div>
</TextAlignEmbed>

<style lang="scss">
    .sources {
        width: 100%;
        margin: 0.5rem 0;

        p {
            margin: 0;
            color: $shade-darker;
            font-weight: 400;
            font-size: 0.75rem;

            @media (prefers-color-scheme: dark) {
                color: $basic-white-dark;
            }
        }
    }
</style>