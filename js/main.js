/**
 * Main entry point for the game
 */
window.addEventListener('load', function() {
    // Create and start the game
    const game = new Game();
    game.start();
    
    // Log game started
    console.log('Game initialized and started');
});
