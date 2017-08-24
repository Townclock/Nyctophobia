var Load = function(game) {};

Load.prototype = {

    preload: function() {
        game.load.path = '../../assets/img/';
        game.load.image('title', 'Title.png');
        game.load.spritesheet('player', 'walking1.png', 80, 115, 6);
        game.load.image('wall', 'purplebrick.png');
        game.load.image('monster', 'monster.png');
        game.load.image('torch', 'torch.png');
        game.load.image('battery', 'battery.png');
        game.load.image('background', 'background.png');
    },

    create: function() {
    },
    
    update: function() {
        game.state.start('Title');
    }
};