function MazeGrid(inTileGrid, inItemGrid)
{
    ///////////////
    // variables //
    ///////////////

    // private  
    // cloning input
    var tileGrid = JSON.parse(JSON.stringify(inTileGrid));
    var itemGrid = JSON.parse(JSON.stringify(inItemGrid));

    // public - must set to public at bottom
    var mouse = 
    {
        down: function(){},
        up: function(){},
        drag: function(){},
        right: false,
        pos: {x: 0, y: 0},
        coord: {x: 0, y: 0}
    };

    var spawnLoc = {x: -1, y: -1};
    var exitLoc = {x: -1, y: -1};

    //////////////////
    // stage set up //
    //////////////////

    // new stage with button cursor showing
    var stage = new PIXI.Stage(0xFF9933, true);
    stage.buttonMode = true;

    // initialise sprite grids - one for tiles and one for tiles
    var tileSpriteGrid = [];
    var itemSpriteGrid = [];
    //get grid dimersions - same for both
    var gridDim = {width: tileGrid.length, height: tileGrid[0].length};

    // construct sprite grids
    for (var x = 0; x< gridDim.width; x++) 
    {
        tileSpriteGrid[x] = [];
        itemSpriteGrid[x] = [];
        for (var y = 0; y< gridDim.height; y++)
        {
            // set the tile at this grid point
            tileSpriteGrid[x][y] = new PIXI.Sprite(blankTexture);
            changeGrid({x: x, y: y}, tileGrid[x][y], false);

            // center the sprites anchor point
            tileSpriteGrid[x][y].anchor.x = 0.5;
            tileSpriteGrid[x][y].anchor.y = 0.5;

            // Now we need to set the position of the center of the square
            tileSpriteGrid[x][y].position.x = square.width * (0.5 + x); 
            tileSpriteGrid[x][y].position.y = square.height * (0.5 + y); 
            
            // add sprite to stage
            stage.addChild(tileSpriteGrid[x][y]);



            // set the item at this grid point
            itemSpriteGrid[x][y] = new PIXI.Sprite(emptyTexture);
            changeGrid({x: x, y: y}, itemGrid[x][y], true);

            // center the sprites anchor point
            itemSpriteGrid[x][y].anchor.x = 0.5;
            itemSpriteGrid[x][y].anchor.y = 0.5;

            // Now we need to set the position of the center of the square
            itemSpriteGrid[x][y].position.x = square.width * (0.5 + x); 
            itemSpriteGrid[x][y].position.y = square.height * (0.5 + y); 
            
            // add sprite to stage
            stage.addChild(itemSpriteGrid[x][y]);
        }
    }

    // create renderer
    var renderer = PIXI.autoDetectRenderer(gridDim.width*square.width, gridDim.height*square.height);
    $("#game").attr({style: ("width: " + (gridDim.width*square.width) + "px")});

    // add stage to web page and draw
    $("#renderer").append(renderer.view);
    animate();

    // function that draws the stage
    function animate()
    {
        requestAnimFrame(animate);
        renderer.render(stage);
    }

    //////////////////
    // events setup //
    //////////////////

    // mouse events - dragging create maze tiles on path
    stage.dragging = false;
    mouse.right = false;

    stage.mousedown = stage.touchstart = function(data)
    {
        // stop the default event...
        data.originalEvent.preventDefault();
        var event = data.originalEvent;

        // store a reference to the data
        // The reason for this is because of multitouch
        // we want to track the movement of this particular touch
        this.data = data;
        this.alpha = 0.9;
        this.dragging = true;

        //is right mouse clicked
        mouse.right = (event.button === 2 || event.which === 3) ? true : false;

        mouseAll(data) ;
        mouse.down();
        
    };

    // set the events for when the mouse is released or a touch is released
    stage.mouseup = stage.mouseupoutside = stage.touchend = stage.touchendoutside = function(data)
    {
        this.alpha = 1;
        this.dragging = false;
        // set the interaction data to null
        this.data = null;

        mouse.right = false;

        mouseAll(data); 
        mouse.up();
    };

    // set the callbacks for when the mouse or a touch moves
    stage.mousemove = stage.touchmove = function(data)
    {
        // only triggered when mouse button is down
        if(this.dragging)
        {
            mouseAll(data); 
            mouse.drag();
        }
    };

    function mouseAll(mouseEventData) 
    {
        mouse.pos = mouseEventData.getLocalPosition(stage);
        mouse.coord  = {x: Math.floor(mouse.pos.x / square.width), y: Math.floor(mouse.pos.y / square.height)};
    }

    //////////////////////
    // private funtions //
    //////////////////////





    /////////////////////
    // public funtions //
    /////////////////////

    function shout(text)
    {
        $("#status").text(text);
    }

    function changeGrid(coord, changeTo, itemQ)
    {
        if (!itemQ)
        {
            switch(changeTo)
            {
                case tiles.blank:
                    changeGrid(coord, tiles.empty, true);
                    tileGrid[coord.x][coord.y] = changeTo;
                    tileSpriteGrid[coord.x][coord.y].setTexture(blankTexture); 
                break;
                case tiles.wood: 
                    tileGrid[coord.x][coord.y] = changeTo;
                    tileSpriteGrid[coord.x][coord.y].setTexture(woodTexture); 
                break;
            } 
        }
        else
        {
            if (tileGrid[coord.x][coord.y] === tiles.wood) { //will allow to put items in the wood only
                if (changeTo === tiles.spawn)
                {
                    if ((spawnLoc.x !== -1) && (spawnLoc.y !== -1))
                    {
                        itemGrid[spawnLoc.x][spawnLoc.y] = tiles.empty;
                        itemSpriteGrid[spawnLoc.x][spawnLoc.y].setTexture(emptyTexture); 
                    }

                    itemGrid[coord.x][coord.y] = changeTo;
                    itemSpriteGrid[coord.x][coord.y].setTexture(spawnTexture); 

                    spawnLoc = coord;
                }
                else if (changeTo === tiles.exit) 
                {
                    if ((exitLoc.x !== -1) && (exitLoc.y !== -1))
                    {
                        itemGrid[exitLoc.x][exitLoc.y] = tiles.empty;
                        itemSpriteGrid[exitLoc.x][exitLoc.y].setTexture(emptyTexture); 
                    }

                    itemGrid[coord.x][coord.y] = changeTo;
                    itemSpriteGrid[coord.x][coord.y].setTexture(exitTexture); 

                    exitLoc = coord;
                }
                else
                {
                    if ((coord.x === spawnLoc.x) && (coord.y === spawnLoc.y))
                    {
                        spawnLoc = {x: -1, y: -1};
                    }
                    itemGrid[coord.x][coord.y] = changeTo;

                    switch(changeTo)
                    {
                        case tiles.empty:
                            itemSpriteGrid[coord.x][coord.y].setTexture(emptyTexture); 
                        break;
                        case tiles.star: 
                            itemSpriteGrid[coord.x][coord.y].setTexture(starTexture); 
                        break;
                        case tiles.key:
                            itemSpriteGrid[coord.x][coord.y].setTexture(keyTexture); 
                        break;
                        case tiles.incSteps:
                            itemSpriteGrid[coord.x][coord.y].setTexture(incStepsTexture);
                        break;
                    } 
                }
            } else (console.log("it is not wood"));
        }
    }

    function getMaze() 
    {
        return {tiles: tileGrid, items: itemGrid};
    }

    function getTile(coord) {
        return tileGrid[coord.x][coord.y];
    }

    function getItem(coord) {
        return itemGrid[coord.x][coord.y];
    }

    // public names - incl. variables
    this.getMaze = getMaze;
    this.getTile = getTile;
    this.getItem = getTile;
    this.mouse = mouse;
    this.shout = shout;
    this.changeGrid = changeGrid;
}
