import { exists } from '@/helpers/utilities';

export let mixin = () => {
    let state = {
        triggers: document.querySelectorAll(`[data-js="search-trigger"]`),
        modal: document.querySelector(`[data-js="search-modal"]`),
        isOpen: false,
        justOpened: false,
        openEvent: new CustomEvent('modalOpen'),
        input: document.querySelector(`[data-js="search-modal"] [name="s"]`),
        triggeringElement: null
    };

    let module = {
        focusInput() {
            if (!exists(state.input)) return;
            state.input.focus();
        },
        toggleModal(e) {
            e.stopPropagation();
            if (e.currentTarget == document && !state.isOpen) return;
            let method = state.isOpen ? 'closeModal' : 'openModal';
            this[method](e);
        },
        openModal(e) {

            state.triggeringElement = e.currentTarget;
            state.isOpen = true;
            state.modal.classList.add('js-is-staged');

            window.setTimeout(
                function() {
                    state.modal.classList.add('js-is-active');
                    state.modal.addEventListener('transitionend', state.onOpenComplete);
                },
                0
            );

            this.focusInput();
            this.announceOpen();
        },
        closeModal(e) {

            state.isOpen = false;
            if ( exists( state.triggeringElement ) ) {
                state.triggeringElement.focus();
            }
            state.modal.classList.remove('js-is-active');
            state.modal.addEventListener('transitionend', state.onCloseComplete);
        },
        onModalOpen() {
            if (state.justOpened) return;
            if (!state.isOpen) return;

            this.toggleModal();
        },
        announceOpen() {
            state.justOpened = true;
            window.dispatchEvent(state.openEvent);

            setTimeout(() => {
                state.justOpened = false;
            }, 500);
        },
        onOpenComplete(e) {
            if (e.propertyName !== 'opacity' || !state.isOpen) return;
            state.modal.removeEventListener('transitionend', state.onOpenComplete);
        },
        onCloseComplete(e) {
            if (e.propertyName !== 'opacity' || state.isOpen) return;
            state.modal.classList.remove('js-is-staged');
            state.modal.removeEventListener('transitionend', state.onCloseComplete);
        },
        setEventBindings() {
            if (!state.triggers.length) return;

            [...state.triggers].map((trigger) => {
                trigger.addEventListener('click', this.toggleModal.bind(this));
            });

            state.modal.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            document.addEventListener('click', this.toggleModal.bind(this));

            window.addEventListener('modalOpen', this.onModalOpen.bind(this));

            // Bound functions
            state.onOpenComplete = this.onOpenComplete.bind(this);
            state.onCloseComplete = this.onCloseComplete.bind(this);
        },
        init() {
            if (!exists(state.modal)) return;
            this.setEventBindings();
        },
    };

    return module.init();
};

export default {
    init() {
        return mixin();
    },
};
