var Load = function(game) {};

Load.prototype = {

    preload: function() {
        game.load.path = 'assets/img/';
        game.load.image('title', 'Title.png');
        game.load.spritesheet('player', 'character.png', 91, 128, 5);
        game.load.image('wall', 'purplebrick.png');
        game.load.spritesheet('monster', 'monster.png', 128, 109, 3);
        game.load.image('torch', 'torch.png');
        game.load.image('light', 'light.png');
        game.load.image('battery', 'battery.png');
        game.load.image('background', 'background.png');
		game.load.image('pause', 'pause.png');
		game.load.image('resume', 'resume.png');
		game.load.image('menu', 'menu.png');
		game.load.image('stairs', 'stair.png');
		game.load.image('glowStick', 'glowstick.png');
		game.load.image('win', 'win.png');
		game.load.image('lose', 'lose.png');

        game.load.path = 'assets/audio/';
        game.load.audio('ambient', 'ambient.mp3');
        game.load.audio('ambient2', 'ambient2.mp3');
        game.load.audio('bg', 'background.mp3');
        game.load.audio('bg2', 'background2.mp3');
        game.load.audio('flashOff', 'flashlightoff.mp3');
        game.load.audio('flashOn', 'flashlighton.mp3');
        game.load.audio('glowOff', 'glowstickoff.mp3');
        game.load.audio('glowOn', 'glowstickon.mp3');
        game.load.audio('itemCollect', 'itemcollect.mp3');
        //game.load.audio('monChase', 'monsterchase.mp3');
        game.load.audio('monGrowl', 'monstergrowl.mp3');
        game.load.audio('monGrowl2', 'monstergrowl2.mp3');
        game.load.audio('monGrowl3', 'monstergrowl3.mp3');
        game.load.audio('titleFlicker', 'titleflicker.mp3');
        //game.load.audio('torchDrop', 'torchdrop.mp3');
        game.load.audio('torchError', 'torcherror.mp3');
        game.load.audio('torchLight', 'torchlight.mp3');
        game.load.audio('walk', 'walk.mp3');
    },

    create: function() {
        //load music
        game.ambient = game.add.audio('ambient');
        game.ambient2 = game.add.audio('ambient2');
        game.bg = game.add.audio('bg');
        game.bg2 = game.add.audio('bg2');
        game.flashOff = game.add.audio('flashOff');
        game.flashOn = game.add.audio('flashOn');
        game.glowOff = game.add.audio('glowOff');
        game.glowOn = game.add.audio('glowOn');
        game.itemCollect = game.add.audio('itemCollect');
        game.monChase = game.add.audio('monChase');
        game.monGrowl = game.add.audio('monGrowl');
        game.monGrowl2 = game.add.audio('monGrowl2');
        game.monGrowl3 = game.add.audio('monGrowl3');
        game.titleFlicker = game.add.audio('titleFlicker');
        //game.torchDrop = game.add.audio('torchDrop');
        game.torchError = game.add.audio('torchError');
        game.torchLight = game.add.audio('torchLight');
        game.walk = game.add.audio('walk');

        game.allowMultiple = true;
    },
    
    update: function() {
        game.state.start('Title');
    }
};
