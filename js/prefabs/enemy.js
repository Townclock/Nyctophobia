//create enemy object
function Monster(game, x, y, superX, superY, key, frame) {
    Phaser.Sprite.call(this, game, x, y, key, frame);
    game.physics.enable(this);
    this.enableBody = true;
    this.anchor.set(.5);
	this.body.setSize(90, 90, 20, 10);
    this.superX = superX;
    this.superY = superY;
    
    this.animations.add('spoop');
    growl = true;
}

Monster.prototype = Object.create(Phaser.Sprite.prototype);  
Monster.prototype.constructor = Monster;

Monster.prototype.update = function() {

    if (lights.length >= 0 && this.superX === player.superX && this.superY === player.superY)
    {
        var nearestLight = null;
        
        for(i = 0; i < lights.length; i++){
        	var light = lights.children[i];
            if(light.exists
            && (light.active === true || light.type === 1)
            && light.charge > 0
            && Phaser.Math.distance(light.x, light.y, this.x, this.y) < light.radius
            && (light.type < 2
            || Math.abs(light.rotation + Math.PI / 2 - game.physics.arcade.angleBetween(this, light)) < Math.PI/8
            || Math.abs(((Math.PI * 2 + light.rotation) % (Math.PI * 2)) + Math.PI / 2 - (Math.PI * 2 + game.physics.arcade.angleBetween(this, light)) % (Math.PI * 2)) < Math.PI/8 ) 
            &&(nearestLight == null 
            || Phaser.Math.distance(light.x, light.y, this.x, this.y) < Phaser.Math.distance(nearestLight.x, nearestLight.y, this.x, this.y))){
            	var line = new Phaser.Line(this.x, this.y, light.x, light.y);
            	if (!getWallIntersection(line, lwalls)){
                	nearestLight = light;
                }
            }
            //console.log('Distance of '+ i + ' is ' + Phaser.Math.distance(lights.getAt(i).x, lights.getAt(i).y, this.x, this.y));
        }
		if(nearestLight != null){
			game.physics.arcade.moveToObject(this, nearestLight, 100);
   	     	this.rotation = game.physics.arcade.angleBetween(this, nearestLight) + Math.PI;
            this.animations.play('spoop', 6, true);
   	 	    //console.log('moving to 0') 
            if(growl){
                //monster chase music
                //game.monChase.play('', 0, 0.3, false, true);
                growl = false;
                game.time.events.add(Phaser.Timer.SECOND * 3, monsterGrowl, this);
                rand = Math.random();
                if(rand <= 0.33){
                    game.monGrowl.play('', 0, 0.3, false, true);
                }
                else if(rand <= 0.66){
                    game.monGrowl2.play('', 0, 0.4, false, true);
                }else{
                    game.monGrowl3.play('', 0, 0.4, false, true);
                }
            }
   	    }else{
            //game.monChase.stop();
            this.animations.stop();
			this.frame = 0;
        }
    }

    function monsterGrowl() {
        growl = true;
    }  

    function destroyPlayer(player, monster) {

        //switch to GameOver state if the player collides with an enemy
        player.ded = true;
        player.kill();
        game.bg.stop();
        game.walk.stop();
        //game.monChase.stop();
        game.state.start('GameOver');
    }
    
    //checks player collision with enemy
    game.physics.arcade.collide(this, walls);
    game.physics.arcade.overlap(player, this, destroyPlayer, null, game);


}
