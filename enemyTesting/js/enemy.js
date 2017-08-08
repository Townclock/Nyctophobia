var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('monster', 'assets/img/star.png');
    game.load.image('player', 'assets/img/diamond.png');
}

function create() {
	player = game.add.sprite(100, 100, 'player');
	monster = game.add.sprite(200, 100, 'monster');

	game.physics.arcade.enable(player);
    game.physics.arcade.enable(monster);


}

function update() {
	cursors = game.input.keyboard.createCursorKeys();
	
	player.body.velocity.x = 0;
	player.body.velocity.y = 0;

	//star.body.velocity = 100;
	//Diamond movement
    if (cursors.left.isDown)
    {
        //Move to the left
        player.body.velocity.x = -150;
    }
    else if (cursors.right.isDown)
    {
        //Move to the right
        player.body.velocity.x = 150;
    }else if (cursors.up.isDown)
    {
        //Move to the right
        player.body.velocity.y = -150;
    }else if (cursors.down.isDown)
    {
        //Move to the right
        player.body.velocity.y = 150;
    }

    //find angle for monster and character
    var targetAngle = game.physics.arcade.angleBetween(player, monster);

    monster.body.velocity.x = -50 * Math.cos(targetAngle);
    monster.body.velocity.y = -50 * Math.sin(targetAngle);

    function destroyPlayer(player, monster){
        player.kill();
    }

    game.physics.arcade.overlap(player, monster, destroyPlayer, null, this);

}