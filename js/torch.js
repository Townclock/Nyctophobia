function Torch(game, x, y, key, frame) {
	Phaser.Sprite.call(this, game, x, y, key, frame);
	game.physics.enable(this);
	this.enableBody = true;
	this.body.immovable = true;
}

Torch.prototype = Object.create(Phaser.Sprite.prototype);  
Torch.prototype.constructor = Torch;