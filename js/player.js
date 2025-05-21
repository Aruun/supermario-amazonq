/**
 * Player class for the main character
 */
class Player extends AnimatedSprite {
    constructor(x, y) {
        super(x, y, 40, 60, '#FF0000');
        
        // Physics properties
        this.gravity = 0.5;
        this.jumpForce = -12;
        this.maxSpeedX = 5;
        this.maxSpeedY = 12;
        this.friction = 0.8;
        this.acceleration = 1;
        
        // State properties
        this.isJumping = false;
        this.isGrounded = false;
        this.direction = 1; // 1 for right, -1 for left
        this.lives = 3;
        this.score = 0;
        this.isInvulnerable = false;
        this.invulnerableTimer = 0;
        this.invulnerableDuration = 1500; // 1.5 seconds
        
        // Animation properties
        this.setupAnimations();
    }
    
    setupAnimations() {
        // For now, we'll use colored rectangles for different states
        this.animations = {
            idle: { color: '#FF0000' },
            run: { color: '#FF3333' },
            jump: { color: '#FF6666' },
            fall: { color: '#FF9999' },
            hurt: { color: '#FFCCCC' }
        };
        this.currentAnimation = 'idle';
    }
    
    update(deltaTime, platforms, coins, enemies) {
        // Store previous position
        const prevX = this.x;
        const prevY = this.y;
        
        // Apply gravity
        this.speedY += this.gravity;
        
        // Apply friction
        this.speedX *= this.friction;
        
        // Limit speeds
        this.speedX = clamp(this.speedX, -this.maxSpeedX, this.maxSpeedX);
        this.speedY = clamp(this.speedY, -this.maxSpeedY, this.maxSpeedY);
        
        // Update position
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Check platform collisions
        this.isGrounded = false;
        for (const platform of platforms) {
            if (checkCollision(this.getBounds(), platform.getBounds())) {
                // Collision from top (landing on platform)
                if (prevY + this.height <= platform.y + 10 && this.speedY > 0) {
                    this.y = platform.y - this.height;
                    this.speedY = 0;
                    this.isGrounded = true;
                    this.isJumping = false;
                }
                // Collision from bottom (hitting platform from below)
                else if (prevY >= platform.y + platform.height - 10 && this.speedY < 0) {
                    this.y = platform.y + platform.height;
                    this.speedY = 0;
                }
                // Collision from left
                else if (prevX + this.width <= platform.x + 10 && this.speedX > 0) {
                    this.x = platform.x - this.width;
                    this.speedX = 0;
                }
                // Collision from right
                else if (prevX >= platform.x + platform.width - 10 && this.speedX < 0) {
                    this.x = platform.x + platform.width;
                    this.speedX = 0;
                }
            }
        }
        
        // Check coin collisions
        for (const coin of coins) {
            if (coin.isActive && checkCollision(this.getBounds(), coin.getBounds())) {
                coin.collect();
                this.score += 10;
                document.getElementById('score').textContent = `Score: ${this.score}`;
            }
        }
        
        // Check enemy collisions
        if (!this.isInvulnerable) {
            for (const enemy of enemies) {
                if (enemy.isActive && checkCollision(this.getBounds(), enemy.getBounds())) {
                    // If player is falling onto enemy from above
                    if (prevY + this.height <= enemy.y + 10 && this.speedY > 0) {
                        enemy.defeat();
                        this.speedY = this.jumpForce / 1.5; // Bounce after stomping
                        this.score += 50;
                        document.getElementById('score').textContent = `Score: ${this.score}`;
                    } else {
                        // Player gets hurt
                        this.hurt();
                    }
                }
            }
        }
        
        // Update invulnerability
        if (this.isInvulnerable) {
            this.invulnerableTimer += deltaTime;
            if (this.invulnerableTimer >= this.invulnerableDuration) {
                this.isInvulnerable = false;
                this.invulnerableTimer = 0;
            }
        }
        
        // Keep player within screen bounds
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > 800) this.x = 800 - this.width;
        if (this.y < 0) {
            this.y = 0;
            this.speedY = 0;
        }
        if (this.y + this.height > 600) {
            this.y = 600 - this.height;
            this.speedY = 0;
            this.isGrounded = true;
            this.isJumping = false;
        }
        
        // Update animation state
        this.updateAnimationState();
    }
    
    updateAnimationState() {
        if (this.isInvulnerable) {
            this.currentAnimation = 'hurt';
        } else if (this.isJumping && this.speedY < 0) {
            this.currentAnimation = 'jump';
        } else if (this.speedY > 0 && !this.isGrounded) {
            this.currentAnimation = 'fall';
        } else if (Math.abs(this.speedX) > 0.5) {
            this.currentAnimation = 'run';
        } else {
            this.currentAnimation = 'idle';
        }
    }
    
    moveLeft() {
        this.speedX -= this.acceleration;
        this.direction = -1;
    }
    
    moveRight() {
        this.speedX += this.acceleration;
        this.direction = 1;
    }
    
    jump() {
        if (this.isGrounded) {
            this.speedY = this.jumpForce;
            this.isJumping = true;
            this.isGrounded = false;
        }
    }
    
    hurt() {
        if (this.isInvulnerable) return;
        
        this.lives--;
        document.getElementById('lives').textContent = `Lives: ${this.lives}`;
        
        this.isInvulnerable = true;
        this.invulnerableTimer = 0;
        
        // Knockback effect
        this.speedY = this.jumpForce / 2;
        this.speedX = (this.direction * -1) * 5;
        
        if (this.lives <= 0) {
            this.gameOver();
        }
    }
    
    gameOver() {
        document.getElementById('game-over').style.display = 'block';
    }
    
    reset() {
        this.x = 50;
        this.y = 300;
        this.speedX = 0;
        this.speedY = 0;
        this.lives = 3;
        this.score = 0;
        this.isInvulnerable = false;
        this.invulnerableTimer = 0;
        this.direction = 1;
        
        document.getElementById('score').textContent = `Score: ${this.score}`;
        document.getElementById('lives').textContent = `Lives: ${this.lives}`;
        document.getElementById('game-over').style.display = 'none';
    }
    
    draw(ctx) {
        // Flicker effect when invulnerable
        if (this.isInvulnerable && Math.floor(this.invulnerableTimer / 100) % 2 === 0) {
            return;
        }
        
        // Get color based on current animation state
        this.color = this.animations[this.currentAnimation].color;
        
        // Draw the player
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw eyes
        ctx.fillStyle = '#FFFFFF';
        const eyeSize = 8;
        const eyeY = this.y + 15;
        
        if (this.direction === 1) {
            ctx.fillRect(this.x + this.width - 15, eyeY, eyeSize, eyeSize);
        } else {
            ctx.fillRect(this.x + 7, eyeY, eyeSize, eyeSize);
        }
    }
}
