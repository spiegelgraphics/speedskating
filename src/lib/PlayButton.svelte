<script>
    export let isRunning;

    function handleClick() {
        isRunning = !isRunning;
    }
</script>

<div class="play-button">
    <button
        on:click={handleClick}
    >
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g
                transform-origin="50% 50%"
            >
                {#if (isRunning)}
                    <rect x="7" y="4" width="3" height="16" rx="1.5" />
                    <rect x="14" y="4" width="3" height="16" rx="1.5" />
                {:else}
                    <path
                        d="M6 5.76341C6 5.19411 6.60936 4.83238 7.10914 5.10498L18.5429 11.3416C19.064 11.6258 19.064 12.3742 18.5429 12.6584L7.10914 18.895C6.60936 19.1676 6 18.8059 6 18.2366V5.76341Z"
                    />
                {/if}
            </g>
        </svg>
    </button>
</div>

<style lang="scss">
    .play-button {
        margin: 0;
        pointer-events: all;
    }

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: auto;
        height: 100%;
        margin: 0;
        padding: 0;
        border: none;
        background: none;
        cursor: pointer;
    }

    rect, path {
        stroke: none;
        fill: $basic-black;

        @media (prefers-color-scheme: dark) {
            fill: $basic-white-dark;
        }
    }
</style>