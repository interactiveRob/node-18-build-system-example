import { exists } from '@/helpers/utilities';

export let mixin = ({ selector = null, config = {} } = {}) => {
    if (!selector) return false;

    let module = {
        openModal(url) {
            let accountMinor = this.getQueryParameter('accountMinor', url);
            let accountName = this.getQueryParameter('accountName', url);
            if (!accountMinor || !accountName) return;

            OpenAnAccount(decodeURIComponent(accountMinor), decodeURIComponent(accountName));
        },
        onLinkCLick(e) {
            e.preventDefault();
            let url = e.currentTarget.getAttribute('href');

            this.openModal(url);
        },
        setEventBindings() {
            window.addEventListener('load', this.openModal.bind(this, window.location.href));

            let allLinks = document.querySelectorAll(selector);
            if (!allLinks.length) return;

            [...allLinks].map((link) => {
                link.addEventListener('click', this.onLinkCLick.bind(this));
            });
        },
        getQueryParameter(field, url) {
            var href = url ? url : window.location.href;
            var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
            var string = reg.exec(href);
            return string ? string[1] : null;
        },

        init() {
            this.setEventBindings();
        },
    };

    return module.init();
};

export default {
    init({ selector, config = {} }) {
        return mixin({ selector, config });
    },
};
