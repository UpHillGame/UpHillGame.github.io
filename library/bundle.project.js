require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Block":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0cf80va4iJCXZDXbSwgY1mm', 'Block');
// scripts\gamefield\Block.js

var BlockType = require('Types').BlockType;
var PlayerMovementState = require('States').PlayerMovementState;

var tempParent;

cc.Class({
    'extends': cc.Component,

    properties: {
        isBlocked: false,
        hasItem: false,
        isDeadly: false,

        blocktype: {
            'default': BlockType.None,
            type: BlockType
        },

        item: {
            'default': null,
            type: cc.Node
        },

        onSteppedSound: {
            'default': null,
            type: cc.Node
        },

        defaultSound: {
            'default': null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        //If block has animation load it
        var anim = this.node.getComponent(cc.Animation);
        if (anim !== null || undefined) this.anim = anim;
        //Initalize Block coressponding to its type
        switch (this.blocktype) {
            case BlockType.Spike:
                this.hasKilled = false;
            case BlockType.Trapdoor:
            case BlockType.Empty:
                this.isDeadly = true;
                break;
            case BlockType.Dirt:
            case BlockType.Gras:
            case BlockType.Switcher:
            case BlockType.Poison:
                break;
        }
    },

    //What happens if you step on a block
    onStepCallback: function onStepCallback(player, game) {
        this.player = player;
        // Perform the action the block produces(change player or environment)
        switch (this.blocktype) {
            case BlockType.Dirt:
            case BlockType.Gras:
                break;
            case BlockType.Empty:
                this.player.fall();
                break;
            case BlockType.Switcher:
                this.player.isSwaped = true;
                break;
            case BlockType.Trapdoor:
                this.anim.play('trapdoor');
                this.player.fall();
                break;
            case BlockType.Poison:
                if (!this.player.isInvincible) this.player.isPoisoned = true;
                break;
            case BlockType.Spike:
                this.playerOnTop = true;
                if (!this.hasKilled) this.performSpikeKill();
                break;
        }

        // Perform block animation
        var stepFinishedCallback = cc.callFunc(this.finishStep, this);
        //var blockaction = cc.spawn(this.assembleBlockAction(), this.deform());
        this.node.runAction(cc.sequence(this.shake(), stepFinishedCallback));
        this.player.node.runAction(this.shake());
    },

    //Let blocks shake when they are stepped on (including player)
    shake: function shake() {
        var down = cc.moveBy(0.2, cc.p(0, -2)).easing(cc.easeCubicActionIn());
        var up = cc.moveBy(0.2, cc.p(0, +2)).easing(cc.easeCubicActionIn());
        var shake = cc.sequence(down, up);
        return shake;
    },

    finishStep: function finishStep() {},

    // Action(Animation etc) for every block
    assembleBlockAction: function assembleBlockAction() {
        switch (this.blocktype) {
            case BlockType.Empty:
            case BlockType.Dirt:
            case BlockType.Gras:
            case BlockType.Switcher:
            case BlockType.Poison:
            case BlockType.Spike:
                return cc.moveTo(0, this.node.getPosition());
            case BlockType.Trapdor:
                return cc.moveTo(1, cc.p(this.node.getPositionX(), this.node.getPositionY() - 100));
        }
    },

    // Part of animation see above
    deform: function deform() {
        switch (this.blocktype) {
            case BlockType.Empty:
            case BlockType.Dirt:
            case BlockType.Gras:
            case BlockType.Switcher:
            case BlockType.Trapdoor:
            case BlockType.Poison:
            case BlockType.Spike:
                return cc.moveTo(0, this.node.getPosition());
        }
    },

    performSpikeKill: function performSpikeKill() {
        if (!this.isDeadly && !this.player.isInvincible) {
            if (!this.hasKilled) {
                this.player.kill();
                this.hasKilled = true;
            }
        } else {}
    },

    destroy: function destroy() {
        this.node.destroy();
    },

    setBlocked: function setBlocked(bool) {
        this.isBlocked = bool;
    },

    isBlocked: function isBlocked() {
        return this.isBlocked;
    },

    switchDeadly: function switchDeadly() {
        //console.log('isDeadly: ', this.isDeadly);
        this.isDeadly = !this.isDeadly;
        this.hasKilled = false;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (this.playerOnTop) this.performSpikeKill();
    }
});

cc._RFpop();
},{"States":"States","Types":"Types"}],"CloudAnimation":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7288fjsiXFAlL+LiGenQ8Or', 'CloudAnimation');
// scripts\scenescripts\CloudAnimation.js

cc.Class({
    "extends": cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        this.clouds = [];
    },

    generateCloudSpeed: function generateCloudSpeed() {},

    animate: function animate(cloud) {},

    randomInRangeInclusive: function randomInRangeInclusive(min, max) {
        var ret;
        for (;;) {
            ret = min + Math.random() * (max - min) * 1.1;
            if (ret <= max) {
                break;
            }
        }
        return ret;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        for (var i = 0; i < clouds.length; i++) {
            animate(clouds[i]);
        }
    }
});

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

var floatAboveCube = [1, 2, 3, 4, 5, 6];
var rightOnTopOfCube = [7, 8, 9, 10];

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
				this.gameField[y][x] = newCube;
			}
		}
	},

	/* Displaces the entire gamefield by *Speed*-Pixel
  * In case border is crossed -> delete lowest row */
	updateFieldPosition: function updateFieldPosition(speed) {
		for (var y = 0; y < this.gameField.length; y++) {
			for (var x = 0; x < this.gameField[y].length; x++) {
				var posX = this.gameField[y][x].getPositionX();
				var posY = this.gameField[y][x].getPositionY();
				this.gameField[y][x].setPosition(posX, posY + speed);
			}
		}
		this.updatePlayerPosition(speed);
		/*var fieldx =  this.node.getPositionX(); //BUGGY
  var fieldy = this.node.getPositionY();
  this.node.setPosition(fieldx, fieldy+speed); */
		if (this.gameField[this.gameField.length - 1][0].getPositionY() <= this.despawnHeight) {
			this.destroyLine(this.gameField.length - 1);
			this.rearrangeGameField();
		}
		return true;
	},

	updatePlayerPosition: function updatePlayerPosition(speed) {
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

	setPlayerStart: function setPlayerStart(player) {
		var mid = Math.round(Number(this.gameField[this.gameField.length - 1].length / 2)) - 1;
		var startField = this.gameField[this.gameField.length - 1][mid];
		player.arrayPosX = mid;
		player.arrayPosY = this.gameField.length - 1;
		player.oldDest = startField;
		var startpos = cc.p(startField.getPositionX(), startField.getPositionY() + player.offsetY);
		player.node.setPosition(startpos);
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

	destroyLine: function destroyLine(line) {
		for (var i = 0; i < this.gameField[line].length; i++) {
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
		var newarray = [];
		var x = this.gameField[1][0].getPositionX();
		newarray[0] = this.createFirstLine(x);
		for (var i = 0; i < this.gameField.length - 1; i++) {
			newarray[i + 1] = this.gameField[i];
		}
		this.gameField = newarray;
		this.addZOrderToGameField();
		this.player.arrayPosY = this.player.arrayPosY + 1;
		if (this.player.arrayPosY >= this.gameField.length) {
			this.player.fall();
			this.game.getComponent('Game').state = GameState.GameOver;
		}
	},

	createFirstLine: function createFirstLine(x) {
		var newarray = [];
		var bufferarray = this.getNextLineFromPuffer();
		var arrayItems = this.getNextLineFromItemPuffer();

		for (var i = 0; i < bufferarray.length; i++) {
			if (bufferarray.length % 2 == 0) {

				newarray[i] = this.spawnCube(x + i * distX, ySpawnPosition + distY - spawnOffSetY, bufferarray[i], arrayItems[i]);
				newarray[i].opacity = 0;
				var rise = cc.moveTo(1, cc.p(newarray[i].getPosition().x, ySpawnPosition + distY)).easing(cc.easeCubicActionIn());
				var fade = cc.fadeIn(1);
				newarray[i].runAction(cc.spawn(fade, rise));
			} else {
				newarray[i] = this.spawnCube(x + i * distX, ySpawnPosition + distY - spawnOffSetY, bufferarray[i], arrayItems[i]);
				newarray[i].opacity = 0;
				var rise = cc.moveTo(1, cc.p(newarray[i].getPosition().x, ySpawnPosition + distY)).easing(cc.easeCubicActionIn());
				var fade = cc.fadeIn(1);
				newarray[i].runAction(cc.spawn(fade, rise));
			}
		}
		return newarray;
	},

	//
	// All relevant data has to be loaded as properties within the prefab instantiated here.!!
	//
	spawnCube: function spawnCube(x, y, cubeNumber, itemNumber) {
		cc.log('M: spawnCube');
		switch (cubeNumber) {
			case 0:
				var newCube = cc.instantiate(this.Empty);
				break;
			case 1:
				var newCube = cc.instantiate(this.Grass);
				newCube = this.spawnItem(newCube, itemNumber);

				break;
			case 2:
				var newCube = cc.instantiate(this.Dirt);
				newCube = this.spawnItem(newCube, itemNumber);

				break;
			case 3:
				newCube = cc.instantiate(this.Trapdoor);
				//newCube.getComponent('Block').sprite = newCube;

				break;
			case 4:
				var newCube = cc.instantiate(this.Switcher);
				newCube = this.spawnItem(newCube, itemNumber);

				break;
			case 5:
				var newCube = cc.instantiate(this.Poison);
				newCube = this.spawnItem(newCube, itemNumber);

				break;
			case 6:
				var newCube = cc.instantiate(this.Spike);
				newCube = this.spawnItem(newCube, itemNumber);

				break;
			case 7:
				var newCube = cc.instantiate(this.WaterC);
				break;
			default:
				var newCube = cc.instantiate(this.Grass);
				newCube = this.spawnItem(newCube, itemNumber);

				break;
		}

		newCube.setPosition(x, y);

		this.node.addChild(newCube);

		return newCube;
	},

	spawnItem: function spawnItem(parentBlock, itemNumber) {
		switch (itemNumber) {
			case 0:
				//Empty/ no item
				var newItem = cc.instantiate(this.Empty);
				break;
			case 1:
				//antidoteLeft
				var newItem = cc.instantiate(this.AntidoteL);
				break;
			case 2:
				//antidoteRight
				var newItem = cc.instantiate(this.AntidoteR);
				break;
			case 3:
				//coinLeft
				var newItem = cc.instantiate(this.CoinL);
				break;
			case 4:
				//coinRight
				var newItem = cc.instantiate(this.CoinR);
				break;
			case 5:
				//starLeft
				var newItem = cc.instantiate(this.StarL);
				break;
			case 6:
				//starRight
				var newItem = cc.instantiate(this.StarR);
				break;
			case 7:
				//BlockedBush
				var newItem = cc.instantiate(this.BlockedBush);
				parentBlock.getComponent('Block').isBlocked = true;
				break;
			case 8:
				//BlockedStone
				var newItem = cc.instantiate(this.BlockedStone);
				parentBlock.getComponent('Block').isBlocked = true;
				break;
			case 9:
				//SlowDown (Top AND Bottom)
				var newItem = cc.instantiate(this.SlowDownBottom);
				var newItem2 = cc.instantiate(this.SlowDownTop);
				newItem.addChild(newItem2);
				break;
			default:
				//Empty/ no item
				var newItem = cc.instantiate(this.Empty);
				break;
		}

		var posY = newItem.getPositionY();
		var posX = newItem.getPositionX();

		if (floatAboveCube.includes(itemNumber)) {
			newItem.setPosition(posX, posY + 50);
		} else if (rightOnTopOfCube.includes(itemNumber)) {
			newItem.setPosition(posX, posY + 40);
		}

		parentBlock.getComponent('Block').item = newItem;
		parentBlock.addChild(newItem);

		return parentBlock;
	},

	getNextLineFromPuffer: function getNextLineFromPuffer() {
		var ret = [];
		if (pufferField.length === nextFirstLine) {
			//cc.log('Puffer array is empty!');
			this.defineNextRandomArray();
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

	getNextLineFromItemPuffer: function getNextLineFromItemPuffer() {
		cc.log('M: getNextLineFromItemPuffer');
		var ret = [];

		if (pufferFieldItems.length === nextFirstLineItem) {
			ret = pufferFieldItems[nextFirstLineItem];
			nextFirstLineItem = nextFirstLineItem + 1;
		} else {
			ret = pufferFieldItems[nextFirstLineItem];
			nextFirstLineItem = nextFirstLineItem + 1;
		}
		return ret;
	},

	defineNextRandomArray: function defineNextRandomArray() {
		var score = this.game.getComponent('Game').score;

		pufferField = [];
		pufferFieldItems = [];

		var rand = Math.random() * 10 + 1;

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
		var count = 1;
		for (var y = 0; y < this.gameField.length; y++) {
			for (var x = 0; x < this.gameField[y].length; x++) {
				this.gameField[y][x].setLocalZOrder(count);
				count++;
			}
		}
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
        //this.player.node.setPosition(this.gamefield.getStartPosition());
        this.gamefield.setPlayerStart(this.player);
        this.player.node.setLocalZOrder(1000);
        this.player.dx = this.gamefield.disTX / 2; //only half the distance on x!!
        this.player.dy = this.gamefield.disTY;
    },

    // Called when gamefield is initalized ( onLoad() has finished )
    onGameFieldLoadCallback: function onGameFieldLoadCallback() {},

    validateMove: function validateMove(dir) {

        if (this.state === GameState.GameOver) {
            return false;
        }

        if (this.player.movestate === PlayerMovementState.Jumping || this.player.movestate === PlayerMovementState.Falling) {
            //Player already jumping/falling -> neglect input
            return false;
        }

        // Handle swaped case
        if (this.player.isSwaped) {
            dir = -dir;
        }

        // Handle slowed case
        if (this.player.isSlowed) {
            pressCount++;
            if (pressCount < 3) {
                return false;
            } else {
                pressCount = 0;
                this.player.isSlowed = false;
            }
        }

        this.destfield = this.gamefield.getJumpField(dir);
        console.log(this.destfield);
        var steppedBlock = this.destfield.getComponent('Block');
        console.log(steppedBlock);
        if (steppedBlock.isBlocked) {
            return false;
        }
        this.player.isSwaped = false;

        //
        //Move was correct.
        //
        //Change player direction
        if (this.player.dir != dir) this.animationNeedsUpdate = true;
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
                                self.player.oldDest.getComponent('Block').playerOnTop = false;
                            }
                        }
                        break;
                    case cc.KEY.d:
                        if (self.state === GameState.Waiting) self.state = GameState.Playing;

                        if (self.validateMove(-1)) {
                            self.player.move(self.destfield, self);
                            self.gamefield.updatePlayerArrayPos();
                            if (self.player.oldDest !== undefined) {
                                self.player.oldDest.getComponent('Block').playerOnTop = false;
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
            this.state = GameState.Loading;
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
                    updateAccess = this.gamefield.updateFieldPosition(-0.3);
                    break;
                case 7:
                    updateAccess = this.gamefield.updateFieldPosition(-0.4);
                    break;
                case 6:
                    updateAccess = this.gamefield.updateFieldPosition(-1);
                    break;
                case 5:
                    updateAccess = this.gamefield.updateFieldPosition(-1.5);
                    break;
                case 4:
                    updateAccess = this.gamefield.updateFieldPosition(-2);
                    break;
                case 3:
                    updateAccess = this.gamefield.updateFieldPosition(-4);
                    break;
                case 2:
                    updateAccess = this.gamefield.updateFieldPosition(-8);
                    break;
                case 1:
                    updateAccess = this.gamefield.updateFieldPosition(-12);
                    break;
                case 0:
                    updateAccess = this.gamefield.updateFieldPosition(-20);
                    break;
                default:
                    updateAccess = this.gamefield.updateFieldPosition(-0.3);
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
        //Remove shadows
        var children = this.node.children;
        for (var i = 0; i < children.length; ++i) {
            children[i].destroy();
        }

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

        if (!this.animation) // Init animation
            this.animation = this.getComponent(cc.Animation);

        //Init timers
        this.poisonTmp = this.poisonTimer;
        this.invincibiltyTmp = this.invincibiltyTimer;

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
        var steppedBlock = this.destfield.getComponent('Block');
        steppedBlock.onStepCallback(this, game);
        var item = steppedBlock.getComponentInChildren('Item');
        if (item !== null) item.onPickUpCallback(this, game);
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
        this.animationRunning = false; //Force player update every jump
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

        if (this.isPoisoned) cc.audioEngine.playEffect(this.poisonedAudio, true);

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
            this.updateAnimation();
        }
    },

    updateAnimation: function updateAnimation() {
        if (!this.isPoisoned && !this.isInvincible) {
            //NICE TO HAVE: no bools
            this.animation.stop();
            this.animationRunning = false;
            return false;
        }

        if ((this.isPoisoned || this.isInvincible) && !this.animationRunning) this.animation.play(this.getAnimation());
        this.animationRunning = true;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0RldmVsb3BtZW50L0NvY29zQ3JlYXRvci9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9CbG9jay5qcyIsImFzc2V0cy9zY3JpcHRzL3NjZW5lc2NyaXB0cy9DbG91ZEFuaW1hdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9ibG9ja3MvRGlydC5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9ibG9ja3MvRW1wdHkuanMiLCJhc3NldHMvc2NyaXB0cy9zY2VuZXNjcmlwdHMvR2FtZUJ1dHRvbkNhbGxiYWNrcy5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9HYW1lRmllbGQuanMiLCJhc3NldHMvc2NyaXB0cy9HYW1lLmpzIiwiYXNzZXRzL3NjcmlwdHMvZ2FtZWZpZWxkL2Jsb2Nrcy9HcmFzcy5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVvYmplY3RzL0l0ZW0uanMiLCJhc3NldHMvc2NyaXB0cy9nYW1lZmllbGQvTGV2ZWwuanMiLCJhc3NldHMvc2NyaXB0cy9zY2VuZXNjcmlwdHMvTWVudUJ1dHRvbkNhbGxiYWNrcy5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVvYmplY3RzL1BsYXllci5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9ibG9ja3MvUG9pc29uLmpzIiwiYXNzZXRzL3NjcmlwdHMvZ2FtZWZpZWxkL2Jsb2Nrcy9TcGlrZS5qcyIsImFzc2V0cy9zY3JpcHRzL2VudW1zL1N0YXRlcy5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9ibG9ja3MvU3dpdGNoZXIuanMiLCJhc3NldHMvc2NyaXB0cy9nYW1lZmllbGQvYmxvY2tzL1RyYXBkb29yLmpzIiwiYXNzZXRzL3NjcmlwdHMvZW51bXMvVHlwZXMuanMiLCJhc3NldHMvc2NyaXB0cy9nYW1lZmllbGQvYmxvY2tzL1dhdGVyUmlnaHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4bUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcwY2Y4MHZhNGlKQ1haRFhiU3dnWTFtbScsICdCbG9jaycpO1xuLy8gc2NyaXB0c1xcZ2FtZWZpZWxkXFxCbG9jay5qc1xuXG52YXIgQmxvY2tUeXBlID0gcmVxdWlyZSgnVHlwZXMnKS5CbG9ja1R5cGU7XG52YXIgUGxheWVyTW92ZW1lbnRTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLlBsYXllck1vdmVtZW50U3RhdGU7XG5cbnZhciB0ZW1wUGFyZW50O1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGlzQmxvY2tlZDogZmFsc2UsXG4gICAgICAgIGhhc0l0ZW06IGZhbHNlLFxuICAgICAgICBpc0RlYWRseTogZmFsc2UsXG5cbiAgICAgICAgYmxvY2t0eXBlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IEJsb2NrVHlwZS5Ob25lLFxuICAgICAgICAgICAgdHlwZTogQmxvY2tUeXBlXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXRlbToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIG9uU3RlcHBlZFNvdW5kOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgZGVmYXVsdFNvdW5kOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIC8vSWYgYmxvY2sgaGFzIGFuaW1hdGlvbiBsb2FkIGl0XG4gICAgICAgIHZhciBhbmltID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICBpZiAoYW5pbSAhPT0gbnVsbCB8fCB1bmRlZmluZWQpIHRoaXMuYW5pbSA9IGFuaW07XG4gICAgICAgIC8vSW5pdGFsaXplIEJsb2NrIGNvcmVzc3BvbmRpbmcgdG8gaXRzIHR5cGVcbiAgICAgICAgc3dpdGNoICh0aGlzLmJsb2NrdHlwZSkge1xuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuU3Bpa2U6XG4gICAgICAgICAgICAgICAgdGhpcy5oYXNLaWxsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLlRyYXBkb29yOlxuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuRW1wdHk6XG4gICAgICAgICAgICAgICAgdGhpcy5pc0RlYWRseSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEJsb2NrVHlwZS5EaXJ0OlxuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuR3JhczpcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLlN3aXRjaGVyOlxuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuUG9pc29uOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vV2hhdCBoYXBwZW5zIGlmIHlvdSBzdGVwIG9uIGEgYmxvY2tcbiAgICBvblN0ZXBDYWxsYmFjazogZnVuY3Rpb24gb25TdGVwQ2FsbGJhY2socGxheWVyLCBnYW1lKSB7XG4gICAgICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xuICAgICAgICAvLyBQZXJmb3JtIHRoZSBhY3Rpb24gdGhlIGJsb2NrIHByb2R1Y2VzKGNoYW5nZSBwbGF5ZXIgb3IgZW52aXJvbm1lbnQpXG4gICAgICAgIHN3aXRjaCAodGhpcy5ibG9ja3R5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLkRpcnQ6XG4gICAgICAgICAgICBjYXNlIEJsb2NrVHlwZS5HcmFzOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuRW1wdHk6XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZmFsbCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuU3dpdGNoZXI6XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIuaXNTd2FwZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuVHJhcGRvb3I6XG4gICAgICAgICAgICAgICAgdGhpcy5hbmltLnBsYXkoJ3RyYXBkb29yJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZmFsbCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuUG9pc29uOlxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5wbGF5ZXIuaXNJbnZpbmNpYmxlKSB0aGlzLnBsYXllci5pc1BvaXNvbmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLlNwaWtlOlxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyT25Ub3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5oYXNLaWxsZWQpIHRoaXMucGVyZm9ybVNwaWtlS2lsbCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUGVyZm9ybSBibG9jayBhbmltYXRpb25cbiAgICAgICAgdmFyIHN0ZXBGaW5pc2hlZENhbGxiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5maW5pc2hTdGVwLCB0aGlzKTtcbiAgICAgICAgLy92YXIgYmxvY2thY3Rpb24gPSBjYy5zcGF3bih0aGlzLmFzc2VtYmxlQmxvY2tBY3Rpb24oKSwgdGhpcy5kZWZvcm0oKSk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UodGhpcy5zaGFrZSgpLCBzdGVwRmluaXNoZWRDYWxsYmFjaykpO1xuICAgICAgICB0aGlzLnBsYXllci5ub2RlLnJ1bkFjdGlvbih0aGlzLnNoYWtlKCkpO1xuICAgIH0sXG5cbiAgICAvL0xldCBibG9ja3Mgc2hha2Ugd2hlbiB0aGV5IGFyZSBzdGVwcGVkIG9uIChpbmNsdWRpbmcgcGxheWVyKVxuICAgIHNoYWtlOiBmdW5jdGlvbiBzaGFrZSgpIHtcbiAgICAgICAgdmFyIGRvd24gPSBjYy5tb3ZlQnkoMC4yLCBjYy5wKDAsIC0yKSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbkluKCkpO1xuICAgICAgICB2YXIgdXAgPSBjYy5tb3ZlQnkoMC4yLCBjYy5wKDAsICsyKSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbkluKCkpO1xuICAgICAgICB2YXIgc2hha2UgPSBjYy5zZXF1ZW5jZShkb3duLCB1cCk7XG4gICAgICAgIHJldHVybiBzaGFrZTtcbiAgICB9LFxuXG4gICAgZmluaXNoU3RlcDogZnVuY3Rpb24gZmluaXNoU3RlcCgpIHt9LFxuXG4gICAgLy8gQWN0aW9uKEFuaW1hdGlvbiBldGMpIGZvciBldmVyeSBibG9ja1xuICAgIGFzc2VtYmxlQmxvY2tBY3Rpb246IGZ1bmN0aW9uIGFzc2VtYmxlQmxvY2tBY3Rpb24oKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5ibG9ja3R5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLkVtcHR5OlxuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuRGlydDpcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLkdyYXM6XG4gICAgICAgICAgICBjYXNlIEJsb2NrVHlwZS5Td2l0Y2hlcjpcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLlBvaXNvbjpcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLlNwaWtlOlxuICAgICAgICAgICAgICAgIHJldHVybiBjYy5tb3ZlVG8oMCwgdGhpcy5ub2RlLmdldFBvc2l0aW9uKCkpO1xuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuVHJhcGRvcjpcbiAgICAgICAgICAgICAgICByZXR1cm4gY2MubW92ZVRvKDEsIGNjLnAodGhpcy5ub2RlLmdldFBvc2l0aW9uWCgpLCB0aGlzLm5vZGUuZ2V0UG9zaXRpb25ZKCkgLSAxMDApKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBQYXJ0IG9mIGFuaW1hdGlvbiBzZWUgYWJvdmVcbiAgICBkZWZvcm06IGZ1bmN0aW9uIGRlZm9ybSgpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmJsb2NrdHlwZSkge1xuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuRW1wdHk6XG4gICAgICAgICAgICBjYXNlIEJsb2NrVHlwZS5EaXJ0OlxuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuR3JhczpcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLlN3aXRjaGVyOlxuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuVHJhcGRvb3I6XG4gICAgICAgICAgICBjYXNlIEJsb2NrVHlwZS5Qb2lzb246XG4gICAgICAgICAgICBjYXNlIEJsb2NrVHlwZS5TcGlrZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gY2MubW92ZVRvKDAsIHRoaXMubm9kZS5nZXRQb3NpdGlvbigpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBwZXJmb3JtU3Bpa2VLaWxsOiBmdW5jdGlvbiBwZXJmb3JtU3Bpa2VLaWxsKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNEZWFkbHkgJiYgIXRoaXMucGxheWVyLmlzSW52aW5jaWJsZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmhhc0tpbGxlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLmtpbGwoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhhc0tpbGxlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7fVxuICAgIH0sXG5cbiAgICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgIH0sXG5cbiAgICBzZXRCbG9ja2VkOiBmdW5jdGlvbiBzZXRCbG9ja2VkKGJvb2wpIHtcbiAgICAgICAgdGhpcy5pc0Jsb2NrZWQgPSBib29sO1xuICAgIH0sXG5cbiAgICBpc0Jsb2NrZWQ6IGZ1bmN0aW9uIGlzQmxvY2tlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNCbG9ja2VkO1xuICAgIH0sXG5cbiAgICBzd2l0Y2hEZWFkbHk6IGZ1bmN0aW9uIHN3aXRjaERlYWRseSgpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnaXNEZWFkbHk6ICcsIHRoaXMuaXNEZWFkbHkpO1xuICAgICAgICB0aGlzLmlzRGVhZGx5ID0gIXRoaXMuaXNEZWFkbHk7XG4gICAgICAgIHRoaXMuaGFzS2lsbGVkID0gZmFsc2U7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMucGxheWVyT25Ub3ApIHRoaXMucGVyZm9ybVNwaWtlS2lsbCgpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNzI4OGZqc2lYRkFsTCtMaUdlblE4T3InLCAnQ2xvdWRBbmltYXRpb24nKTtcbi8vIHNjcmlwdHNcXHNjZW5lc2NyaXB0c1xcQ2xvdWRBbmltYXRpb24uanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7fSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmNsb3VkcyA9IFtdO1xuICAgIH0sXG5cbiAgICBnZW5lcmF0ZUNsb3VkU3BlZWQ6IGZ1bmN0aW9uIGdlbmVyYXRlQ2xvdWRTcGVlZCgpIHt9LFxuXG4gICAgYW5pbWF0ZTogZnVuY3Rpb24gYW5pbWF0ZShjbG91ZCkge30sXG5cbiAgICByYW5kb21JblJhbmdlSW5jbHVzaXZlOiBmdW5jdGlvbiByYW5kb21JblJhbmdlSW5jbHVzaXZlKG1pbiwgbWF4KSB7XG4gICAgICAgIHZhciByZXQ7XG4gICAgICAgIGZvciAoOzspIHtcbiAgICAgICAgICAgIHJldCA9IG1pbiArIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSAqIDEuMTtcbiAgICAgICAgICAgIGlmIChyZXQgPD0gbWF4KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsb3Vkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYW5pbWF0ZShjbG91ZHNbaV0pO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdmZTEzYzZqaTkxSUdLQWFEMWNHcGZTSycsICdEaXJ0Jyk7XG4vLyBzY3JpcHRzXFxnYW1lZmllbGRcXGJsb2Nrc1xcRGlydC5qc1xuXG52YXIgQmxvY2tUeXBlID0gcmVxdWlyZSgnVHlwZXMnKS5CbG9ja1R5cGU7XG52YXIgUGxheWVyTW92ZW1lbnRTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLlBsYXllck1vdmVtZW50U3RhdGU7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaXNCbG9ja2VkOiBmYWxzZSxcbiAgICAgICAgaGFzSXRlbTogZmFsc2UsXG5cbiAgICAgICAgYmxvY2t0eXBlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IEJsb2NrVHlwZS5Ob25lLFxuICAgICAgICAgICAgdHlwZTogQmxvY2tUeXBlXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXRlbToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMucGxheWVyT25Ub3AgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgb25TdGVwQ2FsbGJhY2s6IGZ1bmN0aW9uIG9uU3RlcENhbGxiYWNrKHBsYXllciwgZ2FtZSkge1xuICAgICAgICBjYy5sb2coJ006IG9uU3RlcENhbGxiYWNrIERpcnQnKTtcbiAgICB9LFxuXG4gICAgY29sbGlkZTogZnVuY3Rpb24gY29sbGlkZSgpIHt9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdiZWVhZlFqMUxoSGtMREVraHpEVjMrMCcsICdFbXB0eScpO1xuLy8gc2NyaXB0c1xcZ2FtZWZpZWxkXFxibG9ja3NcXEVtcHR5LmpzXG5cbnZhciBCbG9ja1R5cGUgPSByZXF1aXJlKCdUeXBlcycpLkJsb2NrVHlwZTtcbnZhciBQbGF5ZXJNb3ZlbWVudFN0YXRlID0gcmVxdWlyZSgnU3RhdGVzJykuUGxheWVyTW92ZW1lbnRTdGF0ZTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvKmdhbWVmaWVsZDoge1xyXG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlLFxyXG4gICAgICAgIH0sKi9cblxuICAgICAgICBpc0Jsb2NrZWQ6IGZhbHNlLFxuICAgICAgICBoYXNJdGVtOiBmYWxzZSxcblxuICAgICAgICBibG9ja3R5cGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogQmxvY2tUeXBlLk5vbmUsXG4gICAgICAgICAgICB0eXBlOiBCbG9ja1R5cGVcbiAgICAgICAgfSxcblxuICAgICAgICBpdGVtOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJPblRvcCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBvblN0ZXBDYWxsYmFjazogZnVuY3Rpb24gb25TdGVwQ2FsbGJhY2socGxheWVyLCBnYW1lKSB7XG4gICAgICAgIC8vIFBlcmZvcm0gdGhlIGFjdGlvbiB0aGUgYmxvY2sgcHJvZHVjZXMoY2hhbmdlIHBsYXllciBvciBlbnZpcm9ubWVudClcbiAgICAgICAgcGxheWVyLmZhbGwoKTtcbiAgICB9LFxuXG4gICAgY29sbGlkZTogZnVuY3Rpb24gY29sbGlkZSgpIHtcbiAgICAgICAgY2MubG9nKCd3aXIgc2luZCBpbiBkZXIgTWV0aG9kZScpO1xuICAgIH1cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzY5ZTc2OTA4MXhHTmJEWkJtckRSTEZ1JywgJ0dhbWVCdXR0b25DYWxsYmFja3MnKTtcbi8vIHNjcmlwdHNcXHNjZW5lc2NyaXB0c1xcR2FtZUJ1dHRvbkNhbGxiYWNrcy5qc1xuXG52YXIgR2FtZVN0YXRlID0gcmVxdWlyZSgnU3RhdGVzJykuR2FtZVN0YXRlO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHBhdXNlT3ZlcmxheToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIHNjb3JlTGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgYnV0dG9uQXVkaW86IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2FtZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIC8qaWYoZ2FtZSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLnNjb3JlTGFiZWwuc3RyaW5nID0gXCJTY29yZTogXCIrZ2FtZS5nZXRDb21wb25lbnQoJ0dhbWUnKS5zY29yZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAqL1xuICAgICAgICB0aGlzLnNjb3JlID0gY2Muc3lzLmxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzY29yZScpO1xuICAgICAgICBjb25zb2xlLmxvZygnU2NvcmUgaW4gR2FtZUJ1dHRvbkNhbGxiYWNrOiAnLCB0aGlzLnNjb3JlKTtcbiAgICAgICAgaWYgKHRoaXMuc2NvcmVMYWJlbCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NDT1JFTEFCRUwnKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRoaXMuc2NvcmVMYWJlbCk7XG4gICAgICAgICAgICB0aGlzLnNjb3JlTGFiZWwuc3RyaW5nID0gXCJTY29yZTogXCIgKyB0aGlzLnNjb3JlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZTsgLy8gVE9ETzogc3ByZWFkIHRoaXMgdG8gdGhlIG91dGVyIHdvcmxkXG4gICAgfSxcblxuICAgIHBhdXNlQ29udHJvbENhbGxiYWNrOiBmdW5jdGlvbiBwYXVzZUNvbnRyb2xDYWxsYmFjaygpIHtcbiAgICAgICAgLy9UT0RPOiBjaGFuZ2UgcGF1c2UgYnV0dG9uIHRvIGRpZmZlcmVudCBzcHJpdGVcbiAgICAgICAgaWYgKHRoaXMucGF1c2VkKSB7XG4gICAgICAgICAgICB0aGlzLnBhdXNlT3ZlcmxheS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLnJlc3VtZSgpO1xuICAgICAgICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5zdGF0ZSA9IEdhbWVTdGF0ZS5QbGF5aW5nO1xuXG4gICAgICAgICAgICBjYy5sb2coXCJyZXN1bWVcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhdXNlT3ZlcmxheS5vcGFjaXR5ID0gMjU1O1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IucGF1c2UoKTtcbiAgICAgICAgICAgIHRoaXMucGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5zdGF0ZSA9IEdhbWVTdGF0ZS5QYXVzZWQ7XG4gICAgICAgICAgICBjYy5sb2coXCJwYXVzZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuYnV0dG9uQXVkaW8sIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgYWdhaW5Db250cm9sQ2FsbGJhY2s6IGZ1bmN0aW9uIGFnYWluQ29udHJvbENhbGxiYWNrKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ0dhbWVTY2VuZScpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuYnV0dG9uQXVkaW8sIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgYmFja0NvbnRyb2xDYWxsYmFjazogZnVuY3Rpb24gYmFja0NvbnRyb2xDYWxsYmFjaygpIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlID0gR2FtZVN0YXRlLkVuZGVkO1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ1N0YXJ0bWVudScpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuYnV0dG9uQXVkaW8sIGZhbHNlKTtcbiAgICB9XG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZTAwMWYrbU1XTk41WWhYeWtMZE1GTFonLCAnR2FtZUZpZWxkJyk7XG4vLyBzY3JpcHRzXFxnYW1lZmllbGRcXEdhbWVGaWVsZC5qc1xuXG4vL0dhbWVGaWVsZFxuXG52YXIgTGV2ZWwgPSByZXF1aXJlKCdMZXZlbCcpO1xudmFyIEJsb2NrVHlwZSA9IHJlcXVpcmUoJ1R5cGVzJykuQmxvY2tUeXBlO1xudmFyIEl0ZW1UeXBlID0gcmVxdWlyZSgnVHlwZXMnKS5JdGVtVHlwZTtcbnZhciBHYW1lU3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5HYW1lU3RhdGU7XG5cbnZhciBzdGFydFggPSAxMTM7XG52YXIgc3RhcnRZID0gNTAxO1xuXG52YXIgZGlzdFggPSA4MztcbnZhciBkaXN0WSA9IDY1O1xuXG52YXIgc3Bhd25PZmZTZXRZID0gMjAwO1xudmFyIGRlc3Bhd25PZmZTZXRZID0gLTEwMDtcbnZhciB5U3Bhd25Qb3NpdGlvbiA9IDQ4NTtcblxudmFyIGZsb2F0QWJvdmVDdWJlID0gWzEsIDIsIDMsIDQsIDUsIDZdO1xudmFyIHJpZ2h0T25Ub3BPZkN1YmUgPSBbNywgOCwgOSwgMTBdO1xuXG52YXIgc3RhcnRGaWVsZCA9IFtbNywgMSwgMiwgMiwgMSwgN10sIFs3LCAxLCA1LCAxLCAyLCAxLCA3XSwgWzcsIDIsIDEsIDEsIDIsIDddLCBbNywgMiwgMSwgMSwgMSwgMiwgN10sIFs3LCAyLCAxLCAxLCAyLCA3XSwgWzcsIDEsIDIsIDEsIDUsIDEsIDddLCBbNywgMSwgMiwgMiwgMSwgN10sIFs3LCAxLCAxLCAyLCAxLCAxLCA3XVxuLypbNywxLDEsMSwxLDBdLFxyXG4gWzcsMSwxLDEsMSwxLDBdLFxyXG4gWzcsMSwxLDQsNCw1XSxcclxuIFs3LDEsMSwxLDUsMSwwXSxcclxuIFs3LDEsMSwxLDEsMF0sXHJcbiBbNyw1LDYsMywxLDEsMF0sXHJcbiBbNywxLDEsNSwxLDBdLFxyXG4gWzcsMSwxLDEsMSwxLDBdLCovXG5dO1xuXG4vL0FycmF5IGZvciBlYWNoIGluZGl2aWR1YWwgYmxvY2tcbnZhciBwdWZmZXJGaWVsZCA9IFtbNywgMSwgNiwgNiwgNiwgMSwgN10sIFs3LCAxLCAyLCAyLCAxLCA3XSwgWzcsIDEsIDMsIDEsIDMsIDEsIDddLCBbNywgMSwgMiwgMiwgMSwgN10sIFs3LCAxLCAyLCAxLCAyLCAxLCA3XSwgWzcsIDMsIDIsIDIsIDMsIDddLCBbNywgNywgMSwgMSwgMSwgNywgN10sIFs3LCAxLCAxLCA0LCA0LCA3XSwgWzcsIDQsIDEsIDQsIDEsIDQsIDddLCBbNywgNCwgMSwgMSwgMSwgN10sIFs3LCA0LCAxLCAxLCAxLCAxLCA3XSwgWzcsIDUsIDEsIDUsIDEsIDddLCBbNywgMSwgMSwgMSwgMSwgMSwgN10sIFs3LCAxLCAxLCAxLCAxLCA3XSwgWzcsIDYsIDEsIDEsIDEsIDEsIDddLCBbNywgMSwgMSwgMSwgMSwgN11dO1xuLypcclxuIFRoZSBpdGVtcy1hcnJheSBoYXMgdGhlIHNhbWUgZGltZW5zaW9ucyBhcyB0aGUgc3RhcnRGaWVsZC4gRWFjaCBpdGVtIHdpbGwgYmUgYSBjaGlsZCBvZiB0aGUgY29ycmVzcG9uZGluZyBibG9jayAoc2VlbiBhcyBhIGxheW92ZXIpLlxyXG4gLy8gMC5FbXB0eSwgMS5hbnRpZG90ZUxlZnQsIDIuYW50aWRvdGVSaWdodCwgMy5jb2luTGVmdCwgNC5jb2luUmlnaHQsIDUuc3RhckxlZnQsXHJcbiAvLyA2LnN0YXJSaWdodCwgNy5CbG9ja2VkQnVzaCwgOC5CbG9ja2VkU3RvbmUsIDkuU2xvd0Rvd25Cb3R0b20sIDkuU2xvd0Rvd25Ub3BcclxuIC8vVE9ETzogMTAuV2F0ZXJMZWZ0LCAxMS5XYXRlclJpZ2h0ICovXG52YXIgc3RhcnRGaWVsZEl0ZW1zID0gW1swLCA4LCAwLCAwLCA4LCAwXSwgWzAsIDgsIDAsIDcsIDAsIDgsIDBdLCBbMCwgMCwgNywgNywgMiwgMF0sIFswLCA2LCA3LCA3LCA3LCAwLCAwXSwgWzAsIDAsIDcsIDcsIDAsIDBdLCBbMCwgNywgNCwgNywgMCwgNywgMF0sIFswLCA3LCAwLCAwLCA3LCAwXSwgWzAsIDgsIDgsIDAsIDgsIDgsIDBdXTtcblxuLypcclxuIFRoZSBpdGVtcy1hcnJheSBoYXMgdGhlIHNhbWUgZGltZW5zaW9ucyBhcyB0aGUgcHVmZmVyRmllbGQuIEVhY2ggaXRlbSB3aWxsIGJlIGEgY2hpbGQgb2YgdGhlIGNvcnJlc3BvbmRpbmcgYmxvY2sgKHNlZW4gYXMgYSBsYXlvdmVyKS5cclxuIC8vIDAuRW1wdHksIDEuYW50aWRvdGVMZWZ0LCAyLmFudGlkb3RlUmlnaHQsIDMuY29pbkxlZnQsIDQuY29pblJpZ2h0LCA1LnN0YXJMZWZ0LFxyXG4gLy8gNi5zdGFyUmlnaHQsIDcuQmxvY2tlZEJ1c2gsIDguQmxvY2tlZFN0b25lLCA5LlNsb3dEb3duQm90dG9tLCA5LlNsb3dEb3duVG9wXHJcbiAvL1RPRE86IDEwLldhdGVyTGVmdCwgMTEuV2F0ZXJSaWdodCAqL1xudmFyIHB1ZmZlckZpZWxkSXRlbXMgPSBbWzAsIDgsIDAsIDAsIDAsIDgsIDBdLCBbMCwgOCwgMCwgMCwgOCwgMF0sIFswLCA4LCAwLCAwLCAwLCA4LCAwXSwgWzAsIDgsIDAsIDAsIDgsIDBdLCBbMCwgOCwgMCwgNywgMCwgOCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDksIDcsIDksIDAsIDBdLCBbMCwgOSwgNywgMCwgMCwgMF0sIFswLCAwLCA3LCAwLCA3LCAwLCAwXSwgWzAsIDAsIDcsIDksIDksIDBdLCBbMCwgMCwgNywgNywgMCwgNywgMF0sIFswLCAwLCA3LCAwLCA4LCAwXSwgWzAsIDAsIDAsIDAsIDAsIDcsIDBdLCBbMCwgMCwgMCwgNywgMCwgMF0sIFswLCAwLCA3LCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDIsIDAsIDBdXTtcblxudmFyIG5leHRGaXJzdExpbmUgPSAwO1xudmFyIG5leHRGaXJzdExpbmVJdGVtID0gMDtcblxudmFyIG5ld0N1YmUgPSBudWxsO1xudmFyIG5ld0l0ZW0gPSBudWxsO1xuXG5jYy5DbGFzcyh7XG5cdCdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG5cdHByb3BlcnRpZXM6IHtcblx0XHRncmlkU2l6ZVg6IDAsIC8vIFJvd3MgLSBkb250IGNoYW5nZSBoZXJlIGJ1dCBpbiBjb2NvcyBjcmVhdG9yISFcblx0XHRncmlkU2l6ZVk6IDAsIC8vIENvbHVtbnNcblxuXHRcdGRlc3Bhd25IZWlnaHQ6IDAsXG5cblx0XHRpdGVtOiB7XG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5Ob2RlXG5cdFx0fSxcblxuXHRcdC8vQmxvY2tzIHN0YXJ0IGhlcmVcblx0XHRFbXB0eTogeyAvLzBcdFx0RU1QVFlcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0R3Jhc3M6IHsgLy8xXHRcdEdSQVNTXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdERpcnQ6IHsgLy8yXHRcdERJUlRcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0VHJhcGRvb3I6IHsgLy8zXHRcdFRSQVBET09SXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdFN3aXRjaGVyOiB7IC8vNFx0XHRTV0lUQ0hFUlxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRQb2lzb246IHsgLy81XHRcdFBPSVNPTlxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRTcGlrZTogeyAvLzZcdFx0U1BJS0Vcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0V2F0ZXJDOiB7IC8vN1x0XHRXQVRFUiAoTGlrZSBFTVBUWSlcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cblx0XHQvLyBHYW1lIHJlZmVyZW5jZSB0byBwYXNzIGZpZWxkXG5cdFx0Z2FtZToge1xuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuTm9kZVxuXHRcdH0sXG5cblx0XHQvL0l0ZW1zIHN0YXJ0IGhlcmVcblx0XHRBbnRpZG90ZUw6IHsgLy8xXHRcdEFudGlkb3RlTFxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRBbnRpZG90ZVI6IHsgLy8yXHRcdEFudGlkb3RlUlxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRDb2luTDogeyAvLzNcdFx0Q29pbkxcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0Q29pblI6IHsgLy80XHRcdENvaW5SXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdFN0YXJMOiB7IC8vNVx0XHRTdGFyTFxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRTdGFyUjogeyAvLzZcdFx0U3RhclJcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cblx0XHRCbG9ja2VkQnVzaDogeyAvLzdcdFx0QmxvY2tlZEJ1c2hcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0QmxvY2tlZFN0b25lOiB7IC8vOFx0XHRCbG9ja2VkU3RvbmVcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0U2xvd0Rvd25Cb3R0b206IHsgLy85XHRcdFNsb3dEb3duQm90dG9tIChCb3R0b20gYW5kIFRvcCBhcmUgYWx3YXlzIHRvZ2V0aGVyKVxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRTbG93RG93blRvcDogeyAvLzlcdFx0U2xvd0Rvd25Ub3AgKEJvdHRvbSBhbmQgVG9wIGFyZSBhbHdheXMgdG9nZXRoZXIpXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdC8qXHJcbiAgIFdhdGVyTGVmdDoge1x0XHRcdFx0XHRcdC8vMTBcdFx0V2F0ZXJMZWZ0XHJcbiAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgIHR5cGU6IGNjLlByZWZhYixcclxuICAgfSwqL1xuXHRcdFdhdGVyUmlnaHQ6IHsgLy8xMVx0XHRXYXRlclJpZ2h0XG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9XG5cblx0fSxcblxuXHQvL1BsYXllclxuXHQvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cblx0b25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG5cdFx0Ly9yZWdpc3RlciBnYW1lZmllbGQgYXQgZ2FtZSBmb3IgcHJvY2Vzc2luZyBnYW1lZmllbGQgbG9naWNcblx0XHR0aGlzLmdhbWUuZ2V0Q29tcG9uZW50KCdHYW1lJykuZ2FtZWZpZWxkID0gdGhpcztcblxuXHRcdHRoaXMucGxheWVyID0gbnVsbDsgLy8gbG9hZCBsYXRlciB3aGVuIHBsYXllciByYW4gb25Mb2FkKClcblx0XHR0aGlzLmNvdW50ID0gMDtcblx0XHR0aGlzLmdhbWVGaWVsZCA9IFtdO1xuXHRcdHRoaXMuaXRlbXMgPSBbXTtcblxuXHRcdHRoaXMuZGlzVFggPSBkaXN0WDtcblx0XHR0aGlzLmRpc1RZID0gZGlzdFk7XG5cdFx0dGhpcy5yZXNldEFycmF5cygpO1xuXHRcdHRoaXMuaW5pdGlhbGl6ZUZpZWxkKCk7XG5cblx0XHR0aGlzLmdhbWUuZ2V0Q29tcG9uZW50KCdHYW1lJykub25HYW1lRmllbGRMb2FkQ2FsbGJhY2soKTtcblx0fSxcblxuXHRyZXNldEFycmF5czogZnVuY3Rpb24gcmVzZXRBcnJheXMoKSB7XG5cdFx0bmV4dEZpcnN0TGluZSA9IDA7XG5cdFx0bmV4dEZpcnN0TGluZUl0ZW0gPSAwO1xuXHRcdHB1ZmZlckZpZWxkID0gW1s3LCAxLCA2LCA2LCA2LCAxLCA3XSwgWzcsIDEsIDIsIDIsIDEsIDddLCBbNywgMSwgMywgMSwgMywgMSwgN10sIFs3LCAxLCAyLCAyLCAxLCA3XSwgWzcsIDEsIDIsIDEsIDIsIDEsIDddLCBbNywgMywgMiwgMiwgMywgN10sIFs3LCA3LCAxLCAxLCAxLCA3LCA3XSwgWzcsIDEsIDEsIDQsIDQsIDddLCBbNywgNCwgMSwgNCwgMSwgNCwgN10sIFs3LCA0LCAxLCAxLCAxLCA3XSwgWzcsIDQsIDEsIDEsIDEsIDEsIDddLCBbNywgNSwgMSwgNSwgMSwgN10sIFs3LCAxLCAxLCAxLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddLCBbNywgNiwgMSwgMSwgMSwgMSwgN10sIFs3LCAxLCAxLCAxLCAxLCA3XV07XG5cdFx0cHVmZmVyRmllbGRJdGVtcyA9IFtbMCwgOCwgMCwgMCwgMCwgOCwgMF0sIFswLCA4LCAwLCAwLCA4LCAwXSwgWzAsIDgsIDAsIDAsIDAsIDgsIDBdLCBbMCwgOCwgMCwgMCwgOCwgMF0sIFswLCA4LCAwLCA3LCAwLCA4LCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgOSwgNywgOSwgMCwgMF0sIFswLCA5LCA3LCAwLCAwLCAwXSwgWzAsIDAsIDcsIDAsIDcsIDAsIDBdLCBbMCwgMCwgNywgOSwgOSwgMF0sIFswLCAwLCA3LCA3LCAwLCA3LCAwXSwgWzAsIDAsIDcsIDAsIDgsIDBdLCBbMCwgMCwgMCwgMCwgMCwgNywgMF0sIFswLCAwLCAwLCA3LCAwLCAwXSwgWzAsIDAsIDcsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMiwgMCwgMF1dO1xuXHR9LFxuXG5cdGluaXRpYWxpemVGaWVsZDogZnVuY3Rpb24gaW5pdGlhbGl6ZUZpZWxkKCkge1xuXHRcdGZvciAodmFyIHkgPSAwOyB5IDwgc3RhcnRGaWVsZC5sZW5ndGg7IHkrKykge1xuXHRcdFx0dGhpcy5nYW1lRmllbGRbeV0gPSBbXTtcblx0XHRcdGZvciAodmFyIHggPSAwOyB4IDwgc3RhcnRGaWVsZFt5XS5sZW5ndGg7IHgrKykge1xuXHRcdFx0XHRpZiAoc3RhcnRGaWVsZFt5XS5sZW5ndGggJSAyID09PSAwKSB7XG5cdFx0XHRcdFx0bmV3Q3ViZSA9IHRoaXMuc3Bhd25DdWJlKHN0YXJ0WCArIHggKiBkaXN0WCwgc3RhcnRZIC0gZGlzdFkgKiB5LCBzdGFydEZpZWxkW3ldW3hdLCBzdGFydEZpZWxkSXRlbXNbeV1beF0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5ld0N1YmUgPSB0aGlzLnNwYXduQ3ViZShzdGFydFggKyB4ICogZGlzdFggLSBkaXN0WCAvIDIsIHN0YXJ0WSAtIGRpc3RZICogeSwgc3RhcnRGaWVsZFt5XVt4XSwgc3RhcnRGaWVsZEl0ZW1zW3ldW3hdKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmdhbWVGaWVsZFt5XVt4XSA9IG5ld0N1YmU7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdC8qIERpc3BsYWNlcyB0aGUgZW50aXJlIGdhbWVmaWVsZCBieSAqU3BlZWQqLVBpeGVsXHJcbiAgKiBJbiBjYXNlIGJvcmRlciBpcyBjcm9zc2VkIC0+IGRlbGV0ZSBsb3dlc3Qgcm93ICovXG5cdHVwZGF0ZUZpZWxkUG9zaXRpb246IGZ1bmN0aW9uIHVwZGF0ZUZpZWxkUG9zaXRpb24oc3BlZWQpIHtcblx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuZ2FtZUZpZWxkLmxlbmd0aDsgeSsrKSB7XG5cdFx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuZ2FtZUZpZWxkW3ldLmxlbmd0aDsgeCsrKSB7XG5cdFx0XHRcdHZhciBwb3NYID0gdGhpcy5nYW1lRmllbGRbeV1beF0uZ2V0UG9zaXRpb25YKCk7XG5cdFx0XHRcdHZhciBwb3NZID0gdGhpcy5nYW1lRmllbGRbeV1beF0uZ2V0UG9zaXRpb25ZKCk7XG5cdFx0XHRcdHRoaXMuZ2FtZUZpZWxkW3ldW3hdLnNldFBvc2l0aW9uKHBvc1gsIHBvc1kgKyBzcGVlZCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHRoaXMudXBkYXRlUGxheWVyUG9zaXRpb24oc3BlZWQpO1xuXHRcdC8qdmFyIGZpZWxkeCA9ICB0aGlzLm5vZGUuZ2V0UG9zaXRpb25YKCk7IC8vQlVHR1lcclxuICB2YXIgZmllbGR5ID0gdGhpcy5ub2RlLmdldFBvc2l0aW9uWSgpO1xyXG4gIHRoaXMubm9kZS5zZXRQb3NpdGlvbihmaWVsZHgsIGZpZWxkeStzcGVlZCk7ICovXG5cdFx0aWYgKHRoaXMuZ2FtZUZpZWxkW3RoaXMuZ2FtZUZpZWxkLmxlbmd0aCAtIDFdWzBdLmdldFBvc2l0aW9uWSgpIDw9IHRoaXMuZGVzcGF3bkhlaWdodCkge1xuXHRcdFx0dGhpcy5kZXN0cm95TGluZSh0aGlzLmdhbWVGaWVsZC5sZW5ndGggLSAxKTtcblx0XHRcdHRoaXMucmVhcnJhbmdlR2FtZUZpZWxkKCk7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9LFxuXG5cdHVwZGF0ZVBsYXllclBvc2l0aW9uOiBmdW5jdGlvbiB1cGRhdGVQbGF5ZXJQb3NpdGlvbihzcGVlZCkge1xuXHRcdHZhciB4ID0gdGhpcy5wbGF5ZXIubm9kZS5nZXRQb3NpdGlvblgoKTtcblx0XHR2YXIgeSA9IHRoaXMucGxheWVyLm5vZGUuZ2V0UG9zaXRpb25ZKCk7XG5cdFx0dGhpcy5wbGF5ZXIubm9kZS5zZXRQb3NpdGlvbih4LCB5ICsgc3BlZWQpO1xuXHR9LFxuXG5cdHVwZGF0ZVBsYXllckFycmF5UG9zOiBmdW5jdGlvbiB1cGRhdGVQbGF5ZXJBcnJheVBvcygpIHtcblx0XHRpZiAodGhpcy5nYW1lRmllbGRbdGhpcy5wbGF5ZXIuYXJyYXlQb3NZXS5sZW5ndGggJSAyID09IDApIHtcblx0XHRcdGlmICh0aGlzLnBsYXllci5kaXIgPCAwKSB7XG5cdFx0XHRcdHRoaXMucGxheWVyLmFycmF5UG9zWCA9IHRoaXMucGxheWVyLmFycmF5UG9zWCArIDE7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICh0aGlzLnBsYXllci5kaXIgPiAwKSB7XG5cdFx0XHRcdHRoaXMucGxheWVyLmFycmF5UG9zWCA9IHRoaXMucGxheWVyLmFycmF5UG9zWCAtIDE7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5wbGF5ZXIuYXJyYXlQb3NZID0gdGhpcy5wbGF5ZXIuYXJyYXlQb3NZIC0gMTtcblx0fSxcblxuXHRzZXRQbGF5ZXJTdGFydDogZnVuY3Rpb24gc2V0UGxheWVyU3RhcnQocGxheWVyKSB7XG5cdFx0dmFyIG1pZCA9IE1hdGgucm91bmQoTnVtYmVyKHRoaXMuZ2FtZUZpZWxkW3RoaXMuZ2FtZUZpZWxkLmxlbmd0aCAtIDFdLmxlbmd0aCAvIDIpKSAtIDE7XG5cdFx0dmFyIHN0YXJ0RmllbGQgPSB0aGlzLmdhbWVGaWVsZFt0aGlzLmdhbWVGaWVsZC5sZW5ndGggLSAxXVttaWRdO1xuXHRcdHBsYXllci5hcnJheVBvc1ggPSBtaWQ7XG5cdFx0cGxheWVyLmFycmF5UG9zWSA9IHRoaXMuZ2FtZUZpZWxkLmxlbmd0aCAtIDE7XG5cdFx0cGxheWVyLm9sZERlc3QgPSBzdGFydEZpZWxkO1xuXHRcdHZhciBzdGFydHBvcyA9IGNjLnAoc3RhcnRGaWVsZC5nZXRQb3NpdGlvblgoKSwgc3RhcnRGaWVsZC5nZXRQb3NpdGlvblkoKSArIHBsYXllci5vZmZzZXRZKTtcblx0XHRwbGF5ZXIubm9kZS5zZXRQb3NpdGlvbihzdGFydHBvcyk7XG5cdH0sXG5cblx0Z2V0SnVtcEZpZWxkOiBmdW5jdGlvbiBnZXRKdW1wRmllbGQoZGlyKSB7XG5cdFx0aWYgKHRoaXMuZ2FtZUZpZWxkW3RoaXMucGxheWVyLmFycmF5UG9zWV0ubGVuZ3RoICUgMiA9PSAwKSB7XG5cdFx0XHRpZiAoZGlyID4gMCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5nYW1lRmllbGRbdGhpcy5wbGF5ZXIuYXJyYXlQb3NZIC0gMV1bdGhpcy5wbGF5ZXIuYXJyYXlQb3NYXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmdhbWVGaWVsZFt0aGlzLnBsYXllci5hcnJheVBvc1kgLSAxXVt0aGlzLnBsYXllci5hcnJheVBvc1ggKyAxXTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGRpciA+IDApIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2FtZUZpZWxkW3RoaXMucGxheWVyLmFycmF5UG9zWSAtIDFdW3RoaXMucGxheWVyLmFycmF5UG9zWCAtIDFdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2FtZUZpZWxkW3RoaXMucGxheWVyLmFycmF5UG9zWSAtIDFdW3RoaXMucGxheWVyLmFycmF5UG9zWF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdGRlc3Ryb3lMaW5lOiBmdW5jdGlvbiBkZXN0cm95TGluZShsaW5lKSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdhbWVGaWVsZFtsaW5lXS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dGhpcy5kZXN0cm95QmxvY2sodGhpcy5nYW1lRmllbGRbbGluZV1baV0pO1xuXHRcdH1cblx0fSxcblxuXHRkZXN0cm95QmxvY2s6IGZ1bmN0aW9uIGRlc3Ryb3lCbG9jayhibG9jaykge1xuXHRcdHZhciBmYWxsID0gY2MubW92ZVRvKDEsIGNjLnAoYmxvY2suZ2V0UG9zaXRpb24oKS54LCBkZXNwYXduT2ZmU2V0WSkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25JbigpKTtcblx0XHR2YXIgZmFkZSA9IGNjLmZhZGVPdXQoMS41KTtcblx0XHRibG9jay5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2Muc3Bhd24oZmFsbCwgZmFkZSksIGNjLmNhbGxGdW5jKHRoaXMuZGVzdHJveUJsb2NrRGF0YSwgdGhpcykpKTtcblx0fSxcblxuXHRkZXN0cm95QmxvY2tEYXRhOiBmdW5jdGlvbiBkZXN0cm95QmxvY2tEYXRhKGJsb2NrKSB7XG5cdFx0YmxvY2suZGVzdHJveSgpO1xuXHR9LFxuXG5cdHJlYXJyYW5nZUdhbWVGaWVsZDogZnVuY3Rpb24gcmVhcnJhbmdlR2FtZUZpZWxkKCkge1xuXHRcdHZhciBuZXdhcnJheSA9IFtdO1xuXHRcdHZhciB4ID0gdGhpcy5nYW1lRmllbGRbMV1bMF0uZ2V0UG9zaXRpb25YKCk7XG5cdFx0bmV3YXJyYXlbMF0gPSB0aGlzLmNyZWF0ZUZpcnN0TGluZSh4KTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZ2FtZUZpZWxkLmxlbmd0aCAtIDE7IGkrKykge1xuXHRcdFx0bmV3YXJyYXlbaSArIDFdID0gdGhpcy5nYW1lRmllbGRbaV07XG5cdFx0fVxuXHRcdHRoaXMuZ2FtZUZpZWxkID0gbmV3YXJyYXk7XG5cdFx0dGhpcy5hZGRaT3JkZXJUb0dhbWVGaWVsZCgpO1xuXHRcdHRoaXMucGxheWVyLmFycmF5UG9zWSA9IHRoaXMucGxheWVyLmFycmF5UG9zWSArIDE7XG5cdFx0aWYgKHRoaXMucGxheWVyLmFycmF5UG9zWSA+PSB0aGlzLmdhbWVGaWVsZC5sZW5ndGgpIHtcblx0XHRcdHRoaXMucGxheWVyLmZhbGwoKTtcblx0XHRcdHRoaXMuZ2FtZS5nZXRDb21wb25lbnQoJ0dhbWUnKS5zdGF0ZSA9IEdhbWVTdGF0ZS5HYW1lT3Zlcjtcblx0XHR9XG5cdH0sXG5cblx0Y3JlYXRlRmlyc3RMaW5lOiBmdW5jdGlvbiBjcmVhdGVGaXJzdExpbmUoeCkge1xuXHRcdHZhciBuZXdhcnJheSA9IFtdO1xuXHRcdHZhciBidWZmZXJhcnJheSA9IHRoaXMuZ2V0TmV4dExpbmVGcm9tUHVmZmVyKCk7XG5cdFx0dmFyIGFycmF5SXRlbXMgPSB0aGlzLmdldE5leHRMaW5lRnJvbUl0ZW1QdWZmZXIoKTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYnVmZmVyYXJyYXkubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChidWZmZXJhcnJheS5sZW5ndGggJSAyID09IDApIHtcblxuXHRcdFx0XHRuZXdhcnJheVtpXSA9IHRoaXMuc3Bhd25DdWJlKHggKyBpICogZGlzdFgsIHlTcGF3blBvc2l0aW9uICsgZGlzdFkgLSBzcGF3bk9mZlNldFksIGJ1ZmZlcmFycmF5W2ldLCBhcnJheUl0ZW1zW2ldKTtcblx0XHRcdFx0bmV3YXJyYXlbaV0ub3BhY2l0eSA9IDA7XG5cdFx0XHRcdHZhciByaXNlID0gY2MubW92ZVRvKDEsIGNjLnAobmV3YXJyYXlbaV0uZ2V0UG9zaXRpb24oKS54LCB5U3Bhd25Qb3NpdGlvbiArIGRpc3RZKSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbkluKCkpO1xuXHRcdFx0XHR2YXIgZmFkZSA9IGNjLmZhZGVJbigxKTtcblx0XHRcdFx0bmV3YXJyYXlbaV0ucnVuQWN0aW9uKGNjLnNwYXduKGZhZGUsIHJpc2UpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG5ld2FycmF5W2ldID0gdGhpcy5zcGF3bkN1YmUoeCArIGkgKiBkaXN0WCwgeVNwYXduUG9zaXRpb24gKyBkaXN0WSAtIHNwYXduT2ZmU2V0WSwgYnVmZmVyYXJyYXlbaV0sIGFycmF5SXRlbXNbaV0pO1xuXHRcdFx0XHRuZXdhcnJheVtpXS5vcGFjaXR5ID0gMDtcblx0XHRcdFx0dmFyIHJpc2UgPSBjYy5tb3ZlVG8oMSwgY2MucChuZXdhcnJheVtpXS5nZXRQb3NpdGlvbigpLngsIHlTcGF3blBvc2l0aW9uICsgZGlzdFkpKS5lYXNpbmcoY2MuZWFzZUN1YmljQWN0aW9uSW4oKSk7XG5cdFx0XHRcdHZhciBmYWRlID0gY2MuZmFkZUluKDEpO1xuXHRcdFx0XHRuZXdhcnJheVtpXS5ydW5BY3Rpb24oY2Muc3Bhd24oZmFkZSwgcmlzZSkpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbmV3YXJyYXk7XG5cdH0sXG5cblx0Ly9cblx0Ly8gQWxsIHJlbGV2YW50IGRhdGEgaGFzIHRvIGJlIGxvYWRlZCBhcyBwcm9wZXJ0aWVzIHdpdGhpbiB0aGUgcHJlZmFiIGluc3RhbnRpYXRlZCBoZXJlLiEhXG5cdC8vXG5cdHNwYXduQ3ViZTogZnVuY3Rpb24gc3Bhd25DdWJlKHgsIHksIGN1YmVOdW1iZXIsIGl0ZW1OdW1iZXIpIHtcblx0XHRjYy5sb2coJ006IHNwYXduQ3ViZScpO1xuXHRcdHN3aXRjaCAoY3ViZU51bWJlcikge1xuXHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHR2YXIgbmV3Q3ViZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuRW1wdHkpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dmFyIG5ld0N1YmUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkdyYXNzKTtcblx0XHRcdFx0bmV3Q3ViZSA9IHRoaXMuc3Bhd25JdGVtKG5ld0N1YmUsIGl0ZW1OdW1iZXIpO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR2YXIgbmV3Q3ViZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuRGlydCk7XG5cdFx0XHRcdG5ld0N1YmUgPSB0aGlzLnNwYXduSXRlbShuZXdDdWJlLCBpdGVtTnVtYmVyKTtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzpcblx0XHRcdFx0bmV3Q3ViZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuVHJhcGRvb3IpO1xuXHRcdFx0XHQvL25ld0N1YmUuZ2V0Q29tcG9uZW50KCdCbG9jaycpLnNwcml0ZSA9IG5ld0N1YmU7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdHZhciBuZXdDdWJlID0gY2MuaW5zdGFudGlhdGUodGhpcy5Td2l0Y2hlcik7XG5cdFx0XHRcdG5ld0N1YmUgPSB0aGlzLnNwYXduSXRlbShuZXdDdWJlLCBpdGVtTnVtYmVyKTtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNTpcblx0XHRcdFx0dmFyIG5ld0N1YmUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLlBvaXNvbik7XG5cdFx0XHRcdG5ld0N1YmUgPSB0aGlzLnNwYXduSXRlbShuZXdDdWJlLCBpdGVtTnVtYmVyKTtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNjpcblx0XHRcdFx0dmFyIG5ld0N1YmUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLlNwaWtlKTtcblx0XHRcdFx0bmV3Q3ViZSA9IHRoaXMuc3Bhd25JdGVtKG5ld0N1YmUsIGl0ZW1OdW1iZXIpO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA3OlxuXHRcdFx0XHR2YXIgbmV3Q3ViZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuV2F0ZXJDKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR2YXIgbmV3Q3ViZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuR3Jhc3MpO1xuXHRcdFx0XHRuZXdDdWJlID0gdGhpcy5zcGF3bkl0ZW0obmV3Q3ViZSwgaXRlbU51bWJlcik7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0bmV3Q3ViZS5zZXRQb3NpdGlvbih4LCB5KTtcblxuXHRcdHRoaXMubm9kZS5hZGRDaGlsZChuZXdDdWJlKTtcblxuXHRcdHJldHVybiBuZXdDdWJlO1xuXHR9LFxuXG5cdHNwYXduSXRlbTogZnVuY3Rpb24gc3Bhd25JdGVtKHBhcmVudEJsb2NrLCBpdGVtTnVtYmVyKSB7XG5cdFx0c3dpdGNoIChpdGVtTnVtYmVyKSB7XG5cdFx0XHRjYXNlIDA6XG5cdFx0XHRcdC8vRW1wdHkvIG5vIGl0ZW1cblx0XHRcdFx0dmFyIG5ld0l0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkVtcHR5KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdC8vYW50aWRvdGVMZWZ0XG5cdFx0XHRcdHZhciBuZXdJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5BbnRpZG90ZUwpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0Ly9hbnRpZG90ZVJpZ2h0XG5cdFx0XHRcdHZhciBuZXdJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5BbnRpZG90ZVIpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzpcblx0XHRcdFx0Ly9jb2luTGVmdFxuXHRcdFx0XHR2YXIgbmV3SXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuQ29pbkwpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNDpcblx0XHRcdFx0Ly9jb2luUmlnaHRcblx0XHRcdFx0dmFyIG5ld0l0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkNvaW5SKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDU6XG5cdFx0XHRcdC8vc3RhckxlZnRcblx0XHRcdFx0dmFyIG5ld0l0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLlN0YXJMKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDY6XG5cdFx0XHRcdC8vc3RhclJpZ2h0XG5cdFx0XHRcdHZhciBuZXdJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5TdGFyUik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA3OlxuXHRcdFx0XHQvL0Jsb2NrZWRCdXNoXG5cdFx0XHRcdHZhciBuZXdJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5CbG9ja2VkQnVzaCk7XG5cdFx0XHRcdHBhcmVudEJsb2NrLmdldENvbXBvbmVudCgnQmxvY2snKS5pc0Jsb2NrZWQgPSB0cnVlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgODpcblx0XHRcdFx0Ly9CbG9ja2VkU3RvbmVcblx0XHRcdFx0dmFyIG5ld0l0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkJsb2NrZWRTdG9uZSk7XG5cdFx0XHRcdHBhcmVudEJsb2NrLmdldENvbXBvbmVudCgnQmxvY2snKS5pc0Jsb2NrZWQgPSB0cnVlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgOTpcblx0XHRcdFx0Ly9TbG93RG93biAoVG9wIEFORCBCb3R0b20pXG5cdFx0XHRcdHZhciBuZXdJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5TbG93RG93bkJvdHRvbSk7XG5cdFx0XHRcdHZhciBuZXdJdGVtMiA9IGNjLmluc3RhbnRpYXRlKHRoaXMuU2xvd0Rvd25Ub3ApO1xuXHRcdFx0XHRuZXdJdGVtLmFkZENoaWxkKG5ld0l0ZW0yKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHQvL0VtcHR5LyBubyBpdGVtXG5cdFx0XHRcdHZhciBuZXdJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5FbXB0eSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHZhciBwb3NZID0gbmV3SXRlbS5nZXRQb3NpdGlvblkoKTtcblx0XHR2YXIgcG9zWCA9IG5ld0l0ZW0uZ2V0UG9zaXRpb25YKCk7XG5cblx0XHRpZiAoZmxvYXRBYm92ZUN1YmUuaW5jbHVkZXMoaXRlbU51bWJlcikpIHtcblx0XHRcdG5ld0l0ZW0uc2V0UG9zaXRpb24ocG9zWCwgcG9zWSArIDUwKTtcblx0XHR9IGVsc2UgaWYgKHJpZ2h0T25Ub3BPZkN1YmUuaW5jbHVkZXMoaXRlbU51bWJlcikpIHtcblx0XHRcdG5ld0l0ZW0uc2V0UG9zaXRpb24ocG9zWCwgcG9zWSArIDQwKTtcblx0XHR9XG5cblx0XHRwYXJlbnRCbG9jay5nZXRDb21wb25lbnQoJ0Jsb2NrJykuaXRlbSA9IG5ld0l0ZW07XG5cdFx0cGFyZW50QmxvY2suYWRkQ2hpbGQobmV3SXRlbSk7XG5cblx0XHRyZXR1cm4gcGFyZW50QmxvY2s7XG5cdH0sXG5cblx0Z2V0TmV4dExpbmVGcm9tUHVmZmVyOiBmdW5jdGlvbiBnZXROZXh0TGluZUZyb21QdWZmZXIoKSB7XG5cdFx0dmFyIHJldCA9IFtdO1xuXHRcdGlmIChwdWZmZXJGaWVsZC5sZW5ndGggPT09IG5leHRGaXJzdExpbmUpIHtcblx0XHRcdC8vY2MubG9nKCdQdWZmZXIgYXJyYXkgaXMgZW1wdHkhJyk7XG5cdFx0XHR0aGlzLmRlZmluZU5leHRSYW5kb21BcnJheSgpO1xuXHRcdFx0cmV0ID0gcHVmZmVyRmllbGRbbmV4dEZpcnN0TGluZV07XG5cdFx0XHRuZXh0Rmlyc3RMaW5lID0gbmV4dEZpcnN0TGluZSArIDE7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vY2MubG9nKCdHZXR0aW5nIG5leHQgYXJyYXkgbGluZSBmcm8gcHVmZmVyLi4uJylcblx0XHRcdHJldCA9IHB1ZmZlckZpZWxkW25leHRGaXJzdExpbmVdO1xuXHRcdFx0bmV4dEZpcnN0TGluZSA9IG5leHRGaXJzdExpbmUgKyAxO1xuXHRcdH1cblx0XHQvL2NjLmxvZygnUmV0dXJuaW5nIG5leHQgcHVmZmVyIGFycmF5IGxpbmUsIGV4aXRpbmcgZ2V0TmV4dExpbmVGcm9tUHVmZmVyJywgcmV0KTtcblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXG5cdGdldE5leHRMaW5lRnJvbUl0ZW1QdWZmZXI6IGZ1bmN0aW9uIGdldE5leHRMaW5lRnJvbUl0ZW1QdWZmZXIoKSB7XG5cdFx0Y2MubG9nKCdNOiBnZXROZXh0TGluZUZyb21JdGVtUHVmZmVyJyk7XG5cdFx0dmFyIHJldCA9IFtdO1xuXG5cdFx0aWYgKHB1ZmZlckZpZWxkSXRlbXMubGVuZ3RoID09PSBuZXh0Rmlyc3RMaW5lSXRlbSkge1xuXHRcdFx0cmV0ID0gcHVmZmVyRmllbGRJdGVtc1tuZXh0Rmlyc3RMaW5lSXRlbV07XG5cdFx0XHRuZXh0Rmlyc3RMaW5lSXRlbSA9IG5leHRGaXJzdExpbmVJdGVtICsgMTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0ID0gcHVmZmVyRmllbGRJdGVtc1tuZXh0Rmlyc3RMaW5lSXRlbV07XG5cdFx0XHRuZXh0Rmlyc3RMaW5lSXRlbSA9IG5leHRGaXJzdExpbmVJdGVtICsgMTtcblx0XHR9XG5cdFx0cmV0dXJuIHJldDtcblx0fSxcblxuXHRkZWZpbmVOZXh0UmFuZG9tQXJyYXk6IGZ1bmN0aW9uIGRlZmluZU5leHRSYW5kb21BcnJheSgpIHtcblx0XHR2YXIgc2NvcmUgPSB0aGlzLmdhbWUuZ2V0Q29tcG9uZW50KCdHYW1lJykuc2NvcmU7XG5cblx0XHRwdWZmZXJGaWVsZCA9IFtdO1xuXHRcdHB1ZmZlckZpZWxkSXRlbXMgPSBbXTtcblxuXHRcdHZhciByYW5kID0gTWF0aC5yYW5kb20oKSAqIDEwICsgMTtcblxuXHRcdGlmIChzY29yZSA8PSAzNSkge1xuXHRcdFx0aWYgKHJhbmQgPCA0KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXSVIgV0VJU0UgTDExQyB6dScpO1xuXHRcdFx0XHRwdWZmZXJGaWVsZCA9IExldmVsLkwxMUM7XG5cdFx0XHRcdHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMTFJO1xuXHRcdFx0fSBlbHNlIGlmIChyYW5kIDwgNykge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnV0lSIFdFSVNFIEwxMkMgenUnKTtcblx0XHRcdFx0cHVmZmVyRmllbGQgPSBMZXZlbC5MMTJDO1xuXHRcdFx0XHRwdWZmZXJGaWVsZEl0ZW1zID0gTGV2ZWwuTDEySTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXSVIgV0VJU0UgTDEzQyB6dScpO1xuXHRcdFx0XHRwdWZmZXJGaWVsZCA9IExldmVsLkwxM0M7XG5cdFx0XHRcdHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMTNJO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoc2NvcmUgPD0gNzApIHtcblx0XHRcdGlmIChyYW5kIDwgNCkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnV0lSIFdFSVNFIEwyMUMgenUnKTtcblx0XHRcdFx0cHVmZmVyRmllbGQgPSBMZXZlbC5MMjFDO1xuXHRcdFx0XHRwdWZmZXJGaWVsZEl0ZW1zID0gTGV2ZWwuTDIxSTtcblx0XHRcdH0gZWxzZSBpZiAocmFuZCA8IDcpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1dJUiBXRUlTRSBMMjJDIHp1Jyk7XG5cdFx0XHRcdHB1ZmZlckZpZWxkID0gTGV2ZWwuTDIyQztcblx0XHRcdFx0cHVmZmVyRmllbGRJdGVtcyA9IExldmVsLkwyMkk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnV0lSIFdFSVNFIEwyM0MgenUnKTtcblx0XHRcdFx0cHVmZmVyRmllbGQgPSBMZXZlbC5MMjNDO1xuXHRcdFx0XHRwdWZmZXJGaWVsZEl0ZW1zID0gTGV2ZWwuTDIzSTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHJhbmQgPCA0KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXSVIgV0VJU0UgTDMxQyB6dScpO1xuXHRcdFx0XHRwdWZmZXJGaWVsZCA9IExldmVsLkwzMUM7XG5cdFx0XHRcdHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMzFJO1xuXHRcdFx0fSBlbHNlIGlmIChyYW5kIDwgNykge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnV0lSIFdFSVNFIEwzMkMgenUnKTtcblx0XHRcdFx0cHVmZmVyRmllbGQgPSBMZXZlbC5MMzJDO1xuXHRcdFx0XHRwdWZmZXJGaWVsZEl0ZW1zID0gTGV2ZWwuTDMySTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXSVIgV0VJU0UgTDMzQyB6dScpO1xuXHRcdFx0XHRwdWZmZXJGaWVsZCA9IExldmVsLkwzM0M7XG5cdFx0XHRcdHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMzNJO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRuZXh0Rmlyc3RMaW5lID0gMDtcblx0XHRuZXh0Rmlyc3RMaW5lSXRlbSA9IDA7XG5cdH0sXG5cblx0YWRkWk9yZGVyVG9HYW1lRmllbGQ6IGZ1bmN0aW9uIGFkZFpPcmRlclRvR2FtZUZpZWxkKCkge1xuXHRcdHZhciBjb3VudCA9IDE7XG5cdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLmdhbWVGaWVsZC5sZW5ndGg7IHkrKykge1xuXHRcdFx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmdhbWVGaWVsZFt5XS5sZW5ndGg7IHgrKykge1xuXHRcdFx0XHR0aGlzLmdhbWVGaWVsZFt5XVt4XS5zZXRMb2NhbFpPcmRlcihjb3VudCk7XG5cdFx0XHRcdGNvdW50Kys7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cbn0pO1xuLypcclxuIGluaXRpYWxpemVGaWVsZDI6IGZ1bmN0aW9uKHgseSl7XHJcbiB0aGlzLmdhbWVGaWVsZCA9IFt4XTtcclxuIGZvciAodmFyIGggPSAwOyBoIDwgeDsgaCsrKSB7IC8vY3JlYXRlIGFycmF5IHdpdGggdW5ldmVuIHJvd3NcclxuIGlmKGglMj09PTEpe1xyXG4gdGhpcy5nYW1lRmllbGRbaF0gPSBbeS0xXTsgLy91bmV2ZW5cclxuIH0gZWxzZSB7XHJcbiB0aGlzLmdhbWVGaWVsZFtoXSA9IFt5XTtcclxuIH1cclxuIH1cclxuXG4gZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdhbWVGaWVsZC5sZW5ndGg7IGkrKykge1xyXG4gZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLmdhbWVGaWVsZFtpXS5sZW5ndGg7IGorKykge1xyXG4gaWYodGhpcy5nYW1lRmllbGRbaV0ubGVuZ3RoJTI9PT0xKXsgLy8gZXZlbiBhcnJheS9yb3dcclxuIG5ld0N1YmUgPSB0aGlzLnNwYXduQ3ViZShzdGFydFgrKHgqZGlzdFgpLCBzdGFydFktKGRpc3RZKnkpLCBzdGFydEZpZWxkMltpXVtqXSk7XHJcbiB9XHJcbiBlbHNleyAvLyB1bmV2ZW4gYXJyYXkvcm93XHJcbiBuZXdDdWJlID0gdGhpcy5zcGF3bkN1YmUoc3RhcnRYKyh4KmRpc3RYKS0oZGlzdFgvMiksIHN0YXJ0WS0oZGlzdFkqeSksIHN0YXJ0RmllbGQyW2ldW2pdKTtcclxuIH1cclxuIHRoaXMuZ2FtZUZpZWxkW2ldW2pdID0gbmV3Q3ViZTsgLy9UT0RPIGFkZCBibG9ja3Mgbm90IG51bWJlcnNcclxuIH1cclxuIH1cclxuXG5cbiBjYy5sb2coXCJGaWVsZDpcIik7XHJcbiBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZ2FtZUZpZWxkLmxlbmd0aDsgaSsrKSB7XHJcbiBjYy5sb2codGhpcy5nYW1lRmllbGRbaV0uam9pbihcIlJvdzogXCIraStcIiBcIikpO1xyXG4gfVxyXG4gfSxcclxuXG4gYWRkRmlyc3RGaWVsZFJvdzogZnVuY3Rpb24ocm93KXtcclxuIHRoaXMuZmllbGQudW5zaGlmdChyb3cpO1xyXG4gfSxcclxuXG4gcmVtb3ZlTGFzdEZpZWxkUm93OiBmdW5jdGlvbigpe1xyXG4gdGhpcy5maWVsZC5wb3AoKTtcclxuIH0sXHJcblxuIGFkZEZpZWxkUm93IDogZnVuY3Rpb24oaW5kZXgsIHJvdyl7XHJcbiB0aGlzLmZpZWxkW2luZGV4XSA9IHJvdztcclxuIH0sXHJcblxuIHJlbW92ZUZpZWxkUm93IDogZnVuY3Rpb24oaW5kZXgpe1xyXG4gdmFyIHRlbXAgPSBbdGhpcy5ncmlkU2l6ZVhdO1xyXG4gZm9yKHZhciBoID0gMDsgaCA8IHRoaXMuZ3JpZFNpemVYOyBoKyspe1xyXG4gdGVtcFtoXSA9IHRoaXMuZmllbGRbaF07XHJcbiB9XHJcblxuIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmdyaWRTaXplWDsgaSsrKXtcclxuIGlmKGkgIT0gMCl7XHJcbiB2YXIgbmV3aW5kZXggPSBpLTE7XHJcbiBjYy5sb2coXCJJbmQ6IFwiK25ld2luZGV4KTtcclxuIHRoaXMuZmllbGRbaV0gPSB0ZW1wW25ld2luZGV4XTtcclxuIH1cclxuIH1cclxuIH0sXHJcblxuIGdlbmVyYXRlUm93IDogZnVuY3Rpb24oKXtcclxuIHZhciBpID0gdGhpcy5ncmlkU2l6ZVgrdGhpcy5jb3VudDtcclxuIHRoaXMuY291bnQrKztcclxuIHJldHVybiBbaSxpLGksaSxpXTtcclxuIC8vVE9ETzogbG9hZCBhIHJvdyBmcm9tIHRpbGVkIGZpbGUgcmV0dXJuIGFycmF5XHJcbiB9LCovXG5cbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMDc2ZWYrQ2JxVkNGSy9ROXNjckw4VWknLCAnR2FtZScpO1xuLy8gc2NyaXB0c1xcR2FtZS5qc1xuXG4vL0dhbWVcbi8vIEltcG9ydHNcbnZhciBHYW1lU3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5HYW1lU3RhdGU7XG52YXIgUGxheWVyTW92ZW1lbnRTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLlBsYXllck1vdmVtZW50U3RhdGU7XG52YXIgU3RlcCA9IHJlcXVpcmUoJ1R5cGVzJykuQmxvY2tUeXBlO1xuXG52YXIgd2hpY2hTdGVwID0gU3RlcC5Ob25lO1xudmFyIHVwZGF0ZUFjY2VzcyA9IHRydWU7XG52YXIgb25TdGVwcEtpbGxzID0gZmFsc2U7XG52YXIga2lsbEFjdGlvbkV4ZWN1dGVkID0gZmFsc2U7XG52YXIgcHJlc3NEb3VibGUgPSAwO1xuXG4vL2Rpc2FibGVzIHRoZSBhbnRpYWxpYXNpbmcsIGJlY2F1c2UgaXQgZGVzdHJveXMgdGhlIHBpeGVsYXJ0XG52YXIgX19jY1RleHR1cmUyRF9oYW5kbGVMb2FkZWRUZXh0dXJlID0gY2MuVGV4dHVyZTJELnByb3RvdHlwZS5oYW5kbGVMb2FkZWRUZXh0dXJlO1xuY2MuVGV4dHVyZTJELnByb3RvdHlwZS5oYW5kbGVMb2FkZWRUZXh0dXJlID0gZnVuY3Rpb24gKCkge1xuICAgIF9fY2NUZXh0dXJlMkRfaGFuZGxlTG9hZGVkVGV4dHVyZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHRoaXMuc2V0QWxpYXNUZXhQYXJhbWV0ZXJzKCk7XG59O1xuXG52YXIgcHJlc3NDb3VudCA9IDA7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc3RhdGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogR2FtZVN0YXRlLk5vbmUsXG4gICAgICAgICAgICB0eXBlOiBHYW1lU3RhdGVcbiAgICAgICAgfSxcbiAgICAgICAgLy8gR2FtZSBEYXRhL09iamVjdHNcbiAgICAgICAgZ2FtZWZpZWxkOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgcGxheWVyOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gR2FtZS1VSVxuICAgICAgICBzY29yZUxhYmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuXG4gICAgICAgIG11bHRpcGxpZXJMYWJlbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBNdXNpYyBUaGVtZVxuICAgICAgICB0aGVtZXVybDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgLy90aGlzLnNldEZyYW1lUmF0ZSg2MCk7XG4gICAgICAgIHRoaXMuc3RvcmFnZSA9IGNjLnN5cy5sb2NhbFN0b3JhZ2U7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBHYW1lU3RhdGUuV2FpdGluZztcbiAgICAgICAgLy90aGlzLkdhbWVTdGF0ZSA9IEdhbWVTdGF0ZTtcbiAgICAgICAgdGhpcy5pbml0YWxpemVJbnB1dENvbnRyb2woKTsgLy8gQWN0aXZhdGUgaW5wdXQgaGFuZGxpbmdcblxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5TXVzaWModGhpcy50aGVtZXVybCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuc3RvcmFnZS5zZXRJdGVtKCdzY29yZScsIDApO1xuXG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgICAgICB0aGlzLnNjb3JlTXVsdGlwbGllciA9IDE7XG4gICAgICAgIHRoaXMubXVsdGlwbGllckFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuc3RlcHBlZEJsb2NrID0gbnVsbDtcbiAgICB9LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KCkge30sXG5cbiAgICAvLyBDYWxsZWQgd2hlbiBwbGF5ZXIgb25Mb2FkKCkgaGFzIGZpbmlzaGVkXG4gICAgb25QbGF5ZXJMb2FkQ2FsbGJhY2s6IGZ1bmN0aW9uIG9uUGxheWVyTG9hZENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmdhbWVmaWVsZC5wbGF5ZXIgPSB0aGlzLnBsYXllcjtcblxuICAgICAgICAvLyBQbGF5ZXIgaXMgYXNzZW1ibGVkLiBzZXQgYWxsIG5lZWRlZCBncmFwaGljYWwgaW5mb3JtYXRpb25cbiAgICAgICAgLy90aGlzLnBsYXllci5ub2RlLnNldFBvc2l0aW9uKHRoaXMuZ2FtZWZpZWxkLmdldFN0YXJ0UG9zaXRpb24oKSk7XG4gICAgICAgIHRoaXMuZ2FtZWZpZWxkLnNldFBsYXllclN0YXJ0KHRoaXMucGxheWVyKTtcbiAgICAgICAgdGhpcy5wbGF5ZXIubm9kZS5zZXRMb2NhbFpPcmRlcigxMDAwKTtcbiAgICAgICAgdGhpcy5wbGF5ZXIuZHggPSB0aGlzLmdhbWVmaWVsZC5kaXNUWCAvIDI7IC8vb25seSBoYWxmIHRoZSBkaXN0YW5jZSBvbiB4ISFcbiAgICAgICAgdGhpcy5wbGF5ZXIuZHkgPSB0aGlzLmdhbWVmaWVsZC5kaXNUWTtcbiAgICB9LFxuXG4gICAgLy8gQ2FsbGVkIHdoZW4gZ2FtZWZpZWxkIGlzIGluaXRhbGl6ZWQgKCBvbkxvYWQoKSBoYXMgZmluaXNoZWQgKVxuICAgIG9uR2FtZUZpZWxkTG9hZENhbGxiYWNrOiBmdW5jdGlvbiBvbkdhbWVGaWVsZExvYWRDYWxsYmFjaygpIHt9LFxuXG4gICAgdmFsaWRhdGVNb3ZlOiBmdW5jdGlvbiB2YWxpZGF0ZU1vdmUoZGlyKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IEdhbWVTdGF0ZS5HYW1lT3Zlcikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucGxheWVyLm1vdmVzdGF0ZSA9PT0gUGxheWVyTW92ZW1lbnRTdGF0ZS5KdW1waW5nIHx8IHRoaXMucGxheWVyLm1vdmVzdGF0ZSA9PT0gUGxheWVyTW92ZW1lbnRTdGF0ZS5GYWxsaW5nKSB7XG4gICAgICAgICAgICAvL1BsYXllciBhbHJlYWR5IGp1bXBpbmcvZmFsbGluZyAtPiBuZWdsZWN0IGlucHV0XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBIYW5kbGUgc3dhcGVkIGNhc2VcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmlzU3dhcGVkKSB7XG4gICAgICAgICAgICBkaXIgPSAtZGlyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSGFuZGxlIHNsb3dlZCBjYXNlXG4gICAgICAgIGlmICh0aGlzLnBsYXllci5pc1Nsb3dlZCkge1xuICAgICAgICAgICAgcHJlc3NDb3VudCsrO1xuICAgICAgICAgICAgaWYgKHByZXNzQ291bnQgPCAzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcmVzc0NvdW50ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5pc1Nsb3dlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kZXN0ZmllbGQgPSB0aGlzLmdhbWVmaWVsZC5nZXRKdW1wRmllbGQoZGlyKTtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5kZXN0ZmllbGQpO1xuICAgICAgICB2YXIgc3RlcHBlZEJsb2NrID0gdGhpcy5kZXN0ZmllbGQuZ2V0Q29tcG9uZW50KCdCbG9jaycpO1xuICAgICAgICBjb25zb2xlLmxvZyhzdGVwcGVkQmxvY2spO1xuICAgICAgICBpZiAoc3RlcHBlZEJsb2NrLmlzQmxvY2tlZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGxheWVyLmlzU3dhcGVkID0gZmFsc2U7XG5cbiAgICAgICAgLy9cbiAgICAgICAgLy9Nb3ZlIHdhcyBjb3JyZWN0LlxuICAgICAgICAvL1xuICAgICAgICAvL0NoYW5nZSBwbGF5ZXIgZGlyZWN0aW9uXG4gICAgICAgIGlmICh0aGlzLnBsYXllci5kaXIgIT0gZGlyKSB0aGlzLmFuaW1hdGlvbk5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5wbGF5ZXIuZGlyID0gZGlyO1xuICAgICAgICB0aGlzLmluY3JlbWVudFNjb3JlKDEpO1xuICAgICAgICB0aGlzLnNjb3JlTGFiZWwuc3RyaW5nID0gdGhpcy5zY29yZS50b1N0cmluZygpO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICBpbml0YWxpemVJbnB1dENvbnRyb2w6IGZ1bmN0aW9uIGluaXRhbGl6ZUlucHV0Q29udHJvbCgpIHtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKHtcbiAgICAgICAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLktFWUJPQVJELFxuXG4gICAgICAgICAgICBvbktleVByZXNzZWQ6IGZ1bmN0aW9uIG9uS2V5UHJlc3NlZChrZXlDb2RlLCBldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLnN0YXRlID09IEdhbWVTdGF0ZS5QYXVzZWQpIHJldHVybjtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkuYTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLnN0YXRlID09PSBHYW1lU3RhdGUuV2FpdGluZykgc2VsZi5zdGF0ZSA9IEdhbWVTdGF0ZS5QbGF5aW5nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi52YWxpZGF0ZU1vdmUoMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnBsYXllci5tb3ZlKHNlbGYuZGVzdGZpZWxkLCBzZWxmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmdhbWVmaWVsZC51cGRhdGVQbGF5ZXJBcnJheVBvcygpOyAvLyBDaGFuZ2UgYXJyYXkgcG9zaXRpb24gYWZ0ZXIganVtcCBvciBidWdzIHdpbGwgc3Bhd25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5wbGF5ZXIub2xkRGVzdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucGxheWVyLm9sZERlc3QuZ2V0Q29tcG9uZW50KCdCbG9jaycpLnBsYXllck9uVG9wID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLmQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5zdGF0ZSA9PT0gR2FtZVN0YXRlLldhaXRpbmcpIHNlbGYuc3RhdGUgPSBHYW1lU3RhdGUuUGxheWluZztcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYudmFsaWRhdGVNb3ZlKC0xKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucGxheWVyLm1vdmUoc2VsZi5kZXN0ZmllbGQsIHNlbGYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ2FtZWZpZWxkLnVwZGF0ZVBsYXllckFycmF5UG9zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYucGxheWVyLm9sZERlc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnBsYXllci5vbGREZXN0LmdldENvbXBvbmVudCgnQmxvY2snKS5wbGF5ZXJPblRvcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS51OlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5nYW1lZmllbGQudXBkYXRlRmllbGQoLTEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5rOlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wbGF5ZXIua2lsbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLmVzY2FwZTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmxvZyhcIkVzY2FwZSBwcmVzc2VkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogd2hhdCB0byBkbyBvbiBlc2NhcGVkLXByZXNzZWQ/XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkuZjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucGxheWVyLmZhbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIG9uS2V5UmVsZWFzZWQ6IGZ1bmN0aW9uIG9uS2V5UmVsZWFzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkuYTpcblxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLmQ6XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgc2VsZi5ub2RlKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdNOiB1cGRhdGUnKTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IEdhbWVTdGF0ZS5QbGF5aW5nKSB7XG4gICAgICAgICAgICB0aGlzLm1vdmVGaWVsZFdpdGhQbGF5ZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gR2FtZVN0YXRlLkdhbWVPdmVyKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0SXRlbSgnc2NvcmUnLCB0aGlzLnNjb3JlKTtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnR2FtZU92ZXJTY2VuZScpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IEdhbWVTdGF0ZS5Mb2FkaW5nO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG1vdmVGaWVsZFdpdGhQbGF5ZXI6IGZ1bmN0aW9uIG1vdmVGaWVsZFdpdGhQbGF5ZXIoKSB7XG4gICAgICAgIHZhciB5U3BlZWQgPSB0aGlzLnBsYXllci5hcnJheVBvc1k7XG4gICAgICAgIC8vIGNjLmxvZygnUGxheWVycG9zJywgeVNwZWVkKTtcbiAgICAgICAgaWYgKHVwZGF0ZUFjY2Vzcykge1xuICAgICAgICAgICAgLy9jYy5sb2coJ1VQREFURS1DYXNlcyBiZXRyZXRlbicpO1xuICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gZmFsc2U7XG4gICAgICAgICAgICBzd2l0Y2ggKHlTcGVlZCkge1xuICAgICAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gdGhpcy5nYW1lZmllbGQudXBkYXRlRmllbGRQb3NpdGlvbigtMC4zKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVBY2Nlc3MgPSB0aGlzLmdhbWVmaWVsZC51cGRhdGVGaWVsZFBvc2l0aW9uKC0wLjQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUFjY2VzcyA9IHRoaXMuZ2FtZWZpZWxkLnVwZGF0ZUZpZWxkUG9zaXRpb24oLTEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUFjY2VzcyA9IHRoaXMuZ2FtZWZpZWxkLnVwZGF0ZUZpZWxkUG9zaXRpb24oLTEuNSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gdGhpcy5nYW1lZmllbGQudXBkYXRlRmllbGRQb3NpdGlvbigtMik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gdGhpcy5nYW1lZmllbGQudXBkYXRlRmllbGRQb3NpdGlvbigtNCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gdGhpcy5nYW1lZmllbGQudXBkYXRlRmllbGRQb3NpdGlvbigtOCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gdGhpcy5nYW1lZmllbGQudXBkYXRlRmllbGRQb3NpdGlvbigtMTIpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUFjY2VzcyA9IHRoaXMuZ2FtZWZpZWxkLnVwZGF0ZUZpZWxkUG9zaXRpb24oLTIwKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gdGhpcy5nYW1lZmllbGQudXBkYXRlRmllbGRQb3NpdGlvbigtMC4zKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy9cbiAgICAvLyBIRUxQSU5HIE1FVEhPRFMuIFNNQUxMIFNUVUZGXG4gICAgLy9cblxuICAgIGNoYW5nZU11bHRpcGxpZXI6IGZ1bmN0aW9uIGNoYW5nZU11bHRpcGxpZXIodmFsdWUpIHtcbiAgICAgICAgLy9UT0RPOiBTdG9wIGFuZCBzdGFydCBhY3Rpb24gYnkgdGFnXG4gICAgICAgIHRoaXMuc2NvcmVNdWx0aXBsaWVyID0gdmFsdWU7XG4gICAgICAgIHRoaXMubXVsdGlwbGllckxhYmVsLnN0cmluZyA9IFwiTXVsdGlwbGllcjogXCIgKyB0aGlzLnNjb3JlTXVsdGlwbGllcjtcbiAgICAgICAgdGhpcy5tdWx0aXBsaWVyTGFiZWwubm9kZS5vcGFjaXR5ID0gMjU1O1xuICAgICAgICB2YXIgcmVzZXRNdWx0aXBsaWVyQ2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLnJlc2V0TXVsdGlwbGllciwgdGhpcyk7XG4gICAgICAgIHRoaXMubXVsdGlwbGllckxhYmVsLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGNjLmZhZGVPdXQoNSksIHJlc2V0TXVsdGlwbGllckNhbGxiYWNrKSk7XG4gICAgfSxcblxuICAgIHJlc2V0TXVsdGlwbGllcjogZnVuY3Rpb24gcmVzZXRNdWx0aXBsaWVyKCkge1xuICAgICAgICB0aGlzLnNjb3JlTXVsdGlwbGllciA9IDA7XG4gICAgfSxcblxuICAgIGluY3JlbWVudFNjb3JlOiBmdW5jdGlvbiBpbmNyZW1lbnRTY29yZShpbmMpIHtcbiAgICAgICAgdGhpcy5zY29yZSArPSBpbmMgKiB0aGlzLnNjb3JlTXVsdGlwbGllcjtcbiAgICB9LFxuXG4gICAgLy9EZXByZWNhdGVkXG4gICAgY2hlY2tJdGVtQ29sbGlzaW9uOiBmdW5jdGlvbiBjaGVja0l0ZW1Db2xsaXNpb24oaXRlbSkge1xuICAgICAgICB2YXIgaXRlbXBvcyA9IGl0ZW0ubm9kZS5nZXRQb3NpdGlvbigpO1xuICAgICAgICB2YXIgcHBvcyA9IHRoaXMucGxheWVyLm5vZGUuZ2V0UG9zaXRpb24oKTtcbiAgICAgICAgdmFyIGRpc3QgPSBjYy5wRGlzdGFuY2UoaXRlbXBvcywgcHBvcyk7XG4gICAgICAgIGlmIChkaXN0IDwgaXRlbS5jb2xsZWN0UmFkaXVzKSB7XG4gICAgICAgICAgICBpdGVtLm9uUGlja1VwQ2FsbGJhY2sodGhpcy5wbGF5ZXIpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc2NWI5MWxsbWt4SnRKa2hxc1l6RnA3MScsICdHcmFzcycpO1xuLy8gc2NyaXB0c1xcZ2FtZWZpZWxkXFxibG9ja3NcXEdyYXNzLmpzXG5cbnZhciBCbG9ja1R5cGUgPSByZXF1aXJlKCdUeXBlcycpLkJsb2NrVHlwZTtcbnZhciBQbGF5ZXJNb3ZlbWVudFN0YXRlID0gcmVxdWlyZSgnU3RhdGVzJykuUGxheWVyTW92ZW1lbnRTdGF0ZTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpc0Jsb2NrZWQ6IGZhbHNlLFxuICAgICAgICBoYXNJdGVtOiBmYWxzZSxcblxuICAgICAgICBibG9ja3R5cGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogQmxvY2tUeXBlLk5vbmUsXG4gICAgICAgICAgICB0eXBlOiBCbG9ja1R5cGVcbiAgICAgICAgfSxcblxuICAgICAgICBpdGVtOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJPblRvcCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBvblN0ZXBDYWxsYmFjazogZnVuY3Rpb24gb25TdGVwQ2FsbGJhY2socGxheWVyLCBnYW1lKSB7XG4gICAgICAgIGNjLmxvZygnTTogb25TdGVwQ2FsbGJhY2sgR3Jhc3MnKTtcbiAgICB9LFxuXG4gICAgY29sbGlkZTogZnVuY3Rpb24gY29sbGlkZSgpIHt9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdhOWQ1ZmhNcERSQjdybndnemwwWTE5WicsICdJdGVtJyk7XG4vLyBzY3JpcHRzXFxnYW1lb2JqZWN0c1xcSXRlbS5qc1xuXG5cbnZhciBJdGVtVHlwZSA9IHJlcXVpcmUoJ1R5cGVzJykuSXRlbVR5cGU7XG52YXIgSXRlbVN0YXRlID0gcmVxdWlyZSgnU3RhdGVzJykuSXRlbVN0YXRlO1xudmFyIEl0ZW1BY3Rpdml0eVN0YXRlID0gcmVxdWlyZSgnU3RhdGVzJykuSXRlbUFjdGl2aXR5U3RhdGU7XG5cbnZhciByaXNlWSA9IDUwO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGl0ZW10eXBlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IEl0ZW1UeXBlLk5vbmUsXG4gICAgICAgICAgICB0eXBlOiBJdGVtVHlwZVxuICAgICAgICB9LFxuXG4gICAgICAgIGl0ZW1zdGF0ZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBJdGVtU3RhdGUuUGlja2FibGUsXG4gICAgICAgICAgICB0eXBlOiBJdGVtU3RhdGVcbiAgICAgICAgfSxcblxuICAgICAgICBhY3Rpdml0eXN0YXRlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IEl0ZW1BY3Rpdml0eVN0YXRlLklkbGUsXG4gICAgICAgICAgICB0eXBlOiBJdGVtQWN0aXZpdHlTdGF0ZVxuICAgICAgICB9LFxuXG4gICAgICAgIGNvbGxlY3RSYWRpdXM6IDAsXG4gICAgICAgIGl0ZW1WYWx1ZTogMCwgLy8gVmFsdWUgb2YgdGhlIGl0ZW0gd2hlbiBwaWNrZWQgdXAocHVyZSBzY29yZSwgc2NvcmUgbXVsdGlwbGllcilcbiAgICAgICAgaXRlbVRpbWVyOiAwLFxuXG4gICAgICAgIGFjdGl2YXRpb25zb3VuZDogeyAvLyBEcmFnIHJpZ2h0IGF1ZGlvIGhlcmUuXG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG5cbiAgICBkZXN0cm95SXRlbTogZnVuY3Rpb24gZGVzdHJveUl0ZW0oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSXRlbXR5cGUgdG8gZGVzdHJveTogXCIgKyB0aGlzLml0ZW10eXBlLnRvU3RyaW5nKCkpO1xuICAgICAgICBjb25zb2xlLmxvZyhJdGVtVHlwZVt0aGlzLml0ZW10eXBlXSk7XG4gICAgICAgIHN3aXRjaCAodGhpcy5pdGVtdHlwZSkge1xuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5TbG93ZXI6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkFudGlkb3RlOlxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Db2luOlxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5TdGFyOlxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25QaWNrVXBDYWxsYmFjazogZnVuY3Rpb24gb25QaWNrVXBDYWxsYmFjayhwbGF5ZXIsIGdhbWUpIHtcbiAgICAgICAgdGhpcy5pdGVtc3RhdGUgPSBJdGVtU3RhdGUuUGlja2VkO1xuICAgICAgICB0aGlzLmFjdGl2aXR5c3RhdGUgPSBJdGVtQWN0aXZpdHlTdGF0ZS5BY3RpdmU7XG4gICAgICAgIC8vIFBlcmZvcm0gdGhlIGFjdGlvbiB0aGUgaXRlbSBwcm9kdWNlcyhjaGFuZ2UgcGxheWVyIG9yIGVudmlyb25tZW50KVxuICAgICAgICBzd2l0Y2ggKHRoaXMuaXRlbXR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuQW50aWRvdGU6XG4gICAgICAgICAgICAgICAgcGxheWVyLmlzUG9pc29uZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIucG9pc29uVG1wID0gcGxheWVyLnBvaXNvblRpbWVyOyAvL3Jlc2V0IHRpbW1lclxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Db2luOlxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdHQU1FOiAnLCBnYW1lLm5hbWUpO1xuICAgICAgICAgICAgICAgIGdhbWUuaW5jcmVtZW50U2NvcmUoNSk7XG4gICAgICAgICAgICAgICAgZ2FtZS5zY29yZUxhYmVsLnN0cmluZyA9IGdhbWUuc2NvcmUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuU3RhcjpcbiAgICAgICAgICAgICAgICBwbGF5ZXIuaXNQb2lzb25lZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHBsYXllci5pc0ludmluY2libGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5TbG93ZXI6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTRVQgU1dBUEVEIFRSVUVcIik7XG4gICAgICAgICAgICAgICAgcGxheWVyLmlzU2xvd2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGlja2VkQ2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLnBpY2tlZCwgdGhpcyk7XG4gICAgICAgIHZhciBzb3VuZGNhbGxiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5wbGF5U291bmQsIHRoaXMpO1xuICAgICAgICAvLyBQZXJmb3JtIGl0ZW0gYW5pbWF0aW9uIGFuZCBkZXN0cm95IGl0XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2Muc3Bhd24odGhpcy5hc3NlbWJsZVBpY2tVcEFjdGlvbigpLCBzb3VuZGNhbGxiYWNrKSwgcGlja2VkQ2FsbGJhY2spKTtcbiAgICB9LFxuXG4gICAgYXNzZW1ibGVQaWNrVXBBY3Rpb246IGZ1bmN0aW9uIGFzc2VtYmxlUGlja1VwQWN0aW9uKCkge1xuICAgICAgICB0aGlzLmFjdGl2aXR5c3RhdGUgPSBJdGVtQWN0aXZpdHlTdGF0ZS5BY3RpdmU7XG4gICAgICAgIC8vIFJpc2UtQW5pbWF0aW9uIGZvciBpdGVtcyB0byBzaG93IHRoZXkgaGF2ZSBiZWVuIHBpY2tlZCB1cCAgICAgICBcbiAgICAgICAgdmFyIHJpc2VQb2ludCA9IGNjLnAodGhpcy5ub2RlLmdldFBvc2l0aW9uWCgpLCB0aGlzLm5vZGUuZ2V0UG9zaXRpb25ZKCkgKyByaXNlWSk7XG4gICAgICAgIHZhciBmYWRlID0gY2MuZmFkZU91dCh0aGlzLmdldEl0ZW1BbmltYXRpb25UaW1lKCkpOyAvLyBMZXQgaXRlbSBmYWRlIGR1cmluZyBhbmltYXRpb25cbiAgICAgICAgdmFyIGFuaW0gPSBudWxsO1xuICAgICAgICAvL1JlbW92ZSBzaGFkb3dzXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMubm9kZS5jaGlsZHJlbjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY2hpbGRyZW5baV0uZGVzdHJveSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLml0ZW10eXBlKSB7XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlN0YXI6XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkNvaW46XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkFudGlkb3RlOlxuICAgICAgICAgICAgICAgIGFuaW0gPSBjYy5tb3ZlQnkodGhpcy5nZXRJdGVtQW5pbWF0aW9uVGltZSgpLCByaXNlUG9pbnQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYy5zcGF3bihmYWRlLCBhbmltKTtcbiAgICB9LFxuXG4gICAgZ2V0SXRlbUFuaW1hdGlvblRpbWU6IGZ1bmN0aW9uIGdldEl0ZW1BbmltYXRpb25UaW1lKHR5cGUpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLml0ZW10eXBlKSB7XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkFudGlkb3RlOlxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5Db2luOlxuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5TdGFyOlxuICAgICAgICAgICAgICAgIHJldHVybiAxLjU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcGlja2VkOiBmdW5jdGlvbiBwaWNrZWQoKSB7XG5cbiAgICAgICAgdGhpcy5hY3Rpdml0eXN0YXRlID0gSXRlbUFjdGl2aXR5U3RhdGUuRXhwaXJlZDtcbiAgICAgICAgdGhpcy5kZXN0cm95SXRlbSgpO1xuICAgIH0sXG5cbiAgICBwbGF5U291bmQ6IGZ1bmN0aW9uIHBsYXlTb3VuZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZhdGlvbnNvdW5kICE9PSBudWxsKSBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuYWN0aXZhdGlvbnNvdW5kLCBmYWxzZSk7XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnN2M0NWV0SUdVdEJDNVZia0FKSjJVQ1QnLCAnTGV2ZWwnKTtcbi8vIHNjcmlwdHNcXGdhbWVmaWVsZFxcTGV2ZWwuanNcblxuLy9MZXZlbFxudmFyIEwxMUMgPSBbWzcsIDEsIDEsIDYsIDEsIDEsIDddLCBbNywgMSwgMSwgMSwgMSwgN10sIFs3LCA3LCAxLCA2LCAxLCA3LCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddLCBbNywgNywgMSwgNiwgMSwgNywgN10sIFs3LCAxLCAxLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDYsIDEsIDEsIDddLCBbNywgNiwgMSwgMSwgNiwgN11dO1xuXG52YXIgTDExSSA9IFtbMCwgOCwgMCwgMCwgMCwgOCwgMF0sIFswLCA4LCAwLCAwLCA4LCAwXSwgWzAsIDAsIDgsIDAsIDgsIDAsIDBdLCBbMCwgOCwgMCwgMCwgOCwgMF0sIFswLCAwLCA4LCAwLCA4LCAwLCAwXSwgWzAsIDgsIDAsIDAsIDgsIDBdLCBbMCwgOCwgMCwgMCwgMCwgOCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwXV07XG5cbnZhciBMMTJDID0gW1s3LCAxLCAxLCAxLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddLCBbNywgMSwgMSwgMSwgMSwgMSwgN10sIFs3LCAxLCAxLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDEsIDEsIDQsIDddLCBbNywgMSwgMSwgMSwgMSwgN10sIFs3LCAxLCAxLCAzLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddXTtcblxudmFyIEwxMkkgPSBbWzAsIDQsIDcsIDAsIDAsIDAsIDBdLCBbMCwgNCwgNywgMCwgMCwgMF0sIFswLCA0LCA0LCA3LCAwLCAwLCAwXSwgWzAsIDQsIDQsIDcsIDksIDBdLCBbMCwgNCwgNCwgNCwgNywgMCwgMF0sIFswLCAwLCAwLCAwLCA2LCAwXSwgWzAsIDAsIDcsIDAsIDcsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF1dO1xuXG52YXIgTDEzQyA9IFtbNywgMSwgNSwgMSwgMSwgMSwgN10sIFs3LCA2LCAxLCAxLCAxLCA3XSwgWzcsIDEsIDcsIDEsIDEsIDEsIDddLCBbNywgMSwgNywgMSwgMSwgN10sIFs3LCAxLCAxLCA3LCAxLCAxLCA3XSwgWzcsIDEsIDEsIDcsIDYsIDddLCBbNywgMSwgMSwgNywgMSwgMSwgN10sIFs3LCAxLCA3LCAxLCAxLCA3XV07XG5cbnZhciBMMTNJID0gW1swLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDQsIDcsIDAsIDBdLCBbMCwgOSwgMCwgNCwgMCwgNywgMF0sIFswLCA5LCAwLCA0LCAwLCAwXSwgWzAsIDAsIDAsIDAsIDQsIDAsIDBdLCBbMCwgMCwgMSwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDIsIDAsIDBdXTtcblxudmFyIEwyMUMgPSBbWzcsIDIsIDIsIDIsIDIsIDIsIDddLCBbNywgMiwgMiwgMiwgMiwgN10sIFs3LCAyLCAyLCAyLCAyLCAyLCA3XSwgWzcsIDIsIDIsIDIsIDIsIDddLCBbNywgNywgMiwgMiwgMiwgNywgN10sIFs3LCA2LCA2LCA2LCA2LCA3XSwgWzcsIDIsIDIsIDIsIDIsIDIsIDddLCBbNywgMiwgMiwgMiwgMiwgN11dO1xuXG52YXIgTDIxSSA9IFtbMCwgNywgMCwgNywgNCwgNywgMF0sIFswLCA3LCAzLCAwLCA3LCAwXSwgWzAsIDcsIDAsIDcsIDMsIDcsIDBdLCBbMCwgOSwgNywgNywgOSwgMF0sIFswLCAwLCA5LCA0LCA5LCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgOSwgNywgNiwgNywgOSwgMF0sIFswLCA5LCA5LCA5LCA5LCAwXV07XG5cbnZhciBMMjJDID0gW1s3LCA0LCA0LCA3LCA0LCA0LCA3XSwgWzcsIDQsIDcsIDcsIDIsIDddLCBbNywgNywgMiwgNywgNCwgNywgN10sIFs3LCA0LCA3LCA3LCA0LCA3XSwgWzcsIDcsIDQsIDcsIDIsIDcsIDddLCBbNywgNCwgNywgNywgNCwgN10sIFs3LCA3LCAyLCA3LCA0LCA3LCA3XSwgWzcsIDQsIDcsIDcsIDQsIDddXTtcblxudmFyIEwyMkkgPSBbWzAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgNCwgMF0sIFswLCAwLCA0LCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgNCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDQsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF1dO1xuXG52YXIgTDIzQyA9IFtbNywgMiwgMiwgMiwgMiwgMiwgN10sIFs3LCA1LCA1LCA1LCA1LCA3XSwgWzcsIDMsIDIsIDIsIDIsIDMsIDddLCBbNywgMywgMiwgMiwgMywgN10sIFs3LCAzLCAzLCAyLCAyLCAyLCA3XSwgWzcsIDMsIDIsIDMsIDIsIDddLCBbNywgMywgMiwgMywgMywgMiwgN10sIFs3LCAyLCAyLCAzLCAyLCA3XV07XG5cbnZhciBMMjNJID0gW1swLCA5LCA5LCA2LCA5LCA5LCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgOSwgMywgOSwgMCwgMF0sIFswLCAwLCAwLCAzLCAwLCAwXSwgWzAsIDAsIDAsIDksIDMsIDAsIDBdLCBbMCwgMCwgMiwgMCwgMywgMF0sIFswLCAwLCAwLCAwLCAwLCAzLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdXTtcblxudmFyIEwzMUMgPSBbWzcsIDMsIDUsIDMsIDUsIDMsIDddLCBbNywgNCwgMywgMywgNCwgN10sIFs3LCAzLCA2LCAzLCA2LCAzLCA3XSwgWzcsIDMsIDQsIDQsIDMsIDddLCBbNywgMywgMywgNiwgMywgMywgN10sIFs3LCAzLCAyLCA0LCAzLCA3XSwgWzcsIDMsIDQsIDMsIDYsIDMsIDddLCBbNywgMywgMiwgMywgMiwgN11dO1xuXG52YXIgTDMxSSA9IFtbMCwgNCwgMCwgNCwgMCwgMCwgMF0sIFswLCAwLCA0LCA0LCAwLCAwXSwgWzAsIDQsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMiwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAxLCAwLCAwXSwgWzAsIDAsIDIsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCA0LCAwLCAwLCAzLCAwXV07XG5cbnZhciBMMzJDID0gW1s3LCA3LCAyLCA3LCAyLCA3LCA3XSwgWzcsIDYsIDcsIDcsIDYsIDddLCBbNywgNywgNCwgMywgNCwgNywgN10sIFs3LCA1LCA2LCA2LCA1LCA3XSwgWzcsIDYsIDcsIDIsIDcsIDYsIDddLCBbNywgNCwgNywgNiwgNCwgN10sIFs3LCA3LCAyLCA3LCAyLCA3LCA3XSwgWzcsIDMsIDIsIDcsIDIsIDddXTtcblxudmFyIEwzMkkgPSBbWzAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgNCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDQsIDksIDAsIDAsIDAsIDBdLCBbMCwgMiwgMSwgMCwgMSwgMF1dO1xuXG52YXIgTDMzQyA9IFtbNywgMSwgNiwgMSwgNiwgMSwgN10sIFs3LCAxLCAzLCAxLCAzLCA3XSwgWzcsIDYsIDEsIDYsIDEsIDYsIDddLCBbNywgMSwgNCwgNCwgMSwgN10sIFs3LCA1LCAzLCA2LCAzLCA1LCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddLCBbNywgMSwgMSwgMSwgMSwgMSwgN10sIFs3LCAxLCAxLCAxLCAxLCA3XV07XG5cbnZhciBMMzNJID0gW1swLCAwLCAzLCAwLCA0LCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgNCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgOSwgOSwgOSwgOSwgMF0sIFswLCA5LCA5LCA5LCA5LCA5LCAwXSwgWzAsIDAsIDEsIDIsIDAsIDBdXTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgTDExQzogTDExQyxcbiAgICBMMTFJOiBMMTFJLFxuICAgIEwxMkM6IEwxMkMsXG4gICAgTDEySTogTDEySSxcbiAgICBMMTNDOiBMMTNDLFxuICAgIEwxM0k6IEwxM0ksXG4gICAgTDIxQzogTDIxQyxcbiAgICBMMjFJOiBMMjFJLFxuICAgIEwyMkM6IEwyMkMsXG4gICAgTDIySTogTDIySSxcbiAgICBMMjNDOiBMMjNDLFxuICAgIEwyM0k6IEwyM0ksXG4gICAgTDMxQzogTDMxQyxcbiAgICBMMzFJOiBMMzFJLFxuICAgIEwzMkM6IEwzMkMsXG4gICAgTDMySTogTDMySSxcbiAgICBMMzNDOiBMMzNDLFxuICAgIEwzM0k6IEwzM0lcbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcxMDkxNWt5K2pCRnJJc0FFL2xueVdxTicsICdNZW51QnV0dG9uQ2FsbGJhY2tzJyk7XG4vLyBzY3JpcHRzXFxzY2VuZXNjcmlwdHNcXE1lbnVCdXR0b25DYWxsYmFja3MuanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIGJ1dHRvbkF1ZGlvOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG5cbiAgICBzdGFydENvbnRyb2xDYWxsYmFjazogZnVuY3Rpb24gc3RhcnRDb250cm9sQ2FsbGJhY2soKSB7XG4gICAgICAgIHZhciBvbkxhdW5jaGVkID0gZnVuY3Rpb24gb25MYXVuY2hlZCgpIHtcbiAgICAgICAgICAgIC8vdXNlIHRoaXMgZm9yIGNhbGxiYWNrcyBvbiBsb2FkaW5nXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU2NlbmUgbGF1bmNoZWQnKTtcbiAgICAgICAgfTtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdHYW1lU2NlbmUnLCBvbkxhdW5jaGVkKTtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmJ1dHRvbkF1ZGlvLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIGFib3V0Q29udHJvbENhbGxiYWNrOiBmdW5jdGlvbiBhYm91dENvbnRyb2xDYWxsYmFjaygpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdBYm91dCcpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuYnV0dG9uQXVkaW8sIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgdHV0b3JpYWxDb250cm9sQ2FsbGJhY2s6IGZ1bmN0aW9uIHR1dG9yaWFsQ29udHJvbENhbGxiYWNrKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ1R1dG9yaWFsJyk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5idXR0b25BdWRpbywgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBxdWl0Q29udHJvbENhbGxiYWNrOiBmdW5jdGlvbiBxdWl0Q29udHJvbENhbGxiYWNrKCkge1xuICAgICAgICAvL2NjLmRpcmVjdG9yLmVuZCgpOyAvL1RPRE86IGhvdyB0byBlbmQgdGhlIGdhbWU/XG4gICAgICAgIGNjLmxvZyhcIlF1aXQgcHJlc3NlZC5cIik7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5idXR0b25BdWRpbywgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBiYWNrQ29udHJvbENhbGxiYWNrOiBmdW5jdGlvbiBiYWNrQ29udHJvbENhbGxiYWNrKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ1N0YXJ0bWVudScpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuYnV0dG9uQXVkaW8sIGZhbHNlKTtcbiAgICB9XG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZGZjZmV6QUFjSkFBTFhQaUlIVkpqMmQnLCAnUGxheWVyJyk7XG4vLyBzY3JpcHRzXFxnYW1lb2JqZWN0c1xcUGxheWVyLmpzXG5cbnZhciBHYW1lU3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5HYW1lU3RhdGU7XG52YXIgUGxheWVyTW92ZW1lbnRTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLlBsYXllck1vdmVtZW50U3RhdGU7XG52YXIgUGxheWVyU3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5QbGF5ZXJTdGF0ZTtcblxudmFyIGV4cGxvZGV0aW1lID0gMC4yO1xudmFyIHJpc2VEZWF0aFkgPSAyNTtcblxudmFyIGFuaW1hdGlvbk5lZWRzVXBkYXRlID0gZmFsc2U7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gUGxheWVyIHNwYXducyBpbiBhIHN0YW5kaW5nIHN0YXRlXG4gICAgICAgIG1vdmVzdGF0ZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBQbGF5ZXJNb3ZlbWVudFN0YXRlLlN0YW5kaW5nLFxuICAgICAgICAgICAgdHlwZTogUGxheWVyTW92ZW1lbnRTdGF0ZVxuICAgICAgICB9LFxuXG4gICAgICAgIGlzSW52aW5jaWJsZTogZmFsc2UsIC8vIFBsYXllciBwaWNrZWQgdXAgYW4gaXRlbSB3aGljaCBtYWRlIGhpbSB1bmtpbGxhYmxlXG4gICAgICAgIGlzUG9pc29uZWQ6IGZhbHNlLFxuICAgICAgICBpc0FsaXZlOiBmYWxzZSxcbiAgICAgICAgaXNTd2FwZWQ6IGZhbHNlLCAvL1BsYXllciBzdGFuZHMgb24gYSBTd2l0Y2hlciAvL1RPRE86IG51dHpsb3MgZGEgbmllIHZlcndlbmRldCBpbiBwbGF5ZXJcbiAgICAgICAgaXNTbG93ZWQ6IGZhbHNlLFxuXG4gICAgICAgIHBvaXNvblRpbWVyOiAwLFxuICAgICAgICBpbnZpbmNpYmlsdHlUaW1lcjogMCxcblxuICAgICAgICBkaXI6IDAsIC8vIE5leHQgUG9zaXRpb24gcGxheWVyIGlzIGp1bXBpbmcgdG8gMSA6IGxlZnQgIC0xOiByaWdodFxuXG4gICAgICAgIGFycmF5UG9zWDogMCwgLy9Qb3NpdGlvbiBpbiB0aGUgYXJyYXkgZ2l2ZW4gd2l0aCByb3cgYW5kIGNvbHVtblxuICAgICAgICBhcnJheVBvc1k6IDAsXG5cbiAgICAgICAganVtcFRpbWU6IDAsIC8vIFRpbWUgZm9yIGp1bXBpbmcgYWN0aW9uIHRvIHJ1blxuICAgICAgICBmYWxsVGltZTogMCwgLy8gc2FtZTogZmFsbGluZ1xuXG4gICAgICAgIC8vIEF0bGFzIGhvbGRpbiBhbGwgc3ByaXRlcyBvZiB0aGUgcGxheWVyLlxuICAgICAgICBwbGF5ZXJhdGxhczoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlQXRsYXNcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBQbGF5ZXIgQXVkaW9zXG4gICAgICAgIGp1bXBBdWRpbzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcblxuICAgICAgICBkZWF0aEF1ZGlvOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuXG4gICAgICAgIGZhbGxBdWRpbzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcblxuICAgICAgICBkcmlua0F1ZGlvOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuXG4gICAgICAgIHBvaXNvbmVkQXVkaW86IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gR2FtZSByZWZlcmVuY2UgdG8gcGFzcyBwbGF5ZXJcbiAgICAgICAgZ2FtZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIC8vcmVnaXN0ZXIgcGxheWVyIGF0IGdhbWUgZm9yIHByb2Nlc3NpbmcgcGxheWVyIGxvZ2ljXG4gICAgICAgIHRoaXMuZ2FtZS5nZXRDb21wb25lbnQoJ0dhbWUnKS5wbGF5ZXIgPSB0aGlzO1xuXG4gICAgICAgIGlmICghdGhpcy5hbmltYXRpb24pIC8vIEluaXQgYW5pbWF0aW9uXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbik7XG5cbiAgICAgICAgLy9Jbml0IHRpbWVyc1xuICAgICAgICB0aGlzLnBvaXNvblRtcCA9IHRoaXMucG9pc29uVGltZXI7XG4gICAgICAgIHRoaXMuaW52aW5jaWJpbHR5VG1wID0gdGhpcy5pbnZpbmNpYmlsdHlUaW1lcjtcblxuICAgICAgICB0aGlzLm1vdmVzdGF0ZSA9IFBsYXllck1vdmVtZW50U3RhdGUuU3RhbmRpbmc7XG4gICAgICAgIHRoaXMuaXNNb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc0FsaXZlID0gdHJ1ZTtcbiAgICAgICAgLy90aGlzLm9sZERlc3QgPSB0aGlzLmdhbWUuZ2V0Q29tcG9uZW50KCdHYW1lJykuZ2FtZWZpZWxkLmdhbWVGaWVsZFtnYW1lRmllbGQubGVuZ3RoLTFdWzNdO1xuXG4gICAgICAgIHRoaXMub2Zmc2V0WSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodCAvIDI7IC8vIE9mZnNldCB0byBzZXQgdGhlIHBsYXllciBvbiB0b3Agb2YgYmxvY2tzXG4gICAgICAgIHRoaXMuZGVzdGluYXRpb25wb3MgPSBjYy5wKDAsIDApO1xuXG4gICAgICAgIC8vTG9hZCBkYXRhIHJlbGV2YW50IHRvIHBsYXllciAgIC0tICEhIExFQVZFIEFUIEVORCBPRiBUSElTIEZVTkNUSU9OICEhIC0tXG4gICAgICAgIHRoaXMuZ2FtZS5nZXRDb21wb25lbnQoJ0dhbWUnKS5vblBsYXllckxvYWRDYWxsYmFjaygpO1xuICAgIH0sXG5cbiAgICBraWxsOiBmdW5jdGlvbiBraWxsKCkge1xuICAgICAgICB0aGlzLmlzSW52aW5jaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzQWxpdmUgPSBmYWxzZTtcbiAgICAgICAgdmFyIGdhbWVzdGF0ZWNhbGxiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5jaGFuZ2VHYW1lU3RhdGUsIHRoaXMpO1xuICAgICAgICB2YXIgc291bmRjYWxsYmFjayA9IGNjLmNhbGxGdW5jKHRoaXMucGxheVNvdW5kLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy5zcGF3bih0aGlzLmRlZm9ybSgpLCB0aGlzLmFzc2VtYmxlQWN0aW9uKCkpLCBnYW1lc3RhdGVjYWxsYmFjaywgc291bmRjYWxsYmFjaykpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5zdG9wQWxsRWZmZWN0cygpOyAvL1RPRE8gZXZ0bCBhbHMgY2FsbGJhY2tcbiAgICB9LFxuXG4gICAgZmFsbDogZnVuY3Rpb24gZmFsbCgpIHtcbiAgICAgICAgdGhpcy5pc0ludmluY2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tb3Zlc3RhdGUgPSBQbGF5ZXJNb3ZlbWVudFN0YXRlLkZhbGxpbmc7XG4gICAgICAgIC8vdmFyIGdhbWVzdGF0ZWNhbGxiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5jaGFuZ2VHYW1lRmFsbFN0YXRlLHRoaXMpO1xuICAgICAgICB2YXIga2lsbGNhbGxiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5raWxsLCB0aGlzKTtcbiAgICAgICAgdmFyIHNvdW5kY2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLnBsYXlTb3VuZCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2Muc3Bhd24odGhpcy5kZWZvcm0oKSwgdGhpcy5hc3NlbWJsZUFjdGlvbigpKSwgc291bmRjYWxsYmFjaywga2lsbGNhbGxiYWNrKSk7XG4gICAgICAgIHRoaXMuaXNBbGl2ZSA9IGZhbHNlOyAvL3NldCBoZXJlIGJlY2F1c2UgYWxpdmUgaW1wYWN0cyBkZWF0aCBhbmltLlxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5zdG9wQWxsRWZmZWN0cygpO1xuICAgIH0sXG5cbiAgICBjaGFuZ2VHYW1lU3RhdGU6IGZ1bmN0aW9uIGNoYW5nZUdhbWVTdGF0ZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQWxpdmUpIHRoaXMuZ2FtZS5nZXRDb21wb25lbnQoJ0dhbWUnKS5zdGF0ZSA9IEdhbWVTdGF0ZS5HYW1lT3ZlcjtcbiAgICB9LFxuXG4gICAgY2hhbmdlR2FtZUZhbGxTdGF0ZTogZnVuY3Rpb24gY2hhbmdlR2FtZUZhbGxTdGF0ZSgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJBbGl2ZTogXCIgKyB0aGlzLmlzQWxpdmUpO1xuICAgICAgICBpZiAodGhpcy5pc0FsaXZlKSB0aGlzLmlzQWxpdmUgPSBmYWxzZTtcbiAgICAgICAgY29uc29sZS5sb2coJ0NoYW5nZSBHYW1lU3RhdGU6ICcsIHRoaXMuZ2FtZS5nZXRDb21wb25lbnQoJ0dhbWUnKS5zdGF0ZSk7XG4gICAgICAgIHRoaXMuZ2FtZS5nZXRDb21wb25lbnQoJ0dhbWUnKS5zdGF0ZSA9IEdhbWVTdGF0ZS5HYW1lT3ZlcjtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5nYW1lLmdldENvbXBvbmVudCgnR2FtZScpLnN0YXRlKTtcbiAgICB9LFxuXG4gICAgY2hhbmdlUGxheWVyU3RhdGU6IGZ1bmN0aW9uIGNoYW5nZVBsYXllclN0YXRlKCkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMubW92ZXN0YXRlKSB7XG4gICAgICAgICAgICBjYXNlIFBsYXllck1vdmVtZW50U3RhdGUuSnVtcGluZzpcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVzdGF0ZSA9IFBsYXllck1vdmVtZW50U3RhdGUuU3RhbmRpbmc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYmxvY2tTdGVwcGVkOiBmdW5jdGlvbiBibG9ja1N0ZXBwZWQocGxheWVyLCBnYW1lKSB7XG4gICAgICAgIHZhciBzdGVwcGVkQmxvY2sgPSB0aGlzLmRlc3RmaWVsZC5nZXRDb21wb25lbnQoJ0Jsb2NrJyk7XG4gICAgICAgIHN0ZXBwZWRCbG9jay5vblN0ZXBDYWxsYmFjayh0aGlzLCBnYW1lKTtcbiAgICAgICAgdmFyIGl0ZW0gPSBzdGVwcGVkQmxvY2suZ2V0Q29tcG9uZW50SW5DaGlsZHJlbignSXRlbScpO1xuICAgICAgICBpZiAoaXRlbSAhPT0gbnVsbCkgaXRlbS5vblBpY2tVcENhbGxiYWNrKHRoaXMsIGdhbWUpO1xuICAgIH0sXG4gICAgLy9cbiAgICAvLyBNb3ZlbWVudCBhbmQgQWN0aW9uc1xuICAgIC8vXG5cbiAgICAvL0NhbGxlZCBldmVyeXRpbWUgYSB0aGUgZmlndXJlIGlzIG1vdmVkIGJ5IHByZXNzaW5nIEEgb3IgRFxuICAgIG1vdmU6IGZ1bmN0aW9uIG1vdmUoZGVzdGZpZWxkLCBnYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQWxpdmUgPT09IGZhbHNlKSByZXR1cm47XG4gICAgICAgIHRoaXMub2xkRGVzdCA9IHRoaXMuZGVzdGZpZWxkO1xuICAgICAgICB0aGlzLmRlc3RmaWVsZCA9IGRlc3RmaWVsZDsgLy8gRGlyZWN0aW9uIHBsYXllcnMgd2FudHMgdG8gbW92ZSB0aGUgZmlndXJlKC0xIG9yIDEpXG4gICAgICAgIHN3aXRjaCAodGhpcy5tb3Zlc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgUGxheWVyTW92ZW1lbnRTdGF0ZS5TdGFuZGluZzpcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVzdGF0ZSA9IFBsYXllck1vdmVtZW50U3RhdGUuSnVtcGluZztcblxuICAgICAgICAgICAgICAgIHZhciBzb3VuZENhbGxiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5wbGF5U291bmQsIHRoaXMpO1xuICAgICAgICAgICAgICAgIHZhciBwbGF5ZXJzdGF0ZUNhbGxiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5jaGFuZ2VQbGF5ZXJTdGF0ZSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgdmFyIGJsb2Nrc3RlcENhbGxiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5ibG9ja1N0ZXBwZWQsIHRoaXMsIGdhbWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3dpdGNoUGxheWVyQXBwZWFyYW5jZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGVzdGluYXRpb25Qb3MoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2Muc3Bhd24odGhpcy5kZWZvcm0oKSwgdGhpcy5hc3NlbWJsZUFjdGlvbigpKSwgYmxvY2tzdGVwQ2FsbGJhY2ssIHNvdW5kQ2FsbGJhY2ssIHBsYXllcnN0YXRlQ2FsbGJhY2spKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLkp1bXBpbmc6XG4gICAgICAgICAgICBjYXNlIFBsYXllck1vdmVtZW50U3RhdGUuRmFsbGluZzpcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0RGVzdGluYXRpb25Qb3M6IGZ1bmN0aW9uIHNldERlc3RpbmF0aW9uUG9zKCkge1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9ucG9zLnggPSB0aGlzLmRlc3RmaWVsZC5nZXRQb3NpdGlvblgoKTtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbnBvcy55ID0gdGhpcy5kZXN0ZmllbGQuZ2V0UG9zaXRpb25ZKCkgKyB0aGlzLm9mZnNldFk7XG4gICAgfSxcblxuICAgIHN3aXRjaFBsYXllckFwcGVhcmFuY2U6IGZ1bmN0aW9uIHN3aXRjaFBsYXllckFwcGVhcmFuY2UoKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uUnVubmluZyA9IGZhbHNlOyAvL0ZvcmNlIHBsYXllciB1cGRhdGUgZXZlcnkganVtcFxuICAgICAgICB0aGlzLnVwZGF0ZWQgPSB0aGlzLnVwZGF0ZUFuaW1hdGlvbigpO1xuICAgICAgICBpZiAodGhpcy51cGRhdGVkKSAvLyBpZiBhbmltYXRpb25zIGlzIHJ1bm5pbmcgZG9udCBnbyB0byBzcHJpdGUgZnJhbWUgY2hhbmdpbmdcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMuZGlyIDwgMCkge1xuICAgICAgICAgICAgLy8gUGxheWVyIGxvb2tzIGxlZnRcbiAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSkuc3ByaXRlRnJhbWUgPSB0aGlzLnBsYXllcmF0bGFzLmdldFNwcml0ZUZyYW1lKFwicGxheWVyX2xlZnRcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdldENvbXBvbmVudChjYy5TcHJpdGUpLnNwcml0ZUZyYW1lID0gdGhpcy5wbGF5ZXJhdGxhcy5nZXRTcHJpdGVGcmFtZShcInBsYXllcl9yaWdodFwiKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBhc3NlbWJsZUFjdGlvbjogZnVuY3Rpb24gYXNzZW1ibGVBY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQWxpdmUgPT09IGZhbHNlKSAvL1BsYXllciBkZWFkIC0+IGFjdGlvbiBUT0RPOiB2ZXJzYXV0IGZhbGxlbiBhbmltYXRpb25cbiAgICAgICAgICAgIHJldHVybiBjYy5tb3ZlQnkoZXhwbG9kZXRpbWUsIGNjLnAoMCwgcmlzZURlYXRoWSkpO1xuXG4gICAgICAgIHN3aXRjaCAodGhpcy5tb3Zlc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgUGxheWVyTW92ZW1lbnRTdGF0ZS5TdGFuZGluZzpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgUGxheWVyTW92ZW1lbnRTdGF0ZS5GYWxsaW5nOlxuICAgICAgICAgICAgICAgIHJldHVybiBjYy5tb3ZlVG8odGhpcy5mYWxsVGltZSwgY2MucCh0aGlzLm5vZGUuZ2V0UG9zaXRpb24oKS54LCAwKSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbkluKCkpO1xuXG4gICAgICAgICAgICBjYXNlIFBsYXllck1vdmVtZW50U3RhdGUuSnVtcGluZzpcbiAgICAgICAgICAgICAgICAvLyBQb2ludHMgZm9ybWluZyB0aGUgYmV6aWVyY3VydmVcbiAgICAgICAgICAgICAgICB2YXIgYmV6aWVyID0gW3RoaXMubm9kZS5nZXRQb3NpdGlvbigpLCB0aGlzLmRlc3RpbmF0aW9ucG9zLCB0aGlzLmRlc3RpbmF0aW9ucG9zXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2MuYmV6aWVyVG8odGhpcy5qdW1wVGltZSwgYmV6aWVyKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkZWZvcm06IGZ1bmN0aW9uIGRlZm9ybSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBbGl2ZSA9PT0gZmFsc2UpIC8vUGxheWVyIGRlYWQgLT4gZGVmb3JtXG4gICAgICAgICAgICByZXR1cm4gY2Muc2VxdWVuY2UoY2Muc2NhbGVUbyhleHBsb2RldGltZSwgMS4zLCAxLjMpLCBjYy5zY2FsZVRvKGV4cGxvZGV0aW1lLCAwLjAsIDAuMCkpO1xuXG4gICAgICAgIHN3aXRjaCAodGhpcy5tb3Zlc3RhdGUpIHsvLyBQbGF5ZXIgaW4gYSBtb3Zpbmcgc3RhdGUgLT4gYWN0aW9uXG5cbiAgICAgICAgICAgIGNhc2UgUGxheWVyTW92ZW1lbnRTdGF0ZS5KdW1waW5nOlxuICAgICAgICAgICAgICAgIHZhciBzY2FsZXRpbWUgPSB0aGlzLmp1bXBUaW1lICogMC41O1xuICAgICAgICAgICAgICAgIHJldHVybiBjYy5zZXF1ZW5jZShjYy5zY2FsZVRvKHNjYWxldGltZSwgMSwgMS4xKSwgY2Muc2NhbGVUbyhzY2FsZXRpbWUsIDEsIDAuOSksIGNjLnNjYWxlVG8oc2NhbGV0aW1lLCAxLCAxLjApKTtcblxuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLkZhbGxpbmc6XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnNldExvY2FsWk9yZGVyKHRoaXMuZGVzdGZpZWxkLmdldExvY2FsWk9yZGVyKCkpOyAvL1RPRE86IGZhbGwgd2lyZCBzY2hvbiB3w6RocmVuZCBkZXMganVtcHMgYXVzZ2Vmw7xocnQgLT4gc3BpZWxlciB2ZXJzY2h3aW5kZXQgaGludGVyIHZvcmJlaWdlc3BydW5nZW5lbiBibMO2Y2tlblxuICAgICAgICAgICAgICAgIHZhciBmYWxsRGVmb3JtID0gY2Muc2NhbGVUbyh0aGlzLmZhbGxUaW1lLCAwLjg1LCAwLjg1KTtcbiAgICAgICAgICAgICAgICB2YXIgZmFsbGZhZGUgPSBjYy5mYWRlT3V0KHRoaXMuZmFsbFRpbWUgKiA0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2Muc3Bhd24oZmFsbERlZm9ybSwgZmFsbGZhZGUuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbk91dCgpKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTWlnaHQgYmUgdXNlZnVsIHNvbWV0aW1lXG4gICAgICAgIGlmICh0aGlzLmlzUG9pc29uZWQpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGlmICh0aGlzLmlzSW52aW5jaWJsZSkgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8vXG4gICAgLy8gIFNvdW5kc1xuICAgIC8vXG5cbiAgICBwbGF5U291bmQ6IGZ1bmN0aW9uIHBsYXlTb3VuZCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQWxpdmUpIHtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5kZWF0aEF1ZGlvLCBmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1BvaXNvbmVkKSBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMucG9pc29uZWRBdWRpbywgdHJ1ZSk7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLm1vdmVzdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLkp1bXBpbmc6XG4gICAgICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmp1bXBBdWRpbywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLkZhbGxpbmc6XG4gICAgICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmZhbGxBdWRpbywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy9cbiAgICAvLyBTdGF0dXMgYW5kIFVwZGF0ZSBvZiBwbGF5ZXJcbiAgICAvL1xuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5pc0FsaXZlKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVRpbWVycyhkdCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUFuaW1hdGlvbigpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZUFuaW1hdGlvbjogZnVuY3Rpb24gdXBkYXRlQW5pbWF0aW9uKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNQb2lzb25lZCAmJiAhdGhpcy5pc0ludmluY2libGUpIHtcbiAgICAgICAgICAgIC8vTklDRSBUTyBIQVZFOiBubyBib29sc1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb24uc3RvcCgpO1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25SdW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKHRoaXMuaXNQb2lzb25lZCB8fCB0aGlzLmlzSW52aW5jaWJsZSkgJiYgIXRoaXMuYW5pbWF0aW9uUnVubmluZykgdGhpcy5hbmltYXRpb24ucGxheSh0aGlzLmdldEFuaW1hdGlvbigpKTtcbiAgICAgICAgdGhpcy5hbmltYXRpb25SdW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcblxuICAgIHVwZGF0ZVRpbWVyczogZnVuY3Rpb24gdXBkYXRlVGltZXJzKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLmlzUG9pc29uZWQpIGlmICh0aGlzLnBvaXNvblRtcCA8PSAwKSB7XG4gICAgICAgICAgICAvL3RpbWVyIHJhbiBvdXQgLT4ga2lsbCBwbGF5ZXJcbiAgICAgICAgICAgIHRoaXMuaXNQb2lzb25lZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5pc0FsaXZlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmtpbGwoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucG9pc29uVG1wIC09IGR0OyAvL2RlY3JlYXNlIHRpbWVyLi4uaHVycnkhXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc0ludmluY2libGUpIGlmICh0aGlzLmludmluY2liaWx0eVRtcCA8PSAwKSB7XG4gICAgICAgICAgICAvL3RpbWVyIHJhbiBvdXQgLT4gZG93bnJhbmsgcGxheWVyXG4gICAgICAgICAgICB0aGlzLmlzSW52aW5jaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5pbnZpbmNpYmlsdHlUbXAgPSB0aGlzLmludmluY2liaWx0eVRpbWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbnZpbmNpYmlsdHlUbXAgLT0gZHQ7IC8vZGVjcmVhc2UgdGltZXIuLi5odXJyeSFcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpc01vdmluZzogZnVuY3Rpb24gaXNNb3ZpbmcoKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5tb3Zlc3RhdGUpIHsvL3N3aXRjaCBmb3IgcG9zc2libGUgZnVydGhlciBzdGF0ZXNcbiAgICAgICAgICAgIGNhc2UgUGxheWVyTW92ZW1lbnRTdGF0ZS5KdW1waW5nOlxuICAgICAgICAgICAgICAgIHRoaXMuaXNNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgICAgICBjYXNlIFBsYXllck1vdmVtZW50U3RhdGUuU3RhbmRpbmc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGlzQWxpdmU6IChmdW5jdGlvbiAoX2lzQWxpdmUpIHtcbiAgICAgICAgZnVuY3Rpb24gaXNBbGl2ZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBfaXNBbGl2ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNBbGl2ZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBfaXNBbGl2ZS50b1N0cmluZygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBpc0FsaXZlO1xuICAgIH0pKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGlzQWxpdmU7XG4gICAgfSksXG5cbiAgICBnZXRBbmltYXRpb246IGZ1bmN0aW9uIGdldEFuaW1hdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlyIDwgMCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNQb2lzb25lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAncG9pc29uX2xlZnRfYW5pbSc7IC8vcGxheSgncG9pc29uX2xlZnRfYW5pbScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0ludmluY2libGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3N0YXJfbGVmdF9hbmltJzsgLy9wbGF5KCdwb2lzb25fbGVmdF9hbmltJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNQb2lzb25lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ3BvaXNvbl9yaWdodF9hbmltJzsgLy9wbGF5KCdwb2lzb25fbGVmdF9hbmltJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNJbnZpbmNpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnc3Rhcl9yaWdodF9hbmltJzsgLy9wbGF5KCdwb2lzb25fbGVmdF9hbmltJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgIH1cblxufSk7XG4vKlxyXG5tYWtlSW52aW5jaWJsZTogZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuaXNJbnZpbmNpYmxlID0gdHJ1ZTtcclxuICAgIC8vVE9ETzogc3RhcnQgaW52aW5jaWJpbGl0eSB0aW1lclxyXG59LFxyXG4gIHBvaXNvbjogZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuaXNQb2lzb25lZCA9IHRydWU7XHJcbiAgICAvL1RPRE86IHN0YXJ0IHBvaXNvbiB0aW1lciBhbmQga2lsbGluZyBwaGFzZSBpZiB0dXJuIGJhc2VkIHBvaXNvbiBpcyBuZWdsZWN0ZWRcclxufSxcclxuICBzaG90IDogZnVuY3Rpb24oKXtcclxuICB9LCovXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdlMDUwZmZablVWQWpLQjhmeVNkK1pkTycsICdQb2lzb24nKTtcbi8vIHNjcmlwdHNcXGdhbWVmaWVsZFxcYmxvY2tzXFxQb2lzb24uanNcblxudmFyIEJsb2NrVHlwZSA9IHJlcXVpcmUoJ1R5cGVzJykuQmxvY2tUeXBlO1xudmFyIFBsYXllck1vdmVtZW50U3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5QbGF5ZXJNb3ZlbWVudFN0YXRlO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGlzQmxvY2tlZDogZmFsc2UsXG4gICAgICAgIGhhc0l0ZW06IGZhbHNlLFxuXG4gICAgICAgIGJsb2NrdHlwZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBCbG9ja1R5cGUuTm9uZSxcbiAgICAgICAgICAgIHR5cGU6IEJsb2NrVHlwZVxuICAgICAgICB9LFxuXG4gICAgICAgIGl0ZW06IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnBsYXllck9uVG9wID0gZmFsc2U7XG4gICAgfSxcblxuICAgIG9uU3RlcENhbGxiYWNrOiBmdW5jdGlvbiBvblN0ZXBDYWxsYmFjayhwbGF5ZXIsIGdhbWUpIHtcbiAgICAgICAgY2MubG9nKCdNOiBvblN0ZXBDYWxsYmFjayBQb2lzb24nKTtcbiAgICAgICAgY29uc29sZS5sb2coJ0RVIFdVUkRFU1QgVkVSR0lGVEVUJyk7XG4gICAgICAgIC8qaWYocGxheWVyLnBvaXNvblRpbWVyPDYgfHwgcGxheWVyLnBvaXNvblRpbWVyPjYpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRGVyIFRpbWVyIGlzdCBrbGVpbmVyIDYnKTtcclxuICAgICAgICAgICAgaWYoIXBsYXllci5pc1BvaXNvbmVkKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEZXIgU3BpZWxlciBpc3Qgbm9jaCBuaWNodCB2ZXJnaWZ0ZXQnKTtcclxuICAgICAgICAgICAgICAgIHBsYXllci5wb2lzb25UaW1lciA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9Ki9cblxuICAgICAgICBpZiAoIXBsYXllci5pc0ludmluY2libGUpIHBsYXllci5pc1BvaXNvbmVkID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgY29sbGlkZTogZnVuY3Rpb24gY29sbGlkZSgpIHt9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdlMjJjM1E0Z1hCTkNwNVdUR0N0R3FTeicsICdTcGlrZScpO1xuLy8gc2NyaXB0c1xcZ2FtZWZpZWxkXFxibG9ja3NcXFNwaWtlLmpzXG5cbnZhciBhbHJlYWR5S2lsbGVkID0gZmFsc2U7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaXNEZWFkbHk6IHRydWVcbiAgICB9LFxuXG4gICAgLy8gZm9vOiB7XG4gICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgLy8gfSxcbiAgICAvLyAuLi5cbiAgICBzd2l0Y2hEZWFkbHk6IGZ1bmN0aW9uIHN3aXRjaERlYWRseSgpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnaXNEZWFkbHk6ICcsIHRoaXMuaXNEZWFkbHkpO1xuICAgICAgICB0aGlzLmlzRGVhZGx5ID0gIXRoaXMuaXNEZWFkbHk7XG4gICAgICAgIHRoaXMuaGFzS2lsbGVkID0gZmFsc2U7XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmlzRGVhZGx5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5wbGF5ZXJPblRvcCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBvblN0ZXBDYWxsYmFjazogZnVuY3Rpb24gb25TdGVwQ2FsbGJhY2socGxheWVyLCBnYW1lKSB7XG4gICAgICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xuICAgICAgICB0aGlzLnBsYXllck9uVG9wID0gdHJ1ZTtcbiAgICAgICAgY29uc29sZS5sb2coJ006IE9uc3RlcCBTcGlrZScpO1xuICAgICAgICBjb25zb2xlLmxvZygnT25TIGlzRGVhZGx5OiAnLCB0aGlzLmlzRGVhZGx5KTtcbiAgICAgICAgaWYgKCF0aGlzLmhhc0tpbGxlZCkgdGhpcy5wZXJmb3JtU3Bpa2VLaWxsKCk7XG4gICAgfSxcblxuICAgIHBlcmZvcm1TcGlrZUtpbGw6IGZ1bmN0aW9uIHBlcmZvcm1TcGlrZUtpbGwoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0RlYWRseSAmJiAhdGhpcy5wbGF5ZXIuaXNJbnZpbmNpYmxlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnVXVwcywgZGFzIHdhciB0w7Z0bGljaCcpO1xuICAgICAgICAgICAgaWYgKCFhbHJlYWR5S2lsbGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIua2lsbCgpO1xuICAgICAgICAgICAgICAgIGFscmVhZHlLaWxsZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5oYXNLaWxsZWQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0dsw7xjayBnZWhhYnQnKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5wbGF5ZXJPblRvcCkgdGhpcy5wZXJmb3JtU3Bpa2VLaWxsKCk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdmOGFmM20zTGdsUE5ZMzREZGI5VldEMCcsICdTdGF0ZXMnKTtcbi8vIHNjcmlwdHNcXGVudW1zXFxTdGF0ZXMuanNcblxudmFyIEdhbWVTdGF0ZSA9IGNjLkVudW0oe1xuICAgIE5vbmU6IDk5OSxcbiAgICBJZGxlOiAtMSwgLy8gV2FpdGluZyBmb3IgUGxheWVyIHRvIGNob29zZSBzb21ldGhpbmcgaW4gdGhlIG1lbnVcbiAgICBMb2FkaW5nOiAtMSwgLy8gUGxheWVyIHByZXNzZWQgU3RhcnQgLT4gbG9hZCBnYW1lXG4gICAgV2FpdGluZzogLTEsIC8vIFdhaXRpbmcgZm9yIGZpcnN0IG1vdmUgdG8gc3RhcnQgdGltZXJzIGV0Y1xuICAgIFBsYXlpbmc6IC0xLCAvLyBHYW1lIGxvYWRlZCBhbmQgc3RhcnRlZFxuICAgIEdhbWVPdmVyOiAtMSwgLy9QbGF5ZXIgZGllZFxuICAgIFBhdXNlZDogLTEsIC8vIEdhbWUgd2FzIHBhdXNlZCBieSB0aGUgcGxheWVyXG4gICAgUmVzdW1lZDogLTEsIC8vIEdhbWUgd2FzIHJlc3VtZWQgYWZ0ZXIgcGF1c2luZ1xuICAgIEVuZGVkOiAtMSB9KTtcblxuLy8gR2FtZSB3YXMgY2xvc2VkIGJ5IHRoZSBwbGF5ZXIgb3IgaGUgbG9zdCAtPiBiYWNrIHRvIGlkbGU/XG52YXIgUGxheWVyTW92ZW1lbnRTdGF0ZSA9IGNjLkVudW0oe1xuICAgIFN0YW5kaW5nOiAtMSwgLy9QbGF5ZXIgaXMgc3RhbmRpbmcgc3RpbGwgKGhhcyBmdWxseSBhcnJpdmVkIG9uIGEgYmxvY2spXG4gICAgSnVtcGluZzogLTEsIC8vUGxheWVyIGlzIG1vdmluZyBvbnRvIGFub3RoZXIgYmxvY2soaW4gYW5pbWF0aW9uKVxuICAgIEZhbGxpbmc6IC0xIH0pO1xuXG4vL1BsYXllciBpcyBmYWxsaW5nIGRvd24gdGhlIGdhbWVmaWVsZFxudmFyIEl0ZW1TdGF0ZSA9IGNjLkVudW0oe1xuICAgIFBpY2thYmxlOiAtMSxcbiAgICBCbG9ja2VkOiAtMSxcbiAgICBQaWNrZWQ6IC0xXG59KTtcblxudmFyIEl0ZW1BY3Rpdml0eVN0YXRlID0gY2MuRW51bSh7XG4gICAgSWRsZTogLTEsXG4gICAgQWN0aXZlOiAtMSxcbiAgICBFeHBpcmVkOiAtMVxufSk7XG5cbnZhciBQbGF5ZXJTdGF0ZSA9IGNjLkVudW0oe1xuICAgIEFsaXZlOiAtMSxcbiAgICBEZWFkOiAtMSxcbiAgICBQb2lzb25lZDogLTEsXG4gICAgSW52aW5jaWJsZTogLTFcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBHYW1lU3RhdGU6IEdhbWVTdGF0ZSxcbiAgICBQbGF5ZXJNb3ZlbWVudFN0YXRlOiBQbGF5ZXJNb3ZlbWVudFN0YXRlLFxuICAgIEl0ZW1TdGF0ZTogSXRlbVN0YXRlLFxuICAgIFBsYXllclN0YXRlOiBQbGF5ZXJTdGF0ZSxcbiAgICBJdGVtQWN0aXZpdHlTdGF0ZTogSXRlbUFjdGl2aXR5U3RhdGVcbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc0MzIzZDRYSjRaTWlaMnd4K3l4N0U3bicsICdTd2l0Y2hlcicpO1xuLy8gc2NyaXB0c1xcZ2FtZWZpZWxkXFxibG9ja3NcXFN3aXRjaGVyLmpzXG5cbnZhciBCbG9ja1R5cGUgPSByZXF1aXJlKCdUeXBlcycpLkJsb2NrVHlwZTtcbnZhciBQbGF5ZXJNb3ZlbWVudFN0YXRlID0gcmVxdWlyZSgnU3RhdGVzJykuUGxheWVyTW92ZW1lbnRTdGF0ZTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpc0Jsb2NrZWQ6IGZhbHNlLFxuICAgICAgICBoYXNJdGVtOiBmYWxzZSxcblxuICAgICAgICBibG9ja3R5cGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogQmxvY2tUeXBlLk5vbmUsXG4gICAgICAgICAgICB0eXBlOiBCbG9ja1R5cGVcbiAgICAgICAgfSxcblxuICAgICAgICBpdGVtOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJPblRvcCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBvblN0ZXBDYWxsYmFjazogZnVuY3Rpb24gb25TdGVwQ2FsbGJhY2socGxheWVyLCBnYW1lKSB7XG4gICAgICAgIGNjLmxvZygnTTogb25TdGVwQ2FsbGJhY2sgU3dpdGNoZXInKTtcbiAgICAgICAgcGxheWVyLmlzU3dhcGVkID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgY29sbGlkZTogZnVuY3Rpb24gY29sbGlkZSgpIHt9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcxYzcxMFl2V3ZCQWNxVEJCMFdNdU45dicsICdUcmFwZG9vcicpO1xuLy8gc2NyaXB0c1xcZ2FtZWZpZWxkXFxibG9ja3NcXFRyYXBkb29yLmpzXG5cbnZhciBCbG9ja1R5cGUgPSByZXF1aXJlKCdUeXBlcycpLkJsb2NrVHlwZTtcbnZhciBQbGF5ZXJNb3ZlbWVudFN0YXRlID0gcmVxdWlyZSgnU3RhdGVzJykuUGxheWVyTW92ZW1lbnRTdGF0ZTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpc0Jsb2NrZWQ6IGZhbHNlLFxuICAgICAgICBoYXNJdGVtOiBmYWxzZSxcblxuICAgICAgICBibG9ja3R5cGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogQmxvY2tUeXBlLk5vbmUsXG4gICAgICAgICAgICB0eXBlOiBCbG9ja1R5cGVcbiAgICAgICAgfSxcblxuICAgICAgICBpdGVtOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJPblRvcCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBvblN0ZXBDYWxsYmFjazogZnVuY3Rpb24gb25TdGVwQ2FsbGJhY2socGxheWVyLCBnYW1lKSB7XG4gICAgICAgIHZhciBhbmltQ3RybCA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgYW5pbUN0cmwucGxheSgndHJhcGRvb3InKTtcbiAgICAgICAgdmFyIGZhbGwgPSBjYy5tb3ZlVG8oMSwgY2MucCh0aGlzLm5vZGUuZ2V0UG9zaXRpb25YKCksIHRoaXMubm9kZS5nZXRQb3NpdGlvblkoKSAtIDEwMCkpO1xuICAgICAgICAvL3ZhciBjYWxMYmFjayA9IGNjLmNhbGxGdW5jKHRoaXMuZGVzdHJveSwgdGhpcyk7XG4gICAgICAgIC8vdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShmYWxsLGNhbExiYWNrKSk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oZmFsbCk7XG4gICAgICAgIHBsYXllci5mYWxsKCk7XG4gICAgICAgIC8vZ2FtZS5zdGF0ZSA9IGdhbWUuR2FtZVN0YXRlLkdhbWVPdmVyO1xuICAgIH0sXG5cbiAgICBjb2xsaWRlOiBmdW5jdGlvbiBjb2xsaWRlKCkge30sXG5cbiAgICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLm5vZGUuZGVzdHJveSgpO1xuICAgIH1cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3MWI5M1NSTjBCTzFxS1NxNTVFVS9XSScsICdUeXBlcycpO1xuLy8gc2NyaXB0c1xcZW51bXNcXFR5cGVzLmpzXG5cbnZhciBJdGVtVHlwZSA9IGNjLkVudW0oe1xuICAgIE5vbmU6IDk5OSxcbiAgICBTdGFyOiAtMSwgLy8gU2NvcmVcbiAgICBDb2luOiAtMSwgLy8gQ2xpbWIgdHdvKGYuZS4pIHJvd3MgdXBcbiAgICBBbnRpZG90ZTogLTEsIC8vIEN1cmVzIHBvaXNvblxuICAgIEJsb2NrZXI6IC0xLFxuICAgIFNsb3dlcjogLTFcbn0pO1xuXG52YXIgQmxvY2tUeXBlID0gY2MuRW51bSh7XG4gICAgTm9uZTogLTEsXG4gICAgRW1wdHk6IC0xLFxuICAgIERpcnQ6IC0xLFxuICAgIEdyYXNzOiAtMSxcbiAgICBQb2lzb246IC0xLFxuICAgIFN3aXRjaGVyOiAtMSxcbiAgICBUcmFwZG9vcjogLTEsXG4gICAgU3Bpa2U6IC0xXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgSXRlbVR5cGU6IEl0ZW1UeXBlLFxuICAgIEJsb2NrVHlwZTogQmxvY2tUeXBlXG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOTZlMjBCOXpGcENVS0tWVW54UE4vSDknLCAnV2F0ZXJSaWdodCcpO1xuLy8gc2NyaXB0c1xcZ2FtZWZpZWxkXFxibG9ja3NcXFdhdGVyUmlnaHQuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnBsYXllck9uVG9wID0gZmFsc2U7XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiXX0=
