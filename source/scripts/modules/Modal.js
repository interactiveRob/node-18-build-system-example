import { jsClasses } from '@/helpers/settings';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

let Modal = (({}) => {
    class Modal {
        constructor(node, options = {}) {
            this.node = node;
            this.window = window;
            this.settings = this.getSettings(options);
            this.pluginOptions = {
                reserveScrollBarGap: true,
            };
            this.data = this.node.dataset;
            this.listeners = document.querySelectorAll(`[data-modal-target="${this.data.modalId}"]`);
            this.overlay = this.node.querySelector('[data-js="overlay"]');
            this.onWindowClickBound = this.onWindowClick.bind(this);
            this.closeEvent = new CustomEvent('modalClose');
            this.openEvent = new CustomEvent('modalOpen');
            this.justClicked = false;
        }

        getSettings(options = {}) {
            return Object.assign(
                {},
                {
                    activeClass: jsClasses.open,
                },
                options
            );
        }

        getBooleanFromAction(action, modalIsActive = false) {
            let manifest = {
                open: true,
                close: false,
                toggle: !modalIsActive,
            };

            return action in manifest ? manifest[action] : manifest.toggle;
        }

        toggle(shouldOpen) {
            if (this.justClicked) return;

            setTimeout(
                () => {
                    this.node.setAttribute('aria-hidden', shouldOpen);
                    this.node.classList.toggle(this.settings.activeClass, shouldOpen);
                },
                shouldOpen ? 0 : 800
            );

            shouldOpen ? disableBodyScroll(this.node, this.pluginOptions) : clearAllBodyScrollLocks();

            this.setModalOverlayEventBindings(shouldOpen);

            //emit event
            let event = shouldOpen ? this.openEvent : this.closeEvent;
            this.node.dispatchEvent(event);

            this.justClicked = true;

            setTimeout(() => {
                this.justClicked = false;
            }, 400);
        }

        onWindowClick(event) {
            let target = event.target;
            let overlayWasClicked = target == this.overlay;

            if (!overlayWasClicked) return;

            this.toggle(false);
        }

        setModalOverlayEventBindings(shouldOpen) {
            if (this.data.closeable == 'false') return;
            if (!shouldOpen) {
                this.window.removeEventListener('click', this.onWindowClickBound);
                return;
            }

            return this.window.addEventListener('click', this.onWindowClickBound);
        }

        onClick(event) {
            event.preventDefault();

            let modalIsActive = this.node.classList.contains(this.settings.activeClass);
            let target = event.currentTarget;
            let targetData = target.dataset;
            let shouldOpen = this.getBooleanFromAction(targetData.action, modalIsActive);

            this.toggle(shouldOpen);
        }

        handleServerSideOpen() {
            /* if the modal is already set open when this class 
            is instantiated, then lock body scroll and set state*/
            if (this.node.classList.contains(this.settings.activeClass)) {
                this.toggle(true);
            }
        }

        setEventBindings() {
            [...this.listeners].map((element) => {
                element.addEventListener('click', this.onClick.bind(this));
            });

            this.node.addEventListener('requestClose', this.toggle.bind(this, false));
        }

        init() {
            this.setEventBindings();
            this.handleServerSideOpen();
        }
    }

    return {
        init({ selector }) {
            let nodeList = document.querySelectorAll(selector);
            if (!nodeList.length) return;

            return [...nodeList].map((node) => {
                let module = new Modal(node);

                module.init();

                return module;
            });
        },
    };
})(window);

export default Object.create(Modal);
