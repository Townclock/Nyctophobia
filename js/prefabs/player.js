//create player object
function Player(game, x, y, key, frame, walls) {
	Phaser.Sprite.call(this, game, x, y, key, frame);
	this.animations.add('walk');
	game.physics.enable(this);
	this.enableBody = true;
	this.body.setSize(40, 40, 20, 35);
	this.anchor.set(.5);

	//mapping wasd keys
	w = game.input.keyboard.addKey(Phaser.Keyboard.W);
	a = game.input.keyboard.addKey(Phaser.Keyboard.A);
	s = game.input.keyboard.addKey(Phaser.Keyboard.S);
	d = game.input.keyboard.addKey(Phaser.Keyboard.D);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);  
Player.prototype.constructor = Player;

Player.prototype.update = function() {

	//collision with walls
	game.physics.arcade.collide(this, walls);

	//collision with torch and battery
	game.physics.arcade.overlap(this, torch, torchAdd, null, this);
	game.physics.arcade.overlap(this, battery, batteryAdd, null, this);

	//enable player rotation
	this.rotation = game.physics.arcade.angleToPointer(this) + (Math.PI / 2);

	this.x = (this.x + game.world.width) % game.world.width;
	this.y = (this.y + game.world.height) % game.world.height;
	
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
		this.animations.play('walk', 10, true);
	} else {
		this.animations.stop();
		this.frame = 0;
	}

	//total speed capped at 200
	vtotal = Math.abs(this.body.velocity.x) + Math.abs(this.body.velocity.y);
	while (vtotal > 200) {
		if (Math.abs(this.body.velocity.x) > Math.abs(this.body.velocity.y)) {
			this.body.velocity.x > 0 ? this.body.velocity.x-- : this.body.velocity.x++;
		} else {
			this.body.velocity.y > 0 ? this.body.velocity.y-- : this.body.velocity.y++;
		}
		vtotal--;
	}
}