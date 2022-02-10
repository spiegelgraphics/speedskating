import { color } from 'd3';

export const initCanvas = (canvas, width, height) => {
    const devicePixelRatio = window.devicePixelRatio || 1;
  
    canvas.width = devicePixelRatio * width;
    canvas.height = devicePixelRatio * height;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
};

export const scaleCanvas = (canvas, ctx, width, height) => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio =
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio ||
        1;

    const ratio = devicePixelRatio / backingStoreRatio;

    if (devicePixelRatio !== backingStoreRatio) {
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    } else {
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = '';
        canvas.style.height = '';
    }

    ctx.scale(ratio, ratio);
};

export const getWebGLColor = (c) => {
    const webglColor = Object.values(color(c).rgb())
        .slice(0, 3)
        .map(d => d / 255);
    return webglColor;
};

export const generateCartesianToWebGL = (width, height) => ([ x, y ]) => {
    return [
        2 * ((x / width) - 0.5),
        -2 * ((y / height) - 0.5)
    ];
};

export const createDrawDots = (regl) => {
    return regl({
        frag: `
            precision highp float;

            varying vec3 fragColor;
            varying float fragOpacity;

            void main() {
                float point_dist = length(gl_PointCoord * 2. - 1.);

                if(point_dist > 1.0) discard;
                float alpha = fragOpacity;

                gl_FragColor = vec4(1.0 - alpha * (1.0 - fragColor), 1);
            }
        `,
        vert: `
            precision highp float;

            attribute vec2 position;
            attribute float size;
            attribute vec3 color;
            attribute float opacity;

            varying vec3 fragColor;
            varying float fragOpacity;

            void main() {
                fragColor = color;
                fragOpacity = opacity;
                gl_PointSize = size;
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `,
        depth: {
            enable: false,
            mask: false
        },
        attributes: {
            position: {
                buffer: (_, props) => {
                    return props.coords
                }
            },
            size: {
                buffer: (_, props) => {
                    return props.sizes
                }
            },
            color: {
                buffer: (_, props) => {
                    return props.colors
                }
            },
            opacity: {
                buffer: (_, props) => {
                    return props.opacities
                }
            }
        },
        blend: {
            enable: true,
            func: {
                srcRGB: 'src alpha',
                srcAlpha: 'src alpha',
                dstRGB: 'one minus src alpha',
                dstAlpha: 'one minus src alpha',
            }
        },
        count: (_, props) => props.n,
        primitive: 'points'
    });
};