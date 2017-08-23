var Load = function(game) {};

Load.prototype = {

    preload: function() {
        game.load.path = '../../assets/img/';
        game.load.image('title', 'Title.png');
        game.load.spritesheet('player', 'walking1.png', 80, 115, 6);
        game.load.image('wall', 'purplebrick.png');
        //game.load.image('monster', 'triangle2.png');
        game.load.image('circle', 'bitmapCircle.png');
        game.load.image('torch', 'New size images/torch(s).png');
        game.load.image('battery', 'New size images/battery(s).png');
        game.load.image('background', 'background.png');
    },

    create: function() {
    },
    
    update: function() {
        game.state.start('Title');
    }
};