const setCssVariables = (node, variables) => {
    for (const name in variables) {
        if (variables[name]) {
            node.style.setProperty(`--${name}`, variables[name]);
        }
    }
};
  
export const css = (node, variables) => {
    setCssVariables(node, variables);

    return {
        update(variables) {
            setCssVariables(node, variables);
        }
    };
};

let intersectionObserver;

const ensureIntersectionObserver = () => {
    if (intersectionObserver) return;

    intersectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const eventName = entry.isIntersecting ? 'enterViewport' : 'exitViewport';
                entry.target.dispatchEvent(new CustomEvent(eventName));
            });
        }
    );
};

export const viewport = (element) => {
    ensureIntersectionObserver();
    intersectionObserver.observe(element);
    return {
        destroy() {
            intersectionObserver.unobserve(element);
        }
    }
};