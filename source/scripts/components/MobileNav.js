import { exists } from '@/helpers/utilities';
import { isMobile } from '@/helpers/utilities';

export let mixin = ({ node = null, config = {} } = {}) => {
    if (!node) return false;

    let state = {
        node,
        config,
        btn: document.querySelector(`[data-js="mobile-nav-toggle"]`),
        loginBtn: node.querySelector(`[data-js="login-trigger"]`),
        pages: node.querySelectorAll(`[data-js="nav-page"]`),
        basePage: node.querySelector(`[data-js="page-0"]`),
        pageTriggers: node.querySelectorAll(`[data-js="page-trigger"].menu-item-has-children`),
        backLinks: node.querySelectorAll(`[data-js="back-link"]`),
        menuItems: node.querySelectorAll(`.menu-item`),
        slider: node.querySelector(`[data-js="page-slider"]`),
        utilityNav: document.querySelector(`[data-js="mobile-utility-nav"]`),
        activeClass: 'js-is-active',
        parent: node.parentNode,
        justClicked: false,
        justClosed: false,
        isPaged: false,
        isOpen: false,
        depth: 0,
    };

    let module = {
        onBackLinkClick(e) {
            e.preventDefault();
            e.stopPropagation();
            if (state.justClicked) return;
            state.justClicked = true;

            setTimeout(() => {
                state.justClicked = false;
            }, 300);

            this.depth = this.depth - 1;
            this.removeActivePage(e.currentTarget.parentNode);
        },
        onMenuToggleClick(e) {
            if (state.justClicked) return;
            state.justClicked = true;

            setTimeout(() => {
                state.justClicked = false;
            }, 300);

            let method = state.isOpen ? 'remove' : 'add';
            state.node.classList[method](`js-is-active`);
            document.body.classList[method](`scroll-lock`);

            state.isOpen = !state.isOpen;
            state.btn.setAttribute('aria-expanded', state.isOpen);
        },
        onMenuItemClick(e) {
            e.stopPropagation();
        },
        onTriggerClick(e) {
            e.preventDefault();
            e.stopPropagation();

            if (state.justClicked) return;
            state.justClicked = true;

            setTimeout(() => {
                state.justClicked = false;
            }, 300);

            this.setActivePage(e.currentTarget);
        },
        onPageChange() {
            this.setSliderHeight(this.getActivePageHeight());
            this.toggleUtilityNav();
            this.toggleCurrentPageVisibility();
            this.slide();
        },
        slide() {
            if (!exists(state.slider)) return;
            let transformAmount = -100 * this.depth;

            this.applyTransform(state.slider, transformAmount, '%');
        },
        setActivePage(trigger) {
            let activePage = [...state.pages].filter((page) => {
                return page.parentNode == trigger;
            });

            if (!activePage.length) return;
            activePage = activePage[0];
            this.depth = activePage.dataset.depth ? activePage.dataset.depth : 0;

            this.removePagesActiveClass();
            activePage.classList.add(state.activeClass);

            this.toggleState();
            this.onPageChange();
        },
        removeActivePage(activePage) {
            activePage.classList.remove(state.activeClass);

            this.toggleState();
            this.onPageChange();
        },
        toggleCurrentPageVisibility() {
            let currentPage = this.getActivePage();

            [...state.pages].map((page) => {
                if (page.dataset.depth !== this.depth) return;
                page.classList.remove('js-is-current');
            });

            state.basePage.classList.remove('js-is-current');

            currentPage.classList.add('js-is-current');
        },
        toggleUtilityNav() {
            if (!exists(state.utilityNav)) return;
            if (!state.utilityNavHeight) {
                this.setUpUtilityNav();
            }

            let method = state.isPaged ? 'remove' : 'add';
            state.utilityNav.classList[method](state.activeClass);

            state.isPaged ? this.collapse(state.utilityNav) : this.expand(state.utilityNav, state.utilityNavHeight);
        },
        toggleState() {
            state.isPaged = this.depth > 0;
        },
        addTriggersActiveClass() {
            [...state.pageTriggers].map((trigger) => {
                trigger.classList.add(state.activeClass);
            });
        },
        removePagesActiveClass() {
            if (!state.pages.length) return;
            [...state.pages].map((page) => {
                if (page.dataset.depth !== this.depth) return;
                page.classList.remove(state.activeClass);
            });
        },
        removeTriggersActiveClass() {
            [...state.pageTriggers].map((trigger) => {
                trigger.classList.remove(state.activeClass);
            });
        },
        toggleTriggersActiveClass() {
            let method = state.isPaged ? 'removeTriggersActiveClass' : 'addTriggersActiveClass';
            this[method]();
        },
        getActivePage() {
            let activePage = [...state.pages].filter((page) => {
                return page.dataset.depth == this.depth && page.classList.contains(state.activeClass);
            });

            if (!activePage.length) return state.basePage;

            return activePage[0];
        },
        getActivePageHeight() {
            let activePage = this.getActivePage();
            if (!activePage) return 0;
            return `${activePage.offsetHeight}px`;
        },
        setSliderHeight(cssHeight) {
            if (!exists(state.slider)) return;

            state.slider.style.minHeight = `${cssHeight}`;
        },
        setUpUtilityNav() {
            if (!exists(state.utilityNav)) return;
            state.utilityNavHeight = state.utilityNav.offsetHeight;
            state.utilityNav.style.maxHeight = `${state.utilityNavHeight}px`;
        },
        setUpPages() {
            [...state.pages].map((page) => {
                page.classList.remove(state.activeClass);

                let transformAmount = 100;
                this.applyTransform(page, transformAmount, '%');
            });
        },
        applyTransform(element, transform, unit = 'px') {
            element.style.transform = `translateX(${transform}${unit})`;
            element.style.webkitTransform = `translateX(${transform}${unit}])`;
        },
        setEventBindings() {
            if (state.backLinks.length) {
                [...state.backLinks].map((link) => {
                    link.addEventListener('click', this.onBackLinkClick.bind(this));
                });
            }
            if (state.pageTriggers.length) {
                [...state.pageTriggers].map((trigger) => {
                    trigger.addEventListener('click', this.onTriggerClick.bind(this));
                });
            }

            if (state.menuItems.length) {
                [...state.menuItems].map((link) => {
                    link.addEventListener('click', this.onMenuItemClick.bind(this));
                });
            }

            if (exists(state.btn)) {
                state.btn.addEventListener('click', this.onMenuToggleClick.bind(this));
            }

            if (exists(state.loginBtn)) {
                state.loginBtn.addEventListener('click', this.onMenuToggleClick.bind(this));
            }
        },
        init() {
            if (!isMobile || window.innerWidth >= 1200) return;
            this.setEventBindings();
            this.setUpPages();
        },

        /*———— -utils- ————*/
        collapse(element) {
            element.style.maxHeight = 0;
        },
        expand(element, expandedHeight) {
            element.style.maxHeight = `${expandedHeight}px`;
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
