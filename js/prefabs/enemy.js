//create enemy object
function Monster(game, x, y, key, frame, walls) {
    Phaser.Sprite.call(this, game, x, y, key, frame);
    game.physics.enable(this);
    this.enableBody = true;
    this.anchor.set(.5);
}

Monster.prototype = Object.create(Phaser.Sprite.prototype);  
Monster.prototype.constructor = Monster;

Monster.prototype.update = function() {

    for(i = 0; i <= lights.length; i++){
        Phaser.Math.distance(lights.getAt(i).x, lights.getAt(i).y, this.x, this.y);
        //console.log('Distance of '+ i + ' is ' + Phaser.Math.distance(lights.getAt(i).x, lights.getAt(i).y, this.x, this.y));
    }

     if(Phaser.Math.distance(lights.getChildAt(0).x, lights.getChildAt(0).y, this.x, this.y) < 
            Phaser.Math.distance(lights.getChildAt(1).x, lights.getChildAt(1).y, this.x, this.y)){
                game.physics.arcade.moveToObject(this, lights.getChildAt(0), 100);
                this.rotation = game.physics.arcade.angleBetween(this, lights.getChildAt(0)) + (Math.PI / 2);
                //console.log('moving to 0') 
    }else{
                game.physics.arcade.moveToObject(this, lights.getAt(1), 100);
                this.rotation = game.physics.arcade.angleBetween(this, lights.getChildAt(1)) + (Math.PI / 2);
                //console.log('moving to 1');
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