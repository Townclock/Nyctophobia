function Light(game, x, y, key, a, t) {
    Phaser.Sprite.call(this, game, x, y, key);
    this.scale.setTo(.5);
    this.anchor.setTo(.5, .35);
    this.active = a;
    this.type = t;
}

Light.prototype = Object.create(Phaser.Sprite.prototype);  
Light.prototype.constructor = Light;

Light.prototype.update = function() {
	if (this.active) {
		/*this.x = player.x;
		this.y = player.y;
		this.anchor.setTo(-.5, .7);*/
		var point = hcircle.circumferencePoint(game.physics.arcade.angleToPointer(player) + Math.PI/3);
		this.x = point.x;
		this.y = point.y;
		this.rotation = game.physics.arcade.angleToPointer(player) + (Math.PI / 2);
	} else {
		this.anchor.setTo(.5);
	}
};