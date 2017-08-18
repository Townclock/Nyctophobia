var game;
var previousPoints;
var player;
var f = 0;
var innerCircle;
var outerCircle;
var bmd;
var lights;
var ncircle;

window.onload = function() {
    game = new Phaser.Game(800, 600, Phaser.AUTO);
    // define states
    game.state.add('Load', Load);
    game.state.add('Title', Title);
    game.state.add('Play', Play);
    game.state.add('GameOver', GameOver);
    //start
    game.state.start('Load');
};

var Load = function(game){};
Load.prototype = {
    preload : function(){
        game.load.path = '../assets/Images/';
        game.load.image('title', 'Title.png');
        game.load.spritesheet('player', 'walking1.png', 80, 115, 6);
        game.load.image('wall', 'purplebrick.png');
        //game.load.image('monster', 'triangle2.png');
        game.load.image('circle', 'bitmapCircle.png');
        game.load.image('torch', 'torch.png');
        game.load.image('battery', 'New size images/battery(s).png');
    },
    create : function(){
    },
    update : function(){
        game.state.start('Title');
    }
};

var Title = function(game) {};
Title.prototype = {

    preload : function(){
    },
    create: function(){
        titleImage = game.add.image(game.world.centerX, game.world.centerY, 'title');
        titleImage.anchor.setTo(.5, .5);
        titleImage.alpha = 0;
        game.input.mouse.capture = true;
        f = -60;
    },
    update: function(){
        if(f < -1){
            f++;
        }
        else if (f === -1){
            f = 40;
        }
        else if (f <= 0){
            if(Math.random() > .99){
                f = Math.floor(Math.random() * 20) + 10;
            }
        }
        else if (f === 1){
            titleImage.alpha = 1;
            f--;
        }
        else{
            titleImage.alpha = Math.random();
            f--;
        }
        if(game.input.activePointer.leftButton.isDown){
            game.state.start('Play');
        }
    }
};

var Play = function(game){}
Play.prototype = {
    // ray casting code adapted from https://gamemechanicexplorer.com/#raycasting-3

    preload : function() {
        torchCount = 0;
        batteryCount = 0;
    },

    create : function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 1600, 1200);
        
        
        lwalls = game.add.group();
        walls = game.add.group();
        buildMap(walls, lwalls);
    
        player = new Player(game, 20, 20, 'player', null, walls);
        monster = new Monster(game, 250, 250, 'monster', null, walls);
        torch = new Torch(game, 32, 128, 'torch', null, walls);
        battery = new Battery(game, 32, 172, 'battery', null, walls);

       
        //game.add.existing(monster);
        game.add.existing(torch);
        game.add.existing(battery);
        
        lights = game.add.group();
        //game, x, y, key, active
        light1 = new Light(game, player.x, player.y, 'torch', true);
        light2 = new Light(game, 400, 400, 'torch', false, {});
        lights.add(light1);
        lights.add(light2);
        
        game.add.existing(player);
        // lightCircleImage
        //lightCircle = game.add.image(player.x, player.y, 'circle')
        //lightCircle.anchor.setTo(0.5, 0.5);
        game.stage.backgroundColor = 0x882110;


        // bitmap for the light cones
        this.bitmap = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
        this.bitmap.context.fillStyle = 'rgb(255,255,255)';
        this.bitmap.context.strokeStyle = 'rgb(255,255,255)';
        var lightBitmap = this.game.add.image(0,0, this.bitmap);

        bmd = game.add.bitmapData(this.game.world.width, this.game.world.height);
        bmd.context.fillStyle = 'rgb(255,255,255)';
        bmd.context.strokeStyle = 'rgb(255,255,255)';
        var circleBitmap = game.add.image(0,0, bmd);
        //circleBitmap.visible = false;
    	//lightBitmap.visible = false;
        
        innerCircle = new Phaser.Circle(player.x, player.y, 200);
        outerCircle = new Phaser.Circle(player.x, player.y, 300);
        
        circleBitmap.blendMode = Phaser.blendModes.MULTIPLY;
        
        
        
        // this bitmap will be masked over the rest of the game. darks in it will be shaded, lights will be clear
        lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;
        
        
        // create the bitmap
        /*this.rayBitmap = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
        this.rayBitmapImage = this.game.add.image(0, 0, this.rayBitmap);
        this.rayBitmapImage.visible = false;*/
        //game.world.scale.setTo(.5);
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
    },

    update : function() {
        bmd.cls();
        bmd.context.fillStyle = 'rgb(0,0,0)';
        bmd.context.fillRect(0,0, this.game.world.width, this.game.world.height);
        // fill the stage with darkness
        console.log(this.bitmap)
        this.bitmap.context.fillStyle = 'rgb(00, 00, 00)';
        this.bitmap.context.fillRect(0, 0, this.game.world.width, this.game.world.height);
        

        /*/ stage corners
        var stageCorners = [
            new Phaser.Point(0, 0),
            new Phaser.Point(this.game.world.width, 0),
            new Phaser.Point(this.game.world.width, this.game.world.height),
            new Phaser.Point(0, this.game.world.height)
        ];*/
        
lights.forEach(function(light){
		var stageCorners = [];
        
		ncircle = new Phaser.Circle(light.x, light.y, 300);
		
		for (var x = 0; x < 64; x++){
			stageCorners.push(ncircle.circumferencePoint((Math.PI/32) * x));
		}
        // ray cast through the corners of the walls
        var points = [];
        var ray = null;
        var intersect;
        var i;
        lwalls.forEach(function(wall){
            var corners = [
                new Phaser.Point(wall.x + 0.1 , wall.y + 0.1),
                new Phaser.Point(wall.x - 0.1 , wall.y - 0.1),
                
                new Phaser.Point(wall.x - 0.1 + wall.width, wall.y + 0.1),
                new Phaser.Point(wall.x + 0.1 + wall.width, wall.y - 0.1),

                new Phaser.Point(wall.x - 0.1 + wall.width , wall.y - 0.1 + wall.height),
                new Phaser.Point(wall.x + 0.1 + wall.width , wall.y + 0.1 + wall.height),
            
                new Phaser.Point(wall.x + 0.1 , wall.y - 0.1 + wall.height),
                new Phaser.Point(wall.x - 0.1 , wall.y + 0.1 + wall.height)
            ]
        // calculate the rays through the edges to the end of the stage
            for( i = 0; i < corners.length; i++){
                var c = corners[i];

                //quoted directly from source
                // "Here comes the linear algebra.
                // The equation for a line is y = slope * x + b
                // b is where the line crosses the left edge of the stage"

                var slope = (c.y - light.y) / (c.x - light.x)
                var b = light.y - slope * light.x;

                var end = null;


                if (c.x === light.x){   // if lights are beneath one of the four corners
                    if (c.y <= light.y){
                        end = new Phaser.Point(light.x, 0)
                    }
                    else {
                        end = new Phaser.Point(light, this.game.world.height);
                    }
                }
                else if (c.y === light.y){ //light is horizontal to a corner
                    if (c.x <= light.x){
                        end = new Phaser.Point(0, light.y)
                    }
                    else{
                        end = new Phaser.Point(this.game.world.width, light.y)
                    }
                }
                
                else {     //base case
                    // find the point where the line crosses the edge
                    var left = new Phaser.Point(0, b);
                    var right = new Phaser.Point(this.game.world.width, slope * this.game.world.width + b);
                    var top = new Phaser.Point(-b/slope, 0);
                    var bottom = new Phaser.Point((this.game.world.height-b)/slope, this.game.world.height);

                    // get the actual intersections
                    if (c.y <= light.y && c.x >= light.x){
                        if (top.x >= 0 && top.x <= this.game.world.width){
                            end = top;
                        } else
                        {
                          end = right;
                        }
                    } else if(c.y <= light.y && c.x <= light.x){
                        if (top.x >= 0 && top.x <= this.game.world.width){
                            end = top;
                        }
                        else{
                            end = left;
                        }
                    } else if (c.y >= light.y && c.x >= light.x){
                        if (bottom.x >= 0 && bottom.x <= this.game.world.width){
                            end = bottom;
                        }else{
                            end = right;
                        }
                    } else if (c.y >= light.y && c.x <= light.x) {
                        if (bottom.x >= 0 && bottom.x <= this.game.world.width) {
                            end = bottom;
                        } else {
                            end = left;
                        }
                    
                    }  
                }

                // create the ray
                ray = new Phaser.Line(light.x, light.y, end.x, end.y); 
                
                // check if it intercepts with wall global function
                intersect = getWallIntersection(ray, lwalls);
                if (intersect){
                    points.push(intersect)
                }
                else {
                    points.push(ray.end);
                }
            
            }
        }, this)

        // we need to add the corners of the screen to our point set if they are not in shadow
        for (i = 0; i <stageCorners.length; i++){
            ray = new Phaser.Line(light.x, light.y, stageCorners[i].x, stageCorners[i].y);
            intersect = getWallIntersection(ray, lwalls)
            if (!intersect){
            //corner is in light
                points.push(stageCorners[i]);
            }
            else{
            	points.push(intersect);
            }
        
        }
        console.log(points.length)
        
        // !!!!! The next 22 lines are copied directly from https://gamemechanicexplorer.com/#raycasting-3 with no modifications except to the light source
        // Now sort the points clockwise around the light
        // Sorting is required so that the points are connected in the right order.
        //
        // This sorting algorithm was copied from Stack Overflow:
        // http://stackoverflow.com/questions/6989100/sort-points-in-clockwise-order
        //
        // Here's a pseudo-code implementation if you want to code it yourself:
        // http://en.wikipedia.org/wiki/Graham_scan
        var center = { x: light.x, y: light.y };
        points = points.sort(function(a, b) {
            if (a.x - center.x >= 0 && b.x - center.x < 0)
                return 1;
            if (a.x - center.x < 0 && b.x - center.x >= 0)
                return -1;
            if (a.x - center.x === 0 && b.x - center.x === 0) {
                if (a.y - center.y >= 0 || b.y - center.y >= 0)
                    return 1;
                return -1;
            }

            // Compute the cross product of vectors (center -> a) x (center -> b)
            var det = (a.x - center.x) * (b.y - center.y) - (b.x - center.x) * (a.y - center.y);
            if (det < 0)
                return 1;
            if (det > 0)
                return -1;

            // Points a and b are on the same line from the center
            // Check which point is closer to the center
            var d1 = (a.x - center.x) * (a.x - center.x) + (a.y - center.y) * (a.y - center.y);
            var d2 = (b.x - center.x) * (b.x - center.x) + (b.y - center.y) * (b.y - center.y);
            return 1;
        });


        // connect the dots of visible space and fill them with white.
        // through the mask, this should make everything in that space visible




        this.bitmap.context.beginPath();
        this.bitmap.context.fillStyle = 'rgb(255,255,255)';
        this.bitmap.context.moveTo(points[0].x, points[0].y);
        for (var j = 0; j < points.length; j++){
            this.bitmap.context.lineTo(points[j].x, points[j].y);
        }    
        this.bitmap.context.closePath();
        this.bitmap.context.fill();
        
        innerCircle.x = light.x;
        innerCircle.y = light.y;
        outerCircle.x = light.x;
        outerCircle.y = light.y;
        
        var grd = bmd.context.createRadialGradient(innerCircle.x, innerCircle.y, innerCircle.radius-100, outerCircle.x, outerCircle.y, outerCircle.radius);
        grd.addColorStop(0, '#FFFFFF');
        grd.addColorStop(1, 'rgba(255, 200, 80, .2)');
            
        bmd.circle(outerCircle.x, outerCircle.y, outerCircle.radius, grd);
    	
}, this);

    /*
        // difficult code for nearby light
        // currently using sprite instead
        this.bitmap.context.beginPath();
        this.bitmap.context.arc(player.x, player.y, 100, 0, 2*Math.PI, true);
        this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
        this.bitmap.context.closePath();
        this.bitmap.context.fill();
    */
        // This just tells the engine it should update the texture cache
        this.bitmap.dirty = true;
        //this.rayBitmap.dirty = true;

        //lightCircle.x = player.x;
        //lightCircle.y = player.y;
    }
};

getWallIntersection =  function (ray, wall_group){
    var distanceToWall = Number.POSITIVE_INFINITY;
    var closestIntersection = null;

    wall_group.forEach(function(wall){
    	// for each wall check create four edges to check if the ray intercepts
    	var lines = [
        	new Phaser.Line(wall.x, wall.y, wall.x + wall.width, wall.y),
        	new Phaser.Line(wall.x, wall.y, wall.x, wall.y + wall.height),
        	new Phaser.Line(wall.x + wall.width, wall.y, wall.x + wall.width, wall.y + wall.height),
        	new Phaser.Line(wall.x, wall.y + wall.height, wall.x + wall.width, wall.y + wall.height),
    	]
	    // test the raycast against all of the edges
    	for (var i = 0; i < lines.length; i++){
       	 	var intersect = Phaser.Line.intersects(ray, lines[i]);
        	if (intersect){
            	//find the closest intersect
            	distance = this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
        	    if (distance < distanceToWall){
     	            distanceToWall = distance;
                	closestIntersection = intersect;
            	
        	    }
    	    }
   	 	}
    }, this);
    
    if(distanceToWall > 150){
    	closestIntersection = ncircle.circumferencePoint(ray.angle);
    }
    
    return closestIntersection;


}

buildMap = function(){
    //world bounds
    for(var x = 0; x < 23; x++){
        wall = new Wall(game, x * 72, -50, 'wall');
        walls.add(wall);
    }
    for(var x = 0; x < 23; x++){
        wall = new Wall(game, x * 72, game.world.height - 7, 'wall');
        walls.add(wall);
    }
    for(var y = 1; y < 22; y++){
        wall = new Wall(game, -65, y * 56, 'wall');
        walls.add(wall);
    }
    for(var y = 1; y < 22; y++){
        wall = new Wall(game, game.world.width - 5, y * 56, 'wall');
        walls.add(wall);
    }
    //
    
    makeWall(100, 100, 7, false, 0);
    makeWall(100, 156, 7, true, 3);
    makeWall(260, game.world.height - 150, 3, true, 4);
    makeWall(game.world.width - 150, 0, 5, true, 3);
    makeWall(330, game.world.height - 150, 2, false, 1);
    makeWall(530, game.world.height - 263, 5, true, 4);
    makeWall(game.world.width - 220, 224, 1, false, 2);
    makeWall(207, 45, 1, true, 4);
    makeWall(407, 0, 1, true, 3);
    makeWall(290, 450, 3, false, 0);
    makeWall(352, 156, 2, true, 3);
    makeWall(674, game.world.height - 208, 2, true, 3);
    makeWall(602, game.world.height - 263, 2, false, 1);/**/
}

//makes a wall and its lightwall
//x, y, length(in Walls), boolean vertical, border(1 left, 2 right, 3 up, 4 down)
makeWall = function(x, y, l, v, b){
    lwall = new Wall(game, x + 5, y + 5, 'wall');
    lwall.scale.x = .8 + (!v * l - !v);
    lwall.scale.y = .8 + (v * l - v);

    for(var n = 0; n < l; n++){
        wall = new Wall(game, x + (n * 72 * (!v)), y + (n * 56 * v), 'wall');
        walls.add(wall);
    }

    switch (b){
        case 1:{
            lwall.x -= 15; 
            lwall.scale.x += .2;
            break;
        }
        case 2:{ 
            lwall.scale.x += .2;
            break;
        }
        case 3:{
            lwall.y -= 12;
            lwall.scale.y += .2;
            break;
        }
        case 4:{
            lwall.scale.y += .2;
            break;
        }
        default:{
        }
    }
    while(lwall.x + lwall.width > game.world.width){
        lwall.scale.x -= .01;
    }
    while(lwall.x < 0){
        lwall.x ++;
        lwall.scale.x -= .01;
    }
    while(lwall.y + lwall.height > game.world.height){
        lwall.scale.y -= .01;
    }
    while(lwall.y < 0){
        lwall.y ++;
        lwall.scale.y -= .01;
    }

    lwalls.add(lwall);
}

function torchAdd(player, torch){
        torch.kill();
        torchCount++;
        console.log(torchCount);
    }

    function batteryAdd(player, battery){
        battery.kill();
        batteryCount++;
        console.log(batteryCount);
    }

var GameOver = function(){};
GameOver.prototype = {
    preload : function (){},
    create : function () {
        f = 3;
    },
    update : function (){
        if(f < 0){
            game.stage.backgroundColor = 0x000000;
            game.state.start('Title')
        }
        else {
            f--;
        }
    }
}