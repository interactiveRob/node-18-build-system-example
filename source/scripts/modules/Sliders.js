import Slider from '@/modules/Slider';
import { exists } from '@/helpers/utilities';

export let sliders = {
    init() {
        /*———— -Tiers Content Slider- ————*/
        let contentSlider = Slider.init({
            selector: '[data-js="tiers-content-slider"]',
            config: {
                autoHeight: true,
                autoWidth: false,
                autoplay: false,
                controls: false,
                center: false,
                loop: false,
            },
            onSliderChange: (state) => {},
        });

        /*———— -Tiers Nav Slider- ————*/
        if (!exists(contentSlider)) return;
        Slider.init({
            selector: '[data-js="tiers-slider"]',
            config: {
                subSlider: contentSlider.length ? contentSlider[0] : null,
                autoHeight: true,
                autoplay: false,
                controls: false,
                center: true,
                fixedWidth: 200,
                loop: false,
                onSliderChange: (state) => {
                    let info = state.slider.getInfo(),
                        indexPrev = info.indexCached,
                        indexCurrent = info.index;
                    let currentSlideIndex = info.index;
                    let subSlider = state.config.subSlider;
                    info.slideItems[indexPrev].classList.remove('js-is-active');
                    info.slideItems[indexCurrent].classList.add('js-is-active');

                    if (!subSlider) return;
                    subSlider.goTo(currentSlideIndex);

                    let dots = document.querySelectorAll(`[data-js="tier-slider-dots"] .c-slider-dot`);

                    if (!dots.length) return;

                    [...dots].map((dot) => {
                        dot.classList.remove('js-is-active');
                    });

                    dots[currentSlideIndex].classList.add('js-is-active');
                },
            },
        });
    },
};
