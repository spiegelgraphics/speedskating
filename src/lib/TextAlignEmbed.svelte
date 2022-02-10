<script>
    export let disabled = false;
</script>

{#if (disabled)}
    <slot />
{:else}
    <div class="text-align-embed">
        <slot />
    </div>
{/if}

<style lang="scss">
    .text-align-embed {
        position: relative;
        height: 100%;
        margin: 0 auto;
        padding: 0;
        padding: 0 1.5rem;

        @media (max-width: 719px) {
            width: 100%;
            padding: 0 1rem;
        }

        @media (min-width: 720px) and (max-width: 1011px) {
            width: 83.33333333333334%;
        }

        @media (min-width: 1012px) {
            width: 66.66666666666667%;
        }
    }
</style>