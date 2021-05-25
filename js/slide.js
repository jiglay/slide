export default class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        this.dist ={ 
            startPosition: 0,
            finalPosition: 0,
            movement: 0
        };

        this.init();
    }

    updatePosition(clientX) {
        // 1.6 para o movimento ser mais rápido
        this.dist.movement = (this.dist.startPosition - clientX) * 1.6;
        return this.dist.finalPosition - this.dist.movement;
    }

    moveSlide(distX) {
        this.dist.movePosition = distX;
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
    }

    onStartMouse(event) {
        event.preventDefault();
        this.dist.startPosition = event.clientX;
        this.wrapper.addEventListener('mousemove', this.onMove);
    }

    onStartTouch(event) {
        this.dist.startPosition = event.changedTouches[0].clientX;
        this.wrapper.addEventListener('touchmove', this.onMove);
    }

    onMove(event) {
        const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
        const finalPosition = this.updatePosition(pointerPosition);
        this.moveSlide(finalPosition);
    }

    onEnd(event) {
        this.wrapper.removeEventListener('mousemove', this.onMove);
        this.dist.finalPosition = this.dist.movePosition;
    }

    addSlideEvents() {
        this.wrapper.addEventListener('mousedown', this.onStartMouse);
        this.wrapper.addEventListener('touchstart', this.onStartTouch);
        this.wrapper.addEventListener('mouseup', this.onEnd);
        this.wrapper.addEventListener('touchend', this.onEnd);
    }

    bindEvents() {
        this.onStartMouse = this.onStartMouse.bind(this);
        this.onStartTouch = this.onStartTouch.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();
        return this;
    }
}