/**
 * Base Sprite class for game objects
 */
class Sprite {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color || '#FF0000';
        this.speedX = 0;
        this.speedY = 0;
        this.isActive = true;
    }
    
    update() {
        // Base update method to be overridden
    }
    
    draw(ctx) {
        if (!this.isActive) return;
        
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

/**
 * AnimatedSprite extends Sprite with animation capabilities
 */
class AnimatedSprite extends Sprite {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
        
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 0;
        this.fps = 20;
        this.frameTimer = 0;
        this.frameInterval = 1000 / this.fps;
        this.image = null;
        this.animations = {};
        this.currentAnimation = 'idle';
    }
    
    setImage(image) {
        this.image = image;
    }
    
    addAnimation(name, frames, row) {
        this.animations[name] = {
            frames: frames,
            row: row
        };
    }
    
    playAnimation(name) {
        if (this.currentAnimation !== name && this.animations[name]) {
            this.currentAnimation = name;
            this.frameX = 0;
            this.frameY = this.animations[name].row;
            this.maxFrame = this.animations[name].frames;
        }
    }
    
    updateAnimation(deltaTime) {
        // Update animation frame
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
        } else {
            this.frameTimer += deltaTime;
        }
    }
    
    draw(ctx) {
        if (!this.isActive || !this.image) {
            // Fall back to basic rectangle if no image is available
            super.draw(ctx);
            return;
        }
        
        const frameWidth = this.image.width / (this.maxFrame + 1);
        const frameHeight = this.image.height / Object.keys(this.animations).length;
        
        ctx.drawImage(
            this.image,
            this.frameX * frameWidth,
            this.frameY * frameHeight,
            frameWidth,
            frameHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}
