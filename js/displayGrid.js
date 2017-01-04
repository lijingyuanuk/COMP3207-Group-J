function getMazeId() {
    var url = document.URL;
    var find = "/play/";
    var len = find.length;
    var index = url.indexOf(find);
    var maze_id = url.substr(index + len);
    return maze_id;
}

var displayGrid = function (width, height, tileGrid, inItemGrid, nextMazeId, whole_seconds, steps_num, bestScore, playerBestScore) {    
        /**
        * NOTE: the two grids are structured like this:
        *
        * [  grid[col0][row0], grid[col0][row1], ... , grid[col0][row height-1], grid[col1][row0], grid[col1][row1], ... , grid[col width-1][row height-1]  ]
        */
        // cloning input
        var itemGrid = JSON.parse(JSON.stringify(inItemGrid));
        console.log(bestScore);
        console.log(playerBestScore);
        $("#steps_num").text(MAX_STEPS);
        var interval_timer,start_time;
        var outerRemain_seconds = 0;
        var keyboardMove = true;
        // the movement increment should be a function of the size of our squares. In this case, let's use the same values
        var movementIncrement = {horizontal: square.width, vertical: square.height};
    
        //Sets the Stage - he root of our display tree. A stage can be rendered by one of the pixi.js renderers.
        //@param: background colour, interactivity
        var stage = new PIXI.Stage(0xFF9933, true);
        var passed_milliseconds;
        var rendererWidth = width * square.width;
        var rendererHeight = height * square.height;
        //Renderer – A renderer draws a stage and all its contents to the screen. It comes in two flavours, webGL and Canvas.
        //@param: width, height
        var renderer = PIXI.autoDetectRenderer(rendererWidth, rendererHeight); //i.e., number of columns * square width X number of rows * square height
        //this way, the renderer will be completely filled with our squares

        //adding renderer to the html via DOM - id = "renderer" is an <div> elem. in HTML template
        var child = document.getElementById("renderer");
        child.appendChild(renderer.view);
        requestAnimFrame( animate );

        //private copy to track items sprites
        var itemsSprites = [];
        var grid = [];

        var numOfStarsCollected = 0;
        var numOfKeysCollected = 0;
        var totalNumOfStars = 0;
        var totalNumOfKeys = 0;

        //agent that will be moved around
        var playerSprite = new PIXI.Sprite.fromImage(spawnImg);
        // center the sprites anchor point
        playerSprite.anchor.x = 0.5;
        playerSprite.anchor.y = 0.5;

        //Now we need to fill the renderer with our maze

        for (var col = 0; col < width; col++) {
            grid[col] = [];
            itemsSprites[col] = [];

            for (var row = 0; row < height; row++) {
                grid[col][row] = tileGrid[getGridToArrayCoordinates(row, col, height)];
                
                var cellSprite;
                if (grid[col][row] === tiles.wood) {
                    cellSprite = new PIXI.Sprite(woodTexture);
                } else if (grid[col][row] === tiles.blank) {
                    cellSprite = new PIXI.Sprite(blankTexture);
                }

                // center the sprites anchor point
                cellSprite.anchor.x = 0.5;
                cellSprite.anchor.y = 0.5;

                // Now we need to set the position of the center of the square
                cellSprite.position.x = square.width * (0.5 + col); 
                cellSprite.position.y = square.height * (0.5 + row);

                stage.addChild(cellSprite);

                var item = itemGrid[getGridToArrayCoordinates(row, col, height)];
                if (item === tiles.empty) {
                    itemsSprites[col][row] = item;
                } else if (item === tiles.spawn) {
                    itemsSprites[col][row] = item;

                    // move agent to center of spawn square
                    playerSprite.position.x = square.width * (0.5 + col); 
                    playerSprite.position.y = square.height * (0.5 + row);
                } else if (item === tiles.star) {
                    var star = new PIXI.Sprite(starTexture);

                    star.anchor.x = 0.5;
                    star.anchor.y = 0.5;

                    // Only works because star image size is equal to square size
                    star.position.x = square.width * (0.5 + col); 
                    star.position.y = square.height * (0.5 + row);

                    stage.addChild(star);

                    itemsSprites[col][row] = star;
                    totalNumOfStars++;
                } else if (item === tiles.exit) {
                    var exit = new PIXI.Sprite(exitTexture);

                    exit.anchor.x = 0.5;
                    exit.anchor.y = 0.5;

                    // Only works because exit image size is equal to square size
                    exit.position.x = square.width * (0.5 + col); 
                    exit.position.y = square.height * (0.5 + row);

                    stage.addChild(exit);

                    itemsSprites[col][row] = item;
                } else if (item === tiles.key) {
                    var key = new PIXI.Sprite(keyTexture);

                    key.anchor.x = 0.5;
                    key.anchor.y = 0.5;

                    // Only works because key image size is equal to square size
                    key.position.x = square.width * (0.5 + col); 
                    key.position.y = square.height * (0.5 + row);

                    stage.addChild(key);

                    itemsSprites[col][row] = key;
                    totalNumOfKeys++;
                } else if (item === tiles.incSteps) {
                    var incSteps = new PIXI.Sprite(incStepsTexture);

                    incSteps.anchor.x = 0.5;
                    incSteps.anchor.y = 0.5;

                    // Only works because increase steps image size is equal to square size
                    incSteps.position.x = square.width * (0.5 + col);
                    incSteps.position.y = square.height * (0.5 + row);

                    stage.addChild(incSteps);

                    itemsSprites[col][row] = incSteps;
                }

            }
        }

        $("#stars_num").text("0/"+totalNumOfStars);
        $("#keys_num").text("0/"+totalNumOfKeys);
        // Keyboard inputs
        var keyNums = 
        {
            left: 37,
            up: 38,
            right: 39,
            down: 40
        };
        $(document).keydown(function (event) 
        {
            switch((event.keyCode ? event.keyCode : event.which)){
                case keyNums.left:                 // Left Arrow
                    event.preventDefault();
                    keyboardMovement(-movementIncrement.horizontal, 0);
                break;
                case keyNums.up:                   // Up Arrow
                    event.preventDefault();
                    keyboardMovement(0, -movementIncrement.vertical);
                break;
                case keyNums.right:                // Right Arrow
                    event.preventDefault();
                    keyboardMovement(movementIncrement.horizontal, 0);
                break;
                case keyNums.down:                 // Down Arrow
                    event.preventDefault();
                    keyboardMovement(0, movementIncrement.vertical);
                break;
            }
        });
        //Mouse inputs
        $(document).ready(function () {
            $("#left").click(function () {
                    keyboardMovement(-movementIncrement.horizontal, 0);
            });
            $("#up").click(function () {
                   keyboardMovement(0, -movementIncrement.vertical);
            });
            $("#right").click(function () {
                   keyboardMovement(movementIncrement.horizontal, 0);
            });
            $("#down").click(function () {
                   keyboardMovement(0, movementIncrement.vertical);
            });
        });

        //adding object to staged area
        stage.addChild(playerSprite);

        /**
        * Maps screen coordinates into grid coordinates
        * @param x_screen (int) The 'x' screen coordinate
        * @param y_screen (int) The 'y' screen coordinate
        * @return (object) A object that contains only two attributes: 'row' and 'column'. These attributes are the respective grid coordinates corresponding to the screen coordinates
        */
        function getScreenToGridCoordinates(x_screen, y_screen){
            // Our grid is based on the square sprites. So, each cell of our grid has the exact same size as our squares
            var xCoord = Math.floor(x_screen / square.width);
            var yCoord = Math.floor(y_screen / square.height);

            var coords = {row: yCoord, column: xCoord};
            return coords;
        }

        /**
        * NOTE: For the following 2 functions that maps the grid to the array (and vice-versa) remember how the array is structured
        */
        function getArrayToGridCoordinates(index, gridHeight) {
            // column
            var xCoord = Math.floor(index / gridHeight);
            // row
            var yCoord = index % gridHeight;

            var coords = {row : yCoord, column : xCoord};
            return coords;
        }

        function getGridToArrayCoordinates(row, col, gridHeight) {
            return (gridHeight * col) + row;
        } 


        /**
        * Checks whether or not the agent can move to the desired new position and performs any subsequent actions
        * @param x_inc (int) Number of pixels to add to the current X coordinate of the agent's position
        * @param y_inc (int) Number of pixels to add to the current Y coordinate of the agent's position
        * @return (boolean) True if could move, else otherwise
        */
        function keyboardMovement(x_inc, y_inc) {
            if(keyboardMove) {
                var newX = playerSprite.position.x + x_inc;
                var newY = playerSprite.position.y + y_inc;
                if (newX >= 0 && newX < rendererWidth && newY >= 0 && newY < rendererHeight) { //not outside the renderer
                    var gridCoords = getScreenToGridCoordinates(newX, newY);

                    //If it's the first movement, start the counter
                    if (typeof start_time === "undefined") {
                           start_time = new Date();
                    }

                    if (grid[gridCoords.column][gridCoords.row] !== tiles.blank) { //can walk
                        //If the player can walk into the new position, we must check what's inside this new cell
                        playerSprite.position.x += x_inc;
                        playerSprite.position.y += y_inc;
                        //first of all, we need to check if the player still has steps left. If not, he lost
                        if (steps_num > 0) {
                            $("#steps_num").text(--steps_num);
                        } else {
                            clearInterval(interval_timer);
                            keyboardMove = false; 
                            setTimeout(function () {
                                popup('Sorry, you have used all steps. Do you want to try again?',function () {location.reload();},"Sure!");
                            }, 0);
                            return false;
                        }

                        var arrayIndex = getGridToArrayCoordinates(gridCoords.row, gridCoords.column, height);
                        if (itemGrid[arrayIndex] === tiles.star) {
                            //it's a star. Collect it (i.e., remove it from the stage)
                            stage.removeChild(itemsSprites[gridCoords.column][gridCoords.row]);
                            itemsSprites[gridCoords.column][gridCoords.row] = tiles.empty; //set to empty cell
                            itemGrid[arrayIndex] = tiles.empty;
                            $("#stars_num").text(++numOfStarsCollected+"/"+totalNumOfStars);
                        } else if (itemGrid[arrayIndex] === tiles.key) {
                            //it's a key. Collect it (i.e., remove it from the stage)
                            stage.removeChild(itemsSprites[gridCoords.column][gridCoords.row]);
                            itemsSprites[gridCoords.column][gridCoords.row] = tiles.empty; //set to empty cell
                            itemGrid[arrayIndex] = tiles.empty;
                            $("#keys_num").text(++numOfKeysCollected+"/"+totalNumOfKeys);
                        } else if (itemGrid[arrayIndex] === tiles.incSteps) {
                            //it's an item to increase the number of steps. Collect it (i.e., remove it from the stage) and use it
                            stage.removeChild(itemsSprites[gridCoords.column][gridCoords.row]);
                            itemsSprites[gridCoords.column][gridCoords.row] = tiles.empty; //set to empty cell
                            itemGrid[arrayIndex] = tiles.empty;

                            steps_num += INCREASE_STEP;
                            if (steps_num > MAX_STEPS) {
                                steps_num = MAX_STEPS;
                            }
                            $("#steps_num").text(steps_num);
                        }

                        else if (itemGrid[arrayIndex] === tiles.exit) {
                            //it's an exit. Can we use it?
                            clearInterval(interval_timer);
                            keyboardMove = false;
                            if (checkWin()) {
                                //calculate score and check if it's higher than the best score
                                var score = updateScores();
                                 var proceed = popup("Great adventurer, your amazeing score is: "+score, function () {
                                    var url = document.URL;
                                    var find = "/play";
                                    var len = find.length;
                                    var index = url.indexOf(find);
                                    var redirect = url.substr(0, index + len);

                                    if (nextMazeId !== -1) {
                                        redirect = redirect + "/" + nextMazeId.toString();
                                    }

                                    window.location.replace(redirect);
                                }, "Yey!");
                            } else {
                                    whole_seconds = outerRemain_seconds;
                                    popup("You found the exit but you still can't use it. Didn't you forget anything?", function (){
                                        keyboardMove = true;
                                        start_time = new Date();
                                        interval_timer = setInterval(clock, 500);
                                    });
                                  
                                    
                            }

                            
                        }
                        return true;
                    }
                    else return false;
                }
            }
        }

        function checkWin() {
            return numOfKeysCollected === totalNumOfKeys;
        }

        function updateScores() {
            var yourscore = outerRemain_seconds * 5 + steps_num * 5 + numOfStarsCollected * 100;
            var maze_id = getMazeId();
            $.ajax({
                url: '/updatescore',
                type: 'POST',
                data: {mazeId : maze_id, score : yourscore},
                success: function(data,status){
                    try {
                        var obj = jQuery.parseJSON(data);
                        if (obj.newBestScore === "true") {
                            if (obj.isLogged === "false") {
                                popup("Congratulations, you achieved the best score!"+yourscore+"!<br>Unfortunately your name won't be remembered as you are not logged in :(");
                            } else {
                                popup("Congratulations, you have beaten the best score with: "+yourscore+" points.");
                            }
                        }
                    } catch (ex) {
                        console.log('not json');
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr);
                    console.log(ajaxOptions);
                    console.log(thrownError);
                }
           });
            return yourscore;
        }
            
        function time() {
        interval_timer = setInterval(clock, 500);
       }
        $(document).ready(time);

           
        //rendering function
        function animate() {
            requestAnimFrame(animate);

            //render the stage
            renderer.render(stage);
        }
                            /*delete me*/

        function clock () {
            if (!start_time) {
                passed_milliseconds = 0;
            } else {
                passed_milliseconds = new Date() - start_time;
            }
            var passed_seconds = Math.floor(passed_milliseconds / 1000);
            var remaining_seconds = whole_seconds - passed_seconds;
            if (remaining_seconds < 1) {
                clearInterval(interval_timer);
                start_time = null;
            }
            var remaining_minutes = Math.floor(remaining_seconds / 60);
            var display_seconds = "" + (remaining_seconds % 60);  //division remainder
            if (display_seconds.length < 2) {
                display_seconds = "0" + display_seconds;
            }

            //If there's no time left, the player has lost
            if (remaining_seconds <= 0) {
                remaining_minutes = "0";
                display_seconds = "00";
                keyboardMove = false;
                setTimeout(function() {
                    popup("Sorry, your time is over. Do you want to try again?",function () {location.reload();}, "Yes, I guess?");
                }, 0);
            }
            outerRemain_seconds =  remaining_seconds;
            $("#time").text(remaining_minutes + ":" + display_seconds);
            }

        function popup(message, cb, txt) {
                                        
            // get the screen height and width
            var maskHeight = $(document).height();
            var maskWidth = $(window).width();
            // calculate the values for center alignment
            var dialogTop = (maskHeight/2) - ($('#dialog-box').height());
            var dialogLeft = (maskWidth/2) - ($('#dialog-box').width()/2);
            
            // assign values to the overlay and dialog box
            $('#dialog-overlay').css({height:maskHeight, width:maskWidth}).show();
            $('#dialog-box').css({top:dialogTop, left:dialogLeft}).show();
            
            // display the message
            $('#dialog-message').html(message);
            $('#popup-btn').text(txt);
            $('#popup-btn').click(function () {        
                        $('#dialog-overlay, #dialog-box').hide();        
                        cb();
            }); 
        }
};

var main = function () {
    var maze_id = getMazeId();
    $.ajax({
            url: '/play',
            type: 'POST',
            data: {mazeId : maze_id},
            success: function (data,status) {
                try {
                    var obj = jQuery.parseJSON(data);
                    var width = parseInt(obj.width, 10);
                    var height = parseInt(obj.height, 10);
                    var tileGrid = jQuery.parseJSON(obj.tiles);
                    var itemGrid = jQuery.parseJSON(obj.items);
                    var nextMazeId = parseInt(obj.nextMaze, 10);
                    if (isNaN(nextMazeId)) {
                        nextMazeId = -1;
                    }
                    // if user resize the window, call the same function again
                    // to make sure the overlay fills the screen and dialogbox aligned to center    
                    $(window).resize(function () {
                        if (!$('#dialog-box').is(':hidden')) popup();        
                    });    
                    var whole_seconds = parseInt(obj.whole_seconds, 10);
                    var steps_num = MAX_STEPS;
                    var bestScore = parseInt(obj.bestScore, 10);
                    var playerBestScore = obj.playerBestScore;
                    if (playerBestScore === "none") {
                        playerBestScore = "";
                    }
                    displayGrid(width, height, tileGrid, itemGrid, nextMazeId, whole_seconds, steps_num, bestScore, playerBestScore);
                } catch (ex) {
                    console.log('not json');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(ajaxOptions);
            }
       });
};

$(document).ready(main);
