var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('star', 'assets/img/star.png');
    game.load.image('diamond', 'assets/img/diamond.png');
}

function create() {
	diamond = game.add.sprite(100, 100, 'diamond');
	star = game.add.sprite(200, 100, 'star');

	game.physics.arcade.enable(diamond);
    game.physics.arcade.enable(star);


}

function update() {
	cursors = game.input.keyboard.createCursorKeys();
	
	diamond.body.velocity.x = 0;
	diamond.body.velocity.y = 0;

	//star.body.velocity = 100;
	//Diamond movement
    if (cursors.left.isDown)
    {
        //Move to the left
        diamond.body.velocity.x = -150;
    }
    else if (cursors.right.isDown)
    {
        //Move to the right
        diamond.body.velocity.x = 150;
    }else if (cursors.up.isDown)
    {
        //Move to the right
        diamond.body.velocity.y = -150;
    }else if (cursors.down.isDown)
    {
        //Move to the right
        diamond.body.velocity.y = 150;
    }

    //find angle for monster and character
    var targetAngle = game.physics.arcade.angleBetween(diamond, star);

    star.body.velocity.x = -50 * Math.cos(targetAngle);
    star.body.velocity.y = -50 * Math.sin(targetAngle);
}