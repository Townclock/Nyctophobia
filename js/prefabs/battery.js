//create battery object
function Battery(game, x, y, superX, superY,  key, frame) {
	Phaser.Sprite.call(this, game, x, y, key, frame);
	game.physics.enable(this);
	this.enableBody = true;
	this.body.immovable = true;
	this.scale.setTo(.5);

    this.superX = superX;
    this.superY = superY;
}

Battery.prototype = Object.create(Phaser.Sprite.prototype);  
Battery.prototype.constructor = Battery;

Battery.prototype.update = function() {
	game.physics.arcade.overlap(player, this, batteryAdd, null, this);
}