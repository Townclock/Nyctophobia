var game;

var player,
	f = 0,
	innerCircle,
	outerCircle,
	bmd,
	lights,
	ncircle,
	scircle,
	hcircle,
	w,
	a,
	s,
	d,
	vtotal,
	torchCount = 0,
	batteryCount = 0;

window.onload = function() {
    game = new Phaser.Game(800, 600, Phaser.AUTO);

    game.state.add('Load', Load);
    game.state.add('Title', Title);
    game.state.add('Play', Play);
    game.state.add('GameOver', GameOver);
    
    //start
    game.state.start('Load');
};