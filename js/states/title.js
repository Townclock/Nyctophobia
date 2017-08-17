var Title = function(game) {};

Title.prototype = {

    preload: function() {
    },

    create: function() {
        titleImage = game.add.image(game.world.centerX, game.world.centerY, 'title');
        titleImage.anchor.setTo(.5, .5);
        titleImage.alpha = 0;
        game.input.mouse.capture = true;
        f = -60;
    },
    
    update: function() {
        if (f < -1) {
            f++;
        } else if (f === -1) {
            f = 40;
        } else if (f <= 0) {
            if (Math.random() > .99) {
                f = Math.floor(Math.random() * 20) + 10;
            }
        } else if (f === 1) {
            titleImage.alpha = 1;
            f--;
        } else {
            titleImage.alpha = Math.random();
            f--;
        }
        if (game.input.activePointer.leftButton.isDown) {
            game.state.start('Play');
        }
    }
};