var Title = function(game) {};

Title.prototype = {

    preload: function() {
    },

    create: function() {
        game.world.setBounds(0, 0,800, 600);
        //draw title image
        titleImage = game.add.image(game.world.centerX, game.world.centerY, 'title');
        titleImage.anchor.setTo(.5, .5);
        titleImage.alpha = 0;
        game.input.mouse.capture = true;
        f = -60;
    },
    
    update: function() {

        //title image flicker effect
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

        //switch to Play state on left mouse button press
        if (game.input.activePointer.leftButton.isDown) {
            game.state.start('Play');
        }
    }
};