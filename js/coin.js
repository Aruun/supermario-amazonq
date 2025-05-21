/**
 * Coin class for collectible items
 */
class Coin extends Sprite {
    constructor(x, y) {
        super(x, y, 20, 20, '#FFD700');
        
        this.originalY = y;
        this.floatOffset = 0;
        this.floatSpeed = 0.05;
        this.rotationAngle = 0;
        this.collectSound = null;
        this.collected = false;
        
        // Try to load sound if Web Audio API is supported
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                // Sound will be initialized in the game class
            }
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    update(deltaTime) {
        if (!this.isActive) return;
        
        // Floating animation
        this.floatOffset = Math.sin(Date.now() * this.floatSpeed) * 5;
        this.y = this.originalY + this.floatOffset;
        
        // Rotation animation
        this.rotationAngle += 0.05;
        if (this.rotationAngle >= Math.PI * 2) {
            this.rotationAngle = 0;
        }
    }
    
    draw(ctx) {
        if (!this.isActive) return;
        
        // Save the current context state
        ctx.save();
        
        // Move to the center of the coin
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        
        // Rotate the context
        ctx.rotate(this.rotationAngle);
        
        // Draw the coin (as an ellipse to simulate perspective)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(
            0, 0,
            this.width / 2 * Math.abs(Math.cos(this.rotationAngle)),
            this.height / 2,
            0, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Add shine effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.ellipse(
            -this.width / 6,
            -this.height / 6,
            this.width / 6 * Math.abs(Math.cos(this.rotationAngle)),
            this.height / 6,
            0, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Restore the context
        ctx.restore();
    }
    
    collect() {
        if (this.collected) return;
        
        this.collected = true;
        this.isActive = false;
        
        // Play sound if available
        if (this.collectSound) {
            this.collectSound.currentTime = 0;
            this.collectSound.play().catch(e => console.log('Error playing sound:', e));
        }
        
        // Create particle effect
        createParticles(
            this.x + this.width / 2,
            this.y + this.height / 2,
            10,
            this.color,
            document.getElementById('game-canvas')
        );
    }
}
