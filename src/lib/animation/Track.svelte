<script>
    // Speed skating track
    import { onMount } from 'svelte';

    import { fusePaths } from '$utils/geometry';
    import { getRange, getNormalOffsetCoords } from '$utils/math';
    import { generateCartesianToWebGL } from '$utils/webgl';

    import Background from '$lib/animation/Background.svelte';

    export let data;
    export let details = {};
    export let coordinates = [];
    export let endCoordinate = {};
    export let containerWidth = undefined;
    export let containerHeight = undefined;
    export let isReady = false;

    let track;
    let fusedPath = null;
    let tid;
    let svgElem;
    let gElem;
    let pathElement;
    let cartesianToWebGL;
    let basicCoordinates = [];

    function handleResize() {
        clearTimeout(tid);
        ({ width: containerWidth, height: containerHeight } = gElem.getBoundingClientRect());
    }

    function throttleResize() {
        clearTimeout(tid);
        tid = setTimeout(handleResize, 100);
    }

    function getBasicCoordinates({ getCoord }, { resolution }) {
        const positions = getRange(0, 1, 1 / resolution);
        const coords = positions.map(position => {
            const coord = getCoord(position);
            return coord;
        });
        return coords;
    }

    function getCoordinates(basicCoordinates, {
        trackOffsetFactor,
        cartesianToWebGL,
        i,
        numPaths,
        offsetFunctionType
    }) {
        const ratio = (i + 1) / numPaths * (i % 2 === 0 ? 1 : -1);
        let offsetFunction = (v) => v;
        if (offsetFunctionType === 'sinewave') {
            offsetFunction = (progress) => Math.sin(progress * 100 + Math.abs(ratio) * Math.PI) / trackOffsetFactor;
        } else if (offsetFunctionType === 'linear') {
            offsetFunction = () => ratio * trackOffsetFactor;
        } else if (offsetFunctionType === 'linearalternate') {
            offsetFunction = () => ((i % numPaths) / numPaths * (i % 2 === 0 ? 1 : -1)) * trackOffsetFactor;
        }

        const offsetCoords = basicCoordinates.map((coord, i, arr) => {
            const progress = i / (arr.length - 1);
            const trackOffset = offsetFunction(progress);
            const coord1 = arr[i - 1] || coord;
            const coord2 = arr[i + 1] || coord;
            const offsetCoord = getNormalOffsetCoords(coord, coord1, coord2, trackOffset);
            return offsetCoord;
        });

        const coordArray = offsetCoords.map(({ x, y }) => cartesianToWebGL([x, y]));

        return coordArray;
    }

    onMount(() => {
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
            throttleResize();
        }, 125);

        new ResizeObserver(throttleResize).observe(svgElem);

        return () => clearTimeout(tid);
    });

    $: ({
        type,
        composition,
        num_paths: numPaths,
        resolution,
        track_offset_factor: trackOffsetFactor,
        offset_function_type: offsetFunctionType
    } = details);

    $: ({ parent_svg: { width = 0, height = 0 } = {}, paths = [] } = data || {});
    $: aspectRatio = width / height;

    // Generate a fused path from different smaller paths in order to assemble the speed skating track
    $: if (composition) fusedPath = fusePaths(
        composition
            .split(',')
            .map(d => paths.find(({ id }) => +d === id))
            .map(({ path } = {}) => path)
            .filter(d => d)
    );

    // Define track object which holds the info how to get positions on the track
    $: if (svgElem && pathElement) {
        const scaleX = containerWidth / width;
        const scaleY = containerHeight / height;
        if (!isNaN(scaleX) && !isNaN(scaleY)) {
            const matrix = svgElem.createSVGMatrix().scaleNonUniform(scaleX, scaleY);
            const length = pathElement.getTotalLength();
            const getCoord = (relPos) => {
                return pathElement.getPointAtLength(relPos * length).matrixTransform(matrix);
            };
            track = {
                pathElement,
                matrix,
                getCoord,
                length
            };
            cartesianToWebGL = generateCartesianToWebGL(containerWidth, containerHeight);
        }
    }

    // Precalculate every possible coordinate on the track
    $: if (isReady) {
        basicCoordinates = getBasicCoordinates(track, {resolution});
        endCoordinate = basicCoordinates.slice(-1)[0];
    }

    // Apply an offset to the coordinates
    $: if (basicCoordinates && basicCoordinates.length) coordinates = Array.from({length: numPaths}).map((_, i) => getCoordinates(basicCoordinates, {
        trackOffsetFactor,
        cartesianToWebGL,
        i,
        numPaths,
        offsetFunctionType
    }));

    $: isReady = containerWidth && containerWidth < width;
</script>

<svelte:window on:resize={throttleResize} />

<div
    class="track"
>
    <Background
        type={type}
        width={containerWidth}
        height={containerHeight}
    />
    <svg
        height="100%"
        width="100%"
        viewBox="0 0 {width} {height}"
        bind:this={svgElem}
    >
        <g
            bind:this={gElem}
        >
            <path
                class:stroke={type === 'sliding'}
                d={fusedPath}
                bind:this={pathElement}
            />
            <circle cx="1" cy="1" r="1"/>
            <circle cx={width - 1} cy={height - 1} r="1" />
        </g>
    </svg>
</div>

<style lang="scss">
    .track {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        isolation: isolate;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    svg {
        position: relative;
    }

    path {
        fill: none;
        stroke: none;
        vector-effect: non-scaling-stroke;

        &.stroke {
            stroke: $basic-black;
            stroke-width: 4px;
            stroke-linecap: round;

            @media (prefers-color-scheme: dark) {
                stroke: $basic-white-dark;
            }
        }
    }

    circle {
        visibility: hidden;
    }
</style>