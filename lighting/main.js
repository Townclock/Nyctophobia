// ray casting code copied from https://gamemechanicexplorer.com/#raycasting-3
// test variabe
var previousPoints;

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var player;




function preload() {
	game.load.image('player', 'Assets/triangle.jpg');
	game.load.image('wall', 'Assets/purplebrick.png');

    game.load.image('circle', 'bitmapCircle.png')

    game.stage.backgroundColor = 0x882110;


}

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	walls = game.add.group();
	for(var x = 0; x < 8; x++){
		wall = new Wall(game, 100 + (x * 70), 100, 'wall');
		walls.add(wall);
	}
	for(var y = 0; y < 8; y++){
		wall = new Wall(game, 100, 100 + (y * 50), 'wall');
		walls.add(wall);
	}
	
	player = new Player(game, 400, 400, 'player', null, walls);
	player.scale.setTo(.3);
    player.anchor.setTo(.5,.5);

    // lightCircleImage
    lightCircle = game.add.image(player.x, player.y, 'circle')
    lightCircle.anchor.setTo(0.5, 0.5);


    // bitmap for the light cones
    this.bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
    this.bitmap.context.fillStyle = 'rgb(255,255,255)';
    this.bitmap.context.strokeStyle = 'rgb(255,255,255)';
    var lightBitmap = this.game.add.image(0,0, this.bitmap);
    
    // this bitmap will be masked over the rest of the game. darks in it will be shaded, lights will be clear
    lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;
    
    // create the bitmap
    this.rayBitmap = this.game.add.bitmapData(this.game.width, this.game.height);
    this.rayBitmapImage = this.game.add.image(0, 0, this.rayBitmap);
    this.rayBitmapImage.visible = false;

    // ignore togglerays lines





	game.add.existing(player);
}

function update() {
    // fill the stage with darkness
    this.bitmap.context.fillStyle = 'rgb(0, 0, 0)';
    this.bitmap.context.fillRect(0, 0, this.game.width, this.game.height);

    // stage corners
    var stageCorners = [
        new Phaser.Point(0, 0),
        new Phaser.Point(this.game.width, 0),
        new Phaser.Point(this.game.width, this.game.height),
        new Phaser.Point(0, this.game.height)
    ];

    // ray cast through the corners of the walls
    var points = [];
    var ray = null;
    var intersect;
    var i;
    walls.forEach(function(wall){
        var corners = [
            new Phaser.Point(wall.x + 0.1 , wall.y + 0.1),
            new Phaser.Point(wall.x - 0.1 , wall.y - 0.1),
            
            new Phaser.Point(wall.x - 0.1 + wall.width, wall.y + 0.1),
            new Phaser.Point(wall.x - 0.1 + wall.width, wall.y - 0.1),

            new Phaser.Point(wall.x - 0.1 + wall.width , wall.y + 0.1 + wall.height),
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

            var slope = (c.y - player.y) / (c.x - player.x)
            var b = player.y - slope * player.x;

            var end = null;


            if (c.x === player.x){   // if players are beneath one of the four corners
                if (c.y <= player.y){
                    end = new Phaser.Point(player.x, 0)
                }
                else {
                    end = new Phaser.point(player, this.game.height);
                }
            }
            else if (c.y === player.y){ //player is horizontal to a corner
                if (c.x <= this.light.x){
                    ene = new Phaser.Point(0, player.y)
                }
                else{
                    end = new Phaser.Point(this.game.widthplayer.y)
                }
            }
            
            else {     //base case
                // find the point where the line crosses the edge
                var left = new Phaser.Point(0, b);
                var right = new Phaser.Point(this.game.width, slope * this.game.width + b);
                var top = new Phaser.Point(-b/slope, 0);
                var bottom = new Phaser.Point((this.game.height-b)/slope, this.game.height);

                // get the actual intersections
                if (c.y <= player.y && c.x >= player.x){
                    if (top.x >= 0 && top.x <= this.game.width){
                        end = top;
                    } else
                    {
                      end = right;
                    }
                } else if(c.y <= player.y && c.x <= player.x){
                    if (top.x >= 0 && top.x <= this.game.width){
                        end = top;
                    }
                    else{
                        end = left;
                    }
                } else if (c.y >= player.y && c.x >= player.x){
                    if (bottom.x >= 0 && bottom.x <= this.game.width){
                        end = bottom;
                    }else{
                        end = right;
                    }
                } else if (c.y > player.y && c.x <= player.x) {
                    if (bottom.x > 0 && bottom.x <= this.game.width) {
                        end = bottom;
                    } else {
                        end = left;
                    }
                
                }  
            }

            // create the ray
            ray = new Phaser.Line(player.x, player.y, end.x, end.y); 
            
            // check if it intercepts with wall global function
            intersect = getWallIntersection(ray, walls);
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
        ray = new Phaser.Line(player.x, player.y, stageCorners[i].x, stageCorners[i].y);
        intersect = getWallIntersection(ray, walls)
        if (!intersect){
        //corner is in light
            points.push(stageCorners[i]);
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
    var center = { x: player.x, y: player.y };
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

    lightCircle.x = player.x;
    lightCircle.y = player.y;
}

getWallIntersection=  function (ray, wall_group){
    var distanceToWall = Number.POSITIVE_INFINITY;
    var closestIntersection = null;

    wall_group.forEach(function(wall){
    // for each wall check create four edges to check if the ray intercepts
    var lines = [
        new Phaser.Line(wall.x, wall.y, wall.x + wall.width, wall.y),
        new Phaser.Line(wall.x, wall.y, wall.x, wall.y + wall.height),
        new Phaser.Line(wall.x + wall.width, wall.y, wall.x+wall.width, wall.y + wall.height),
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
                closestIntersection= intersect;
            
            }
        }
    }
    }, this);
    return closestIntersection;


}
