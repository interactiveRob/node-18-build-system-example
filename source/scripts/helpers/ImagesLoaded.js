export default class ImagesLoaded {
    constructor(node, callback) {
        this.node = node;
        this.callback = callback;

        this.nodeExists = typeof this.node !== 'undefined' && this.node !== null;
        if (!this.nodeExists) return;

        this.images = Array.from(this.node.querySelectorAll('img'));
    }

    imageIsLoaded(image){
        return image.dataset.loaded;
    }

    markLoaded(image){
        image.dataset.loaded = true;
    }

    allImagesLoaded(){
        return this.images.every(image => this.imageIsLoaded(image));
    }

    checkAllLoaded(){
        if(!this.allImagesLoaded()) return;
        this.runCallback();
    }

    runCallback(){
        this.callback();
    }

    onImageLoaded(e){
        this.markLoaded(e.currentTarget);
        this.checkAllLoaded();
    }

    setEventBindings(){
        this.images.map(image =>{
            image.addEventListener('load', this.onImageLoaded.bind(this));
        });
    }

    init() {
        if (!this.nodeExists) return;
        this.setEventBindings();
    }
}   