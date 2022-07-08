import { exists } from '@/helpers/utilities';
import Dots from '@/components/Dots';

let HeroSlideshow = (() => {
    class HeroSlideshow {
        constructor(selector) {
            this.node = document.querySelector(selector);
            this.nodeExists = exists(this.node);
            if (!this.nodeExists) return;

            this.slides = Array.from(this.node.querySelectorAll('[data-js="slide"]'));
            this.dots = new Dots(this.node.querySelector(`[data-js='dots']`), this.slides.length);

            //slideshow state and settings
            this.mode = this.viewportWidth > 1024 ? this.desktop : this.mobile;
            this.step = 0;
            this.nextStep = null;
            this.prevStep = null;
            this.speed = 2000;
            this.duration = 6600;
            this.isDragging = false;
        }

        setVisibility(step) {
            this.slides.map((slide) => {
                slide.classList.add('js-is-hidden');
            });

            this.slides[step].classList.remove('js-is-hidden');
        }

        setStep(step) {
            this.step = step;
            this.nextStep = this.step < this.slides.length - 1 ? this.step + 1 : 0;
            this.prevStep = this.step > 0 ? this.step - 1 : this.slides.length - 1;

            this.setVisibility(step);
            this.dots.update(step);
        }

        onDotClick(e) {
            let selectedStep = parseInt(e.target.dataset.step);
            if (selectedStep == this.step) return;
            this.setStep(selectedStep);
        }

        advanceSlideshow() {
            this.setStep(this.nextStep);
        }

        clearSlideshowTimer() {
            clearInterval(this.slideshowInterval); //just stops the interval function...
            this.slideshowInterval = null;
            /*... so we need to manually set the interval variable
            to a falsy condition in order to check interval state */
        }

        runSlideshow() {
            if (this.slideshowInterval) return;
            //raise this timer up in the scope so it can be cancelled if needed
            this.slideshowInterval = setInterval(this.advanceSlideshow.bind(this), this.duration);
        }

        setEventBindings() {
            [...this.dots.dots].map((dot) => {
                dot.addEventListener('click', this.onDotClick.bind(this));
            });
        }

        init() {
            if (!this.nodeExists) return;
            this.setEventBindings();

            //always start at 0
            this.setStep(0);
            this.runSlideshow();
        }
    }

    return {
        init({ selector }) {
            return new HeroSlideshow(selector).init();
        },
    };
})();

export default Object.create(HeroSlideshow);
