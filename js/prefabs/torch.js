//create torch object
function Torch(game, x, y, superX, superY, key, frame) {
	Phaser.Sprite.call(this, game, x, y, key, frame);
	game.physics.enable(this);
	this.enableBody = true;
	this.body.immovable = true;

    this.superX = superX;
    this.superY = superY;
}

Torch.prototype = Object.create(Phaser.Sprite.prototype);  
Torch.prototype.constructor = Torch;

