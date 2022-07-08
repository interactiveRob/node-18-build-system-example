import { exists } from '@/helpers/utilities';
import { isMobile } from '@/helpers/utilities';

const LoadMore = (() => {
    class LoadMore {
        constructor(selector) {
            this.node = document.querySelector(selector);
            this.container = document.querySelector('[data-js="ajax-container"]');

            this.nodeExists = exists(this.node);
            if (!this.nodeExists) return;

            this.ajaxURL = '/wp-admin/admin-ajax.php';
            this.action = this.node.dataset.action;
            this.currentPage = 1;
            this.nextPage = this.currentPage + 1;
            this.maxPage = this.node.dataset.maxPage;
            this.containerHeight = this.container.offsetHeight;
            this.btnText = this.node.textContent;
            this.isLoading = false;
            this.justClicked = false;
        }

        getPosts() {
            let data = {
                action: this.action,
                paged: this.nextPage,
            };

            fetch(this.ajaxURL, {
                method: 'POST',
                body: this.buildQuery(data),
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
                .then((response) => {
                    return response.json();
                })
                .then((responseJSON) => {
                    this.onFetchSuccess(responseJSON);
                })
                .catch((errMsg) => {
                    console.log(errMsg);
                });
        }

        getContainerHeight() {
            this.containerHeight = this.container.offsetHeight;
        }

        renderContent(content) {
            if (typeof content == 'undefined' || content == null) return;
            this.setUpReveal();

            this.container.insertAdjacentHTML('beforeend', content);

            setTimeout(() => {
                this.animateReveal();
            }, 200);
        }

        setUpReveal() {
            this.container.classList.remove('js-no-transition');
            this.container.style.maxHeight = this.containerHeight + 'px';
        }

        animateReveal() {
            this.container.classList.add('js-no-transition');
            this.container.style.maxHeight = 'unset';

            let expandedHeight = this.container.offsetHeight;

            this.setUpReveal();

            setTimeout(() => {
                this.container.style.maxHeight = expandedHeight + 'px';
                this.containerHeight = expandedHeight;
            }, 50); //small timeout needed to wait for container transition
        }

        cleanUp() {
            this.toggleLoadingState();

            if (this.currentPage < this.maxPage) return;
            this.hide(this.node);
        }

        toggleLoadingState() {
            this.isLoading = !this.isLoading;

            if (this.isLoading) {
                this.node.classList.add('js-is-loading');
                this.node.textContent = 'Loading...';
            } else {
                this.node.classList.remove('js-is-loading');
                this.node.textContent = this.btnText;
            }
        }

        onFetchSuccess(responseJSON) {
            this.currentPage++;
            this.nextPage++;

            this.renderContent(responseJSON.html);
            this.cleanUp();
        }

        onButtonClick() {
            if (this.justClicked || this.isLoading) return;

            this.debounceClick();
            this.getPosts();
            this.toggleLoadingState();
        }

        onWindowLoad() {
            this.getContainerHeight();
        }

        checkForPosts() {
            if (this.node.dataset.maxPage > 1) return;

            this.hide(this.node);
        }

        setEventBindings() {
            this.node.addEventListener('click', this.onButtonClick.bind(this));
            window.addEventListener('load', this.onWindowLoad.bind(this));
        }

        debounceClick() {
            this.justClicked = true;

            setTimeout(() => {
                this.justClicked = false;
            }, 800);
        }

        init() {
            if (!this.nodeExists) return;
            this.setEventBindings();
            this.checkForPosts();
        }

        /*———— -utilities- ————*/
        buildQuery(data) {
            // If the data is already a string, return it as-is
            if (typeof data === 'string') return data;

            // Create a query array to hold the key/value pairs
            var query = [];

            // Loop through the data object
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    // Encode each key and value, concatenate them into a string, and push them to the array
                    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
                }
            }

            // Join each item in the array with a `&` and return the resulting string
            return query.join('&');
        }

        hide(node) {
            node.style.opacity = 0;
        }

        show(node) {
            node.style.opacity = 1;
        }
    }

    return {
        init({ selector }) {
            return new LoadMore(selector).init();
        },
    };
})();

export default Object.create(LoadMore);
