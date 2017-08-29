//create player object
function Player(game, x, y, key, frame, walls) {
	Phaser.Sprite.call(this, game, x, y, key, frame);
	this.animations.add('walk');
	game.physics.enable(this);
	this.enableBody = true;
	this.body.setSize(70, 70, 5, 20);
	this.anchor.set(.5);

    this.superX = 0;
    this.superY = 0;

	//mapping wasd keys
	w = game.input.keyboard.addKey(Phaser.Keyboard.W);
	a = game.input.keyboard.addKey(Phaser.Keyboard.A);
	s = game.input.keyboard.addKey(Phaser.Keyboard.S);
	d = game.input.keyboard.addKey(Phaser.Keyboard.D);
	k1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
	k2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
	k3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);  
Player.prototype.constructor = Player;

Player.prototype.update = function() {
	game.debug.body(this);

	//collision with walls
	game.physics.arcade.collide(this, walls);

	//collision with torch and battery
    game.physics.arcade.overlap(this, torch, torchAdd, null, this);
	game.physics.arcade.overlap(this, battery, batteryAdd, null, this);

	//enable player rotation
	this.rotation = game.physics.arcade.angleToPointer(this) + (Math.PI / 2);


    if (this.x > game.world.width){
        this.superX += 1;
	    this.x = (this.x + game.world.width) % game.world.width;
        buildMap(''+ this.superX + this.superY);
    }
    if (this.x < 0){
        this.superX -= 1;
	    this.x = (this.x + game.world.width) % game.world.width;
        buildMap(''+ this.superX + this.superY);
    }
    if (this.y > game.world.height){
        this.superY += 1;
        this.y = (this.y + game.world.height) % game.world.height;
        buildMap(''+ this.superX + this.superY);
    }
    if (this.y < 0){
        this.superY -= 1;
        this.y = (this.y + game.world.height) % game.world.height;
        buildMap(''+ this.superX + this.superY);
    }

	
	//up/down movement
	if(w.isDown && this.body.velocity.y > -200) {
		this.body.velocity.y -= 20;
	} else if (s.isDown && this.body.velocity.y < 200) {
		this.body.velocity.y += 20;
	} else if (this.body.velocity.y < 0) {
		this.body.velocity.y += 10;
	} else if (this.body.velocity.y > 0) {
		this.body.velocity.y -= 10;
	}

	//left/right movement
	if(a.isDown && this.body.velocity.x > -200) {
		this.body.velocity.x -= 20;
	} else if (d.isDown && this.body.velocity.x < 200) {
		this.body.velocity.x += 20;
	} else if (this.body.velocity.x < 0) {
		this.body.velocity.x += 10;
	} else if (this.body.velocity.x > 0) {
		this.body.velocity.x -= 10;
	}

	if (this.body.velocity.x != 0 || this.body.velocity.y != 0) {
		this.animations.play('walk', 4, true);
		if (temp == 1) {
			game.walk.play('', 0, 0.5, true, true);
			temp = 0;
		}
	} else {
		this.animations.stop();
		this.frame = 0;
		game.walk.stop();
		temp = 1;
	}

	//total speed capped at 200
	var vtotal = Math.abs(this.body.velocity.x) + Math.abs(this.body.velocity.y);
	while (vtotal > 200) {
		if (Math.abs(this.body.velocity.x) > Math.abs(this.body.velocity.y)) {
			this.body.velocity.x > 0 ? this.body.velocity.x-- : this.body.velocity.x++;
		} else {
			this.body.velocity.y > 0 ? this.body.velocity.y-- : this.body.velocity.y++;
		}
		vtotal--;
	}
}
