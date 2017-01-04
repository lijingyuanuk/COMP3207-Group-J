var editGrid = function (width, height, tileGrid, inItemGrid, nextMazeId, whole_seconds, steps_num, mazeName) {

    mazeMaker(width, height, true, tileGrid, inItemGrid, mazeName);

};

var main = function () {

    var url = document.URL;
    var find = "/extend/";
    var len = find.length;
    var index = url.indexOf(find);
    var maze_id = url.substr(index + len);

    $.ajax({
        url: '/extend',
        type: 'POST',
        data: { mazeId: maze_id },
        success: function (data, status) {
            try {
                var obj = jQuery.parseJSON(data);
                var mazeName = obj.name;
                var width = parseInt(obj.width, 10);
                var height = parseInt(obj.height, 10);
                var tileGrid = jQuery.parseJSON(obj.tiles);
                var itemGrid = jQuery.parseJSON(obj.items);
                var nextMazeId = parseInt(obj.nextMaze, 10);
                var whole_seconds = parseInt(obj.whole_seconds, 10);
                var steps_num = MAX_STEPS;
                if (isNaN(nextMazeId)) {
                    nextMazeId = -1;
                }

                editGrid(width, height, tileGrid, itemGrid, nextMazeId, whole_seconds, steps_num, mazeName);

            } catch (ex) {
                console.log('not json22');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(ajaxOptions);
        }
    });

};

$(document).ready(main);
