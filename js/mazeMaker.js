var mazeMaker = function (gridWidth, gridHeight, edit, tiles_load, items_load, mazeName) {
    //This function will be used for Maze edit and create
    if (edit !== true) { edit = false; }
    // MazeGrid Setup 

    // grid dimensions same for tiles and tiles
    var gridDim = { width: gridWidth, height: gridHeight };

    // intitialise grids for maze create
    var tileGrid = [];
    var itemGrid = [];
    for (var x = 0; x < gridDim.width; x++) {
        tileGrid[x] = [];
        itemGrid[x] = [];
        for (var y = 0; y < gridDim.height; y++) {
            tileGrid[x][y] = tiles.blank;
            itemGrid[x][y] = tiles.empty;
        }
    }

    // create MazeGrid fro MazeGrid object
    var mg = new MazeGrid(tileGrid, itemGrid);

    //load Maze for Edit
    if (edit){
    var width = gridWidth;
    var height = gridHeight;
    var arrNo = 0;
    for (var col = 0; col < width; col++) {
        for (var row = 0; row < height; row++) {
            if (tiles_load[arrNo] !== 0) {
                //change it to tiles
                mg.changeGrid({ x: col, y: row }, tiles.wood, false);
            }
            mg.changeGrid({ x: col, y: row }, items_load[arrNo], true);
            arrNo++;
        }//row
    } //col

    //load text boxes in the form
    $('#Mname1').val(String(mazeName));
    //load Maze for Edit
    }


    /////////////////////
    // Mouse Listeners //
    /////////////////////

    // brushes for putting tiles down
    var leftBrush = tiles.wood;
    var rightBrush = tiles.blank;
    var leftItem = false;
    var rightItem = false;
    var putMode = 0;

    function fill(coord, target, replacement) {
        if (mg.mouse.right ? rightItem : leftItem)
            mg.changeGrid(coord, (mg.mouse.right ? rightBrush : leftBrush), (mg.mouse.right ? rightItem : leftItem));
        else
        {
            if (!((coord.x >= 0) && (coord.x < gridDim.width) && (coord.y >= 0) && (coord.y < gridDim.height)))
                return;
            if (target === replacement) 
                return;
            if (mg.getTile(coord) !== target)
                return;
            mg.changeGrid(coord, (mg.mouse.right ? rightBrush : leftBrush), (mg.mouse.right ? rightItem : leftItem));

            fill({x:coord.x - 1, y:coord.y}, target, replacement);
            fill({x:coord.x + 1, y:coord.y}, target, replacement);
            fill({x:coord.x, y:coord.y - 1}, target, replacement);
            fill({x:coord.x, y:coord.y + 1}, target, replacement);  
        } 
    }

    // mouse event set up
    mg.mouse.down = function () {
        mg.shout("Mouse DOWN @ " + mg.mouse.coord.x + ", " + mg.mouse.coord.y);
        if (putMode === 0) {
            mg.changeGrid(mg.mouse.coord, (mg.mouse.right ? rightBrush : leftBrush), (mg.mouse.right ? rightItem : leftItem));
        }
        else if (putMode === 1) {
            fill(mg.mouse.coord, mg.getTile(mg.mouse.coord), (mg.mouse.right ? rightBrush : leftBrush));
        }
    };

    mg.mouse.up = function () {
        mg.shout("Mouse UP @ " + mg.mouse.coord.x + ", " + mg.mouse.coord.y);
    };

    mg.mouse.drag = function () {
        mg.shout("Mouse DRAGGED @ " + mg.mouse.coord.x + ", " + mg.mouse.coord.y);
        if (putMode === 0) {
            mg.changeGrid(mg.mouse.coord, (mg.mouse.right ? rightBrush : leftBrush), (mg.mouse.right ? rightItem : leftItem));
        }
        else if (putMode === 1) {
            fill(mg.mouse.coord, mg.getTile(mg.mouse.coord), (mg.mouse.right ? rightBrush : leftBrush));
        }
    };

    //////////////////////
    // Button Listeners //
    //////////////////////

    // click event - blank button
    $("#blank-btn").on("mousedown", function (event) {
        if (event.which === 1) {
            leftBrush = tiles.blank;
            $("#leftBrush-btn").attr({ src: blankImg });
            leftItem = false;
        }
        else if (event.which === 3) {
            rightBrush = tiles.blank;
            $("#rightBrush-btn").attr({ src: blankImg });
            rightItem = false;
        }
    });

    // click event - wood button
    $("#wood-btn").on("mousedown", function (event) {
        if (event.which === 1) {
            leftBrush = tiles.wood;
            $("#leftBrush-btn").attr({ src: woodImg });
            leftItem = false;
        }
        else if (event.which === 3) {
            rightBrush = tiles.wood;
            $("#rightBrush-btn").attr({ src: woodImg });
            rightItem = false;
        }
    });

    // click event - empty button
    $("#empty-btn").on("mousedown", function (event) {
        if (event.which === 1) {
            leftBrush = tiles.empty;
            $("#leftBrush-btn").attr({ src: emptyBtnImg });
            leftItem = true;

        }
        else if (event.which === 3) {
            rightBrush = tiles.empty;
            $("#rightBrush-btn").attr({ src: emptyBtnImg });
            rightItem = true;
        }
    });

    // click event - spawn button
    $("#spawn-btn").on("mousedown", function (event) {
        if (event.which === 1) {
            leftBrush = tiles.spawn;
            $("#leftBrush-btn").attr({ src: spawnImg });
            leftItem = true;

        }
        else if (event.which === 3) {
            rightBrush = tiles.spawn;
            $("#rightBrush-btn").attr({ src: spawnImg });
            rightItem = true;
        }
    });

    // click event - star button
    $("#star-btn").on("mousedown", function (event) {
        if (event.which === 1) {
            leftBrush = tiles.star;
            $("#leftBrush-btn").attr({ src: starImg });
            leftItem = true;

        }
        else if (event.which === 3) {
            rightBrush = tiles.star;
            $("#rightBrush-btn").attr({ src: starImg });
            rightItem = true;
        }
    });

    // click event - increase steps button
    $("#incsteps-btn").on("mousedown", function (event) {
        if (event.which === 1) {
            leftBrush = tiles.incSteps;
            $("#leftBrush-btn").attr({ src: incStepsImg });
            leftItem = true;

        }
        else if (event.which === 3) {
            rightBrush = tiles.incSteps;
            $("#rightBrush-btn").attr({ src: incStepsImg });
            rightItem = true;
        }
    });

    // click event - key button
    $("#key-btn").on("mousedown", function (event) {
        if (event.which === 1) {
            leftBrush = tiles.key;
            $("#leftBrush-btn").attr({ src: keyImg });
            leftItem = true;

        }
        else if (event.which === 3) {
            rightBrush = tiles.key;
            $("#rightBrush-btn").attr({ src: keyImg });
            rightItem = true;
        }
    });

    // click event - exit button
    $("#exit-btn").on("mousedown", function (event) {
        if (event.which === 1) {
            leftBrush = tiles.exit;
            $("#leftBrush-btn").attr({ src: exitImg });
            leftItem = true;

        }
        else if (event.which === 3) {
            rightBrush = tiles.exit;
            $("#rightBrush-btn").attr({ src: exitImg });
            rightItem = true;
        }
    });

    // click event - bucket button
    $("#fill-btn").on("mousedown", function (event) {
        putMode = (putMode === 0 ? 1 : 0)
        $("#fill-btn").toggleClass( "active")
    });

    $("#saveForm").on("submit", function (event) {
        // Stop form from submitting normally
        event.preventDefault();

        // Get some values from elements on the page:
        var $form = $(this),
        mazeName = $form.find("input[name='Mname']").val();
        var reqUrl = $form.attr("action");

        prevMaze = $("#prev-maze").val();

        // Send the data using post
        var whole_seconds = validateTime(document.getElementById("whole_seconds").value);
        var postData = { width: gridDim.width, height: gridDim.height, tiles: mg.getMaze().tiles, items: mg.getMaze().items, mname: mazeName, previousMaze: prevMaze, wholeSeconds: whole_seconds };

        //below validation funciton will validate the Maze before the submittion
        function mazeValidator() {

            //check #0: the player provided a name
            if (mazeName === "") {
                return errorCode.noName;
            }

            //check #1 : the maze should has one spawn
            var numberOfSpawn = 0;
            for (var i in postData.items) {
                for (var x in postData.items[i]) {
                    if (postData.items[i][x] === 11) {
                        numberOfSpawn = numberOfSpawn + 1;

                    }
                }
            }
            if (numberOfSpawn !== 1) {
                return errorCode.noSpawn;
            }
            //check #2 : the maze should has one exit 
            var exitAval = 0;
            for (var j in postData.items) {
                for (var y in postData.items[j]) {
                    if (postData.items[j][y] === 13) {
                        exitAval = exitAval + 1;
                    }
                }
            }
            if (exitAval !== 1) {
                return errorCode.noExit;
            }
            //check #3 : the name should be unique
            checkName = errorCode.ok;
            var nameToCheck = {name: mazeName};
            $.ajax({
                url: '/namevalidator',
                type: 'POST',
                data: nameToCheck,
                async: false,
                success: function (data, status) {
                    try {
                        var obj = jQuery.parseJSON(data);
                        if (obj.valid === "false") {
                            checkName = errorCode.nameExists;
                        }
                            
                    } catch (ex) {
                        console.log('not json');
                    }

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError);
                    console.log(xhr);
                }
            });

            return checkName;

        }


        switch(mazeValidator()) {
            case errorCode.noName:
                mg.shout("Please provide a name to your maze");
                break;
            case errorCode.noSpawn:
                mg.shout("Your Maze does not have a spawn point!");
                break;
            case errorCode.noExit:
                mg.shout("Your Maze does not have an exit!");
                break;
            case errorCode.nameExists:
                mg.shout("This name already exists!");
                break;
            case errorCode.ok:
            default:
                $.ajax({
                    url: reqUrl,
                    type: 'POST',
                    data: postData,
                    success: function (data, status) {
                        try {
                            var obj = jQuery.parseJSON(data);
                            if (obj.redirect !== "none")
                                window.location.replace(obj.redirect);
                        } catch (ex) {
                            console.log('not json');
                        }

                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError);
                        console.log(xhr);
                    }
                });
                break;
        }
    }); //saveForm

    function validateTime(time) {
        try {
            var t = parseInt(time, 10); //to make sure it's an integer number
            if (isNaN(t) || t < MIN_TIME) {
                t = MIN_TIME;
            } else if (t > MAX_TIME) {
                t = MAX_TIME;
            }

            return t;
        }


        catch (ex) {
            return MIN_TIME;
        }
    }

};

var main = function () {

    //setup maze maker
    var width = validateWidth(document.getElementById("width-spin").value);
    var height = validateHeight(document.getElementById("height-spin").value);
    // check if it is extend or create 
    if (document.URL.search("extend") === -1) {
        var mm = new mazeMaker(width, height);
    } else {
        $("#btn").attr('value', 'Update');
    }

    //the spinners control the width and height
    $("#width-spin").change(function (event) {
        var newWidth = validateWidth(this.value);
        var sameHeight = validateHeight(document.getElementById("height-spin").value);
        $("#renderer").empty();
        delete mm;
        $("#saveForm").off("submit");
        var mm = new mazeMaker(newWidth, sameHeight);
    });

    $("#height-spin").change(function (event) {
        var newHeight = validateHeight(this.value);
        var sameWidth = validateWidth(document.getElementById("width-spin").value);
        $("#renderer").empty();
        delete mm;
        $("#saveForm").off("submit");
        var mm = new mazeMaker(sameWidth, newHeight);
    });

    function validateWidth(width) {
        try {
            var w = parseInt(width, 10); //to make sure it's an integer number
            if (isNaN(w) || w < MIN_WIDTH) {
                w = MIN_WIDTH;
            } else if (w > MAX_WIDTH) {
                w = MAX_WIDTH;
            }

            return w;
        }

        catch (ex) {
            return MIN_WIDTH;
        }
    }

    function validateHeight(height) {
        try {
            var h = parseInt(height, 10); //to make sure it's an integer number
            if (isNaN(h) || h < MIN_HEIGHT) {
                h = MIN_HEIGHT;
            } else if (h > MAX_HEIGHT) {
                h = MAX_HEIGHT;
            }


            return h;
        }

        catch (ex) {
            return MIN_HEIGHT;
        }
    }
    //everything else needs to be controlled from inside the maze maker
};


$(document).ready(main);
