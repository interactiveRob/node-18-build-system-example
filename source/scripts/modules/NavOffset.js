import { exists } from '@/helpers/utilities';

export let mixin = ({ node = null, config = {} } = {}) => {
    if (!node) return false;

    let state = {
        node,
        config,
        topBar: node.querySelector(`.c-nav__top`),
        bottomBar: node.querySelector(`.c-nav__bottom`),
    };

    let module = {
        makeLayout() {
            document.documentElement.style.setProperty('--nav-height', `${state.node.offsetHeight + state.node.offsetTop}px`);
            if (!exists(state.topBar)) return;
            document.documentElement.style.setProperty('--top-bar-height', `${state.topBar.offsetHeight}px`);
            if (!exists(state.bottomBar)) return;
            document.documentElement.style.setProperty('--bottom-bar-height', `${state.bottomBar.offsetHeight}px`);
        },
        setEventBindings() {
            window.addEventListener('resize', this.makeLayout.bind(this));
            window.addEventListener('forceNavOffset', this.makeLayout.bind(this));
        },
        init() {
            if (!exists(state.node)) return;
            this.makeLayout();
            this.setEventBindings();
        },
    };

    return module.init();
};

export default {
    init({ selector, config = {} }) {
        let selected = document.querySelectorAll(selector);
        if (!selected.length) return;

        return [...selected].map((node, index) => {
            return mixin({ node, config });
        });
    },
};
