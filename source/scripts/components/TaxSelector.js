import { exists } from '@/helpers/utilities';

export let mixin = ({ node = null, config = {} } = {}) => {
    if (!node) return false;

    let state = {
        node,
        config,
    };

    let module = {
        onFormChange() {
            let options = state.node.querySelectorAll('option');
            if (!options.length) return;

            let selected = [...options].filter((option) => {
                return option.selected && option.value;
            });

            if (!selected.length) return;

            let redirectUrl = selected[0].value;

            if (!redirectUrl) return;

            //if requested url is different than current page url, proceed
            if (window.location.href.indexOf(redirectUrl) !== -1) return;
            window.location.href = redirectUrl;
        },
        setEventBindings() {
            state.node.addEventListener('change', this.onFormChange.bind(this));
        },
        init() {
            if (!exists(state.node)) return;
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
