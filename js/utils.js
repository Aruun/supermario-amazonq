/**
 * Utility functions for the game
 */

// Check collision between two rectangles
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// Calculate distance between two points
function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

// Random integer between min and max (inclusive)
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Clamp a value between min and max
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// Lerp (linear interpolation) between two values
function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

// Create a simple particle effect
function createParticles(x, y, count, color, canvas) {
    const particles = [];
    
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            size: randomInt(2, 5),
            speedX: (Math.random() - 0.5) * 5,
            speedY: (Math.random() - 0.5) * 5,
            life: randomInt(20, 40),
            color: color
        });
    }
    
    // Animation function
    function animateParticles() {
        const ctx = canvas.getContext('2d');
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            p.x += p.speedX;
            p.y += p.speedY;
            p.life--;
            
            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
            
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        }
        
        // Continue animation if particles remain
        if (particles.length > 0) {
            requestAnimationFrame(animateParticles);
        }
    }
    
    // Start animation
    animateParticles();
}
