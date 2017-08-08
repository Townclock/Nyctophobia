var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var player;

function preload() {
	game.load.image('player', 'Assets/triangle.jpg');
	game.load.image('wall', 'Assets/purplebrick.png');
}

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	walls = game.add.group();
	for(var x = 0; x < 8; x++){
		wall = new Wall(game, 100 + (x * 70), 100, 'wall');
		walls.add(wall);
	}
	for(var y = 0; y < 8; y++){
		wall = new Wall(game, 100, 100 + (y * 50), 'wall');
		walls.add(wall);
	}
	
	player = new Player(game, 400, 400, 'player', null, walls);
	player.scale.setTo(.3);
	game.add.existing(player);
}

function update() {
}