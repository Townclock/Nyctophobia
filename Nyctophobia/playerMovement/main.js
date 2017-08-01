var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var ship;

function preload() {
	game.load.spritesheet('ship', 'Assets/fullsheet.png', 16, 16);
}

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
//	cursors = game.input.keyboard.addKey(Phaser.Keyboard.R);

	ship = new Player(game, Math.random() * 800, Math.random() * 600, 'ship', Math.floor(Math.random() * 18));
	game.add.existing(ship);
}

function update() {
}