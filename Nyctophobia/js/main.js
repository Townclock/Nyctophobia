var game = new Phaser.Game(800, 600, Phaser.Auto, '');


var Title = function(game) {};
Title.prototype = {
    
    preload : function(){
        game.load.image('title', 'assets/Title.png');
        console.log('Title State: Preload');
    },
    create: function(){
        titleImage = game.add.sprite(game.world.centerX, game.world.centerY, 'title');
        titleImage.anchor.setTo(.5, .5);
        
        titleImage.alpha = 0;

        game.add.tween(titleImage).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true)
        console.log('Title State: Create');
    },

   
    update: function(){
    }


}


runGame= function(){
    game.state.add('Title', Title);
    game.state.start('Title');
}
