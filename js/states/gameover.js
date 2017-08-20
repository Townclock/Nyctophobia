var GameOver = function() {};

GameOver.prototype = {

    preload: function() {
    },

    create: function() {
        f = 3;
    },

    update: function() {
        
        //flash color screen
        if (f < 0) {
            game.stage.backgroundColor = 0x000000;
            game.state.start('Title');
        } else {
            f--;
        }
    }
}