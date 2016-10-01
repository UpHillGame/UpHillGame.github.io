require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Block":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0cf80va4iJCXZDXbSwgY1mm', 'Block');
// scripts\gamefield\Block.js

var BlockType = require('Types').BlockType;
var PlayerMovementState = require('States').PlayerMovementState;

cc.Class({
    'extends': cc.Component,

    properties: {
        isBlocked: false,
        hasItem: false,

        blocktype: {
            'default': BlockType.None,
            type: BlockType
        },

        item: {
            'default': null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},

    //What happens if you step on a block
    onStepCallback: function onStepCallback(player) {
        // Perform the action the block produces(change player or environment)
        switch (this.blocktype) {
            case BlockType.Empty:
                player.fall();
                break;
        }

        // Perform block animation
        this.node.runAction(this.assembleBlockAction());
    },

    // Action(Animation etc) for every block
    assembleBlockAction: function assembleBlockAction() {
        switch (this.blocktype) {
            case BlockType.Empty:
                return cc.moveTo(0, this.node.getPosition());

            case BlockType.Trapdor:
                return cc.moveTo(1, cc.p(this.node.getPositionX(), this.node.getPositionY() - 100));
        }
    },

    // Part of animation see above
    deform: function deform() {},

    destroy: function destroy() {
        this.node.destroy();
    },

    setBlocked: function setBlocked(bool) {
        this.isBlocked = bool;
    },

    isBlocked: function isBlocked() {
        return this.isBlocked;
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"States":"States","Types":"Types"}],"CloudAnimation":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7288fjsiXFAlL+LiGenQ8Or', 'CloudAnimation');
// scripts\scenescripts\CloudAnimation.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {}

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"Dirt":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'fe13c6ji91IGKAaD1cGpfSK', 'Dirt');
// scripts\gamefield\blocks\Dirt.js

var BlockType = require('Types').BlockType;
var PlayerMovementState = require('States').PlayerMovementState;

cc.Class({
    'extends': cc.Component,

    properties: {
        isBlocked: false,
        hasItem: false,

        blocktype: {
            'default': BlockType.None,
            type: BlockType
        },

        item: {
            'default': null,
            type: cc.Node
        }

    },

    // use this for initialization
    onLoad: function onLoad() {
        this.playerOnTop = false;
    },

    onStepCallback: function onStepCallback(player, game) {
        cc.log('M: onStepCallback Dirt');
    },

    collide: function collide() {}

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"States":"States","Types":"Types"}],"Empty":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'beeafQj1LhHkLDEkhzDV3+0', 'Empty');
// scripts\gamefield\blocks\Empty.js

var BlockType = require('Types').BlockType;
var PlayerMovementState = require('States').PlayerMovementState;

cc.Class({
    'extends': cc.Component,

    properties: {
        /*gamefield: {
            default: null,
            type: cc.Node,
        },*/

        isBlocked: false,
        hasItem: false,

        blocktype: {
            'default': BlockType.None,
            type: BlockType
        },

        item: {
            'default': null,
            type: cc.Node
        }

    },

    // use this for initialization
    onLoad: function onLoad() {
        this.playerOnTop = false;
    },

    onStepCallback: function onStepCallback(player, game) {
        // Perform the action the block produces(change player or environment)
        player.fall();
    },

    collide: function collide() {
        cc.log('wir sind in der Methode');
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"States":"States","Types":"Types"}],"GameButtonCallbacks":[function(require,module,exports){
"use strict";
cc._RFpush(module, '69e769081xGNbDZBmrDRLFu', 'GameButtonCallbacks');
// scripts\scenescripts\GameButtonCallbacks.js

var GameState = require('States').GameState;

cc.Class({
    'extends': cc.Component,

    properties: {
        pauseOverlay: {
            'default': null,
            type: cc.Node
        },

        scoreLabel: {
            'default': null,
            type: cc.Label
        },

        buttonAudio: {
            'default': null,
            url: cc.AudioClip
        },

        game: {
            'default': null,
            type: cc.Node
        }

    },

    // use this for initialization
    onLoad: function onLoad() {
        /*if(game !== undefined)
            this.scoreLabel.string = "Score: "+game.getComponent('Game').score.toString();
            */
        this.score = cc.sys.localStorage.getItem('score');
        console.log('Score in GameButtonCallback: ', this.score);
        if (this.scoreLabel !== null) {
            console.log('SCORELABEL');
            console.log(this.scoreLabel);
            this.scoreLabel.string = "Score: " + this.score.toString();
        }
        this.paused = false; // TODO: spread this to the outer world
    },

    pauseControlCallback: function pauseControlCallback() {
        //TODO: change pause button to different sprite
        if (this.paused) {
            this.pauseOverlay.opacity = 0;
            cc.director.resume();
            this.paused = false;
            this.game.state = GameState.Playing;

            cc.log("resume");
        } else {
            this.pauseOverlay.opacity = 255;
            cc.director.pause();
            this.paused = true;
            this.game.state = GameState.Paused;
            cc.log("paused");
        }

        cc.audioEngine.playEffect(this.buttonAudio, false);
    },

    againControlCallback: function againControlCallback() {
        cc.director.loadScene('GameScene');
        cc.audioEngine.playEffect(this.buttonAudio, false);
    },

    backControlCallback: function backControlCallback() {
        this.game.state = GameState.Ended;
        cc.director.loadScene('Startmenu');
        cc.audioEngine.playEffect(this.buttonAudio, false);
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"States":"States"}],"GameField":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e001f+mMWNN5YhXykLdMFLZ', 'GameField');
// scripts\gamefield\GameField.js

//GameField

var Level = require('Level');
var BlockType = require('Types').BlockType;
var ItemType = require('Types').ItemType;
var GameState = require('States').GameState;

var startX = 113;
var startY = 501;

var distX = 83;
var distY = 65;

var spawnOffSetY = 200;
var despawnOffSetY = -100;
var ySpawnPosition = 485;

var startField = [[7, 1, 2, 2, 1, 7], [7, 1, 5, 1, 2, 1, 7], [7, 2, 1, 1, 2, 7], [7, 2, 1, 1, 1, 2, 7], [7, 2, 1, 1, 2, 7], [7, 1, 2, 1, 5, 1, 7], [7, 1, 2, 2, 1, 7], [7, 1, 1, 2, 1, 1, 7]
/*[7,1,1,1,1,0],
 [7,1,1,1,1,1,0],
 [7,1,1,4,4,5],
 [7,1,1,1,5,1,0],
 [7,1,1,1,1,0],
 [7,5,6,3,1,1,0],
 [7,1,1,5,1,0],
 [7,1,1,1,1,1,0],*/
];

//Array for each individual block
var pufferField = [[7, 1, 6, 6, 6, 1, 7], [7, 1, 2, 2, 1, 7], [7, 1, 3, 1, 3, 1, 7], [7, 1, 2, 2, 1, 7], [7, 1, 2, 1, 2, 1, 7], [7, 3, 2, 2, 3, 7], [7, 7, 1, 1, 1, 7, 7], [7, 1, 1, 4, 4, 7], [7, 4, 1, 4, 1, 4, 7], [7, 4, 1, 1, 1, 7], [7, 4, 1, 1, 1, 1, 7], [7, 5, 1, 5, 1, 7], [7, 1, 1, 1, 1, 1, 7], [7, 1, 1, 1, 1, 7], [7, 6, 1, 1, 1, 1, 7], [7, 1, 1, 1, 1, 7]];
/*
 The items-array has the same dimensions as the startField. Each item will be a child of the corresponding block (seen as a layover).
 // 0.Empty, 1.antidoteLeft, 2.antidoteRight, 3.coinLeft, 4.coinRight, 5.starLeft,
 // 6.starRight, 7.BlockedBush, 8.BlockedStone, 9.SlowDownBottom, 9.SlowDownTop
 //TODO: 10.WaterLeft, 11.WaterRight */
var startFieldItems = [[0, 8, 0, 0, 8, 0], [0, 8, 0, 7, 0, 8, 0], [0, 0, 7, 7, 2, 0], [0, 6, 7, 7, 7, 0, 0], [0, 0, 7, 7, 0, 0], [0, 7, 4, 7, 0, 7, 0], [0, 7, 0, 0, 7, 0], [0, 8, 8, 0, 8, 8, 0]];

/*
 The items-array has the same dimensions as the pufferField. Each item will be a child of the corresponding block (seen as a layover).
 // 0.Empty, 1.antidoteLeft, 2.antidoteRight, 3.coinLeft, 4.coinRight, 5.starLeft,
 // 6.starRight, 7.BlockedBush, 8.BlockedStone, 9.SlowDownBottom, 9.SlowDownTop
 //TODO: 10.WaterLeft, 11.WaterRight */
var pufferFieldItems = [[0, 8, 0, 0, 0, 8, 0], [0, 8, 0, 0, 8, 0], [0, 8, 0, 0, 0, 8, 0], [0, 8, 0, 0, 8, 0], [0, 8, 0, 7, 0, 8, 0], [0, 0, 0, 0, 0, 0], [0, 0, 9, 7, 9, 0, 0], [0, 9, 7, 0, 0, 0], [0, 0, 7, 0, 7, 0, 0], [0, 0, 7, 9, 9, 0], [0, 0, 7, 7, 0, 7, 0], [0, 0, 7, 0, 8, 0], [0, 0, 0, 0, 0, 7, 0], [0, 0, 0, 7, 0, 0], [0, 0, 7, 0, 0, 0, 0], [0, 0, 0, 2, 0, 0]];

var nextFirstLine = 0;
var nextFirstLineItem = 0;

var newCube = null;
var newItem = null;

cc.Class({
	'extends': cc.Component,

	properties: {
		gridSizeX: 0, // Rows - dont change here but in cocos creator!!
		gridSizeY: 0, // Columns

		despawnHeight: 0,

		item: {
			'default': null,
			type: cc.Node
		},

		//Blocks start here
		Empty: { //0		EMPTY
			'default': null,
			type: cc.Prefab
		},
		Grass: { //1		GRASS
			'default': null,
			type: cc.Prefab
		},
		Dirt: { //2		DIRT
			'default': null,
			type: cc.Prefab
		},
		Trapdoor: { //3		TRAPDOOR
			'default': null,
			type: cc.Prefab
		},
		Switcher: { //4		SWITCHER
			'default': null,
			type: cc.Prefab
		},
		Poison: { //5		POISON
			'default': null,
			type: cc.Prefab
		},
		Spike: { //6		SPIKE
			'default': null,
			type: cc.Prefab
		},
		WaterC: { //7		WATER (Like EMPTY)
			'default': null,
			type: cc.Prefab
		},

		// Game reference to pass field
		game: {
			'default': null,
			type: cc.Node
		},

		//Items start here
		// 0.Empty, 1.antidoteLeft, 2.antidoteRight, 3.coinLeft, 4.coinRight, 5.starLeft,
		// 6.starRight, 7.BlockedBush, 8.BlockedStone, 9.SlowDownBottom, 9.SlowDownTop
		//TODO: 10.WaterLeft, 11.WaterRight
		AntidoteL: { //1		AntidoteL
			'default': null,
			type: cc.Prefab
		},
		AntidoteR: { //2		AntidoteR
			'default': null,
			type: cc.Prefab
		},
		CoinL: { //3		CoinL
			'default': null,
			type: cc.Prefab
		},
		CoinR: { //4		CoinR
			'default': null,
			type: cc.Prefab
		},
		StarL: { //5		StarL
			'default': null,
			type: cc.Prefab
		},
		StarR: { //6		StarR
			'default': null,
			type: cc.Prefab
		},

		BlockedBush: { //7		BlockedBush
			'default': null,
			type: cc.Prefab
		},
		BlockedStone: { //8		BlockedStone
			'default': null,
			type: cc.Prefab
		},
		SlowDownBottom: { //9		SlowDownBottom (Bottom and Top are always together)
			'default': null,
			type: cc.Prefab
		},
		SlowDownTop: { //9		SlowDownTop (Bottom and Top are always together)
			'default': null,
			type: cc.Prefab
		},
		/*
   WaterLeft: {						//10		WaterLeft
   default: null,
   type: cc.Prefab,
   },*/
		WaterRight: { //11		WaterRight
			'default': null,
			type: cc.Prefab
		}

	},

	//Player
	// use this for initialization
	onLoad: function onLoad() {
		//register gamefield at game for processing gamefield logic
		this.game.getComponent('Game').gamefield = this;

		this.player = null; // load later when player ran onLoad()
		this.count = 0;
		this.gameField = [];
		this.items = [];

		this.disTX = distX;
		this.disTY = distY;
		this.resetArrays();
		this.initializeField();

		this.game.getComponent('Game').onGameFieldLoadCallback();
	},

	resetArrays: function resetArrays() {
		nextFirstLine = 0;
		nextFirstLineItem = 0;
		pufferField = [[7, 1, 6, 6, 6, 1, 7], [7, 1, 2, 2, 1, 7], [7, 1, 3, 1, 3, 1, 7], [7, 1, 2, 2, 1, 7], [7, 1, 2, 1, 2, 1, 7], [7, 3, 2, 2, 3, 7], [7, 7, 1, 1, 1, 7, 7], [7, 1, 1, 4, 4, 7], [7, 4, 1, 4, 1, 4, 7], [7, 4, 1, 1, 1, 7], [7, 4, 1, 1, 1, 1, 7], [7, 5, 1, 5, 1, 7], [7, 1, 1, 1, 1, 1, 7], [7, 1, 1, 1, 1, 7], [7, 6, 1, 1, 1, 1, 7], [7, 1, 1, 1, 1, 7]];
		pufferFieldItems = [[0, 8, 0, 0, 0, 8, 0], [0, 8, 0, 0, 8, 0], [0, 8, 0, 0, 0, 8, 0], [0, 8, 0, 0, 8, 0], [0, 8, 0, 7, 0, 8, 0], [0, 0, 0, 0, 0, 0], [0, 0, 9, 7, 9, 0, 0], [0, 9, 7, 0, 0, 0], [0, 0, 7, 0, 7, 0, 0], [0, 0, 7, 9, 9, 0], [0, 0, 7, 7, 0, 7, 0], [0, 0, 7, 0, 8, 0], [0, 0, 0, 0, 0, 7, 0], [0, 0, 0, 7, 0, 0], [0, 0, 7, 0, 0, 0, 0], [0, 0, 0, 2, 0, 0]];
	},

	initializeField: function initializeField() {

		for (var y = 0; y < startField.length; y++) {
			this.gameField[y] = [];
			for (var x = 0; x < startField[y].length; x++) {
				if (startField[y].length % 2 === 0) {
					newCube = this.spawnCube(startX + x * distX, startY - distY * y, startField[y][x], startFieldItems[y][x]);
				} else {
					newCube = this.spawnCube(startX + x * distX - distX / 2, startY - distY * y, startField[y][x], startFieldItems[y][x]);
				}
				//cc.log('Adding new cube: ');
				//cc.log(newCube);
				this.gameField[y][x] = newCube;
			}
		}
	},

	/* Displaces the entire gamefield by *Speed*-Pixel
  * In case border is crossed -> delete lowest row */
	updateField: function updateField(speed) {
		for (var y = 0; y < this.gameField.length; y++) {
			for (var x = 0; x < this.gameField[y].length; x++) {
				var posX = this.gameField[y][x].getPositionX();
				var posY = this.gameField[y][x].getPositionY();
				this.gameField[y][x].setPosition(posX, posY + speed);
			}
		}
		this.updatePlayer(speed);
		/*var fieldx =  this.node.getPositionX(); //BUGGY
  var fieldy = this.node.getPositionY();
  this.node.setPosition(fieldx, fieldy+speed); */
		//WENN GRENZE UEBERSCHRITTEN; DANN WIRD ZEILE GELÖSCHT
		if (this.gameField[this.gameField.length - 1][0].getPositionY() <= this.despawnHeight) {
			cc.log('WIR SIND ZU WEIT!');
			this.destroyLine(this.gameField.length - 1);
			this.rearrangeGameField();
		}
		return true;
	},

	updatePlayer: function updatePlayer(speed) {
		var x = this.player.node.getPositionX();
		var y = this.player.node.getPositionY();
		this.player.node.setPosition(x, y + speed);
	},

	updatePlayerArrayPos: function updatePlayerArrayPos() {

		if (this.gameField[this.player.arrayPosY].length % 2 == 0) {
			if (this.player.dir < 0) {
				this.player.arrayPosX = this.player.arrayPosX + 1;
			}
		} else {
			if (this.player.dir > 0) {
				this.player.arrayPosX = this.player.arrayPosX - 1;
			}
		}

		this.player.arrayPosY = this.player.arrayPosY - 1;
	},

	getStartPosition: function getStartPosition() {
		var mid = Math.round(Number(this.gameField[this.gameField.length - 1].length / 2)) - 1;
		var startField = this.gameField[this.gameField.length - 1][mid];
		//TODO: move this more suitable
		this.player.arrayPosX = mid;
		this.player.arrayPosY = this.gameField.length - 1;
		this.player.oldDest = startField;
		var startpos = cc.p(startField.getPositionX(), startField.getPositionY() + this.player.offsetY);
		return startpos;
	},

	getJumpField: function getJumpField(dir) {
		if (this.gameField[this.player.arrayPosY].length % 2 == 0) {
			if (dir > 0) {
				return this.gameField[this.player.arrayPosY - 1][this.player.arrayPosX];
			} else {
				return this.gameField[this.player.arrayPosY - 1][this.player.arrayPosX + 1];
			}
		} else {
			if (dir > 0) {
				return this.gameField[this.player.arrayPosY - 1][this.player.arrayPosX - 1];
			} else {
				return this.gameField[this.player.arrayPosY - 1][this.player.arrayPosX];
			}
		}
	},

	//TODO: destroy items on that line
	destroyLine: function destroyLine(line) {
		for (var i = 0; i < this.gameField[line].length; i++) {
			//this.gameField[line][i].destroy();
			this.destroyBlock(this.gameField[line][i]);
		}
	},

	destroyBlock: function destroyBlock(block) {
		var fall = cc.moveTo(1, cc.p(block.getPosition().x, despawnOffSetY)).easing(cc.easeCubicActionIn());
		var fade = cc.fadeOut(1.5);
		block.runAction(cc.sequence(cc.spawn(fall, fade), cc.callFunc(this.destroyBlockData, this)));
	},

	destroyBlockData: function destroyBlockData(block) {
		block.destroy();
	},

	rearrangeGameField: function rearrangeGameField() {
		//cc.log('M: rearrangeGameField')
		var returnA = [];
		var x = this.gameField[1][0].getPositionX();
		returnA[0] = this.createFirstLine(x);
		for (var i = 0; i < this.gameField.length - 1; i++) {
			returnA[i + 1] = this.gameField[i];
		}
		this.gameField = returnA;
		this.addZOrderToGameField();
		this.player.arrayPosY = this.player.arrayPosY + 1;
		if (this.player.arrayPosY >= this.gameField.length) {
			console.log('M: rearrange kills player');
			this.player.fall();
			this.game.getComponent('Game').state = GameState.GameOver;
		}
	},

	createFirstLine: function createFirstLine(x) {
		cc.log('M: createFirstLine');
		var returnA = [];
		//next line from block-puffer
		var array = this.getNextLineFromPuffer();
		//next line from item-puffer
		var arrayItems = this.getNextLineFromItemPuffer();

		for (var i = 0; i < array.length; i++) {
			if (array.length % 2 == 0) {

				returnA[i] = this.spawnCube(x + i * distX, ySpawnPosition + distY - spawnOffSetY, array[i], arrayItems[i]);
				returnA[i].opacity = 0;
				var rise = cc.moveTo(1, cc.p(returnA[i].getPosition().x, ySpawnPosition + distY)).easing(cc.easeCubicActionIn());
				var fade = cc.fadeIn(1);
				returnA[i].runAction(cc.spawn(fade, rise));
			} else {
				//newCube = this.spawnBlueCube(startX+(x*distX)-(distX/2), startY-(distY*y));
				//cc.log('wir haben ein ungerades Array');

				returnA[i] = this.spawnCube(x + i * distX, ySpawnPosition + distY - spawnOffSetY, array[i], arrayItems[i]);
				returnA[i].opacity = 0;
				var rise = cc.moveTo(1, cc.p(returnA[i].getPosition().x, ySpawnPosition + distY)).easing(cc.easeCubicActionIn());
				var fade = cc.fadeIn(1);
				returnA[i].runAction(cc.spawn(fade, rise));
			}
		}
		return returnA;
	},

	//TODO: add code to each case, so items are created as well (as of now, item-code only exists in case 1)
	spawnCube: function spawnCube(x, y, cubeNumber, itemNumber) {
		cc.log('M: spawnCube');
		switch (cubeNumber) {
			case 0:
				//generate a new node in the scene with a preset template
				var newCube = cc.instantiate(this.Empty);
				newCube.getComponent('Empty').blocktype = BlockType.Empty;

				break;
			case 1:
				var newCube = cc.instantiate(this.Grass);
				newCube.getComponent('Grass').blocktype = BlockType.Grass;
				//creating new item and adding it to cube
				newCube = this.spawnItem(newCube, itemNumber, 'Grass');

				break;
			case 2:
				var newCube = cc.instantiate(this.Dirt);
				newCube.getComponent('Dirt').blocktype = BlockType.Dirt;
				//creating new item and adding it to cube
				//var newItemToAdd = this.spawnItem(itemNumber);
				newCube = this.spawnItem(newCube, itemNumber, 'Dirt');

				break;
			case 3:
				var newCube = cc.instantiate(this.Trapdoor);
				newCube.getComponent('Trapdoor').blocktype = BlockType.Trapdoor;
				newCube.getComponent('Trapdoor').sprite = newCube;
				//TODO: delete the following three lines, testing purposes only. Trapdoor never has items on it.
				//creating new item and adding it to cube
				//var newItemToAdd = this.spawnItem(itemNumber);
				//newCube = this.spawnItem(newCube, itemNumber, 'Trapdoor');

				break;
			case 4:
				var newCube = cc.instantiate(this.Switcher);
				newCube.getComponent('Switcher').blocktype = BlockType.Switcher;
				//TODO: delete the following three lines, testing purposes only. Trapdoor never has items on it.
				//creating new item and adding it to cube
				//var newItemToAdd = this.spawnItem(itemNumber);
				newCube = this.spawnItem(newCube, itemNumber, 'Switcher');

				break;
			case 5:
				var newCube = cc.instantiate(this.Poison);
				newCube.getComponent('Poison').blocktype = BlockType.Poison;
				//TODO: delete the following three lines, testing purposes only. Trapdoor never has items on it.
				//creating new item and adding it to cube
				//var newItemToAdd = this.spawnItem(itemNumber);
				newCube = this.spawnItem(newCube, itemNumber, 'Poison');

				break;
			case 6:
				var newCube = cc.instantiate(this.Spike);
				newCube.getComponent('Spike').blocktype = BlockType.Spike;
				//TODO: delete the following three lines, testing purposes only. Trapdoor never has items on it.
				//creating new item and adding it to cube
				//var newItemToAdd = this.spawnItem(itemNumber);
				newCube = this.spawnItem(newCube, itemNumber, 'Spike');

				break;
			case 7:
				var newCube = cc.instantiate(this.WaterC);
				newCube.getComponent('Empty').blocktype = BlockType.Empty;
				newCube.name = 'Empty';
				break;
			default:
				var newCube = cc.instantiate(this.Grass);
				newCube.getComponent('Grass').blocktype = BlockType.Grass;
				//creating new item and adding it to cube
				//var newItemToAdd = this.spawnItem(itemNumber);
				newCube = this.spawnItem(newCube, itemNumber, 'Grass');

				break;
		}

		//set up a position for the "EMPTY"
		//newCube.setAnchorPoint(cc.p(0,0));
		//-----newCube.addChild(newItemToAdd);
		newCube.setPosition(x, y);
		//put the newly added node under the Canvas node

		this.node.addChild(newCube);

		//cc.log('Returning the following cube: ');
		//cc.log(newCube);
		return newCube;
	},

	// 0.Empty, 1.antidoteLeft, 2.antidoteRight, 3.coinLeft, 4.coinRight, 5.starLeft,
	// 6.starRight, 7.BlockedBush, 8.BlockedStone, 9.SlowDownBottom, 9.SlowDownTop
	//TODO: 10.WaterLeft, 11.WaterRight
	spawnItem: function spawnItem(parentBlock, itemNumber, blockName) {
		switch (itemNumber) {
			case 0:
				//Empty/ no item
				var newItem = cc.instantiate(this.Empty);
				newItem.name = 'Empty';
				break;
			case 1:
				//antidoteLeft
				var newItem = cc.instantiate(this.AntidoteL);
				newItem.name = 'AntidoteL';
				newItem.getComponent('Item').itemtype = ItemType.Antidote;

				break;
			case 2:
				//antidoteRight
				var newItem = cc.instantiate(this.AntidoteR);
				newItem.name = 'AntidoteR';
				newItem.getComponent('Item').itemtype = ItemType.Antidote;

				break;
			case 3:
				//coinLeft
				var newItem = cc.instantiate(this.CoinL);
				newItem.name = 'CoinL';
				newItem.getComponent('Item').itemtype = ItemType.Coin;
				break;
			case 4:
				//coinRight
				var newItem = cc.instantiate(this.CoinR);
				newItem.name = 'CoinR';
				newItem.getComponent('Item').itemtype = ItemType.Coin;

				break;
			case 5:
				//starLeft
				var newItem = cc.instantiate(this.StarL);
				newItem.name = 'starLeft';
				newItem.getComponent('Item').itemtype = ItemType.Star;
				break;
			case 6:
				//starRight
				var newItem = cc.instantiate(this.StarR);
				newItem.name = 'starRight';
				newItem.getComponent('Item').itemtype = ItemType.Star;
				break;
			case 7:
				//BlockedBush
				var newItem = cc.instantiate(this.BlockedBush);
				newItem.name = 'BlockedBush';
				parentBlock.getComponent(blockName).isBlocked = true;
				newItem.getComponent('Item').itemtype = ItemType.Blocker;
				break;
			case 8:
				//BlockedStone
				var newItem = cc.instantiate(this.BlockedStone);
				newItem.name = 'BlockedStone';
				parentBlock.getComponent(blockName).isBlocked = true;
				newItem.getComponent('Item').itemtype = ItemType.Blocker;
				break;
			case 9:
				//SlowDown (Top AND Bottom)
				var newItem = cc.instantiate(this.SlowDownBottom);
				newItem.getComponent('Item').itemtype = ItemType.Slower;
				newItem.name = 'SlowDownBottom';

				var newItem2 = cc.instantiate(this.SlowDownTop);
				newItem2.getComponent('Item').itemtype = ItemType.Slower;
				newItem.addChild(newItem2);
				break;
			default:
				//Empty/ no item
				var newItem = cc.instantiate(this.Empty);
				newItem.name = 'Empty';
				break;
		}

		//Items are in three classes:
		//1. Float above cube
		//2. Sit on top of cube
		//3. Same position as cube (no repositioning necessary)
		var floatAboveCube = [1, 2, 3, 4, 5, 6];
		var rightOnTopOfCube = [7, 8, 9, 10];

		if (floatAboveCube.includes(itemNumber)) {
			var posY = newItem.getPositionY();
			var posX = newItem.getPositionX();
			newItem.setPosition(posX, posY + 50);
		} else if (rightOnTopOfCube.includes(itemNumber)) {
			var posY = newItem.getPositionY();
			var posX = newItem.getPositionX();
			newItem.setPosition(posX, posY + 40);
		}
		parentBlock.getComponent(blockName).item = newItem;
		parentBlock.addChild(newItem);

		return parentBlock;
	},

	/* Gets the next line from the block-puffer, so a new line can be created.	*/
	/* Gets the next line from the block-puffer, so a new line can be created.	*/
	getNextLineFromPuffer: function getNextLineFromPuffer() {
		cc.log('M: getNextLineFromPuffer');
		var ret = [];
		if (pufferField.length === nextFirstLine) {
			cc.log('Puffer array is empty!');
			/*pufferField = [];
    pufferField = Level.L13C;
    nextFirstLine = 0;*/
			//TODO umkommentieren
			this.defineNextRandomArray();
			//this.testArray()
			ret = pufferField[nextFirstLine];
			nextFirstLine = nextFirstLine + 1;
		} else {
			//cc.log('Getting next array line fro puffer...')
			ret = pufferField[nextFirstLine];
			nextFirstLine = nextFirstLine + 1;
		}
		//cc.log('Returning next puffer array line, exiting getNextLineFromPuffer', ret);
		return ret;
	},

	//TODO nur ein Dummy zum testen, später LÖSCHEN!
	testArray: function testArray() {
		pufferField = [];
		pufferFieldItems = [];
		pufferField = Level.L33C;
		pufferFieldItems = Level.L33I;
		nextFirstLine = 0;
		nextFirstLineItem = 0;
	},

	/* Gets the next line from the item-puffer, so a new line can be created.	*/
	getNextLineFromItemPuffer: function getNextLineFromItemPuffer() {
		cc.log('M: getNextLineFromItemPuffer');
		var ret = [];

		if (pufferFieldItems.length === nextFirstLineItem) {
			//TODO hier muessen wir noch reagieren
			cc.log('ItemPuffer array is empty!');
			/*pufferFieldItems = [];
    pufferFieldItems = Level.L13I;
    nextFirstLineItem = 0;*/
			ret = pufferFieldItems[nextFirstLineItem];
			nextFirstLineItem = nextFirstLineItem + 1;
		} else {
			ret = pufferFieldItems[nextFirstLineItem];
			nextFirstLineItem = nextFirstLineItem + 1;
		}
		return ret;
	},

	defineNextRandomArray: function defineNextRandomArray() {
		//Score?!
		var score = this.game.getComponent('Game').score;
		console.log('M: defineNextRandomArray');
		console.log('Score ausgelesen: ', score);

		pufferField = [];
		pufferFieldItems = [];

		var rand = Math.random() * 10 + 1;
		console.log('Random: ', rand);

		if (score <= 35) {
			if (rand < 4) {
				console.log('WIR WEISE L11C zu');
				pufferField = Level.L11C;
				pufferFieldItems = Level.L11I;
			} else if (rand < 7) {
				console.log('WIR WEISE L12C zu');
				pufferField = Level.L12C;
				pufferFieldItems = Level.L12I;
			} else {
				console.log('WIR WEISE L13C zu');
				pufferField = Level.L13C;
				pufferFieldItems = Level.L13I;
			}
		} else if (score <= 70) {
			if (rand < 4) {
				console.log('WIR WEISE L21C zu');
				pufferField = Level.L21C;
				pufferFieldItems = Level.L21I;
			} else if (rand < 7) {
				console.log('WIR WEISE L22C zu');
				pufferField = Level.L22C;
				pufferFieldItems = Level.L22I;
			} else {
				console.log('WIR WEISE L23C zu');
				pufferField = Level.L23C;
				pufferFieldItems = Level.L23I;
			}
		} else {
			if (rand < 4) {
				console.log('WIR WEISE L31C zu');
				pufferField = Level.L31C;
				pufferFieldItems = Level.L31I;
			} else if (rand < 7) {
				console.log('WIR WEISE L32C zu');
				pufferField = Level.L32C;
				pufferFieldItems = Level.L32I;
			} else {
				console.log('WIR WEISE L33C zu');
				pufferField = Level.L33C;
				pufferFieldItems = Level.L33I;
			}
		}
		nextFirstLine = 0;
		nextFirstLineItem = 0;
	},

	addZOrderToGameField: function addZOrderToGameField() {
		cc.log('M: addZOrderToGameField');
		var count = 1;
		for (var y = 0; y < this.gameField.length; y++) {
			for (var x = 0; x < this.gameField[y].length; x++) {
				this.gameField[y][x].setLocalZOrder(count);
				count++;
			}
		}
	},

	getBlockType: function getBlockType(block) {
		cc.log('M: getBlockType');
		cc.log(block.name);
		//var ret = block.getClassName();
		//cc.log(ret);
		return block.name;
	},

	callPrefab: function callPrefab(pref) {
		this.pref.node.collide();
	}
});
/*
 initializeField2: function(x,y){
 this.gameField = [x];
 for (var h = 0; h < x; h++) { //create array with uneven rows
 if(h%2===1){
 this.gameField[h] = [y-1]; //uneven
 } else {
 this.gameField[h] = [y];
 }
 }

 for (var i = 0; i < this.gameField.length; i++) {
 for (var j = 0; j < this.gameField[i].length; j++) {
 if(this.gameField[i].length%2===1){ // even array/row
 newCube = this.spawnCube(startX+(x*distX), startY-(distY*y), startField2[i][j]);
 }
 else{ // uneven array/row
 newCube = this.spawnCube(startX+(x*distX)-(distX/2), startY-(distY*y), startField2[i][j]);
 }
 this.gameField[i][j] = newCube; //TODO add blocks not numbers
 }
 }


 cc.log("Field:");
 for (var i = 0; i < this.gameField.length; i++) {
 cc.log(this.gameField[i].join("Row: "+i+" "));
 }
 },

 addFirstFieldRow: function(row){
 this.field.unshift(row);
 },

 removeLastFieldRow: function(){
 this.field.pop();
 },

 addFieldRow : function(index, row){
 this.field[index] = row;
 },

 removeFieldRow : function(index){
 var temp = [this.gridSizeX];
 for(var h = 0; h < this.gridSizeX; h++){
 temp[h] = this.field[h];
 }

 for(var i = 0; i < this.gridSizeX; i++){
 if(i != 0){
 var newindex = i-1;
 cc.log("Ind: "+newindex);
 this.field[i] = temp[newindex];
 }
 }
 },

 generateRow : function(){
 var i = this.gridSizeX+this.count;
 this.count++;
 return [i,i,i,i,i];
 //TODO: load a row from tiled file return array
 },*/

// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"Level":"Level","States":"States","Types":"Types"}],"Game":[function(require,module,exports){
"use strict";
cc._RFpush(module, '076ef+CbqVCFK/Q9scrL8Ui', 'Game');
// scripts\Game.js

//Game
// Imports
var GameState = require('States').GameState;
var PlayerMovementState = require('States').PlayerMovementState;
var Step = require('Types').BlockType;

var whichStep = Step.None;
var updateAccess = true;
var onSteppKills = false;
var killActionExecuted = false;
var pressDouble = 0;

//disables the antialiasing, because it destroys the pixelart
var __ccTexture2D_handleLoadedTexture = cc.Texture2D.prototype.handleLoadedTexture;
cc.Texture2D.prototype.handleLoadedTexture = function () {
    __ccTexture2D_handleLoadedTexture.apply(this, arguments);
    this.setAliasTexParameters();
};

var pressCount = 0;

cc.Class({
    'extends': cc.Component,

    properties: {
        state: {
            'default': GameState.None,
            type: GameState
        },
        // Game Data/Objects
        gamefield: {
            'default': null,
            type: cc.Node
        },

        player: {
            'default': null,
            type: cc.Node
        },

        // Game-UI
        scoreLabel: {
            'default': null,
            type: cc.Label
        },

        multiplierLabel: {
            'default': null,
            type: cc.Label
        },

        // Music Theme
        themeurl: {
            'default': null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        //this.setFrameRate(60);
        this.storage = cc.sys.localStorage;
        this.state = GameState.Waiting;
        //this.GameState = GameState;
        this.initalizeInputControl(); // Activate input handling

        cc.audioEngine.playMusic(this.themeurl, true);
        this.storage.setItem('score', 0);

        this.score = 0;
        this.scoreMultiplier = 1;
        this.multiplierActive = false;

        this.steppedBlock = null;
    },

    reset: function reset() {},

    // Called when player onLoad() has finished
    onPlayerLoadCallback: function onPlayerLoadCallback() {
        this.gamefield.player = this.player;

        // Player is assembled. set all needed graphical information
        this.player.node.setPosition(this.gamefield.getStartPosition());
        this.player.node.setLocalZOrder(1000);
        this.player.dx = this.gamefield.disTX / 2; //only half the distance on x!!
        this.player.dy = this.gamefield.disTY;
    },

    // Called when gamefield is initalized ( onLoad() has finished )
    onGameFieldLoadCallback: function onGameFieldLoadCallback() {},

    //TODO hier wird ein Fehler verursacht, wenn Gift NACH einem Switcher kommt!
    validateMove: function validateMove(dir) {

        if (this.state === GameState.GameOver) {
            //console.log('Du darfst nicht bewegen, weil du gameOver bist');
            return false;
        }

        if (this.player.movestate === PlayerMovementState.Jumping || this.player.movestate === PlayerMovementState.Falling) {
            //Player already jumping/falling -> neglect input
            return false;
        }
        //var currentfield = this.player.oldDest;
        //console.log('BlockType: ', this.gamefield.getBlockType(this.gamefield.getJumpField(dir)));
        //console.log('var destfield = ', destfield);

        // Handle swaped case
        if (this.player.isSwaped) {
            dir = -dir;
        }

        // Handle slowed case
        if (this.player.isSlowed) {
            console.log("PRESSCOUNT" + pressCount);
            pressCount++;
            if (pressCount < 3) {
                console.log("STILL SLOWED");
                return false;
            } else {
                console.log("RELEASE" + pressCount);
                pressCount = 0;
                this.player.isSlowed = false;
                //return true;
            }
        }

        this.destfield = this.gamefield.getJumpField(dir);
        //console.log('destfield = ', this.destfield);
        //console.log('destfield = ', this.destfield.name);
        //steppedBlock is necessarry for movement-collisioncontroll
        var steppedBlock = this.destfield.getComponent(this.destfield.name);

        if (steppedBlock.isBlocked) {
            return false;
        }
        this.player.isSwaped = false;

        // !!! INSERT lines at end of file when bugs happen here !!!

        //
        //Move was correct.
        //
        //Change player direction
        this.player.dir = dir;
        this.incrementScore(1);
        this.scoreLabel.string = this.score.toString();

        return true;
    },

    initalizeInputControl: function initalizeInputControl() {

        var self = this;

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,

            onKeyPressed: function onKeyPressed(keyCode, event) {
                if (self.state == GameState.Paused) return;
                switch (keyCode) {
                    case cc.KEY.a:
                        if (self.state === GameState.Waiting) self.state = GameState.Playing;

                        if (self.validateMove(1)) {
                            self.player.move(self.destfield, self);
                            self.gamefield.updatePlayerArrayPos(); // Change array position after jump or bugs will spawn
                            if (self.player.oldDest !== undefined) {
                                self.player.oldDest.getComponent(self.player.oldDest.name).playerOnTop = false;
                            }
                        }
                        break;
                    case cc.KEY.d:
                        if (self.state === GameState.Waiting) self.state = GameState.Playing;

                        if (self.validateMove(-1)) {
                            self.player.move(self.destfield, self);
                            self.gamefield.updatePlayerArrayPos();
                            if (self.player.oldDest !== undefined) {
                                self.player.oldDest.getComponent(self.player.oldDest.name).playerOnTop = false;
                            }
                        }
                        break;
                    case cc.KEY.u:
                        self.gamefield.updateField(-10);
                        break;
                    case cc.KEY.k:
                        self.player.kill();
                        break;
                    case cc.KEY.escape:
                        cc.log("Escape pressed");
                        // TODO: what to do on escaped-pressed?
                        break;
                    case cc.KEY.f:
                        self.player.fall();
                        break;
                }
            },

            onKeyReleased: function onKeyReleased(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:

                        break;
                    case cc.KEY.d:

                        break;
                }
            }
        }, self.node);
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        //console.log('M: update');
        if (this.state === GameState.Playing) {
            this.moveFieldWithPlayer();
        }
        if (this.state === GameState.GameOver) {
            this.storage.setItem('score', this.score);
            cc.director.loadScene('GameOverScene');
        }
    },

    moveFieldWithPlayer: function moveFieldWithPlayer() {
        var ySpeed = this.player.arrayPosY;
        // cc.log('Playerpos', ySpeed);
        if (updateAccess) {
            //cc.log('UPDATE-Cases betreten');
            updateAccess = false;
            switch (ySpeed) {
                case 8:
                    updateAccess = this.gamefield.updateField(-0.3);
                    break;
                case 7:
                    updateAccess = this.gamefield.updateField(-0.4);
                    break;
                case 6:
                    updateAccess = this.gamefield.updateField(-1);
                    break;
                case 5:
                    updateAccess = this.gamefield.updateField(-1.5);
                    break;
                case 4:
                    updateAccess = this.gamefield.updateField(-2);
                    break;
                case 3:
                    updateAccess = this.gamefield.updateField(-4);
                    break;
                case 2:
                    updateAccess = this.gamefield.updateField(-8);
                    break;
                case 1:
                    updateAccess = this.gamefield.updateField(-12);
                    break;
                case 0:
                    updateAccess = this.gamefield.updateField(-20);
                    break;
                default:
                    updateAccess = this.gamefield.updateField(-0.3);
                    break;
            }
        }
    },

    //
    // HELPING METHODS. SMALL STUFF
    //

    changeMultiplier: function changeMultiplier(value) {
        //TODO: Stop and start action by tag
        this.scoreMultiplier = value;
        this.multiplierLabel.string = "Multiplier: " + this.scoreMultiplier;
        this.multiplierLabel.node.opacity = 255;
        var resetMultiplierCallback = cc.callFunc(this.resetMultiplier, this);
        this.multiplierLabel.node.runAction(cc.sequence(cc.fadeOut(5), resetMultiplierCallback));
    },

    resetMultiplier: function resetMultiplier() {
        this.scoreMultiplier = 0;
    },

    incrementScore: function incrementScore(inc) {
        this.score += inc * this.scoreMultiplier;
    },

    //Deprecated
    checkItemCollision: function checkItemCollision(item) {
        var itempos = item.node.getPosition();
        var ppos = this.player.node.getPosition();
        var dist = cc.pDistance(itempos, ppos);
        if (dist < item.collectRadius) {
            item.onPickUpCallback(this.player);
        }
    }

});
/*switch(destfield){
    case 'Grass':
        //console.log('case Grass');
        if(!this.gamefield.getJumpField(dir).getComponent('Grass').isBlocked){
            ret = true;
        }
        //steppedBlock is necessarry for Collisioncontroll
        this.steppedBlock = this.gamefield.getJumpField(dir).getComponent('Grass');
        whichStep = Step.Grass;
        break;
    case 'Dirt':
        //console.log('case dirt');
        if(!this.gamefield.getJumpField(dir).getComponent('Dirt').isBlocked){
            ret = true;
        }
        this.steppedBlock = this.gamefield.getJumpField(dir).getComponent('Dirt');
        whichStep = Step.Dirt;
        break;
    case 'Trapdoor':
        //console.log('case Trapdoor');
        if(!this.gamefield.getJumpField(dir).getComponent('Trapdoor').isBlocked){
            ret = true;
        }
        this.steppedBlock = this.gamefield.getJumpField(dir).getComponent('Trapdoor');
        whichStep = Step.Trapdoor;
        break;
    case 'Empty':
        //console.log('case Empty');
        if(!this.gamefield.getJumpField(dir).getComponent('Empty').isBlocked){
            ret = true;
        }
        this.steppedBlock = this.gamefield.getJumpField(dir).getComponent('Empty');
        whichStep = Step.Empty;
        break;
    case 'Water_Border':
        if(!this.gamefield.getJumpField(dir).getComponent('Empty').isBlocked){
            ret = true;
        }
        this.steppedBlock = this.gamefield.getJumpField(dir).getComponent('Empty');
        whichStep = Step.Empty;
        break;
    case 'Poison':
        //console.log('case Poison');
        if(!this.gamefield.getJumpField(dir).getComponent('Poison').isBlocked){
            ret = true;
        }
        this.steppedBlock = this.gamefield.getJumpField(dir).getComponent('Poison');
        whichStep = Step.Poison;
        break;
    case 'Switcher':
        //console.log('case Switcher');
        if(!this.gamefield.getJumpField(dir).getComponent('Switcher').isBlocked){
            ret = true;
        }
        this.steppedBlock = this.gamefield.getJumpField(dir).getComponent('Switcher');
        whichStep = Step.Switcher;
        break;
    case 'Spike':
        //console.log('case Spike');
        if(!this.gamefield.getJumpField(dir).getComponent('Spike').isBlocked){
            ret = true;
        }
        this.steppedBlock = this.gamefield.getJumpField(dir).getComponent('Spike');
        whichStep = Step.Spike;
        //console.log('steppedBlock auf Spike gesetzt');
        //console.log(this.steppedBlock);
        break;
    default:
        ret = true;
        break;
}*/

/*var destfield = this.gamefield.getJumpField(dir); // Field player wants to jump at
 console.log('M: validatemMove');
 console.log('BlockType = ', this.gamefield.getBlockType(this.gamefield.getJumpField(dir)));
 this.steppedBlock = destfield.getComponent('Block');
 if(this.steppedBlock !== null){
 if(this.steppedBlock.isBlocked){    // Block is...blocked
 return false;
 }
 }*/

cc._RFpop();
},{"States":"States","Types":"Types"}],"Grass":[function(require,module,exports){
"use strict";
cc._RFpush(module, '65b91llmkxJtJkhqsYzFp71', 'Grass');
// scripts\gamefield\blocks\Grass.js

var BlockType = require('Types').BlockType;
var PlayerMovementState = require('States').PlayerMovementState;

cc.Class({
    'extends': cc.Component,

    properties: {
        isBlocked: false,
        hasItem: false,

        blocktype: {
            'default': BlockType.None,
            type: BlockType
        },

        item: {
            'default': null,
            type: cc.Node
        }

    },

    // use this for initialization
    onLoad: function onLoad() {
        this.playerOnTop = false;
    },

    onStepCallback: function onStepCallback(player, game) {
        cc.log('M: onStepCallback Grass');
    },

    collide: function collide() {}

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"States":"States","Types":"Types"}],"Item":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a9d5fhMpDRB7rnwgzl0Y19Z', 'Item');
// scripts\gameobjects\Item.js


var ItemType = require('Types').ItemType;
var ItemState = require('States').ItemState;
var ItemActivityState = require('States').ItemActivityState;

var riseY = 50;

cc.Class({
    'extends': cc.Component,

    properties: {
        itemtype: {
            'default': ItemType.None,
            type: ItemType
        },

        itemstate: {
            'default': ItemState.Pickable,
            type: ItemState
        },

        activitystate: {
            'default': ItemActivityState.Idle,
            type: ItemActivityState
        },

        collectRadius: 0,
        itemValue: 0, // Value of the item when picked up(pure score, score multiplier)
        itemTimer: 0,

        activationsound: { // Drag right audio here.
            'default': null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},

    destroyItem: function destroyItem() {
        console.log("Itemtype to destroy: " + this.itemtype.toString());
        console.log(ItemType[this.itemtype]);
        switch (this.itemtype) {
            case ItemType.Slower:
                break;
            case ItemType.Antidote:
            case ItemType.Coin:
            case ItemType.Star:
                this.node.destroy();
                break;
        }
    },

    onPickUpCallback: function onPickUpCallback(player, game) {
        this.itemstate = ItemState.Picked;
        this.activitystate = ItemActivityState.Active;
        // Perform the action the item produces(change player or environment)
        switch (this.itemtype) {
            case ItemType.Antidote:
                player.isPoisoned = false;
                player.poisonTmp = player.poisonTimer; //reset timmer
                break;
            case ItemType.Coin:
                console.log('GAME: ', game.name);
                game.incrementScore(5);
                game.scoreLabel.string = game.score.toString();
                break;
            case ItemType.Star:
                player.isPoisoned = false;
                player.isInvincible = true;
                break;
            case ItemType.Slower:
                console.log("SET SWAPED TRUE");
                player.isSlowed = true;
                break;
        }
        var pickedCallback = cc.callFunc(this.picked, this);
        var soundcallback = cc.callFunc(this.playSound, this);
        // Perform item animation and destroy it
        this.node.runAction(cc.sequence(cc.spawn(this.assemblePickUpAction(), soundcallback), pickedCallback));
    },

    assemblePickUpAction: function assemblePickUpAction() {
        this.activitystate = ItemActivityState.Active;
        // Rise-Animation for items to show they have been picked up       
        var risePoint = cc.p(this.node.getPositionX(), this.node.getPositionY() + riseY);
        var fade = cc.fadeOut(this.getItemAnimationTime()); // Let item fade during animation
        var anim = null;

        switch (this.itemtype) {
            case ItemType.Star:
            case ItemType.Coin:
            case ItemType.Antidote:
                anim = cc.moveBy(this.getItemAnimationTime(), risePoint);
                break;
        }
        return cc.spawn(fade, anim);
    },

    getItemAnimationTime: function getItemAnimationTime(type) {
        switch (this.itemtype) {
            case ItemType.Antidote:
            case ItemType.Coin:
            case ItemType.Star:
                return 1.5;
        }
    },

    picked: function picked() {
        this.activitystate = ItemActivityState.Expired;
        this.destroyItem();
    },

    playSound: function playSound() {
        if (this.activationsound !== null) cc.audioEngine.playEffect(this.activationsound, false);
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"States":"States","Types":"Types"}],"Level":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7c45etIGUtBC5VbkAJJ2UCT', 'Level');
// scripts\gamefield\Level.js

//Level
var L11C = [[7, 1, 1, 6, 1, 1, 7], [7, 1, 1, 1, 1, 7], [7, 7, 1, 6, 1, 7, 7], [7, 1, 1, 1, 1, 7], [7, 7, 1, 6, 1, 7, 7], [7, 1, 1, 1, 1, 7], [7, 1, 1, 6, 1, 1, 7], [7, 6, 1, 1, 6, 7]];

var L11I = [[0, 8, 0, 0, 0, 8, 0], [0, 8, 0, 0, 8, 0], [0, 0, 8, 0, 8, 0, 0], [0, 8, 0, 0, 8, 0], [0, 0, 8, 0, 8, 0, 0], [0, 8, 0, 0, 8, 0], [0, 8, 0, 0, 0, 8, 0], [0, 0, 0, 0, 0, 0]];

var L12C = [[7, 1, 1, 1, 1, 1, 7], [7, 1, 1, 1, 1, 7], [7, 1, 1, 1, 1, 1, 7], [7, 1, 1, 1, 1, 7], [7, 1, 1, 1, 1, 4, 7], [7, 1, 1, 1, 1, 7], [7, 1, 1, 3, 1, 1, 7], [7, 1, 1, 1, 1, 7]];

var L12I = [[0, 4, 7, 0, 0, 0, 0], [0, 4, 7, 0, 0, 0], [0, 4, 4, 7, 0, 0, 0], [0, 4, 4, 7, 9, 0], [0, 4, 4, 4, 7, 0, 0], [0, 0, 0, 0, 6, 0], [0, 0, 7, 0, 7, 0, 0], [0, 0, 0, 0, 0, 0]];

var L13C = [[7, 1, 5, 1, 1, 1, 7], [7, 6, 1, 1, 1, 7], [7, 1, 7, 1, 1, 1, 7], [7, 1, 7, 1, 1, 7], [7, 1, 1, 7, 1, 1, 7], [7, 1, 1, 7, 6, 7], [7, 1, 1, 7, 1, 1, 7], [7, 1, 7, 1, 1, 7]];

var L13I = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 4, 7, 0, 0], [0, 9, 0, 4, 0, 7, 0], [0, 9, 0, 4, 0, 0], [0, 0, 0, 0, 4, 0, 0], [0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 2, 0, 0]];

var L21C = [[7, 2, 2, 2, 2, 2, 7], [7, 2, 2, 2, 2, 7], [7, 2, 2, 2, 2, 2, 7], [7, 2, 2, 2, 2, 7], [7, 7, 2, 2, 2, 7, 7], [7, 6, 6, 6, 6, 7], [7, 2, 2, 2, 2, 2, 7], [7, 2, 2, 2, 2, 7]];

var L21I = [[0, 7, 0, 7, 4, 7, 0], [0, 7, 3, 0, 7, 0], [0, 7, 0, 7, 3, 7, 0], [0, 9, 7, 7, 9, 0], [0, 0, 9, 4, 9, 0, 0], [0, 0, 0, 0, 0, 0], [0, 9, 7, 6, 7, 9, 0], [0, 9, 9, 9, 9, 0]];

var L22C = [[7, 4, 4, 7, 4, 4, 7], [7, 4, 7, 7, 2, 7], [7, 7, 2, 7, 4, 7, 7], [7, 4, 7, 7, 4, 7], [7, 7, 4, 7, 2, 7, 7], [7, 4, 7, 7, 4, 7], [7, 7, 2, 7, 4, 7, 7], [7, 4, 7, 7, 4, 7]];

var L22I = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 4, 0], [0, 0, 4, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 4, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 4, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]];

var L23C = [[7, 2, 2, 2, 2, 2, 7], [7, 5, 5, 5, 5, 7], [7, 3, 2, 2, 2, 3, 7], [7, 3, 2, 2, 3, 7], [7, 3, 3, 2, 2, 2, 7], [7, 3, 2, 3, 2, 7], [7, 3, 2, 3, 3, 2, 7], [7, 2, 2, 3, 2, 7]];

var L23I = [[0, 9, 9, 6, 9, 9, 0], [0, 0, 0, 0, 0, 0], [0, 0, 9, 3, 9, 0, 0], [0, 0, 0, 3, 0, 0], [0, 0, 0, 9, 3, 0, 0], [0, 0, 2, 0, 3, 0], [0, 0, 0, 0, 0, 3, 0], [0, 0, 0, 0, 0, 0]];

var L31C = [[7, 3, 5, 3, 5, 3, 7], [7, 4, 3, 3, 4, 7], [7, 3, 6, 3, 6, 3, 7], [7, 3, 4, 4, 3, 7], [7, 3, 3, 6, 3, 3, 7], [7, 3, 2, 4, 3, 7], [7, 3, 4, 3, 6, 3, 7], [7, 3, 2, 3, 2, 7]];

var L31I = [[0, 4, 0, 4, 0, 0, 0], [0, 0, 4, 4, 0, 0], [0, 4, 0, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0], [0, 0, 2, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 4, 0, 0, 3, 0]];

var L32C = [[7, 7, 2, 7, 2, 7, 7], [7, 6, 7, 7, 6, 7], [7, 7, 4, 3, 4, 7, 7], [7, 5, 6, 6, 5, 7], [7, 6, 7, 2, 7, 6, 7], [7, 4, 7, 6, 4, 7], [7, 7, 2, 7, 2, 7, 7], [7, 3, 2, 7, 2, 7]];

var L32I = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 4, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 4, 9, 0, 0, 0, 0], [0, 2, 1, 0, 1, 0]];

var L33C = [[7, 1, 6, 1, 6, 1, 7], [7, 1, 3, 1, 3, 7], [7, 6, 1, 6, 1, 6, 7], [7, 1, 4, 4, 1, 7], [7, 5, 3, 6, 3, 5, 7], [7, 1, 1, 1, 1, 7], [7, 1, 1, 1, 1, 1, 7], [7, 1, 1, 1, 1, 7]];

var L33I = [[0, 0, 3, 0, 4, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 4, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 9, 9, 9, 9, 0], [0, 9, 9, 9, 9, 9, 0], [0, 0, 1, 2, 0, 0]];

module.exports = {
    L11C: L11C,
    L11I: L11I,
    L12C: L12C,
    L12I: L12I,
    L13C: L13C,
    L13I: L13I,
    L21C: L21C,
    L21I: L21I,
    L22C: L22C,
    L22I: L22I,
    L23C: L23C,
    L23I: L23I,
    L31C: L31C,
    L31I: L31I,
    L32C: L32C,
    L32I: L32I,
    L33C: L33C,
    L33I: L33I
};

cc._RFpop();
},{}],"MenuButtonCallbacks":[function(require,module,exports){
"use strict";
cc._RFpush(module, '10915ky+jBFrIsAE/lnyWqN', 'MenuButtonCallbacks');
// scripts\scenescripts\MenuButtonCallbacks.js

cc.Class({
    'extends': cc.Component,

    properties: {

        buttonAudio: {
            'default': null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},

    startControlCallback: function startControlCallback() {
        var onLaunched = function onLaunched() {
            //use this for callbacks on loading
            console.log('Scene launched');
        };
        cc.director.loadScene('GameScene', onLaunched);
        cc.audioEngine.playEffect(this.buttonAudio, false);
    },

    aboutControlCallback: function aboutControlCallback() {
        cc.director.loadScene('About');
        cc.audioEngine.playEffect(this.buttonAudio, false);
    },

    tutorialControlCallback: function tutorialControlCallback() {
        cc.director.loadScene('Tutorial');
        cc.audioEngine.playEffect(this.buttonAudio, false);
    },

    quitControlCallback: function quitControlCallback() {
        //cc.director.end(); //TODO: how to end the game?
        cc.log("Quit pressed.");
        cc.audioEngine.playEffect(this.buttonAudio, false);
    },

    backControlCallback: function backControlCallback() {
        cc.director.loadScene('Startmenu');
        cc.audioEngine.playEffect(this.buttonAudio, false);
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"Player":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'dfcfezAAcJAALXPiIHVJj2d', 'Player');
// scripts\gameobjects\Player.js

var GameState = require('States').GameState;
var PlayerMovementState = require('States').PlayerMovementState;
var PlayerState = require('States').PlayerState;

var explodetime = 0.2;
var riseDeathY = 25;

var animationNeedsUpdate = false;

cc.Class({
    'extends': cc.Component,

    properties: {
        // Player spawns in a standing state
        movestate: {
            'default': PlayerMovementState.Standing,
            type: PlayerMovementState
        },

        isInvincible: false, // Player picked up an item which made him unkillable
        isPoisoned: false,
        isAlive: false,
        isSwaped: false, //Player stands on a Switcher //TODO: nutzlos da nie verwendet in player
        isSlowed: false,

        poisonTimer: 0,
        invincibiltyTimer: 0,

        dir: 0, // Next Position player is jumping to 1 : left  -1: right

        arrayPosX: 0, //Position in the array given with row and column
        arrayPosY: 0,

        jumpTime: 0, // Time for jumping action to run
        fallTime: 0, // same: falling

        // Atlas holdin all sprites of the player.
        playeratlas: {
            'default': null,
            type: cc.SpriteAtlas
        },

        // Player Audios
        jumpAudio: {
            'default': null,
            url: cc.AudioClip
        },

        deathAudio: {
            'default': null,
            url: cc.AudioClip
        },

        fallAudio: {
            'default': null,
            url: cc.AudioClip
        },

        drinkAudio: {
            'default': null,
            url: cc.AudioClip
        },

        poisonedAudio: {
            'default': null,
            url: cc.AudioClip
        },

        // Game reference to pass player
        game: {
            'default': null,
            type: cc.Node
        }

    },

    // use this for initialization
    onLoad: function onLoad() {
        //register player at game for processing player logic
        this.game.getComponent('Game').player = this;

        //Init timers
        this.poisonTmp = this.poisonTimer;
        this.invincibiltyTmp = this.invincibiltyTimer; //Henri fragen ob man properties speichern kann

        this.movestate = PlayerMovementState.Standing;
        this.isMoving = false;
        this.isAlive = true;
        //this.oldDest = this.game.getComponent('Game').gamefield.gameField[gameField.length-1][3];

        this.offsetY = this.node.getContentSize().height / 2; // Offset to set the player on top of blocks
        this.destinationpos = cc.p(0, 0);

        //Load data relevant to player   -- !! LEAVE AT END OF THIS FUNCTION !! --
        this.game.getComponent('Game').onPlayerLoadCallback();
    },

    kill: function kill() {
        this.isInvincible = false;
        this.isAlive = false;
        var gamestatecallback = cc.callFunc(this.changeGameState, this);
        var soundcallback = cc.callFunc(this.playSound, this);
        this.node.runAction(cc.sequence(cc.spawn(this.deform(), this.assembleAction()), gamestatecallback, soundcallback));
        cc.audioEngine.stopAllEffects(); //TODO evtl als callback
    },

    fall: function fall() {
        this.isInvincible = false;
        this.movestate = PlayerMovementState.Falling;
        //var gamestatecallback = cc.callFunc(this.changeGameFallState,this);
        var killcallback = cc.callFunc(this.kill, this);
        var soundcallback = cc.callFunc(this.playSound, this);
        this.node.runAction(cc.sequence(cc.spawn(this.deform(), this.assembleAction()), soundcallback, killcallback));
        this.isAlive = false; //set here because alive impacts death anim.
        cc.audioEngine.stopAllEffects();
    },

    changeGameState: function changeGameState() {
        if (!this.isAlive) this.game.getComponent('Game').state = GameState.GameOver;
    },
    changeGameFallState: function changeGameFallState() {
        console.log("Alive: " + this.isAlive);
        if (this.isAlive) this.isAlive = false;
        console.log('Change GameState: ', this.game.getComponent('Game').state);
        this.game.getComponent('Game').state = GameState.GameOver;
        console.log(this.game.getComponent('Game').state);
    },

    changePlayerState: function changePlayerState() {
        switch (this.movestate) {
            case PlayerMovementState.Jumping:
                this.movestate = PlayerMovementState.Standing;
                break;
        }
    },

    blockStepped: function blockStepped(player, game) {
        this.gAme = game;
        var steppedBlock = this.destfield.getComponent(this.destfield.name);
        console.log('STEPPED BLOCK: ', steppedBlock);
        console.log(this.destfield.name);
        steppedBlock.onStepCallback(this, game);
        var item = steppedBlock.getComponentInChildren('Item');
        if (item !== null) item.onPickUpCallback(this, this.gAme);
    },
    //
    // Movement and Actions
    //

    //Called everytime a the figure is moved by pressing A or D
    move: function move(destfield, game) {
        if (this.isAlive === false) return;
        this.oldDest = this.destfield;
        this.destfield = destfield; // Direction players wants to move the figure(-1 or 1)
        switch (this.movestate) {
            case PlayerMovementState.Standing:
                this.movestate = PlayerMovementState.Jumping;

                var soundCallback = cc.callFunc(this.playSound, this);
                var playerstateCallback = cc.callFunc(this.changePlayerState, this);
                var blockstepCallback = cc.callFunc(this.blockStepped, this, game);
                this.switchPlayerAppearance();
                this.setDestinationPos();

                this.node.runAction(cc.sequence(cc.spawn(this.deform(), this.assembleAction()), blockstepCallback, soundCallback, playerstateCallback));
                break;

            case PlayerMovementState.Jumping:
            case PlayerMovementState.Falling:
                return;
        }
    },

    setDestinationPos: function setDestinationPos() {
        this.destinationpos.x = this.destfield.getPositionX();
        this.destinationpos.y = this.destfield.getPositionY() + this.offsetY;
    },

    switchPlayerAppearance: function switchPlayerAppearance() {
        this.updated = this.updateAnimation();
        if (this.updated) // if animations is running dont go to sprite frame changing
            return;
        if (this.dir < 0) {
            // Player looks left
            this.getComponent(cc.Sprite).spriteFrame = this.playeratlas.getSpriteFrame("player_left");
        } else {
            this.getComponent(cc.Sprite).spriteFrame = this.playeratlas.getSpriteFrame("player_right");
        }
    },

    assembleAction: function assembleAction() {
        if (this.isAlive === false) //Player dead -> action TODO: versaut fallen animation
            return cc.moveBy(explodetime, cc.p(0, riseDeathY));

        switch (this.movestate) {
            case PlayerMovementState.Standing:
                break;
            case PlayerMovementState.Falling:
                return cc.moveTo(this.fallTime, cc.p(this.node.getPosition().x, 0)).easing(cc.easeCubicActionIn());

            case PlayerMovementState.Jumping:
                // Points forming the beziercurve
                var bezier = [this.node.getPosition(), this.destinationpos, this.destinationpos];
                return cc.bezierTo(this.jumpTime, bezier);
        }
    },

    deform: function deform() {
        if (this.isAlive === false) //Player dead -> deform
            return cc.sequence(cc.scaleTo(explodetime, 1.3, 1.3), cc.scaleTo(explodetime, 0.0, 0.0));

        switch (this.movestate) {// Player in a moving state -> action

            case PlayerMovementState.Jumping:
                var scaletime = this.jumpTime * 0.5;
                return cc.sequence(cc.scaleTo(scaletime, 1, 1.1), cc.scaleTo(scaletime, 1, 0.9), cc.scaleTo(scaletime, 1, 1.0));

            case PlayerMovementState.Falling:
                this.node.setLocalZOrder(this.destfield.getLocalZOrder()); //TODO: fall wird schon während des jumps ausgeführt -> spieler verschwindet hinter vorbeigesprungenen blöcken
                var fallDeform = cc.scaleTo(this.fallTime, 0.85, 0.85);
                var fallfade = cc.fadeOut(this.fallTime * 4);
                return cc.spawn(fallDeform, fallfade.easing(cc.easeCubicActionOut()));
        }
        // Might be useful sometime
        if (this.isPoisoned) return null;

        if (this.isInvincible) return null;
    },

    //
    //  Sounds
    //

    playSound: function playSound() {
        if (!this.isAlive) {
            cc.audioEngine.playEffect(this.deathAudio, false);
            return;
        }

        if (this.isPoisoned) cc.audioEngine.playEffect(this.poisonedAudio, false);

        switch (this.movestate) {
            case PlayerMovementState.Jumping:
                cc.audioEngine.playEffect(this.jumpAudio, false);
                break;
            case PlayerMovementState.Falling:
                cc.audioEngine.playEffect(this.fallAudio, false);
                break;

        }
    },

    //
    // Status and Update of player
    //

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (this.isAlive) {
            this.updateTimers(dt);
            //this.updateAnimation();
        }
    },

    updateAnimation: function updateAnimation() {
        if (!this.animation) // Init animation
            this.animation = this.getComponent(cc.Animation);
        if (!this.isPoisoned && !this.isInvincible) {
            //NICE TO HAVE: no bools
            this.animation.stop();
            return false;
        }

        if (this.isPoisoned || this.isInvincible) this.animation.play(this.getAnimation());
        return true;
    },

    updateTimers: function updateTimers(dt) {
        if (this.isPoisoned) if (this.poisonTmp <= 0) {
            //timer ran out -> kill player
            this.isPoisoned = false;
            this.isAlive = false;
            this.kill();
        } else {
            this.poisonTmp -= dt; //decrease timer...hurry!
        }

        if (this.isInvincible) if (this.invincibiltyTmp <= 0) {
            //timer ran out -> downrank player
            this.isInvincible = false;
            this.invincibiltyTmp = this.invincibiltyTimer;
        } else {
            this.invincibiltyTmp -= dt; //decrease timer...hurry!
        }
    },

    isMoving: function isMoving() {
        switch (this.movestate) {//switch for possible further states
            case PlayerMovementState.Jumping:
                this.isMoving = true;
                return true;

            case PlayerMovementState.Standing:
                return false;
        }
    },

    isAlive: (function (_isAlive) {
        function isAlive() {
            return _isAlive.apply(this, arguments);
        }

        isAlive.toString = function () {
            return _isAlive.toString();
        };

        return isAlive;
    })(function () {
        return isAlive;
    }),

    getAnimation: function getAnimation() {
        if (this.dir < 0) {
            if (this.isPoisoned) {
                return 'poison_left_anim'; //play('poison_left_anim');
            }

            if (this.isInvincible) {
                return 'star_left_anim'; //play('poison_left_anim');
            }
        } else {
                if (this.isPoisoned) {
                    return 'poison_right_anim'; //play('poison_left_anim');
                }

                if (this.isInvincible) {
                    return 'star_right_anim'; //play('poison_left_anim');
                }
            }
    }

});
/*
makeInvincible: function(){
    this.isInvincible = true;
    //TODO: start invincibility timer
},
  poison: function(){
    this.isPoisoned = true;
    //TODO: start poison timer and killing phase if turn based poison is neglected
},
  shot : function(){
  },*/

cc._RFpop();
},{"States":"States"}],"Poison":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e050ffZnUVAjKB8fySd+ZdO', 'Poison');
// scripts\gamefield\blocks\Poison.js

var BlockType = require('Types').BlockType;
var PlayerMovementState = require('States').PlayerMovementState;

cc.Class({
    'extends': cc.Component,

    properties: {
        isBlocked: false,
        hasItem: false,

        blocktype: {
            'default': BlockType.None,
            type: BlockType
        },

        item: {
            'default': null,
            type: cc.Node
        }

    },

    // use this for initialization
    onLoad: function onLoad() {
        this.playerOnTop = false;
    },

    onStepCallback: function onStepCallback(player, game) {
        cc.log('M: onStepCallback Poison');
        console.log('DU WURDEST VERGIFTET');
        /*if(player.poisonTimer<6 || player.poisonTimer>6){
            console.log('Der Timer ist kleiner 6');
            if(!player.isPoisoned){
                console.log('Der Spieler ist noch nicht vergiftet');
                player.poisonTimer = 0;
            }
        }*/

        if (!player.isInvincible) player.isPoisoned = true;
    },

    collide: function collide() {}

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"States":"States","Types":"Types"}],"Spike":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e22c3Q4gXBNCp5WTGCtGqSz', 'Spike');
// scripts\gamefield\blocks\Spike.js

var alreadyKilled = false;

cc.Class({
    'extends': cc.Component,

    properties: {
        isDeadly: true
    },

    // foo: {
    //    default: null,      // The default value will be used only when the component attaching
    //                           to a node for the first time
    //    url: cc.Texture2D,  // optional, default is typeof default
    //    serializable: true, // optional, default is true
    //    visible: true,      // optional, default is true
    //    displayName: 'Foo', // optional
    //    readonly: false,    // optional, default is false
    // },
    // ...
    switchDeadly: function switchDeadly() {
        //console.log('isDeadly: ', this.isDeadly);
        this.isDeadly = !this.isDeadly;
        this.hasKilled = false;
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.isDeadly = true;
        this.playerOnTop = false;
    },

    onStepCallback: function onStepCallback(player, game) {
        this.player = player;
        this.playerOnTop = true;
        console.log('M: Onstep Spike');
        console.log('OnS isDeadly: ', this.isDeadly);
        if (!this.hasKilled) this.performSpikeKill();
    },

    performSpikeKill: function performSpikeKill() {
        if (!this.isDeadly && !this.player.isInvincible) {
            console.log('Uups, das war tötlich');
            if (!alreadyKilled) {
                this.player.kill();
                alreadyKilled = true;
            }
            this.hasKilled = true;
        } else {
            console.log('Glück gehabt');
        }
    },
    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (this.playerOnTop) this.performSpikeKill();
    }
});

cc._RFpop();
},{}],"States":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f8af3m3LglPNY34Ddb9VWD0', 'States');
// scripts\enums\States.js

var GameState = cc.Enum({
    None: 999,
    Idle: -1, // Waiting for Player to choose something in the menu
    Loading: -1, // Player pressed Start -> load game
    Waiting: -1, // Waiting for first move to start timers etc
    Playing: -1, // Game loaded and started
    GameOver: -1, //Player died
    Paused: -1, // Game was paused by the player
    Resumed: -1, // Game was resumed after pausing
    Ended: -1 });

// Game was closed by the player or he lost -> back to idle?
var PlayerMovementState = cc.Enum({
    Standing: -1, //Player is standing still (has fully arrived on a block)
    Jumping: -1, //Player is moving onto another block(in animation)
    Falling: -1 });

//Player is falling down the gamefield
var ItemState = cc.Enum({
    Pickable: -1,
    Blocked: -1,
    Picked: -1
});

var ItemActivityState = cc.Enum({
    Idle: -1,
    Active: -1,
    Expired: -1
});

var PlayerState = cc.Enum({
    Alive: -1,
    Dead: -1,
    Poisoned: -1,
    Invincible: -1
});

module.exports = {
    GameState: GameState,
    PlayerMovementState: PlayerMovementState,
    ItemState: ItemState,
    PlayerState: PlayerState,
    ItemActivityState: ItemActivityState
};

cc._RFpop();
},{}],"Switcher":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4323d4XJ4ZMiZ2wx+yx7E7n', 'Switcher');
// scripts\gamefield\blocks\Switcher.js

var BlockType = require('Types').BlockType;
var PlayerMovementState = require('States').PlayerMovementState;

cc.Class({
    'extends': cc.Component,

    properties: {
        isBlocked: false,
        hasItem: false,

        blocktype: {
            'default': BlockType.None,
            type: BlockType
        },

        item: {
            'default': null,
            type: cc.Node
        }

    },

    // use this for initialization
    onLoad: function onLoad() {
        this.playerOnTop = false;
    },

    onStepCallback: function onStepCallback(player, game) {
        cc.log('M: onStepCallback Switcher');
        player.isSwaped = true;
    },

    collide: function collide() {}

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"States":"States","Types":"Types"}],"Trapdoor":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1c710YvWvBAcqTBB0WMuN9v', 'Trapdoor');
// scripts\gamefield\blocks\Trapdoor.js

var BlockType = require('Types').BlockType;
var PlayerMovementState = require('States').PlayerMovementState;

cc.Class({
    'extends': cc.Component,

    properties: {
        isBlocked: false,
        hasItem: false,

        blocktype: {
            'default': BlockType.None,
            type: BlockType
        },

        item: {
            'default': null,
            type: cc.Node
        }

    },

    // use this for initialization
    onLoad: function onLoad() {
        this.playerOnTop = false;
    },

    onStepCallback: function onStepCallback(player, game) {
        var animCtrl = this.node.getComponent(cc.Animation);
        animCtrl.play('trapdoor');
        var fall = cc.moveTo(1, cc.p(this.node.getPositionX(), this.node.getPositionY() - 100));
        //var calLback = cc.callFunc(this.destroy, this);
        //this.node.runAction(cc.sequence(fall,calLback));
        this.node.runAction(fall);
        player.fall();
        //game.state = game.GameState.GameOver;
    },

    collide: function collide() {},

    destroy: function destroy() {
        this.node.destroy();
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"States":"States","Types":"Types"}],"Types":[function(require,module,exports){
"use strict";
cc._RFpush(module, '71b93SRN0BO1qKSq55EU/WI', 'Types');
// scripts\enums\Types.js

var ItemType = cc.Enum({
    None: 999,
    Star: -1, // Score
    Coin: -1, // Climb two(f.e.) rows up
    Antidote: -1, // Cures poison
    Blocker: -1,
    Slower: -1
});

var BlockType = cc.Enum({
    None: -1,
    Empty: -1,
    Dirt: -1,
    Grass: -1,
    Poison: -1,
    Switcher: -1,
    Trapdoor: -1,
    Spike: -1
});

module.exports = {
    ItemType: ItemType,
    BlockType: BlockType
};

cc._RFpop();
},{}],"WaterRight":[function(require,module,exports){
"use strict";
cc._RFpush(module, '96e20B9zFpCUKKVUnxPN/H9', 'WaterRight');
// scripts\gamefield\blocks\WaterRight.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.playerOnTop = false;
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}]},{},["Game","Block","MenuButtonCallbacks","Trapdoor","Switcher","Grass","GameButtonCallbacks","Types","CloudAnimation","Level","WaterRight","Item","Empty","Player","GameField","Poison","Spike","States","Dirt"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0RldmVsb3BtZW50L0NvY29zQ3JlYXRvci9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9CbG9jay5qcyIsImFzc2V0cy9zY3JpcHRzL3NjZW5lc2NyaXB0cy9DbG91ZEFuaW1hdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9ibG9ja3MvRGlydC5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9ibG9ja3MvRW1wdHkuanMiLCJhc3NldHMvc2NyaXB0cy9zY2VuZXNjcmlwdHMvR2FtZUJ1dHRvbkNhbGxiYWNrcy5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9HYW1lRmllbGQuanMiLCJhc3NldHMvc2NyaXB0cy9HYW1lLmpzIiwiYXNzZXRzL3NjcmlwdHMvZ2FtZWZpZWxkL2Jsb2Nrcy9HcmFzcy5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVvYmplY3RzL0l0ZW0uanMiLCJhc3NldHMvc2NyaXB0cy9nYW1lZmllbGQvTGV2ZWwuanMiLCJhc3NldHMvc2NyaXB0cy9zY2VuZXNjcmlwdHMvTWVudUJ1dHRvbkNhbGxiYWNrcy5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVvYmplY3RzL1BsYXllci5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9ibG9ja3MvUG9pc29uLmpzIiwiYXNzZXRzL3NjcmlwdHMvZ2FtZWZpZWxkL2Jsb2Nrcy9TcGlrZS5qcyIsImFzc2V0cy9zY3JpcHRzL2VudW1zL1N0YXRlcy5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9ibG9ja3MvU3dpdGNoZXIuanMiLCJhc3NldHMvc2NyaXB0cy9nYW1lZmllbGQvYmxvY2tzL1RyYXBkb29yLmpzIiwiYXNzZXRzL3NjcmlwdHMvZW51bXMvVHlwZXMuanMiLCJhc3NldHMvc2NyaXB0cy9nYW1lZmllbGQvYmxvY2tzL1dhdGVyUmlnaHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3R1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzBjZjgwdmE0aUpDWFpEWGJTd2dZMW1tJywgJ0Jsb2NrJyk7XG4vLyBzY3JpcHRzXFxnYW1lZmllbGRcXEJsb2NrLmpzXG5cbnZhciBCbG9ja1R5cGUgPSByZXF1aXJlKCdUeXBlcycpLkJsb2NrVHlwZTtcbnZhciBQbGF5ZXJNb3ZlbWVudFN0YXRlID0gcmVxdWlyZSgnU3RhdGVzJykuUGxheWVyTW92ZW1lbnRTdGF0ZTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpc0Jsb2NrZWQ6IGZhbHNlLFxuICAgICAgICBoYXNJdGVtOiBmYWxzZSxcblxuICAgICAgICBibG9ja3R5cGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogQmxvY2tUeXBlLk5vbmUsXG4gICAgICAgICAgICB0eXBlOiBCbG9ja1R5cGVcbiAgICAgICAgfSxcblxuICAgICAgICBpdGVtOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcblxuICAgIC8vV2hhdCBoYXBwZW5zIGlmIHlvdSBzdGVwIG9uIGEgYmxvY2tcbiAgICBvblN0ZXBDYWxsYmFjazogZnVuY3Rpb24gb25TdGVwQ2FsbGJhY2socGxheWVyKSB7XG4gICAgICAgIC8vIFBlcmZvcm0gdGhlIGFjdGlvbiB0aGUgYmxvY2sgcHJvZHVjZXMoY2hhbmdlIHBsYXllciBvciBlbnZpcm9ubWVudClcbiAgICAgICAgc3dpdGNoICh0aGlzLmJsb2NrdHlwZSkge1xuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuRW1wdHk6XG4gICAgICAgICAgICAgICAgcGxheWVyLmZhbGwoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBlcmZvcm0gYmxvY2sgYW5pbWF0aW9uXG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24odGhpcy5hc3NlbWJsZUJsb2NrQWN0aW9uKCkpO1xuICAgIH0sXG5cbiAgICAvLyBBY3Rpb24oQW5pbWF0aW9uIGV0YykgZm9yIGV2ZXJ5IGJsb2NrXG4gICAgYXNzZW1ibGVCbG9ja0FjdGlvbjogZnVuY3Rpb24gYXNzZW1ibGVCbG9ja0FjdGlvbigpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmJsb2NrdHlwZSkge1xuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuRW1wdHk6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNjLm1vdmVUbygwLCB0aGlzLm5vZGUuZ2V0UG9zaXRpb24oKSk7XG5cbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLlRyYXBkb3I6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNjLm1vdmVUbygxLCBjYy5wKHRoaXMubm9kZS5nZXRQb3NpdGlvblgoKSwgdGhpcy5ub2RlLmdldFBvc2l0aW9uWSgpIC0gMTAwKSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gUGFydCBvZiBhbmltYXRpb24gc2VlIGFib3ZlXG4gICAgZGVmb3JtOiBmdW5jdGlvbiBkZWZvcm0oKSB7fSxcblxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgfSxcblxuICAgIHNldEJsb2NrZWQ6IGZ1bmN0aW9uIHNldEJsb2NrZWQoYm9vbCkge1xuICAgICAgICB0aGlzLmlzQmxvY2tlZCA9IGJvb2w7XG4gICAgfSxcblxuICAgIGlzQmxvY2tlZDogZnVuY3Rpb24gaXNCbG9ja2VkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0Jsb2NrZWQ7XG4gICAgfVxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzcyODhmanNpWEZBbEwrTGlHZW5ROE9yJywgJ0Nsb3VkQW5pbWF0aW9uJyk7XG4vLyBzY3JpcHRzXFxzY2VuZXNjcmlwdHNcXENsb3VkQW5pbWF0aW9uLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdmZTEzYzZqaTkxSUdLQWFEMWNHcGZTSycsICdEaXJ0Jyk7XG4vLyBzY3JpcHRzXFxnYW1lZmllbGRcXGJsb2Nrc1xcRGlydC5qc1xuXG52YXIgQmxvY2tUeXBlID0gcmVxdWlyZSgnVHlwZXMnKS5CbG9ja1R5cGU7XG52YXIgUGxheWVyTW92ZW1lbnRTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLlBsYXllck1vdmVtZW50U3RhdGU7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaXNCbG9ja2VkOiBmYWxzZSxcbiAgICAgICAgaGFzSXRlbTogZmFsc2UsXG5cbiAgICAgICAgYmxvY2t0eXBlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IEJsb2NrVHlwZS5Ob25lLFxuICAgICAgICAgICAgdHlwZTogQmxvY2tUeXBlXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXRlbToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMucGxheWVyT25Ub3AgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgb25TdGVwQ2FsbGJhY2s6IGZ1bmN0aW9uIG9uU3RlcENhbGxiYWNrKHBsYXllciwgZ2FtZSkge1xuICAgICAgICBjYy5sb2coJ006IG9uU3RlcENhbGxiYWNrIERpcnQnKTtcbiAgICB9LFxuXG4gICAgY29sbGlkZTogZnVuY3Rpb24gY29sbGlkZSgpIHt9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdiZWVhZlFqMUxoSGtMREVraHpEVjMrMCcsICdFbXB0eScpO1xuLy8gc2NyaXB0c1xcZ2FtZWZpZWxkXFxibG9ja3NcXEVtcHR5LmpzXG5cbnZhciBCbG9ja1R5cGUgPSByZXF1aXJlKCdUeXBlcycpLkJsb2NrVHlwZTtcbnZhciBQbGF5ZXJNb3ZlbWVudFN0YXRlID0gcmVxdWlyZSgnU3RhdGVzJykuUGxheWVyTW92ZW1lbnRTdGF0ZTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvKmdhbWVmaWVsZDoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlLFxyXG4gICAgICAgIH0sKi9cblxuICAgICAgICBpc0Jsb2NrZWQ6IGZhbHNlLFxuICAgICAgICBoYXNJdGVtOiBmYWxzZSxcblxuICAgICAgICBibG9ja3R5cGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogQmxvY2tUeXBlLk5vbmUsXG4gICAgICAgICAgICB0eXBlOiBCbG9ja1R5cGVcbiAgICAgICAgfSxcblxuICAgICAgICBpdGVtOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJPblRvcCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBvblN0ZXBDYWxsYmFjazogZnVuY3Rpb24gb25TdGVwQ2FsbGJhY2socGxheWVyLCBnYW1lKSB7XG4gICAgICAgIC8vIFBlcmZvcm0gdGhlIGFjdGlvbiB0aGUgYmxvY2sgcHJvZHVjZXMoY2hhbmdlIHBsYXllciBvciBlbnZpcm9ubWVudClcbiAgICAgICAgcGxheWVyLmZhbGwoKTtcbiAgICB9LFxuXG4gICAgY29sbGlkZTogZnVuY3Rpb24gY29sbGlkZSgpIHtcbiAgICAgICAgY2MubG9nKCd3aXIgc2luZCBpbiBkZXIgTWV0aG9kZScpO1xuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzY5ZTc2OTA4MXhHTmJEWkJtckRSTEZ1JywgJ0dhbWVCdXR0b25DYWxsYmFja3MnKTtcbi8vIHNjcmlwdHNcXHNjZW5lc2NyaXB0c1xcR2FtZUJ1dHRvbkNhbGxiYWNrcy5qc1xuXG52YXIgR2FtZVN0YXRlID0gcmVxdWlyZSgnU3RhdGVzJykuR2FtZVN0YXRlO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHBhdXNlT3ZlcmxheToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIHNjb3JlTGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgYnV0dG9uQXVkaW86IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2FtZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIC8qaWYoZ2FtZSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLnNjb3JlTGFiZWwuc3RyaW5nID0gXCJTY29yZTogXCIrZ2FtZS5nZXRDb21wb25lbnQoJ0dhbWUnKS5zY29yZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAqL1xuICAgICAgICB0aGlzLnNjb3JlID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzY29yZScpO1xuICAgICAgICBjb25zb2xlLmxvZygnU2NvcmUgaW4gR2FtZUJ1dHRvbkNhbGxiYWNrOiAnLCB0aGlzLnNjb3JlKTtcbiAgICAgICAgaWYgKHRoaXMuc2NvcmVMYWJlbCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NDT1JFTEFCRUwnKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc2NvcmVMYWJlbCk7XG4gICAgICAgICAgICB0aGlzLnNjb3JlTGFiZWwuc3RyaW5nID0gXCJTY29yZTogXCIgKyB0aGlzLnNjb3JlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZTsgLy8gVE9ETzogc3ByZWFkIHRoaXMgdG8gdGhlIG91dGVyIHdvcmxkXG4gICAgfSxcblxuICAgIHBhdXNlQ29udHJvbENhbGxiYWNrOiBmdW5jdGlvbiBwYXVzZUNvbnRyb2xDYWxsYmFjaygpIHtcbiAgICAgICAgLy9UT0RPOiBjaGFuZ2UgcGF1c2UgYnV0dG9uIHRvIGRpZmZlcmVudCBzcHJpdGVcbiAgICAgICAgaWYgKHRoaXMucGF1c2VkKSB7XG4gICAgICAgICAgICB0aGlzLnBhdXNlT3ZlcmxheS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLnJlc3VtZSgpO1xuICAgICAgICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5zdGF0ZSA9IEdhbWVTdGF0ZS5QbGF5aW5nO1xuXG4gICAgICAgICAgICBjYy5sb2coXCJyZXN1bWVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhdXNlT3ZlcmxheS5vcGFjaXR5ID0gMjU1O1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IucGF1c2UoKTtcbiAgICAgICAgICAgIHRoaXMucGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5zdGF0ZSA9IEdhbWVTdGF0ZS5QYXVzZWQ7XG4gICAgICAgICAgICBjYy5sb2coXCJwYXVzZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuYnV0dG9uQXVkaW8sIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgYWdhaW5Db250cm9sQ2FsbGJhY2s6IGZ1bmN0aW9uIGFnYWluQ29udHJvbENhbGxiYWNrKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ0dhbWVTY2VuZScpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuYnV0dG9uQXVkaW8sIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgYmFja0NvbnRyb2xDYWxsYmFjazogZnVuY3Rpb24gYmFja0NvbnRyb2xDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlID0gR2FtZVN0YXRlLkVuZGVkO1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ1N0YXJ0bWVudScpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuYnV0dG9uQXVkaW8sIGZhbHNlKTtcbiAgICB9XG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZTAwMWYrbU1XTk41WWhYeWtMZE1GTFonLCAnR2FtZUZpZWxkJyk7XG4vLyBzY3JpcHRzXFxnYW1lZmllbGRcXEdhbWVGaWVsZC5qc1xuXG4vL0dhbWVGaWVsZFxuXG52YXIgTGV2ZWwgPSByZXF1aXJlKCdMZXZlbCcpO1xudmFyIEJsb2NrVHlwZSA9IHJlcXVpcmUoJ1R5cGVzJykuQmxvY2tUeXBlO1xudmFyIEl0ZW1UeXBlID0gcmVxdWlyZSgnVHlwZXMnKS5JdGVtVHlwZTtcbnZhciBHYW1lU3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5HYW1lU3RhdGU7XG5cbnZhciBzdGFydFggPSAxMTM7XG52YXIgc3RhcnRZID0gNTAxO1xuXG52YXIgZGlzdFggPSA4MztcbnZhciBkaXN0WSA9IDY1O1xuXG52YXIgc3Bhd25PZmZTZXRZID0gMjAwO1xudmFyIGRlc3Bhd25PZmZTZXRZID0gLTEwMDtcbnZhciB5U3Bhd25Qb3NpdGlvbiA9IDQ4NTtcblxudmFyIHN0YXJ0RmllbGQgPSBbWzcsIDEsIDIsIDIsIDEsIDddLCBbNywgMSwgNSwgMSwgMiwgMSwgN10sIFs3LCAyLCAxLCAxLCAyLCA3XSwgWzcsIDIsIDEsIDEsIDEsIDIsIDddLCBbNywgMiwgMSwgMSwgMiwgN10sIFs3LCAxLCAyLCAxLCA1LCAxLCA3XSwgWzcsIDEsIDIsIDIsIDEsIDddLCBbNywgMSwgMSwgMiwgMSwgMSwgN11cbi8qWzcsMSwxLDEsMSwwXSxcclxuIFs3LDEsMSwxLDEsMSwwXSxcclxuIFs3LDEsMSw0LDQsNV0sXHJcbiBbNywxLDEsMSw1LDEsMF0sXHJcbiBbNywxLDEsMSwxLDBdLFxyXG4gWzcsNSw2LDMsMSwxLDBdLFxyXG4gWzcsMSwxLDUsMSwwXSxcclxuIFs3LDEsMSwxLDEsMSwwXSwqL1xuXTtcblxuLy9BcnJheSBmb3IgZWFjaCBpbmRpdmlkdWFsIGJsb2NrXG52YXIgcHVmZmVyRmllbGQgPSBbWzcsIDEsIDYsIDYsIDYsIDEsIDddLCBbNywgMSwgMiwgMiwgMSwgN10sIFs3LCAxLCAzLCAxLCAzLCAxLCA3XSwgWzcsIDEsIDIsIDIsIDEsIDddLCBbNywgMSwgMiwgMSwgMiwgMSwgN10sIFs3LCAzLCAyLCAyLCAzLCA3XSwgWzcsIDcsIDEsIDEsIDEsIDcsIDddLCBbNywgMSwgMSwgNCwgNCwgN10sIFs3LCA0LCAxLCA0LCAxLCA0LCA3XSwgWzcsIDQsIDEsIDEsIDEsIDddLCBbNywgNCwgMSwgMSwgMSwgMSwgN10sIFs3LCA1LCAxLCA1LCAxLCA3XSwgWzcsIDEsIDEsIDEsIDEsIDEsIDddLCBbNywgMSwgMSwgMSwgMSwgN10sIFs3LCA2LCAxLCAxLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddXTtcbi8qXHJcbiBUaGUgaXRlbXMtYXJyYXkgaGFzIHRoZSBzYW1lIGRpbWVuc2lvbnMgYXMgdGhlIHN0YXJ0RmllbGQuIEVhY2ggaXRlbSB3aWxsIGJlIGEgY2hpbGQgb2YgdGhlIGNvcnJlc3BvbmRpbmcgYmxvY2sgKHNlZW4gYXMgYSBsYXlvdmVyKS5cclxuIC8vIDAuRW1wdHksIDEuYW50aWRvdGVMZWZ0LCAyLmFudGlkb3RlUmlnaHQsIDMuY29pbkxlZnQsIDQuY29pblJpZ2h0LCA1LnN0YXJMZWZ0LFxyXG4gLy8gNi5zdGFyUmlnaHQsIDcuQmxvY2tlZEJ1c2gsIDguQmxvY2tlZFN0b25lLCA5LlNsb3dEb3duQm90dG9tLCA5LlNsb3dEb3duVG9wXHJcbiAvL1RPRE86IDEwLldhdGVyTGVmdCwgMTEuV2F0ZXJSaWdodCAqL1xudmFyIHN0YXJ0RmllbGRJdGVtcyA9IFtbMCwgOCwgMCwgMCwgOCwgMF0sIFswLCA4LCAwLCA3LCAwLCA4LCAwXSwgWzAsIDAsIDcsIDcsIDIsIDBdLCBbMCwgNiwgNywgNywgNywgMCwgMF0sIFswLCAwLCA3LCA3LCAwLCAwXSwgWzAsIDcsIDQsIDcsIDAsIDcsIDBdLCBbMCwgNywgMCwgMCwgNywgMF0sIFswLCA4LCA4LCAwLCA4LCA4LCAwXV07XG5cbi8qXHJcbiBUaGUgaXRlbXMtYXJyYXkgaGFzIHRoZSBzYW1lIGRpbWVuc2lvbnMgYXMgdGhlIHB1ZmZlckZpZWxkLiBFYWNoIGl0ZW0gd2lsbCBiZSBhIGNoaWxkIG9mIHRoZSBjb3JyZXNwb25kaW5nIGJsb2NrIChzZWVuIGFzIGEgbGF5b3ZlcikuXHJcbiAvLyAwLkVtcHR5LCAxLmFudGlkb3RlTGVmdCwgMi5hbnRpZG90ZVJpZ2h0LCAzLmNvaW5MZWZ0LCA0LmNvaW5SaWdodCwgNS5zdGFyTGVmdCxcclxuIC8vIDYuc3RhclJpZ2h0LCA3LkJsb2NrZWRCdXNoLCA4LkJsb2NrZWRTdG9uZSwgOS5TbG93RG93bkJvdHRvbSwgOS5TbG93RG93blRvcFxyXG4gLy9UT0RPOiAxMC5XYXRlckxlZnQsIDExLldhdGVyUmlnaHQgKi9cbnZhciBwdWZmZXJGaWVsZEl0ZW1zID0gW1swLCA4LCAwLCAwLCAwLCA4LCAwXSwgWzAsIDgsIDAsIDAsIDgsIDBdLCBbMCwgOCwgMCwgMCwgMCwgOCwgMF0sIFswLCA4LCAwLCAwLCA4LCAwXSwgWzAsIDgsIDAsIDcsIDAsIDgsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCA5LCA3LCA5LCAwLCAwXSwgWzAsIDksIDcsIDAsIDAsIDBdLCBbMCwgMCwgNywgMCwgNywgMCwgMF0sIFswLCAwLCA3LCA5LCA5LCAwXSwgWzAsIDAsIDcsIDcsIDAsIDcsIDBdLCBbMCwgMCwgNywgMCwgOCwgMF0sIFswLCAwLCAwLCAwLCAwLCA3LCAwXSwgWzAsIDAsIDAsIDcsIDAsIDBdLCBbMCwgMCwgNywgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAyLCAwLCAwXV07XG5cbnZhciBuZXh0Rmlyc3RMaW5lID0gMDtcbnZhciBuZXh0Rmlyc3RMaW5lSXRlbSA9IDA7XG5cbnZhciBuZXdDdWJlID0gbnVsbDtcbnZhciBuZXdJdGVtID0gbnVsbDtcblxuY2MuQ2xhc3Moe1xuXHQnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuXHRwcm9wZXJ0aWVzOiB7XG5cdFx0Z3JpZFNpemVYOiAwLCAvLyBSb3dzIC0gZG9udCBjaGFuZ2UgaGVyZSBidXQgaW4gY29jb3MgY3JlYXRvciEhXG5cdFx0Z3JpZFNpemVZOiAwLCAvLyBDb2x1bW5zXG5cblx0XHRkZXNwYXduSGVpZ2h0OiAwLFxuXG5cdFx0aXRlbToge1xuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuTm9kZVxuXHRcdH0sXG5cblx0XHQvL0Jsb2NrcyBzdGFydCBoZXJlXG5cdFx0RW1wdHk6IHsgLy8wXHRcdEVNUFRZXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdEdyYXNzOiB7IC8vMVx0XHRHUkFTU1xuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHREaXJ0OiB7IC8vMlx0XHRESVJUXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdFRyYXBkb29yOiB7IC8vM1x0XHRUUkFQRE9PUlxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRTd2l0Y2hlcjogeyAvLzRcdFx0U1dJVENIRVJcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0UG9pc29uOiB7IC8vNVx0XHRQT0lTT05cblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0U3Bpa2U6IHsgLy82XHRcdFNQSUtFXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdFdhdGVyQzogeyAvLzdcdFx0V0FURVIgKExpa2UgRU1QVFkpXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXG5cdFx0Ly8gR2FtZSByZWZlcmVuY2UgdG8gcGFzcyBmaWVsZFxuXHRcdGdhbWU6IHtcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLk5vZGVcblx0XHR9LFxuXG5cdFx0Ly9JdGVtcyBzdGFydCBoZXJlXG5cdFx0Ly8gMC5FbXB0eSwgMS5hbnRpZG90ZUxlZnQsIDIuYW50aWRvdGVSaWdodCwgMy5jb2luTGVmdCwgNC5jb2luUmlnaHQsIDUuc3RhckxlZnQsXG5cdFx0Ly8gNi5zdGFyUmlnaHQsIDcuQmxvY2tlZEJ1c2gsIDguQmxvY2tlZFN0b25lLCA5LlNsb3dEb3duQm90dG9tLCA5LlNsb3dEb3duVG9wXG5cdFx0Ly9UT0RPOiAxMC5XYXRlckxlZnQsIDExLldhdGVyUmlnaHRcblx0XHRBbnRpZG90ZUw6IHsgLy8xXHRcdEFudGlkb3RlTFxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRBbnRpZG90ZVI6IHsgLy8yXHRcdEFudGlkb3RlUlxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRDb2luTDogeyAvLzNcdFx0Q29pbkxcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0Q29pblI6IHsgLy80XHRcdENvaW5SXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdFN0YXJMOiB7IC8vNVx0XHRTdGFyTFxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRTdGFyUjogeyAvLzZcdFx0U3RhclJcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cblx0XHRCbG9ja2VkQnVzaDogeyAvLzdcdFx0QmxvY2tlZEJ1c2hcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0QmxvY2tlZFN0b25lOiB7IC8vOFx0XHRCbG9ja2VkU3RvbmVcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0U2xvd0Rvd25Cb3R0b206IHsgLy85XHRcdFNsb3dEb3duQm90dG9tIChCb3R0b20gYW5kIFRvcCBhcmUgYWx3YXlzIHRvZ2V0aGVyKVxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRTbG93RG93blRvcDogeyAvLzlcdFx0U2xvd0Rvd25Ub3AgKEJvdHRvbSBhbmQgVG9wIGFyZSBhbHdheXMgdG9nZXRoZXIpXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdC8qXHJcbiAgIFdhdGVyTGVmdDoge1x0XHRcdFx0XHRcdC8vMTBcdFx0V2F0ZXJMZWZ0XHJcbiAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgIHR5cGU6IGNjLlByZWZhYixcclxuICAgfSwqL1xuXHRcdFdhdGVyUmlnaHQ6IHsgLy8xMVx0XHRXYXRlclJpZ2h0XG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9XG5cblx0fSxcblxuXHQvL1BsYXllclxuXHQvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cblx0b25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG5cdFx0Ly9yZWdpc3RlciBnYW1lZmllbGQgYXQgZ2FtZSBmb3IgcHJvY2Vzc2luZyBnYW1lZmllbGQgbG9naWNcblx0XHR0aGlzLmdhbWUuZ2V0Q29tcG9uZW50KCdHYW1lJykuZ2FtZWZpZWxkID0gdGhpcztcblxuXHRcdHRoaXMucGxheWVyID0gbnVsbDsgLy8gbG9hZCBsYXRlciB3aGVuIHBsYXllciByYW4gb25Mb2FkKClcblx0XHR0aGlzLmNvdW50ID0gMDtcblx0XHR0aGlzLmdhbWVGaWVsZCA9IFtdO1xuXHRcdHRoaXMuaXRlbXMgPSBbXTtcblxuXHRcdHRoaXMuZGlzVFggPSBkaXN0WDtcblx0XHR0aGlzLmRpc1RZID0gZGlzdFk7XG5cdFx0dGhpcy5yZXNldEFycmF5cygpO1xuXHRcdHRoaXMuaW5pdGlhbGl6ZUZpZWxkKCk7XG5cblx0XHR0aGlzLmdhbWUuZ2V0Q29tcG9uZW50KCdHYW1lJykub25HYW1lRmllbGRMb2FkQ2FsbGJhY2soKTtcblx0fSxcblxuXHRyZXNldEFycmF5czogZnVuY3Rpb24gcmVzZXRBcnJheXMoKSB7XG5cdFx0bmV4dEZpcnN0TGluZSA9IDA7XG5cdFx0bmV4dEZpcnN0TGluZUl0ZW0gPSAwO1xuXHRcdHB1ZmZlckZpZWxkID0gW1s3LCAxLCA2LCA2LCA2LCAxLCA3XSwgWzcsIDEsIDIsIDIsIDEsIDddLCBbNywgMSwgMywgMSwgMywgMSwgN10sIFs3LCAxLCAyLCAyLCAxLCA3XSwgWzcsIDEsIDIsIDEsIDIsIDEsIDddLCBbNywgMywgMiwgMiwgMywgN10sIFs3LCA3LCAxLCAxLCAxLCA3LCA3XSwgWzcsIDEsIDEsIDQsIDQsIDddLCBbNywgNCwgMSwgNCwgMSwgNCwgN10sIFs3LCA0LCAxLCAxLCAxLCA3XSwgWzcsIDQsIDEsIDEsIDEsIDEsIDddLCBbNywgNSwgMSwgNSwgMSwgN10sIFs3LCAxLCAxLCAxLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddLCBbNywgNiwgMSwgMSwgMSwgMSwgN10sIFs3LCAxLCAxLCAxLCAxLCA3XV07XG5cdFx0cHVmZmVyRmllbGRJdGVtcyA9IFtbMCwgOCwgMCwgMCwgMCwgOCwgMF0sIFswLCA4LCAwLCAwLCA4LCAwXSwgWzAsIDgsIDAsIDAsIDAsIDgsIDBdLCBbMCwgOCwgMCwgMCwgOCwgMF0sIFswLCA4LCAwLCA3LCAwLCA4LCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgOSwgNywgOSwgMCwgMF0sIFswLCA5LCA3LCAwLCAwLCAwXSwgWzAsIDAsIDcsIDAsIDcsIDAsIDBdLCBbMCwgMCwgNywgOSwgOSwgMF0sIFswLCAwLCA3LCA3LCAwLCA3LCAwXSwgWzAsIDAsIDcsIDAsIDgsIDBdLCBbMCwgMCwgMCwgMCwgMCwgNywgMF0sIFswLCAwLCAwLCA3LCAwLCAwXSwgWzAsIDAsIDcsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMiwgMCwgMF1dO1xuXHR9LFxuXG5cdGluaXRpYWxpemVGaWVsZDogZnVuY3Rpb24gaW5pdGlhbGl6ZUZpZWxkKCkge1xuXG5cdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCBzdGFydEZpZWxkLmxlbmd0aDsgeSsrKSB7XG5cdFx0XHR0aGlzLmdhbWVGaWVsZFt5XSA9IFtdO1xuXHRcdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBzdGFydEZpZWxkW3ldLmxlbmd0aDsgeCsrKSB7XG5cdFx0XHRcdGlmIChzdGFydEZpZWxkW3ldLmxlbmd0aCAlIDIgPT09IDApIHtcblx0XHRcdFx0XHRuZXdDdWJlID0gdGhpcy5zcGF3bkN1YmUoc3RhcnRYICsgeCAqIGRpc3RYLCBzdGFydFkgLSBkaXN0WSAqIHksIHN0YXJ0RmllbGRbeV1beF0sIHN0YXJ0RmllbGRJdGVtc1t5XVt4XSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmV3Q3ViZSA9IHRoaXMuc3Bhd25DdWJlKHN0YXJ0WCArIHggKiBkaXN0WCAtIGRpc3RYIC8gMiwgc3RhcnRZIC0gZGlzdFkgKiB5LCBzdGFydEZpZWxkW3ldW3hdLCBzdGFydEZpZWxkSXRlbXNbeV1beF0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vY2MubG9nKCdBZGRpbmcgbmV3IGN1YmU6ICcpO1xuXHRcdFx0XHQvL2NjLmxvZyhuZXdDdWJlKTtcblx0XHRcdFx0dGhpcy5nYW1lRmllbGRbeV1beF0gPSBuZXdDdWJlO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHQvKiBEaXNwbGFjZXMgdGhlIGVudGlyZSBnYW1lZmllbGQgYnkgKlNwZWVkKi1QaXhlbFxyXG4gICogSW4gY2FzZSBib3JkZXIgaXMgY3Jvc3NlZCAtPiBkZWxldGUgbG93ZXN0IHJvdyAqL1xuXHR1cGRhdGVGaWVsZDogZnVuY3Rpb24gdXBkYXRlRmllbGQoc3BlZWQpIHtcblx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuZ2FtZUZpZWxkLmxlbmd0aDsgeSsrKSB7XG5cdFx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuZ2FtZUZpZWxkW3ldLmxlbmd0aDsgeCsrKSB7XG5cdFx0XHRcdHZhciBwb3NYID0gdGhpcy5nYW1lRmllbGRbeV1beF0uZ2V0UG9zaXRpb25YKCk7XG5cdFx0XHRcdHZhciBwb3NZID0gdGhpcy5nYW1lRmllbGRbeV1beF0uZ2V0UG9zaXRpb25ZKCk7XG5cdFx0XHRcdHRoaXMuZ2FtZUZpZWxkW3ldW3hdLnNldFBvc2l0aW9uKHBvc1gsIHBvc1kgKyBzcGVlZCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMudXBkYXRlUGxheWVyKHNwZWVkKTtcblx0XHQvKnZhciBmaWVsZHggPSAgdGhpcy5ub2RlLmdldFBvc2l0aW9uWCgpOyAvL0JVR0dZXHJcbiAgdmFyIGZpZWxkeSA9IHRoaXMubm9kZS5nZXRQb3NpdGlvblkoKTtcclxuICB0aGlzLm5vZGUuc2V0UG9zaXRpb24oZmllbGR4LCBmaWVsZHkrc3BlZWQpOyAqL1xuXHRcdC8vV0VOTiBHUkVOWkUgVUVCRVJTQ0hSSVRURU47IERBTk4gV0lSRCBaRUlMRSBHRUzDllNDSFRcblx0XHRpZiAodGhpcy5nYW1lRmllbGRbdGhpcy5nYW1lRmllbGQubGVuZ3RoIC0gMV1bMF0uZ2V0UG9zaXRpb25ZKCkgPD0gdGhpcy5kZXNwYXduSGVpZ2h0KSB7XG5cdFx0XHRjYy5sb2coJ1dJUiBTSU5EIFpVIFdFSVQhJyk7XG5cdFx0XHR0aGlzLmRlc3Ryb3lMaW5lKHRoaXMuZ2FtZUZpZWxkLmxlbmd0aCAtIDEpO1xuXHRcdFx0dGhpcy5yZWFycmFuZ2VHYW1lRmllbGQoKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH0sXG5cblx0dXBkYXRlUGxheWVyOiBmdW5jdGlvbiB1cGRhdGVQbGF5ZXIoc3BlZWQpIHtcblx0XHR2YXIgeCA9IHRoaXMucGxheWVyLm5vZGUuZ2V0UG9zaXRpb25YKCk7XG5cdFx0dmFyIHkgPSB0aGlzLnBsYXllci5ub2RlLmdldFBvc2l0aW9uWSgpO1xuXHRcdHRoaXMucGxheWVyLm5vZGUuc2V0UG9zaXRpb24oeCwgeSArIHNwZWVkKTtcblx0fSxcblxuXHR1cGRhdGVQbGF5ZXJBcnJheVBvczogZnVuY3Rpb24gdXBkYXRlUGxheWVyQXJyYXlQb3MoKSB7XG5cblx0XHRpZiAodGhpcy5nYW1lRmllbGRbdGhpcy5wbGF5ZXIuYXJyYXlQb3NZXS5sZW5ndGggJSAyID09IDApIHtcblx0XHRcdGlmICh0aGlzLnBsYXllci5kaXIgPCAwKSB7XG5cdFx0XHRcdHRoaXMucGxheWVyLmFycmF5UG9zWCA9IHRoaXMucGxheWVyLmFycmF5UG9zWCArIDE7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICh0aGlzLnBsYXllci5kaXIgPiAwKSB7XG5cdFx0XHRcdHRoaXMucGxheWVyLmFycmF5UG9zWCA9IHRoaXMucGxheWVyLmFycmF5UG9zWCAtIDE7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5wbGF5ZXIuYXJyYXlQb3NZID0gdGhpcy5wbGF5ZXIuYXJyYXlQb3NZIC0gMTtcblx0fSxcblxuXHRnZXRTdGFydFBvc2l0aW9uOiBmdW5jdGlvbiBnZXRTdGFydFBvc2l0aW9uKCkge1xuXHRcdHZhciBtaWQgPSBNYXRoLnJvdW5kKE51bWJlcih0aGlzLmdhbWVGaWVsZFt0aGlzLmdhbWVGaWVsZC5sZW5ndGggLSAxXS5sZW5ndGggLyAyKSkgLSAxO1xuXHRcdHZhciBzdGFydEZpZWxkID0gdGhpcy5nYW1lRmllbGRbdGhpcy5nYW1lRmllbGQubGVuZ3RoIC0gMV1bbWlkXTtcblx0XHQvL1RPRE86IG1vdmUgdGhpcyBtb3JlIHN1aXRhYmxlXG5cdFx0dGhpcy5wbGF5ZXIuYXJyYXlQb3NYID0gbWlkO1xuXHRcdHRoaXMucGxheWVyLmFycmF5UG9zWSA9IHRoaXMuZ2FtZUZpZWxkLmxlbmd0aCAtIDE7XG5cdFx0dGhpcy5wbGF5ZXIub2xkRGVzdCA9IHN0YXJ0RmllbGQ7XG5cdFx0dmFyIHN0YXJ0cG9zID0gY2MucChzdGFydEZpZWxkLmdldFBvc2l0aW9uWCgpLCBzdGFydEZpZWxkLmdldFBvc2l0aW9uWSgpICsgdGhpcy5wbGF5ZXIub2Zmc2V0WSk7XG5cdFx0cmV0dXJuIHN0YXJ0cG9zO1xuXHR9LFxuXG5cdGdldEp1bXBGaWVsZDogZnVuY3Rpb24gZ2V0SnVtcEZpZWxkKGRpcikge1xuXHRcdGlmICh0aGlzLmdhbWVGaWVsZFt0aGlzLnBsYXllci5hcnJheVBvc1ldLmxlbmd0aCAlIDIgPT0gMCkge1xuXHRcdFx0aWYgKGRpciA+IDApIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2FtZUZpZWxkW3RoaXMucGxheWVyLmFycmF5UG9zWSAtIDFdW3RoaXMucGxheWVyLmFycmF5UG9zWF07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5nYW1lRmllbGRbdGhpcy5wbGF5ZXIuYXJyYXlQb3NZIC0gMV1bdGhpcy5wbGF5ZXIuYXJyYXlQb3NYICsgMV07XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChkaXIgPiAwKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmdhbWVGaWVsZFt0aGlzLnBsYXllci5hcnJheVBvc1kgLSAxXVt0aGlzLnBsYXllci5hcnJheVBvc1ggLSAxXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmdhbWVGaWVsZFt0aGlzLnBsYXllci5hcnJheVBvc1kgLSAxXVt0aGlzLnBsYXllci5hcnJheVBvc1hdO1xuXHRcdFx0fVxuXHRcdH1cblx0fSxcblxuXHQvL1RPRE86IGRlc3Ryb3kgaXRlbXMgb24gdGhhdCBsaW5lXG5cdGRlc3Ryb3lMaW5lOiBmdW5jdGlvbiBkZXN0cm95TGluZShsaW5lKSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdhbWVGaWVsZFtsaW5lXS5sZW5ndGg7IGkrKykge1xuXHRcdFx0Ly90aGlzLmdhbWVGaWVsZFtsaW5lXVtpXS5kZXN0cm95KCk7XG5cdFx0XHR0aGlzLmRlc3Ryb3lCbG9jayh0aGlzLmdhbWVGaWVsZFtsaW5lXVtpXSk7XG5cdFx0fVxuXHR9LFxuXG5cdGRlc3Ryb3lCbG9jazogZnVuY3Rpb24gZGVzdHJveUJsb2NrKGJsb2NrKSB7XG5cdFx0dmFyIGZhbGwgPSBjYy5tb3ZlVG8oMSwgY2MucChibG9jay5nZXRQb3NpdGlvbigpLngsIGRlc3Bhd25PZmZTZXRZKSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbkluKCkpO1xuXHRcdHZhciBmYWRlID0gY2MuZmFkZU91dCgxLjUpO1xuXHRcdGJsb2NrLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy5zcGF3bihmYWxsLCBmYWRlKSwgY2MuY2FsbEZ1bmModGhpcy5kZXN0cm95QmxvY2tEYXRhLCB0aGlzKSkpO1xuXHR9LFxuXG5cdGRlc3Ryb3lCbG9ja0RhdGE6IGZ1bmN0aW9uIGRlc3Ryb3lCbG9ja0RhdGEoYmxvY2spIHtcblx0XHRibG9jay5kZXN0cm95KCk7XG5cdH0sXG5cblx0cmVhcnJhbmdlR2FtZUZpZWxkOiBmdW5jdGlvbiByZWFycmFuZ2VHYW1lRmllbGQoKSB7XG5cdFx0Ly9jYy5sb2coJ006IHJlYXJyYW5nZUdhbWVGaWVsZCcpXG5cdFx0dmFyIHJldHVybkEgPSBbXTtcblx0XHR2YXIgeCA9IHRoaXMuZ2FtZUZpZWxkWzFdWzBdLmdldFBvc2l0aW9uWCgpO1xuXHRcdHJldHVybkFbMF0gPSB0aGlzLmNyZWF0ZUZpcnN0TGluZSh4KTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZ2FtZUZpZWxkLmxlbmd0aCAtIDE7IGkrKykge1xuXHRcdFx0cmV0dXJuQVtpICsgMV0gPSB0aGlzLmdhbWVGaWVsZFtpXTtcblx0XHR9XG5cdFx0dGhpcy5nYW1lRmllbGQgPSByZXR1cm5BO1xuXHRcdHRoaXMuYWRkWk9yZGVyVG9HYW1lRmllbGQoKTtcblx0XHR0aGlzLnBsYXllci5hcnJheVBvc1kgPSB0aGlzLnBsYXllci5hcnJheVBvc1kgKyAxO1xuXHRcdGlmICh0aGlzLnBsYXllci5hcnJheVBvc1kgPj0gdGhpcy5nYW1lRmllbGQubGVuZ3RoKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnTTogcmVhcnJhbmdlIGtpbGxzIHBsYXllcicpO1xuXHRcdFx0dGhpcy5wbGF5ZXIuZmFsbCgpO1xuXHRcdFx0dGhpcy5nYW1lLmdldENvbXBvbmVudCgnR2FtZScpLnN0YXRlID0gR2FtZVN0YXRlLkdhbWVPdmVyO1xuXHRcdH1cblx0fSxcblxuXHRjcmVhdGVGaXJzdExpbmU6IGZ1bmN0aW9uIGNyZWF0ZUZpcnN0TGluZSh4KSB7XG5cdFx0Y2MubG9nKCdNOiBjcmVhdGVGaXJzdExpbmUnKTtcblx0XHR2YXIgcmV0dXJuQSA9IFtdO1xuXHRcdC8vbmV4dCBsaW5lIGZyb20gYmxvY2stcHVmZmVyXG5cdFx0dmFyIGFycmF5ID0gdGhpcy5nZXROZXh0TGluZUZyb21QdWZmZXIoKTtcblx0XHQvL25leHQgbGluZSBmcm9tIGl0ZW0tcHVmZmVyXG5cdFx0dmFyIGFycmF5SXRlbXMgPSB0aGlzLmdldE5leHRMaW5lRnJvbUl0ZW1QdWZmZXIoKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChhcnJheS5sZW5ndGggJSAyID09IDApIHtcblxuXHRcdFx0XHRyZXR1cm5BW2ldID0gdGhpcy5zcGF3bkN1YmUoeCArIGkgKiBkaXN0WCwgeVNwYXduUG9zaXRpb24gKyBkaXN0WSAtIHNwYXduT2ZmU2V0WSwgYXJyYXlbaV0sIGFycmF5SXRlbXNbaV0pO1xuXHRcdFx0XHRyZXR1cm5BW2ldLm9wYWNpdHkgPSAwO1xuXHRcdFx0XHR2YXIgcmlzZSA9IGNjLm1vdmVUbygxLCBjYy5wKHJldHVybkFbaV0uZ2V0UG9zaXRpb24oKS54LCB5U3Bhd25Qb3NpdGlvbiArIGRpc3RZKSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbkluKCkpO1xuXHRcdFx0XHR2YXIgZmFkZSA9IGNjLmZhZGVJbigxKTtcblx0XHRcdFx0cmV0dXJuQVtpXS5ydW5BY3Rpb24oY2Muc3Bhd24oZmFkZSwgcmlzZSkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly9uZXdDdWJlID0gdGhpcy5zcGF3bkJsdWVDdWJlKHN0YXJ0WCsoeCpkaXN0WCktKGRpc3RYLzIpLCBzdGFydFktKGRpc3RZKnkpKTtcblx0XHRcdFx0Ly9jYy5sb2coJ3dpciBoYWJlbiBlaW4gdW5nZXJhZGVzIEFycmF5Jyk7XG5cblx0XHRcdFx0cmV0dXJuQVtpXSA9IHRoaXMuc3Bhd25DdWJlKHggKyBpICogZGlzdFgsIHlTcGF3blBvc2l0aW9uICsgZGlzdFkgLSBzcGF3bk9mZlNldFksIGFycmF5W2ldLCBhcnJheUl0ZW1zW2ldKTtcblx0XHRcdFx0cmV0dXJuQVtpXS5vcGFjaXR5ID0gMDtcblx0XHRcdFx0dmFyIHJpc2UgPSBjYy5tb3ZlVG8oMSwgY2MucChyZXR1cm5BW2ldLmdldFBvc2l0aW9uKCkueCwgeVNwYXduUG9zaXRpb24gKyBkaXN0WSkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25JbigpKTtcblx0XHRcdFx0dmFyIGZhZGUgPSBjYy5mYWRlSW4oMSk7XG5cdFx0XHRcdHJldHVybkFbaV0ucnVuQWN0aW9uKGNjLnNwYXduKGZhZGUsIHJpc2UpKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJldHVybkE7XG5cdH0sXG5cblx0Ly9UT0RPOiBhZGQgY29kZSB0byBlYWNoIGNhc2UsIHNvIGl0ZW1zIGFyZSBjcmVhdGVkIGFzIHdlbGwgKGFzIG9mIG5vdywgaXRlbS1jb2RlIG9ubHkgZXhpc3RzIGluIGNhc2UgMSlcblx0c3Bhd25DdWJlOiBmdW5jdGlvbiBzcGF3bkN1YmUoeCwgeSwgY3ViZU51bWJlciwgaXRlbU51bWJlcikge1xuXHRcdGNjLmxvZygnTTogc3Bhd25DdWJlJyk7XG5cdFx0c3dpdGNoIChjdWJlTnVtYmVyKSB7XG5cdFx0XHRjYXNlIDA6XG5cdFx0XHRcdC8vZ2VuZXJhdGUgYSBuZXcgbm9kZSBpbiB0aGUgc2NlbmUgd2l0aCBhIHByZXNldCB0ZW1wbGF0ZVxuXHRcdFx0XHR2YXIgbmV3Q3ViZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuRW1wdHkpO1xuXHRcdFx0XHRuZXdDdWJlLmdldENvbXBvbmVudCgnRW1wdHknKS5ibG9ja3R5cGUgPSBCbG9ja1R5cGUuRW1wdHk7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHZhciBuZXdDdWJlID0gY2MuaW5zdGFudGlhdGUodGhpcy5HcmFzcyk7XG5cdFx0XHRcdG5ld0N1YmUuZ2V0Q29tcG9uZW50KCdHcmFzcycpLmJsb2NrdHlwZSA9IEJsb2NrVHlwZS5HcmFzcztcblx0XHRcdFx0Ly9jcmVhdGluZyBuZXcgaXRlbSBhbmQgYWRkaW5nIGl0IHRvIGN1YmVcblx0XHRcdFx0bmV3Q3ViZSA9IHRoaXMuc3Bhd25JdGVtKG5ld0N1YmUsIGl0ZW1OdW1iZXIsICdHcmFzcycpO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR2YXIgbmV3Q3ViZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuRGlydCk7XG5cdFx0XHRcdG5ld0N1YmUuZ2V0Q29tcG9uZW50KCdEaXJ0JykuYmxvY2t0eXBlID0gQmxvY2tUeXBlLkRpcnQ7XG5cdFx0XHRcdC8vY3JlYXRpbmcgbmV3IGl0ZW0gYW5kIGFkZGluZyBpdCB0byBjdWJlXG5cdFx0XHRcdC8vdmFyIG5ld0l0ZW1Ub0FkZCA9IHRoaXMuc3Bhd25JdGVtKGl0ZW1OdW1iZXIpO1xuXHRcdFx0XHRuZXdDdWJlID0gdGhpcy5zcGF3bkl0ZW0obmV3Q3ViZSwgaXRlbU51bWJlciwgJ0RpcnQnKTtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzpcblx0XHRcdFx0dmFyIG5ld0N1YmUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLlRyYXBkb29yKTtcblx0XHRcdFx0bmV3Q3ViZS5nZXRDb21wb25lbnQoJ1RyYXBkb29yJykuYmxvY2t0eXBlID0gQmxvY2tUeXBlLlRyYXBkb29yO1xuXHRcdFx0XHRuZXdDdWJlLmdldENvbXBvbmVudCgnVHJhcGRvb3InKS5zcHJpdGUgPSBuZXdDdWJlO1xuXHRcdFx0XHQvL1RPRE86IGRlbGV0ZSB0aGUgZm9sbG93aW5nIHRocmVlIGxpbmVzLCB0ZXN0aW5nIHB1cnBvc2VzIG9ubHkuIFRyYXBkb29yIG5ldmVyIGhhcyBpdGVtcyBvbiBpdC5cblx0XHRcdFx0Ly9jcmVhdGluZyBuZXcgaXRlbSBhbmQgYWRkaW5nIGl0IHRvIGN1YmVcblx0XHRcdFx0Ly92YXIgbmV3SXRlbVRvQWRkID0gdGhpcy5zcGF3bkl0ZW0oaXRlbU51bWJlcik7XG5cdFx0XHRcdC8vbmV3Q3ViZSA9IHRoaXMuc3Bhd25JdGVtKG5ld0N1YmUsIGl0ZW1OdW1iZXIsICdUcmFwZG9vcicpO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHR2YXIgbmV3Q3ViZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuU3dpdGNoZXIpO1xuXHRcdFx0XHRuZXdDdWJlLmdldENvbXBvbmVudCgnU3dpdGNoZXInKS5ibG9ja3R5cGUgPSBCbG9ja1R5cGUuU3dpdGNoZXI7XG5cdFx0XHRcdC8vVE9ETzogZGVsZXRlIHRoZSBmb2xsb3dpbmcgdGhyZWUgbGluZXMsIHRlc3RpbmcgcHVycG9zZXMgb25seS4gVHJhcGRvb3IgbmV2ZXIgaGFzIGl0ZW1zIG9uIGl0LlxuXHRcdFx0XHQvL2NyZWF0aW5nIG5ldyBpdGVtIGFuZCBhZGRpbmcgaXQgdG8gY3ViZVxuXHRcdFx0XHQvL3ZhciBuZXdJdGVtVG9BZGQgPSB0aGlzLnNwYXduSXRlbShpdGVtTnVtYmVyKTtcblx0XHRcdFx0bmV3Q3ViZSA9IHRoaXMuc3Bhd25JdGVtKG5ld0N1YmUsIGl0ZW1OdW1iZXIsICdTd2l0Y2hlcicpO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA1OlxuXHRcdFx0XHR2YXIgbmV3Q3ViZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuUG9pc29uKTtcblx0XHRcdFx0bmV3Q3ViZS5nZXRDb21wb25lbnQoJ1BvaXNvbicpLmJsb2NrdHlwZSA9IEJsb2NrVHlwZS5Qb2lzb247XG5cdFx0XHRcdC8vVE9ETzogZGVsZXRlIHRoZSBmb2xsb3dpbmcgdGhyZWUgbGluZXMsIHRlc3RpbmcgcHVycG9zZXMgb25seS4gVHJhcGRvb3IgbmV2ZXIgaGFzIGl0ZW1zIG9uIGl0LlxuXHRcdFx0XHQvL2NyZWF0aW5nIG5ldyBpdGVtIGFuZCBhZGRpbmcgaXQgdG8gY3ViZVxuXHRcdFx0XHQvL3ZhciBuZXdJdGVtVG9BZGQgPSB0aGlzLnNwYXduSXRlbShpdGVtTnVtYmVyKTtcblx0XHRcdFx0bmV3Q3ViZSA9IHRoaXMuc3Bhd25JdGVtKG5ld0N1YmUsIGl0ZW1OdW1iZXIsICdQb2lzb24nKTtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNjpcblx0XHRcdFx0dmFyIG5ld0N1YmUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLlNwaWtlKTtcblx0XHRcdFx0bmV3Q3ViZS5nZXRDb21wb25lbnQoJ1NwaWtlJykuYmxvY2t0eXBlID0gQmxvY2tUeXBlLlNwaWtlO1xuXHRcdFx0XHQvL1RPRE86IGRlbGV0ZSB0aGUgZm9sbG93aW5nIHRocmVlIGxpbmVzLCB0ZXN0aW5nIHB1cnBvc2VzIG9ubHkuIFRyYXBkb29yIG5ldmVyIGhhcyBpdGVtcyBvbiBpdC5cblx0XHRcdFx0Ly9jcmVhdGluZyBuZXcgaXRlbSBhbmQgYWRkaW5nIGl0IHRvIGN1YmVcblx0XHRcdFx0Ly92YXIgbmV3SXRlbVRvQWRkID0gdGhpcy5zcGF3bkl0ZW0oaXRlbU51bWJlcik7XG5cdFx0XHRcdG5ld0N1YmUgPSB0aGlzLnNwYXduSXRlbShuZXdDdWJlLCBpdGVtTnVtYmVyLCAnU3Bpa2UnKTtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNzpcblx0XHRcdFx0dmFyIG5ld0N1YmUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLldhdGVyQyk7XG5cdFx0XHRcdG5ld0N1YmUuZ2V0Q29tcG9uZW50KCdFbXB0eScpLmJsb2NrdHlwZSA9IEJsb2NrVHlwZS5FbXB0eTtcblx0XHRcdFx0bmV3Q3ViZS5uYW1lID0gJ0VtcHR5Jztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR2YXIgbmV3Q3ViZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuR3Jhc3MpO1xuXHRcdFx0XHRuZXdDdWJlLmdldENvbXBvbmVudCgnR3Jhc3MnKS5ibG9ja3R5cGUgPSBCbG9ja1R5cGUuR3Jhc3M7XG5cdFx0XHRcdC8vY3JlYXRpbmcgbmV3IGl0ZW0gYW5kIGFkZGluZyBpdCB0byBjdWJlXG5cdFx0XHRcdC8vdmFyIG5ld0l0ZW1Ub0FkZCA9IHRoaXMuc3Bhd25JdGVtKGl0ZW1OdW1iZXIpO1xuXHRcdFx0XHRuZXdDdWJlID0gdGhpcy5zcGF3bkl0ZW0obmV3Q3ViZSwgaXRlbU51bWJlciwgJ0dyYXNzJyk7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0Ly9zZXQgdXAgYSBwb3NpdGlvbiBmb3IgdGhlIFwiRU1QVFlcIlxuXHRcdC8vbmV3Q3ViZS5zZXRBbmNob3JQb2ludChjYy5wKDAsMCkpO1xuXHRcdC8vLS0tLS1uZXdDdWJlLmFkZENoaWxkKG5ld0l0ZW1Ub0FkZCk7XG5cdFx0bmV3Q3ViZS5zZXRQb3NpdGlvbih4LCB5KTtcblx0XHQvL3B1dCB0aGUgbmV3bHkgYWRkZWQgbm9kZSB1bmRlciB0aGUgQ2FudmFzIG5vZGVcblxuXHRcdHRoaXMubm9kZS5hZGRDaGlsZChuZXdDdWJlKTtcblxuXHRcdC8vY2MubG9nKCdSZXR1cm5pbmcgdGhlIGZvbGxvd2luZyBjdWJlOiAnKTtcblx0XHQvL2NjLmxvZyhuZXdDdWJlKTtcblx0XHRyZXR1cm4gbmV3Q3ViZTtcblx0fSxcblxuXHQvLyAwLkVtcHR5LCAxLmFudGlkb3RlTGVmdCwgMi5hbnRpZG90ZVJpZ2h0LCAzLmNvaW5MZWZ0LCA0LmNvaW5SaWdodCwgNS5zdGFyTGVmdCxcblx0Ly8gNi5zdGFyUmlnaHQsIDcuQmxvY2tlZEJ1c2gsIDguQmxvY2tlZFN0b25lLCA5LlNsb3dEb3duQm90dG9tLCA5LlNsb3dEb3duVG9wXG5cdC8vVE9ETzogMTAuV2F0ZXJMZWZ0LCAxMS5XYXRlclJpZ2h0XG5cdHNwYXduSXRlbTogZnVuY3Rpb24gc3Bhd25JdGVtKHBhcmVudEJsb2NrLCBpdGVtTnVtYmVyLCBibG9ja05hbWUpIHtcblx0XHRzd2l0Y2ggKGl0ZW1OdW1iZXIpIHtcblx0XHRcdGNhc2UgMDpcblx0XHRcdFx0Ly9FbXB0eS8gbm8gaXRlbVxuXHRcdFx0XHR2YXIgbmV3SXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuRW1wdHkpO1xuXHRcdFx0XHRuZXdJdGVtLm5hbWUgPSAnRW1wdHknO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0Ly9hbnRpZG90ZUxlZnRcblx0XHRcdFx0dmFyIG5ld0l0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkFudGlkb3RlTCk7XG5cdFx0XHRcdG5ld0l0ZW0ubmFtZSA9ICdBbnRpZG90ZUwnO1xuXHRcdFx0XHRuZXdJdGVtLmdldENvbXBvbmVudCgnSXRlbScpLml0ZW10eXBlID0gSXRlbVR5cGUuQW50aWRvdGU7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdC8vYW50aWRvdGVSaWdodFxuXHRcdFx0XHR2YXIgbmV3SXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuQW50aWRvdGVSKTtcblx0XHRcdFx0bmV3SXRlbS5uYW1lID0gJ0FudGlkb3RlUic7XG5cdFx0XHRcdG5ld0l0ZW0uZ2V0Q29tcG9uZW50KCdJdGVtJykuaXRlbXR5cGUgPSBJdGVtVHlwZS5BbnRpZG90ZTtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzpcblx0XHRcdFx0Ly9jb2luTGVmdFxuXHRcdFx0XHR2YXIgbmV3SXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuQ29pbkwpO1xuXHRcdFx0XHRuZXdJdGVtLm5hbWUgPSAnQ29pbkwnO1xuXHRcdFx0XHRuZXdJdGVtLmdldENvbXBvbmVudCgnSXRlbScpLml0ZW10eXBlID0gSXRlbVR5cGUuQ29pbjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdC8vY29pblJpZ2h0XG5cdFx0XHRcdHZhciBuZXdJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5Db2luUik7XG5cdFx0XHRcdG5ld0l0ZW0ubmFtZSA9ICdDb2luUic7XG5cdFx0XHRcdG5ld0l0ZW0uZ2V0Q29tcG9uZW50KCdJdGVtJykuaXRlbXR5cGUgPSBJdGVtVHlwZS5Db2luO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA1OlxuXHRcdFx0XHQvL3N0YXJMZWZ0XG5cdFx0XHRcdHZhciBuZXdJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5TdGFyTCk7XG5cdFx0XHRcdG5ld0l0ZW0ubmFtZSA9ICdzdGFyTGVmdCc7XG5cdFx0XHRcdG5ld0l0ZW0uZ2V0Q29tcG9uZW50KCdJdGVtJykuaXRlbXR5cGUgPSBJdGVtVHlwZS5TdGFyO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNjpcblx0XHRcdFx0Ly9zdGFyUmlnaHRcblx0XHRcdFx0dmFyIG5ld0l0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLlN0YXJSKTtcblx0XHRcdFx0bmV3SXRlbS5uYW1lID0gJ3N0YXJSaWdodCc7XG5cdFx0XHRcdG5ld0l0ZW0uZ2V0Q29tcG9uZW50KCdJdGVtJykuaXRlbXR5cGUgPSBJdGVtVHlwZS5TdGFyO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNzpcblx0XHRcdFx0Ly9CbG9ja2VkQnVzaFxuXHRcdFx0XHR2YXIgbmV3SXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuQmxvY2tlZEJ1c2gpO1xuXHRcdFx0XHRuZXdJdGVtLm5hbWUgPSAnQmxvY2tlZEJ1c2gnO1xuXHRcdFx0XHRwYXJlbnRCbG9jay5nZXRDb21wb25lbnQoYmxvY2tOYW1lKS5pc0Jsb2NrZWQgPSB0cnVlO1xuXHRcdFx0XHRuZXdJdGVtLmdldENvbXBvbmVudCgnSXRlbScpLml0ZW10eXBlID0gSXRlbVR5cGUuQmxvY2tlcjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDg6XG5cdFx0XHRcdC8vQmxvY2tlZFN0b25lXG5cdFx0XHRcdHZhciBuZXdJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5CbG9ja2VkU3RvbmUpO1xuXHRcdFx0XHRuZXdJdGVtLm5hbWUgPSAnQmxvY2tlZFN0b25lJztcblx0XHRcdFx0cGFyZW50QmxvY2suZ2V0Q29tcG9uZW50KGJsb2NrTmFtZSkuaXNCbG9ja2VkID0gdHJ1ZTtcblx0XHRcdFx0bmV3SXRlbS5nZXRDb21wb25lbnQoJ0l0ZW0nKS5pdGVtdHlwZSA9IEl0ZW1UeXBlLkJsb2NrZXI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA5OlxuXHRcdFx0XHQvL1Nsb3dEb3duIChUb3AgQU5EIEJvdHRvbSlcblx0XHRcdFx0dmFyIG5ld0l0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLlNsb3dEb3duQm90dG9tKTtcblx0XHRcdFx0bmV3SXRlbS5nZXRDb21wb25lbnQoJ0l0ZW0nKS5pdGVtdHlwZSA9IEl0ZW1UeXBlLlNsb3dlcjtcblx0XHRcdFx0bmV3SXRlbS5uYW1lID0gJ1Nsb3dEb3duQm90dG9tJztcblxuXHRcdFx0XHR2YXIgbmV3SXRlbTIgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLlNsb3dEb3duVG9wKTtcblx0XHRcdFx0bmV3SXRlbTIuZ2V0Q29tcG9uZW50KCdJdGVtJykuaXRlbXR5cGUgPSBJdGVtVHlwZS5TbG93ZXI7XG5cdFx0XHRcdG5ld0l0ZW0uYWRkQ2hpbGQobmV3SXRlbTIpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdC8vRW1wdHkvIG5vIGl0ZW1cblx0XHRcdFx0dmFyIG5ld0l0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkVtcHR5KTtcblx0XHRcdFx0bmV3SXRlbS5uYW1lID0gJ0VtcHR5Jztcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0Ly9JdGVtcyBhcmUgaW4gdGhyZWUgY2xhc3Nlczpcblx0XHQvLzEuIEZsb2F0IGFib3ZlIGN1YmVcblx0XHQvLzIuIFNpdCBvbiB0b3Agb2YgY3ViZVxuXHRcdC8vMy4gU2FtZSBwb3NpdGlvbiBhcyBjdWJlIChubyByZXBvc2l0aW9uaW5nIG5lY2Vzc2FyeSlcblx0XHR2YXIgZmxvYXRBYm92ZUN1YmUgPSBbMSwgMiwgMywgNCwgNSwgNl07XG5cdFx0dmFyIHJpZ2h0T25Ub3BPZkN1YmUgPSBbNywgOCwgOSwgMTBdO1xuXG5cdFx0aWYgKGZsb2F0QWJvdmVDdWJlLmluY2x1ZGVzKGl0ZW1OdW1iZXIpKSB7XG5cdFx0XHR2YXIgcG9zWSA9IG5ld0l0ZW0uZ2V0UG9zaXRpb25ZKCk7XG5cdFx0XHR2YXIgcG9zWCA9IG5ld0l0ZW0uZ2V0UG9zaXRpb25YKCk7XG5cdFx0XHRuZXdJdGVtLnNldFBvc2l0aW9uKHBvc1gsIHBvc1kgKyA1MCk7XG5cdFx0fSBlbHNlIGlmIChyaWdodE9uVG9wT2ZDdWJlLmluY2x1ZGVzKGl0ZW1OdW1iZXIpKSB7XG5cdFx0XHR2YXIgcG9zWSA9IG5ld0l0ZW0uZ2V0UG9zaXRpb25ZKCk7XG5cdFx0XHR2YXIgcG9zWCA9IG5ld0l0ZW0uZ2V0UG9zaXRpb25YKCk7XG5cdFx0XHRuZXdJdGVtLnNldFBvc2l0aW9uKHBvc1gsIHBvc1kgKyA0MCk7XG5cdFx0fVxuXHRcdHBhcmVudEJsb2NrLmdldENvbXBvbmVudChibG9ja05hbWUpLml0ZW0gPSBuZXdJdGVtO1xuXHRcdHBhcmVudEJsb2NrLmFkZENoaWxkKG5ld0l0ZW0pO1xuXG5cdFx0cmV0dXJuIHBhcmVudEJsb2NrO1xuXHR9LFxuXG5cdC8qIEdldHMgdGhlIG5leHQgbGluZSBmcm9tIHRoZSBibG9jay1wdWZmZXIsIHNvIGEgbmV3IGxpbmUgY2FuIGJlIGNyZWF0ZWQuXHQqL1xuXHQvKiBHZXRzIHRoZSBuZXh0IGxpbmUgZnJvbSB0aGUgYmxvY2stcHVmZmVyLCBzbyBhIG5ldyBsaW5lIGNhbiBiZSBjcmVhdGVkLlx0Ki9cblx0Z2V0TmV4dExpbmVGcm9tUHVmZmVyOiBmdW5jdGlvbiBnZXROZXh0TGluZUZyb21QdWZmZXIoKSB7XG5cdFx0Y2MubG9nKCdNOiBnZXROZXh0TGluZUZyb21QdWZmZXInKTtcblx0XHR2YXIgcmV0ID0gW107XG5cdFx0aWYgKHB1ZmZlckZpZWxkLmxlbmd0aCA9PT0gbmV4dEZpcnN0TGluZSkge1xuXHRcdFx0Y2MubG9nKCdQdWZmZXIgYXJyYXkgaXMgZW1wdHkhJyk7XG5cdFx0XHQvKnB1ZmZlckZpZWxkID0gW107XHJcbiAgICBwdWZmZXJGaWVsZCA9IExldmVsLkwxM0M7XHJcbiAgICBuZXh0Rmlyc3RMaW5lID0gMDsqL1xuXHRcdFx0Ly9UT0RPIHVta29tbWVudGllcmVuXG5cdFx0XHR0aGlzLmRlZmluZU5leHRSYW5kb21BcnJheSgpO1xuXHRcdFx0Ly90aGlzLnRlc3RBcnJheSgpXG5cdFx0XHRyZXQgPSBwdWZmZXJGaWVsZFtuZXh0Rmlyc3RMaW5lXTtcblx0XHRcdG5leHRGaXJzdExpbmUgPSBuZXh0Rmlyc3RMaW5lICsgMTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly9jYy5sb2coJ0dldHRpbmcgbmV4dCBhcnJheSBsaW5lIGZybyBwdWZmZXIuLi4nKVxuXHRcdFx0cmV0ID0gcHVmZmVyRmllbGRbbmV4dEZpcnN0TGluZV07XG5cdFx0XHRuZXh0Rmlyc3RMaW5lID0gbmV4dEZpcnN0TGluZSArIDE7XG5cdFx0fVxuXHRcdC8vY2MubG9nKCdSZXR1cm5pbmcgbmV4dCBwdWZmZXIgYXJyYXkgbGluZSwgZXhpdGluZyBnZXROZXh0TGluZUZyb21QdWZmZXInLCByZXQpO1xuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cblx0Ly9UT0RPIG51ciBlaW4gRHVtbXkgenVtIHRlc3Rlbiwgc3DDpHRlciBMw5ZTQ0hFTiFcblx0dGVzdEFycmF5OiBmdW5jdGlvbiB0ZXN0QXJyYXkoKSB7XG5cdFx0cHVmZmVyRmllbGQgPSBbXTtcblx0XHRwdWZmZXJGaWVsZEl0ZW1zID0gW107XG5cdFx0cHVmZmVyRmllbGQgPSBMZXZlbC5MMzNDO1xuXHRcdHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMzNJO1xuXHRcdG5leHRGaXJzdExpbmUgPSAwO1xuXHRcdG5leHRGaXJzdExpbmVJdGVtID0gMDtcblx0fSxcblxuXHQvKiBHZXRzIHRoZSBuZXh0IGxpbmUgZnJvbSB0aGUgaXRlbS1wdWZmZXIsIHNvIGEgbmV3IGxpbmUgY2FuIGJlIGNyZWF0ZWQuXHQqL1xuXHRnZXROZXh0TGluZUZyb21JdGVtUHVmZmVyOiBmdW5jdGlvbiBnZXROZXh0TGluZUZyb21JdGVtUHVmZmVyKCkge1xuXHRcdGNjLmxvZygnTTogZ2V0TmV4dExpbmVGcm9tSXRlbVB1ZmZlcicpO1xuXHRcdHZhciByZXQgPSBbXTtcblxuXHRcdGlmIChwdWZmZXJGaWVsZEl0ZW1zLmxlbmd0aCA9PT0gbmV4dEZpcnN0TGluZUl0ZW0pIHtcblx0XHRcdC8vVE9ETyBoaWVyIG11ZXNzZW4gd2lyIG5vY2ggcmVhZ2llcmVuXG5cdFx0XHRjYy5sb2coJ0l0ZW1QdWZmZXIgYXJyYXkgaXMgZW1wdHkhJyk7XG5cdFx0XHQvKnB1ZmZlckZpZWxkSXRlbXMgPSBbXTtcclxuICAgIHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMTNJO1xyXG4gICAgbmV4dEZpcnN0TGluZUl0ZW0gPSAwOyovXG5cdFx0XHRyZXQgPSBwdWZmZXJGaWVsZEl0ZW1zW25leHRGaXJzdExpbmVJdGVtXTtcblx0XHRcdG5leHRGaXJzdExpbmVJdGVtID0gbmV4dEZpcnN0TGluZUl0ZW0gKyAxO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXQgPSBwdWZmZXJGaWVsZEl0ZW1zW25leHRGaXJzdExpbmVJdGVtXTtcblx0XHRcdG5leHRGaXJzdExpbmVJdGVtID0gbmV4dEZpcnN0TGluZUl0ZW0gKyAxO1xuXHRcdH1cblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXG5cdGRlZmluZU5leHRSYW5kb21BcnJheTogZnVuY3Rpb24gZGVmaW5lTmV4dFJhbmRvbUFycmF5KCkge1xuXHRcdC8vU2NvcmU/IVxuXHRcdHZhciBzY29yZSA9IHRoaXMuZ2FtZS5nZXRDb21wb25lbnQoJ0dhbWUnKS5zY29yZTtcblx0XHRjb25zb2xlLmxvZygnTTogZGVmaW5lTmV4dFJhbmRvbUFycmF5Jyk7XG5cdFx0Y29uc29sZS5sb2coJ1Njb3JlIGF1c2dlbGVzZW46ICcsIHNjb3JlKTtcblxuXHRcdHB1ZmZlckZpZWxkID0gW107XG5cdFx0cHVmZmVyRmllbGRJdGVtcyA9IFtdO1xuXG5cdFx0dmFyIHJhbmQgPSBNYXRoLnJhbmRvbSgpICogMTAgKyAxO1xuXHRcdGNvbnNvbGUubG9nKCdSYW5kb206ICcsIHJhbmQpO1xuXG5cdFx0aWYgKHNjb3JlIDw9IDM1KSB7XG5cdFx0XHRpZiAocmFuZCA8IDQpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1dJUiBXRUlTRSBMMTFDIHp1Jyk7XG5cdFx0XHRcdHB1ZmZlckZpZWxkID0gTGV2ZWwuTDExQztcblx0XHRcdFx0cHVmZmVyRmllbGRJdGVtcyA9IExldmVsLkwxMUk7XG5cdFx0XHR9IGVsc2UgaWYgKHJhbmQgPCA3KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXSVIgV0VJU0UgTDEyQyB6dScpO1xuXHRcdFx0XHRwdWZmZXJGaWVsZCA9IExldmVsLkwxMkM7XG5cdFx0XHRcdHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMTJJO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1dJUiBXRUlTRSBMMTNDIHp1Jyk7XG5cdFx0XHRcdHB1ZmZlckZpZWxkID0gTGV2ZWwuTDEzQztcblx0XHRcdFx0cHVmZmVyRmllbGRJdGVtcyA9IExldmVsLkwxM0k7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChzY29yZSA8PSA3MCkge1xuXHRcdFx0aWYgKHJhbmQgPCA0KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXSVIgV0VJU0UgTDIxQyB6dScpO1xuXHRcdFx0XHRwdWZmZXJGaWVsZCA9IExldmVsLkwyMUM7XG5cdFx0XHRcdHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMjFJO1xuXHRcdFx0fSBlbHNlIGlmIChyYW5kIDwgNykge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnV0lSIFdFSVNFIEwyMkMgenUnKTtcblx0XHRcdFx0cHVmZmVyRmllbGQgPSBMZXZlbC5MMjJDO1xuXHRcdFx0XHRwdWZmZXJGaWVsZEl0ZW1zID0gTGV2ZWwuTDIySTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXSVIgV0VJU0UgTDIzQyB6dScpO1xuXHRcdFx0XHRwdWZmZXJGaWVsZCA9IExldmVsLkwyM0M7XG5cdFx0XHRcdHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMjNJO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAocmFuZCA8IDQpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1dJUiBXRUlTRSBMMzFDIHp1Jyk7XG5cdFx0XHRcdHB1ZmZlckZpZWxkID0gTGV2ZWwuTDMxQztcblx0XHRcdFx0cHVmZmVyRmllbGRJdGVtcyA9IExldmVsLkwzMUk7XG5cdFx0XHR9IGVsc2UgaWYgKHJhbmQgPCA3KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXSVIgV0VJU0UgTDMyQyB6dScpO1xuXHRcdFx0XHRwdWZmZXJGaWVsZCA9IExldmVsLkwzMkM7XG5cdFx0XHRcdHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMzJJO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1dJUiBXRUlTRSBMMzNDIHp1Jyk7XG5cdFx0XHRcdHB1ZmZlckZpZWxkID0gTGV2ZWwuTDMzQztcblx0XHRcdFx0cHVmZmVyRmllbGRJdGVtcyA9IExldmVsLkwzM0k7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdG5leHRGaXJzdExpbmUgPSAwO1xuXHRcdG5leHRGaXJzdExpbmVJdGVtID0gMDtcblx0fSxcblxuXHRhZGRaT3JkZXJUb0dhbWVGaWVsZDogZnVuY3Rpb24gYWRkWk9yZGVyVG9HYW1lRmllbGQoKSB7XG5cdFx0Y2MubG9nKCdNOiBhZGRaT3JkZXJUb0dhbWVGaWVsZCcpO1xuXHRcdHZhciBjb3VudCA9IDE7XG5cdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLmdhbWVGaWVsZC5sZW5ndGg7IHkrKykge1xuXHRcdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmdhbWVGaWVsZFt5XS5sZW5ndGg7IHgrKykge1xuXHRcdFx0XHR0aGlzLmdhbWVGaWVsZFt5XVt4XS5zZXRMb2NhbFpPcmRlcihjb3VudCk7XG5cdFx0XHRcdGNvdW50Kys7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdGdldEJsb2NrVHlwZTogZnVuY3Rpb24gZ2V0QmxvY2tUeXBlKGJsb2NrKSB7XG5cdFx0Y2MubG9nKCdNOiBnZXRCbG9ja1R5cGUnKTtcblx0XHRjYy5sb2coYmxvY2submFtZSk7XG5cdFx0Ly92YXIgcmV0ID0gYmxvY2suZ2V0Q2xhc3NOYW1lKCk7XG5cdFx0Ly9jYy5sb2cocmV0KTtcblx0XHRyZXR1cm4gYmxvY2submFtZTtcblx0fSxcblxuXHRjYWxsUHJlZmFiOiBmdW5jdGlvbiBjYWxsUHJlZmFiKHByZWYpIHtcblx0XHR0aGlzLnByZWYubm9kZS5jb2xsaWRlKCk7XG5cdH1cbn0pO1xuLypcclxuIGluaXRpYWxpemVGaWVsZDI6IGZ1bmN0aW9uKHgseSl7XHJcbiB0aGlzLmdhbWVGaWVsZCA9IFt4XTtcclxuIGZvciAodmFyIGggPSAwOyBoIDwgeDsgaCsrKSB7IC8vY3JlYXRlIGFycmF5IHdpdGggdW5ldmVuIHJvd3NcclxuIGlmKGglMj09PTEpe1xyXG4gdGhpcy5nYW1lRmllbGRbaF0gPSBbeS0xXTsgLy91bmV2ZW5cclxuIH0gZWxzZSB7XHJcbiB0aGlzLmdhbWVGaWVsZFtoXSA9IFt5XTtcclxuIH1cclxuIH1cclxuXG4gZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdhbWVGaWVsZC5sZW5ndGg7IGkrKykge1xyXG4gZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLmdhbWVGaWVsZFtpXS5sZW5ndGg7IGorKykge1xyXG4gaWYodGhpcy5nYW1lRmllbGRbaV0ubGVuZ3RoJTI9PT0xKXsgLy8gZXZlbiBhcnJheS9yb3dcclxuIG5ld0N1YmUgPSB0aGlzLnNwYXduQ3ViZShzdGFydFgrKHgqZGlzdFgpLCBzdGFydFktKGRpc3RZKnkpLCBzdGFydEZpZWxkMltpXVtqXSk7XHJcbiB9XHJcbiBlbHNleyAvLyB1bmV2ZW4gYXJyYXkvcm93XHJcbiBuZXdDdWJlID0gdGhpcy5zcGF3bkN1YmUoc3RhcnRYKyh4KmRpc3RYKS0oZGlzdFgvMiksIHN0YXJ0WS0oZGlzdFkqeSksIHN0YXJ0RmllbGQyW2ldW2pdKTtcclxuIH1cclxuIHRoaXMuZ2FtZUZpZWxkW2ldW2pdID0gbmV3Q3ViZTsgLy9UT0RPIGFkZCBibG9ja3Mgbm90IG51bWJlcnNcclxuIH1cclxuIH1cclxuXG5cbiBjYy5sb2coXCJGaWVsZDpcIik7XHJcbiBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZ2FtZUZpZWxkLmxlbmd0aDsgaSsrKSB7XHJcbiBjYy5sb2codGhpcy5nYW1lRmllbGRbaV0uam9pbihcIlJvdzogXCIraStcIiBcIikpO1xyXG4gfVxyXG4gfSxcclxuXG4gYWRkRmlyc3RGaWVsZFJvdzogZnVuY3Rpb24ocm93KXtcclxuIHRoaXMuZmllbGQudW5zaGlmdChyb3cpO1xyXG4gfSxcclxuXG4gcmVtb3ZlTGFzdEZpZWxkUm93OiBmdW5jdGlvbigpe1xyXG4gdGhpcy5maWVsZC5wb3AoKTtcclxuIH0sXHJcblxuIGFkZEZpZWxkUm93IDogZnVuY3Rpb24oaW5kZXgsIHJvdyl7XHJcbiB0aGlzLmZpZWxkW2luZGV4XSA9IHJvdztcclxuIH0sXHJcblxuIHJlbW92ZUZpZWxkUm93IDogZnVuY3Rpb24oaW5kZXgpe1xyXG4gdmFyIHRlbXAgPSBbdGhpcy5ncmlkU2l6ZVhdO1xyXG4gZm9yKHZhciBoID0gMDsgaCA8IHRoaXMuZ3JpZFNpemVYOyBoKyspe1xyXG4gdGVtcFtoXSA9IHRoaXMuZmllbGRbaF07XHJcbiB9XHJcblxuIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmdyaWRTaXplWDsgaSsrKXtcclxuIGlmKGkgIT0gMCl7XHJcbiB2YXIgbmV3aW5kZXggPSBpLTE7XHJcbiBjYy5sb2coXCJJbmQ6IFwiK25ld2luZGV4KTtcclxuIHRoaXMuZmllbGRbaV0gPSB0ZW1wW25ld2luZGV4XTtcclxuIH1cclxuIH1cclxuIH0sXHJcblxuIGdlbmVyYXRlUm93IDogZnVuY3Rpb24oKXtcclxuIHZhciBpID0gdGhpcy5ncmlkU2l6ZVgrdGhpcy5jb3VudDtcclxuIHRoaXMuY291bnQrKztcclxuIHJldHVybiBbaSxpLGksaSxpXTtcclxuIC8vVE9ETzogbG9hZCBhIHJvdyBmcm9tIHRpbGVkIGZpbGUgcmV0dXJuIGFycmF5XHJcbiB9LCovXG5cbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMDc2ZWYrQ2JxVkNGSy9ROXNjckw4VWknLCAnR2FtZScpO1xuLy8gc2NyaXB0c1xcR2FtZS5qc1xuXG4vL0dhbWVcbi8vIEltcG9ydHNcbnZhciBHYW1lU3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5HYW1lU3RhdGU7XG52YXIgUGxheWVyTW92ZW1lbnRTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLlBsYXllck1vdmVtZW50U3RhdGU7XG52YXIgU3RlcCA9IHJlcXVpcmUoJ1R5cGVzJykuQmxvY2tUeXBlO1xuXG52YXIgd2hpY2hTdGVwID0gU3RlcC5Ob25lO1xudmFyIHVwZGF0ZUFjY2VzcyA9IHRydWU7XG52YXIgb25TdGVwcEtpbGxzID0gZmFsc2U7XG52YXIga2lsbEFjdGlvbkV4ZWN1dGVkID0gZmFsc2U7XG52YXIgcHJlc3NEb3VibGUgPSAwO1xuXG4vL2Rpc2FibGVzIHRoZSBhbnRpYWxpYXNpbmcsIGJlY2F1c2UgaXQgZGVzdHJveXMgdGhlIHBpeGVsYXJ0XG52YXIgX19jY1RleHR1cmUyRF9oYW5kbGVMb2FkZWRUZXh0dXJlID0gY2MuVGV4dHVyZTJELnByb3RvdHlwZS5oYW5kbGVMb2FkZWRUZXh0dXJlO1xuY2MuVGV4dHVyZTJELnByb3RvdHlwZS5oYW5kbGVMb2FkZWRUZXh0dXJlID0gZnVuY3Rpb24gKCkge1xuICAgIF9fY2NUZXh0dXJlMkRfaGFuZGxlTG9hZGVkVGV4dHVyZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuc2V0QWxpYXNUZXhQYXJhbWV0ZXJzKCk7XG59O1xuXG52YXIgcHJlc3NDb3VudCA9IDA7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc3RhdGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogR2FtZVN0YXRlLk5vbmUsXG4gICAgICAgICAgICB0eXBlOiBHYW1lU3RhdGVcbiAgICAgICAgfSxcbiAgICAgICAgLy8gR2FtZSBEYXRhL09iamVjdHNcbiAgICAgICAgZ2FtZWZpZWxkOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgcGxheWVyOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gR2FtZS1VSVxuICAgICAgICBzY29yZUxhYmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuXG4gICAgICAgIG11bHRpcGxpZXJMYWJlbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBNdXNpYyBUaGVtZVxuICAgICAgICB0aGVtZXVybDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgLy90aGlzLnNldEZyYW1lUmF0ZSg2MCk7XG4gICAgICAgIHRoaXMuc3RvcmFnZSA9IGNjLnN5cy5sb2NhbFN0b3JhZ2U7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBHYW1lU3RhdGUuV2FpdGluZztcbiAgICAgICAgLy90aGlzLkdhbWVTdGF0ZSA9IEdhbWVTdGF0ZTtcbiAgICAgICAgdGhpcy5pbml0YWxpemVJbnB1dENvbnRyb2woKTsgLy8gQWN0aXZhdGUgaW5wdXQgaGFuZGxpbmdcblxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5TXVzaWModGhpcy50aGVtZXVybCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5zZXRJdGVtKCdzY29yZScsIDApO1xuXG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgICAgICB0aGlzLnNjb3JlTXVsdGlwbGllciA9IDE7XG4gICAgICAgIHRoaXMubXVsdGlwbGllckFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuc3RlcHBlZEJsb2NrID0gbnVsbDtcbiAgICB9LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KCkge30sXG5cbiAgICAvLyBDYWxsZWQgd2hlbiBwbGF5ZXIgb25Mb2FkKCkgaGFzIGZpbmlzaGVkXG4gICAgb25QbGF5ZXJMb2FkQ2FsbGJhY2s6IGZ1bmN0aW9uIG9uUGxheWVyTG9hZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmdhbWVmaWVsZC5wbGF5ZXIgPSB0aGlzLnBsYXllcjtcblxuICAgICAgICAvLyBQbGF5ZXIgaXMgYXNzZW1ibGVkLiBzZXQgYWxsIG5lZWRlZCBncmFwaGljYWwgaW5mb3JtYXRpb25cbiAgICAgICAgdGhpcy5wbGF5ZXIubm9kZS5zZXRQb3NpdGlvbih0aGlzLmdhbWVmaWVsZC5nZXRTdGFydFBvc2l0aW9uKCkpO1xuICAgICAgICB0aGlzLnBsYXllci5ub2RlLnNldExvY2FsWk9yZGVyKDEwMDApO1xuICAgICAgICB0aGlzLnBsYXllci5keCA9IHRoaXMuZ2FtZWZpZWxkLmRpc1RYIC8gMjsgLy9vbmx5IGhhbGYgdGhlIGRpc3RhbmNlIG9uIHghIVxuICAgICAgICB0aGlzLnBsYXllci5keSA9IHRoaXMuZ2FtZWZpZWxkLmRpc1RZO1xuICAgIH0sXG5cbiAgICAvLyBDYWxsZWQgd2hlbiBnYW1lZmllbGQgaXMgaW5pdGFsaXplZCAoIG9uTG9hZCgpIGhhcyBmaW5pc2hlZCApXG4gICAgb25HYW1lRmllbGRMb2FkQ2FsbGJhY2s6IGZ1bmN0aW9uIG9uR2FtZUZpZWxkTG9hZENhbGxiYWNrKCkge30sXG5cbiAgICAvL1RPRE8gaGllciB3aXJkIGVpbiBGZWhsZXIgdmVydXJzYWNodCwgd2VubiBHaWZ0IE5BQ0ggZWluZW0gU3dpdGNoZXIga29tbXQhXG4gICAgdmFsaWRhdGVNb3ZlOiBmdW5jdGlvbiB2YWxpZGF0ZU1vdmUoZGlyKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IEdhbWVTdGF0ZS5HYW1lT3Zlcikge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnRHUgZGFyZnN0IG5pY2h0IGJld2VnZW4sIHdlaWwgZHUgZ2FtZU92ZXIgYmlzdCcpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucGxheWVyLm1vdmVzdGF0ZSA9PT0gUGxheWVyTW92ZW1lbnRTdGF0ZS5KdW1waW5nIHx8IHRoaXMucGxheWVyLm1vdmVzdGF0ZSA9PT0gUGxheWVyTW92ZW1lbnRTdGF0ZS5GYWxsaW5nKSB7XG4gICAgICAgICAgICAvL1BsYXllciBhbHJlYWR5IGp1bXBpbmcvZmFsbGluZyAtPiBuZWdsZWN0IGlucHV0XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy92YXIgY3VycmVudGZpZWxkID0gdGhpcy5wbGF5ZXIub2xkRGVzdDtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnQmxvY2tUeXBlOiAnLCB0aGlzLmdhbWVmaWVsZC5nZXRCbG9ja1R5cGUodGhpcy5nYW1lZmllbGQuZ2V0SnVtcEZpZWxkKGRpcikpKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygndmFyIGRlc3RmaWVsZCA9ICcsIGRlc3RmaWVsZCk7XG5cbiAgICAgICAgLy8gSGFuZGxlIHN3YXBlZCBjYXNlXG4gICAgICAgIGlmICh0aGlzLnBsYXllci5pc1N3YXBlZCkge1xuICAgICAgICAgICAgZGlyID0gLWRpcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhhbmRsZSBzbG93ZWQgY2FzZVxuICAgICAgICBpZiAodGhpcy5wbGF5ZXIuaXNTbG93ZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUFJFU1NDT1VOVFwiICsgcHJlc3NDb3VudCk7XG4gICAgICAgICAgICBwcmVzc0NvdW50Kys7XG4gICAgICAgICAgICBpZiAocHJlc3NDb3VudCA8IDMpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNUSUxMIFNMT1dFRFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUkVMRUFTRVwiICsgcHJlc3NDb3VudCk7XG4gICAgICAgICAgICAgICAgcHJlc3NDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIuaXNTbG93ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAvL3JldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kZXN0ZmllbGQgPSB0aGlzLmdhbWVmaWVsZC5nZXRKdW1wRmllbGQoZGlyKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnZGVzdGZpZWxkID0gJywgdGhpcy5kZXN0ZmllbGQpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdkZXN0ZmllbGQgPSAnLCB0aGlzLmRlc3RmaWVsZC5uYW1lKTtcbiAgICAgICAgLy9zdGVwcGVkQmxvY2sgaXMgbmVjZXNzYXJyeSBmb3IgbW92ZW1lbnQtY29sbGlzaW9uY29udHJvbGxcbiAgICAgICAgdmFyIHN0ZXBwZWRCbG9jayA9IHRoaXMuZGVzdGZpZWxkLmdldENvbXBvbmVudCh0aGlzLmRlc3RmaWVsZC5uYW1lKTtcblxuICAgICAgICBpZiAoc3RlcHBlZEJsb2NrLmlzQmxvY2tlZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGxheWVyLmlzU3dhcGVkID0gZmFsc2U7XG5cbiAgICAgICAgLy8gISEhIElOU0VSVCBsaW5lcyBhdCBlbmQgb2YgZmlsZSB3aGVuIGJ1Z3MgaGFwcGVuIGhlcmUgISEhXG5cbiAgICAgICAgLy9cbiAgICAgICAgLy9Nb3ZlIHdhcyBjb3JyZWN0LlxuICAgICAgICAvL1xuICAgICAgICAvL0NoYW5nZSBwbGF5ZXIgZGlyZWN0aW9uXG4gICAgICAgIHRoaXMucGxheWVyLmRpciA9IGRpcjtcbiAgICAgICAgdGhpcy5pbmNyZW1lbnRTY29yZSgxKTtcbiAgICAgICAgdGhpcy5zY29yZUxhYmVsLnN0cmluZyA9IHRoaXMuc2NvcmUudG9TdHJpbmcoKTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgaW5pdGFsaXplSW5wdXRDb250cm9sOiBmdW5jdGlvbiBpbml0YWxpemVJbnB1dENvbnRyb2woKSB7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih7XG4gICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCxcblxuICAgICAgICAgICAgb25LZXlQcmVzc2VkOiBmdW5jdGlvbiBvbktleVByZXNzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5zdGF0ZSA9PSBHYW1lU3RhdGUuUGF1c2VkKSByZXR1cm47XG4gICAgICAgICAgICAgICAgc3dpdGNoIChrZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLmE6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5zdGF0ZSA9PT0gR2FtZVN0YXRlLldhaXRpbmcpIHNlbGYuc3RhdGUgPSBHYW1lU3RhdGUuUGxheWluZztcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYudmFsaWRhdGVNb3ZlKDEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wbGF5ZXIubW92ZShzZWxmLmRlc3RmaWVsZCwgc2VsZik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5nYW1lZmllbGQudXBkYXRlUGxheWVyQXJyYXlQb3MoKTsgLy8gQ2hhbmdlIGFycmF5IHBvc2l0aW9uIGFmdGVyIGp1bXAgb3IgYnVncyB3aWxsIHNwYXduXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYucGxheWVyLm9sZERlc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnBsYXllci5vbGREZXN0LmdldENvbXBvbmVudChzZWxmLnBsYXllci5vbGREZXN0Lm5hbWUpLnBsYXllck9uVG9wID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLmQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5zdGF0ZSA9PT0gR2FtZVN0YXRlLldhaXRpbmcpIHNlbGYuc3RhdGUgPSBHYW1lU3RhdGUuUGxheWluZztcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYudmFsaWRhdGVNb3ZlKC0xKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucGxheWVyLm1vdmUoc2VsZi5kZXN0ZmllbGQsIHNlbGYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ2FtZWZpZWxkLnVwZGF0ZVBsYXllckFycmF5UG9zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYucGxheWVyLm9sZERlc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnBsYXllci5vbGREZXN0LmdldENvbXBvbmVudChzZWxmLnBsYXllci5vbGREZXN0Lm5hbWUpLnBsYXllck9uVG9wID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLnU6XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmdhbWVmaWVsZC51cGRhdGVGaWVsZCgtMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLms6XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnBsYXllci5raWxsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkuZXNjYXBlOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2MubG9nKFwiRXNjYXBlIHByZXNzZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiB3aGF0IHRvIGRvIG9uIGVzY2FwZWQtcHJlc3NlZD9cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5mOlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wbGF5ZXIuZmFsbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgb25LZXlSZWxlYXNlZDogZnVuY3Rpb24gb25LZXlSZWxlYXNlZChrZXlDb2RlLCBldmVudCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoa2V5Q29kZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5hOlxuXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkuZDpcblxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCBzZWxmLm5vZGUpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ006IHVwZGF0ZScpO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gR2FtZVN0YXRlLlBsYXlpbmcpIHtcbiAgICAgICAgICAgIHRoaXMubW92ZUZpZWxkV2l0aFBsYXllcigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBHYW1lU3RhdGUuR2FtZU92ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmFnZS5zZXRJdGVtKCdzY29yZScsIHRoaXMuc2NvcmUpO1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdHYW1lT3ZlclNjZW5lJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgbW92ZUZpZWxkV2l0aFBsYXllcjogZnVuY3Rpb24gbW92ZUZpZWxkV2l0aFBsYXllcigpIHtcbiAgICAgICAgdmFyIHlTcGVlZCA9IHRoaXMucGxheWVyLmFycmF5UG9zWTtcbiAgICAgICAgLy8gY2MubG9nKCdQbGF5ZXJwb3MnLCB5U3BlZWQpO1xuICAgICAgICBpZiAodXBkYXRlQWNjZXNzKSB7XG4gICAgICAgICAgICAvL2NjLmxvZygnVVBEQVRFLUNhc2VzIGJldHJldGVuJyk7XG4gICAgICAgICAgICB1cGRhdGVBY2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIHN3aXRjaCAoeVNwZWVkKSB7XG4gICAgICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVBY2Nlc3MgPSB0aGlzLmdhbWVmaWVsZC51cGRhdGVGaWVsZCgtMC4zKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVBY2Nlc3MgPSB0aGlzLmdhbWVmaWVsZC51cGRhdGVGaWVsZCgtMC40KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVBY2Nlc3MgPSB0aGlzLmdhbWVmaWVsZC51cGRhdGVGaWVsZCgtMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gdGhpcy5nYW1lZmllbGQudXBkYXRlRmllbGQoLTEuNSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gdGhpcy5nYW1lZmllbGQudXBkYXRlRmllbGQoLTIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUFjY2VzcyA9IHRoaXMuZ2FtZWZpZWxkLnVwZGF0ZUZpZWxkKC00KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVBY2Nlc3MgPSB0aGlzLmdhbWVmaWVsZC51cGRhdGVGaWVsZCgtOCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gdGhpcy5nYW1lZmllbGQudXBkYXRlRmllbGQoLTEyKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVBY2Nlc3MgPSB0aGlzLmdhbWVmaWVsZC51cGRhdGVGaWVsZCgtMjApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVBY2Nlc3MgPSB0aGlzLmdhbWVmaWVsZC51cGRhdGVGaWVsZCgtMC4zKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy9cbiAgICAvLyBIRUxQSU5HIE1FVEhPRFMuIFNNQUxMIFNUVUZGXG4gICAgLy9cblxuICAgIGNoYW5nZU11bHRpcGxpZXI6IGZ1bmN0aW9uIGNoYW5nZU11bHRpcGxpZXIodmFsdWUpIHtcbiAgICAgICAgLy9UT0RPOiBTdG9wIGFuZCBzdGFydCBhY3Rpb24gYnkgdGFnXG4gICAgICAgIHRoaXMuc2NvcmVNdWx0aXBsaWVyID0gdmFsdWU7XG4gICAgICAgIHRoaXMubXVsdGlwbGllckxhYmVsLnN0cmluZyA9IFwiTXVsdGlwbGllcjogXCIgKyB0aGlzLnNjb3JlTXVsdGlwbGllcjtcbiAgICAgICAgdGhpcy5tdWx0aXBsaWVyTGFiZWwubm9kZS5vcGFjaXR5ID0gMjU1O1xuICAgICAgICB2YXIgcmVzZXRNdWx0aXBsaWVyQ2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLnJlc2V0TXVsdGlwbGllciwgdGhpcyk7XG4gICAgICAgIHRoaXMubXVsdGlwbGllckxhYmVsLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGNjLmZhZGVPdXQoNSksIHJlc2V0TXVsdGlwbGllckNhbGxiYWNrKSk7XG4gICAgfSxcblxuICAgIHJlc2V0TXVsdGlwbGllcjogZnVuY3Rpb24gcmVzZXRNdWx0aXBsaWVyKCkge1xuICAgICAgICB0aGlzLnNjb3JlTXVsdGlwbGllciA9IDA7XG4gICAgfSxcblxuICAgIGluY3JlbWVudFNjb3JlOiBmdW5jdGlvbiBpbmNyZW1lbnRTY29yZShpbmMpIHtcbiAgICAgICAgdGhpcy5zY29yZSArPSBpbmMgKiB0aGlzLnNjb3JlTXVsdGlwbGllcjtcbiAgICB9LFxuXG4gICAgLy9EZXByZWNhdGVkXG4gICAgY2hlY2tJdGVtQ29sbGlzaW9uOiBmdW5jdGlvbiBjaGVja0l0ZW1Db2xsaXNpb24oaXRlbSkge1xuICAgICAgICB2YXIgaXRlbXBvcyA9IGl0ZW0ubm9kZS5nZXRQb3NpdGlvbigpO1xuICAgICAgICB2YXIgcHBvcyA9IHRoaXMucGxheWVyLm5vZGUuZ2V0UG9zaXRpb24oKTtcbiAgICAgICAgdmFyIGRpc3QgPSBjYy5wRGlzdGFuY2UoaXRlbXBvcywgcHBvcyk7XG4gICAgICAgIGlmIChkaXN0IDwgaXRlbS5jb2xsZWN0UmFkaXVzKSB7XG4gICAgICAgICAgICBpdGVtLm9uUGlja1VwQ2FsbGJhY2sodGhpcy5wbGF5ZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG59KTtcbi8qc3dpdGNoKGRlc3RmaWVsZCl7XHJcbiAgICBjYXNlICdHcmFzcyc6XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnY2FzZSBHcmFzcycpO1xyXG4gICAgICAgIGlmKCF0aGlzLmdhbWVmaWVsZC5nZXRKdW1wRmllbGQoZGlyKS5nZXRDb21wb25lbnQoJ0dyYXNzJykuaXNCbG9ja2VkKXtcclxuICAgICAgICAgICAgcmV0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9zdGVwcGVkQmxvY2sgaXMgbmVjZXNzYXJyeSBmb3IgQ29sbGlzaW9uY29udHJvbGxcclxuICAgICAgICB0aGlzLnN0ZXBwZWRCbG9jayA9IHRoaXMuZ2FtZWZpZWxkLmdldEp1bXBGaWVsZChkaXIpLmdldENvbXBvbmVudCgnR3Jhc3MnKTtcclxuICAgICAgICB3aGljaFN0ZXAgPSBTdGVwLkdyYXNzO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnRGlydCc6XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnY2FzZSBkaXJ0Jyk7XHJcbiAgICAgICAgaWYoIXRoaXMuZ2FtZWZpZWxkLmdldEp1bXBGaWVsZChkaXIpLmdldENvbXBvbmVudCgnRGlydCcpLmlzQmxvY2tlZCl7XHJcbiAgICAgICAgICAgIHJldCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RlcHBlZEJsb2NrID0gdGhpcy5nYW1lZmllbGQuZ2V0SnVtcEZpZWxkKGRpcikuZ2V0Q29tcG9uZW50KCdEaXJ0Jyk7XHJcbiAgICAgICAgd2hpY2hTdGVwID0gU3RlcC5EaXJ0O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnVHJhcGRvb3InOlxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ2Nhc2UgVHJhcGRvb3InKTtcclxuICAgICAgICBpZighdGhpcy5nYW1lZmllbGQuZ2V0SnVtcEZpZWxkKGRpcikuZ2V0Q29tcG9uZW50KCdUcmFwZG9vcicpLmlzQmxvY2tlZCl7XHJcbiAgICAgICAgICAgIHJldCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RlcHBlZEJsb2NrID0gdGhpcy5nYW1lZmllbGQuZ2V0SnVtcEZpZWxkKGRpcikuZ2V0Q29tcG9uZW50KCdUcmFwZG9vcicpO1xyXG4gICAgICAgIHdoaWNoU3RlcCA9IFN0ZXAuVHJhcGRvb3I7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdFbXB0eSc6XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnY2FzZSBFbXB0eScpO1xyXG4gICAgICAgIGlmKCF0aGlzLmdhbWVmaWVsZC5nZXRKdW1wRmllbGQoZGlyKS5nZXRDb21wb25lbnQoJ0VtcHR5JykuaXNCbG9ja2VkKXtcclxuICAgICAgICAgICAgcmV0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdGVwcGVkQmxvY2sgPSB0aGlzLmdhbWVmaWVsZC5nZXRKdW1wRmllbGQoZGlyKS5nZXRDb21wb25lbnQoJ0VtcHR5Jyk7XHJcbiAgICAgICAgd2hpY2hTdGVwID0gU3RlcC5FbXB0eTtcclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgJ1dhdGVyX0JvcmRlcic6XHJcbiAgICAgICAgaWYoIXRoaXMuZ2FtZWZpZWxkLmdldEp1bXBGaWVsZChkaXIpLmdldENvbXBvbmVudCgnRW1wdHknKS5pc0Jsb2NrZWQpe1xyXG4gICAgICAgICAgICByZXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0ZXBwZWRCbG9jayA9IHRoaXMuZ2FtZWZpZWxkLmdldEp1bXBGaWVsZChkaXIpLmdldENvbXBvbmVudCgnRW1wdHknKTtcclxuICAgICAgICB3aGljaFN0ZXAgPSBTdGVwLkVtcHR5O1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnUG9pc29uJzpcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdjYXNlIFBvaXNvbicpO1xyXG4gICAgICAgIGlmKCF0aGlzLmdhbWVmaWVsZC5nZXRKdW1wRmllbGQoZGlyKS5nZXRDb21wb25lbnQoJ1BvaXNvbicpLmlzQmxvY2tlZCl7XHJcbiAgICAgICAgICAgIHJldCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RlcHBlZEJsb2NrID0gdGhpcy5nYW1lZmllbGQuZ2V0SnVtcEZpZWxkKGRpcikuZ2V0Q29tcG9uZW50KCdQb2lzb24nKTtcclxuICAgICAgICB3aGljaFN0ZXAgPSBTdGVwLlBvaXNvbjtcclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgJ1N3aXRjaGVyJzpcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdjYXNlIFN3aXRjaGVyJyk7XHJcbiAgICAgICAgaWYoIXRoaXMuZ2FtZWZpZWxkLmdldEp1bXBGaWVsZChkaXIpLmdldENvbXBvbmVudCgnU3dpdGNoZXInKS5pc0Jsb2NrZWQpe1xyXG4gICAgICAgICAgICByZXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0ZXBwZWRCbG9jayA9IHRoaXMuZ2FtZWZpZWxkLmdldEp1bXBGaWVsZChkaXIpLmdldENvbXBvbmVudCgnU3dpdGNoZXInKTtcclxuICAgICAgICB3aGljaFN0ZXAgPSBTdGVwLlN3aXRjaGVyO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnU3Bpa2UnOlxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ2Nhc2UgU3Bpa2UnKTtcclxuICAgICAgICBpZighdGhpcy5nYW1lZmllbGQuZ2V0SnVtcEZpZWxkKGRpcikuZ2V0Q29tcG9uZW50KCdTcGlrZScpLmlzQmxvY2tlZCl7XHJcbiAgICAgICAgICAgIHJldCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RlcHBlZEJsb2NrID0gdGhpcy5nYW1lZmllbGQuZ2V0SnVtcEZpZWxkKGRpcikuZ2V0Q29tcG9uZW50KCdTcGlrZScpO1xyXG4gICAgICAgIHdoaWNoU3RlcCA9IFN0ZXAuU3Bpa2U7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnc3RlcHBlZEJsb2NrIGF1ZiBTcGlrZSBnZXNldHp0Jyk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0ZXBwZWRCbG9jayk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldCA9IHRydWU7XHJcbiAgICAgICAgYnJlYWs7XHJcbn0qL1xuXG4vKnZhciBkZXN0ZmllbGQgPSB0aGlzLmdhbWVmaWVsZC5nZXRKdW1wRmllbGQoZGlyKTsgLy8gRmllbGQgcGxheWVyIHdhbnRzIHRvIGp1bXAgYXRcclxuIGNvbnNvbGUubG9nKCdNOiB2YWxpZGF0ZW1Nb3ZlJyk7XHJcbiBjb25zb2xlLmxvZygnQmxvY2tUeXBlID0gJywgdGhpcy5nYW1lZmllbGQuZ2V0QmxvY2tUeXBlKHRoaXMuZ2FtZWZpZWxkLmdldEp1bXBGaWVsZChkaXIpKSk7XHJcbiB0aGlzLnN0ZXBwZWRCbG9jayA9IGRlc3RmaWVsZC5nZXRDb21wb25lbnQoJ0Jsb2NrJyk7XHJcbiBpZih0aGlzLnN0ZXBwZWRCbG9jayAhPT0gbnVsbCl7XHJcbiBpZih0aGlzLnN0ZXBwZWRCbG9jay5pc0Jsb2NrZWQpeyAgICAvLyBCbG9jayBpcy4uLmJsb2NrZWRcclxuIHJldHVybiBmYWxzZTtcclxuIH1cclxuIH0qL1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNjViOTFsbG1reEp0SmtocXNZekZwNzEnLCAnR3Jhc3MnKTtcbi8vIHNjcmlwdHNcXGdhbWVmaWVsZFxcYmxvY2tzXFxHcmFzcy5qc1xuXG52YXIgQmxvY2tUeXBlID0gcmVxdWlyZSgnVHlwZXMnKS5CbG9ja1R5cGU7XG52YXIgUGxheWVyTW92ZW1lbnRTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLlBsYXllck1vdmVtZW50U3RhdGU7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaXNCbG9ja2VkOiBmYWxzZSxcbiAgICAgICAgaGFzSXRlbTogZmFsc2UsXG5cbiAgICAgICAgYmxvY2t0eXBlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IEJsb2NrVHlwZS5Ob25lLFxuICAgICAgICAgICAgdHlwZTogQmxvY2tUeXBlXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXRlbToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMucGxheWVyT25Ub3AgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgb25TdGVwQ2FsbGJhY2s6IGZ1bmN0aW9uIG9uU3RlcENhbGxiYWNrKHBsYXllciwgZ2FtZSkge1xuICAgICAgICBjYy5sb2coJ006IG9uU3RlcENhbGxiYWNrIEdyYXNzJyk7XG4gICAgfSxcblxuICAgIGNvbGxpZGU6IGZ1bmN0aW9uIGNvbGxpZGUoKSB7fVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYTlkNWZoTXBEUkI3cm53Z3psMFkxOVonLCAnSXRlbScpO1xuLy8gc2NyaXB0c1xcZ2FtZW9iamVjdHNcXEl0ZW0uanNcblxuXG52YXIgSXRlbVR5cGUgPSByZXF1aXJlKCdUeXBlcycpLkl0ZW1UeXBlO1xudmFyIEl0ZW1TdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLkl0ZW1TdGF0ZTtcbnZhciBJdGVtQWN0aXZpdHlTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLkl0ZW1BY3Rpdml0eVN0YXRlO1xuXG52YXIgcmlzZVkgPSA1MDtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpdGVtdHlwZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBJdGVtVHlwZS5Ob25lLFxuICAgICAgICAgICAgdHlwZTogSXRlbVR5cGVcbiAgICAgICAgfSxcblxuICAgICAgICBpdGVtc3RhdGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogSXRlbVN0YXRlLlBpY2thYmxlLFxuICAgICAgICAgICAgdHlwZTogSXRlbVN0YXRlXG4gICAgICAgIH0sXG5cbiAgICAgICAgYWN0aXZpdHlzdGF0ZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBJdGVtQWN0aXZpdHlTdGF0ZS5JZGxlLFxuICAgICAgICAgICAgdHlwZTogSXRlbUFjdGl2aXR5U3RhdGVcbiAgICAgICAgfSxcblxuICAgICAgICBjb2xsZWN0UmFkaXVzOiAwLFxuICAgICAgICBpdGVtVmFsdWU6IDAsIC8vIFZhbHVlIG9mIHRoZSBpdGVtIHdoZW4gcGlja2VkIHVwKHB1cmUgc2NvcmUsIHNjb3JlIG11bHRpcGxpZXIpXG4gICAgICAgIGl0ZW1UaW1lcjogMCxcblxuICAgICAgICBhY3RpdmF0aW9uc291bmQ6IHsgLy8gRHJhZyByaWdodCBhdWRpbyBoZXJlLlxuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9LFxuXG4gICAgZGVzdHJveUl0ZW06IGZ1bmN0aW9uIGRlc3Ryb3lJdGVtKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkl0ZW10eXBlIHRvIGRlc3Ryb3k6IFwiICsgdGhpcy5pdGVtdHlwZS50b1N0cmluZygpKTtcbiAgICAgICAgY29uc29sZS5sb2coSXRlbVR5cGVbdGhpcy5pdGVtdHlwZV0pO1xuICAgICAgICBzd2l0Y2ggKHRoaXMuaXRlbXR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuU2xvd2VyOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5BbnRpZG90ZTpcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuQ29pbjpcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuU3RhcjpcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uUGlja1VwQ2FsbGJhY2s6IGZ1bmN0aW9uIG9uUGlja1VwQ2FsbGJhY2socGxheWVyLCBnYW1lKSB7XG4gICAgICAgIHRoaXMuaXRlbXN0YXRlID0gSXRlbVN0YXRlLlBpY2tlZDtcbiAgICAgICAgdGhpcy5hY3Rpdml0eXN0YXRlID0gSXRlbUFjdGl2aXR5U3RhdGUuQWN0aXZlO1xuICAgICAgICAvLyBQZXJmb3JtIHRoZSBhY3Rpb24gdGhlIGl0ZW0gcHJvZHVjZXMoY2hhbmdlIHBsYXllciBvciBlbnZpcm9ubWVudClcbiAgICAgICAgc3dpdGNoICh0aGlzLml0ZW10eXBlKSB7XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkFudGlkb3RlOlxuICAgICAgICAgICAgICAgIHBsYXllci5pc1BvaXNvbmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcGxheWVyLnBvaXNvblRtcCA9IHBsYXllci5wb2lzb25UaW1lcjsgLy9yZXNldCB0aW1tZXJcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuQ29pbjpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnR0FNRTogJywgZ2FtZS5uYW1lKTtcbiAgICAgICAgICAgICAgICBnYW1lLmluY3JlbWVudFNjb3JlKDUpO1xuICAgICAgICAgICAgICAgIGdhbWUuc2NvcmVMYWJlbC5zdHJpbmcgPSBnYW1lLnNjb3JlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlN0YXI6XG4gICAgICAgICAgICAgICAgcGxheWVyLmlzUG9pc29uZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuaXNJbnZpbmNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuU2xvd2VyOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU0VUIFNXQVBFRCBUUlVFXCIpO1xuICAgICAgICAgICAgICAgIHBsYXllci5pc1Nsb3dlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBpY2tlZENhbGxiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5waWNrZWQsIHRoaXMpO1xuICAgICAgICB2YXIgc291bmRjYWxsYmFjayA9IGNjLmNhbGxGdW5jKHRoaXMucGxheVNvdW5kLCB0aGlzKTtcbiAgICAgICAgLy8gUGVyZm9ybSBpdGVtIGFuaW1hdGlvbiBhbmQgZGVzdHJveSBpdFxuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGNjLnNwYXduKHRoaXMuYXNzZW1ibGVQaWNrVXBBY3Rpb24oKSwgc291bmRjYWxsYmFjayksIHBpY2tlZENhbGxiYWNrKSk7XG4gICAgfSxcblxuICAgIGFzc2VtYmxlUGlja1VwQWN0aW9uOiBmdW5jdGlvbiBhc3NlbWJsZVBpY2tVcEFjdGlvbigpIHtcbiAgICAgICAgdGhpcy5hY3Rpdml0eXN0YXRlID0gSXRlbUFjdGl2aXR5U3RhdGUuQWN0aXZlO1xuICAgICAgICAvLyBSaXNlLUFuaW1hdGlvbiBmb3IgaXRlbXMgdG8gc2hvdyB0aGV5IGhhdmUgYmVlbiBwaWNrZWQgdXAgICAgICAgXG4gICAgICAgIHZhciByaXNlUG9pbnQgPSBjYy5wKHRoaXMubm9kZS5nZXRQb3NpdGlvblgoKSwgdGhpcy5ub2RlLmdldFBvc2l0aW9uWSgpICsgcmlzZVkpO1xuICAgICAgICB2YXIgZmFkZSA9IGNjLmZhZGVPdXQodGhpcy5nZXRJdGVtQW5pbWF0aW9uVGltZSgpKTsgLy8gTGV0IGl0ZW0gZmFkZSBkdXJpbmcgYW5pbWF0aW9uXG4gICAgICAgIHZhciBhbmltID0gbnVsbDtcblxuICAgICAgICBzd2l0Y2ggKHRoaXMuaXRlbXR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuU3RhcjpcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuQ29pbjpcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuQW50aWRvdGU6XG4gICAgICAgICAgICAgICAgYW5pbSA9IGNjLm1vdmVCeSh0aGlzLmdldEl0ZW1BbmltYXRpb25UaW1lKCksIHJpc2VQb2ludCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNjLnNwYXduKGZhZGUsIGFuaW0pO1xuICAgIH0sXG5cbiAgICBnZXRJdGVtQW5pbWF0aW9uVGltZTogZnVuY3Rpb24gZ2V0SXRlbUFuaW1hdGlvblRpbWUodHlwZSkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMuaXRlbXR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuQW50aWRvdGU6XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkNvaW46XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlN0YXI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDEuNTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBwaWNrZWQ6IGZ1bmN0aW9uIHBpY2tlZCgpIHtcbiAgICAgICAgdGhpcy5hY3Rpdml0eXN0YXRlID0gSXRlbUFjdGl2aXR5U3RhdGUuRXhwaXJlZDtcbiAgICAgICAgdGhpcy5kZXN0cm95SXRlbSgpO1xuICAgIH0sXG5cbiAgICBwbGF5U291bmQ6IGZ1bmN0aW9uIHBsYXlTb3VuZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZhdGlvbnNvdW5kICE9PSBudWxsKSBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuYWN0aXZhdGlvbnNvdW5kLCBmYWxzZSk7XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnN2M0NWV0SUdVdEJDNVZia0FKSjJVQ1QnLCAnTGV2ZWwnKTtcbi8vIHNjcmlwdHNcXGdhbWVmaWVsZFxcTGV2ZWwuanNcblxuLy9MZXZlbFxudmFyIEwxMUMgPSBbWzcsIDEsIDEsIDYsIDEsIDEsIDddLCBbNywgMSwgMSwgMSwgMSwgN10sIFs3LCA3LCAxLCA2LCAxLCA3LCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddLCBbNywgNywgMSwgNiwgMSwgNywgN10sIFs3LCAxLCAxLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDYsIDEsIDEsIDddLCBbNywgNiwgMSwgMSwgNiwgN11dO1xuXG52YXIgTDExSSA9IFtbMCwgOCwgMCwgMCwgMCwgOCwgMF0sIFswLCA4LCAwLCAwLCA4LCAwXSwgWzAsIDAsIDgsIDAsIDgsIDAsIDBdLCBbMCwgOCwgMCwgMCwgOCwgMF0sIFswLCAwLCA4LCAwLCA4LCAwLCAwXSwgWzAsIDgsIDAsIDAsIDgsIDBdLCBbMCwgOCwgMCwgMCwgMCwgOCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwXV07XG5cbnZhciBMMTJDID0gW1s3LCAxLCAxLCAxLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddLCBbNywgMSwgMSwgMSwgMSwgMSwgN10sIFs3LCAxLCAxLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDEsIDEsIDQsIDddLCBbNywgMSwgMSwgMSwgMSwgN10sIFs3LCAxLCAxLCAzLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddXTtcblxudmFyIEwxMkkgPSBbWzAsIDQsIDcsIDAsIDAsIDAsIDBdLCBbMCwgNCwgNywgMCwgMCwgMF0sIFswLCA0LCA0LCA3LCAwLCAwLCAwXSwgWzAsIDQsIDQsIDcsIDksIDBdLCBbMCwgNCwgNCwgNCwgNywgMCwgMF0sIFswLCAwLCAwLCAwLCA2LCAwXSwgWzAsIDAsIDcsIDAsIDcsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF1dO1xuXG52YXIgTDEzQyA9IFtbNywgMSwgNSwgMSwgMSwgMSwgN10sIFs3LCA2LCAxLCAxLCAxLCA3XSwgWzcsIDEsIDcsIDEsIDEsIDEsIDddLCBbNywgMSwgNywgMSwgMSwgN10sIFs3LCAxLCAxLCA3LCAxLCAxLCA3XSwgWzcsIDEsIDEsIDcsIDYsIDddLCBbNywgMSwgMSwgNywgMSwgMSwgN10sIFs3LCAxLCA3LCAxLCAxLCA3XV07XG5cbnZhciBMMTNJID0gW1swLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDQsIDcsIDAsIDBdLCBbMCwgOSwgMCwgNCwgMCwgNywgMF0sIFswLCA5LCAwLCA0LCAwLCAwXSwgWzAsIDAsIDAsIDAsIDQsIDAsIDBdLCBbMCwgMCwgMSwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDIsIDAsIDBdXTtcblxudmFyIEwyMUMgPSBbWzcsIDIsIDIsIDIsIDIsIDIsIDddLCBbNywgMiwgMiwgMiwgMiwgN10sIFs3LCAyLCAyLCAyLCAyLCAyLCA3XSwgWzcsIDIsIDIsIDIsIDIsIDddLCBbNywgNywgMiwgMiwgMiwgNywgN10sIFs3LCA2LCA2LCA2LCA2LCA3XSwgWzcsIDIsIDIsIDIsIDIsIDIsIDddLCBbNywgMiwgMiwgMiwgMiwgN11dO1xuXG52YXIgTDIxSSA9IFtbMCwgNywgMCwgNywgNCwgNywgMF0sIFswLCA3LCAzLCAwLCA3LCAwXSwgWzAsIDcsIDAsIDcsIDMsIDcsIDBdLCBbMCwgOSwgNywgNywgOSwgMF0sIFswLCAwLCA5LCA0LCA5LCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgOSwgNywgNiwgNywgOSwgMF0sIFswLCA5LCA5LCA5LCA5LCAwXV07XG5cbnZhciBMMjJDID0gW1s3LCA0LCA0LCA3LCA0LCA0LCA3XSwgWzcsIDQsIDcsIDcsIDIsIDddLCBbNywgNywgMiwgNywgNCwgNywgN10sIFs3LCA0LCA3LCA3LCA0LCA3XSwgWzcsIDcsIDQsIDcsIDIsIDcsIDddLCBbNywgNCwgNywgNywgNCwgN10sIFs3LCA3LCAyLCA3LCA0LCA3LCA3XSwgWzcsIDQsIDcsIDcsIDQsIDddXTtcblxudmFyIEwyMkkgPSBbWzAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgNCwgMF0sIFswLCAwLCA0LCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgNCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDQsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF1dO1xuXG52YXIgTDIzQyA9IFtbNywgMiwgMiwgMiwgMiwgMiwgN10sIFs3LCA1LCA1LCA1LCA1LCA3XSwgWzcsIDMsIDIsIDIsIDIsIDMsIDddLCBbNywgMywgMiwgMiwgMywgN10sIFs3LCAzLCAzLCAyLCAyLCAyLCA3XSwgWzcsIDMsIDIsIDMsIDIsIDddLCBbNywgMywgMiwgMywgMywgMiwgN10sIFs3LCAyLCAyLCAzLCAyLCA3XV07XG5cbnZhciBMMjNJID0gW1swLCA5LCA5LCA2LCA5LCA5LCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgOSwgMywgOSwgMCwgMF0sIFswLCAwLCAwLCAzLCAwLCAwXSwgWzAsIDAsIDAsIDksIDMsIDAsIDBdLCBbMCwgMCwgMiwgMCwgMywgMF0sIFswLCAwLCAwLCAwLCAwLCAzLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdXTtcblxudmFyIEwzMUMgPSBbWzcsIDMsIDUsIDMsIDUsIDMsIDddLCBbNywgNCwgMywgMywgNCwgN10sIFs3LCAzLCA2LCAzLCA2LCAzLCA3XSwgWzcsIDMsIDQsIDQsIDMsIDddLCBbNywgMywgMywgNiwgMywgMywgN10sIFs3LCAzLCAyLCA0LCAzLCA3XSwgWzcsIDMsIDQsIDMsIDYsIDMsIDddLCBbNywgMywgMiwgMywgMiwgN11dO1xuXG52YXIgTDMxSSA9IFtbMCwgNCwgMCwgNCwgMCwgMCwgMF0sIFswLCAwLCA0LCA0LCAwLCAwXSwgWzAsIDQsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMiwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAxLCAwLCAwXSwgWzAsIDAsIDIsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCA0LCAwLCAwLCAzLCAwXV07XG5cbnZhciBMMzJDID0gW1s3LCA3LCAyLCA3LCAyLCA3LCA3XSwgWzcsIDYsIDcsIDcsIDYsIDddLCBbNywgNywgNCwgMywgNCwgNywgN10sIFs3LCA1LCA2LCA2LCA1LCA3XSwgWzcsIDYsIDcsIDIsIDcsIDYsIDddLCBbNywgNCwgNywgNiwgNCwgN10sIFs3LCA3LCAyLCA3LCAyLCA3LCA3XSwgWzcsIDMsIDIsIDcsIDIsIDddXTtcblxudmFyIEwzMkkgPSBbWzAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgNCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDQsIDksIDAsIDAsIDAsIDBdLCBbMCwgMiwgMSwgMCwgMSwgMF1dO1xuXG52YXIgTDMzQyA9IFtbNywgMSwgNiwgMSwgNiwgMSwgN10sIFs3LCAxLCAzLCAxLCAzLCA3XSwgWzcsIDYsIDEsIDYsIDEsIDYsIDddLCBbNywgMSwgNCwgNCwgMSwgN10sIFs3LCA1LCAzLCA2LCAzLCA1LCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddLCBbNywgMSwgMSwgMSwgMSwgMSwgN10sIFs3LCAxLCAxLCAxLCAxLCA3XV07XG5cbnZhciBMMzNJID0gW1swLCAwLCAzLCAwLCA0LCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgNCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgOSwgOSwgOSwgOSwgMF0sIFswLCA5LCA5LCA5LCA5LCA5LCAwXSwgWzAsIDAsIDEsIDIsIDAsIDBdXTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgTDExQzogTDExQyxcbiAgICBMMTFJOiBMMTFJLFxuICAgIEwxMkM6IEwxMkMsXG4gICAgTDEySTogTDEySSxcbiAgICBMMTNDOiBMMTNDLFxuICAgIEwxM0k6IEwxM0ksXG4gICAgTDIxQzogTDIxQyxcbiAgICBMMjFJOiBMMjFJLFxuICAgIEwyMkM6IEwyMkMsXG4gICAgTDIySTogTDIySSxcbiAgICBMMjNDOiBMMjNDLFxuICAgIEwyM0k6IEwyM0ksXG4gICAgTDMxQzogTDMxQyxcbiAgICBMMzFJOiBMMzFJLFxuICAgIEwzMkM6IEwzMkMsXG4gICAgTDMySTogTDMySSxcbiAgICBMMzNDOiBMMzNDLFxuICAgIEwzM0k6IEwzM0lcbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcxMDkxNWt5K2pCRnJJc0FFL2xueVdxTicsICdNZW51QnV0dG9uQ2FsbGJhY2tzJyk7XG4vLyBzY3JpcHRzXFxzY2VuZXNjcmlwdHNcXE1lbnVCdXR0b25DYWxsYmFja3MuanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIGJ1dHRvbkF1ZGlvOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG5cbiAgICBzdGFydENvbnRyb2xDYWxsYmFjazogZnVuY3Rpb24gc3RhcnRDb250cm9sQ2FsbGJhY2soKSB7XG4gICAgICAgIHZhciBvbkxhdW5jaGVkID0gZnVuY3Rpb24gb25MYXVuY2hlZCgpIHtcbiAgICAgICAgICAgIC8vdXNlIHRoaXMgZm9yIGNhbGxiYWNrcyBvbiBsb2FkaW5nXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2NlbmUgbGF1bmNoZWQnKTtcbiAgICAgICAgfTtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdHYW1lU2NlbmUnLCBvbkxhdW5jaGVkKTtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmJ1dHRvbkF1ZGlvLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIGFib3V0Q29udHJvbENhbGxiYWNrOiBmdW5jdGlvbiBhYm91dENvbnRyb2xDYWxsYmFjaygpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdBYm91dCcpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuYnV0dG9uQXVkaW8sIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgdHV0b3JpYWxDb250cm9sQ2FsbGJhY2s6IGZ1bmN0aW9uIHR1dG9yaWFsQ29udHJvbENhbGxiYWNrKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ1R1dG9yaWFsJyk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5idXR0b25BdWRpbywgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBxdWl0Q29udHJvbENhbGxiYWNrOiBmdW5jdGlvbiBxdWl0Q29udHJvbENhbGxiYWNrKCkge1xuICAgICAgICAvL2NjLmRpcmVjdG9yLmVuZCgpOyAvL1RPRE86IGhvdyB0byBlbmQgdGhlIGdhbWU/XG4gICAgICAgIGNjLmxvZyhcIlF1aXQgcHJlc3NlZC5cIik7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5idXR0b25BdWRpbywgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBiYWNrQ29udHJvbENhbGxiYWNrOiBmdW5jdGlvbiBiYWNrQ29udHJvbENhbGxiYWNrKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ1N0YXJ0bWVudScpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuYnV0dG9uQXVkaW8sIGZhbHNlKTtcbiAgICB9XG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZGZjZmV6QUFjSkFBTFhQaUlIVkpqMmQnLCAnUGxheWVyJyk7XG4vLyBzY3JpcHRzXFxnYW1lb2JqZWN0c1xcUGxheWVyLmpzXG5cbnZhciBHYW1lU3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5HYW1lU3RhdGU7XG52YXIgUGxheWVyTW92ZW1lbnRTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLlBsYXllck1vdmVtZW50U3RhdGU7XG52YXIgUGxheWVyU3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5QbGF5ZXJTdGF0ZTtcblxudmFyIGV4cGxvZGV0aW1lID0gMC4yO1xudmFyIHJpc2VEZWF0aFkgPSAyNTtcblxudmFyIGFuaW1hdGlvbk5lZWRzVXBkYXRlID0gZmFsc2U7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gUGxheWVyIHNwYXducyBpbiBhIHN0YW5kaW5nIHN0YXRlXG4gICAgICAgIG1vdmVzdGF0ZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBQbGF5ZXJNb3ZlbWVudFN0YXRlLlN0YW5kaW5nLFxuICAgICAgICAgICAgdHlwZTogUGxheWVyTW92ZW1lbnRTdGF0ZVxuICAgICAgICB9LFxuXG4gICAgICAgIGlzSW52aW5jaWJsZTogZmFsc2UsIC8vIFBsYXllciBwaWNrZWQgdXAgYW4gaXRlbSB3aGljaCBtYWRlIGhpbSB1bmtpbGxhYmxlXG4gICAgICAgIGlzUG9pc29uZWQ6IGZhbHNlLFxuICAgICAgICBpc0FsaXZlOiBmYWxzZSxcbiAgICAgICAgaXNTd2FwZWQ6IGZhbHNlLCAvL1BsYXllciBzdGFuZHMgb24gYSBTd2l0Y2hlciAvL1RPRE86IG51dHpsb3MgZGEgbmllIHZlcndlbmRldCBpbiBwbGF5ZXJcbiAgICAgICAgaXNTbG93ZWQ6IGZhbHNlLFxuXG4gICAgICAgIHBvaXNvblRpbWVyOiAwLFxuICAgICAgICBpbnZpbmNpYmlsdHlUaW1lcjogMCxcblxuICAgICAgICBkaXI6IDAsIC8vIE5leHQgUG9zaXRpb24gcGxheWVyIGlzIGp1bXBpbmcgdG8gMSA6IGxlZnQgIC0xOiByaWdodFxuXG4gICAgICAgIGFycmF5UG9zWDogMCwgLy9Qb3NpdGlvbiBpbiB0aGUgYXJyYXkgZ2l2ZW4gd2l0aCByb3cgYW5kIGNvbHVtblxuICAgICAgICBhcnJheVBvc1k6IDAsXG5cbiAgICAgICAganVtcFRpbWU6IDAsIC8vIFRpbWUgZm9yIGp1bXBpbmcgYWN0aW9uIHRvIHJ1blxuICAgICAgICBmYWxsVGltZTogMCwgLy8gc2FtZTogZmFsbGluZ1xuXG4gICAgICAgIC8vIEF0bGFzIGhvbGRpbiBhbGwgc3ByaXRlcyBvZiB0aGUgcGxheWVyLlxuICAgICAgICBwbGF5ZXJhdGxhczoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlQXRsYXNcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBQbGF5ZXIgQXVkaW9zXG4gICAgICAgIGp1bXBBdWRpbzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcblxuICAgICAgICBkZWF0aEF1ZGlvOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuXG4gICAgICAgIGZhbGxBdWRpbzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcblxuICAgICAgICBkcmlua0F1ZGlvOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuXG4gICAgICAgIHBvaXNvbmVkQXVkaW86IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gR2FtZSByZWZlcmVuY2UgdG8gcGFzcyBwbGF5ZXJcbiAgICAgICAgZ2FtZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIC8vcmVnaXN0ZXIgcGxheWVyIGF0IGdhbWUgZm9yIHByb2Nlc3NpbmcgcGxheWVyIGxvZ2ljXG4gICAgICAgIHRoaXMuZ2FtZS5nZXRDb21wb25lbnQoJ0dhbWUnKS5wbGF5ZXIgPSB0aGlzO1xuXG4gICAgICAgIC8vSW5pdCB0aW1lcnNcbiAgICAgICAgdGhpcy5wb2lzb25UbXAgPSB0aGlzLnBvaXNvblRpbWVyO1xuICAgICAgICB0aGlzLmludmluY2liaWx0eVRtcCA9IHRoaXMuaW52aW5jaWJpbHR5VGltZXI7IC8vSGVucmkgZnJhZ2VuIG9iIG1hbiBwcm9wZXJ0aWVzIHNwZWljaGVybiBrYW5uXG5cbiAgICAgICAgdGhpcy5tb3Zlc3RhdGUgPSBQbGF5ZXJNb3ZlbWVudFN0YXRlLlN0YW5kaW5nO1xuICAgICAgICB0aGlzLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNBbGl2ZSA9IHRydWU7XG4gICAgICAgIC8vdGhpcy5vbGREZXN0ID0gdGhpcy5nYW1lLmdldENvbXBvbmVudCgnR2FtZScpLmdhbWVmaWVsZC5nYW1lRmllbGRbZ2FtZUZpZWxkLmxlbmd0aC0xXVszXTtcblxuICAgICAgICB0aGlzLm9mZnNldFkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQgLyAyOyAvLyBPZmZzZXQgdG8gc2V0IHRoZSBwbGF5ZXIgb24gdG9wIG9mIGJsb2Nrc1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9ucG9zID0gY2MucCgwLCAwKTtcblxuICAgICAgICAvL0xvYWQgZGF0YSByZWxldmFudCB0byBwbGF5ZXIgICAtLSAhISBMRUFWRSBBVCBFTkQgT0YgVEhJUyBGVU5DVElPTiAhISAtLVxuICAgICAgICB0aGlzLmdhbWUuZ2V0Q29tcG9uZW50KCdHYW1lJykub25QbGF5ZXJMb2FkQ2FsbGJhY2soKTtcbiAgICB9LFxuXG4gICAga2lsbDogZnVuY3Rpb24ga2lsbCgpIHtcbiAgICAgICAgdGhpcy5pc0ludmluY2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc0FsaXZlID0gZmFsc2U7XG4gICAgICAgIHZhciBnYW1lc3RhdGVjYWxsYmFjayA9IGNjLmNhbGxGdW5jKHRoaXMuY2hhbmdlR2FtZVN0YXRlLCB0aGlzKTtcbiAgICAgICAgdmFyIHNvdW5kY2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLnBsYXlTb3VuZCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2Muc3Bhd24odGhpcy5kZWZvcm0oKSwgdGhpcy5hc3NlbWJsZUFjdGlvbigpKSwgZ2FtZXN0YXRlY2FsbGJhY2ssIHNvdW5kY2FsbGJhY2spKTtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUuc3RvcEFsbEVmZmVjdHMoKTsgLy9UT0RPIGV2dGwgYWxzIGNhbGxiYWNrXG4gICAgfSxcblxuICAgIGZhbGw6IGZ1bmN0aW9uIGZhbGwoKSB7XG4gICAgICAgIHRoaXMuaXNJbnZpbmNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMubW92ZXN0YXRlID0gUGxheWVyTW92ZW1lbnRTdGF0ZS5GYWxsaW5nO1xuICAgICAgICAvL3ZhciBnYW1lc3RhdGVjYWxsYmFjayA9IGNjLmNhbGxGdW5jKHRoaXMuY2hhbmdlR2FtZUZhbGxTdGF0ZSx0aGlzKTtcbiAgICAgICAgdmFyIGtpbGxjYWxsYmFjayA9IGNjLmNhbGxGdW5jKHRoaXMua2lsbCwgdGhpcyk7XG4gICAgICAgIHZhciBzb3VuZGNhbGxiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5wbGF5U291bmQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGNjLnNwYXduKHRoaXMuZGVmb3JtKCksIHRoaXMuYXNzZW1ibGVBY3Rpb24oKSksIHNvdW5kY2FsbGJhY2ssIGtpbGxjYWxsYmFjaykpO1xuICAgICAgICB0aGlzLmlzQWxpdmUgPSBmYWxzZTsgLy9zZXQgaGVyZSBiZWNhdXNlIGFsaXZlIGltcGFjdHMgZGVhdGggYW5pbS5cbiAgICAgICAgY2MuYXVkaW9FbmdpbmUuc3RvcEFsbEVmZmVjdHMoKTtcbiAgICB9LFxuXG4gICAgY2hhbmdlR2FtZVN0YXRlOiBmdW5jdGlvbiBjaGFuZ2VHYW1lU3RhdGUoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0FsaXZlKSB0aGlzLmdhbWUuZ2V0Q29tcG9uZW50KCdHYW1lJykuc3RhdGUgPSBHYW1lU3RhdGUuR2FtZU92ZXI7XG4gICAgfSxcbiAgICBjaGFuZ2VHYW1lRmFsbFN0YXRlOiBmdW5jdGlvbiBjaGFuZ2VHYW1lRmFsbFN0YXRlKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkFsaXZlOiBcIiArIHRoaXMuaXNBbGl2ZSk7XG4gICAgICAgIGlmICh0aGlzLmlzQWxpdmUpIHRoaXMuaXNBbGl2ZSA9IGZhbHNlO1xuICAgICAgICBjb25zb2xlLmxvZygnQ2hhbmdlIEdhbWVTdGF0ZTogJywgdGhpcy5nYW1lLmdldENvbXBvbmVudCgnR2FtZScpLnN0YXRlKTtcbiAgICAgICAgdGhpcy5nYW1lLmdldENvbXBvbmVudCgnR2FtZScpLnN0YXRlID0gR2FtZVN0YXRlLkdhbWVPdmVyO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmdhbWUuZ2V0Q29tcG9uZW50KCdHYW1lJykuc3RhdGUpO1xuICAgIH0sXG5cbiAgICBjaGFuZ2VQbGF5ZXJTdGF0ZTogZnVuY3Rpb24gY2hhbmdlUGxheWVyU3RhdGUoKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5tb3Zlc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgUGxheWVyTW92ZW1lbnRTdGF0ZS5KdW1waW5nOlxuICAgICAgICAgICAgICAgIHRoaXMubW92ZXN0YXRlID0gUGxheWVyTW92ZW1lbnRTdGF0ZS5TdGFuZGluZztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBibG9ja1N0ZXBwZWQ6IGZ1bmN0aW9uIGJsb2NrU3RlcHBlZChwbGF5ZXIsIGdhbWUpIHtcbiAgICAgICAgdGhpcy5nQW1lID0gZ2FtZTtcbiAgICAgICAgdmFyIHN0ZXBwZWRCbG9jayA9IHRoaXMuZGVzdGZpZWxkLmdldENvbXBvbmVudCh0aGlzLmRlc3RmaWVsZC5uYW1lKTtcbiAgICAgICAgY29uc29sZS5sb2coJ1NURVBQRUQgQkxPQ0s6ICcsIHN0ZXBwZWRCbG9jayk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuZGVzdGZpZWxkLm5hbWUpO1xuICAgICAgICBzdGVwcGVkQmxvY2sub25TdGVwQ2FsbGJhY2sodGhpcywgZ2FtZSk7XG4gICAgICAgIHZhciBpdGVtID0gc3RlcHBlZEJsb2NrLmdldENvbXBvbmVudEluQ2hpbGRyZW4oJ0l0ZW0nKTtcbiAgICAgICAgaWYgKGl0ZW0gIT09IG51bGwpIGl0ZW0ub25QaWNrVXBDYWxsYmFjayh0aGlzLCB0aGlzLmdBbWUpO1xuICAgIH0sXG4gICAgLy9cbiAgICAvLyBNb3ZlbWVudCBhbmQgQWN0aW9uc1xuICAgIC8vXG5cbiAgICAvL0NhbGxlZCBldmVyeXRpbWUgYSB0aGUgZmlndXJlIGlzIG1vdmVkIGJ5IHByZXNzaW5nIEEgb3IgRFxuICAgIG1vdmU6IGZ1bmN0aW9uIG1vdmUoZGVzdGZpZWxkLCBnYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQWxpdmUgPT09IGZhbHNlKSByZXR1cm47XG4gICAgICAgIHRoaXMub2xkRGVzdCA9IHRoaXMuZGVzdGZpZWxkO1xuICAgICAgICB0aGlzLmRlc3RmaWVsZCA9IGRlc3RmaWVsZDsgLy8gRGlyZWN0aW9uIHBsYXllcnMgd2FudHMgdG8gbW92ZSB0aGUgZmlndXJlKC0xIG9yIDEpXG4gICAgICAgIHN3aXRjaCAodGhpcy5tb3Zlc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgUGxheWVyTW92ZW1lbnRTdGF0ZS5TdGFuZGluZzpcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVzdGF0ZSA9IFBsYXllck1vdmVtZW50U3RhdGUuSnVtcGluZztcblxuICAgICAgICAgICAgICAgIHZhciBzb3VuZENhbGxiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5wbGF5U291bmQsIHRoaXMpO1xuICAgICAgICAgICAgICAgIHZhciBwbGF5ZXJzdGF0ZUNhbGxiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5jaGFuZ2VQbGF5ZXJTdGF0ZSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgdmFyIGJsb2Nrc3RlcENhbGxiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5ibG9ja1N0ZXBwZWQsIHRoaXMsIGdhbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3dpdGNoUGxheWVyQXBwZWFyYW5jZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGVzdGluYXRpb25Qb3MoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2Muc3Bhd24odGhpcy5kZWZvcm0oKSwgdGhpcy5hc3NlbWJsZUFjdGlvbigpKSwgYmxvY2tzdGVwQ2FsbGJhY2ssIHNvdW5kQ2FsbGJhY2ssIHBsYXllcnN0YXRlQ2FsbGJhY2spKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLkp1bXBpbmc6XG4gICAgICAgICAgICBjYXNlIFBsYXllck1vdmVtZW50U3RhdGUuRmFsbGluZzpcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0RGVzdGluYXRpb25Qb3M6IGZ1bmN0aW9uIHNldERlc3RpbmF0aW9uUG9zKCkge1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9ucG9zLnggPSB0aGlzLmRlc3RmaWVsZC5nZXRQb3NpdGlvblgoKTtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbnBvcy55ID0gdGhpcy5kZXN0ZmllbGQuZ2V0UG9zaXRpb25ZKCkgKyB0aGlzLm9mZnNldFk7XG4gICAgfSxcblxuICAgIHN3aXRjaFBsYXllckFwcGVhcmFuY2U6IGZ1bmN0aW9uIHN3aXRjaFBsYXllckFwcGVhcmFuY2UoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlZCA9IHRoaXMudXBkYXRlQW5pbWF0aW9uKCk7XG4gICAgICAgIGlmICh0aGlzLnVwZGF0ZWQpIC8vIGlmIGFuaW1hdGlvbnMgaXMgcnVubmluZyBkb250IGdvIHRvIHNwcml0ZSBmcmFtZSBjaGFuZ2luZ1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5kaXIgPCAwKSB7XG4gICAgICAgICAgICAvLyBQbGF5ZXIgbG9va3MgbGVmdFxuICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5zcHJpdGVGcmFtZSA9IHRoaXMucGxheWVyYXRsYXMuZ2V0U3ByaXRlRnJhbWUoXCJwbGF5ZXJfbGVmdFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSkuc3ByaXRlRnJhbWUgPSB0aGlzLnBsYXllcmF0bGFzLmdldFNwcml0ZUZyYW1lKFwicGxheWVyX3JpZ2h0XCIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGFzc2VtYmxlQWN0aW9uOiBmdW5jdGlvbiBhc3NlbWJsZUFjdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBbGl2ZSA9PT0gZmFsc2UpIC8vUGxheWVyIGRlYWQgLT4gYWN0aW9uIFRPRE86IHZlcnNhdXQgZmFsbGVuIGFuaW1hdGlvblxuICAgICAgICAgICAgcmV0dXJuIGNjLm1vdmVCeShleHBsb2RldGltZSwgY2MucCgwLCByaXNlRGVhdGhZKSk7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLm1vdmVzdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLlN0YW5kaW5nOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLkZhbGxpbmc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNjLm1vdmVUbyh0aGlzLmZhbGxUaW1lLCBjYy5wKHRoaXMubm9kZS5nZXRQb3NpdGlvbigpLngsIDApKS5lYXNpbmcoY2MuZWFzZUN1YmljQWN0aW9uSW4oKSk7XG5cbiAgICAgICAgICAgIGNhc2UgUGxheWVyTW92ZW1lbnRTdGF0ZS5KdW1waW5nOlxuICAgICAgICAgICAgICAgIC8vIFBvaW50cyBmb3JtaW5nIHRoZSBiZXppZXJjdXJ2ZVxuICAgICAgICAgICAgICAgIHZhciBiZXppZXIgPSBbdGhpcy5ub2RlLmdldFBvc2l0aW9uKCksIHRoaXMuZGVzdGluYXRpb25wb3MsIHRoaXMuZGVzdGluYXRpb25wb3NdO1xuICAgICAgICAgICAgICAgIHJldHVybiBjYy5iZXppZXJUbyh0aGlzLmp1bXBUaW1lLCBiZXppZXIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRlZm9ybTogZnVuY3Rpb24gZGVmb3JtKCkge1xuICAgICAgICBpZiAodGhpcy5pc0FsaXZlID09PSBmYWxzZSkgLy9QbGF5ZXIgZGVhZCAtPiBkZWZvcm1cbiAgICAgICAgICAgIHJldHVybiBjYy5zZXF1ZW5jZShjYy5zY2FsZVRvKGV4cGxvZGV0aW1lLCAxLjMsIDEuMyksIGNjLnNjYWxlVG8oZXhwbG9kZXRpbWUsIDAuMCwgMC4wKSk7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLm1vdmVzdGF0ZSkgey8vIFBsYXllciBpbiBhIG1vdmluZyBzdGF0ZSAtPiBhY3Rpb25cblxuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLkp1bXBpbmc6XG4gICAgICAgICAgICAgICAgdmFyIHNjYWxldGltZSA9IHRoaXMuanVtcFRpbWUgKiAwLjU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNjLnNlcXVlbmNlKGNjLnNjYWxlVG8oc2NhbGV0aW1lLCAxLCAxLjEpLCBjYy5zY2FsZVRvKHNjYWxldGltZSwgMSwgMC45KSwgY2Muc2NhbGVUbyhzY2FsZXRpbWUsIDEsIDEuMCkpO1xuXG4gICAgICAgICAgICBjYXNlIFBsYXllck1vdmVtZW50U3RhdGUuRmFsbGluZzpcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuc2V0TG9jYWxaT3JkZXIodGhpcy5kZXN0ZmllbGQuZ2V0TG9jYWxaT3JkZXIoKSk7IC8vVE9ETzogZmFsbCB3aXJkIHNjaG9uIHfDpGhyZW5kIGRlcyBqdW1wcyBhdXNnZWbDvGhydCAtPiBzcGllbGVyIHZlcnNjaHdpbmRldCBoaW50ZXIgdm9yYmVpZ2VzcHJ1bmdlbmVuIGJsw7Zja2VuXG4gICAgICAgICAgICAgICAgdmFyIGZhbGxEZWZvcm0gPSBjYy5zY2FsZVRvKHRoaXMuZmFsbFRpbWUsIDAuODUsIDAuODUpO1xuICAgICAgICAgICAgICAgIHZhciBmYWxsZmFkZSA9IGNjLmZhZGVPdXQodGhpcy5mYWxsVGltZSAqIDQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjYy5zcGF3bihmYWxsRGVmb3JtLCBmYWxsZmFkZS5lYXNpbmcoY2MuZWFzZUN1YmljQWN0aW9uT3V0KCkpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBNaWdodCBiZSB1c2VmdWwgc29tZXRpbWVcbiAgICAgICAgaWYgKHRoaXMuaXNQb2lzb25lZCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNJbnZpbmNpYmxlKSByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgLy9cbiAgICAvLyAgU291bmRzXG4gICAgLy9cblxuICAgIHBsYXlTb3VuZDogZnVuY3Rpb24gcGxheVNvdW5kKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNBbGl2ZSkge1xuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmRlYXRoQXVkaW8sIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzUG9pc29uZWQpIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5wb2lzb25lZEF1ZGlvLCBmYWxzZSk7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLm1vdmVzdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLkp1bXBpbmc6XG4gICAgICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmp1bXBBdWRpbywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLkZhbGxpbmc6XG4gICAgICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmZhbGxBdWRpbywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy9cbiAgICAvLyBTdGF0dXMgYW5kIFVwZGF0ZSBvZiBwbGF5ZXJcbiAgICAvL1xuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5pc0FsaXZlKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRpbWVycyhkdCk7XG4gICAgICAgICAgICAvL3RoaXMudXBkYXRlQW5pbWF0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlQW5pbWF0aW9uOiBmdW5jdGlvbiB1cGRhdGVBbmltYXRpb24oKSB7XG4gICAgICAgIGlmICghdGhpcy5hbmltYXRpb24pIC8vIEluaXQgYW5pbWF0aW9uXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgIGlmICghdGhpcy5pc1BvaXNvbmVkICYmICF0aGlzLmlzSW52aW5jaWJsZSkge1xuICAgICAgICAgICAgLy9OSUNFIFRPIEhBVkU6IG5vIGJvb2xzXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5zdG9wKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1BvaXNvbmVkIHx8IHRoaXMuaXNJbnZpbmNpYmxlKSB0aGlzLmFuaW1hdGlvbi5wbGF5KHRoaXMuZ2V0QW5pbWF0aW9uKCkpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgdXBkYXRlVGltZXJzOiBmdW5jdGlvbiB1cGRhdGVUaW1lcnMoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNQb2lzb25lZCkgaWYgKHRoaXMucG9pc29uVG1wIDw9IDApIHtcbiAgICAgICAgICAgIC8vdGltZXIgcmFuIG91dCAtPiBraWxsIHBsYXllclxuICAgICAgICAgICAgdGhpcy5pc1BvaXNvbmVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmlzQWxpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMua2lsbCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wb2lzb25UbXAgLT0gZHQ7IC8vZGVjcmVhc2UgdGltZXIuLi5odXJyeSFcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzSW52aW5jaWJsZSkgaWYgKHRoaXMuaW52aW5jaWJpbHR5VG1wIDw9IDApIHtcbiAgICAgICAgICAgIC8vdGltZXIgcmFuIG91dCAtPiBkb3ducmFuayBwbGF5ZXJcbiAgICAgICAgICAgIHRoaXMuaXNJbnZpbmNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmludmluY2liaWx0eVRtcCA9IHRoaXMuaW52aW5jaWJpbHR5VGltZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmludmluY2liaWx0eVRtcCAtPSBkdDsgLy9kZWNyZWFzZSB0aW1lci4uLmh1cnJ5IVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGlzTW92aW5nOiBmdW5jdGlvbiBpc01vdmluZygpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLm1vdmVzdGF0ZSkgey8vc3dpdGNoIGZvciBwb3NzaWJsZSBmdXJ0aGVyIHN0YXRlc1xuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLkp1bXBpbmc6XG4gICAgICAgICAgICAgICAgdGhpcy5pc01vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgICAgIGNhc2UgUGxheWVyTW92ZW1lbnRTdGF0ZS5TdGFuZGluZzpcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaXNBbGl2ZTogKGZ1bmN0aW9uIChfaXNBbGl2ZSkge1xuICAgICAgICBmdW5jdGlvbiBpc0FsaXZlKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9pc0FsaXZlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cblxuICAgICAgICBpc0FsaXZlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9pc0FsaXZlLnRvU3RyaW5nKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGlzQWxpdmU7XG4gICAgfSkoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gaXNBbGl2ZTtcbiAgICB9KSxcblxuICAgIGdldEFuaW1hdGlvbjogZnVuY3Rpb24gZ2V0QW5pbWF0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5kaXIgPCAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1BvaXNvbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdwb2lzb25fbGVmdF9hbmltJzsgLy9wbGF5KCdwb2lzb25fbGVmdF9hbmltJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzSW52aW5jaWJsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnc3Rhcl9sZWZ0X2FuaW0nOyAvL3BsYXkoJ3BvaXNvbl9sZWZ0X2FuaW0nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1BvaXNvbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAncG9pc29uX3JpZ2h0X2FuaW0nOyAvL3BsYXkoJ3BvaXNvbl9sZWZ0X2FuaW0nKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0ludmluY2libGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdzdGFyX3JpZ2h0X2FuaW0nOyAvL3BsYXkoJ3BvaXNvbl9sZWZ0X2FuaW0nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgfVxuXG59KTtcbi8qXHJcbm1ha2VJbnZpbmNpYmxlOiBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5pc0ludmluY2libGUgPSB0cnVlO1xyXG4gICAgLy9UT0RPOiBzdGFydCBpbnZpbmNpYmlsaXR5IHRpbWVyXHJcbn0sXHJcbiAgcG9pc29uOiBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5pc1BvaXNvbmVkID0gdHJ1ZTtcclxuICAgIC8vVE9ETzogc3RhcnQgcG9pc29uIHRpbWVyIGFuZCBraWxsaW5nIHBoYXNlIGlmIHR1cm4gYmFzZWQgcG9pc29uIGlzIG5lZ2xlY3RlZFxyXG59LFxyXG4gIHNob3QgOiBmdW5jdGlvbigpe1xyXG4gIH0sKi9cblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2UwNTBmZlpuVVZBaktCOGZ5U2QrWmRPJywgJ1BvaXNvbicpO1xuLy8gc2NyaXB0c1xcZ2FtZWZpZWxkXFxibG9ja3NcXFBvaXNvbi5qc1xuXG52YXIgQmxvY2tUeXBlID0gcmVxdWlyZSgnVHlwZXMnKS5CbG9ja1R5cGU7XG52YXIgUGxheWVyTW92ZW1lbnRTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLlBsYXllck1vdmVtZW50U3RhdGU7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaXNCbG9ja2VkOiBmYWxzZSxcbiAgICAgICAgaGFzSXRlbTogZmFsc2UsXG5cbiAgICAgICAgYmxvY2t0eXBlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IEJsb2NrVHlwZS5Ob25lLFxuICAgICAgICAgICAgdHlwZTogQmxvY2tUeXBlXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXRlbToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMucGxheWVyT25Ub3AgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgb25TdGVwQ2FsbGJhY2s6IGZ1bmN0aW9uIG9uU3RlcENhbGxiYWNrKHBsYXllciwgZ2FtZSkge1xuICAgICAgICBjYy5sb2coJ006IG9uU3RlcENhbGxiYWNrIFBvaXNvbicpO1xuICAgICAgICBjb25zb2xlLmxvZygnRFUgV1VSREVTVCBWRVJHSUZURVQnKTtcbiAgICAgICAgLyppZihwbGF5ZXIucG9pc29uVGltZXI8NiB8fCBwbGF5ZXIucG9pc29uVGltZXI+Nil7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEZXIgVGltZXIgaXN0IGtsZWluZXIgNicpO1xyXG4gICAgICAgICAgICBpZighcGxheWVyLmlzUG9pc29uZWQpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0RlciBTcGllbGVyIGlzdCBub2NoIG5pY2h0IHZlcmdpZnRldCcpO1xyXG4gICAgICAgICAgICAgICAgcGxheWVyLnBvaXNvblRpbWVyID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0qL1xuXG4gICAgICAgIGlmICghcGxheWVyLmlzSW52aW5jaWJsZSkgcGxheWVyLmlzUG9pc29uZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBjb2xsaWRlOiBmdW5jdGlvbiBjb2xsaWRlKCkge31cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2UyMmMzUTRnWEJOQ3A1V1RHQ3RHcVN6JywgJ1NwaWtlJyk7XG4vLyBzY3JpcHRzXFxnYW1lZmllbGRcXGJsb2Nrc1xcU3Bpa2UuanNcblxudmFyIGFscmVhZHlLaWxsZWQgPSBmYWxzZTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpc0RlYWRseTogdHJ1ZVxuICAgIH0sXG5cbiAgICAvLyBmb286IHtcbiAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAvLyB9LFxuICAgIC8vIC4uLlxuICAgIHN3aXRjaERlYWRseTogZnVuY3Rpb24gc3dpdGNoRGVhZGx5KCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdpc0RlYWRseTogJywgdGhpcy5pc0RlYWRseSk7XG4gICAgICAgIHRoaXMuaXNEZWFkbHkgPSAhdGhpcy5pc0RlYWRseTtcbiAgICAgICAgdGhpcy5oYXNLaWxsZWQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuaXNEZWFkbHkgPSB0cnVlO1xuICAgICAgICB0aGlzLnBsYXllck9uVG9wID0gZmFsc2U7XG4gICAgfSxcblxuICAgIG9uU3RlcENhbGxiYWNrOiBmdW5jdGlvbiBvblN0ZXBDYWxsYmFjayhwbGF5ZXIsIGdhbWUpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XG4gICAgICAgIHRoaXMucGxheWVyT25Ub3AgPSB0cnVlO1xuICAgICAgICBjb25zb2xlLmxvZygnTTogT25zdGVwIFNwaWtlJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdPblMgaXNEZWFkbHk6ICcsIHRoaXMuaXNEZWFkbHkpO1xuICAgICAgICBpZiAoIXRoaXMuaGFzS2lsbGVkKSB0aGlzLnBlcmZvcm1TcGlrZUtpbGwoKTtcbiAgICB9LFxuXG4gICAgcGVyZm9ybVNwaWtlS2lsbDogZnVuY3Rpb24gcGVyZm9ybVNwaWtlS2lsbCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVhZGx5ICYmICF0aGlzLnBsYXllci5pc0ludmluY2libGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdVdXBzLCBkYXMgd2FyIHTDtnRsaWNoJyk7XG4gICAgICAgICAgICBpZiAoIWFscmVhZHlLaWxsZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5raWxsKCk7XG4gICAgICAgICAgICAgICAgYWxyZWFkeUtpbGxlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmhhc0tpbGxlZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2zDvGNrIGdlaGFidCcpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLnBsYXllck9uVG9wKSB0aGlzLnBlcmZvcm1TcGlrZUtpbGwoKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2Y4YWYzbTNMZ2xQTlkzNERkYjlWV0QwJywgJ1N0YXRlcycpO1xuLy8gc2NyaXB0c1xcZW51bXNcXFN0YXRlcy5qc1xuXG52YXIgR2FtZVN0YXRlID0gY2MuRW51bSh7XG4gICAgTm9uZTogOTk5LFxuICAgIElkbGU6IC0xLCAvLyBXYWl0aW5nIGZvciBQbGF5ZXIgdG8gY2hvb3NlIHNvbWV0aGluZyBpbiB0aGUgbWVudVxuICAgIExvYWRpbmc6IC0xLCAvLyBQbGF5ZXIgcHJlc3NlZCBTdGFydCAtPiBsb2FkIGdhbWVcbiAgICBXYWl0aW5nOiAtMSwgLy8gV2FpdGluZyBmb3IgZmlyc3QgbW92ZSB0byBzdGFydCB0aW1lcnMgZXRjXG4gICAgUGxheWluZzogLTEsIC8vIEdhbWUgbG9hZGVkIGFuZCBzdGFydGVkXG4gICAgR2FtZU92ZXI6IC0xLCAvL1BsYXllciBkaWVkXG4gICAgUGF1c2VkOiAtMSwgLy8gR2FtZSB3YXMgcGF1c2VkIGJ5IHRoZSBwbGF5ZXJcbiAgICBSZXN1bWVkOiAtMSwgLy8gR2FtZSB3YXMgcmVzdW1lZCBhZnRlciBwYXVzaW5nXG4gICAgRW5kZWQ6IC0xIH0pO1xuXG4vLyBHYW1lIHdhcyBjbG9zZWQgYnkgdGhlIHBsYXllciBvciBoZSBsb3N0IC0+IGJhY2sgdG8gaWRsZT9cbnZhciBQbGF5ZXJNb3ZlbWVudFN0YXRlID0gY2MuRW51bSh7XG4gICAgU3RhbmRpbmc6IC0xLCAvL1BsYXllciBpcyBzdGFuZGluZyBzdGlsbCAoaGFzIGZ1bGx5IGFycml2ZWQgb24gYSBibG9jaylcbiAgICBKdW1waW5nOiAtMSwgLy9QbGF5ZXIgaXMgbW92aW5nIG9udG8gYW5vdGhlciBibG9jayhpbiBhbmltYXRpb24pXG4gICAgRmFsbGluZzogLTEgfSk7XG5cbi8vUGxheWVyIGlzIGZhbGxpbmcgZG93biB0aGUgZ2FtZWZpZWxkXG52YXIgSXRlbVN0YXRlID0gY2MuRW51bSh7XG4gICAgUGlja2FibGU6IC0xLFxuICAgIEJsb2NrZWQ6IC0xLFxuICAgIFBpY2tlZDogLTFcbn0pO1xuXG52YXIgSXRlbUFjdGl2aXR5U3RhdGUgPSBjYy5FbnVtKHtcbiAgICBJZGxlOiAtMSxcbiAgICBBY3RpdmU6IC0xLFxuICAgIEV4cGlyZWQ6IC0xXG59KTtcblxudmFyIFBsYXllclN0YXRlID0gY2MuRW51bSh7XG4gICAgQWxpdmU6IC0xLFxuICAgIERlYWQ6IC0xLFxuICAgIFBvaXNvbmVkOiAtMSxcbiAgICBJbnZpbmNpYmxlOiAtMVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEdhbWVTdGF0ZTogR2FtZVN0YXRlLFxuICAgIFBsYXllck1vdmVtZW50U3RhdGU6IFBsYXllck1vdmVtZW50U3RhdGUsXG4gICAgSXRlbVN0YXRlOiBJdGVtU3RhdGUsXG4gICAgUGxheWVyU3RhdGU6IFBsYXllclN0YXRlLFxuICAgIEl0ZW1BY3Rpdml0eVN0YXRlOiBJdGVtQWN0aXZpdHlTdGF0ZVxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzQzMjNkNFhKNFpNaVoyd3greXg3RTduJywgJ1N3aXRjaGVyJyk7XG4vLyBzY3JpcHRzXFxnYW1lZmllbGRcXGJsb2Nrc1xcU3dpdGNoZXIuanNcblxudmFyIEJsb2NrVHlwZSA9IHJlcXVpcmUoJ1R5cGVzJykuQmxvY2tUeXBlO1xudmFyIFBsYXllck1vdmVtZW50U3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5QbGF5ZXJNb3ZlbWVudFN0YXRlO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGlzQmxvY2tlZDogZmFsc2UsXG4gICAgICAgIGhhc0l0ZW06IGZhbHNlLFxuXG4gICAgICAgIGJsb2NrdHlwZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBCbG9ja1R5cGUuTm9uZSxcbiAgICAgICAgICAgIHR5cGU6IEJsb2NrVHlwZVxuICAgICAgICB9LFxuXG4gICAgICAgIGl0ZW06IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnBsYXllck9uVG9wID0gZmFsc2U7XG4gICAgfSxcblxuICAgIG9uU3RlcENhbGxiYWNrOiBmdW5jdGlvbiBvblN0ZXBDYWxsYmFjayhwbGF5ZXIsIGdhbWUpIHtcbiAgICAgICAgY2MubG9nKCdNOiBvblN0ZXBDYWxsYmFjayBTd2l0Y2hlcicpO1xuICAgICAgICBwbGF5ZXIuaXNTd2FwZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBjb2xsaWRlOiBmdW5jdGlvbiBjb2xsaWRlKCkge31cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzFjNzEwWXZXdkJBY3FUQkIwV011Tjl2JywgJ1RyYXBkb29yJyk7XG4vLyBzY3JpcHRzXFxnYW1lZmllbGRcXGJsb2Nrc1xcVHJhcGRvb3IuanNcblxudmFyIEJsb2NrVHlwZSA9IHJlcXVpcmUoJ1R5cGVzJykuQmxvY2tUeXBlO1xudmFyIFBsYXllck1vdmVtZW50U3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5QbGF5ZXJNb3ZlbWVudFN0YXRlO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGlzQmxvY2tlZDogZmFsc2UsXG4gICAgICAgIGhhc0l0ZW06IGZhbHNlLFxuXG4gICAgICAgIGJsb2NrdHlwZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBCbG9ja1R5cGUuTm9uZSxcbiAgICAgICAgICAgIHR5cGU6IEJsb2NrVHlwZVxuICAgICAgICB9LFxuXG4gICAgICAgIGl0ZW06IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnBsYXllck9uVG9wID0gZmFsc2U7XG4gICAgfSxcblxuICAgIG9uU3RlcENhbGxiYWNrOiBmdW5jdGlvbiBvblN0ZXBDYWxsYmFjayhwbGF5ZXIsIGdhbWUpIHtcbiAgICAgICAgdmFyIGFuaW1DdHJsID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICBhbmltQ3RybC5wbGF5KCd0cmFwZG9vcicpO1xuICAgICAgICB2YXIgZmFsbCA9IGNjLm1vdmVUbygxLCBjYy5wKHRoaXMubm9kZS5nZXRQb3NpdGlvblgoKSwgdGhpcy5ub2RlLmdldFBvc2l0aW9uWSgpIC0gMTAwKSk7XG4gICAgICAgIC8vdmFyIGNhbExiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5kZXN0cm95LCB0aGlzKTtcbiAgICAgICAgLy90aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGZhbGwsY2FsTGJhY2spKTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihmYWxsKTtcbiAgICAgICAgcGxheWVyLmZhbGwoKTtcbiAgICAgICAgLy9nYW1lLnN0YXRlID0gZ2FtZS5HYW1lU3RhdGUuR2FtZU92ZXI7XG4gICAgfSxcblxuICAgIGNvbGxpZGU6IGZ1bmN0aW9uIGNvbGxpZGUoKSB7fSxcblxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgfVxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzcxYjkzU1JOMEJPMXFLU3E1NUVVL1dJJywgJ1R5cGVzJyk7XG4vLyBzY3JpcHRzXFxlbnVtc1xcVHlwZXMuanNcblxudmFyIEl0ZW1UeXBlID0gY2MuRW51bSh7XG4gICAgTm9uZTogOTk5LFxuICAgIFN0YXI6IC0xLCAvLyBTY29yZVxuICAgIENvaW46IC0xLCAvLyBDbGltYiB0d28oZi5lLikgcm93cyB1cFxuICAgIEFudGlkb3RlOiAtMSwgLy8gQ3VyZXMgcG9pc29uXG4gICAgQmxvY2tlcjogLTEsXG4gICAgU2xvd2VyOiAtMVxufSk7XG5cbnZhciBCbG9ja1R5cGUgPSBjYy5FbnVtKHtcbiAgICBOb25lOiAtMSxcbiAgICBFbXB0eTogLTEsXG4gICAgRGlydDogLTEsXG4gICAgR3Jhc3M6IC0xLFxuICAgIFBvaXNvbjogLTEsXG4gICAgU3dpdGNoZXI6IC0xLFxuICAgIFRyYXBkb29yOiAtMSxcbiAgICBTcGlrZTogLTFcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBJdGVtVHlwZTogSXRlbVR5cGUsXG4gICAgQmxvY2tUeXBlOiBCbG9ja1R5cGVcbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5NmUyMEI5ekZwQ1VLS1ZVbnhQTi9IOScsICdXYXRlclJpZ2h0Jyk7XG4vLyBzY3JpcHRzXFxnYW1lZmllbGRcXGJsb2Nrc1xcV2F0ZXJSaWdodC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMucGxheWVyT25Ub3AgPSBmYWxzZTtcbiAgICB9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyJdfQ==
