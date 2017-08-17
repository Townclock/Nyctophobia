var Load = function(game) {};

Load.prototype = {

    preload: function() {
        game.load.path = 'assets/img/';
        game.load.image('title', 'Title.png');
        //game.load.image('player', 'triangle.png');
        game.load.image('wall', 'purplebrick.png');
        //game.load.image('monster', 'triangle2.png');
        game.load.image('circle', 'bitmapCircle.png');
        game.load.image('torch', 'torch.png');
        game.load.image('battery', 'battery.png');
    },

    create: function() {
    },
    
    update: function() {
        game.state.start('Title');
    }
};