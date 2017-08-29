
function Staircase(game, x, y, key, dest, sX, sY) {
    Phaser.Sprite.call(this, game, x, y, key);
    this.superX = sX;
    this.superY = sY;
    this.destination = dest;
    if(this.destination){
        this.destination.destination = this;
    }
    game.physics.enable(this);
    this.enableBody = true;
    this.overlapping = false;
}

Staircase.prototype = Object.create(Phaser.Sprite.prototype);  
Staircase.prototype.constructor = Staircase;

Staircase.prototype.update = function() {
    if (!this.overlapping){
        game.physics.arcade.overlap(player, this, function(p, d){
            p.superX = d.superX;
            p.superY = d.superY;
            p.x = d.x;
            p.y = d.y;
            d.overlapping = true;
            buildMap(d.superX + '' + d.superY);
        }, player, this.destination);
    }
    else{
        this.overlapping = false;
        game.physics.arcade.overlap(player, this, function(stair){
            this.overlapping = true;
        }, this);
    }
};