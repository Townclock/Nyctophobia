var w;
var a;
var s;
var d;
var vtotal;

function Player(game, x, y, key, frame, walls) {
	Phaser.Sprite.call(this, game, x, y, key, frame);
	game.physics.enable(this);
	this.enableBody = true;
	this.anchor.set(.5);

	w = game.input.keyboard.addKey(Phaser.Keyboard.W);
	a = game.input.keyboard.addKey(Phaser.Keyboard.A);
	s = game.input.keyboard.addKey(Phaser.Keyboard.S);
	d = game.input.keyboard.addKey(Phaser.Keyboard.D);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);  
Player.prototype.constructor = Player;

Player.prototype.update = function() {
	game.physics.arcade.collide(this, walls);
	this.rotation = game.physics.arcade.angleToPointer(this) + (Math.PI / 2);
	
	// up/down movement
	if(w.isDown && this.body.velocity.y > -100){
		this.body.velocity.y -= 10;
	}
	else if (s.isDown && this.body.velocity.y < 100){
		this.body.velocity.y += 10;
	}
	else if (this.body.velocity.y < 0){
		this.body.velocity.y += 5;
	}
	else if (this.body.velocity.y > 0){
		this.body.velocity.y -= 5;
	}
	
	// left/right movement
	if(a.isDown && this.body.velocity.x > -100){
		this.body.velocity.x -= 10;
	}
	else if (d.isDown && this.body.velocity.x < 100){
		this.body.velocity.x += 10;
	}
	else if (this.body.velocity.x < 0){
		this.body.velocity.x += 5;
	}
	else if (this.body.velocity.x > 0){
		this.body.velocity.x -= 5;
	}
	
	//total speed capped at 100
	vtotal = Math.abs(this.body.velocity.x) + Math.abs(this.body.velocity.y);
	while(vtotal > 100){
		if(Math.abs(this.body.velocity.x) > Math.abs(this.body.velocity.y)){
			this.body.velocity.x > 0 ? this.body.velocity.x-- : this.body.velocity.x++;
		}
		else{
			this.body.velocity.y > 0 ? this.body.velocity.y-- : this.body.velocity.y++;
		}
		vtotal--;
	}
}
