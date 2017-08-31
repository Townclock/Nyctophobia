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
        game.sound.mute = false;
        //background music
        game.bg2.play('', 0, 0.2, true, true);
    },
    
    update: function() {

        //title image flicker effect
        if (f < -1) {
            f++;
        } else if (f === -1) {
            f = 40;
            //play flicker sound
            game.titleFlicker.play('', 0, 0.75, true, true);
        } else if (f <= 0) {
            if (Math.random() > .99) {
                f = Math.floor(Math.random() * 20) + 10;
                game.titleFlicker.resume();
            }
        } else if (f === 1) {
            titleImage.alpha = 1;
            f--;
            game.titleFlicker.pause();
        } else {
            titleImage.alpha = Math.random();
            f--;
        }

        //switch to Play state on left mouse button press
        if (game.input.activePointer.leftButton.isDown) {
            game.titleFlicker.stop();
            game.bg2.stop();
            //play background music
            game.bg.play('', 0, 0.4, true, true);
            game.state.start('Play');
        }
    }
};