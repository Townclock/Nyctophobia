var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('monster', 'assets/img/star.png');
    game.load.image('player', 'assets/img/diamond.png');
    game.load.image('light', 'assets/img/firstaid.png');
}

function create() {
    player = game.add.sprite(100, 100, 'player');
    monster = game.add.sprite(200, 100, 'monster');

    game.physics.arcade.enable(player);
    game.physics.arcade.enable(monster);

    lights = game.add.group();
    lights.enableBody = true;
    game.physics.arcade.enable(lights);


}

function update() {
    cursors = game.input.keyboard.createCursorKeys();
    
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    //Diamond movement
    if (cursors.left.isDown)
    {
        //Move to the left
        player.body.velocity.x = -150;
    }
    else if (cursors.right.isDown)
    {
        //Move to the right
        player.body.velocity.x = 150;
    }else if (cursors.up.isDown)
    {
        //Move to the right
        player.body.velocity.y = -150;
    }else if (cursors.down.isDown)
    {
        //Move to the right
        player.body.velocity.y = 150;
    }

    //Create torches on 'T' key
    if(game.input.keyboard.justPressed(Phaser.Keyboard.T)){
        lights.create(player.body.x + 32, player.body.y + 32, 'firstaid');
    }

    //Monster goes to first created light
    if (lights.countLiving() > 0){
        this.physics.arcade.moveToObject(monster, lights.getFirstAlive(), 100);

    }else{
        monster.body.velocity.x = 0;
        monster.body.velocity.y = 0;
    }

    function destroyPlayer(player, monster){
        player.kill();
    }

    function collectLight(player, lights){
        lights.kill();
    }

    function stopMonster(monster, lights){
        monster.body.velocity.x = 0;
        monster.body.velocity.y = 0;

    }

    game.physics.arcade.overlap(player, monster, destroyPlayer, null, this);
    game.physics.arcade.overlap(player, lights, collectLight, null, this);
    game.physics.arcade.overlap(monster, lights, stopMonster, null, this);

}