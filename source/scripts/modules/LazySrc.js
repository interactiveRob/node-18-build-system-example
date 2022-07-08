import { exists } from '@/helpers/utilities';

let LazySrc = (({}) => {
    class LazySrc {
        constructor(node) {
            this.node = node;
            this.nodeExists = exists(this.node);
            if (!this.nodeExists) return;
        }

        onImgLoad() {
            this.node.classList.add('js-has-src');
        }

        onWindowLoad() {
            let imgSrc = this.node.dataset.lazySrc;
            if (!imgSrc) return;
            this.node.setAttribute('src', imgSrc);
        }

        setEventBindings() {
            window.addEventListener('load', this.onWindowLoad());

            this.node.addEventListener('load', this.onImgLoad.bind(this));
        }

        init() {
            if (!this.nodeExists) return;
            this.setEventBindings();
        }
    }

    return {
        init({ selector }) {
            let nodeList = document.querySelectorAll(selector);
            if (!nodeList.length) return;

            return [...nodeList].map((node) => {
                let module = new LazySrc(node);

                module.init();

                return module;
            });
        },
    };
})(window);

export default Object.create(LazySrc);
