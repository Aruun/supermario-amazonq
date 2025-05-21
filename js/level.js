/**
 * Level class for managing game levels
 */
class Level {
    constructor(levelData) {
        this.platforms = [];
        this.coins = [];
        this.enemies = [];
        this.playerStartX = 50;
        this.playerStartY = 300;
        this.backgroundImage = null;
        this.backgroundColor = '#87CEEB';
        
        if (levelData) {
            this.loadLevel(levelData);
        } else {
            this.createDefaultLevel();
        }
    }
    
    loadLevel(levelData) {
        // Set level properties
        if (levelData.playerStart) {
            this.playerStartX = levelData.playerStart.x;
            this.playerStartY = levelData.playerStart.y;
        }
        
        if (levelData.background) {
            this.backgroundColor = levelData.background.color || this.backgroundColor;
            
            if (levelData.background.image) {
                this.backgroundImage = new Image();
                this.backgroundImage.src = levelData.background.image;
            }
        }
        
        // Create platforms
        if (levelData.platforms) {
            for (const platformData of levelData.platforms) {
                this.platforms.push(new Platform(
                    platformData.x,
                    platformData.y,
                    platformData.width,
                    platformData.height,
                    platformData.type || 'normal'
                ));
            }
        }
        
        // Create coins
        if (levelData.coins) {
            for (const coinData of levelData.coins) {
                this.coins.push(new Coin(coinData.x, coinData.y));
            }
        }
        
        // Create enemies
        if (levelData.enemies) {
            for (const enemyData of levelData.enemies) {
                this.enemies.push(new Enemy(
                    enemyData.x,
                    enemyData.y,
                    enemyData.type || 'basic'
                ));
            }
        }
    }
    
    createDefaultLevel() {
        // Create ground
        this.platforms.push(new Platform(0, 550, 800, 50, 'grass'));
        
        // Create platforms
        this.platforms.push(new Platform(100, 450, 200, 20, 'grass'));
        this.platforms.push(new Platform(400, 400, 150, 20, 'brick'));
        this.platforms.push(new Platform(600, 350, 150, 20, 'grass'));
        this.platforms.push(new Platform(200, 300, 100, 20, 'brick'));
        this.platforms.push(new Platform(350, 250, 200, 20, 'ice'));
        
        // Create some floating blocks
        this.platforms.push(new Platform(150, 200, 40, 40, 'brick'));
        this.platforms.push(new Platform(250, 200, 40, 40, 'brick'));
        this.platforms.push(new Platform(500, 150, 40, 40, 'brick'));
        
        // Create coins
        const coinPositions = [
            {x: 130, y: 410}, {x: 170, y: 410}, {x: 210, y: 410},
            {x: 450, y: 360}, {x: 500, y: 360},
            {x: 650, y: 310}, {x: 700, y: 310},
            {x: 220, y: 260}, {x: 250, y: 260},
            {x: 400, y: 210}, {x: 450, y: 210}, {x: 500, y: 210},
            {x: 150, y: 160}, {x: 250, y: 160}, {x: 500, y: 110}
        ];
        
        for (const pos of coinPositions) {
            this.coins.push(new Coin(pos.x, pos.y));
        }
        
        // Create enemies
        this.enemies.push(new Enemy(300, 520, 'walker'));
        this.enemies.push(new Enemy(450, 370, 'walker'));
        this.enemies.push(new Enemy(650, 320, 'walker'));
        this.enemies.push(new Enemy(400, 100, 'flyer'));
        this.enemies.push(new Enemy(200, 520, 'jumper'));
    }
    
    update(deltaTime, player) {
        // Update coins
        for (const coin of this.coins) {
            if (coin.isActive) {
                coin.update(deltaTime);
            }
        }
        
        // Update enemies
        for (const enemy of this.enemies) {
            if (enemy.isActive) {
                enemy.update(deltaTime, this.platforms, player);
            }
        }
        
        // Check if all coins are collected
        if (this.coins.every(coin => !coin.isActive)) {
            return true; // Level complete
        }
        
        return false;
    }
    
    draw(ctx) {
        // Draw background
        if (this.backgroundImage && this.backgroundImage.complete) {
            ctx.drawImage(this.backgroundImage, 0, 0, 800, 600);
        } else {
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(0, 0, 800, 600);
        }
        
        // Draw platforms
        for (const platform of this.platforms) {
            platform.draw(ctx);
        }
        
        // Draw coins
        for (const coin of this.coins) {
            coin.draw(ctx);
        }
        
        // Draw enemies
        for (const enemy of this.enemies) {
            enemy.draw(ctx);
        }
    }
    
    reset() {
        // Reset coins
        for (const coin of this.coins) {
            coin.isActive = true;
            coin.collected = false;
        }
        
        // Reset enemies
        for (const enemy of this.enemies) {
            enemy.isActive = true;
            enemy.isDefeated = false;
            enemy.x = enemy.originalX || enemy.x;
            enemy.y = enemy.originalY || enemy.y;
        }
    }
}
