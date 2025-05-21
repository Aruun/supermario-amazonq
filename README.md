# 2D Platformer Game

A simple 2D platformer game built with JavaScript and HTML Canvas.

## Features

- Player character with movement and jumping physics
- Platforms with different types (grass, brick, ice)
- Collectible coins
- Different enemy types with unique behaviors
- Lives and score system
- Game over and level complete states

## How to Play

1. Open `index.html` in a web browser
2. Use the arrow keys or WASD to move the player
3. Press Space or Up arrow to jump
4. Collect all coins to complete the level
5. Avoid or defeat enemies by jumping on them
6. You have 3 lives - game over if you lose them all

## Controls

- **Left Arrow** or **A**: Move left
- **Right Arrow** or **D**: Move right
- **Up Arrow**, **W**, or **Space**: Jump
- **R**: Restart after game over or level complete

## Project Structure

- `index.html`: Main HTML file
- `js/`: JavaScript files
  - `main.js`: Entry point
  - `game.js`: Game management
  - `player.js`: Player character
  - `platform.js`: Platforms
  - `coin.js`: Collectible coins
  - `enemy.js`: Enemy characters
  - `level.js`: Level design
  - `sprite.js`: Base sprite classes
  - `input.js`: Input handling
  - `utils.js`: Utility functions

## Extending the Game

To add new levels, create a level data object and pass it to the Level constructor:

```javascript
const levelData = {
    playerStart: { x: 50, y: 300 },
    background: { color: '#87CEEB' },
    platforms: [
        { x: 0, y: 550, width: 800, height: 50, type: 'grass' },
        // Add more platforms...
    ],
    coins: [
        { x: 100, y: 400 },
        // Add more coins...
    ],
    enemies: [
        { x: 300, y: 520, type: 'walker' },
        // Add more enemies...
    ]
};

const level = new Level(levelData);
```

## Future Improvements

- Add more enemy types
- Implement power-ups
- Add sound effects and music
- Create multiple levels
- Add a level editor
- Implement a high score system
