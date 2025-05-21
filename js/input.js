/**
 * Input handler for keyboard controls
 */
class InputHandler {
    constructor() {
        this.keys = {};
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.touchThreshold = 30; // Minimum swipe distance
        
        // Set up event listeners
        window.addEventListener('keydown', this.keyDown.bind(this));
        window.addEventListener('keyup', this.keyUp.bind(this));
        
        // Touch controls for mobile
        window.addEventListener('touchstart', this.touchStart.bind(this));
        window.addEventListener('touchmove', this.touchMove.bind(this));
        window.addEventListener('touchend', this.touchEnd.bind(this));
    }
    
    keyDown(e) {
        this.keys[e.code] = true;
    }
    
    keyUp(e) {
        this.keys[e.code] = false;
    }
    
    touchStart(e) {
        e.preventDefault();
        this.touchStartX = e.changedTouches[0].screenX;
        this.touchStartY = e.changedTouches[0].screenY;
    }
    
    touchMove(e) {
        e.preventDefault();
    }
    
    touchEnd(e) {
        e.preventDefault();
        this.touchEndX = e.changedTouches[0].screenX;
        this.touchEndY = e.changedTouches[0].screenY;
        
        // Calculate swipe direction
        const dx = this.touchEndX - this.touchStartX;
        const dy = this.touchEndY - this.touchStartY;
        
        // Horizontal swipe
        if (Math.abs(dx) > this.touchThreshold) {
            if (dx > 0) {
                this.keys['ArrowRight'] = true;
                setTimeout(() => { this.keys['ArrowRight'] = false; }, 100);
            } else {
                this.keys['ArrowLeft'] = true;
                setTimeout(() => { this.keys['ArrowLeft'] = false; }, 100);
            }
        }
        
        // Vertical swipe (up = jump)
        if (dy < -this.touchThreshold) {
            this.keys['Space'] = true;
            setTimeout(() => { this.keys['Space'] = false; }, 100);
        }
    }
    
    isPressed(keyCode) {
        return this.keys[keyCode] === true;
    }
    
    reset() {
        this.keys = {};
    }
}
