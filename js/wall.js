function Wall(game, x, y, key, frame) {
	Phaser.Sprite.call(this, game, x, y, key, frame);
	game.physics.enable(this);
	this.enableBody = true;
	this.body.immovable = true;
}

Wall.prototype = Object.create(Phaser.Sprite.prototype);  
Wall.prototype.constructor = Wall;