//create wall object
function Wall(game, x, y, key, frame) {
	Phaser.Sprite.call(this, game, x * 72, y * 56, key, frame);
	game.physics.enable(this);
	this.enableBody = true;
	this.body.immovable = true;
}

Wall.prototype = Object.create(Phaser.Sprite.prototype);  
Wall.prototype.constructor = Wall;
