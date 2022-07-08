import 'core-js/stable';
import DragScroll from '@/modules/dragScroll';
import ImageCallout from '@/components/ImageCallout';
import HeroSlideshow from '@/components/HeroSlideshow';
import LazySrc from '@/modules/LazySrc';
import MenuItems from '@/modules/MenuItems';
import MobileNav from '@/components/MobileNav';
import Modal from '@/modules/Modal';
import NavOffset from '@/modules/NavOffset';
import SmoothScroll from 'smooth-scroll/dist/smooth-scroll.js';
import LoginForm from '@/components/LoginForm';
import SearchForm from '@/components/SearchForm';
import { sliders } from '@/modules/Sliders';
import LoadMore from '@/modules/LoadMore';
import TaxSelector from '@/components/TaxSelector';
import TemenosLinks from './modules/TemenosLinks';

document.addEventListener('DOMContentLoaded', function () {
    const smoothScroll = new SmoothScroll('a[href*="#"]', {
        speed: 800,
    });

    LazySrc.init({
        selector: `[data-lazy-src]`,
    });

    Modal.init({
        selector: `[data-modal-id]`,
    });

    DragScroll.init({
        selector: '[data-js="draggable"]',
    });

    ImageCallout.init({
        selector: `[data-js="flush-image"] img`,
    });

    HeroSlideshow.init({
        selector: `[data-js="slideshow"]`,
    });

    LoadMore.init({
        selector: `[data-js="ajax-button"]`,
    });

    LoginForm.init();

    MenuItems.init({
        selector: `.menu-item.is-top-level`,
    });

    MobileNav.init({
        selector: `.c-mobile-nav`,
    });

    NavOffset.init({
        selector: `.c-nav`,
    });

    sliders.init();

    SearchForm.init();

    TaxSelector.init({
        selector: '[data-js="tax-selector-form"]',
    });

    TemenosLinks.init({
        selector: '[href*="?accountMinor"]',
    });
});

window.addEventListener('load', () => {});
