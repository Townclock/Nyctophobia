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


    if (lights.length >= 0 && this.superX === player.superX && this.superY === player.superY)
    {
        var nearestLight = null;
        
        for(i = 0; i < lights.length; i++){
        	var light = lights.children[i];
            if((light.active === true || light.type === 1)
            && Phaser.Math.distance(light.x, light.y, this.x, this.y) < light.radius
            && (light.type < 2
            || Math.abs(light.rotation - game.physics.arcade.angleBetween(light, this)) < Math.PI/8
            || Math.abs(((Math.PI * 2 + light.rotation) % (Math.PI * 2)) - (Math.PI * 2 + game.physics.arcade.angleBetween(light, this)) % (Math.PI * 2)) < Math.PI/8 )
            && (nearestLight == null 
            || Phaser.Math.distance(light.x, light.y, this.x, this.y) < Phaser.Math.distance(nearestLight.x, nearestLight.y, this.x, this.y))){
                nearestLight = light;
            }
            //console.log('Distance of '+ i + ' is ' + Phaser.Math.distance(lights.getAt(i).x, lights.getAt(i).y, this.x, this.y));
        }
		if(nearestLight != null){
            if(nearestLight.y < this.y && this.body.velocity.y > -150) {
				this.body.velocity.y -= 10;
			} else if (nearestLight.y > this.y && this.body.velocity.y < 150) {
				this.body.velocity.y += 10;
			} else if (this.body.velocity.y < 0) {
				this.body.velocity.y += 10;
			} else if (this.body.velocity.y > 0) {
				this.body.velocity.y -= 10;
			}
		
			//left/right movement
			if(nearestLight.x < this.x && this.body.velocity.x > -150) {
				this.body.velocity.x -= 10;
			} else if (nearestLight.x > this.x && this.body.velocity.x < 150) {
				this.body.velocity.x += 10;
			} else if (this.body.velocity.x < 0) {
				this.body.velocity.x += 10;
			} else if (this.body.velocity.x > 0) {
				this.body.velocity.x -= 10;
			}
		
			//total speed capped at 200
			var vtotal = Math.abs(this.body.velocity.x) + Math.abs(this.body.velocity.y);
			while (vtotal > 150) {
				if (Math.abs(this.body.velocity.x) > Math.abs(this.body.velocity.y)) {
					this.body.velocity.x > 0 ? this.body.velocity.x-- : this.body.velocity.x++;
				} else {
					this.body.velocity.y > 0 ? this.body.velocity.y-- : this.body.velocity.y++;
				}
				vtotal--;
			}
   	     	this.rotation = game.physics.arcade.angleBetween(this, nearestLight) + (Math.PI / 2);
   	 	    //console.log('moving to 0') 
   	     }
    }

    function destroyPlayer(player, monster) {

        //switch to GameOver state if the player collides with an enemy
        //player.kill();
        //game.state.start('GameOver');
    }
    
    //checks player collision with enemy
    game.physics.arcade.collide(this, walls);
    game.physics.arcade.overlap(player, this, destroyPlayer, null, game);


}
