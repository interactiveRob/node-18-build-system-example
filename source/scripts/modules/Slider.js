import { tns } from 'tiny-slider/src/tiny-slider';
import { exists } from '@/helpers/utilities';

export let mixin = ({ node = null, config = {} }) => {
    if (!node) return false;

    let settings = Object.assign(
        {
            container: node,
            items: 1,
            speed: 800,
            autoplay: true,
            autoplayTimeout: 6500,
            mouseDrag: true,
            center: true,
            rewind: false,
            gutter: 10,
            onInit: () => {
                setTimeout(() => {
                    node.classList.add('js-is-ready');
                }, 600);
            },
        },
        config
    );

    let state = {
        node,
        config,
        slider: null,
        sliderNav: document.querySelector(`[data-js="slider-nav"]`),
        justRan: false,
        currentTransform: 0,
        subSlider: settings.subSlider,
    };

    let module = {
        initPlugin() {
            state.slider = tns(settings);
        },
        onsubSliderChange() {
            let info = state.slider.getInfo();
            let subinfo = state.subSlider.getInfo();
            if (info.index == subinfo.index) return;
            let currentSlideIndex = subinfo.index;

            state.slider.goTo(currentSlideIndex);
        },
        onSliderChange() {
            if (typeof settings.onSliderChange !== 'function') return;
            settings.onSliderChange(state);
        },
        onResize() {
            window.setTimeout( state.slider.refresh, 0 );
        },
        onNavBtnClick(e) {
            e.preventDefault();
            let clickedElement = e.currentTarget;
            let targetSlide = clickedElement.dataset.target;

            state.slider.goTo(targetSlide);
        },
        setNavEvents() {
            let triggers = [...state.sliderNav.querySelectorAll(`[data-target]`)];

            if (!triggers.length) return;

            triggers.map((trigger) => {
                trigger.addEventListener('click', this.onNavBtnClick.bind(this));
            });
        },
        setEventBindings() {
            state.slider.events.on('indexChanged', this.onSliderChange.bind(this));
            window.addEventListener('resize', this.onSliderChange.bind(this));
            window.addEventListener('resize', this.onResize.bind(this));

            if (!exists(state.subSlider)) return;
            state.subSlider.events.on('indexChanged', this.onsubSliderChange.bind(this));

            if (!exists(state.sliderNav)) return;
            this.setNavEvents();
        },
        init() {
            this.initPlugin();
            this.setEventBindings();
            this.onSliderChange();

            return state.slider;
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
