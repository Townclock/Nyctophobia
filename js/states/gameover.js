var GameOver = function() {};

GameOver.prototype = {

    preload: function() {
    },

    create: function() {
    	game.bg.stop();
        game.walk.stop();
        game.monChase.stop();
        game.sound.mute = true;
        f = 3;
        death = game.add.image(0, 0, 'lose');
        life = game.add.image(0, 0, 'win');
        death.visible = false;
        life.visible = false;
        death.alpha = 0;
        life.alpha = 0;
        timer = game.time.create(false);
        timer.add(6000, function(){game.state.start('Title')}, this)
        timer.start();
        deathFade = false;
    },

    update: function() {
    	//win
        if (!player.ded){
        	game.stage.backgroundColor = 0x000000;
        	life.visible = true;
        	if (deathFade){
        	    	life.alpha -= .005;
        		}
        	    else {
        	    	life.alpha += .005;
        	    	if (life.alpha > .99){
        	    		deathFade = true;
        	    	}
        	    }
        }
        //lose
        else{
        	//flash color screen
        	if (f < 0) {
        	    game.stage.backgroundColor = 0x000000;
        	    death.visible = true;
        	    if (deathFade){
        	    	death.alpha -= .005;
        		}
        	    else {
        	    	death.alpha += .005;
        	    	if (death.alpha > .99){
        	    		deathFade = true;
        	    	}
        	    }
        	} else {
            	f--;
        	}
        }
    }
}