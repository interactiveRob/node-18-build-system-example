import { exists } from '@/helpers/utilities';

export let mixin = ({ node = null, config = {} } = {}) => {
    if (!node) return false;

    let state = {
        node,
        config,
    };

    let module = {
        makeLayout() {
            let imgWidth = state.node.offsetWidth;
            let parentBoundingBox = state.node.parentNode.getBoundingClientRect();

            let mode = state.node.parentNode.dataset.mode == 'left' ? 'left' : 'right';
            let measure = mode == 'left' ? 0 : window.innerWidth;

            let move = Math.abs(measure - parentBoundingBox[mode]);
            if (move < 0 || move > imgWidth) return;

            state.node.style.right = `-${move}px`;
            state.node.style.right = `-${move}px`;
        },
        onWindowResize() {
            this.makeLayout();
        },
        setEventBindings() {
            window.addEventListener('resize', this.onWindowResize.bind(this));
        },
        init() {
            if (!exists(state.node)) return;
            this.setEventBindings();
            this.makeLayout();
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
