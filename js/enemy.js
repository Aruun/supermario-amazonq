/**
 * Enemy class for obstacles that can hurt the player
 */
class Enemy extends Sprite {
    constructor(x, y, type = 'basic') {
        let color, width, height;
        
        switch (type) {
            case 'walker':
                color = '#8B0000';
                width = 40;
                height = 40;
                break;
            case 'flyer':
                color = '#800080';
                width = 40;
                height = 30;
                break;
            case 'jumper':
                color = '#006400';
                width = 35;
                height = 45;
                break;
            default:
                color = '#8B0000';
                width = 40;
                height = 40;
        }
        
        super(x, y, width, height, color);
        
        this.type = type;
        this.speedX = type === 'walker' ? -1.5 : 0;
        this.speedY = 0;
        this.gravity = type === 'flyer' ? 0 : 0.3;
        this.direction = -1; // -1 left, 1 right
        this.moveTimer = 0;
        this.moveInterval = 2000; // Time before changing direction (ms)
        this.jumpTimer = 0;
        this.jumpInterval = 3000; // Time between jumps (ms)
        this.isDefeated = false;
        this.defeatTimer = 0;
        this.defeatDuration = 500; // Time to show defeat animation (ms)
    }
    
    update(deltaTime, platforms, player) {
        if (!this.isActive) return;
        
        if (this.isDefeated) {
            this.defeatTimer += deltaTime;
            if (this.defeatTimer >= this.defeatDuration) {
                this.isActive = false;
            }
            return;
        }
        
        // Store previous position
        const prevX = this.x;
        const prevY = this.y;
        
        // Apply gravity if not a flyer
        if (this.type !== 'flyer') {
            this.speedY += this.gravity;
        }
        
        // Update position
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Enemy behavior based on type
        switch (this.type) {
            case 'walker':
                // Check if about to fall off platform
                let onGround = false;
                let aboutToFall = true;
                
                for (const platform of platforms) {
                    // Check if standing on platform
                    if (this.x + this.width > platform.x && 
                        this.x < platform.x + platform.width &&
                        Math.abs((this.y + this.height) - platform.y) < 5) {
                        onGround = true;
                        
                        // Check if about to walk off edge
                        const lookAheadX = this.speedX < 0 ? 
                            this.x - 5 : this.x + this.width + 5;
                            
                        if (lookAheadX >= platform.x && 
                            lookAheadX <= platform.x + platform.width) {
                            aboutToFall = false;
                        }
                    }
                    
                    // Check for horizontal collisions with platforms
                    if (checkCollision(this.getBounds(), platform.getBounds())) {
                        // Collision from left or right
                        if ((prevX + this.width <= platform.x + 5) || 
                            (prevX >= platform.x + platform.width - 5)) {
                            this.speedX *= -1;
                            this.direction *= -1;
                            this.x = prevX;
                        }
                        
                        // Collision from top or bottom
                        if (prevY + this.height <= platform.y + 5 && this.speedY > 0) {
                            this.y = platform.y - this.height;
                            this.speedY = 0;
                            onGround = true;
                        } else if (prevY >= platform.y + platform.height - 5 && this.speedY < 0) {
                            this.y = platform.y + platform.height;
                            this.speedY = 0;
                        }
                    }
                }
                
                // Turn around if about to fall
                if (onGround && aboutToFall) {
                    this.speedX *= -1;
                    this.direction *= -1;
                }
                break;
                
            case 'flyer':
                // Flying enemy moves in a sine wave pattern
                this.moveTimer += deltaTime;
                
                // Change direction periodically
                if (this.moveTimer >= this.moveInterval) {
                    this.moveTimer = 0;
                    this.speedX = -this.speedX;
                    this.direction *= -1;
                }
                
                // Vertical sine wave movement
                this.y = prevY + Math.sin(this.moveTimer / 500) * 2;
                
                // If no horizontal speed is set, start moving
                if (this.speedX === 0) {
                    this.speedX = -1.5;
                }
                break;
                
            case 'jumper':
                // Jumper enemy jumps periodically
                if (this.onGround) {
                    this.jumpTimer += deltaTime;
                    
                    if (this.jumpTimer >= this.jumpInterval) {
                        this.jumpTimer = 0;
                        this.speedY = -8; // Jump force
                        this.onGround = false;
                        
                        // Jump toward player if in range
                        if (player && Math.abs(this.x - player.x) < 200) {
                            this.direction = player.x < this.x ? -1 : 1;
                            this.speedX = this.direction * 2;
                        }
                    }
                }
                
                // Check platform collisions
                this.onGround = false;
                for (const platform of platforms) {
                    if (checkCollision(this.getBounds(), platform.getBounds())) {
                        // Landing on platform
                        if (prevY + this.height <= platform.y + 5 && this.speedY > 0) {
                            this.y = platform.y - this.height;
                            this.speedY = 0;
                            this.onGround = true;
                            this.speedX = 0; // Stop horizontal movement when landing
                        }
                        // Hitting platform from below
                        else if (prevY >= platform.y + platform.height - 5 && this.speedY < 0) {
                            this.y = platform.y + platform.height;
                            this.speedY = 0;
                        }
                        // Horizontal collision
                        else if ((prevX + this.width <= platform.x + 5) || 
                                (prevX >= platform.x + platform.width - 5)) {
                            this.speedX *= -1;
                            this.direction *= -1;
                            this.x = prevX;
                        }
                    }
                }
                break;
        }
        
        // Keep enemy within screen bounds
        if (this.x < 0) {
            this.x = 0;
            this.speedX *= -1;
            this.direction *= -1;
        }
        if (this.x + this.width > 800) {
            this.x = 800 - this.width;
            this.speedX *= -1;
            this.direction *= -1;
        }
        if (this.y < 0) {
            this.y = 0;
            this.speedY = 0;
        }
        if (this.y + this.height > 600) {
            this.y = 600 - this.height;
            this.speedY = 0;
            this.onGround = true;
        }
    }
    
    defeat() {
        if (this.isDefeated) return;
        
        this.isDefeated = true;
        this.defeatTimer = 0;
        this.speedX = 0;
        this.speedY = 0;
        
        // Create particle effect
        createParticles(
            this.x + this.width / 2,
            this.y + this.height / 2,
            15,
            this.color,
            document.getElementById('game-canvas')
        );
    }
    
    draw(ctx) {
        if (!this.isActive) return;
        
        if (this.isDefeated) {
            // Draw defeat animation (flattened enemy)
            ctx.fillStyle = this.color;
            ctx.fillRect(
                this.x, 
                this.y + this.height - 10, 
                this.width, 
                10
            );
            return;
        }
        
        // Draw the enemy
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw eyes
        ctx.fillStyle = '#FFFFFF';
        const eyeSize = 8;
        const eyeY = this.y + 10;
        
        if (this.direction === 1) {
            ctx.fillRect(this.x + this.width - 15, eyeY, eyeSize, eyeSize);
        } else {
            ctx.fillRect(this.x + 7, eyeY, eyeSize, eyeSize);
        }
        
        // Draw type-specific details
        switch (this.type) {
            case 'flyer':
                // Draw wings
                ctx.fillStyle = '#9370DB';
                ctx.beginPath();
                if (this.direction === 1) {
                    ctx.moveTo(this.x, this.y + 10);
                    ctx.lineTo(this.x - 10, this.y + 20);
                    ctx.lineTo(this.x, this.y + 25);
                    ctx.fill();
                } else {
                    ctx.moveTo(this.x + this.width, this.y + 10);
                    ctx.lineTo(this.x + this.width + 10, this.y + 20);
                    ctx.lineTo(this.x + this.width, this.y + 25);
                    ctx.fill();
                }
                break;
                
            case 'jumper':
                // Draw spring-like legs
                ctx.strokeStyle = '#228B22';
                ctx.lineWidth = 3;
                ctx.beginPath();
                
                // Left leg
                ctx.moveTo(this.x + 10, this.y + this.height - 5);
                ctx.lineTo(this.x + 5, this.y + this.height + 5);
                
                // Right leg
                ctx.moveTo(this.x + this.width - 10, this.y + this.height - 5);
                ctx.lineTo(this.x + this.width - 5, this.y + this.height + 5);
                
                ctx.stroke();
                break;
        }
    }
}
