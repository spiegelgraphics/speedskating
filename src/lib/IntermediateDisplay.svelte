<script>
    import { fade } from 'svelte/transition';
    import { flip } from 'svelte/animate';

    import { formatValue } from '$utils/format';

    export let data = [];
    export let x;
    export let y;
    export let config = {};
    export let reduced = false;

    $: ({ show_type } = config);

    $: renderedData = data.slice(reduced ? -2 : 0).map(d => {
        const { id, sectorTime, background_color } = d;
        const display = show_type.map(t => d[t]).join(', ');
        return {
            id,
            time: formatValue(sectorTime, 'racetime'),
            display,
            color: background_color
        };
    });
</script>

<ul
    class="intermediate-display"
    style="left: {x}px;
           top: {y}px;"
>
    {#each renderedData as { id, time, display, color} (id)}
        <li
            style="color: {color};"
            animate:flip
            out:fade={{duration: 400}}
        >
            <span class="time">
                {time}
            </span>
            <span class="display">
                {display}
            </span>
        </li>
    {/each}
</ul>

<style lang="scss">
    .intermediate-display {
        position: absolute;
        z-index: 20;
        isolation: isolate;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        min-width: 200px;
        height: 100%;
        margin: 0;
        padding: 0;
        transform: translateX(-50%) translateY(calc(-100% - 35px));
        list-style-type: none;

        @media (min-width: 500px) {
            transform: translateX(-50%) translateY(calc(-100% - 50px));
        }
    }

    li {
        padding: 0.125rem 0;
        color: $shade-darker;
        font-size: 0.875rem;
        border: none;
        border-radius: 1.5px;
        text-shadow: 3px 0px 4px $basic-white, 
                    -3px 0px 4px $basic-white, 
                     0px 4px 4px $basic-white;

        span {
            display: inline-block;
        }

        .time {
            min-width: 3rem;
            margin-right: 0.25rem;
            font-weight: 600;

            @media (min-width: 500px) {
                min-width: 4rem;
            }
        }

        @media (min-width: 500px) {
            font-size: 1rem;
        }

        @media (prefers-color-scheme: dark) {
            color: $basic-white-dark;
            text-shadow: 3px 0px 4px $basic-black-dark, 
                        -3px 0px 4px $basic-black-dark, 
                         0px 4px 4px $basic-black-dark;
        }
    }
</style>