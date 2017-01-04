// the size of each square
var square = {width: 50, height: 50}; 

// tile images
var blankImg = "/img/blank.png";
var woodImg = "/img/wood.png";

// item images
var emptyImg = "/img/empty.png";
var emptyBtnImg = "/img/emptyBtn.png";
var spawnImg = "/img/bunny.png";
var starImg = "/img/star.png";
var exitImg = "/img/exit.png";
var keyImg = "/img/key.png";
var incStepsImg = "/img/increase-steps.png";

// tile textures
var blankTexture = PIXI.Texture.fromImage(blankImg);
var woodTexture = PIXI.Texture.fromImage(woodImg);

// item textures
var emptyTexture = PIXI.Texture.fromImage(emptyImg);
var emptyBtnTexture = PIXI.Texture.fromImage(emptyBtnImg);
var spawnTexture = PIXI.Texture.fromImage(spawnImg);
var starTexture = PIXI.Texture.fromImage(starImg);
var exitTexture = PIXI.Texture.fromImage(exitImg);
var keyTexture = PIXI.Texture.fromImage(keyImg);
var incStepsTexture = PIXI.Texture.fromImage(incStepsImg);

// Fake enum for tile types
var tiles = {
	blank: 0,
	wood: 1,
	empty: 10,
	spawn: 11,
	star: 12,
	exit: 13,
	key: 14,
	incSteps: 15
};
if (Object.freeze) Object.freeze(tiles);


var MIN_WIDTH = 16;
var MIN_HEIGHT = 10;
var MAX_WIDTH = 30;
var MAX_HEIGHT = 30;

var MIN_TIME = 10;
var MAX_TIME = 120;

var MAX_STEPS = 20;
var INCREASE_STEP = 10;

var errorCode = {
	ok: 0,
	noSpawn: 1,
	noExit: 2,
	nameExists: 3,
	noName: 4
};
if (Object.freeze) Object.freeze(errorCode);
