/**
 * Game class to manage the game state and logic
 */
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        this.input = new InputHandler();
        this.level = new Level();
        this.player = new Player(this.level.playerStartX, this.level.playerStartY);
        
        this.isRunning = false;
        this.lastTime = 0;
        this.gameOver = false;
        this.levelComplete = false;
        
        // Set up event listeners
        document.getElementById('restart-button').addEventListener('click', () => {
            this.restart();
        });
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.gameLoop(0);
        }
    }
    
    gameLoop(timestamp) {
        // Calculate delta time
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Update game state
        this.update(deltaTime);
        
        // Draw game objects
        this.draw();
        
        // Continue game loop if game is running
        if (this.isRunning) {
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }
    
    update(deltaTime) {
        // Handle player input
        if (this.input.isPressed('ArrowLeft') || this.input.isPressed('KeyA')) {
            this.player.moveLeft();
        }
        if (this.input.isPressed('ArrowRight') || this.input.isPressed('KeyD')) {
            this.player.moveRight();
        }
        if (this.input.isPressed('Space') || this.input.isPressed('ArrowUp') || this.input.isPressed('KeyW')) {
            this.player.jump();
        }
        
        // Update player
        this.player.update(
            deltaTime, 
            this.level.platforms, 
            this.level.coins, 
            this.level.enemies
        );
        
        // Update level
        this.levelComplete = this.level.update(deltaTime, this.player);
        
        // Check game over condition
        if (this.player.lives <= 0) {
            this.gameOver = true;
            document.getElementById('game-over-text').textContent = 'Game Over';
            document.getElementById('game-over').style.display = 'block';
        }
        
        // Check level complete condition
        if (this.levelComplete) {
            document.getElementById('game-over-text').textContent = 'Level Complete!';
            document.getElementById('game-over').style.display = 'block';
        }
    }
    
    draw() {
        // Draw level
        this.level.draw(this.ctx);
        
        // Draw player
        this.player.draw(this.ctx);
    }
    
    restart() {
        this.gameOver = false;
        this.levelComplete = false;
        this.player.reset();
        this.level.reset();
        document.getElementById('game-over').style.display = 'none';
    }
}
