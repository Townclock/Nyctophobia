var active;

function Light(game, x, y, key, a, player) {
    Phaser.Sprite.call(this, game, x, y, key);
    this.anchor.setTo(.5);
    this.active = a;
}

Light.prototype = Object.create(Phaser.Sprite.prototype);  
Light.prototype.constructor = Light;

Light.prototype.update = function() {
	if(this.active){
		this.x = player.x;
		this.y = player.y;
		this.rotation = game.physics.arcade.angleToPointer(this) + (Math.PI / 2);
	}
};