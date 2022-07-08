import { exists } from '@/helpers/utilities';
import ScrollBooster from 'scrollbooster';

export let mixin = ({ node = null, config = {} } = {}) => {
    if (!node) return false;

    let state = {
        node,
        config,
    };

    state.content = state.node.querySelector(`[data-js="scroll-content"]`);
    state.navItems = state.content.querySelectorAll(`.nav-item`);

    let module = {
        shouldDrag() {
            if (!state.navItems.length) return;
            return [...state.navItems].some((item) => {
                return item.getBoundingClientRect().right > state.content.getBoundingClientRect().right;
            });
        },
        initPlugin() {
            if (!this.shouldDrag()) return;
            console.log('init');
            state.sb = new ScrollBooster({
                viewport: state.node,
                content: state.content,
                scrollMode: 'transform',
                direction: 'horizontal',
                pointerMode: 'touch',
                dragDirectionTolerance: 28,
            });
        },
        onWindowResize() {
            if (this.shouldDrag()) {
                if (exists(state.sb)) return;
                this.initPlugin();
            } else {
                if (!exists(state.sb) || typeof state.sb.destroy !== 'function') return;
                state.sb.scrollTo(0, 0);
                state.sb.destroy();
                state.sb = null;
            }
        },
        setEventBindings() {
            window.addEventListener('resize', this.onWindowResize.bind(this));
        },
        init() {
            if (!exists(state.node)) return;
            this.setEventBindings();
            this.initPlugin();
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
