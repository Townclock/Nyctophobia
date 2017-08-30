
function Light(game, x, y, superX, superY, key, a, t) {
    Phaser.Sprite.call(this, game, x, y, key);
    this.anchor.setTo(.5, .35);
    this.active = a;
    this.type = t;
    this.fl = 0;
    game.physics.arcade.enable(this);
    this.enableBody = false;
    this.superX = superX;
    this.superY = superY;
    
    switch (this.type){
    	case 0:
    		this.radius = 75;
    		this.charge = 1;
    		break;
    	case 1:
    		this.radius = 150;
    		this.charge = 150;
    		break;
    	case 2:
    		this.radius = 1000;
    		this.lalpha = .5
    		this.charge = 30;
    		break;
    	default:
    }
}

Light.prototype = Object.create(Phaser.Sprite.prototype);  
Light.prototype.constructor = Light;

Light.prototype.update = function() {
    game.physics.arcade.collide(this, walls);
    
	if(this.active){
		/*this.x = player.x;
		this.y = player.y;
		this.anchor.setTo(-.5, .7);*/
		var point = hcircle.circumferencePoint(game.physics.arcade.angleToPointer(player) + Math.PI/3);
		this.x = point.x;
		this.y = point.y;
		this.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI / 2);
		this.visible = true;

        if(spacebar.justPressed() && this.type === 1){
            this.active = false;
            this.enableBody = true;
            this.body.velocity.x = 100 * Math.cos(player.rotation - Math.PI / 2 );
            this.body.velocity.y = 100 * Math.sin(player.rotation - Math.PI / 2 );
            //console.log('spacebar');
            //console.log('velocity = ' + this.body.velocity.x);
        }
	}
	else{
		if(this.type != 1){
			this.visible = false;
		}
		else{
			this.anchor.x = .5;
			this.anchor.y = .2;
		}
	}
	if(this.type === 1){
		this.radius = this.charge;
		this.charge -= .1;
	}
	else if (this.type > 1 && this.active && this.charge > 0){
		if (this.fl < 0){
			this.fl ++;
		}
		else if (this.fl <= 0){
            if(Math.random() * 100 > this.charge + 50){
                this.fl = Math.floor(Math.random() * 10) + 10;
            }
        }
        else if (this.fl === 1){
            this.lalpha = .5;
            this.fl = Math.floor(Math.random() * this.charge * -8);
        }
        else{
            this.lalpha = Math.random() * .5;
            this.fl--;
        }
        this.charge -= .05;
	}
	if(this.charge <= 0 && this.type === 1){
		this.destroy();
	}
};
