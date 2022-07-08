import { exists } from '@/helpers/utilities';
import { isMobile } from '@/helpers/utilities';

export let mixin = ({ node = null, config = {} } = {}) => {
    if (!node) return false;

    let state = {
        node,
        config,
        nav: document.querySelector(`.c-nav__bottom`),
        subMenu: node.querySelector(`[data-depth="1"]`),
        link: node.querySelector(`a`),
        parent: node.parentNode,
        isHovering: false,
        isOpen: false,
        justClicked: false,
        openEvent: new CustomEvent('SubMenuOpen'),
    };

    let module = {
        toggleState(isOpen) {
            state.isOpen = isOpen;
        },
        announceOpen() {
            window.dispatchEvent(state.openEvent);
        },
        openSubMenu() {
            this.toggleState(true);
            state.parent.activeTab = state.node;
            this.announceOpen();
            this.toggleNavBar();

            if (!exists(state.subMenu)) return;
            this.setSubMenuEvents();

            state.subMenu.classList.add('js-is-staged');

            window.setTimeout(
                function() {
                    state.subMenu.classList.add('js-is-active');
                    state.subMenu.addEventListener('transitionend', state.onOpenComplete);
                },
                0
            );
        },
        closeSubMenu() {
            this.toggleState(false);
            this.toggleNavBar();
            if (!exists(state.subMenu)) return;
            state.subMenu.classList.remove('js-is-active');
            state.subMenu.addEventListener('transitionend', state.onCloseComplete);
        },
        toggleNavBar(force = null) {
            if (!exists(state.nav)) return;

            let method = force !== null
                ? force ? 'add' : 'remove'
                : state.isOpen ? 'add' : 'remove';

            state.nav.classList[method]('js-is-active');
        },
        onMenuItemLeave(e) {
            if (state.isHovering) return;

            this.closeSubMenu();
        },
        onMenuItemClick(e) {

            if (state.justClicked) return;
            state.justClicked = true;

            this.openSubMenu();

            //double-click debouncing technique
            setTimeout(() => {
                state.justClicked = false;
            }, 150);
        },
        onMenuLinkFocus(e) {
            this.toggleNavBar(true);
        },
        onMenuLinkBlur(e) {
            this.toggleNavBar(false);
        },
        onSubMenuMouseLeave() {
            state.isHovering = false;

            //gives the user a bit of a buffer. so submenu doesn't immediately close on mouseleave
            setTimeout(() => {
                if (state.isHovering) return;

                state.subMenu.removeEventListener('mouseleave', state.onSubmenuMouseLeave);
                this.closeSubMenu();
            }, 300);
        },
        onOpenComplete(e) {
            if (e.propertyName !== 'opacity' || !state.isOpen) return;
            state.subMenu.removeEventListener('transitionend', state.onOpenComplete);
        },
        onCloseComplete(e) {
            if (e.propertyName !== 'opacity' || state.isOpen) return;
            state.subMenu.classList.remove('js-is-staged');
            state.subMenu.removeEventListener('transitionend', state.onCloseComplete);
        },
        onSiblingClick(e) {
            if (state.parent.activeTab == state.node) return;
            this.closeSubMenu();
        },
        subMenuHoverHandler(e) {
            state.isHovering = e.type == 'mouseenter';
        },
        subMenuFocusHandler() {
            state.subMenu.removeEventListener('mouseenter', state.subMenuFocusHandler);
            state.subMenu.addEventListener('mouseleave', state.onSubMenuMouseLeave);
        },
        setSubMenuEvents() {
            state.subMenu.addEventListener('mouseenter', state.subMenuFocusHandler);
            state.subMenu.addEventListener('mouseenter', this.subMenuHoverHandler.bind(this));
            state.subMenu.addEventListener('mouseleave', this.subMenuHoverHandler.bind(this));
        },
        setEventBindings() {
            state.node.addEventListener('mouseenter', this.onMenuItemClick.bind(this));
            state.node.addEventListener('click', this.onMenuItemClick.bind(this));
            if (exists(state.nav)) {
                state.nav.addEventListener('mouseleave', this.onMenuItemLeave.bind(this));
                state.nav.addEventListener('focusin', this.onMenuLinkFocus.bind(this));
                state.nav.addEventListener('focusout', this.onMenuLinkBlur.bind(this));
            }

            window.addEventListener('SubMenuOpen', this.onSiblingClick.bind(this));

            //bound functions
            state.subMenuFocusHandler = this.subMenuFocusHandler.bind(this);
            state.onSubMenuMouseLeave = this.onSubMenuMouseLeave.bind(this);
            state.onOpenComplete = this.onOpenComplete.bind(this);
            state.onCloseComplete = this.onCloseComplete.bind(this);
        },
        init() {
            if (!exists(state.node)) return;
            if (isMobile || window.innerWidth < 1024) return;
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
