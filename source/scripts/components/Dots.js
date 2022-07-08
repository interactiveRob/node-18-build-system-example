import { exists } from '@/helpers/utilities';

export default class Dots {
    constructor(node, numSteps) {
        this.node = node;
        this.maxStep = numSteps;
        this.dots = null;

        this.nodeExists = exists(this.node);
        if (!this.nodeExists) return;

        this.init();
    }

    getDots() {
        this.dots = this.node.children;
    }

    createDots() {
        let steps = Array.from({ length: this.maxStep });

        steps.map((step, index) => {
            let activeClass = index == 0 ? 'js-is-active' : '';

            this.node.insertAdjacentHTML(
                'beforeend',
                `<button class="c-dot ${activeClass}" data-action="navigate" data-step=${index}></button>`
            );
        });
    }

    update(step) {
        if (typeof step == 'undefined' || step == null) return;
        if (!this.dots.length) return;

        [...this.dots].map((dot) => {
            dot.classList.remove('js-is-active');
        });

        this.dots[step].classList.add('js-is-active');
    }

    init() {
        this.createDots();
        this.getDots();
    }
}
