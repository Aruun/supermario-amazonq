/**
 * Platform class for solid objects the player can stand on
 */
class Platform extends Sprite {
    constructor(x, y, width, height, type = 'normal') {
        // Choose color based on platform type
        let color;
        switch (type) {
            case 'grass':
                color = '#4CAF50';
                break;
            case 'dirt':
                color = '#8B4513';
                break;
            case 'brick':
                color = '#B22222';
                break;
            case 'ice':
                color = '#87CEEB';
                break;
            default:
                color = '#8B4513';
        }
        
        super(x, y, width, height, color);
        this.type = type;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Add details based on platform type
        switch (this.type) {
            case 'grass':
                // Add grass details on top
                ctx.fillStyle = '#66BB6A';
                ctx.fillRect(this.x, this.y, this.width, 5);
                break;
                
            case 'brick':
                // Add brick pattern
                ctx.strokeStyle = '#8B0000';
                ctx.lineWidth = 1;
                
                // Horizontal lines
                for (let y = this.y + 10; y < this.y + this.height; y += 10) {
                    ctx.beginPath();
                    ctx.moveTo(this.x, y);
                    ctx.lineTo(this.x + this.width, y);
                    ctx.stroke();
                }
                
                // Vertical lines (staggered for brick effect)
                for (let x = this.x; x < this.x + this.width; x += 20) {
                    for (let row = 0; row < Math.floor(this.height / 10); row++) {
                        const offset = row % 2 === 0 ? 0 : 10;
                        const brickX = x + offset;
                        
                        if (brickX < this.x + this.width) {
                            ctx.beginPath();
                            ctx.moveTo(brickX, this.y + row * 10);
                            ctx.lineTo(brickX, this.y + (row + 1) * 10);
                            ctx.stroke();
                        }
                    }
                }
                break;
                
            case 'ice':
                // Add shine effect
                const gradient = ctx.createLinearGradient(
                    this.x, this.y, 
                    this.x + this.width, this.y + this.height
                );
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
                gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(this.x, this.y, this.width, this.height / 3);
                break;
        }
    }
}
