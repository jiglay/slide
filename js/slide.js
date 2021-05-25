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

    transition(active) {
        this.slide.style.transition = active ? 'transform .3s' : '';
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
        this.transition(false);
    }

    onStartTouch(event) {
        this.dist.startPosition = event.changedTouches[0].clientX;
        this.wrapper.addEventListener('touchmove', this.onMove);
        this.transition(false);
    }

    onMove(event) {
        const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
        const finalPosition = this.updatePosition(pointerPosition);
        this.moveSlide(finalPosition);
    }

    onEnd(event) {
        const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
        this.wrapper.removeEventListener(moveType, this.onMove);
        this.dist.finalPosition = this.dist.movePosition;
        this.transition(true);
        this.changeSlideOnEnd();
    }

    changeSlideOnEnd() {
        if (this.dist.movement > 120 && this.index.next !== undefined)
            this.activeNextSlide();
        else if (this.dist.movement < -120 && this.index.prev !== undefined)
            this.activePrevSlide();
        else
            this.changeSlide(this.index.active);
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

    // slides config

    slidePosition(slide) {
        // margin para a imagem ficar exatamente no centro, independente do tamanho de tela
        const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
        return -(slide.offsetLeft - margin);
    }

    slidesConfig() {
        this.slideArray = [...this.slide.children].map(element => {
            const position = this.slidePosition(element);
            return { position, element };
        });
    }

    slidesIndexNav(index) {
        const last = this.slideArray.length - 1;
        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index === last ? undefined : index + 1,
        };
    }

    changeSlide(index) {
        const activeSlide = this.slideArray[index];

        this.moveSlide(activeSlide.position);
        this.slidesIndexNav(index);
        this.dist.finalPosition = activeSlide.position;
    }

    activePrevSlide() {
        if(this.index.prev !== undefined) this.changeSlide(this.index.prev);
    }

    activeNextSlide() {
        if(this.index.next !== undefined) this.changeSlide(this.index.next);
    }

    init() {
        this.bindEvents();
        this.transition(true);
        this.addSlideEvents();
        this.slidesConfig();
        this.slidesIndexNav(0);
        return this;
    }
}