<script>
    import { fade } from 'svelte/transition';
    import { orderBy } from 'lodash-es';

    import { css } from '$utils/actions';

    export let results = [];
    export let config = {};
    export let delay = 200;

    function composeName(first, last, country) {
        let name = `${first} ${last}`;
        if (show_country) name += ` (${country})`;
        return name;
    }

    $: ({ title, show_medals = true, show_year, show_country } = config);
</script>

<div class="results">
    {#if (title)}
        <h2 class="title">
            {title}
        </h2>
    {/if}
    <ul class:title={title}>
        {#each orderBy(results, 'finishTimeMs') as { id, rank, first_name, last_name, finish_time, year, highlight, medal, background_color, country }, i (id)}
            <li
                in:fade={{duration: 400, delay: i * delay}}
                use:css={{highlight, background_color}}
            >
                {#if (show_medals)}
                    <span class="medal" use:css={{medal}}></span>
                {/if}
                <span class="rank">
                    {rank}.
                </span>
                <span class="time">
                    {finish_time}
                </span>
                <span class="name">
                    {composeName(first_name, last_name, country)}
                </span>
                {#if (show_year)}
                    <span class="year">
                        {year}
                    </span>
                {/if}
            </li>
        {/each}
    </ul>
</div>

<style lang="scss">
    .results {
        position: relative;
        width: 100%;
        height: 100%;
        color: $basic-black;
        font-size: 1rem;
        box-sizing: border-box;

        @media (prefers-color-scheme: dark) {
            color: $basic-white-dark;
        }

        h2.title {
            height: 1.5rem;
            margin: 0.5rem 0 0 0;
            padding: 0;
            color: $basic-black;
            font-size: 1.25rem;
            font-weight: 700;
            box-sizing: border-box;

            @media (prefers-color-scheme: dark) {
                color: $basic-white-dark;
            }
        }

        ul {
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            z-index: 50;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin: 0 auto;
            padding: 1rem 0;
            list-style-type: none;
            overflow-y: auto;
            pointer-events: all;

            &.title {
                top: 2rem;
            }

            li {
                display: flex;
                align-items: center;
                gap: 1rem;

                span {
                    display: inline-block;
                }

                .rank {
                    min-width: 2rem;
                    text-align: right;
                }

                .medal {
                    min-width: 1rem;
                    min-height: 1rem;
                    border: 3px solid var(--medal, transparent);
                    border-radius: 100%;
                    box-sizing: border-box;
                }

                .time {
                    min-width: 3.5rem;
                }
            }
        }
    }
</style>