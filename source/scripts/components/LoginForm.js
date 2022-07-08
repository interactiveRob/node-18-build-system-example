import { exists } from '@/helpers/utilities';

export let mixin = () => {
    let state = {
        triggers: document.querySelectorAll(`[data-js="login-trigger"]`),
        modal: document.querySelector(`[data-js="login-form"]`),
        userName: document.querySelector(`[data-js="login-form"] [name="UserName"]`),
        isOpen: false,
        justOpened: false,
        openEvent: new CustomEvent('modalOpen'),
    };

    let module = {
        focusInput() {
            if (!exists(state.userName)) return;
            state.userName.focus();
        },
        toggleModal() {
            let method = state.isOpen ? 'remove' : 'add';
            state.modal.classList[method](`js-is-active`);

            state.isOpen = !state.isOpen;
            if (state.isOpen) {
                this.focusInput();
                this.announceOpen();
            }
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
        setEventBindings() {
            if (!state.triggers.length) return;

            [...state.triggers].map((trigger) => {
                trigger.addEventListener('click', this.toggleModal.bind(this));
            });

            window.addEventListener('modalOpen', this.onModalOpen.bind(this));
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
