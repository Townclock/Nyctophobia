
function Staircase(game, x, y, key, dest, sX, sY, dir) {
    Phaser.Sprite.call(this, game, x, y, key);
    this.anchor.set(.5);
    this.superX = sX;
    this.superY = sY;
    this.destination = dest;
    if(this.destination){
        this.destination.destination = this;
    }
    game.physics.enable(this);
    this.enableBody = true;
    this.direction = dir;
    this.rotation = this.direction > 2 ? 0 : Math.PI / 2;
}

Staircase.prototype = Object.create(Phaser.Sprite.prototype);  
Staircase.prototype.constructor = Staircase;

Staircase.prototype.update = function() {

    game.physics.arcade.overlap(player, this, null, 
        function(p, d){
            p.superX = d.destination.superX;
            p.superY = d.destination.superY;
            p.x = d.destination.x;
            p.y = d.destination.y;
            switch(d.direction){
                case 1 : p.x -= 100;
                break;
                case 2 : p.x += 100;
                break;
                case 3 : p.y -= 100;
                break;
                case 4 : p.y += 100;
                break;
            }
            buildMap(d.destination.superX + '' + d.destination.superY);
        }, player, this.destination);

};