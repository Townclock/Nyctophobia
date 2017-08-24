//create enemy object
function Monster(game, x, y, superX, superY, key, frame, walls) {
    Phaser.Sprite.call(this, game, x, y, key, frame);
    game.physics.enable(this);
    this.enableBody = true;
    this.anchor.set(.5);

    this.superX = superX;
    this.superY = superY;
}

Monster.prototype = Object.create(Phaser.Sprite.prototype);  
Monster.prototype.constructor = Monster;

Monster.prototype.update = function() {


    if (lights.length >= 0)
    {
        var nearestLight = lights.getAt(0);
        for(i = 1; i < lights.length; i++){
            if (Phaser.Math.distance(lights.getAt(i).x, lights.getAt(i).y, this.x, this.y) < Phaser.Math.distance(nearestLight.x, nearestLight.y, this.x, this.y)){
                nearestLight = lights.getAt(i);
            }
            //console.log('Distance of '+ i + ' is ' + Phaser.Math.distance(lights.getAt(i).x, lights.getAt(i).y, this.x, this.y));
        }

                game.physics.arcade.moveToObject(this, nearestLight, 100);
                this.rotation = game.physics.arcade.angleBetween(this, lights.getChildAt(0)) + (Math.PI / 2);
                //console.log('moving to 0') 
    }

    function destroyPlayer(player, monster) {

        //switch to GameOver state if the player collides with an enemy
        player.kill();
        game.state.start('GameOver');
    }
    
    //checks player collision with enemy
    game.physics.arcade.collide(this, walls);
    game.physics.arcade.overlap(player, this, destroyPlayer, null, game);


}
