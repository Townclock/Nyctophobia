// ray casting code adapted from https://gamemechanicexplorer.com/#raycasting-3
var Play = function(game) {};

Play.prototype = {

    preload: function() {
        torchCount = 10;
        batteryCount = 10;
		
	},

    create: function() {
        k1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        k2 = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        k3 = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        game.input.mouse.capture = true;

        localObjects = game.add.group();

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0, 0, 1440, 1200);
        var bg = game.add.image(0, 0, 'background');
        bg.scale.setTo(3.2);
        bg.sendToBack();
        

        menu = game.add.image(100, 100, 'menu');
        menu.exists = false;
		pauseButton = game.add.button(650, 25, 'pause', function(){
	        game.paused = !game.paused;
            ////console.log('paused:' + game.paused);
            resumeButton.exists = true;
            resumeButton.bringToTop();
            pauseButton.exists = false;
            menu.bringToTop();
            menu.exists = true;
            },this);
		resumeButton = game.add.button(650, 25, 'resume', function(){
            game.paused = !game.paused;
            resumeButton.exists = false;
            pauseButton.exists = true;
            pauseButton.bringToTop();
            menu.exists = false;
            },this);
        resumeButton.exists = false;

        menu.fixedToCamera = true;
        pauseButton.fixedToCamera = true;
        resumeButton.fixedToCamera = true;



        lwalls = game.add.group();
        walls = game.add.group();
    
        player = new Player(game, 160, 420, 'player', null, walls);
        monster = new Monster(game, 407, 573, 1, 1, 'monster', null, walls);
        torch = new Torch(game, 250, 120, 0, 0, 'torch', null, walls);
        battery = new Battery(game, 400, 280, 1, 0, 'battery', null, walls);

        localObjects.add(monster);
        localObjects.add(torch);
        localObjects.add(battery);
        
        
        lights = game.add.group();
        //game, x, y, key, active, type (0 glowstick, 1 torch, 2 flashlight)
        glowstick = new Light(game, player.x, player.y, 'torch', true, 0);
        flashlight = new Light(game, player.x, player.y, 'torch', false, 2);
        al = 0;
        //light2 = new Light(game, 500, 400, 'torch', false, 1);
        lights.add(glowstick);
        lights.add(flashlight);
        
        game.add.existing(player);
        game.stage.backgroundColor = 0x882110;


        // bitmap for the light cones
        this.bitmap = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
        this.bitmap.context.fillStyle = 'rgb(255,255,255)';
        this.bitmap.context.strokeStyle = 'rgb(255,255,255)';
        lightBitmap = this.game.add.image(0,0, this.bitmap);

        //lightBitmap.fixedToCamera = true;


        bmd = game.add.bitmapData(this.game.world.width, this.game.world.height);
        bmd.context.fillStyle = 'rgb(255,255,255)';
        bmd.context.strokeStyle = 'rgb(255,255,255)';
        

        circleBitmap = game.add.image(0,0, bmd);
        //circleBitmap.visible = false;
        //lightBitmap.visible = false;
        //circleBitmap.fixedToCamera = true;

        innerCircle = new Phaser.Circle(player.x, player.y, 200);
        outerCircle = new Phaser.Circle(player.x, player.y, 300);
        
        hcircle = new Phaser.Circle(player.x, player.y, 60);
        
        circleBitmap.blendMode = Phaser.blendModes.MULTIPLY;
        
        // this bitmap will be masked over the rest of the game. darks in it will be shaded, lights will be clear
        lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;
        
        
        // create the bitmap
        this.rayBitmap = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
        this.rayBitmapImage = this.game.add.image(0, 0, this.rayBitmap);
        this.rayBitmapImage.visible = !true;/**/
        //game.world.scale.setTo(.5);
        game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON);
        buildMap('00');
        
        game.input.onDown.add(function(){
        	if(al < 2){
                    if(al == 1){
                        if(lights.children[1].active){
                            //flashlight off sound
                            game.flashOff.play('', 0, 0.35, false, true);
                        }else{
                            //flashlight on sound
                            game.flashOn.play('', 0, 0.35, false, true);
                        }
                    }
                    if(al == 0){
                        if(lights.children[0].active){
                            //glowstick off sound
                            game.glowOff.play('', 0, 0.75, false, true);
                        }else{
                            //glowstick on sound
                            game.glowOn.play('', 0, 0.75, false, true);
                        }
                    }
        		lights.children[al].x = hcircle.circumferencePoint(game.physics.arcade.angleToPointer(player) + Math.PI/3).x;
        		lights.children[al].y = hcircle.circumferencePoint(game.physics.arcade.angleToPointer(player) + Math.PI/3).y;
            	lights.children[al].active = !lights.children[al].active;
            }
        }, this);

    pauseButton.bringToTop();

    game.time.events.add(Phaser.Timer.SECOND * 15, ambient1, this);
},

    update: function() {
        document.getElementById("torchCount").innerHTML = torchCount;
        document.getElementById("batteryCount").innerHTML = batteryCount;

        if(k1.justPressed() && !lights.children[0].active){
            for (var x = 0; x < lights.children.length; x++){
                lights.children[x].active = false;
            }
            lights.children[0].x = hcircle.circumferencePoint(game.physics.arcade.angleToPointer(player) + Math.PI/3).x;
        	lights.children[0].y = hcircle.circumferencePoint(game.physics.arcade.angleToPointer(player) + Math.PI/3).y;
            lights.children[0].active = true;
            al = 0;
            //glowstick on sound
            game.glowOn.play('', 0, 0.75, false, true);
        }
        else if(k3.justPressed() && (!lights.children[1].active || lights.children[1].charge < 1)){
            if (lights.children[1].charge > 0){
                for (var x = 0; x < lights.children.length; x++){
                    lights.children[x].active = false;
                }
                lights.children[1].x = hcircle.circumferencePoint(game.physics.arcade.angleToPointer(player) + Math.PI/3).x;
            	lights.children[1].y = hcircle.circumferencePoint(game.physics.arcade.angleToPointer(player) + Math.PI/3).y;
                lights.children[1].active = true;
            }
            else if (batteryCount > 0){
                for (var x = 0; x < lights.children.length; x++){
                    lights.children[x].active = false;
                }
                lights.children[1].charge = 100;
                lights.children[1].active = true;
                batteryCount --;
            }
            al = 1;
            //flashlight on sound
            game.flashOn.play('', 0, 0.35, false, true);
        }
        else if(k2.justPressed()){
            if(torchCount > 0){
                for (var x = 0; x < lights.children.length; x++){
                    lights.children[x].active = false;
                }
                torch = new Light(game, hcircle.circumferencePoint(game.physics.arcade.angleToPointer(player) + Math.PI/3).x, 
            						  hcircle.circumferencePoint(game.physics.arcade.angleToPointer(player) + Math.PI/3).y, 
            						  'torch', true, 1);
                lights.add(torch);
                torchCount--;
                al = 2;
                //torch light sound
                game.torchLight.play('', 0, 0.35, false, true);
            }else{
                //torch error sound
                game.torchError.play('', 0, 0.75, false, true);
            }
        }

        hcircle.x = player.x;
        hcircle.y = player.y;
        
        bmd.cls();
        bmd.context.fillStyle = 'rgb(00, 00, 00)';
        bmd.context.fillRect(0,0, this.game.world.width, this.game.world.height);
        // fill the stage with darkness
        ////console.log(this.bitmap)
        this.bitmap.context.fillStyle = 'rgb(00, 00, 00)';
        this.bitmap.context.fillRect(0, 0, this.game.world.width, this.game.world.height);


        
        
lights.forEach(function(light){
if (light.charge > 0 && (light.active || light.type === 1)){
        var stageCorners = [];
        ncircle = new Phaser.Circle(light.x, light.y, light.radius * 2);
		
		if (light.type > 1){
        	scircle = new Phaser.Circle(light.x, light.y, 2);
        	stageCorners.push(scircle.circumferencePoint(Math.PI + game.physics.arcade.angleToPointer(player)));
		
			for (var x = 0; x <= 12; x++){
				stageCorners.push(ncircle.circumferencePoint(game.physics.arcade.angleToPointer(player) + ((Math.PI/48) * (x - 6))));
			}
		}
		else{
			for (var x = 0; x < 64; x++){
				stageCorners.push(ncircle.circumferencePoint((Math.PI/32) * x));
			}
		}
        
        // ray cast through the corners of the walls
        var points = [];
        var ray = null;
        var intersect;
        var i;
        lwalls.forEach(function(wall){
        if (! wall.inCamera)
        {
            return;
        }
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
                if (light.type < 2
                	|| Math.abs(ray.angle - game.physics.arcade.angleToPointer(player)) < Math.PI/8
                	|| Math.abs(((Math.PI * 2 + ray.angle) % (Math.PI * 2)) - (Math.PI * 2 + game.physics.arcade.angleToPointer(player)) % (Math.PI * 2)) < Math.PI/8 ){
                	// check if it intercepts with wall global function
                    intersect = getWallIntersection(ray, lwalls);
                    if (intersect){
                        points.push(intersect)
                    }
                    else {
                        points.push(ray.end);
                    }
                }
            
            }
        }, this)

        // we need to add the corners of the screen to our point set if they are not in shadow
        for (i = 0; i < stageCorners.length; i++){
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
        ////console.log(points.length)
        
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
        this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
        this.bitmap.context.moveTo(points[0].x, points[0].y);
        for (var j = 0; j < points.length; j++){
            this.bitmap.context.lineTo(points[j].x, points[j].y);
        }    
        this.bitmap.context.closePath();
        this.bitmap.context.fill();
        
        this.rayBitmap.cls();
        this.rayBitmap.context.beginPath();
        this.rayBitmap.context.strokeStyle = 'rgb(255, 255, 255)';
        this.rayBitmap.context.fillStyle = 'rgb(255, 255, 255)';
        this.rayBitmap.context.moveTo(points[0].x, points[0].y);
        for(var k = 0; k < points.length; k++) {
            this.rayBitmap.context.moveTo(light.x, light.y);
            this.rayBitmap.context.lineTo(points[k].x, points[k].y);
            this.rayBitmap.context.fillRect(points[k].x-2, points[k].y-2, 4, 4);
        }
        this.rayBitmap.context.stroke();/**/
        
        innerCircle.x = light.x;
        innerCircle.y = light.y;
        outerCircle.x = light.x;
        outerCircle.y = light.y;
        
        var fs;
        if (light.type > 1){
            fs = 'rgba(255, 255, 255, '+ light.lalpha + ')';
            bmd.context.beginPath();
            //bmd.context.arc(light.x, light.y, 1000, game.physics.arcade.angleToPointer(player) - Math.PI/8, game.physics.arcade.angleToPointer(player) + Math.PI/8, false);
            bmd.context.fillStyle = fs;
            //bmd.context.lineTo(light.x, light.y);
            bmd.context.moveTo(points[0].x, points[0].y);
            for (var j = 0; j < points.length; j++){
                bmd.context.lineTo(points[j].x, points[j].y);
            }    
            bmd.context.closePath();
            bmd.context.fill();
        }
        else{
            fs = light.type > 0 ? 'rgba(255, 200, 50, .2)' : 'rgba(50, 255, 100, .2)';
            outerCircle.radius = light.radius;
            
            var grd = bmd.context.createRadialGradient(innerCircle.x, innerCircle.y, innerCircle.radius-100, outerCircle.x, outerCircle.y, outerCircle.radius);
            grd.addColorStop(0, '#FFFFFF');
            grd.addColorStop(1, fs);
             
            bmd.circle(outerCircle.x, outerCircle.y, outerCircle.radius, grd);
        }
        
       
}
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
        this.rayBitmap.dirty = true;

    },


    render: function() {
        //game.debug.body(player);
    }
};

function pauseState() {
	game.paused = !game.state.paused;
	//pauseButton.exists = false;
	//resumeButton.exists = true;
}

/*function resumeState() {
	game.state.resume();
	resumeButton.exists = false;
	pauseButton.exists = true;
		
}*/


getWallIntersection = function (ray, wall_group) {
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
    
    if(distanceToWall > ncircle.radius && ray.length > ncircle.radius){
        closestIntersection = ncircle.circumferencePoint(ray.angle);
    }
    
    return closestIntersection;
}

buildMap = function(room) {
    localObjects.forEach(function(object){
    ////console.log(object)
        if (object.superX == player.superX && object.superY == player.superY){
            object.exists = true;
        }
        else{
            object.exists = false;
        }
    }, this);



//world bounds
/*    for(var x = 0; x < 23; x++){
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
        wall = new Wall(game, game.world.width - 5, y, 'wall');
        walls.add(wall);
    }
  */  
    makeWall(1, 2, 3, true, 0);
    walls.callAll('destroy');
    while(walls.children.length){
   		walls.forEach(function(wall){
        wall.destroy();
    }, this);}
    while(lwalls.children.length){
    lwalls.forEach(function(wall){
        wall.destroy();
    }, this);}
 switch(room){
    case '00':
        makeWall(2, 1, 4, true, 4);
        makeWall(1, 5, 2, false, 1);
        makeWall(0, 5, 5, true, 0);
        makeWall(1, 9, 5, false, 1);
        makeWall(3, 1, 8, false, 1);
        makeWall(5, 4, 5, true, 4);
        makeWall(6, 4, 2, false, 1);
        makeWall(10, 2, 5, true, 3);
        makeWall(7, 5, 5, true, 3);
        makeWall(8, 9, 12, false, 1);
        makeWall(11, 6, 9, false, 1);
        break;

    case '10':
        makeWall(0, 6, 5, false, 0);
        makeWall(0, 9, 7, false, 2);
        makeWall(7, 3, 6, true, 4);
        makeWall(3, 3, 4, false, 2);
        makeWall(0, 0, 6, true, 4);
        makeWall(1, 0, 10, false, 1);
        makeWall(10, 1, 21, true, 3);
        makeWall(7, 9, 13, true, 3);
        break;
    case '11':
        makeWall(7, 0, 2, true, 4);
        makeWall(10, 0, 3, true, 0);
        makeWall(3, 2, 5, false, 1);
        makeWall(11, 2, 5, false, 1);
        makeWall(2, 2, 10, true, 4);
        makeWall(15, 3, 10, true, 3);
        makeWall(2, 12, 5, false, 2);
        makeWall(10, 12, 5, false, 2);
        makeWall(7, 12, 3, true, 4);
        makeWall(7, 15, 5, false, 2);
        makeWall(12, 13, 3, true, 3);
        break;
    default:
    }
}

//makes a wall and its lightwall
//x, y, length(in Walls), boolean vertical, border(1 left, 2 right, 3 up, 4 down)
makeWall = function (x, y, l, v, b) {
    lwall = new Wall(game, x, y, 'wall');
    lwall.x += 5;
    lwall.y += 5;
    lwall.scale.x = .8 + (!v * l - !v);
    lwall.scale.y = .8 + (v * l - v);

    for(var n = 0; n < l; n++){
        wall = new Wall(game, x + (n * (!v)), y + (n * v), 'wall');
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

//pick up torch function
torchAdd = function (player, torch) {
    torch.kill();
    torchCount++;
    game.itemCollect.play('', 0, 0.5, false, true);
    ////console.log(torchCount);
}

//pick up battery function
batteryAdd = function (player, battery) {
    battery.kill();
    batteryCount++;
    game.itemCollect.play('', 0, 0.5, false, true);
    ////console.log(batteryCount);
}

ambient1 = function() {
    game.ambient.play('', 0, 0.4, false, true);
    this.time.events.add(Phaser.Timer.SECOND * 20, ambient2, this);
}

ambient2 = function() {
    game.ambient2.play('', 0, 0.4, false, true);
    this.time.events.add(Phaser.Timer.SECOND * 20, ambient1, this);
}