//create enemy object
function Monster(game, x, y, key, frame, walls, player) {
    Phaser.Sprite.call(this, game, x, y, key, frame);
    game.physics.enable(this);
    this.enableBody = true;
    this.anchor.set(.5);
}

Monster.prototype = Object.create(Phaser.Sprite.prototype);  
Monster.prototype.constructor = Monster;

Monster.prototype.update = function() {

    //enemy moves towards player
    game.physics.arcade.moveToObject(this, player, 100);
    this.rotation = game.physics.arcade.angleBetween(this, player) + (Math.PI / 2);

    function destroyPlayer(player, monster) {

        //switch to GameOver state if the player collides with an enemy
        player.kill();
        game.state.start('GameOver');
    }
    
    //checks player collision with enemy
    game.physics.arcade.collide(this, walls);
    game.physics.arcade.overlap(player, this, destroyPlayer, null, game);
}