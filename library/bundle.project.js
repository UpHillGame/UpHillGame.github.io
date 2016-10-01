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
    "extends": cc.Component,

    properties: {
        pauseOverlay: {
            "default": null,
            type: cc.Node
        },

        buttonAudio: {
            "default": null,
            url: cc.AudioClip
        },

        game: {
            "default": null,
            type: cc.Node
        }

    },

    // use this for initialization
    onLoad: function onLoad() {
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
var pufferField = [[7, 1, 6, 1, 6, 1, 7], [7, 1, 2, 2, 1, 7], [7, 1, 3, 1, 3, 1, 7], [7, 1, 2, 2, 1, 7], [7, 1, 2, 1, 2, 1, 7], [7, 3, 2, 2, 3, 7], [7, 7, 1, 1, 1, 7, 7], [7, 1, 1, 4, 4, 7], [7, 4, 1, 4, 1, 4, 7], [7, 4, 1, 1, 1, 7], [7, 4, 1, 1, 1, 1, 7], [7, 5, 1, 5, 1, 7], [7, 1, 1, 1, 1, 1, 7], [7, 1, 1, 1, 1, 7], [7, 6, 1, 1, 1, 1, 7], [7, 1, 1, 1, 1, 7]];
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
		this.initializeField();

		this.game.getComponent('Game').onGameFieldLoadCallback();
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
        }

    },

    // Music Theme
    /*themeurl: {
        default: null,
        type: cc.url,
    },*/
    // use this for initialization
    onLoad: function onLoad() {
        //this.setFrameRate(60);
        this.state = GameState.Waiting;
        //this.GameState = GameState;
        this.initalizeInputControl(); // Activate input handling

        cc.audioEngine.playMusic("..\audio\music\theme", true);

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

        //steppedBlock is necessarry for Movement-collisioncontroll
        if (this.player.isSwaped) {
            dir = -dir;
            this.player.isSwaped = false;
        }

        this.destfield = this.gamefield.getJumpField(dir);
        //console.log('destfield = ', this.destfield);
        //console.log('destfield = ', this.destfield.name);
        var steppedBlock = this.destfield.getComponent(this.destfield.name);

        if (steppedBlock.isBlocked) {
            return false;
        }

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

                            console.log('pressDouble: ', pressDouble);
                            if (pressDouble == 1) {
                                console.log('NOCHMAL');
                                pressDouble = 0;
                                break;
                            }
                            self.player.move(self.destfield, self);
                            self.gamefield.updatePlayerArrayPos(); // Change array position after jump or bugs will spawn
                            self.player.oldDest.getComponent(self.player.oldDest.name).playerOnTop = false;
                        }
                        break;
                    case cc.KEY.d:
                        if (self.state === GameState.Waiting) self.state = GameState.Playing;

                        if (self.validateMove(-1)) {

                            console.log('pressDouble: ', pressDouble);
                            if (pressDouble == 1) {
                                console.log('NOCHMAL');
                                pressDouble = 0;
                                break;
                            }

                            self.player.move(self.destfield, self);
                            self.gamefield.updatePlayerArrayPos();
                            self.player.oldDest.getComponent(self.player.oldDest.name).playerOnTop = false; //TODO vll in player?
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
        switch (this.itemtype) {
            case ItemType.Antidote:
            case ItemType.Coin:
            case ItemType.Star:
                this.node.destroy();
            case ItemType.Slower:
                return;
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
                // TODO slow player
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
        cc.audioEngine.playEffect(this.activationsound, false);
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

var L33I = [[0, 0, 3, 0, 4, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 4, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 9, 9, 9, 9, 0], [0, 9, 9, 9, 9, 9, 0], [0, 0, 0, 1, 0, 0]];

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
        var gamestatecallback = cc.callFunc(this.changeGameState, this);
        var soundcallback = cc.callFunc(this.playSound, this);
        this.node.runAction(cc.sequence(cc.spawn(this.deform(), this.assembleAction()), gamestatecallback, soundcallback));
        this.isAlive = false; //set here because alive impacts death anim.
        cc.audioEngine.stopAllEffects();
    },

    changeGameState: function changeGameState() {
        if (this.isAlive || this.movestate === PlayerMovementState.Falling) this.game.getComponent('Game').state = GameState.GameOver;
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
},{}]},{},["Game","MenuButtonCallbacks","Trapdoor","Block","Switcher","Grass","GameButtonCallbacks","Types","CloudAnimation","Level","WaterRight","Item","Empty","Player","GameField","Poison","Spike","States","Dirt"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0RldmVsb3BtZW50L0NvY29zQ3JlYXRvci9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9CbG9jay5qcyIsImFzc2V0cy9zY3JpcHRzL3NjZW5lc2NyaXB0cy9DbG91ZEFuaW1hdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9ibG9ja3MvRGlydC5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9ibG9ja3MvRW1wdHkuanMiLCJhc3NldHMvc2NyaXB0cy9zY2VuZXNjcmlwdHMvR2FtZUJ1dHRvbkNhbGxiYWNrcy5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9HYW1lRmllbGQuanMiLCJhc3NldHMvc2NyaXB0cy9HYW1lLmpzIiwiYXNzZXRzL3NjcmlwdHMvZ2FtZWZpZWxkL2Jsb2Nrcy9HcmFzcy5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVvYmplY3RzL0l0ZW0uanMiLCJhc3NldHMvc2NyaXB0cy9nYW1lZmllbGQvTGV2ZWwuanMiLCJhc3NldHMvc2NyaXB0cy9zY2VuZXNjcmlwdHMvTWVudUJ1dHRvbkNhbGxiYWNrcy5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVvYmplY3RzL1BsYXllci5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9ibG9ja3MvUG9pc29uLmpzIiwiYXNzZXRzL3NjcmlwdHMvZ2FtZWZpZWxkL2Jsb2Nrcy9TcGlrZS5qcyIsImFzc2V0cy9zY3JpcHRzL2VudW1zL1N0YXRlcy5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9ibG9ja3MvU3dpdGNoZXIuanMiLCJhc3NldHMvc2NyaXB0cy9nYW1lZmllbGQvYmxvY2tzL1RyYXBkb29yLmpzIiwiYXNzZXRzL3NjcmlwdHMvZW51bXMvVHlwZXMuanMiLCJhc3NldHMvc2NyaXB0cy9nYW1lZmllbGQvYmxvY2tzL1dhdGVyUmlnaHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzF0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzBjZjgwdmE0aUpDWFpEWGJTd2dZMW1tJywgJ0Jsb2NrJyk7XG4vLyBzY3JpcHRzXFxnYW1lZmllbGRcXEJsb2NrLmpzXG5cbnZhciBCbG9ja1R5cGUgPSByZXF1aXJlKCdUeXBlcycpLkJsb2NrVHlwZTtcbnZhciBQbGF5ZXJNb3ZlbWVudFN0YXRlID0gcmVxdWlyZSgnU3RhdGVzJykuUGxheWVyTW92ZW1lbnRTdGF0ZTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpc0Jsb2NrZWQ6IGZhbHNlLFxuICAgICAgICBoYXNJdGVtOiBmYWxzZSxcblxuICAgICAgICBibG9ja3R5cGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogQmxvY2tUeXBlLk5vbmUsXG4gICAgICAgICAgICB0eXBlOiBCbG9ja1R5cGVcbiAgICAgICAgfSxcblxuICAgICAgICBpdGVtOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcblxuICAgIC8vV2hhdCBoYXBwZW5zIGlmIHlvdSBzdGVwIG9uIGEgYmxvY2tcbiAgICBvblN0ZXBDYWxsYmFjazogZnVuY3Rpb24gb25TdGVwQ2FsbGJhY2socGxheWVyKSB7XG4gICAgICAgIC8vIFBlcmZvcm0gdGhlIGFjdGlvbiB0aGUgYmxvY2sgcHJvZHVjZXMoY2hhbmdlIHBsYXllciBvciBlbnZpcm9ubWVudClcbiAgICAgICAgc3dpdGNoICh0aGlzLmJsb2NrdHlwZSkge1xuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuRW1wdHk6XG4gICAgICAgICAgICAgICAgcGxheWVyLmZhbGwoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBlcmZvcm0gYmxvY2sgYW5pbWF0aW9uXG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24odGhpcy5hc3NlbWJsZUJsb2NrQWN0aW9uKCkpO1xuICAgIH0sXG5cbiAgICAvLyBBY3Rpb24oQW5pbWF0aW9uIGV0YykgZm9yIGV2ZXJ5IGJsb2NrXG4gICAgYXNzZW1ibGVCbG9ja0FjdGlvbjogZnVuY3Rpb24gYXNzZW1ibGVCbG9ja0FjdGlvbigpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmJsb2NrdHlwZSkge1xuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuRW1wdHk6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNjLm1vdmVUbygwLCB0aGlzLm5vZGUuZ2V0UG9zaXRpb24oKSk7XG5cbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLlRyYXBkb3I6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNjLm1vdmVUbygxLCBjYy5wKHRoaXMubm9kZS5nZXRQb3NpdGlvblgoKSwgdGhpcy5ub2RlLmdldFBvc2l0aW9uWSgpIC0gMTAwKSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gUGFydCBvZiBhbmltYXRpb24gc2VlIGFib3ZlXG4gICAgZGVmb3JtOiBmdW5jdGlvbiBkZWZvcm0oKSB7fSxcblxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgfSxcblxuICAgIHNldEJsb2NrZWQ6IGZ1bmN0aW9uIHNldEJsb2NrZWQoYm9vbCkge1xuICAgICAgICB0aGlzLmlzQmxvY2tlZCA9IGJvb2w7XG4gICAgfSxcblxuICAgIGlzQmxvY2tlZDogZnVuY3Rpb24gaXNCbG9ja2VkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0Jsb2NrZWQ7XG4gICAgfVxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzcyODhmanNpWEZBbEwrTGlHZW5ROE9yJywgJ0Nsb3VkQW5pbWF0aW9uJyk7XG4vLyBzY3JpcHRzXFxzY2VuZXNjcmlwdHNcXENsb3VkQW5pbWF0aW9uLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdmZTEzYzZqaTkxSUdLQWFEMWNHcGZTSycsICdEaXJ0Jyk7XG4vLyBzY3JpcHRzXFxnYW1lZmllbGRcXGJsb2Nrc1xcRGlydC5qc1xuXG52YXIgQmxvY2tUeXBlID0gcmVxdWlyZSgnVHlwZXMnKS5CbG9ja1R5cGU7XG52YXIgUGxheWVyTW92ZW1lbnRTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLlBsYXllck1vdmVtZW50U3RhdGU7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaXNCbG9ja2VkOiBmYWxzZSxcbiAgICAgICAgaGFzSXRlbTogZmFsc2UsXG5cbiAgICAgICAgYmxvY2t0eXBlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IEJsb2NrVHlwZS5Ob25lLFxuICAgICAgICAgICAgdHlwZTogQmxvY2tUeXBlXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXRlbToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMucGxheWVyT25Ub3AgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgb25TdGVwQ2FsbGJhY2s6IGZ1bmN0aW9uIG9uU3RlcENhbGxiYWNrKHBsYXllciwgZ2FtZSkge1xuICAgICAgICBjYy5sb2coJ006IG9uU3RlcENhbGxiYWNrIERpcnQnKTtcbiAgICB9LFxuXG4gICAgY29sbGlkZTogZnVuY3Rpb24gY29sbGlkZSgpIHt9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdiZWVhZlFqMUxoSGtMREVraHpEVjMrMCcsICdFbXB0eScpO1xuLy8gc2NyaXB0c1xcZ2FtZWZpZWxkXFxibG9ja3NcXEVtcHR5LmpzXG5cbnZhciBCbG9ja1R5cGUgPSByZXF1aXJlKCdUeXBlcycpLkJsb2NrVHlwZTtcbnZhciBQbGF5ZXJNb3ZlbWVudFN0YXRlID0gcmVxdWlyZSgnU3RhdGVzJykuUGxheWVyTW92ZW1lbnRTdGF0ZTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvKmdhbWVmaWVsZDoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlLFxyXG4gICAgICAgIH0sKi9cblxuICAgICAgICBpc0Jsb2NrZWQ6IGZhbHNlLFxuICAgICAgICBoYXNJdGVtOiBmYWxzZSxcblxuICAgICAgICBibG9ja3R5cGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogQmxvY2tUeXBlLk5vbmUsXG4gICAgICAgICAgICB0eXBlOiBCbG9ja1R5cGVcbiAgICAgICAgfSxcblxuICAgICAgICBpdGVtOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJPblRvcCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBvblN0ZXBDYWxsYmFjazogZnVuY3Rpb24gb25TdGVwQ2FsbGJhY2socGxheWVyLCBnYW1lKSB7XG4gICAgICAgIC8vIFBlcmZvcm0gdGhlIGFjdGlvbiB0aGUgYmxvY2sgcHJvZHVjZXMoY2hhbmdlIHBsYXllciBvciBlbnZpcm9ubWVudClcbiAgICAgICAgcGxheWVyLmZhbGwoKTtcbiAgICB9LFxuXG4gICAgY29sbGlkZTogZnVuY3Rpb24gY29sbGlkZSgpIHtcbiAgICAgICAgY2MubG9nKCd3aXIgc2luZCBpbiBkZXIgTWV0aG9kZScpO1xuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzY5ZTc2OTA4MXhHTmJEWkJtckRSTEZ1JywgJ0dhbWVCdXR0b25DYWxsYmFja3MnKTtcbi8vIHNjcmlwdHNcXHNjZW5lc2NyaXB0c1xcR2FtZUJ1dHRvbkNhbGxiYWNrcy5qc1xuXG52YXIgR2FtZVN0YXRlID0gcmVxdWlyZSgnU3RhdGVzJykuR2FtZVN0YXRlO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcGF1c2VPdmVybGF5OiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICBidXR0b25BdWRpbzoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuXG4gICAgICAgIGdhbWU6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7IC8vIFRPRE86IHNwcmVhZCB0aGlzIHRvIHRoZSBvdXRlciB3b3JsZFxuICAgIH0sXG5cbiAgICBwYXVzZUNvbnRyb2xDYWxsYmFjazogZnVuY3Rpb24gcGF1c2VDb250cm9sQ2FsbGJhY2soKSB7XG4gICAgICAgIC8vVE9ETzogY2hhbmdlIHBhdXNlIGJ1dHRvbiB0byBkaWZmZXJlbnQgc3ByaXRlXG4gICAgICAgIGlmICh0aGlzLnBhdXNlZCkge1xuICAgICAgICAgICAgdGhpcy5wYXVzZU92ZXJsYXkub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5yZXN1bWUoKTtcbiAgICAgICAgICAgIHRoaXMucGF1c2VkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmdhbWUuc3RhdGUgPSBHYW1lU3RhdGUuUGxheWluZztcblxuICAgICAgICAgICAgY2MubG9nKFwicmVzdW1lXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXVzZU92ZXJsYXkub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLnBhdXNlKCk7XG4gICAgICAgICAgICB0aGlzLnBhdXNlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmdhbWUuc3RhdGUgPSBHYW1lU3RhdGUuUGF1c2VkO1xuICAgICAgICAgICAgY2MubG9nKFwicGF1c2VkXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmJ1dHRvbkF1ZGlvLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIGFnYWluQ29udHJvbENhbGxiYWNrOiBmdW5jdGlvbiBhZ2FpbkNvbnRyb2xDYWxsYmFjaygpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdHYW1lU2NlbmUnKTtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmJ1dHRvbkF1ZGlvLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIGJhY2tDb250cm9sQ2FsbGJhY2s6IGZ1bmN0aW9uIGJhY2tDb250cm9sQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZSA9IEdhbWVTdGF0ZS5FbmRlZDtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdTdGFydG1lbnUnKTtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmJ1dHRvbkF1ZGlvLCBmYWxzZSk7XG4gICAgfVxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2UwMDFmK21NV05ONVloWHlrTGRNRkxaJywgJ0dhbWVGaWVsZCcpO1xuLy8gc2NyaXB0c1xcZ2FtZWZpZWxkXFxHYW1lRmllbGQuanNcblxuLy9HYW1lRmllbGRcblxudmFyIExldmVsID0gcmVxdWlyZSgnTGV2ZWwnKTtcbnZhciBCbG9ja1R5cGUgPSByZXF1aXJlKCdUeXBlcycpLkJsb2NrVHlwZTtcbnZhciBJdGVtVHlwZSA9IHJlcXVpcmUoJ1R5cGVzJykuSXRlbVR5cGU7XG52YXIgR2FtZVN0YXRlID0gcmVxdWlyZSgnU3RhdGVzJykuR2FtZVN0YXRlO1xuXG52YXIgc3RhcnRYID0gMTEzO1xudmFyIHN0YXJ0WSA9IDUwMTtcblxudmFyIGRpc3RYID0gODM7XG52YXIgZGlzdFkgPSA2NTtcblxudmFyIHNwYXduT2ZmU2V0WSA9IDIwMDtcbnZhciBkZXNwYXduT2ZmU2V0WSA9IC0xMDA7XG52YXIgeVNwYXduUG9zaXRpb24gPSA0ODU7XG5cbnZhciBzdGFydEZpZWxkID0gW1s3LCAxLCAyLCAyLCAxLCA3XSwgWzcsIDEsIDUsIDEsIDIsIDEsIDddLCBbNywgMiwgMSwgMSwgMiwgN10sIFs3LCAyLCAxLCAxLCAxLCAyLCA3XSwgWzcsIDIsIDEsIDEsIDIsIDddLCBbNywgMSwgMiwgMSwgNSwgMSwgN10sIFs3LCAxLCAyLCAyLCAxLCA3XSwgWzcsIDEsIDEsIDIsIDEsIDEsIDddXG4vKls3LDEsMSwxLDEsMF0sXHJcbiBbNywxLDEsMSwxLDEsMF0sXHJcbiBbNywxLDEsNCw0LDVdLFxyXG4gWzcsMSwxLDEsNSwxLDBdLFxyXG4gWzcsMSwxLDEsMSwwXSxcclxuIFs3LDUsNiwzLDEsMSwwXSxcclxuIFs3LDEsMSw1LDEsMF0sXHJcbiBbNywxLDEsMSwxLDEsMF0sKi9cbl07XG5cbi8vQXJyYXkgZm9yIGVhY2ggaW5kaXZpZHVhbCBibG9ja1xudmFyIHB1ZmZlckZpZWxkID0gW1s3LCAxLCA2LCAxLCA2LCAxLCA3XSwgWzcsIDEsIDIsIDIsIDEsIDddLCBbNywgMSwgMywgMSwgMywgMSwgN10sIFs3LCAxLCAyLCAyLCAxLCA3XSwgWzcsIDEsIDIsIDEsIDIsIDEsIDddLCBbNywgMywgMiwgMiwgMywgN10sIFs3LCA3LCAxLCAxLCAxLCA3LCA3XSwgWzcsIDEsIDEsIDQsIDQsIDddLCBbNywgNCwgMSwgNCwgMSwgNCwgN10sIFs3LCA0LCAxLCAxLCAxLCA3XSwgWzcsIDQsIDEsIDEsIDEsIDEsIDddLCBbNywgNSwgMSwgNSwgMSwgN10sIFs3LCAxLCAxLCAxLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddLCBbNywgNiwgMSwgMSwgMSwgMSwgN10sIFs3LCAxLCAxLCAxLCAxLCA3XV07XG4vKlxyXG4gVGhlIGl0ZW1zLWFycmF5IGhhcyB0aGUgc2FtZSBkaW1lbnNpb25zIGFzIHRoZSBzdGFydEZpZWxkLiBFYWNoIGl0ZW0gd2lsbCBiZSBhIGNoaWxkIG9mIHRoZSBjb3JyZXNwb25kaW5nIGJsb2NrIChzZWVuIGFzIGEgbGF5b3ZlcikuXHJcbiAvLyAwLkVtcHR5LCAxLmFudGlkb3RlTGVmdCwgMi5hbnRpZG90ZVJpZ2h0LCAzLmNvaW5MZWZ0LCA0LmNvaW5SaWdodCwgNS5zdGFyTGVmdCxcclxuIC8vIDYuc3RhclJpZ2h0LCA3LkJsb2NrZWRCdXNoLCA4LkJsb2NrZWRTdG9uZSwgOS5TbG93RG93bkJvdHRvbSwgOS5TbG93RG93blRvcFxyXG4gLy9UT0RPOiAxMC5XYXRlckxlZnQsIDExLldhdGVyUmlnaHQgKi9cbnZhciBzdGFydEZpZWxkSXRlbXMgPSBbWzAsIDgsIDAsIDAsIDgsIDBdLCBbMCwgOCwgMCwgNywgMCwgOCwgMF0sIFswLCAwLCA3LCA3LCAyLCAwXSwgWzAsIDYsIDcsIDcsIDcsIDAsIDBdLCBbMCwgMCwgNywgNywgMCwgMF0sIFswLCA3LCA0LCA3LCAwLCA3LCAwXSwgWzAsIDcsIDAsIDAsIDcsIDBdLCBbMCwgOCwgOCwgMCwgOCwgOCwgMF1dO1xuXG4vKlxyXG4gVGhlIGl0ZW1zLWFycmF5IGhhcyB0aGUgc2FtZSBkaW1lbnNpb25zIGFzIHRoZSBwdWZmZXJGaWVsZC4gRWFjaCBpdGVtIHdpbGwgYmUgYSBjaGlsZCBvZiB0aGUgY29ycmVzcG9uZGluZyBibG9jayAoc2VlbiBhcyBhIGxheW92ZXIpLlxyXG4gLy8gMC5FbXB0eSwgMS5hbnRpZG90ZUxlZnQsIDIuYW50aWRvdGVSaWdodCwgMy5jb2luTGVmdCwgNC5jb2luUmlnaHQsIDUuc3RhckxlZnQsXHJcbiAvLyA2LnN0YXJSaWdodCwgNy5CbG9ja2VkQnVzaCwgOC5CbG9ja2VkU3RvbmUsIDkuU2xvd0Rvd25Cb3R0b20sIDkuU2xvd0Rvd25Ub3BcclxuIC8vVE9ETzogMTAuV2F0ZXJMZWZ0LCAxMS5XYXRlclJpZ2h0ICovXG52YXIgcHVmZmVyRmllbGRJdGVtcyA9IFtbMCwgOCwgMCwgMCwgMCwgOCwgMF0sIFswLCA4LCAwLCAwLCA4LCAwXSwgWzAsIDgsIDAsIDAsIDAsIDgsIDBdLCBbMCwgOCwgMCwgMCwgOCwgMF0sIFswLCA4LCAwLCA3LCAwLCA4LCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgOSwgNywgOSwgMCwgMF0sIFswLCA5LCA3LCAwLCAwLCAwXSwgWzAsIDAsIDcsIDAsIDcsIDAsIDBdLCBbMCwgMCwgNywgOSwgOSwgMF0sIFswLCAwLCA3LCA3LCAwLCA3LCAwXSwgWzAsIDAsIDcsIDAsIDgsIDBdLCBbMCwgMCwgMCwgMCwgMCwgNywgMF0sIFswLCAwLCAwLCA3LCAwLCAwXSwgWzAsIDAsIDcsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMiwgMCwgMF1dO1xuXG52YXIgbmV4dEZpcnN0TGluZSA9IDA7XG52YXIgbmV4dEZpcnN0TGluZUl0ZW0gPSAwO1xuXG52YXIgbmV3Q3ViZSA9IG51bGw7XG52YXIgbmV3SXRlbSA9IG51bGw7XG5cbmNjLkNsYXNzKHtcblx0J2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cblx0cHJvcGVydGllczoge1xuXHRcdGdyaWRTaXplWDogMCwgLy8gUm93cyAtIGRvbnQgY2hhbmdlIGhlcmUgYnV0IGluIGNvY29zIGNyZWF0b3IhIVxuXHRcdGdyaWRTaXplWTogMCwgLy8gQ29sdW1uc1xuXG5cdFx0ZGVzcGF3bkhlaWdodDogMCxcblxuXHRcdGl0ZW06IHtcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLk5vZGVcblx0XHR9LFxuXG5cdFx0Ly9CbG9ja3Mgc3RhcnQgaGVyZVxuXHRcdEVtcHR5OiB7IC8vMFx0XHRFTVBUWVxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRHcmFzczogeyAvLzFcdFx0R1JBU1Ncblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0RGlydDogeyAvLzJcdFx0RElSVFxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRUcmFwZG9vcjogeyAvLzNcdFx0VFJBUERPT1Jcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0U3dpdGNoZXI6IHsgLy80XHRcdFNXSVRDSEVSXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdFBvaXNvbjogeyAvLzVcdFx0UE9JU09OXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdFNwaWtlOiB7IC8vNlx0XHRTUElLRVxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRXYXRlckM6IHsgLy83XHRcdFdBVEVSIChMaWtlIEVNUFRZKVxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblxuXHRcdC8vIEdhbWUgcmVmZXJlbmNlIHRvIHBhc3MgZmllbGRcblx0XHRnYW1lOiB7XG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5Ob2RlXG5cdFx0fSxcblxuXHRcdC8vSXRlbXMgc3RhcnQgaGVyZVxuXHRcdC8vIDAuRW1wdHksIDEuYW50aWRvdGVMZWZ0LCAyLmFudGlkb3RlUmlnaHQsIDMuY29pbkxlZnQsIDQuY29pblJpZ2h0LCA1LnN0YXJMZWZ0LFxuXHRcdC8vIDYuc3RhclJpZ2h0LCA3LkJsb2NrZWRCdXNoLCA4LkJsb2NrZWRTdG9uZSwgOS5TbG93RG93bkJvdHRvbSwgOS5TbG93RG93blRvcFxuXHRcdC8vVE9ETzogMTAuV2F0ZXJMZWZ0LCAxMS5XYXRlclJpZ2h0XG5cdFx0QW50aWRvdGVMOiB7IC8vMVx0XHRBbnRpZG90ZUxcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0QW50aWRvdGVSOiB7IC8vMlx0XHRBbnRpZG90ZVJcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0Q29pbkw6IHsgLy8zXHRcdENvaW5MXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdENvaW5SOiB7IC8vNFx0XHRDb2luUlxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRTdGFyTDogeyAvLzVcdFx0U3Rhckxcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0U3RhclI6IHsgLy82XHRcdFN0YXJSXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXG5cdFx0QmxvY2tlZEJ1c2g6IHsgLy83XHRcdEJsb2NrZWRCdXNoXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdEJsb2NrZWRTdG9uZTogeyAvLzhcdFx0QmxvY2tlZFN0b25lXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdFNsb3dEb3duQm90dG9tOiB7IC8vOVx0XHRTbG93RG93bkJvdHRvbSAoQm90dG9tIGFuZCBUb3AgYXJlIGFsd2F5cyB0b2dldGhlcilcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0U2xvd0Rvd25Ub3A6IHsgLy85XHRcdFNsb3dEb3duVG9wIChCb3R0b20gYW5kIFRvcCBhcmUgYWx3YXlzIHRvZ2V0aGVyKVxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHQvKlxyXG4gICBXYXRlckxlZnQ6IHtcdFx0XHRcdFx0XHQvLzEwXHRcdFdhdGVyTGVmdFxyXG4gICBkZWZhdWx0OiBudWxsLFxyXG4gICB0eXBlOiBjYy5QcmVmYWIsXHJcbiAgIH0sKi9cblx0XHRXYXRlclJpZ2h0OiB7IC8vMTFcdFx0V2F0ZXJSaWdodFxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fVxuXG5cdH0sXG5cblx0Ly9QbGF5ZXJcblx0Ly8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG5cdG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuXHRcdC8vcmVnaXN0ZXIgZ2FtZWZpZWxkIGF0IGdhbWUgZm9yIHByb2Nlc3NpbmcgZ2FtZWZpZWxkIGxvZ2ljXG5cdFx0dGhpcy5nYW1lLmdldENvbXBvbmVudCgnR2FtZScpLmdhbWVmaWVsZCA9IHRoaXM7XG5cblx0XHR0aGlzLnBsYXllciA9IG51bGw7IC8vIGxvYWQgbGF0ZXIgd2hlbiBwbGF5ZXIgcmFuIG9uTG9hZCgpXG5cdFx0dGhpcy5jb3VudCA9IDA7XG5cdFx0dGhpcy5nYW1lRmllbGQgPSBbXTtcblx0XHR0aGlzLml0ZW1zID0gW107XG5cblx0XHR0aGlzLmRpc1RYID0gZGlzdFg7XG5cdFx0dGhpcy5kaXNUWSA9IGRpc3RZO1xuXHRcdHRoaXMuaW5pdGlhbGl6ZUZpZWxkKCk7XG5cblx0XHR0aGlzLmdhbWUuZ2V0Q29tcG9uZW50KCdHYW1lJykub25HYW1lRmllbGRMb2FkQ2FsbGJhY2soKTtcblx0fSxcblxuXHRpbml0aWFsaXplRmllbGQ6IGZ1bmN0aW9uIGluaXRpYWxpemVGaWVsZCgpIHtcblxuXHRcdGZvciAodmFyIHkgPSAwOyB5IDwgc3RhcnRGaWVsZC5sZW5ndGg7IHkrKykge1xuXHRcdFx0dGhpcy5nYW1lRmllbGRbeV0gPSBbXTtcblx0XHRcdGZvciAodmFyIHggPSAwOyB4IDwgc3RhcnRGaWVsZFt5XS5sZW5ndGg7IHgrKykge1xuXHRcdFx0XHRpZiAoc3RhcnRGaWVsZFt5XS5sZW5ndGggJSAyID09PSAwKSB7XG5cdFx0XHRcdFx0bmV3Q3ViZSA9IHRoaXMuc3Bhd25DdWJlKHN0YXJ0WCArIHggKiBkaXN0WCwgc3RhcnRZIC0gZGlzdFkgKiB5LCBzdGFydEZpZWxkW3ldW3hdLCBzdGFydEZpZWxkSXRlbXNbeV1beF0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5ld0N1YmUgPSB0aGlzLnNwYXduQ3ViZShzdGFydFggKyB4ICogZGlzdFggLSBkaXN0WCAvIDIsIHN0YXJ0WSAtIGRpc3RZICogeSwgc3RhcnRGaWVsZFt5XVt4XSwgc3RhcnRGaWVsZEl0ZW1zW3ldW3hdKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvL2NjLmxvZygnQWRkaW5nIG5ldyBjdWJlOiAnKTtcblx0XHRcdFx0Ly9jYy5sb2cobmV3Q3ViZSk7XG5cdFx0XHRcdHRoaXMuZ2FtZUZpZWxkW3ldW3hdID0gbmV3Q3ViZTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0LyogRGlzcGxhY2VzIHRoZSBlbnRpcmUgZ2FtZWZpZWxkIGJ5ICpTcGVlZCotUGl4ZWxcclxuICAqIEluIGNhc2UgYm9yZGVyIGlzIGNyb3NzZWQgLT4gZGVsZXRlIGxvd2VzdCByb3cgKi9cblx0dXBkYXRlRmllbGQ6IGZ1bmN0aW9uIHVwZGF0ZUZpZWxkKHNwZWVkKSB7XG5cdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLmdhbWVGaWVsZC5sZW5ndGg7IHkrKykge1xuXHRcdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmdhbWVGaWVsZFt5XS5sZW5ndGg7IHgrKykge1xuXHRcdFx0XHR2YXIgcG9zWCA9IHRoaXMuZ2FtZUZpZWxkW3ldW3hdLmdldFBvc2l0aW9uWCgpO1xuXHRcdFx0XHR2YXIgcG9zWSA9IHRoaXMuZ2FtZUZpZWxkW3ldW3hdLmdldFBvc2l0aW9uWSgpO1xuXHRcdFx0XHR0aGlzLmdhbWVGaWVsZFt5XVt4XS5zZXRQb3NpdGlvbihwb3NYLCBwb3NZICsgc3BlZWQpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLnVwZGF0ZVBsYXllcihzcGVlZCk7XG5cblx0XHQvL1dFTk4gR1JFTlpFIFVFQkVSU0NIUklUVEVOOyBEQU5OIFdJUkQgWkVJTEUgR0VMw5ZTQ0hUXG5cdFx0aWYgKHRoaXMuZ2FtZUZpZWxkW3RoaXMuZ2FtZUZpZWxkLmxlbmd0aCAtIDFdWzBdLmdldFBvc2l0aW9uWSgpIDw9IHRoaXMuZGVzcGF3bkhlaWdodCkge1xuXHRcdFx0Y2MubG9nKCdXSVIgU0lORCBaVSBXRUlUIScpO1xuXHRcdFx0dGhpcy5kZXN0cm95TGluZSh0aGlzLmdhbWVGaWVsZC5sZW5ndGggLSAxKTtcblx0XHRcdHRoaXMucmVhcnJhbmdlR2FtZUZpZWxkKCk7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9LFxuXG5cdHVwZGF0ZVBsYXllcjogZnVuY3Rpb24gdXBkYXRlUGxheWVyKHNwZWVkKSB7XG5cdFx0dmFyIHggPSB0aGlzLnBsYXllci5ub2RlLmdldFBvc2l0aW9uWCgpO1xuXHRcdHZhciB5ID0gdGhpcy5wbGF5ZXIubm9kZS5nZXRQb3NpdGlvblkoKTtcblx0XHR0aGlzLnBsYXllci5ub2RlLnNldFBvc2l0aW9uKHgsIHkgKyBzcGVlZCk7XG5cdH0sXG5cblx0dXBkYXRlUGxheWVyQXJyYXlQb3M6IGZ1bmN0aW9uIHVwZGF0ZVBsYXllckFycmF5UG9zKCkge1xuXG5cdFx0aWYgKHRoaXMuZ2FtZUZpZWxkW3RoaXMucGxheWVyLmFycmF5UG9zWV0ubGVuZ3RoICUgMiA9PSAwKSB7XG5cdFx0XHRpZiAodGhpcy5wbGF5ZXIuZGlyIDwgMCkge1xuXHRcdFx0XHR0aGlzLnBsYXllci5hcnJheVBvc1ggPSB0aGlzLnBsYXllci5hcnJheVBvc1ggKyAxO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAodGhpcy5wbGF5ZXIuZGlyID4gMCkge1xuXHRcdFx0XHR0aGlzLnBsYXllci5hcnJheVBvc1ggPSB0aGlzLnBsYXllci5hcnJheVBvc1ggLSAxO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMucGxheWVyLmFycmF5UG9zWSA9IHRoaXMucGxheWVyLmFycmF5UG9zWSAtIDE7XG5cdH0sXG5cblx0Z2V0U3RhcnRQb3NpdGlvbjogZnVuY3Rpb24gZ2V0U3RhcnRQb3NpdGlvbigpIHtcblx0XHR2YXIgbWlkID0gTWF0aC5yb3VuZChOdW1iZXIodGhpcy5nYW1lRmllbGRbdGhpcy5nYW1lRmllbGQubGVuZ3RoIC0gMV0ubGVuZ3RoIC8gMikpIC0gMTtcblx0XHR2YXIgc3RhcnRGaWVsZCA9IHRoaXMuZ2FtZUZpZWxkW3RoaXMuZ2FtZUZpZWxkLmxlbmd0aCAtIDFdW21pZF07XG5cdFx0Ly9UT0RPOiBtb3ZlIHRoaXMgbW9yZSBzdWl0YWJsZVxuXHRcdHRoaXMucGxheWVyLmFycmF5UG9zWCA9IG1pZDtcblx0XHR0aGlzLnBsYXllci5hcnJheVBvc1kgPSB0aGlzLmdhbWVGaWVsZC5sZW5ndGggLSAxO1xuXHRcdHZhciBzdGFydHBvcyA9IGNjLnAoc3RhcnRGaWVsZC5nZXRQb3NpdGlvblgoKSwgc3RhcnRGaWVsZC5nZXRQb3NpdGlvblkoKSArIHRoaXMucGxheWVyLm9mZnNldFkpO1xuXHRcdHJldHVybiBzdGFydHBvcztcblx0fSxcblxuXHRnZXRKdW1wRmllbGQ6IGZ1bmN0aW9uIGdldEp1bXBGaWVsZChkaXIpIHtcblx0XHRpZiAodGhpcy5nYW1lRmllbGRbdGhpcy5wbGF5ZXIuYXJyYXlQb3NZXS5sZW5ndGggJSAyID09IDApIHtcblx0XHRcdGlmIChkaXIgPiAwKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmdhbWVGaWVsZFt0aGlzLnBsYXllci5hcnJheVBvc1kgLSAxXVt0aGlzLnBsYXllci5hcnJheVBvc1hdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2FtZUZpZWxkW3RoaXMucGxheWVyLmFycmF5UG9zWSAtIDFdW3RoaXMucGxheWVyLmFycmF5UG9zWCArIDFdO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoZGlyID4gMCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5nYW1lRmllbGRbdGhpcy5wbGF5ZXIuYXJyYXlQb3NZIC0gMV1bdGhpcy5wbGF5ZXIuYXJyYXlQb3NYIC0gMV07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5nYW1lRmllbGRbdGhpcy5wbGF5ZXIuYXJyYXlQb3NZIC0gMV1bdGhpcy5wbGF5ZXIuYXJyYXlQb3NYXTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0Ly9UT0RPOiBkZXN0cm95IGl0ZW1zIG9uIHRoYXQgbGluZVxuXHRkZXN0cm95TGluZTogZnVuY3Rpb24gZGVzdHJveUxpbmUobGluZSkge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5nYW1lRmllbGRbbGluZV0ubGVuZ3RoOyBpKyspIHtcblx0XHRcdC8vdGhpcy5nYW1lRmllbGRbbGluZV1baV0uZGVzdHJveSgpO1xuXHRcdFx0dGhpcy5kZXN0cm95QmxvY2sodGhpcy5nYW1lRmllbGRbbGluZV1baV0pO1xuXHRcdH1cblx0fSxcblxuXHRkZXN0cm95QmxvY2s6IGZ1bmN0aW9uIGRlc3Ryb3lCbG9jayhibG9jaykge1xuXHRcdHZhciBmYWxsID0gY2MubW92ZVRvKDEsIGNjLnAoYmxvY2suZ2V0UG9zaXRpb24oKS54LCBkZXNwYXduT2ZmU2V0WSkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25JbigpKTtcblx0XHR2YXIgZmFkZSA9IGNjLmZhZGVPdXQoMS41KTtcblx0XHRibG9jay5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2Muc3Bhd24oZmFsbCwgZmFkZSksIGNjLmNhbGxGdW5jKHRoaXMuZGVzdHJveUJsb2NrRGF0YSwgdGhpcykpKTtcblx0fSxcblxuXHRkZXN0cm95QmxvY2tEYXRhOiBmdW5jdGlvbiBkZXN0cm95QmxvY2tEYXRhKGJsb2NrKSB7XG5cdFx0YmxvY2suZGVzdHJveSgpO1xuXHR9LFxuXG5cdHJlYXJyYW5nZUdhbWVGaWVsZDogZnVuY3Rpb24gcmVhcnJhbmdlR2FtZUZpZWxkKCkge1xuXHRcdC8vY2MubG9nKCdNOiByZWFycmFuZ2VHYW1lRmllbGQnKVxuXHRcdHZhciByZXR1cm5BID0gW107XG5cdFx0dmFyIHggPSB0aGlzLmdhbWVGaWVsZFsxXVswXS5nZXRQb3NpdGlvblgoKTtcblx0XHRyZXR1cm5BWzBdID0gdGhpcy5jcmVhdGVGaXJzdExpbmUoeCk7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdhbWVGaWVsZC5sZW5ndGggLSAxOyBpKyspIHtcblx0XHRcdHJldHVybkFbaSArIDFdID0gdGhpcy5nYW1lRmllbGRbaV07XG5cdFx0fVxuXHRcdHRoaXMuZ2FtZUZpZWxkID0gcmV0dXJuQTtcblx0XHR0aGlzLmFkZFpPcmRlclRvR2FtZUZpZWxkKCk7XG5cdFx0dGhpcy5wbGF5ZXIuYXJyYXlQb3NZID0gdGhpcy5wbGF5ZXIuYXJyYXlQb3NZICsgMTtcblx0XHRpZiAodGhpcy5wbGF5ZXIuYXJyYXlQb3NZID49IHRoaXMuZ2FtZUZpZWxkLmxlbmd0aCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ006IHJlYXJyYW5nZSBraWxscyBwbGF5ZXInKTtcblx0XHRcdHRoaXMucGxheWVyLmZhbGwoKTtcblx0XHRcdHRoaXMuZ2FtZS5nZXRDb21wb25lbnQoJ0dhbWUnKS5zdGF0ZSA9IEdhbWVTdGF0ZS5HYW1lT3Zlcjtcblx0XHR9XG5cdH0sXG5cblx0Y3JlYXRlRmlyc3RMaW5lOiBmdW5jdGlvbiBjcmVhdGVGaXJzdExpbmUoeCkge1xuXHRcdGNjLmxvZygnTTogY3JlYXRlRmlyc3RMaW5lJyk7XG5cdFx0dmFyIHJldHVybkEgPSBbXTtcblx0XHQvL25leHQgbGluZSBmcm9tIGJsb2NrLXB1ZmZlclxuXHRcdHZhciBhcnJheSA9IHRoaXMuZ2V0TmV4dExpbmVGcm9tUHVmZmVyKCk7XG5cdFx0Ly9uZXh0IGxpbmUgZnJvbSBpdGVtLXB1ZmZlclxuXHRcdHZhciBhcnJheUl0ZW1zID0gdGhpcy5nZXROZXh0TGluZUZyb21JdGVtUHVmZmVyKCk7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoYXJyYXkubGVuZ3RoICUgMiA9PSAwKSB7XG5cblx0XHRcdFx0cmV0dXJuQVtpXSA9IHRoaXMuc3Bhd25DdWJlKHggKyBpICogZGlzdFgsIHlTcGF3blBvc2l0aW9uICsgZGlzdFkgLSBzcGF3bk9mZlNldFksIGFycmF5W2ldLCBhcnJheUl0ZW1zW2ldKTtcblx0XHRcdFx0cmV0dXJuQVtpXS5vcGFjaXR5ID0gMDtcblx0XHRcdFx0dmFyIHJpc2UgPSBjYy5tb3ZlVG8oMSwgY2MucChyZXR1cm5BW2ldLmdldFBvc2l0aW9uKCkueCwgeVNwYXduUG9zaXRpb24gKyBkaXN0WSkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25JbigpKTtcblx0XHRcdFx0dmFyIGZhZGUgPSBjYy5mYWRlSW4oMSk7XG5cdFx0XHRcdHJldHVybkFbaV0ucnVuQWN0aW9uKGNjLnNwYXduKGZhZGUsIHJpc2UpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vbmV3Q3ViZSA9IHRoaXMuc3Bhd25CbHVlQ3ViZShzdGFydFgrKHgqZGlzdFgpLShkaXN0WC8yKSwgc3RhcnRZLShkaXN0WSp5KSk7XG5cdFx0XHRcdC8vY2MubG9nKCd3aXIgaGFiZW4gZWluIHVuZ2VyYWRlcyBBcnJheScpO1xuXG5cdFx0XHRcdHJldHVybkFbaV0gPSB0aGlzLnNwYXduQ3ViZSh4ICsgaSAqIGRpc3RYLCB5U3Bhd25Qb3NpdGlvbiArIGRpc3RZIC0gc3Bhd25PZmZTZXRZLCBhcnJheVtpXSwgYXJyYXlJdGVtc1tpXSk7XG5cdFx0XHRcdHJldHVybkFbaV0ub3BhY2l0eSA9IDA7XG5cdFx0XHRcdHZhciByaXNlID0gY2MubW92ZVRvKDEsIGNjLnAocmV0dXJuQVtpXS5nZXRQb3NpdGlvbigpLngsIHlTcGF3blBvc2l0aW9uICsgZGlzdFkpKS5lYXNpbmcoY2MuZWFzZUN1YmljQWN0aW9uSW4oKSk7XG5cdFx0XHRcdHZhciBmYWRlID0gY2MuZmFkZUluKDEpO1xuXHRcdFx0XHRyZXR1cm5BW2ldLnJ1bkFjdGlvbihjYy5zcGF3bihmYWRlLCByaXNlKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiByZXR1cm5BO1xuXHR9LFxuXG5cdC8vVE9ETzogYWRkIGNvZGUgdG8gZWFjaCBjYXNlLCBzbyBpdGVtcyBhcmUgY3JlYXRlZCBhcyB3ZWxsIChhcyBvZiBub3csIGl0ZW0tY29kZSBvbmx5IGV4aXN0cyBpbiBjYXNlIDEpXG5cdHNwYXduQ3ViZTogZnVuY3Rpb24gc3Bhd25DdWJlKHgsIHksIGN1YmVOdW1iZXIsIGl0ZW1OdW1iZXIpIHtcblx0XHRjYy5sb2coJ006IHNwYXduQ3ViZScpO1xuXHRcdHN3aXRjaCAoY3ViZU51bWJlcikge1xuXHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHQvL2dlbmVyYXRlIGEgbmV3IG5vZGUgaW4gdGhlIHNjZW5lIHdpdGggYSBwcmVzZXQgdGVtcGxhdGVcblx0XHRcdFx0dmFyIG5ld0N1YmUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkVtcHR5KTtcblx0XHRcdFx0bmV3Q3ViZS5nZXRDb21wb25lbnQoJ0VtcHR5JykuYmxvY2t0eXBlID0gQmxvY2tUeXBlLkVtcHR5O1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR2YXIgbmV3Q3ViZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuR3Jhc3MpO1xuXHRcdFx0XHRuZXdDdWJlLmdldENvbXBvbmVudCgnR3Jhc3MnKS5ibG9ja3R5cGUgPSBCbG9ja1R5cGUuR3Jhc3M7XG5cdFx0XHRcdC8vY3JlYXRpbmcgbmV3IGl0ZW0gYW5kIGFkZGluZyBpdCB0byBjdWJlXG5cdFx0XHRcdG5ld0N1YmUgPSB0aGlzLnNwYXduSXRlbShuZXdDdWJlLCBpdGVtTnVtYmVyLCAnR3Jhc3MnKTtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dmFyIG5ld0N1YmUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkRpcnQpO1xuXHRcdFx0XHRuZXdDdWJlLmdldENvbXBvbmVudCgnRGlydCcpLmJsb2NrdHlwZSA9IEJsb2NrVHlwZS5EaXJ0O1xuXHRcdFx0XHQvL2NyZWF0aW5nIG5ldyBpdGVtIGFuZCBhZGRpbmcgaXQgdG8gY3ViZVxuXHRcdFx0XHQvL3ZhciBuZXdJdGVtVG9BZGQgPSB0aGlzLnNwYXduSXRlbShpdGVtTnVtYmVyKTtcblx0XHRcdFx0bmV3Q3ViZSA9IHRoaXMuc3Bhd25JdGVtKG5ld0N1YmUsIGl0ZW1OdW1iZXIsICdEaXJ0Jyk7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDM6XG5cdFx0XHRcdHZhciBuZXdDdWJlID0gY2MuaW5zdGFudGlhdGUodGhpcy5UcmFwZG9vcik7XG5cdFx0XHRcdG5ld0N1YmUuZ2V0Q29tcG9uZW50KCdUcmFwZG9vcicpLmJsb2NrdHlwZSA9IEJsb2NrVHlwZS5UcmFwZG9vcjtcblx0XHRcdFx0bmV3Q3ViZS5nZXRDb21wb25lbnQoJ1RyYXBkb29yJykuc3ByaXRlID0gbmV3Q3ViZTtcblx0XHRcdFx0Ly9UT0RPOiBkZWxldGUgdGhlIGZvbGxvd2luZyB0aHJlZSBsaW5lcywgdGVzdGluZyBwdXJwb3NlcyBvbmx5LiBUcmFwZG9vciBuZXZlciBoYXMgaXRlbXMgb24gaXQuXG5cdFx0XHRcdC8vY3JlYXRpbmcgbmV3IGl0ZW0gYW5kIGFkZGluZyBpdCB0byBjdWJlXG5cdFx0XHRcdC8vdmFyIG5ld0l0ZW1Ub0FkZCA9IHRoaXMuc3Bhd25JdGVtKGl0ZW1OdW1iZXIpO1xuXHRcdFx0XHQvL25ld0N1YmUgPSB0aGlzLnNwYXduSXRlbShuZXdDdWJlLCBpdGVtTnVtYmVyLCAnVHJhcGRvb3InKTtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNDpcblx0XHRcdFx0dmFyIG5ld0N1YmUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLlN3aXRjaGVyKTtcblx0XHRcdFx0bmV3Q3ViZS5nZXRDb21wb25lbnQoJ1N3aXRjaGVyJykuYmxvY2t0eXBlID0gQmxvY2tUeXBlLlN3aXRjaGVyO1xuXHRcdFx0XHQvL1RPRE86IGRlbGV0ZSB0aGUgZm9sbG93aW5nIHRocmVlIGxpbmVzLCB0ZXN0aW5nIHB1cnBvc2VzIG9ubHkuIFRyYXBkb29yIG5ldmVyIGhhcyBpdGVtcyBvbiBpdC5cblx0XHRcdFx0Ly9jcmVhdGluZyBuZXcgaXRlbSBhbmQgYWRkaW5nIGl0IHRvIGN1YmVcblx0XHRcdFx0Ly92YXIgbmV3SXRlbVRvQWRkID0gdGhpcy5zcGF3bkl0ZW0oaXRlbU51bWJlcik7XG5cdFx0XHRcdG5ld0N1YmUgPSB0aGlzLnNwYXduSXRlbShuZXdDdWJlLCBpdGVtTnVtYmVyLCAnU3dpdGNoZXInKTtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNTpcblx0XHRcdFx0dmFyIG5ld0N1YmUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLlBvaXNvbik7XG5cdFx0XHRcdG5ld0N1YmUuZ2V0Q29tcG9uZW50KCdQb2lzb24nKS5ibG9ja3R5cGUgPSBCbG9ja1R5cGUuUG9pc29uO1xuXHRcdFx0XHQvL1RPRE86IGRlbGV0ZSB0aGUgZm9sbG93aW5nIHRocmVlIGxpbmVzLCB0ZXN0aW5nIHB1cnBvc2VzIG9ubHkuIFRyYXBkb29yIG5ldmVyIGhhcyBpdGVtcyBvbiBpdC5cblx0XHRcdFx0Ly9jcmVhdGluZyBuZXcgaXRlbSBhbmQgYWRkaW5nIGl0IHRvIGN1YmVcblx0XHRcdFx0Ly92YXIgbmV3SXRlbVRvQWRkID0gdGhpcy5zcGF3bkl0ZW0oaXRlbU51bWJlcik7XG5cdFx0XHRcdG5ld0N1YmUgPSB0aGlzLnNwYXduSXRlbShuZXdDdWJlLCBpdGVtTnVtYmVyLCAnUG9pc29uJyk7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDY6XG5cdFx0XHRcdHZhciBuZXdDdWJlID0gY2MuaW5zdGFudGlhdGUodGhpcy5TcGlrZSk7XG5cdFx0XHRcdG5ld0N1YmUuZ2V0Q29tcG9uZW50KCdTcGlrZScpLmJsb2NrdHlwZSA9IEJsb2NrVHlwZS5TcGlrZTtcblx0XHRcdFx0Ly9UT0RPOiBkZWxldGUgdGhlIGZvbGxvd2luZyB0aHJlZSBsaW5lcywgdGVzdGluZyBwdXJwb3NlcyBvbmx5LiBUcmFwZG9vciBuZXZlciBoYXMgaXRlbXMgb24gaXQuXG5cdFx0XHRcdC8vY3JlYXRpbmcgbmV3IGl0ZW0gYW5kIGFkZGluZyBpdCB0byBjdWJlXG5cdFx0XHRcdC8vdmFyIG5ld0l0ZW1Ub0FkZCA9IHRoaXMuc3Bhd25JdGVtKGl0ZW1OdW1iZXIpO1xuXHRcdFx0XHRuZXdDdWJlID0gdGhpcy5zcGF3bkl0ZW0obmV3Q3ViZSwgaXRlbU51bWJlciwgJ1NwaWtlJyk7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDc6XG5cdFx0XHRcdHZhciBuZXdDdWJlID0gY2MuaW5zdGFudGlhdGUodGhpcy5XYXRlckMpO1xuXHRcdFx0XHRuZXdDdWJlLmdldENvbXBvbmVudCgnRW1wdHknKS5ibG9ja3R5cGUgPSBCbG9ja1R5cGUuRW1wdHk7XG5cdFx0XHRcdG5ld0N1YmUubmFtZSA9ICdFbXB0eSc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dmFyIG5ld0N1YmUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkdyYXNzKTtcblx0XHRcdFx0bmV3Q3ViZS5nZXRDb21wb25lbnQoJ0dyYXNzJykuYmxvY2t0eXBlID0gQmxvY2tUeXBlLkdyYXNzO1xuXHRcdFx0XHQvL2NyZWF0aW5nIG5ldyBpdGVtIGFuZCBhZGRpbmcgaXQgdG8gY3ViZVxuXHRcdFx0XHQvL3ZhciBuZXdJdGVtVG9BZGQgPSB0aGlzLnNwYXduSXRlbShpdGVtTnVtYmVyKTtcblx0XHRcdFx0bmV3Q3ViZSA9IHRoaXMuc3Bhd25JdGVtKG5ld0N1YmUsIGl0ZW1OdW1iZXIsICdHcmFzcycpO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdC8vc2V0IHVwIGEgcG9zaXRpb24gZm9yIHRoZSBcIkVNUFRZXCJcblx0XHQvL25ld0N1YmUuc2V0QW5jaG9yUG9pbnQoY2MucCgwLDApKTtcblx0XHQvLy0tLS0tbmV3Q3ViZS5hZGRDaGlsZChuZXdJdGVtVG9BZGQpO1xuXHRcdG5ld0N1YmUuc2V0UG9zaXRpb24oeCwgeSk7XG5cdFx0Ly9wdXQgdGhlIG5ld2x5IGFkZGVkIG5vZGUgdW5kZXIgdGhlIENhbnZhcyBub2RlXG5cblx0XHR0aGlzLm5vZGUuYWRkQ2hpbGQobmV3Q3ViZSk7XG5cblx0XHQvL2NjLmxvZygnUmV0dXJuaW5nIHRoZSBmb2xsb3dpbmcgY3ViZTogJyk7XG5cdFx0Ly9jYy5sb2cobmV3Q3ViZSk7XG5cdFx0cmV0dXJuIG5ld0N1YmU7XG5cdH0sXG5cblx0Ly8gMC5FbXB0eSwgMS5hbnRpZG90ZUxlZnQsIDIuYW50aWRvdGVSaWdodCwgMy5jb2luTGVmdCwgNC5jb2luUmlnaHQsIDUuc3RhckxlZnQsXG5cdC8vIDYuc3RhclJpZ2h0LCA3LkJsb2NrZWRCdXNoLCA4LkJsb2NrZWRTdG9uZSwgOS5TbG93RG93bkJvdHRvbSwgOS5TbG93RG93blRvcFxuXHQvL1RPRE86IDEwLldhdGVyTGVmdCwgMTEuV2F0ZXJSaWdodFxuXHRzcGF3bkl0ZW06IGZ1bmN0aW9uIHNwYXduSXRlbShwYXJlbnRCbG9jaywgaXRlbU51bWJlciwgYmxvY2tOYW1lKSB7XG5cdFx0c3dpdGNoIChpdGVtTnVtYmVyKSB7XG5cdFx0XHRjYXNlIDA6XG5cdFx0XHRcdC8vRW1wdHkvIG5vIGl0ZW1cblx0XHRcdFx0dmFyIG5ld0l0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkVtcHR5KTtcblx0XHRcdFx0bmV3SXRlbS5uYW1lID0gJ0VtcHR5Jztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdC8vYW50aWRvdGVMZWZ0XG5cdFx0XHRcdHZhciBuZXdJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5BbnRpZG90ZUwpO1xuXHRcdFx0XHRuZXdJdGVtLm5hbWUgPSAnQW50aWRvdGVMJztcblx0XHRcdFx0bmV3SXRlbS5nZXRDb21wb25lbnQoJ0l0ZW0nKS5pdGVtdHlwZSA9IEl0ZW1UeXBlLkFudGlkb3RlO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHQvL2FudGlkb3RlUmlnaHRcblx0XHRcdFx0dmFyIG5ld0l0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkFudGlkb3RlUik7XG5cdFx0XHRcdG5ld0l0ZW0ubmFtZSA9ICdBbnRpZG90ZVInO1xuXHRcdFx0XHRuZXdJdGVtLmdldENvbXBvbmVudCgnSXRlbScpLml0ZW10eXBlID0gSXRlbVR5cGUuQW50aWRvdGU7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDM6XG5cdFx0XHRcdC8vY29pbkxlZnRcblx0XHRcdFx0dmFyIG5ld0l0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkNvaW5MKTtcblx0XHRcdFx0bmV3SXRlbS5uYW1lID0gJ0NvaW5MJztcblx0XHRcdFx0bmV3SXRlbS5nZXRDb21wb25lbnQoJ0l0ZW0nKS5pdGVtdHlwZSA9IEl0ZW1UeXBlLkNvaW47XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHQvL2NvaW5SaWdodFxuXHRcdFx0XHR2YXIgbmV3SXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuQ29pblIpO1xuXHRcdFx0XHRuZXdJdGVtLm5hbWUgPSAnQ29pblInO1xuXHRcdFx0XHRuZXdJdGVtLmdldENvbXBvbmVudCgnSXRlbScpLml0ZW10eXBlID0gSXRlbVR5cGUuQ29pbjtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNTpcblx0XHRcdFx0Ly9zdGFyTGVmdFxuXHRcdFx0XHR2YXIgbmV3SXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuU3RhckwpO1xuXHRcdFx0XHRuZXdJdGVtLm5hbWUgPSAnc3RhckxlZnQnO1xuXHRcdFx0XHRuZXdJdGVtLmdldENvbXBvbmVudCgnSXRlbScpLml0ZW10eXBlID0gSXRlbVR5cGUuU3Rhcjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDY6XG5cdFx0XHRcdC8vc3RhclJpZ2h0XG5cdFx0XHRcdHZhciBuZXdJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5TdGFyUik7XG5cdFx0XHRcdG5ld0l0ZW0ubmFtZSA9ICdzdGFyUmlnaHQnO1xuXHRcdFx0XHRuZXdJdGVtLmdldENvbXBvbmVudCgnSXRlbScpLml0ZW10eXBlID0gSXRlbVR5cGUuU3Rhcjtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDc6XG5cdFx0XHRcdC8vQmxvY2tlZEJ1c2hcblx0XHRcdFx0dmFyIG5ld0l0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkJsb2NrZWRCdXNoKTtcblx0XHRcdFx0bmV3SXRlbS5uYW1lID0gJ0Jsb2NrZWRCdXNoJztcblx0XHRcdFx0cGFyZW50QmxvY2suZ2V0Q29tcG9uZW50KGJsb2NrTmFtZSkuaXNCbG9ja2VkID0gdHJ1ZTtcblx0XHRcdFx0bmV3SXRlbS5nZXRDb21wb25lbnQoJ0l0ZW0nKS5pdGVtdHlwZSA9IEl0ZW1UeXBlLkJsb2NrZXI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA4OlxuXHRcdFx0XHQvL0Jsb2NrZWRTdG9uZVxuXHRcdFx0XHR2YXIgbmV3SXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuQmxvY2tlZFN0b25lKTtcblx0XHRcdFx0bmV3SXRlbS5uYW1lID0gJ0Jsb2NrZWRTdG9uZSc7XG5cdFx0XHRcdHBhcmVudEJsb2NrLmdldENvbXBvbmVudChibG9ja05hbWUpLmlzQmxvY2tlZCA9IHRydWU7XG5cdFx0XHRcdG5ld0l0ZW0uZ2V0Q29tcG9uZW50KCdJdGVtJykuaXRlbXR5cGUgPSBJdGVtVHlwZS5CbG9ja2VyO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgOTpcblx0XHRcdFx0Ly9TbG93RG93biAoVG9wIEFORCBCb3R0b20pXG5cdFx0XHRcdHZhciBuZXdJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5TbG93RG93bkJvdHRvbSk7XG5cdFx0XHRcdG5ld0l0ZW0uZ2V0Q29tcG9uZW50KCdJdGVtJykuaXRlbXR5cGUgPSBJdGVtVHlwZS5TbG93ZXI7XG5cdFx0XHRcdG5ld0l0ZW0ubmFtZSA9ICdTbG93RG93bkJvdHRvbSc7XG5cblx0XHRcdFx0dmFyIG5ld0l0ZW0yID0gY2MuaW5zdGFudGlhdGUodGhpcy5TbG93RG93blRvcCk7XG5cdFx0XHRcdG5ld0l0ZW0uYWRkQ2hpbGQobmV3SXRlbTIpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdC8vRW1wdHkvIG5vIGl0ZW1cblx0XHRcdFx0dmFyIG5ld0l0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkVtcHR5KTtcblx0XHRcdFx0bmV3SXRlbS5uYW1lID0gJ0VtcHR5Jztcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0Ly9JdGVtcyBhcmUgaW4gdGhyZWUgY2xhc3Nlczpcblx0XHQvLzEuIEZsb2F0IGFib3ZlIGN1YmVcblx0XHQvLzIuIFNpdCBvbiB0b3Agb2YgY3ViZVxuXHRcdC8vMy4gU2FtZSBwb3NpdGlvbiBhcyBjdWJlIChubyByZXBvc2l0aW9uaW5nIG5lY2Vzc2FyeSlcblx0XHR2YXIgZmxvYXRBYm92ZUN1YmUgPSBbMSwgMiwgMywgNCwgNSwgNl07XG5cdFx0dmFyIHJpZ2h0T25Ub3BPZkN1YmUgPSBbNywgOCwgOSwgMTBdO1xuXG5cdFx0aWYgKGZsb2F0QWJvdmVDdWJlLmluY2x1ZGVzKGl0ZW1OdW1iZXIpKSB7XG5cdFx0XHR2YXIgcG9zWSA9IG5ld0l0ZW0uZ2V0UG9zaXRpb25ZKCk7XG5cdFx0XHR2YXIgcG9zWCA9IG5ld0l0ZW0uZ2V0UG9zaXRpb25YKCk7XG5cdFx0XHRuZXdJdGVtLnNldFBvc2l0aW9uKHBvc1gsIHBvc1kgKyA1MCk7XG5cdFx0fSBlbHNlIGlmIChyaWdodE9uVG9wT2ZDdWJlLmluY2x1ZGVzKGl0ZW1OdW1iZXIpKSB7XG5cdFx0XHR2YXIgcG9zWSA9IG5ld0l0ZW0uZ2V0UG9zaXRpb25ZKCk7XG5cdFx0XHR2YXIgcG9zWCA9IG5ld0l0ZW0uZ2V0UG9zaXRpb25YKCk7XG5cdFx0XHRuZXdJdGVtLnNldFBvc2l0aW9uKHBvc1gsIHBvc1kgKyA0MCk7XG5cdFx0fVxuXHRcdHBhcmVudEJsb2NrLmdldENvbXBvbmVudChibG9ja05hbWUpLml0ZW0gPSBuZXdJdGVtO1xuXHRcdHBhcmVudEJsb2NrLmFkZENoaWxkKG5ld0l0ZW0pO1xuXG5cdFx0cmV0dXJuIHBhcmVudEJsb2NrO1xuXHR9LFxuXG5cdC8qIEdldHMgdGhlIG5leHQgbGluZSBmcm9tIHRoZSBibG9jay1wdWZmZXIsIHNvIGEgbmV3IGxpbmUgY2FuIGJlIGNyZWF0ZWQuXHQqL1xuXHQvKiBHZXRzIHRoZSBuZXh0IGxpbmUgZnJvbSB0aGUgYmxvY2stcHVmZmVyLCBzbyBhIG5ldyBsaW5lIGNhbiBiZSBjcmVhdGVkLlx0Ki9cblx0Z2V0TmV4dExpbmVGcm9tUHVmZmVyOiBmdW5jdGlvbiBnZXROZXh0TGluZUZyb21QdWZmZXIoKSB7XG5cdFx0Y2MubG9nKCdNOiBnZXROZXh0TGluZUZyb21QdWZmZXInKTtcblx0XHR2YXIgcmV0ID0gW107XG5cdFx0aWYgKHB1ZmZlckZpZWxkLmxlbmd0aCA9PT0gbmV4dEZpcnN0TGluZSkge1xuXHRcdFx0Y2MubG9nKCdQdWZmZXIgYXJyYXkgaXMgZW1wdHkhJyk7XG5cdFx0XHQvKnB1ZmZlckZpZWxkID0gW107XHJcbiAgICBwdWZmZXJGaWVsZCA9IExldmVsLkwxM0M7XHJcbiAgICBuZXh0Rmlyc3RMaW5lID0gMDsqL1xuXHRcdFx0Ly9UT0RPIHVta29tbWVudGllcmVuXG5cdFx0XHR0aGlzLmRlZmluZU5leHRSYW5kb21BcnJheSgpO1xuXHRcdFx0Ly90aGlzLnRlc3RBcnJheSgpXG5cdFx0XHRyZXQgPSBwdWZmZXJGaWVsZFtuZXh0Rmlyc3RMaW5lXTtcblx0XHRcdG5leHRGaXJzdExpbmUgPSBuZXh0Rmlyc3RMaW5lICsgMTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly9jYy5sb2coJ0dldHRpbmcgbmV4dCBhcnJheSBsaW5lIGZybyBwdWZmZXIuLi4nKVxuXHRcdFx0cmV0ID0gcHVmZmVyRmllbGRbbmV4dEZpcnN0TGluZV07XG5cdFx0XHRuZXh0Rmlyc3RMaW5lID0gbmV4dEZpcnN0TGluZSArIDE7XG5cdFx0fVxuXHRcdC8vY2MubG9nKCdSZXR1cm5pbmcgbmV4dCBwdWZmZXIgYXJyYXkgbGluZSwgZXhpdGluZyBnZXROZXh0TGluZUZyb21QdWZmZXInLCByZXQpO1xuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cblx0Ly9UT0RPIG51ciBlaW4gRHVtbXkgenVtIHRlc3Rlbiwgc3DDpHRlciBMw5ZTQ0hFTiFcblx0dGVzdEFycmF5OiBmdW5jdGlvbiB0ZXN0QXJyYXkoKSB7XG5cdFx0cHVmZmVyRmllbGQgPSBbXTtcblx0XHRwdWZmZXJGaWVsZEl0ZW1zID0gW107XG5cdFx0cHVmZmVyRmllbGQgPSBMZXZlbC5MMzNDO1xuXHRcdHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMzNJO1xuXHRcdG5leHRGaXJzdExpbmUgPSAwO1xuXHRcdG5leHRGaXJzdExpbmVJdGVtID0gMDtcblx0fSxcblxuXHQvKiBHZXRzIHRoZSBuZXh0IGxpbmUgZnJvbSB0aGUgaXRlbS1wdWZmZXIsIHNvIGEgbmV3IGxpbmUgY2FuIGJlIGNyZWF0ZWQuXHQqL1xuXHRnZXROZXh0TGluZUZyb21JdGVtUHVmZmVyOiBmdW5jdGlvbiBnZXROZXh0TGluZUZyb21JdGVtUHVmZmVyKCkge1xuXHRcdGNjLmxvZygnTTogZ2V0TmV4dExpbmVGcm9tSXRlbVB1ZmZlcicpO1xuXHRcdHZhciByZXQgPSBbXTtcblxuXHRcdGlmIChwdWZmZXJGaWVsZEl0ZW1zLmxlbmd0aCA9PT0gbmV4dEZpcnN0TGluZUl0ZW0pIHtcblx0XHRcdC8vVE9ETyBoaWVyIG11ZXNzZW4gd2lyIG5vY2ggcmVhZ2llcmVuXG5cdFx0XHRjYy5sb2coJ0l0ZW1QdWZmZXIgYXJyYXkgaXMgZW1wdHkhJyk7XG5cdFx0XHQvKnB1ZmZlckZpZWxkSXRlbXMgPSBbXTtcclxuICAgIHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMTNJO1xyXG4gICAgbmV4dEZpcnN0TGluZUl0ZW0gPSAwOyovXG5cdFx0XHRyZXQgPSBwdWZmZXJGaWVsZEl0ZW1zW25leHRGaXJzdExpbmVJdGVtXTtcblx0XHRcdG5leHRGaXJzdExpbmVJdGVtID0gbmV4dEZpcnN0TGluZUl0ZW0gKyAxO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXQgPSBwdWZmZXJGaWVsZEl0ZW1zW25leHRGaXJzdExpbmVJdGVtXTtcblx0XHRcdG5leHRGaXJzdExpbmVJdGVtID0gbmV4dEZpcnN0TGluZUl0ZW0gKyAxO1xuXHRcdH1cblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXG5cdGRlZmluZU5leHRSYW5kb21BcnJheTogZnVuY3Rpb24gZGVmaW5lTmV4dFJhbmRvbUFycmF5KCkge1xuXHRcdC8vU2NvcmU/IVxuXHRcdHZhciBzY29yZSA9IHRoaXMuZ2FtZS5nZXRDb21wb25lbnQoJ0dhbWUnKS5zY29yZTtcblx0XHRjb25zb2xlLmxvZygnTTogZGVmaW5lTmV4dFJhbmRvbUFycmF5Jyk7XG5cdFx0Y29uc29sZS5sb2coJ1Njb3JlIGF1c2dlbGVzZW46ICcsIHNjb3JlKTtcblxuXHRcdHB1ZmZlckZpZWxkID0gW107XG5cdFx0cHVmZmVyRmllbGRJdGVtcyA9IFtdO1xuXG5cdFx0dmFyIHJhbmQgPSBNYXRoLnJhbmRvbSgpICogMTAgKyAxO1xuXHRcdGNvbnNvbGUubG9nKCdSYW5kb206ICcsIHJhbmQpO1xuXG5cdFx0aWYgKHNjb3JlIDw9IDM1KSB7XG5cdFx0XHRpZiAocmFuZCA8IDQpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1dJUiBXRUlTRSBMMTFDIHp1Jyk7XG5cdFx0XHRcdHB1ZmZlckZpZWxkID0gTGV2ZWwuTDExQztcblx0XHRcdFx0cHVmZmVyRmllbGRJdGVtcyA9IExldmVsLkwxMUk7XG5cdFx0XHR9IGVsc2UgaWYgKHJhbmQgPCA3KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXSVIgV0VJU0UgTDEyQyB6dScpO1xuXHRcdFx0XHRwdWZmZXJGaWVsZCA9IExldmVsLkwxMkM7XG5cdFx0XHRcdHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMTJJO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1dJUiBXRUlTRSBMMTNDIHp1Jyk7XG5cdFx0XHRcdHB1ZmZlckZpZWxkID0gTGV2ZWwuTDEzQztcblx0XHRcdFx0cHVmZmVyRmllbGRJdGVtcyA9IExldmVsLkwxM0k7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChzY29yZSA8PSA3MCkge1xuXHRcdFx0aWYgKHJhbmQgPCA0KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXSVIgV0VJU0UgTDIxQyB6dScpO1xuXHRcdFx0XHRwdWZmZXJGaWVsZCA9IExldmVsLkwyMUM7XG5cdFx0XHRcdHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMjFJO1xuXHRcdFx0fSBlbHNlIGlmIChyYW5kIDwgNykge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnV0lSIFdFSVNFIEwyMkMgenUnKTtcblx0XHRcdFx0cHVmZmVyRmllbGQgPSBMZXZlbC5MMjJDO1xuXHRcdFx0XHRwdWZmZXJGaWVsZEl0ZW1zID0gTGV2ZWwuTDIySTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXSVIgV0VJU0UgTDIzQyB6dScpO1xuXHRcdFx0XHRwdWZmZXJGaWVsZCA9IExldmVsLkwyM0M7XG5cdFx0XHRcdHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMjNJO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAocmFuZCA8IDQpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1dJUiBXRUlTRSBMMzFDIHp1Jyk7XG5cdFx0XHRcdHB1ZmZlckZpZWxkID0gTGV2ZWwuTDMxQztcblx0XHRcdFx0cHVmZmVyRmllbGRJdGVtcyA9IExldmVsLkwzMUk7XG5cdFx0XHR9IGVsc2UgaWYgKHJhbmQgPCA3KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXSVIgV0VJU0UgTDMyQyB6dScpO1xuXHRcdFx0XHRwdWZmZXJGaWVsZCA9IExldmVsLkwzMkM7XG5cdFx0XHRcdHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMzJJO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1dJUiBXRUlTRSBMMzNDIHp1Jyk7XG5cdFx0XHRcdHB1ZmZlckZpZWxkID0gTGV2ZWwuTDMzQztcblx0XHRcdFx0cHVmZmVyRmllbGRJdGVtcyA9IExldmVsLkwzM0k7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdG5leHRGaXJzdExpbmUgPSAwO1xuXHRcdG5leHRGaXJzdExpbmVJdGVtID0gMDtcblx0fSxcblxuXHRhZGRaT3JkZXJUb0dhbWVGaWVsZDogZnVuY3Rpb24gYWRkWk9yZGVyVG9HYW1lRmllbGQoKSB7XG5cdFx0Y2MubG9nKCdNOiBhZGRaT3JkZXJUb0dhbWVGaWVsZCcpO1xuXHRcdHZhciBjb3VudCA9IDE7XG5cdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLmdhbWVGaWVsZC5sZW5ndGg7IHkrKykge1xuXHRcdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmdhbWVGaWVsZFt5XS5sZW5ndGg7IHgrKykge1xuXHRcdFx0XHR0aGlzLmdhbWVGaWVsZFt5XVt4XS5zZXRMb2NhbFpPcmRlcihjb3VudCk7XG5cdFx0XHRcdGNvdW50Kys7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdGdldEJsb2NrVHlwZTogZnVuY3Rpb24gZ2V0QmxvY2tUeXBlKGJsb2NrKSB7XG5cdFx0Y2MubG9nKCdNOiBnZXRCbG9ja1R5cGUnKTtcblx0XHRjYy5sb2coYmxvY2submFtZSk7XG5cdFx0Ly92YXIgcmV0ID0gYmxvY2suZ2V0Q2xhc3NOYW1lKCk7XG5cdFx0Ly9jYy5sb2cocmV0KTtcblx0XHRyZXR1cm4gYmxvY2submFtZTtcblx0fSxcblxuXHRjYWxsUHJlZmFiOiBmdW5jdGlvbiBjYWxsUHJlZmFiKHByZWYpIHtcblx0XHR0aGlzLnByZWYubm9kZS5jb2xsaWRlKCk7XG5cdH1cbn0pO1xuLypcclxuIGluaXRpYWxpemVGaWVsZDI6IGZ1bmN0aW9uKHgseSl7XHJcbiB0aGlzLmdhbWVGaWVsZCA9IFt4XTtcclxuIGZvciAodmFyIGggPSAwOyBoIDwgeDsgaCsrKSB7IC8vY3JlYXRlIGFycmF5IHdpdGggdW5ldmVuIHJvd3NcclxuIGlmKGglMj09PTEpe1xyXG4gdGhpcy5nYW1lRmllbGRbaF0gPSBbeS0xXTsgLy91bmV2ZW5cclxuIH0gZWxzZSB7XHJcbiB0aGlzLmdhbWVGaWVsZFtoXSA9IFt5XTtcclxuIH1cclxuIH1cclxuXG4gZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdhbWVGaWVsZC5sZW5ndGg7IGkrKykge1xyXG4gZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLmdhbWVGaWVsZFtpXS5sZW5ndGg7IGorKykge1xyXG4gaWYodGhpcy5nYW1lRmllbGRbaV0ubGVuZ3RoJTI9PT0xKXsgLy8gZXZlbiBhcnJheS9yb3dcclxuIG5ld0N1YmUgPSB0aGlzLnNwYXduQ3ViZShzdGFydFgrKHgqZGlzdFgpLCBzdGFydFktKGRpc3RZKnkpLCBzdGFydEZpZWxkMltpXVtqXSk7XHJcbiB9XHJcbiBlbHNleyAvLyB1bmV2ZW4gYXJyYXkvcm93XHJcbiBuZXdDdWJlID0gdGhpcy5zcGF3bkN1YmUoc3RhcnRYKyh4KmRpc3RYKS0oZGlzdFgvMiksIHN0YXJ0WS0oZGlzdFkqeSksIHN0YXJ0RmllbGQyW2ldW2pdKTtcclxuIH1cclxuIHRoaXMuZ2FtZUZpZWxkW2ldW2pdID0gbmV3Q3ViZTsgLy9UT0RPIGFkZCBibG9ja3Mgbm90IG51bWJlcnNcclxuIH1cclxuIH1cclxuXG5cbiBjYy5sb2coXCJGaWVsZDpcIik7XHJcbiBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZ2FtZUZpZWxkLmxlbmd0aDsgaSsrKSB7XHJcbiBjYy5sb2codGhpcy5nYW1lRmllbGRbaV0uam9pbihcIlJvdzogXCIraStcIiBcIikpO1xyXG4gfVxyXG4gfSxcclxuXG4gYWRkRmlyc3RGaWVsZFJvdzogZnVuY3Rpb24ocm93KXtcclxuIHRoaXMuZmllbGQudW5zaGlmdChyb3cpO1xyXG4gfSxcclxuXG4gcmVtb3ZlTGFzdEZpZWxkUm93OiBmdW5jdGlvbigpe1xyXG4gdGhpcy5maWVsZC5wb3AoKTtcclxuIH0sXHJcblxuIGFkZEZpZWxkUm93IDogZnVuY3Rpb24oaW5kZXgsIHJvdyl7XHJcbiB0aGlzLmZpZWxkW2luZGV4XSA9IHJvdztcclxuIH0sXHJcblxuIHJlbW92ZUZpZWxkUm93IDogZnVuY3Rpb24oaW5kZXgpe1xyXG4gdmFyIHRlbXAgPSBbdGhpcy5ncmlkU2l6ZVhdO1xyXG4gZm9yKHZhciBoID0gMDsgaCA8IHRoaXMuZ3JpZFNpemVYOyBoKyspe1xyXG4gdGVtcFtoXSA9IHRoaXMuZmllbGRbaF07XHJcbiB9XHJcblxuIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmdyaWRTaXplWDsgaSsrKXtcclxuIGlmKGkgIT0gMCl7XHJcbiB2YXIgbmV3aW5kZXggPSBpLTE7XHJcbiBjYy5sb2coXCJJbmQ6IFwiK25ld2luZGV4KTtcclxuIHRoaXMuZmllbGRbaV0gPSB0ZW1wW25ld2luZGV4XTtcclxuIH1cclxuIH1cclxuIH0sXHJcblxuIGdlbmVyYXRlUm93IDogZnVuY3Rpb24oKXtcclxuIHZhciBpID0gdGhpcy5ncmlkU2l6ZVgrdGhpcy5jb3VudDtcclxuIHRoaXMuY291bnQrKztcclxuIHJldHVybiBbaSxpLGksaSxpXTtcclxuIC8vVE9ETzogbG9hZCBhIHJvdyBmcm9tIHRpbGVkIGZpbGUgcmV0dXJuIGFycmF5XHJcbiB9LCovXG5cbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMDc2ZWYrQ2JxVkNGSy9ROXNjckw4VWknLCAnR2FtZScpO1xuLy8gc2NyaXB0c1xcR2FtZS5qc1xuXG4vL0dhbWVcbi8vIEltcG9ydHNcbnZhciBHYW1lU3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5HYW1lU3RhdGU7XG52YXIgUGxheWVyTW92ZW1lbnRTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLlBsYXllck1vdmVtZW50U3RhdGU7XG52YXIgU3RlcCA9IHJlcXVpcmUoJ1R5cGVzJykuQmxvY2tUeXBlO1xuXG52YXIgd2hpY2hTdGVwID0gU3RlcC5Ob25lO1xudmFyIHVwZGF0ZUFjY2VzcyA9IHRydWU7XG52YXIgb25TdGVwcEtpbGxzID0gZmFsc2U7XG52YXIga2lsbEFjdGlvbkV4ZWN1dGVkID0gZmFsc2U7XG52YXIgcHJlc3NEb3VibGUgPSAwO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHN0YXRlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IEdhbWVTdGF0ZS5Ob25lLFxuICAgICAgICAgICAgdHlwZTogR2FtZVN0YXRlXG4gICAgICAgIH0sXG4gICAgICAgIC8vIEdhbWUgRGF0YS9PYmplY3RzXG4gICAgICAgIGdhbWVmaWVsZDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIHBsYXllcjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIEdhbWUtVUlcbiAgICAgICAgc2NvcmVMYWJlbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcblxuICAgICAgICBtdWx0aXBsaWVyTGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyBNdXNpYyBUaGVtZVxuICAgIC8qdGhlbWV1cmw6IHtcclxuICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgIHR5cGU6IGNjLnVybCxcclxuICAgIH0sKi9cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgLy90aGlzLnNldEZyYW1lUmF0ZSg2MCk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBHYW1lU3RhdGUuV2FpdGluZztcbiAgICAgICAgLy90aGlzLkdhbWVTdGF0ZSA9IEdhbWVTdGF0ZTtcbiAgICAgICAgdGhpcy5pbml0YWxpemVJbnB1dENvbnRyb2woKTsgLy8gQWN0aXZhdGUgaW5wdXQgaGFuZGxpbmdcblxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5TXVzaWMoXCIuLlxcYXVkaW9cXG11c2ljXFx0aGVtZVwiLCB0cnVlKTtcblxuICAgICAgICB0aGlzLnNjb3JlID0gMDtcbiAgICAgICAgdGhpcy5zY29yZU11bHRpcGxpZXIgPSAxO1xuICAgICAgICB0aGlzLm11bHRpcGxpZXJBY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLnN0ZXBwZWRCbG9jayA9IG51bGw7XG4gICAgfSxcblxuICAgIHJlc2V0OiBmdW5jdGlvbiByZXNldCgpIHt9LFxuXG4gICAgLy8gQ2FsbGVkIHdoZW4gcGxheWVyIG9uTG9hZCgpIGhhcyBmaW5pc2hlZFxuICAgIG9uUGxheWVyTG9hZENhbGxiYWNrOiBmdW5jdGlvbiBvblBsYXllckxvYWRDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5nYW1lZmllbGQucGxheWVyID0gdGhpcy5wbGF5ZXI7XG5cbiAgICAgICAgLy8gUGxheWVyIGlzIGFzc2VtYmxlZC4gc2V0IGFsbCBuZWVkZWQgZ3JhcGhpY2FsIGluZm9ybWF0aW9uXG4gICAgICAgIHRoaXMucGxheWVyLm5vZGUuc2V0UG9zaXRpb24odGhpcy5nYW1lZmllbGQuZ2V0U3RhcnRQb3NpdGlvbigpKTtcbiAgICAgICAgdGhpcy5wbGF5ZXIubm9kZS5zZXRMb2NhbFpPcmRlcigxMDAwKTtcbiAgICAgICAgdGhpcy5wbGF5ZXIuZHggPSB0aGlzLmdhbWVmaWVsZC5kaXNUWCAvIDI7IC8vb25seSBoYWxmIHRoZSBkaXN0YW5jZSBvbiB4ISFcbiAgICAgICAgdGhpcy5wbGF5ZXIuZHkgPSB0aGlzLmdhbWVmaWVsZC5kaXNUWTtcbiAgICB9LFxuXG4gICAgLy8gQ2FsbGVkIHdoZW4gZ2FtZWZpZWxkIGlzIGluaXRhbGl6ZWQgKCBvbkxvYWQoKSBoYXMgZmluaXNoZWQgKVxuICAgIG9uR2FtZUZpZWxkTG9hZENhbGxiYWNrOiBmdW5jdGlvbiBvbkdhbWVGaWVsZExvYWRDYWxsYmFjaygpIHt9LFxuXG4gICAgLy9UT0RPIGhpZXIgd2lyZCBlaW4gRmVobGVyIHZlcnVyc2FjaHQsIHdlbm4gR2lmdCBOQUNIIGVpbmVtIFN3aXRjaGVyIGtvbW10IVxuICAgIHZhbGlkYXRlTW92ZTogZnVuY3Rpb24gdmFsaWRhdGVNb3ZlKGRpcikge1xuXG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBHYW1lU3RhdGUuR2FtZU92ZXIpIHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ0R1IGRhcmZzdCBuaWNodCBiZXdlZ2VuLCB3ZWlsIGR1IGdhbWVPdmVyIGJpc3QnKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnBsYXllci5tb3Zlc3RhdGUgPT09IFBsYXllck1vdmVtZW50U3RhdGUuSnVtcGluZyB8fCB0aGlzLnBsYXllci5tb3Zlc3RhdGUgPT09IFBsYXllck1vdmVtZW50U3RhdGUuRmFsbGluZykge1xuICAgICAgICAgICAgLy9QbGF5ZXIgYWxyZWFkeSBqdW1waW5nL2ZhbGxpbmcgLT4gbmVnbGVjdCBpbnB1dFxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vdmFyIGN1cnJlbnRmaWVsZCA9IHRoaXMucGxheWVyLm9sZERlc3Q7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ0Jsb2NrVHlwZTogJywgdGhpcy5nYW1lZmllbGQuZ2V0QmxvY2tUeXBlKHRoaXMuZ2FtZWZpZWxkLmdldEp1bXBGaWVsZChkaXIpKSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ3ZhciBkZXN0ZmllbGQgPSAnLCBkZXN0ZmllbGQpO1xuXG4gICAgICAgIC8vc3RlcHBlZEJsb2NrIGlzIG5lY2Vzc2FycnkgZm9yIE1vdmVtZW50LWNvbGxpc2lvbmNvbnRyb2xsXG4gICAgICAgIGlmICh0aGlzLnBsYXllci5pc1N3YXBlZCkge1xuICAgICAgICAgICAgZGlyID0gLWRpcjtcbiAgICAgICAgICAgIHRoaXMucGxheWVyLmlzU3dhcGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRlc3RmaWVsZCA9IHRoaXMuZ2FtZWZpZWxkLmdldEp1bXBGaWVsZChkaXIpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdkZXN0ZmllbGQgPSAnLCB0aGlzLmRlc3RmaWVsZCk7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2Rlc3RmaWVsZCA9ICcsIHRoaXMuZGVzdGZpZWxkLm5hbWUpO1xuICAgICAgICB2YXIgc3RlcHBlZEJsb2NrID0gdGhpcy5kZXN0ZmllbGQuZ2V0Q29tcG9uZW50KHRoaXMuZGVzdGZpZWxkLm5hbWUpO1xuXG4gICAgICAgIGlmIChzdGVwcGVkQmxvY2suaXNCbG9ja2VkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAhISEgSU5TRVJUIGxpbmVzIGF0IGVuZCBvZiBmaWxlIHdoZW4gYnVncyBoYXBwZW4gaGVyZSAhISFcblxuICAgICAgICAvL1xuICAgICAgICAvL01vdmUgd2FzIGNvcnJlY3QuXG4gICAgICAgIC8vXG4gICAgICAgIC8vQ2hhbmdlIHBsYXllciBkaXJlY3Rpb25cbiAgICAgICAgdGhpcy5wbGF5ZXIuZGlyID0gZGlyO1xuICAgICAgICB0aGlzLmluY3JlbWVudFNjb3JlKDEpO1xuICAgICAgICB0aGlzLnNjb3JlTGFiZWwuc3RyaW5nID0gdGhpcy5zY29yZS50b1N0cmluZygpO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBpbml0YWxpemVJbnB1dENvbnRyb2w6IGZ1bmN0aW9uIGluaXRhbGl6ZUlucHV0Q29udHJvbCgpIHtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKHtcbiAgICAgICAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLktFWUJPQVJELFxuXG4gICAgICAgICAgICBvbktleVByZXNzZWQ6IGZ1bmN0aW9uIG9uS2V5UHJlc3NlZChrZXlDb2RlLCBldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLnN0YXRlID09IEdhbWVTdGF0ZS5QYXVzZWQpIHJldHVybjtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkuYTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLnN0YXRlID09PSBHYW1lU3RhdGUuV2FpdGluZykgc2VsZi5zdGF0ZSA9IEdhbWVTdGF0ZS5QbGF5aW5nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi52YWxpZGF0ZU1vdmUoMSkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwcmVzc0RvdWJsZTogJywgcHJlc3NEb3VibGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmVzc0RvdWJsZSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdOT0NITUFMJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXNzRG91YmxlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucGxheWVyLm1vdmUoc2VsZi5kZXN0ZmllbGQsIHNlbGYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ2FtZWZpZWxkLnVwZGF0ZVBsYXllckFycmF5UG9zKCk7IC8vIENoYW5nZSBhcnJheSBwb3NpdGlvbiBhZnRlciBqdW1wIG9yIGJ1Z3Mgd2lsbCBzcGF3blxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucGxheWVyLm9sZERlc3QuZ2V0Q29tcG9uZW50KHNlbGYucGxheWVyLm9sZERlc3QubmFtZSkucGxheWVyT25Ub3AgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5kOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuc3RhdGUgPT09IEdhbWVTdGF0ZS5XYWl0aW5nKSBzZWxmLnN0YXRlID0gR2FtZVN0YXRlLlBsYXlpbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLnZhbGlkYXRlTW92ZSgtMSkpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwcmVzc0RvdWJsZTogJywgcHJlc3NEb3VibGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcmVzc0RvdWJsZSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdOT0NITUFMJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXNzRG91YmxlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wbGF5ZXIubW92ZShzZWxmLmRlc3RmaWVsZCwgc2VsZik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5nYW1lZmllbGQudXBkYXRlUGxheWVyQXJyYXlQb3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnBsYXllci5vbGREZXN0LmdldENvbXBvbmVudChzZWxmLnBsYXllci5vbGREZXN0Lm5hbWUpLnBsYXllck9uVG9wID0gZmFsc2U7IC8vVE9ETyB2bGwgaW4gcGxheWVyP1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLnU6XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmdhbWVmaWVsZC51cGRhdGVGaWVsZCgtMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLms6XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnBsYXllci5raWxsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkuZXNjYXBlOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2MubG9nKFwiRXNjYXBlIHByZXNzZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiB3aGF0IHRvIGRvIG9uIGVzY2FwZWQtcHJlc3NlZD9cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5mOlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wbGF5ZXIuZmFsbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgb25LZXlSZWxlYXNlZDogZnVuY3Rpb24gb25LZXlSZWxlYXNlZChrZXlDb2RlLCBldmVudCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoa2V5Q29kZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5hOlxuXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkuZDpcblxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCBzZWxmLm5vZGUpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ006IHVwZGF0ZScpO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gR2FtZVN0YXRlLlBsYXlpbmcpIHtcbiAgICAgICAgICAgIHRoaXMubW92ZUZpZWxkV2l0aFBsYXllcigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBHYW1lU3RhdGUuR2FtZU92ZXIpIHtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnR2FtZU92ZXJTY2VuZScpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG1vdmVGaWVsZFdpdGhQbGF5ZXI6IGZ1bmN0aW9uIG1vdmVGaWVsZFdpdGhQbGF5ZXIoKSB7XG4gICAgICAgIHZhciB5U3BlZWQgPSB0aGlzLnBsYXllci5hcnJheVBvc1k7XG4gICAgICAgIC8vIGNjLmxvZygnUGxheWVycG9zJywgeVNwZWVkKTtcbiAgICAgICAgaWYgKHVwZGF0ZUFjY2Vzcykge1xuICAgICAgICAgICAgLy9jYy5sb2coJ1VQREFURS1DYXNlcyBiZXRyZXRlbicpO1xuICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gZmFsc2U7XG4gICAgICAgICAgICBzd2l0Y2ggKHlTcGVlZCkge1xuICAgICAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gdGhpcy5nYW1lZmllbGQudXBkYXRlRmllbGQoLTAuMyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gdGhpcy5nYW1lZmllbGQudXBkYXRlRmllbGQoLTAuNCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gdGhpcy5nYW1lZmllbGQudXBkYXRlRmllbGQoLTEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUFjY2VzcyA9IHRoaXMuZ2FtZWZpZWxkLnVwZGF0ZUZpZWxkKC0xLjUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUFjY2VzcyA9IHRoaXMuZ2FtZWZpZWxkLnVwZGF0ZUZpZWxkKC0yKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVBY2Nlc3MgPSB0aGlzLmdhbWVmaWVsZC51cGRhdGVGaWVsZCgtNCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gdGhpcy5nYW1lZmllbGQudXBkYXRlRmllbGQoLTgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUFjY2VzcyA9IHRoaXMuZ2FtZWZpZWxkLnVwZGF0ZUZpZWxkKC0xMik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gdGhpcy5nYW1lZmllbGQudXBkYXRlRmllbGQoLTIwKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gdGhpcy5nYW1lZmllbGQudXBkYXRlRmllbGQoLTAuMyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vXG4gICAgLy8gSEVMUElORyBNRVRIT0RTLiBTTUFMTCBTVFVGRlxuICAgIC8vXG5cbiAgICBjaGFuZ2VNdWx0aXBsaWVyOiBmdW5jdGlvbiBjaGFuZ2VNdWx0aXBsaWVyKHZhbHVlKSB7XG4gICAgICAgIC8vVE9ETzogU3RvcCBhbmQgc3RhcnQgYWN0aW9uIGJ5IHRhZ1xuICAgICAgICB0aGlzLnNjb3JlTXVsdGlwbGllciA9IHZhbHVlO1xuICAgICAgICB0aGlzLm11bHRpcGxpZXJMYWJlbC5zdHJpbmcgPSBcIk11bHRpcGxpZXI6IFwiICsgdGhpcy5zY29yZU11bHRpcGxpZXI7XG4gICAgICAgIHRoaXMubXVsdGlwbGllckxhYmVsLm5vZGUub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgdmFyIHJlc2V0TXVsdGlwbGllckNhbGxiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5yZXNldE11bHRpcGxpZXIsIHRoaXMpO1xuICAgICAgICB0aGlzLm11bHRpcGxpZXJMYWJlbC5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy5mYWRlT3V0KDUpLCByZXNldE11bHRpcGxpZXJDYWxsYmFjaykpO1xuICAgIH0sXG5cbiAgICByZXNldE11bHRpcGxpZXI6IGZ1bmN0aW9uIHJlc2V0TXVsdGlwbGllcigpIHtcbiAgICAgICAgdGhpcy5zY29yZU11bHRpcGxpZXIgPSAwO1xuICAgIH0sXG5cbiAgICBpbmNyZW1lbnRTY29yZTogZnVuY3Rpb24gaW5jcmVtZW50U2NvcmUoaW5jKSB7XG4gICAgICAgIHRoaXMuc2NvcmUgKz0gaW5jICogdGhpcy5zY29yZU11bHRpcGxpZXI7XG4gICAgfSxcblxuICAgIC8vRGVwcmVjYXRlZFxuICAgIGNoZWNrSXRlbUNvbGxpc2lvbjogZnVuY3Rpb24gY2hlY2tJdGVtQ29sbGlzaW9uKGl0ZW0pIHtcbiAgICAgICAgdmFyIGl0ZW1wb3MgPSBpdGVtLm5vZGUuZ2V0UG9zaXRpb24oKTtcbiAgICAgICAgdmFyIHBwb3MgPSB0aGlzLnBsYXllci5ub2RlLmdldFBvc2l0aW9uKCk7XG4gICAgICAgIHZhciBkaXN0ID0gY2MucERpc3RhbmNlKGl0ZW1wb3MsIHBwb3MpO1xuICAgICAgICBpZiAoZGlzdCA8IGl0ZW0uY29sbGVjdFJhZGl1cykge1xuICAgICAgICAgICAgaXRlbS5vblBpY2tVcENhbGxiYWNrKHRoaXMucGxheWVyKTtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG4vKnN3aXRjaChkZXN0ZmllbGQpe1xyXG4gICAgY2FzZSAnR3Jhc3MnOlxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ2Nhc2UgR3Jhc3MnKTtcclxuICAgICAgICBpZighdGhpcy5nYW1lZmllbGQuZ2V0SnVtcEZpZWxkKGRpcikuZ2V0Q29tcG9uZW50KCdHcmFzcycpLmlzQmxvY2tlZCl7XHJcbiAgICAgICAgICAgIHJldCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vc3RlcHBlZEJsb2NrIGlzIG5lY2Vzc2FycnkgZm9yIENvbGxpc2lvbmNvbnRyb2xsXHJcbiAgICAgICAgdGhpcy5zdGVwcGVkQmxvY2sgPSB0aGlzLmdhbWVmaWVsZC5nZXRKdW1wRmllbGQoZGlyKS5nZXRDb21wb25lbnQoJ0dyYXNzJyk7XHJcbiAgICAgICAgd2hpY2hTdGVwID0gU3RlcC5HcmFzcztcclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgJ0RpcnQnOlxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ2Nhc2UgZGlydCcpO1xyXG4gICAgICAgIGlmKCF0aGlzLmdhbWVmaWVsZC5nZXRKdW1wRmllbGQoZGlyKS5nZXRDb21wb25lbnQoJ0RpcnQnKS5pc0Jsb2NrZWQpe1xyXG4gICAgICAgICAgICByZXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0ZXBwZWRCbG9jayA9IHRoaXMuZ2FtZWZpZWxkLmdldEp1bXBGaWVsZChkaXIpLmdldENvbXBvbmVudCgnRGlydCcpO1xyXG4gICAgICAgIHdoaWNoU3RlcCA9IFN0ZXAuRGlydDtcclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgJ1RyYXBkb29yJzpcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdjYXNlIFRyYXBkb29yJyk7XHJcbiAgICAgICAgaWYoIXRoaXMuZ2FtZWZpZWxkLmdldEp1bXBGaWVsZChkaXIpLmdldENvbXBvbmVudCgnVHJhcGRvb3InKS5pc0Jsb2NrZWQpe1xyXG4gICAgICAgICAgICByZXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0ZXBwZWRCbG9jayA9IHRoaXMuZ2FtZWZpZWxkLmdldEp1bXBGaWVsZChkaXIpLmdldENvbXBvbmVudCgnVHJhcGRvb3InKTtcclxuICAgICAgICB3aGljaFN0ZXAgPSBTdGVwLlRyYXBkb29yO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnRW1wdHknOlxyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ2Nhc2UgRW1wdHknKTtcclxuICAgICAgICBpZighdGhpcy5nYW1lZmllbGQuZ2V0SnVtcEZpZWxkKGRpcikuZ2V0Q29tcG9uZW50KCdFbXB0eScpLmlzQmxvY2tlZCl7XHJcbiAgICAgICAgICAgIHJldCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RlcHBlZEJsb2NrID0gdGhpcy5nYW1lZmllbGQuZ2V0SnVtcEZpZWxkKGRpcikuZ2V0Q29tcG9uZW50KCdFbXB0eScpO1xyXG4gICAgICAgIHdoaWNoU3RlcCA9IFN0ZXAuRW1wdHk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdXYXRlcl9Cb3JkZXInOlxyXG4gICAgICAgIGlmKCF0aGlzLmdhbWVmaWVsZC5nZXRKdW1wRmllbGQoZGlyKS5nZXRDb21wb25lbnQoJ0VtcHR5JykuaXNCbG9ja2VkKXtcclxuICAgICAgICAgICAgcmV0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdGVwcGVkQmxvY2sgPSB0aGlzLmdhbWVmaWVsZC5nZXRKdW1wRmllbGQoZGlyKS5nZXRDb21wb25lbnQoJ0VtcHR5Jyk7XHJcbiAgICAgICAgd2hpY2hTdGVwID0gU3RlcC5FbXB0eTtcclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgJ1BvaXNvbic6XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnY2FzZSBQb2lzb24nKTtcclxuICAgICAgICBpZighdGhpcy5nYW1lZmllbGQuZ2V0SnVtcEZpZWxkKGRpcikuZ2V0Q29tcG9uZW50KCdQb2lzb24nKS5pc0Jsb2NrZWQpe1xyXG4gICAgICAgICAgICByZXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0ZXBwZWRCbG9jayA9IHRoaXMuZ2FtZWZpZWxkLmdldEp1bXBGaWVsZChkaXIpLmdldENvbXBvbmVudCgnUG9pc29uJyk7XHJcbiAgICAgICAgd2hpY2hTdGVwID0gU3RlcC5Qb2lzb247XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdTd2l0Y2hlcic6XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZygnY2FzZSBTd2l0Y2hlcicpO1xyXG4gICAgICAgIGlmKCF0aGlzLmdhbWVmaWVsZC5nZXRKdW1wRmllbGQoZGlyKS5nZXRDb21wb25lbnQoJ1N3aXRjaGVyJykuaXNCbG9ja2VkKXtcclxuICAgICAgICAgICAgcmV0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdGVwcGVkQmxvY2sgPSB0aGlzLmdhbWVmaWVsZC5nZXRKdW1wRmllbGQoZGlyKS5nZXRDb21wb25lbnQoJ1N3aXRjaGVyJyk7XHJcbiAgICAgICAgd2hpY2hTdGVwID0gU3RlcC5Td2l0Y2hlcjtcclxuICAgICAgICBicmVhaztcclxuICAgIGNhc2UgJ1NwaWtlJzpcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdjYXNlIFNwaWtlJyk7XHJcbiAgICAgICAgaWYoIXRoaXMuZ2FtZWZpZWxkLmdldEp1bXBGaWVsZChkaXIpLmdldENvbXBvbmVudCgnU3Bpa2UnKS5pc0Jsb2NrZWQpe1xyXG4gICAgICAgICAgICByZXQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0ZXBwZWRCbG9jayA9IHRoaXMuZ2FtZWZpZWxkLmdldEp1bXBGaWVsZChkaXIpLmdldENvbXBvbmVudCgnU3Bpa2UnKTtcclxuICAgICAgICB3aGljaFN0ZXAgPSBTdGVwLlNwaWtlO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3N0ZXBwZWRCbG9jayBhdWYgU3Bpa2UgZ2VzZXR6dCcpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5zdGVwcGVkQmxvY2spO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgICByZXQgPSB0cnVlO1xyXG4gICAgICAgIGJyZWFrO1xyXG59Ki9cblxuLyp2YXIgZGVzdGZpZWxkID0gdGhpcy5nYW1lZmllbGQuZ2V0SnVtcEZpZWxkKGRpcik7IC8vIEZpZWxkIHBsYXllciB3YW50cyB0byBqdW1wIGF0XHJcbiBjb25zb2xlLmxvZygnTTogdmFsaWRhdGVtTW92ZScpO1xyXG4gY29uc29sZS5sb2coJ0Jsb2NrVHlwZSA9ICcsIHRoaXMuZ2FtZWZpZWxkLmdldEJsb2NrVHlwZSh0aGlzLmdhbWVmaWVsZC5nZXRKdW1wRmllbGQoZGlyKSkpO1xyXG4gdGhpcy5zdGVwcGVkQmxvY2sgPSBkZXN0ZmllbGQuZ2V0Q29tcG9uZW50KCdCbG9jaycpO1xyXG4gaWYodGhpcy5zdGVwcGVkQmxvY2sgIT09IG51bGwpe1xyXG4gaWYodGhpcy5zdGVwcGVkQmxvY2suaXNCbG9ja2VkKXsgICAgLy8gQmxvY2sgaXMuLi5ibG9ja2VkXHJcbiByZXR1cm4gZmFsc2U7XHJcbiB9XHJcbiB9Ki9cblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzY1YjkxbGxta3hKdEpraHFzWXpGcDcxJywgJ0dyYXNzJyk7XG4vLyBzY3JpcHRzXFxnYW1lZmllbGRcXGJsb2Nrc1xcR3Jhc3MuanNcblxudmFyIEJsb2NrVHlwZSA9IHJlcXVpcmUoJ1R5cGVzJykuQmxvY2tUeXBlO1xudmFyIFBsYXllck1vdmVtZW50U3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5QbGF5ZXJNb3ZlbWVudFN0YXRlO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGlzQmxvY2tlZDogZmFsc2UsXG4gICAgICAgIGhhc0l0ZW06IGZhbHNlLFxuXG4gICAgICAgIGJsb2NrdHlwZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBCbG9ja1R5cGUuTm9uZSxcbiAgICAgICAgICAgIHR5cGU6IEJsb2NrVHlwZVxuICAgICAgICB9LFxuXG4gICAgICAgIGl0ZW06IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnBsYXllck9uVG9wID0gZmFsc2U7XG4gICAgfSxcblxuICAgIG9uU3RlcENhbGxiYWNrOiBmdW5jdGlvbiBvblN0ZXBDYWxsYmFjayhwbGF5ZXIsIGdhbWUpIHtcbiAgICAgICAgY2MubG9nKCdNOiBvblN0ZXBDYWxsYmFjayBHcmFzcycpO1xuICAgIH0sXG5cbiAgICBjb2xsaWRlOiBmdW5jdGlvbiBjb2xsaWRlKCkge31cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2E5ZDVmaE1wRFJCN3Jud2d6bDBZMTlaJywgJ0l0ZW0nKTtcbi8vIHNjcmlwdHNcXGdhbWVvYmplY3RzXFxJdGVtLmpzXG5cblxudmFyIEl0ZW1UeXBlID0gcmVxdWlyZSgnVHlwZXMnKS5JdGVtVHlwZTtcbnZhciBJdGVtU3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5JdGVtU3RhdGU7XG52YXIgSXRlbUFjdGl2aXR5U3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5JdGVtQWN0aXZpdHlTdGF0ZTtcblxudmFyIHJpc2VZID0gNTA7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaXRlbXR5cGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogSXRlbVR5cGUuTm9uZSxcbiAgICAgICAgICAgIHR5cGU6IEl0ZW1UeXBlXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXRlbXN0YXRlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IEl0ZW1TdGF0ZS5QaWNrYWJsZSxcbiAgICAgICAgICAgIHR5cGU6IEl0ZW1TdGF0ZVxuICAgICAgICB9LFxuXG4gICAgICAgIGFjdGl2aXR5c3RhdGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogSXRlbUFjdGl2aXR5U3RhdGUuSWRsZSxcbiAgICAgICAgICAgIHR5cGU6IEl0ZW1BY3Rpdml0eVN0YXRlXG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGVjdFJhZGl1czogMCxcbiAgICAgICAgaXRlbVZhbHVlOiAwLCAvLyBWYWx1ZSBvZiB0aGUgaXRlbSB3aGVuIHBpY2tlZCB1cChwdXJlIHNjb3JlLCBzY29yZSBtdWx0aXBsaWVyKVxuICAgICAgICBpdGVtVGltZXI6IDAsXG5cbiAgICAgICAgYWN0aXZhdGlvbnNvdW5kOiB7IC8vIERyYWcgcmlnaHQgYXVkaW8gaGVyZS5cbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcblxuICAgIGRlc3Ryb3lJdGVtOiBmdW5jdGlvbiBkZXN0cm95SXRlbSgpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLml0ZW10eXBlKSB7XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkFudGlkb3RlOlxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Db2luOlxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5TdGFyOlxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlNsb3dlcjpcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25QaWNrVXBDYWxsYmFjazogZnVuY3Rpb24gb25QaWNrVXBDYWxsYmFjayhwbGF5ZXIsIGdhbWUpIHtcbiAgICAgICAgdGhpcy5pdGVtc3RhdGUgPSBJdGVtU3RhdGUuUGlja2VkO1xuICAgICAgICB0aGlzLmFjdGl2aXR5c3RhdGUgPSBJdGVtQWN0aXZpdHlTdGF0ZS5BY3RpdmU7XG4gICAgICAgIC8vIFBlcmZvcm0gdGhlIGFjdGlvbiB0aGUgaXRlbSBwcm9kdWNlcyhjaGFuZ2UgcGxheWVyIG9yIGVudmlyb25tZW50KVxuICAgICAgICBzd2l0Y2ggKHRoaXMuaXRlbXR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuQW50aWRvdGU6XG4gICAgICAgICAgICAgICAgcGxheWVyLmlzUG9pc29uZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIucG9pc29uVG1wID0gcGxheWVyLnBvaXNvblRpbWVyOyAvL3Jlc2V0IHRpbW1lclxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Db2luOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHQU1FOiAnLCBnYW1lLm5hbWUpO1xuICAgICAgICAgICAgICAgIGdhbWUuaW5jcmVtZW50U2NvcmUoNSk7XG4gICAgICAgICAgICAgICAgZ2FtZS5zY29yZUxhYmVsLnN0cmluZyA9IGdhbWUuc2NvcmUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuU3RhcjpcbiAgICAgICAgICAgICAgICBwbGF5ZXIuaXNQb2lzb25lZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHBsYXllci5pc0ludmluY2libGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5TbG93ZXI6XG4gICAgICAgICAgICAgICAgLy8gVE9ETyBzbG93IHBsYXllclxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwaWNrZWRDYWxsYmFjayA9IGNjLmNhbGxGdW5jKHRoaXMucGlja2VkLCB0aGlzKTtcbiAgICAgICAgdmFyIHNvdW5kY2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLnBsYXlTb3VuZCwgdGhpcyk7XG4gICAgICAgIC8vIFBlcmZvcm0gaXRlbSBhbmltYXRpb24gYW5kIGRlc3Ryb3kgaXRcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy5zcGF3bih0aGlzLmFzc2VtYmxlUGlja1VwQWN0aW9uKCksIHNvdW5kY2FsbGJhY2spLCBwaWNrZWRDYWxsYmFjaykpO1xuICAgIH0sXG5cbiAgICBhc3NlbWJsZVBpY2tVcEFjdGlvbjogZnVuY3Rpb24gYXNzZW1ibGVQaWNrVXBBY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuYWN0aXZpdHlzdGF0ZSA9IEl0ZW1BY3Rpdml0eVN0YXRlLkFjdGl2ZTtcbiAgICAgICAgLy8gUmlzZS1BbmltYXRpb24gZm9yIGl0ZW1zIHRvIHNob3cgdGhleSBoYXZlIGJlZW4gcGlja2VkIHVwICAgICAgIFxuICAgICAgICB2YXIgcmlzZVBvaW50ID0gY2MucCh0aGlzLm5vZGUuZ2V0UG9zaXRpb25YKCksIHRoaXMubm9kZS5nZXRQb3NpdGlvblkoKSArIHJpc2VZKTtcbiAgICAgICAgdmFyIGZhZGUgPSBjYy5mYWRlT3V0KHRoaXMuZ2V0SXRlbUFuaW1hdGlvblRpbWUoKSk7IC8vIExldCBpdGVtIGZhZGUgZHVyaW5nIGFuaW1hdGlvblxuICAgICAgICB2YXIgYW5pbSA9IG51bGw7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLml0ZW10eXBlKSB7XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlN0YXI6XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkNvaW46XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkFudGlkb3RlOlxuICAgICAgICAgICAgICAgIGFuaW0gPSBjYy5tb3ZlQnkodGhpcy5nZXRJdGVtQW5pbWF0aW9uVGltZSgpLCByaXNlUG9pbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYy5zcGF3bihmYWRlLCBhbmltKTtcbiAgICB9LFxuXG4gICAgZ2V0SXRlbUFuaW1hdGlvblRpbWU6IGZ1bmN0aW9uIGdldEl0ZW1BbmltYXRpb25UaW1lKHR5cGUpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLml0ZW10eXBlKSB7XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkFudGlkb3RlOlxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Db2luOlxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5TdGFyOlxuICAgICAgICAgICAgICAgIHJldHVybiAxLjU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcGlja2VkOiBmdW5jdGlvbiBwaWNrZWQoKSB7XG4gICAgICAgIHRoaXMuYWN0aXZpdHlzdGF0ZSA9IEl0ZW1BY3Rpdml0eVN0YXRlLkV4cGlyZWQ7XG4gICAgICAgIHRoaXMuZGVzdHJveUl0ZW0oKTtcbiAgICB9LFxuXG4gICAgcGxheVNvdW5kOiBmdW5jdGlvbiBwbGF5U291bmQoKSB7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5hY3RpdmF0aW9uc291bmQsIGZhbHNlKTtcbiAgICB9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3YzQ1ZXRJR1V0QkM1VmJrQUpKMlVDVCcsICdMZXZlbCcpO1xuLy8gc2NyaXB0c1xcZ2FtZWZpZWxkXFxMZXZlbC5qc1xuXG4vL0xldmVsXG52YXIgTDExQyA9IFtbNywgMSwgMSwgNiwgMSwgMSwgN10sIFs3LCAxLCAxLCAxLCAxLCA3XSwgWzcsIDcsIDEsIDYsIDEsIDcsIDddLCBbNywgMSwgMSwgMSwgMSwgN10sIFs3LCA3LCAxLCA2LCAxLCA3LCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddLCBbNywgMSwgMSwgNiwgMSwgMSwgN10sIFs3LCA2LCAxLCAxLCA2LCA3XV07XG5cbnZhciBMMTFJID0gW1swLCA4LCAwLCAwLCAwLCA4LCAwXSwgWzAsIDgsIDAsIDAsIDgsIDBdLCBbMCwgMCwgOCwgMCwgOCwgMCwgMF0sIFswLCA4LCAwLCAwLCA4LCAwXSwgWzAsIDAsIDgsIDAsIDgsIDAsIDBdLCBbMCwgOCwgMCwgMCwgOCwgMF0sIFswLCA4LCAwLCAwLCAwLCA4LCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdXTtcblxudmFyIEwxMkMgPSBbWzcsIDEsIDEsIDEsIDEsIDEsIDddLCBbNywgMSwgMSwgMSwgMSwgN10sIFs3LCAxLCAxLCAxLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddLCBbNywgMSwgMSwgMSwgMSwgNCwgN10sIFs3LCAxLCAxLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDMsIDEsIDEsIDddLCBbNywgMSwgMSwgMSwgMSwgN11dO1xuXG52YXIgTDEySSA9IFtbMCwgNCwgNywgMCwgMCwgMCwgMF0sIFswLCA0LCA3LCAwLCAwLCAwXSwgWzAsIDQsIDQsIDcsIDAsIDAsIDBdLCBbMCwgNCwgNCwgNywgOSwgMF0sIFswLCA0LCA0LCA0LCA3LCAwLCAwXSwgWzAsIDAsIDAsIDAsIDYsIDBdLCBbMCwgMCwgNywgMCwgNywgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwXV07XG5cbnZhciBMMTNDID0gW1s3LCAxLCA1LCAxLCAxLCAxLCA3XSwgWzcsIDYsIDEsIDEsIDEsIDddLCBbNywgMSwgNywgMSwgMSwgMSwgN10sIFs3LCAxLCA3LCAxLCAxLCA3XSwgWzcsIDEsIDEsIDcsIDEsIDEsIDddLCBbNywgMSwgMSwgNywgNiwgN10sIFs3LCAxLCAxLCA3LCAxLCAxLCA3XSwgWzcsIDEsIDcsIDEsIDEsIDddXTtcblxudmFyIEwxM0kgPSBbWzAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgNCwgNywgMCwgMF0sIFswLCA5LCAwLCA0LCAwLCA3LCAwXSwgWzAsIDksIDAsIDQsIDAsIDBdLCBbMCwgMCwgMCwgMCwgNCwgMCwgMF0sIFswLCAwLCAxLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMiwgMCwgMF1dO1xuXG52YXIgTDIxQyA9IFtbNywgMiwgMiwgMiwgMiwgMiwgN10sIFs3LCAyLCAyLCAyLCAyLCA3XSwgWzcsIDIsIDIsIDIsIDIsIDIsIDddLCBbNywgMiwgMiwgMiwgMiwgN10sIFs3LCA3LCAyLCAyLCAyLCA3LCA3XSwgWzcsIDYsIDYsIDYsIDYsIDddLCBbNywgMiwgMiwgMiwgMiwgMiwgN10sIFs3LCAyLCAyLCAyLCAyLCA3XV07XG5cbnZhciBMMjFJID0gW1swLCA3LCAwLCA3LCA0LCA3LCAwXSwgWzAsIDcsIDMsIDAsIDcsIDBdLCBbMCwgNywgMCwgNywgMywgNywgMF0sIFswLCA5LCA3LCA3LCA5LCAwXSwgWzAsIDAsIDksIDQsIDksIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF0sIFswLCA5LCA3LCA2LCA3LCA5LCAwXSwgWzAsIDksIDksIDksIDksIDBdXTtcblxudmFyIEwyMkMgPSBbWzcsIDQsIDQsIDcsIDQsIDQsIDddLCBbNywgNCwgNywgNywgMiwgN10sIFs3LCA3LCAyLCA3LCA0LCA3LCA3XSwgWzcsIDQsIDcsIDcsIDQsIDddLCBbNywgNywgNCwgNywgMiwgNywgN10sIFs3LCA0LCA3LCA3LCA0LCA3XSwgWzcsIDcsIDIsIDcsIDQsIDcsIDddLCBbNywgNCwgNywgNywgNCwgN11dO1xuXG52YXIgTDIySSA9IFtbMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCA0LCAwXSwgWzAsIDAsIDQsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCA0LCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgNCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwXV07XG5cbnZhciBMMjNDID0gW1s3LCAyLCAyLCAyLCAyLCAyLCA3XSwgWzcsIDUsIDUsIDUsIDUsIDddLCBbNywgMywgMiwgMiwgMiwgMywgN10sIFs3LCAzLCAyLCAyLCAzLCA3XSwgWzcsIDMsIDMsIDIsIDIsIDIsIDddLCBbNywgMywgMiwgMywgMiwgN10sIFs3LCAzLCAyLCAzLCAzLCAyLCA3XSwgWzcsIDIsIDIsIDMsIDIsIDddXTtcblxudmFyIEwyM0kgPSBbWzAsIDksIDksIDYsIDksIDksIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCA5LCAzLCA5LCAwLCAwXSwgWzAsIDAsIDAsIDMsIDAsIDBdLCBbMCwgMCwgMCwgOSwgMywgMCwgMF0sIFswLCAwLCAyLCAwLCAzLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDMsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF1dO1xuXG52YXIgTDMxQyA9IFtbNywgMywgNSwgMywgNSwgMywgN10sIFs3LCA0LCAzLCAzLCA0LCA3XSwgWzcsIDMsIDYsIDMsIDYsIDMsIDddLCBbNywgMywgNCwgNCwgMywgN10sIFs3LCAzLCAzLCA2LCAzLCAzLCA3XSwgWzcsIDMsIDIsIDQsIDMsIDddLCBbNywgMywgNCwgMywgNiwgMywgN10sIFs3LCAzLCAyLCAzLCAyLCA3XV07XG5cbnZhciBMMzFJID0gW1swLCA0LCAwLCA0LCAwLCAwLCAwXSwgWzAsIDAsIDQsIDQsIDAsIDBdLCBbMCwgNCwgMCwgMCwgMCwgMCwgMF0sIFswLCAyLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDEsIDAsIDBdLCBbMCwgMCwgMiwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDQsIDAsIDAsIDMsIDBdXTtcblxudmFyIEwzMkMgPSBbWzcsIDcsIDIsIDcsIDIsIDcsIDddLCBbNywgNiwgNywgNywgNiwgN10sIFs3LCA3LCA0LCAzLCA0LCA3LCA3XSwgWzcsIDUsIDYsIDYsIDUsIDddLCBbNywgNiwgNywgMiwgNywgNiwgN10sIFs3LCA0LCA3LCA2LCA0LCA3XSwgWzcsIDcsIDIsIDcsIDIsIDcsIDddLCBbNywgMywgMiwgNywgMiwgN11dO1xuXG52YXIgTDMySSA9IFtbMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCA0LCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgNCwgOSwgMCwgMCwgMCwgMF0sIFswLCAyLCAxLCAwLCAxLCAwXV07XG5cbnZhciBMMzNDID0gW1s3LCAxLCA2LCAxLCA2LCAxLCA3XSwgWzcsIDEsIDMsIDEsIDMsIDddLCBbNywgNiwgMSwgNiwgMSwgNiwgN10sIFs3LCAxLCA0LCA0LCAxLCA3XSwgWzcsIDUsIDMsIDYsIDMsIDUsIDddLCBbNywgMSwgMSwgMSwgMSwgN10sIFs3LCAxLCAxLCAxLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddXTtcblxudmFyIEwzM0kgPSBbWzAsIDAsIDMsIDAsIDQsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCA0LCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCA5LCA5LCA5LCA5LCAwXSwgWzAsIDksIDksIDksIDksIDksIDBdLCBbMCwgMCwgMCwgMSwgMCwgMF1dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBMMTFDOiBMMTFDLFxuICAgIEwxMUk6IEwxMUksXG4gICAgTDEyQzogTDEyQyxcbiAgICBMMTJJOiBMMTJJLFxuICAgIEwxM0M6IEwxM0MsXG4gICAgTDEzSTogTDEzSSxcbiAgICBMMjFDOiBMMjFDLFxuICAgIEwyMUk6IEwyMUksXG4gICAgTDIyQzogTDIyQyxcbiAgICBMMjJJOiBMMjJJLFxuICAgIEwyM0M6IEwyM0MsXG4gICAgTDIzSTogTDIzSSxcbiAgICBMMzFDOiBMMzFDLFxuICAgIEwzMUk6IEwzMUksXG4gICAgTDMyQzogTDMyQyxcbiAgICBMMzJJOiBMMzJJLFxuICAgIEwzM0M6IEwzM0MsXG4gICAgTDMzSTogTDMzSVxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzEwOTE1a3krakJGcklzQUUvbG55V3FOJywgJ01lbnVCdXR0b25DYWxsYmFja3MnKTtcbi8vIHNjcmlwdHNcXHNjZW5lc2NyaXB0c1xcTWVudUJ1dHRvbkNhbGxiYWNrcy5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgYnV0dG9uQXVkaW86IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcblxuICAgIHN0YXJ0Q29udHJvbENhbGxiYWNrOiBmdW5jdGlvbiBzdGFydENvbnRyb2xDYWxsYmFjaygpIHtcbiAgICAgICAgdmFyIG9uTGF1bmNoZWQgPSBmdW5jdGlvbiBvbkxhdW5jaGVkKCkge1xuICAgICAgICAgICAgLy91c2UgdGhpcyBmb3IgY2FsbGJhY2tzIG9uIGxvYWRpbmdcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTY2VuZSBsYXVuY2hlZCcpO1xuICAgICAgICB9O1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ0dhbWVTY2VuZScsIG9uTGF1bmNoZWQpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuYnV0dG9uQXVkaW8sIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgYWJvdXRDb250cm9sQ2FsbGJhY2s6IGZ1bmN0aW9uIGFib3V0Q29udHJvbENhbGxiYWNrKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ0Fib3V0Jyk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5idXR0b25BdWRpbywgZmFsc2UpO1xuICAgIH0sXG5cbiAgICB0dXRvcmlhbENvbnRyb2xDYWxsYmFjazogZnVuY3Rpb24gdHV0b3JpYWxDb250cm9sQ2FsbGJhY2soKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnVHV0b3JpYWwnKTtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmJ1dHRvbkF1ZGlvLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIHF1aXRDb250cm9sQ2FsbGJhY2s6IGZ1bmN0aW9uIHF1aXRDb250cm9sQ2FsbGJhY2soKSB7XG4gICAgICAgIC8vY2MuZGlyZWN0b3IuZW5kKCk7IC8vVE9ETzogaG93IHRvIGVuZCB0aGUgZ2FtZT9cbiAgICAgICAgY2MubG9nKFwiUXVpdCBwcmVzc2VkLlwiKTtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmJ1dHRvbkF1ZGlvLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIGJhY2tDb250cm9sQ2FsbGJhY2s6IGZ1bmN0aW9uIGJhY2tDb250cm9sQ2FsbGJhY2soKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnU3RhcnRtZW51Jyk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5idXR0b25BdWRpbywgZmFsc2UpO1xuICAgIH1cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdkZmNmZXpBQWNKQUFMWFBpSUhWSmoyZCcsICdQbGF5ZXInKTtcbi8vIHNjcmlwdHNcXGdhbWVvYmplY3RzXFxQbGF5ZXIuanNcblxudmFyIEdhbWVTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLkdhbWVTdGF0ZTtcbnZhciBQbGF5ZXJNb3ZlbWVudFN0YXRlID0gcmVxdWlyZSgnU3RhdGVzJykuUGxheWVyTW92ZW1lbnRTdGF0ZTtcbnZhciBQbGF5ZXJTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLlBsYXllclN0YXRlO1xuXG52YXIgZXhwbG9kZXRpbWUgPSAwLjI7XG52YXIgcmlzZURlYXRoWSA9IDI1O1xuXG52YXIgYW5pbWF0aW9uTmVlZHNVcGRhdGUgPSBmYWxzZTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBQbGF5ZXIgc3Bhd25zIGluIGEgc3RhbmRpbmcgc3RhdGVcbiAgICAgICAgbW92ZXN0YXRlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IFBsYXllck1vdmVtZW50U3RhdGUuU3RhbmRpbmcsXG4gICAgICAgICAgICB0eXBlOiBQbGF5ZXJNb3ZlbWVudFN0YXRlXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNJbnZpbmNpYmxlOiBmYWxzZSwgLy8gUGxheWVyIHBpY2tlZCB1cCBhbiBpdGVtIHdoaWNoIG1hZGUgaGltIHVua2lsbGFibGVcbiAgICAgICAgaXNQb2lzb25lZDogZmFsc2UsXG4gICAgICAgIGlzQWxpdmU6IGZhbHNlLFxuICAgICAgICBpc1N3YXBlZDogZmFsc2UsIC8vUGxheWVyIHN0YW5kcyBvbiBhIFN3aXRjaGVyIC8vVE9ETzogbnV0emxvcyBkYSBuaWUgdmVyd2VuZGV0IGluIHBsYXllclxuXG4gICAgICAgIHBvaXNvblRpbWVyOiAwLFxuICAgICAgICBpbnZpbmNpYmlsdHlUaW1lcjogMCxcblxuICAgICAgICBkaXI6IDAsIC8vIE5leHQgUG9zaXRpb24gcGxheWVyIGlzIGp1bXBpbmcgdG8gMSA6IGxlZnQgIC0xOiByaWdodFxuXG4gICAgICAgIGFycmF5UG9zWDogMCwgLy9Qb3NpdGlvbiBpbiB0aGUgYXJyYXkgZ2l2ZW4gd2l0aCByb3cgYW5kIGNvbHVtblxuICAgICAgICBhcnJheVBvc1k6IDAsXG5cbiAgICAgICAganVtcFRpbWU6IDAsIC8vIFRpbWUgZm9yIGp1bXBpbmcgYWN0aW9uIHRvIHJ1blxuICAgICAgICBmYWxsVGltZTogMCwgLy8gc2FtZTogZmFsbGluZ1xuXG4gICAgICAgIC8vIEF0bGFzIGhvbGRpbiBhbGwgc3ByaXRlcyBvZiB0aGUgcGxheWVyLlxuICAgICAgICBwbGF5ZXJhdGxhczoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlQXRsYXNcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBQbGF5ZXIgQXVkaW9zXG4gICAgICAgIGp1bXBBdWRpbzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcblxuICAgICAgICBkZWF0aEF1ZGlvOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuXG4gICAgICAgIGZhbGxBdWRpbzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcblxuICAgICAgICBkcmlua0F1ZGlvOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuXG4gICAgICAgIHBvaXNvbmVkQXVkaW86IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gR2FtZSByZWZlcmVuY2UgdG8gcGFzcyBwbGF5ZXJcbiAgICAgICAgZ2FtZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIC8vcmVnaXN0ZXIgcGxheWVyIGF0IGdhbWUgZm9yIHByb2Nlc3NpbmcgcGxheWVyIGxvZ2ljXG4gICAgICAgIHRoaXMuZ2FtZS5nZXRDb21wb25lbnQoJ0dhbWUnKS5wbGF5ZXIgPSB0aGlzO1xuXG4gICAgICAgIC8vSW5pdCB0aW1lcnNcbiAgICAgICAgdGhpcy5wb2lzb25UbXAgPSB0aGlzLnBvaXNvblRpbWVyO1xuICAgICAgICB0aGlzLmludmluY2liaWx0eVRtcCA9IHRoaXMuaW52aW5jaWJpbHR5VGltZXI7IC8vSGVucmkgZnJhZ2VuIG9iIG1hbiBwcm9wZXJ0aWVzIHNwZWljaGVybiBrYW5uXG5cbiAgICAgICAgdGhpcy5tb3Zlc3RhdGUgPSBQbGF5ZXJNb3ZlbWVudFN0YXRlLlN0YW5kaW5nO1xuICAgICAgICB0aGlzLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNBbGl2ZSA9IHRydWU7XG4gICAgICAgIC8vdGhpcy5vbGREZXN0ID0gdGhpcy5nYW1lLmdldENvbXBvbmVudCgnR2FtZScpLmdhbWVmaWVsZC5nYW1lRmllbGRbZ2FtZUZpZWxkLmxlbmd0aC0xXVszXTtcblxuICAgICAgICB0aGlzLm9mZnNldFkgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQgLyAyOyAvLyBPZmZzZXQgdG8gc2V0IHRoZSBwbGF5ZXIgb24gdG9wIG9mIGJsb2Nrc1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9ucG9zID0gY2MucCgwLCAwKTtcblxuICAgICAgICAvL0xvYWQgZGF0YSByZWxldmFudCB0byBwbGF5ZXIgICAtLSAhISBMRUFWRSBBVCBFTkQgT0YgVEhJUyBGVU5DVElPTiAhISAtLVxuICAgICAgICB0aGlzLmdhbWUuZ2V0Q29tcG9uZW50KCdHYW1lJykub25QbGF5ZXJMb2FkQ2FsbGJhY2soKTtcbiAgICB9LFxuXG4gICAga2lsbDogZnVuY3Rpb24ga2lsbCgpIHtcbiAgICAgICAgdGhpcy5pc0ludmluY2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc0FsaXZlID0gZmFsc2U7XG4gICAgICAgIHZhciBnYW1lc3RhdGVjYWxsYmFjayA9IGNjLmNhbGxGdW5jKHRoaXMuY2hhbmdlR2FtZVN0YXRlLCB0aGlzKTtcbiAgICAgICAgdmFyIHNvdW5kY2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLnBsYXlTb3VuZCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2Muc3Bhd24odGhpcy5kZWZvcm0oKSwgdGhpcy5hc3NlbWJsZUFjdGlvbigpKSwgZ2FtZXN0YXRlY2FsbGJhY2ssIHNvdW5kY2FsbGJhY2spKTtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUuc3RvcEFsbEVmZmVjdHMoKTsgLy9UT0RPIGV2dGwgYWxzIGNhbGxiYWNrXG4gICAgfSxcblxuICAgIGZhbGw6IGZ1bmN0aW9uIGZhbGwoKSB7XG4gICAgICAgIHRoaXMuaXNJbnZpbmNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMubW92ZXN0YXRlID0gUGxheWVyTW92ZW1lbnRTdGF0ZS5GYWxsaW5nO1xuICAgICAgICB2YXIgZ2FtZXN0YXRlY2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLmNoYW5nZUdhbWVTdGF0ZSwgdGhpcyk7XG4gICAgICAgIHZhciBzb3VuZGNhbGxiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5wbGF5U291bmQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGNjLnNwYXduKHRoaXMuZGVmb3JtKCksIHRoaXMuYXNzZW1ibGVBY3Rpb24oKSksIGdhbWVzdGF0ZWNhbGxiYWNrLCBzb3VuZGNhbGxiYWNrKSk7XG4gICAgICAgIHRoaXMuaXNBbGl2ZSA9IGZhbHNlOyAvL3NldCBoZXJlIGJlY2F1c2UgYWxpdmUgaW1wYWN0cyBkZWF0aCBhbmltLlxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5zdG9wQWxsRWZmZWN0cygpO1xuICAgIH0sXG5cbiAgICBjaGFuZ2VHYW1lU3RhdGU6IGZ1bmN0aW9uIGNoYW5nZUdhbWVTdGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBbGl2ZSB8fCB0aGlzLm1vdmVzdGF0ZSA9PT0gUGxheWVyTW92ZW1lbnRTdGF0ZS5GYWxsaW5nKSB0aGlzLmdhbWUuZ2V0Q29tcG9uZW50KCdHYW1lJykuc3RhdGUgPSBHYW1lU3RhdGUuR2FtZU92ZXI7XG4gICAgfSxcblxuICAgIGNoYW5nZVBsYXllclN0YXRlOiBmdW5jdGlvbiBjaGFuZ2VQbGF5ZXJTdGF0ZSgpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLm1vdmVzdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLkp1bXBpbmc6XG4gICAgICAgICAgICAgICAgdGhpcy5tb3Zlc3RhdGUgPSBQbGF5ZXJNb3ZlbWVudFN0YXRlLlN0YW5kaW5nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGJsb2NrU3RlcHBlZDogZnVuY3Rpb24gYmxvY2tTdGVwcGVkKHBsYXllciwgZ2FtZSkge1xuICAgICAgICB0aGlzLmdBbWUgPSBnYW1lO1xuICAgICAgICB2YXIgc3RlcHBlZEJsb2NrID0gdGhpcy5kZXN0ZmllbGQuZ2V0Q29tcG9uZW50KHRoaXMuZGVzdGZpZWxkLm5hbWUpO1xuICAgICAgICBjb25zb2xlLmxvZygnU1RFUFBFRCBCTE9DSzogJywgc3RlcHBlZEJsb2NrKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5kZXN0ZmllbGQubmFtZSk7XG4gICAgICAgIHN0ZXBwZWRCbG9jay5vblN0ZXBDYWxsYmFjayh0aGlzLCBnYW1lKTtcbiAgICAgICAgdmFyIGl0ZW0gPSBzdGVwcGVkQmxvY2suZ2V0Q29tcG9uZW50SW5DaGlsZHJlbignSXRlbScpO1xuICAgICAgICBpZiAoaXRlbSAhPT0gbnVsbCkgaXRlbS5vblBpY2tVcENhbGxiYWNrKHRoaXMsIHRoaXMuZ0FtZSk7XG4gICAgfSxcbiAgICAvL1xuICAgIC8vIE1vdmVtZW50IGFuZCBBY3Rpb25zXG4gICAgLy9cblxuICAgIC8vQ2FsbGVkIGV2ZXJ5dGltZSBhIHRoZSBmaWd1cmUgaXMgbW92ZWQgYnkgcHJlc3NpbmcgQSBvciBEXG4gICAgbW92ZTogZnVuY3Rpb24gbW92ZShkZXN0ZmllbGQsIGdhbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBbGl2ZSA9PT0gZmFsc2UpIHJldHVybjtcbiAgICAgICAgdGhpcy5vbGREZXN0ID0gdGhpcy5kZXN0ZmllbGQ7XG4gICAgICAgIHRoaXMuZGVzdGZpZWxkID0gZGVzdGZpZWxkOyAvLyBEaXJlY3Rpb24gcGxheWVycyB3YW50cyB0byBtb3ZlIHRoZSBmaWd1cmUoLTEgb3IgMSlcbiAgICAgICAgc3dpdGNoICh0aGlzLm1vdmVzdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLlN0YW5kaW5nOlxuICAgICAgICAgICAgICAgIHRoaXMubW92ZXN0YXRlID0gUGxheWVyTW92ZW1lbnRTdGF0ZS5KdW1waW5nO1xuXG4gICAgICAgICAgICAgICAgdmFyIHNvdW5kQ2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLnBsYXlTb3VuZCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgdmFyIHBsYXllcnN0YXRlQ2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLmNoYW5nZVBsYXllclN0YXRlLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB2YXIgYmxvY2tzdGVwQ2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLmJsb2NrU3RlcHBlZCwgdGhpcywgZ2FtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hQbGF5ZXJBcHBlYXJhbmNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXREZXN0aW5hdGlvblBvcygpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy5zcGF3bih0aGlzLmRlZm9ybSgpLCB0aGlzLmFzc2VtYmxlQWN0aW9uKCkpLCBibG9ja3N0ZXBDYWxsYmFjaywgc291bmRDYWxsYmFjaywgcGxheWVyc3RhdGVDYWxsYmFjaykpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFBsYXllck1vdmVtZW50U3RhdGUuSnVtcGluZzpcbiAgICAgICAgICAgIGNhc2UgUGxheWVyTW92ZW1lbnRTdGF0ZS5GYWxsaW5nOlxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXREZXN0aW5hdGlvblBvczogZnVuY3Rpb24gc2V0RGVzdGluYXRpb25Qb3MoKSB7XG4gICAgICAgIHRoaXMuZGVzdGluYXRpb25wb3MueCA9IHRoaXMuZGVzdGZpZWxkLmdldFBvc2l0aW9uWCgpO1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9ucG9zLnkgPSB0aGlzLmRlc3RmaWVsZC5nZXRQb3NpdGlvblkoKSArIHRoaXMub2Zmc2V0WTtcbiAgICB9LFxuXG4gICAgc3dpdGNoUGxheWVyQXBwZWFyYW5jZTogZnVuY3Rpb24gc3dpdGNoUGxheWVyQXBwZWFyYW5jZSgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVkID0gdGhpcy51cGRhdGVBbmltYXRpb24oKTtcbiAgICAgICAgaWYgKHRoaXMudXBkYXRlZCkgLy8gaWYgYW5pbWF0aW9ucyBpcyBydW5uaW5nIGRvbnQgZ28gdG8gc3ByaXRlIGZyYW1lIGNoYW5naW5nXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLmRpciA8IDApIHtcbiAgICAgICAgICAgIC8vIFBsYXllciBsb29rcyBsZWZ0XG4gICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5TcHJpdGUpLnNwcml0ZUZyYW1lID0gdGhpcy5wbGF5ZXJhdGxhcy5nZXRTcHJpdGVGcmFtZShcInBsYXllcl9sZWZ0XCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5zcHJpdGVGcmFtZSA9IHRoaXMucGxheWVyYXRsYXMuZ2V0U3ByaXRlRnJhbWUoXCJwbGF5ZXJfcmlnaHRcIik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYXNzZW1ibGVBY3Rpb246IGZ1bmN0aW9uIGFzc2VtYmxlQWN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5pc0FsaXZlID09PSBmYWxzZSkgLy9QbGF5ZXIgZGVhZCAtPiBhY3Rpb24gVE9ETzogdmVyc2F1dCBmYWxsZW4gYW5pbWF0aW9uXG4gICAgICAgICAgICByZXR1cm4gY2MubW92ZUJ5KGV4cGxvZGV0aW1lLCBjYy5wKDAsIHJpc2VEZWF0aFkpKTtcblxuICAgICAgICBzd2l0Y2ggKHRoaXMubW92ZXN0YXRlKSB7XG4gICAgICAgICAgICBjYXNlIFBsYXllck1vdmVtZW50U3RhdGUuU3RhbmRpbmc6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFBsYXllck1vdmVtZW50U3RhdGUuRmFsbGluZzpcbiAgICAgICAgICAgICAgICByZXR1cm4gY2MubW92ZVRvKHRoaXMuZmFsbFRpbWUsIGNjLnAodGhpcy5ub2RlLmdldFBvc2l0aW9uKCkueCwgMCkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25JbigpKTtcblxuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLkp1bXBpbmc6XG4gICAgICAgICAgICAgICAgLy8gUG9pbnRzIGZvcm1pbmcgdGhlIGJlemllcmN1cnZlXG4gICAgICAgICAgICAgICAgdmFyIGJlemllciA9IFt0aGlzLm5vZGUuZ2V0UG9zaXRpb24oKSwgdGhpcy5kZXN0aW5hdGlvbnBvcywgdGhpcy5kZXN0aW5hdGlvbnBvc107XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNjLmJlemllclRvKHRoaXMuanVtcFRpbWUsIGJlemllcik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZGVmb3JtOiBmdW5jdGlvbiBkZWZvcm0oKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQWxpdmUgPT09IGZhbHNlKSAvL1BsYXllciBkZWFkIC0+IGRlZm9ybVxuICAgICAgICAgICAgcmV0dXJuIGNjLnNlcXVlbmNlKGNjLnNjYWxlVG8oZXhwbG9kZXRpbWUsIDEuMywgMS4zKSwgY2Muc2NhbGVUbyhleHBsb2RldGltZSwgMC4wLCAwLjApKTtcblxuICAgICAgICBzd2l0Y2ggKHRoaXMubW92ZXN0YXRlKSB7Ly8gUGxheWVyIGluIGEgbW92aW5nIHN0YXRlIC0+IGFjdGlvblxuXG4gICAgICAgICAgICBjYXNlIFBsYXllck1vdmVtZW50U3RhdGUuSnVtcGluZzpcbiAgICAgICAgICAgICAgICB2YXIgc2NhbGV0aW1lID0gdGhpcy5qdW1wVGltZSAqIDAuNTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2Muc2VxdWVuY2UoY2Muc2NhbGVUbyhzY2FsZXRpbWUsIDEsIDEuMSksIGNjLnNjYWxlVG8oc2NhbGV0aW1lLCAxLCAwLjkpLCBjYy5zY2FsZVRvKHNjYWxldGltZSwgMSwgMS4wKSk7XG5cbiAgICAgICAgICAgIGNhc2UgUGxheWVyTW92ZW1lbnRTdGF0ZS5GYWxsaW5nOlxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5zZXRMb2NhbFpPcmRlcih0aGlzLmRlc3RmaWVsZC5nZXRMb2NhbFpPcmRlcigpKTsgLy9UT0RPOiBmYWxsIHdpcmQgc2Nob24gd8OkaHJlbmQgZGVzIGp1bXBzIGF1c2dlZsO8aHJ0IC0+IHNwaWVsZXIgdmVyc2Nod2luZGV0IGhpbnRlciB2b3JiZWlnZXNwcnVuZ2VuZW4gYmzDtmNrZW5cbiAgICAgICAgICAgICAgICB2YXIgZmFsbERlZm9ybSA9IGNjLnNjYWxlVG8odGhpcy5mYWxsVGltZSwgMC44NSwgMC44NSk7XG4gICAgICAgICAgICAgICAgdmFyIGZhbGxmYWRlID0gY2MuZmFkZU91dCh0aGlzLmZhbGxUaW1lICogNCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNjLnNwYXduKGZhbGxEZWZvcm0sIGZhbGxmYWRlLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25PdXQoKSkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE1pZ2h0IGJlIHVzZWZ1bCBzb21ldGltZVxuICAgICAgICBpZiAodGhpcy5pc1BvaXNvbmVkKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBpZiAodGhpcy5pc0ludmluY2libGUpIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICAvL1xuICAgIC8vICBTb3VuZHNcbiAgICAvL1xuXG4gICAgcGxheVNvdW5kOiBmdW5jdGlvbiBwbGF5U291bmQoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0FsaXZlKSB7XG4gICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuZGVhdGhBdWRpbywgZmFsc2UpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNQb2lzb25lZCkgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLnBvaXNvbmVkQXVkaW8sIGZhbHNlKTtcblxuICAgICAgICBzd2l0Y2ggKHRoaXMubW92ZXN0YXRlKSB7XG4gICAgICAgICAgICBjYXNlIFBsYXllck1vdmVtZW50U3RhdGUuSnVtcGluZzpcbiAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuanVtcEF1ZGlvLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFBsYXllck1vdmVtZW50U3RhdGUuRmFsbGluZzpcbiAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuZmFsbEF1ZGlvLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvL1xuICAgIC8vIFN0YXR1cyBhbmQgVXBkYXRlIG9mIHBsYXllclxuICAgIC8vXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLmlzQWxpdmUpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVGltZXJzKGR0KTtcbiAgICAgICAgICAgIC8vdGhpcy51cGRhdGVBbmltYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGVBbmltYXRpb246IGZ1bmN0aW9uIHVwZGF0ZUFuaW1hdGlvbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmFuaW1hdGlvbikgLy8gSW5pdCBhbmltYXRpb25cbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uID0gdGhpcy5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzUG9pc29uZWQgJiYgIXRoaXMuaXNJbnZpbmNpYmxlKSB7XG4gICAgICAgICAgICAvL05JQ0UgVE8gSEFWRTogbm8gYm9vbHNcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uLnN0b3AoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzUG9pc29uZWQgfHwgdGhpcy5pc0ludmluY2libGUpIHRoaXMuYW5pbWF0aW9uLnBsYXkodGhpcy5nZXRBbmltYXRpb24oKSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICB1cGRhdGVUaW1lcnM6IGZ1bmN0aW9uIHVwZGF0ZVRpbWVycyhkdCkge1xuICAgICAgICBpZiAodGhpcy5pc1BvaXNvbmVkKSBpZiAodGhpcy5wb2lzb25UbXAgPD0gMCkge1xuICAgICAgICAgICAgLy90aW1lciByYW4gb3V0IC0+IGtpbGwgcGxheWVyXG4gICAgICAgICAgICB0aGlzLmlzUG9pc29uZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaXNBbGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5raWxsKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBvaXNvblRtcCAtPSBkdDsgLy9kZWNyZWFzZSB0aW1lci4uLmh1cnJ5IVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNJbnZpbmNpYmxlKSBpZiAodGhpcy5pbnZpbmNpYmlsdHlUbXAgPD0gMCkge1xuICAgICAgICAgICAgLy90aW1lciByYW4gb3V0IC0+IGRvd25yYW5rIHBsYXllclxuICAgICAgICAgICAgdGhpcy5pc0ludmluY2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaW52aW5jaWJpbHR5VG1wID0gdGhpcy5pbnZpbmNpYmlsdHlUaW1lcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaW52aW5jaWJpbHR5VG1wIC09IGR0OyAvL2RlY3JlYXNlIHRpbWVyLi4uaHVycnkhXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaXNNb3Zpbmc6IGZ1bmN0aW9uIGlzTW92aW5nKCkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMubW92ZXN0YXRlKSB7Ly9zd2l0Y2ggZm9yIHBvc3NpYmxlIGZ1cnRoZXIgc3RhdGVzXG4gICAgICAgICAgICBjYXNlIFBsYXllck1vdmVtZW50U3RhdGUuSnVtcGluZzpcbiAgICAgICAgICAgICAgICB0aGlzLmlzTW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLlN0YW5kaW5nOlxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpc0FsaXZlOiAoZnVuY3Rpb24gKF9pc0FsaXZlKSB7XG4gICAgICAgIGZ1bmN0aW9uIGlzQWxpdmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gX2lzQWxpdmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlzQWxpdmUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX2lzQWxpdmUudG9TdHJpbmcoKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gaXNBbGl2ZTtcbiAgICB9KShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBpc0FsaXZlO1xuICAgIH0pLFxuXG4gICAgZ2V0QW5pbWF0aW9uOiBmdW5jdGlvbiBnZXRBbmltYXRpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmRpciA8IDApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzUG9pc29uZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3BvaXNvbl9sZWZ0X2FuaW0nOyAvL3BsYXkoJ3BvaXNvbl9sZWZ0X2FuaW0nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNJbnZpbmNpYmxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdzdGFyX2xlZnRfYW5pbSc7IC8vcGxheSgncG9pc29uX2xlZnRfYW5pbScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzUG9pc29uZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdwb2lzb25fcmlnaHRfYW5pbSc7IC8vcGxheSgncG9pc29uX2xlZnRfYW5pbScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzSW52aW5jaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3N0YXJfcmlnaHRfYW5pbSc7IC8vcGxheSgncG9pc29uX2xlZnRfYW5pbScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICB9XG5cbn0pO1xuLypcclxubWFrZUludmluY2libGU6IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmlzSW52aW5jaWJsZSA9IHRydWU7XHJcbiAgICAvL1RPRE86IHN0YXJ0IGludmluY2liaWxpdHkgdGltZXJcclxufSxcclxuICBwb2lzb246IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmlzUG9pc29uZWQgPSB0cnVlO1xyXG4gICAgLy9UT0RPOiBzdGFydCBwb2lzb24gdGltZXIgYW5kIGtpbGxpbmcgcGhhc2UgaWYgdHVybiBiYXNlZCBwb2lzb24gaXMgbmVnbGVjdGVkXHJcbn0sXHJcbiAgc2hvdCA6IGZ1bmN0aW9uKCl7XHJcbiAgfSwqL1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZTA1MGZmWm5VVkFqS0I4ZnlTZCtaZE8nLCAnUG9pc29uJyk7XG4vLyBzY3JpcHRzXFxnYW1lZmllbGRcXGJsb2Nrc1xcUG9pc29uLmpzXG5cbnZhciBCbG9ja1R5cGUgPSByZXF1aXJlKCdUeXBlcycpLkJsb2NrVHlwZTtcbnZhciBQbGF5ZXJNb3ZlbWVudFN0YXRlID0gcmVxdWlyZSgnU3RhdGVzJykuUGxheWVyTW92ZW1lbnRTdGF0ZTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpc0Jsb2NrZWQ6IGZhbHNlLFxuICAgICAgICBoYXNJdGVtOiBmYWxzZSxcblxuICAgICAgICBibG9ja3R5cGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogQmxvY2tUeXBlLk5vbmUsXG4gICAgICAgICAgICB0eXBlOiBCbG9ja1R5cGVcbiAgICAgICAgfSxcblxuICAgICAgICBpdGVtOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJPblRvcCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBvblN0ZXBDYWxsYmFjazogZnVuY3Rpb24gb25TdGVwQ2FsbGJhY2socGxheWVyLCBnYW1lKSB7XG4gICAgICAgIGNjLmxvZygnTTogb25TdGVwQ2FsbGJhY2sgUG9pc29uJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdEVSBXVVJERVNUIFZFUkdJRlRFVCcpO1xuICAgICAgICAvKmlmKHBsYXllci5wb2lzb25UaW1lcjw2IHx8IHBsYXllci5wb2lzb25UaW1lcj42KXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0RlciBUaW1lciBpc3Qga2xlaW5lciA2Jyk7XHJcbiAgICAgICAgICAgIGlmKCFwbGF5ZXIuaXNQb2lzb25lZCl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRGVyIFNwaWVsZXIgaXN0IG5vY2ggbmljaHQgdmVyZ2lmdGV0Jyk7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIucG9pc29uVGltZXIgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSovXG5cbiAgICAgICAgaWYgKCFwbGF5ZXIuaXNJbnZpbmNpYmxlKSBwbGF5ZXIuaXNQb2lzb25lZCA9IHRydWU7XG4gICAgfSxcblxuICAgIGNvbGxpZGU6IGZ1bmN0aW9uIGNvbGxpZGUoKSB7fVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZTIyYzNRNGdYQk5DcDVXVEdDdEdxU3onLCAnU3Bpa2UnKTtcbi8vIHNjcmlwdHNcXGdhbWVmaWVsZFxcYmxvY2tzXFxTcGlrZS5qc1xuXG52YXIgYWxyZWFkeUtpbGxlZCA9IGZhbHNlO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGlzRGVhZGx5OiB0cnVlXG4gICAgfSxcblxuICAgIC8vIGZvbzoge1xuICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgIC8vIH0sXG4gICAgLy8gLi4uXG4gICAgc3dpdGNoRGVhZGx5OiBmdW5jdGlvbiBzd2l0Y2hEZWFkbHkoKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2lzRGVhZGx5OiAnLCB0aGlzLmlzRGVhZGx5KTtcbiAgICAgICAgdGhpcy5pc0RlYWRseSA9ICF0aGlzLmlzRGVhZGx5O1xuICAgICAgICB0aGlzLmhhc0tpbGxlZCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5pc0RlYWRseSA9IHRydWU7XG4gICAgICAgIHRoaXMucGxheWVyT25Ub3AgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgb25TdGVwQ2FsbGJhY2s6IGZ1bmN0aW9uIG9uU3RlcENhbGxiYWNrKHBsYXllciwgZ2FtZSkge1xuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcbiAgICAgICAgdGhpcy5wbGF5ZXJPblRvcCA9IHRydWU7XG4gICAgICAgIGNvbnNvbGUubG9nKCdNOiBPbnN0ZXAgU3Bpa2UnKTtcbiAgICAgICAgY29uc29sZS5sb2coJ09uUyBpc0RlYWRseTogJywgdGhpcy5pc0RlYWRseSk7XG4gICAgICAgIGlmICghdGhpcy5oYXNLaWxsZWQpIHRoaXMucGVyZm9ybVNwaWtlS2lsbCgpO1xuICAgIH0sXG5cbiAgICBwZXJmb3JtU3Bpa2VLaWxsOiBmdW5jdGlvbiBwZXJmb3JtU3Bpa2VLaWxsKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNEZWFkbHkgJiYgIXRoaXMucGxheWVyLmlzSW52aW5jaWJsZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1V1cHMsIGRhcyB3YXIgdMO2dGxpY2gnKTtcbiAgICAgICAgICAgIGlmICghYWxyZWFkeUtpbGxlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLmtpbGwoKTtcbiAgICAgICAgICAgICAgICBhbHJlYWR5S2lsbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaGFzS2lsbGVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHbMO8Y2sgZ2VoYWJ0Jyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMucGxheWVyT25Ub3ApIHRoaXMucGVyZm9ybVNwaWtlS2lsbCgpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZjhhZjNtM0xnbFBOWTM0RGRiOVZXRDAnLCAnU3RhdGVzJyk7XG4vLyBzY3JpcHRzXFxlbnVtc1xcU3RhdGVzLmpzXG5cbnZhciBHYW1lU3RhdGUgPSBjYy5FbnVtKHtcbiAgICBOb25lOiA5OTksXG4gICAgSWRsZTogLTEsIC8vIFdhaXRpbmcgZm9yIFBsYXllciB0byBjaG9vc2Ugc29tZXRoaW5nIGluIHRoZSBtZW51XG4gICAgTG9hZGluZzogLTEsIC8vIFBsYXllciBwcmVzc2VkIFN0YXJ0IC0+IGxvYWQgZ2FtZVxuICAgIFdhaXRpbmc6IC0xLCAvLyBXYWl0aW5nIGZvciBmaXJzdCBtb3ZlIHRvIHN0YXJ0IHRpbWVycyBldGNcbiAgICBQbGF5aW5nOiAtMSwgLy8gR2FtZSBsb2FkZWQgYW5kIHN0YXJ0ZWRcbiAgICBHYW1lT3ZlcjogLTEsIC8vUGxheWVyIGRpZWRcbiAgICBQYXVzZWQ6IC0xLCAvLyBHYW1lIHdhcyBwYXVzZWQgYnkgdGhlIHBsYXllclxuICAgIFJlc3VtZWQ6IC0xLCAvLyBHYW1lIHdhcyByZXN1bWVkIGFmdGVyIHBhdXNpbmdcbiAgICBFbmRlZDogLTEgfSk7XG5cbi8vIEdhbWUgd2FzIGNsb3NlZCBieSB0aGUgcGxheWVyIG9yIGhlIGxvc3QgLT4gYmFjayB0byBpZGxlP1xudmFyIFBsYXllck1vdmVtZW50U3RhdGUgPSBjYy5FbnVtKHtcbiAgICBTdGFuZGluZzogLTEsIC8vUGxheWVyIGlzIHN0YW5kaW5nIHN0aWxsIChoYXMgZnVsbHkgYXJyaXZlZCBvbiBhIGJsb2NrKVxuICAgIEp1bXBpbmc6IC0xLCAvL1BsYXllciBpcyBtb3Zpbmcgb250byBhbm90aGVyIGJsb2NrKGluIGFuaW1hdGlvbilcbiAgICBGYWxsaW5nOiAtMSB9KTtcblxuLy9QbGF5ZXIgaXMgZmFsbGluZyBkb3duIHRoZSBnYW1lZmllbGRcbnZhciBJdGVtU3RhdGUgPSBjYy5FbnVtKHtcbiAgICBQaWNrYWJsZTogLTEsXG4gICAgQmxvY2tlZDogLTEsXG4gICAgUGlja2VkOiAtMVxufSk7XG5cbnZhciBJdGVtQWN0aXZpdHlTdGF0ZSA9IGNjLkVudW0oe1xuICAgIElkbGU6IC0xLFxuICAgIEFjdGl2ZTogLTEsXG4gICAgRXhwaXJlZDogLTFcbn0pO1xuXG52YXIgUGxheWVyU3RhdGUgPSBjYy5FbnVtKHtcbiAgICBBbGl2ZTogLTEsXG4gICAgRGVhZDogLTEsXG4gICAgUG9pc29uZWQ6IC0xLFxuICAgIEludmluY2libGU6IC0xXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgR2FtZVN0YXRlOiBHYW1lU3RhdGUsXG4gICAgUGxheWVyTW92ZW1lbnRTdGF0ZTogUGxheWVyTW92ZW1lbnRTdGF0ZSxcbiAgICBJdGVtU3RhdGU6IEl0ZW1TdGF0ZSxcbiAgICBQbGF5ZXJTdGF0ZTogUGxheWVyU3RhdGUsXG4gICAgSXRlbUFjdGl2aXR5U3RhdGU6IEl0ZW1BY3Rpdml0eVN0YXRlXG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNDMyM2Q0WEo0Wk1pWjJ3eCt5eDdFN24nLCAnU3dpdGNoZXInKTtcbi8vIHNjcmlwdHNcXGdhbWVmaWVsZFxcYmxvY2tzXFxTd2l0Y2hlci5qc1xuXG52YXIgQmxvY2tUeXBlID0gcmVxdWlyZSgnVHlwZXMnKS5CbG9ja1R5cGU7XG52YXIgUGxheWVyTW92ZW1lbnRTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLlBsYXllck1vdmVtZW50U3RhdGU7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaXNCbG9ja2VkOiBmYWxzZSxcbiAgICAgICAgaGFzSXRlbTogZmFsc2UsXG5cbiAgICAgICAgYmxvY2t0eXBlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IEJsb2NrVHlwZS5Ob25lLFxuICAgICAgICAgICAgdHlwZTogQmxvY2tUeXBlXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXRlbToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMucGxheWVyT25Ub3AgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgb25TdGVwQ2FsbGJhY2s6IGZ1bmN0aW9uIG9uU3RlcENhbGxiYWNrKHBsYXllciwgZ2FtZSkge1xuICAgICAgICBjYy5sb2coJ006IG9uU3RlcENhbGxiYWNrIFN3aXRjaGVyJyk7XG4gICAgICAgIHBsYXllci5pc1N3YXBlZCA9IHRydWU7XG4gICAgfSxcblxuICAgIGNvbGxpZGU6IGZ1bmN0aW9uIGNvbGxpZGUoKSB7fVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMWM3MTBZdld2QkFjcVRCQjBXTXVOOXYnLCAnVHJhcGRvb3InKTtcbi8vIHNjcmlwdHNcXGdhbWVmaWVsZFxcYmxvY2tzXFxUcmFwZG9vci5qc1xuXG52YXIgQmxvY2tUeXBlID0gcmVxdWlyZSgnVHlwZXMnKS5CbG9ja1R5cGU7XG52YXIgUGxheWVyTW92ZW1lbnRTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLlBsYXllck1vdmVtZW50U3RhdGU7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaXNCbG9ja2VkOiBmYWxzZSxcbiAgICAgICAgaGFzSXRlbTogZmFsc2UsXG5cbiAgICAgICAgYmxvY2t0eXBlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IEJsb2NrVHlwZS5Ob25lLFxuICAgICAgICAgICAgdHlwZTogQmxvY2tUeXBlXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXRlbToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMucGxheWVyT25Ub3AgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgb25TdGVwQ2FsbGJhY2s6IGZ1bmN0aW9uIG9uU3RlcENhbGxiYWNrKHBsYXllciwgZ2FtZSkge1xuICAgICAgICB2YXIgYW5pbUN0cmwgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG4gICAgICAgIGFuaW1DdHJsLnBsYXkoJ3RyYXBkb29yJyk7XG4gICAgICAgIHZhciBmYWxsID0gY2MubW92ZVRvKDEsIGNjLnAodGhpcy5ub2RlLmdldFBvc2l0aW9uWCgpLCB0aGlzLm5vZGUuZ2V0UG9zaXRpb25ZKCkgLSAxMDApKTtcbiAgICAgICAgLy92YXIgY2FsTGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLmRlc3Ryb3ksIHRoaXMpO1xuICAgICAgICAvL3RoaXMubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoZmFsbCxjYWxMYmFjaykpO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGZhbGwpO1xuICAgICAgICBwbGF5ZXIuZmFsbCgpO1xuICAgICAgICAvL2dhbWUuc3RhdGUgPSBnYW1lLkdhbWVTdGF0ZS5HYW1lT3ZlcjtcbiAgICB9LFxuXG4gICAgY29sbGlkZTogZnVuY3Rpb24gY29sbGlkZSgpIHt9LFxuXG4gICAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICB9XG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNzFiOTNTUk4wQk8xcUtTcTU1RVUvV0knLCAnVHlwZXMnKTtcbi8vIHNjcmlwdHNcXGVudW1zXFxUeXBlcy5qc1xuXG52YXIgSXRlbVR5cGUgPSBjYy5FbnVtKHtcbiAgICBOb25lOiA5OTksXG4gICAgU3RhcjogLTEsIC8vIFNjb3JlXG4gICAgQ29pbjogLTEsIC8vIENsaW1iIHR3byhmLmUuKSByb3dzIHVwXG4gICAgQW50aWRvdGU6IC0xLCAvLyBDdXJlcyBwb2lzb25cbiAgICBCbG9ja2VyOiAtMSxcbiAgICBTbG93ZXI6IC0xXG59KTtcblxudmFyIEJsb2NrVHlwZSA9IGNjLkVudW0oe1xuICAgIE5vbmU6IC0xLFxuICAgIEVtcHR5OiAtMSxcbiAgICBEaXJ0OiAtMSxcbiAgICBHcmFzczogLTEsXG4gICAgUG9pc29uOiAtMSxcbiAgICBTd2l0Y2hlcjogLTEsXG4gICAgVHJhcGRvb3I6IC0xLFxuICAgIFNwaWtlOiAtMVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEl0ZW1UeXBlOiBJdGVtVHlwZSxcbiAgICBCbG9ja1R5cGU6IEJsb2NrVHlwZVxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzk2ZTIwQjl6RnBDVUtLVlVueFBOL0g5JywgJ1dhdGVyUmlnaHQnKTtcbi8vIHNjcmlwdHNcXGdhbWVmaWVsZFxcYmxvY2tzXFxXYXRlclJpZ2h0LmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJPblRvcCA9IGZhbHNlO1xuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7Il19
