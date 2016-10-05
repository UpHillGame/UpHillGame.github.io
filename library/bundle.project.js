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

var cloudsprites = 7; //How many cloud sprites we have in the atlas

var cloudspawnYmin = 140; //
var cloudspawnYmax = 360; //

cc.Class({
    "extends": cc.Component,

    properties: {
        cloudsAmount: 0,
        cloudsSpeedVariance: 0,

        background: {
            "default": null,
            type: cc.Node
        },

        cloudsatlas: {
            "default": null,
            type: cc.SpriteAtlas
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.clouds = [];
        this.speeds = [];
        this.initalizeClouds();
    },

    initalizeClouds: function initalizeClouds() {
        for (var i = 0; i < this.cloudsAmount; i++) {
            this.generateCloud(i);
        }
    },

    //Returns a cloud node as Sprite from a SpriteFrame
    generateCloud: function generateCloud(id) {
        var rndm = this.randomInRangeInclusive(1, this.cloudsprites);
        var cloudsprite = this.cloudsatlas.getSpriteFrame(this.getCloudRandomSprite(rndm));

        var x = this.randomInRangeInclusive(-700, -800);
        var y = this.randomInRangeInclusive(cloudspawnYmin, cloudspawnYmax);
        var node = new cc.Node("New CloudSprite");
        node.addComponent(cc.Sprite);
        node.getComponent(cc.Sprite).spriteFrame = cloudsprite;
        node.setPosition(cc.p(x, y));

        this.clouds[id] = node;
        this.speeds[id] = this.randomInRangeInclusive(1, this.cloudsSpeedVariance);

        this.background.addChild(node);
    },

    updateCloud: function updateCloud(cloudId, dt) {
        var cloud = this.clouds[cloudId];
        var speed = this.speeds[cloudId];
        var x = cloud.getPositionX();

        if (x > 550) {
            //canvas.width+cloud.getContentSize().width //Cloud is outside the frame
            cloud.destroy(); //destroy this cloud ..
            this.generateCloud(cloudId); //and create a new one
        }

        var y = cloud.getPositionY();
        cloud.setPosition(cc.p(x + speed * 2 * dt, y));
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        for (var i = 0; i < this.clouds.length; i++) {
            this.updateCloud(i, dt);
        }
    },

    //
    // Helping functions
    //
    getCloudRandomSprite: function getCloudRandomSprite(int) {
        switch (int) {
            case 0:
                return "cloud_01";
            case 1:
                return "cloud_02";
            case 2:
                return "cloud_03";
            case 3:
                return "cloud_04";
            case 4:
                return "cloud_05";
            case 5:
                return "cloud_06";
            case 6:
                return "cloud_07";
            default:
                return "cloud_01";
        }
    },

    randomInRangeInclusive: function randomInRangeInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
},{"States":"States","Types":"Types"}],"Foe":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8943dToPrBJJYD6rGKh1Rdi', 'Foe');
// scripts\gameobjects\Foe.js

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
},{}],"GameButtonCallbacks":[function(require,module,exports){
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
				// Let blocks slowly rise when they spawn
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
	// All relevant data has to be loaded as properties within the prefabs instantiated here.!!
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
        background: {
            'default': null,
            type: cc.Sprite
        },

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
        this.storage = cc.sys.localStorage;
        this.state = GameState.Waiting;

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
        this.gamefield.setPlayerStart(this.player);
        this.player.node.setLocalZOrder(1000);
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
        var steppedBlock = this.destfield.getComponent('Block');

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
                            self.parallaxBackground();

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
                            self.parallaxBackground();

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

    parallaxBackground: function parallaxBackground() {
        this.background.node.runAction(cc.moveBy(this.player.jumpTime, cc.p(this.player.dir, 0)));
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
},{}]},{},["Game","Block","MenuButtonCallbacks","Trapdoor","Switcher","GameButtonCallbacks","Types","CloudAnimation","Grass","Level","Foe","WaterRight","Item","Empty","GameField","Poison","Player","Spike","States","Dirt"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0RldmVsb3BtZW50L0NvY29zQ3JlYXRvci9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9CbG9jay5qcyIsImFzc2V0cy9zY3JpcHRzL3NjZW5lc2NyaXB0cy9DbG91ZEFuaW1hdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9ibG9ja3MvRGlydC5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9ibG9ja3MvRW1wdHkuanMiLCJhc3NldHMvc2NyaXB0cy9nYW1lb2JqZWN0cy9Gb2UuanMiLCJhc3NldHMvc2NyaXB0cy9zY2VuZXNjcmlwdHMvR2FtZUJ1dHRvbkNhbGxiYWNrcy5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9HYW1lRmllbGQuanMiLCJhc3NldHMvc2NyaXB0cy9HYW1lLmpzIiwiYXNzZXRzL3NjcmlwdHMvZ2FtZWZpZWxkL2Jsb2Nrcy9HcmFzcy5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVvYmplY3RzL0l0ZW0uanMiLCJhc3NldHMvc2NyaXB0cy9nYW1lZmllbGQvTGV2ZWwuanMiLCJhc3NldHMvc2NyaXB0cy9zY2VuZXNjcmlwdHMvTWVudUJ1dHRvbkNhbGxiYWNrcy5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVvYmplY3RzL1BsYXllci5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9ibG9ja3MvUG9pc29uLmpzIiwiYXNzZXRzL3NjcmlwdHMvZ2FtZWZpZWxkL2Jsb2Nrcy9TcGlrZS5qcyIsImFzc2V0cy9zY3JpcHRzL2VudW1zL1N0YXRlcy5qcyIsImFzc2V0cy9zY3JpcHRzL2dhbWVmaWVsZC9ibG9ja3MvU3dpdGNoZXIuanMiLCJhc3NldHMvc2NyaXB0cy9nYW1lZmllbGQvYmxvY2tzL1RyYXBkb29yLmpzIiwiYXNzZXRzL3NjcmlwdHMvZW51bXMvVHlwZXMuanMiLCJhc3NldHMvc2NyaXB0cy9nYW1lZmllbGQvYmxvY2tzL1dhdGVyUmlnaHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdm1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMGNmODB2YTRpSkNYWkRYYlN3Z1kxbW0nLCAnQmxvY2snKTtcbi8vIHNjcmlwdHNcXGdhbWVmaWVsZFxcQmxvY2suanNcblxudmFyIEJsb2NrVHlwZSA9IHJlcXVpcmUoJ1R5cGVzJykuQmxvY2tUeXBlO1xudmFyIFBsYXllck1vdmVtZW50U3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5QbGF5ZXJNb3ZlbWVudFN0YXRlO1xuXG52YXIgdGVtcFBhcmVudDtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpc0Jsb2NrZWQ6IGZhbHNlLFxuICAgICAgICBoYXNJdGVtOiBmYWxzZSxcbiAgICAgICAgaXNEZWFkbHk6IGZhbHNlLFxuXG4gICAgICAgIGJsb2NrdHlwZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBCbG9ja1R5cGUuTm9uZSxcbiAgICAgICAgICAgIHR5cGU6IEJsb2NrVHlwZVxuICAgICAgICB9LFxuXG4gICAgICAgIGl0ZW06IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICBvblN0ZXBwZWRTb3VuZDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIGRlZmF1bHRTb3VuZDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICAvL0lmIGJsb2NrIGhhcyBhbmltYXRpb24gbG9hZCBpdFxuICAgICAgICB2YXIgYW5pbSA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgaWYgKGFuaW0gIT09IG51bGwgfHwgdW5kZWZpbmVkKSB0aGlzLmFuaW0gPSBhbmltO1xuICAgICAgICAvL0luaXRhbGl6ZSBCbG9jayBjb3Jlc3Nwb25kaW5nIHRvIGl0cyB0eXBlXG4gICAgICAgIHN3aXRjaCAodGhpcy5ibG9ja3R5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLlNwaWtlOlxuICAgICAgICAgICAgICAgIHRoaXMuaGFzS2lsbGVkID0gZmFsc2U7XG4gICAgICAgICAgICBjYXNlIEJsb2NrVHlwZS5UcmFwZG9vcjpcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLkVtcHR5OlxuICAgICAgICAgICAgICAgIHRoaXMuaXNEZWFkbHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuRGlydDpcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLkdyYXM6XG4gICAgICAgICAgICBjYXNlIEJsb2NrVHlwZS5Td2l0Y2hlcjpcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLlBvaXNvbjpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvL1doYXQgaGFwcGVucyBpZiB5b3Ugc3RlcCBvbiBhIGJsb2NrXG4gICAgb25TdGVwQ2FsbGJhY2s6IGZ1bmN0aW9uIG9uU3RlcENhbGxiYWNrKHBsYXllciwgZ2FtZSkge1xuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcbiAgICAgICAgLy8gUGVyZm9ybSB0aGUgYWN0aW9uIHRoZSBibG9jayBwcm9kdWNlcyhjaGFuZ2UgcGxheWVyIG9yIGVudmlyb25tZW50KVxuICAgICAgICBzd2l0Y2ggKHRoaXMuYmxvY2t0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIEJsb2NrVHlwZS5EaXJ0OlxuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuR3JhczpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLkVtcHR5OlxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLmZhbGwoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLlN3aXRjaGVyOlxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLmlzU3dhcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLlRyYXBkb29yOlxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbS5wbGF5KCd0cmFwZG9vcicpO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLmZhbGwoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLlBvaXNvbjpcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucGxheWVyLmlzSW52aW5jaWJsZSkgdGhpcy5wbGF5ZXIuaXNQb2lzb25lZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEJsb2NrVHlwZS5TcGlrZTpcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllck9uVG9wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaGFzS2lsbGVkKSB0aGlzLnBlcmZvcm1TcGlrZUtpbGwoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBlcmZvcm0gYmxvY2sgYW5pbWF0aW9uXG4gICAgICAgIHZhciBzdGVwRmluaXNoZWRDYWxsYmFjayA9IGNjLmNhbGxGdW5jKHRoaXMuZmluaXNoU3RlcCwgdGhpcyk7XG4gICAgICAgIC8vdmFyIGJsb2NrYWN0aW9uID0gY2Muc3Bhd24odGhpcy5hc3NlbWJsZUJsb2NrQWN0aW9uKCksIHRoaXMuZGVmb3JtKCkpO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKHRoaXMuc2hha2UoKSwgc3RlcEZpbmlzaGVkQ2FsbGJhY2spKTtcbiAgICAgICAgdGhpcy5wbGF5ZXIubm9kZS5ydW5BY3Rpb24odGhpcy5zaGFrZSgpKTtcbiAgICB9LFxuXG4gICAgLy9MZXQgYmxvY2tzIHNoYWtlIHdoZW4gdGhleSBhcmUgc3RlcHBlZCBvbiAoaW5jbHVkaW5nIHBsYXllcilcbiAgICBzaGFrZTogZnVuY3Rpb24gc2hha2UoKSB7XG4gICAgICAgIHZhciBkb3duID0gY2MubW92ZUJ5KDAuMiwgY2MucCgwLCAtMikpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25JbigpKTtcbiAgICAgICAgdmFyIHVwID0gY2MubW92ZUJ5KDAuMiwgY2MucCgwLCArMikpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25JbigpKTtcbiAgICAgICAgdmFyIHNoYWtlID0gY2Muc2VxdWVuY2UoZG93biwgdXApO1xuICAgICAgICByZXR1cm4gc2hha2U7XG4gICAgfSxcblxuICAgIGZpbmlzaFN0ZXA6IGZ1bmN0aW9uIGZpbmlzaFN0ZXAoKSB7fSxcblxuICAgIC8vIEFjdGlvbihBbmltYXRpb24gZXRjKSBmb3IgZXZlcnkgYmxvY2tcbiAgICBhc3NlbWJsZUJsb2NrQWN0aW9uOiBmdW5jdGlvbiBhc3NlbWJsZUJsb2NrQWN0aW9uKCkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMuYmxvY2t0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIEJsb2NrVHlwZS5FbXB0eTpcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLkRpcnQ6XG4gICAgICAgICAgICBjYXNlIEJsb2NrVHlwZS5HcmFzOlxuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuU3dpdGNoZXI6XG4gICAgICAgICAgICBjYXNlIEJsb2NrVHlwZS5Qb2lzb246XG4gICAgICAgICAgICBjYXNlIEJsb2NrVHlwZS5TcGlrZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gY2MubW92ZVRvKDAsIHRoaXMubm9kZS5nZXRQb3NpdGlvbigpKTtcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLlRyYXBkb3I6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNjLm1vdmVUbygxLCBjYy5wKHRoaXMubm9kZS5nZXRQb3NpdGlvblgoKSwgdGhpcy5ub2RlLmdldFBvc2l0aW9uWSgpIC0gMTAwKSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gUGFydCBvZiBhbmltYXRpb24gc2VlIGFib3ZlXG4gICAgZGVmb3JtOiBmdW5jdGlvbiBkZWZvcm0oKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5ibG9ja3R5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLkVtcHR5OlxuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuRGlydDpcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLkdyYXM6XG4gICAgICAgICAgICBjYXNlIEJsb2NrVHlwZS5Td2l0Y2hlcjpcbiAgICAgICAgICAgIGNhc2UgQmxvY2tUeXBlLlRyYXBkb29yOlxuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuUG9pc29uOlxuICAgICAgICAgICAgY2FzZSBCbG9ja1R5cGUuU3Bpa2U6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNjLm1vdmVUbygwLCB0aGlzLm5vZGUuZ2V0UG9zaXRpb24oKSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcGVyZm9ybVNwaWtlS2lsbDogZnVuY3Rpb24gcGVyZm9ybVNwaWtlS2lsbCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVhZGx5ICYmICF0aGlzLnBsYXllci5pc0ludmluY2libGUpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5oYXNLaWxsZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5raWxsKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5oYXNLaWxsZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge31cbiAgICB9LFxuXG4gICAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICB9LFxuXG4gICAgc2V0QmxvY2tlZDogZnVuY3Rpb24gc2V0QmxvY2tlZChib29sKSB7XG4gICAgICAgIHRoaXMuaXNCbG9ja2VkID0gYm9vbDtcbiAgICB9LFxuXG4gICAgaXNCbG9ja2VkOiBmdW5jdGlvbiBpc0Jsb2NrZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzQmxvY2tlZDtcbiAgICB9LFxuXG4gICAgc3dpdGNoRGVhZGx5OiBmdW5jdGlvbiBzd2l0Y2hEZWFkbHkoKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2lzRGVhZGx5OiAnLCB0aGlzLmlzRGVhZGx5KTtcbiAgICAgICAgdGhpcy5pc0RlYWRseSA9ICF0aGlzLmlzRGVhZGx5O1xuICAgICAgICB0aGlzLmhhc0tpbGxlZCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLnBsYXllck9uVG9wKSB0aGlzLnBlcmZvcm1TcGlrZUtpbGwoKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzcyODhmanNpWEZBbEwrTGlHZW5ROE9yJywgJ0Nsb3VkQW5pbWF0aW9uJyk7XG4vLyBzY3JpcHRzXFxzY2VuZXNjcmlwdHNcXENsb3VkQW5pbWF0aW9uLmpzXG5cbnZhciBjbG91ZHNwcml0ZXMgPSA3OyAvL0hvdyBtYW55IGNsb3VkIHNwcml0ZXMgd2UgaGF2ZSBpbiB0aGUgYXRsYXNcblxudmFyIGNsb3Vkc3Bhd25ZbWluID0gMTQwOyAvL1xudmFyIGNsb3Vkc3Bhd25ZbWF4ID0gMzYwOyAvL1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgY2xvdWRzQW1vdW50OiAwLFxuICAgICAgICBjbG91ZHNTcGVlZFZhcmlhbmNlOiAwLFxuXG4gICAgICAgIGJhY2tncm91bmQ6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIGNsb3Vkc2F0bGFzOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUF0bGFzXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuY2xvdWRzID0gW107XG4gICAgICAgIHRoaXMuc3BlZWRzID0gW107XG4gICAgICAgIHRoaXMuaW5pdGFsaXplQ2xvdWRzKCk7XG4gICAgfSxcblxuICAgIGluaXRhbGl6ZUNsb3VkczogZnVuY3Rpb24gaW5pdGFsaXplQ2xvdWRzKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2xvdWRzQW1vdW50OyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVDbG91ZChpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvL1JldHVybnMgYSBjbG91ZCBub2RlIGFzIFNwcml0ZSBmcm9tIGEgU3ByaXRlRnJhbWVcbiAgICBnZW5lcmF0ZUNsb3VkOiBmdW5jdGlvbiBnZW5lcmF0ZUNsb3VkKGlkKSB7XG4gICAgICAgIHZhciBybmRtID0gdGhpcy5yYW5kb21JblJhbmdlSW5jbHVzaXZlKDEsIHRoaXMuY2xvdWRzcHJpdGVzKTtcbiAgICAgICAgdmFyIGNsb3Vkc3ByaXRlID0gdGhpcy5jbG91ZHNhdGxhcy5nZXRTcHJpdGVGcmFtZSh0aGlzLmdldENsb3VkUmFuZG9tU3ByaXRlKHJuZG0pKTtcblxuICAgICAgICB2YXIgeCA9IHRoaXMucmFuZG9tSW5SYW5nZUluY2x1c2l2ZSgtNzAwLCAtODAwKTtcbiAgICAgICAgdmFyIHkgPSB0aGlzLnJhbmRvbUluUmFuZ2VJbmNsdXNpdmUoY2xvdWRzcGF3blltaW4sIGNsb3Vkc3Bhd25ZbWF4KTtcbiAgICAgICAgdmFyIG5vZGUgPSBuZXcgY2MuTm9kZShcIk5ldyBDbG91ZFNwcml0ZVwiKTtcbiAgICAgICAgbm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgbm9kZS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5zcHJpdGVGcmFtZSA9IGNsb3Vkc3ByaXRlO1xuICAgICAgICBub2RlLnNldFBvc2l0aW9uKGNjLnAoeCwgeSkpO1xuXG4gICAgICAgIHRoaXMuY2xvdWRzW2lkXSA9IG5vZGU7XG4gICAgICAgIHRoaXMuc3BlZWRzW2lkXSA9IHRoaXMucmFuZG9tSW5SYW5nZUluY2x1c2l2ZSgxLCB0aGlzLmNsb3Vkc1NwZWVkVmFyaWFuY2UpO1xuXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5hZGRDaGlsZChub2RlKTtcbiAgICB9LFxuXG4gICAgdXBkYXRlQ2xvdWQ6IGZ1bmN0aW9uIHVwZGF0ZUNsb3VkKGNsb3VkSWQsIGR0KSB7XG4gICAgICAgIHZhciBjbG91ZCA9IHRoaXMuY2xvdWRzW2Nsb3VkSWRdO1xuICAgICAgICB2YXIgc3BlZWQgPSB0aGlzLnNwZWVkc1tjbG91ZElkXTtcbiAgICAgICAgdmFyIHggPSBjbG91ZC5nZXRQb3NpdGlvblgoKTtcblxuICAgICAgICBpZiAoeCA+IDU1MCkge1xuICAgICAgICAgICAgLy9jYW52YXMud2lkdGgrY2xvdWQuZ2V0Q29udGVudFNpemUoKS53aWR0aCAvL0Nsb3VkIGlzIG91dHNpZGUgdGhlIGZyYW1lXG4gICAgICAgICAgICBjbG91ZC5kZXN0cm95KCk7IC8vZGVzdHJveSB0aGlzIGNsb3VkIC4uXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlQ2xvdWQoY2xvdWRJZCk7IC8vYW5kIGNyZWF0ZSBhIG5ldyBvbmVcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB5ID0gY2xvdWQuZ2V0UG9zaXRpb25ZKCk7XG4gICAgICAgIGNsb3VkLnNldFBvc2l0aW9uKGNjLnAoeCArIHNwZWVkICogMiAqIGR0LCB5KSk7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNsb3Vkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVDbG91ZChpLCBkdCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy9cbiAgICAvLyBIZWxwaW5nIGZ1bmN0aW9uc1xuICAgIC8vXG4gICAgZ2V0Q2xvdWRSYW5kb21TcHJpdGU6IGZ1bmN0aW9uIGdldENsb3VkUmFuZG9tU3ByaXRlKGludCkge1xuICAgICAgICBzd2l0Y2ggKGludCkge1xuICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgIHJldHVybiBcImNsb3VkXzAxXCI7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiY2xvdWRfMDJcIjtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJjbG91ZF8wM1wiO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIHJldHVybiBcImNsb3VkXzA0XCI7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiY2xvdWRfMDVcIjtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJjbG91ZF8wNlwiO1xuICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgIHJldHVybiBcImNsb3VkXzA3XCI7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBcImNsb3VkXzAxXCI7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmFuZG9tSW5SYW5nZUluY2x1c2l2ZTogZnVuY3Rpb24gcmFuZG9tSW5SYW5nZUluY2x1c2l2ZShtaW4sIG1heCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2ZlMTNjNmppOTFJR0tBYUQxY0dwZlNLJywgJ0RpcnQnKTtcbi8vIHNjcmlwdHNcXGdhbWVmaWVsZFxcYmxvY2tzXFxEaXJ0LmpzXG5cbnZhciBCbG9ja1R5cGUgPSByZXF1aXJlKCdUeXBlcycpLkJsb2NrVHlwZTtcbnZhciBQbGF5ZXJNb3ZlbWVudFN0YXRlID0gcmVxdWlyZSgnU3RhdGVzJykuUGxheWVyTW92ZW1lbnRTdGF0ZTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpc0Jsb2NrZWQ6IGZhbHNlLFxuICAgICAgICBoYXNJdGVtOiBmYWxzZSxcblxuICAgICAgICBibG9ja3R5cGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogQmxvY2tUeXBlLk5vbmUsXG4gICAgICAgICAgICB0eXBlOiBCbG9ja1R5cGVcbiAgICAgICAgfSxcblxuICAgICAgICBpdGVtOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJPblRvcCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBvblN0ZXBDYWxsYmFjazogZnVuY3Rpb24gb25TdGVwQ2FsbGJhY2socGxheWVyLCBnYW1lKSB7XG4gICAgICAgIGNjLmxvZygnTTogb25TdGVwQ2FsbGJhY2sgRGlydCcpO1xuICAgIH0sXG5cbiAgICBjb2xsaWRlOiBmdW5jdGlvbiBjb2xsaWRlKCkge31cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2JlZWFmUWoxTGhIa0xERWtoekRWMyswJywgJ0VtcHR5Jyk7XG4vLyBzY3JpcHRzXFxnYW1lZmllbGRcXGJsb2Nrc1xcRW1wdHkuanNcblxudmFyIEJsb2NrVHlwZSA9IHJlcXVpcmUoJ1R5cGVzJykuQmxvY2tUeXBlO1xudmFyIFBsYXllck1vdmVtZW50U3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5QbGF5ZXJNb3ZlbWVudFN0YXRlO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8qZ2FtZWZpZWxkOiB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGUsXHJcbiAgICAgICAgfSwqL1xuXG4gICAgICAgIGlzQmxvY2tlZDogZmFsc2UsXG4gICAgICAgIGhhc0l0ZW06IGZhbHNlLFxuXG4gICAgICAgIGJsb2NrdHlwZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBCbG9ja1R5cGUuTm9uZSxcbiAgICAgICAgICAgIHR5cGU6IEJsb2NrVHlwZVxuICAgICAgICB9LFxuXG4gICAgICAgIGl0ZW06IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnBsYXllck9uVG9wID0gZmFsc2U7XG4gICAgfSxcblxuICAgIG9uU3RlcENhbGxiYWNrOiBmdW5jdGlvbiBvblN0ZXBDYWxsYmFjayhwbGF5ZXIsIGdhbWUpIHtcbiAgICAgICAgLy8gUGVyZm9ybSB0aGUgYWN0aW9uIHRoZSBibG9jayBwcm9kdWNlcyhjaGFuZ2UgcGxheWVyIG9yIGVudmlyb25tZW50KVxuICAgICAgICBwbGF5ZXIuZmFsbCgpO1xuICAgIH0sXG5cbiAgICBjb2xsaWRlOiBmdW5jdGlvbiBjb2xsaWRlKCkge1xuICAgICAgICBjYy5sb2coJ3dpciBzaW5kIGluIGRlciBNZXRob2RlJyk7XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnODk0M2RUb1ByQkpKWUQ2ckdLaDFSZGknLCAnRm9lJyk7XG4vLyBzY3JpcHRzXFxnYW1lb2JqZWN0c1xcRm9lLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc2OWU3NjkwODF4R05iRFpCbXJEUkxGdScsICdHYW1lQnV0dG9uQ2FsbGJhY2tzJyk7XG4vLyBzY3JpcHRzXFxzY2VuZXNjcmlwdHNcXEdhbWVCdXR0b25DYWxsYmFja3MuanNcblxudmFyIEdhbWVTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLkdhbWVTdGF0ZTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBwYXVzZU92ZXJsYXk6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICBzY29yZUxhYmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuXG4gICAgICAgIGJ1dHRvbkF1ZGlvOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuXG4gICAgICAgIGdhbWU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgLyppZihnYW1lICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuc2NvcmVMYWJlbC5zdHJpbmcgPSBcIlNjb3JlOiBcIitnYW1lLmdldENvbXBvbmVudCgnR2FtZScpLnNjb3JlLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICovXG4gICAgICAgIHRoaXMuc2NvcmUgPSBjYy5zeXMubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Njb3JlJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTY29yZSBpbiBHYW1lQnV0dG9uQ2FsbGJhY2s6ICcsIHRoaXMuc2NvcmUpO1xuICAgICAgICBpZiAodGhpcy5zY29yZUxhYmVsICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnU0NPUkVMQUJFTCcpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5zY29yZUxhYmVsKTtcbiAgICAgICAgICAgIHRoaXMuc2NvcmVMYWJlbC5zdHJpbmcgPSBcIlNjb3JlOiBcIiArIHRoaXMuc2NvcmUudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhdXNlZCA9IGZhbHNlOyAvLyBUT0RPOiBzcHJlYWQgdGhpcyB0byB0aGUgb3V0ZXIgd29ybGRcbiAgICB9LFxuXG4gICAgcGF1c2VDb250cm9sQ2FsbGJhY2s6IGZ1bmN0aW9uIHBhdXNlQ29udHJvbENhbGxiYWNrKCkge1xuICAgICAgICAvL1RPRE86IGNoYW5nZSBwYXVzZSBidXR0b24gdG8gZGlmZmVyZW50IHNwcml0ZVxuICAgICAgICBpZiAodGhpcy5wYXVzZWQpIHtcbiAgICAgICAgICAgIHRoaXMucGF1c2VPdmVybGF5Lm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IucmVzdW1lKCk7XG4gICAgICAgICAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnN0YXRlID0gR2FtZVN0YXRlLlBsYXlpbmc7XG5cbiAgICAgICAgICAgIGNjLmxvZyhcInJlc3VtZVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGF1c2VPdmVybGF5Lm9wYWNpdHkgPSAyNTU7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5wYXVzZSgpO1xuICAgICAgICAgICAgdGhpcy5wYXVzZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnN0YXRlID0gR2FtZVN0YXRlLlBhdXNlZDtcbiAgICAgICAgICAgIGNjLmxvZyhcInBhdXNlZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5idXR0b25BdWRpbywgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBhZ2FpbkNvbnRyb2xDYWxsYmFjazogZnVuY3Rpb24gYWdhaW5Db250cm9sQ2FsbGJhY2soKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnR2FtZVNjZW5lJyk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5idXR0b25BdWRpbywgZmFsc2UpO1xuICAgIH0sXG5cbiAgICBiYWNrQ29udHJvbENhbGxiYWNrOiBmdW5jdGlvbiBiYWNrQ29udHJvbENhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUgPSBHYW1lU3RhdGUuRW5kZWQ7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnU3RhcnRtZW51Jyk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5idXR0b25BdWRpbywgZmFsc2UpO1xuICAgIH1cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdlMDAxZittTVdOTjVZaFh5a0xkTUZMWicsICdHYW1lRmllbGQnKTtcbi8vIHNjcmlwdHNcXGdhbWVmaWVsZFxcR2FtZUZpZWxkLmpzXG5cbi8vR2FtZUZpZWxkXG5cbnZhciBMZXZlbCA9IHJlcXVpcmUoJ0xldmVsJyk7XG52YXIgQmxvY2tUeXBlID0gcmVxdWlyZSgnVHlwZXMnKS5CbG9ja1R5cGU7XG52YXIgSXRlbVR5cGUgPSByZXF1aXJlKCdUeXBlcycpLkl0ZW1UeXBlO1xudmFyIEdhbWVTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLkdhbWVTdGF0ZTtcblxudmFyIHN0YXJ0WCA9IDExMztcbnZhciBzdGFydFkgPSA1MDE7XG5cbnZhciBkaXN0WCA9IDgzO1xudmFyIGRpc3RZID0gNjU7XG5cbnZhciBzcGF3bk9mZlNldFkgPSAyMDA7XG52YXIgZGVzcGF3bk9mZlNldFkgPSAtMTAwO1xudmFyIHlTcGF3blBvc2l0aW9uID0gNDg1O1xuXG52YXIgZmxvYXRBYm92ZUN1YmUgPSBbMSwgMiwgMywgNCwgNSwgNl07XG52YXIgcmlnaHRPblRvcE9mQ3ViZSA9IFs3LCA4LCA5LCAxMF07XG5cbnZhciBzdGFydEZpZWxkID0gW1s3LCAxLCAyLCAyLCAxLCA3XSwgWzcsIDEsIDUsIDEsIDIsIDEsIDddLCBbNywgMiwgMSwgMSwgMiwgN10sIFs3LCAyLCAxLCAxLCAxLCAyLCA3XSwgWzcsIDIsIDEsIDEsIDIsIDddLCBbNywgMSwgMiwgMSwgNSwgMSwgN10sIFs3LCAxLCAyLCAyLCAxLCA3XSwgWzcsIDEsIDEsIDIsIDEsIDEsIDddXG4vKls3LDEsMSwxLDEsMF0sXHJcbiBbNywxLDEsMSwxLDEsMF0sXHJcbiBbNywxLDEsNCw0LDVdLFxyXG4gWzcsMSwxLDEsNSwxLDBdLFxyXG4gWzcsMSwxLDEsMSwwXSxcclxuIFs3LDUsNiwzLDEsMSwwXSxcclxuIFs3LDEsMSw1LDEsMF0sXHJcbiBbNywxLDEsMSwxLDEsMF0sKi9cbl07XG5cbi8vQXJyYXkgZm9yIGVhY2ggaW5kaXZpZHVhbCBibG9ja1xudmFyIHB1ZmZlckZpZWxkID0gW1s3LCAxLCA2LCA2LCA2LCAxLCA3XSwgWzcsIDEsIDIsIDIsIDEsIDddLCBbNywgMSwgMywgMSwgMywgMSwgN10sIFs3LCAxLCAyLCAyLCAxLCA3XSwgWzcsIDEsIDIsIDEsIDIsIDEsIDddLCBbNywgMywgMiwgMiwgMywgN10sIFs3LCA3LCAxLCAxLCAxLCA3LCA3XSwgWzcsIDEsIDEsIDQsIDQsIDddLCBbNywgNCwgMSwgNCwgMSwgNCwgN10sIFs3LCA0LCAxLCAxLCAxLCA3XSwgWzcsIDQsIDEsIDEsIDEsIDEsIDddLCBbNywgNSwgMSwgNSwgMSwgN10sIFs3LCAxLCAxLCAxLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddLCBbNywgNiwgMSwgMSwgMSwgMSwgN10sIFs3LCAxLCAxLCAxLCAxLCA3XV07XG4vKlxyXG4gVGhlIGl0ZW1zLWFycmF5IGhhcyB0aGUgc2FtZSBkaW1lbnNpb25zIGFzIHRoZSBzdGFydEZpZWxkLiBFYWNoIGl0ZW0gd2lsbCBiZSBhIGNoaWxkIG9mIHRoZSBjb3JyZXNwb25kaW5nIGJsb2NrIChzZWVuIGFzIGEgbGF5b3ZlcikuXHJcbiAvLyAwLkVtcHR5LCAxLmFudGlkb3RlTGVmdCwgMi5hbnRpZG90ZVJpZ2h0LCAzLmNvaW5MZWZ0LCA0LmNvaW5SaWdodCwgNS5zdGFyTGVmdCxcclxuIC8vIDYuc3RhclJpZ2h0LCA3LkJsb2NrZWRCdXNoLCA4LkJsb2NrZWRTdG9uZSwgOS5TbG93RG93bkJvdHRvbSwgOS5TbG93RG93blRvcFxyXG4gLy9UT0RPOiAxMC5XYXRlckxlZnQsIDExLldhdGVyUmlnaHQgKi9cbnZhciBzdGFydEZpZWxkSXRlbXMgPSBbWzAsIDgsIDAsIDAsIDgsIDBdLCBbMCwgOCwgMCwgNywgMCwgOCwgMF0sIFswLCAwLCA3LCA3LCAyLCAwXSwgWzAsIDYsIDcsIDcsIDcsIDAsIDBdLCBbMCwgMCwgNywgNywgMCwgMF0sIFswLCA3LCA0LCA3LCAwLCA3LCAwXSwgWzAsIDcsIDAsIDAsIDcsIDBdLCBbMCwgOCwgOCwgMCwgOCwgOCwgMF1dO1xuXG4vKlxyXG4gVGhlIGl0ZW1zLWFycmF5IGhhcyB0aGUgc2FtZSBkaW1lbnNpb25zIGFzIHRoZSBwdWZmZXJGaWVsZC4gRWFjaCBpdGVtIHdpbGwgYmUgYSBjaGlsZCBvZiB0aGUgY29ycmVzcG9uZGluZyBibG9jayAoc2VlbiBhcyBhIGxheW92ZXIpLlxyXG4gLy8gMC5FbXB0eSwgMS5hbnRpZG90ZUxlZnQsIDIuYW50aWRvdGVSaWdodCwgMy5jb2luTGVmdCwgNC5jb2luUmlnaHQsIDUuc3RhckxlZnQsXHJcbiAvLyA2LnN0YXJSaWdodCwgNy5CbG9ja2VkQnVzaCwgOC5CbG9ja2VkU3RvbmUsIDkuU2xvd0Rvd25Cb3R0b20sIDkuU2xvd0Rvd25Ub3BcclxuIC8vVE9ETzogMTAuV2F0ZXJMZWZ0LCAxMS5XYXRlclJpZ2h0ICovXG52YXIgcHVmZmVyRmllbGRJdGVtcyA9IFtbMCwgOCwgMCwgMCwgMCwgOCwgMF0sIFswLCA4LCAwLCAwLCA4LCAwXSwgWzAsIDgsIDAsIDAsIDAsIDgsIDBdLCBbMCwgOCwgMCwgMCwgOCwgMF0sIFswLCA4LCAwLCA3LCAwLCA4LCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgOSwgNywgOSwgMCwgMF0sIFswLCA5LCA3LCAwLCAwLCAwXSwgWzAsIDAsIDcsIDAsIDcsIDAsIDBdLCBbMCwgMCwgNywgOSwgOSwgMF0sIFswLCAwLCA3LCA3LCAwLCA3LCAwXSwgWzAsIDAsIDcsIDAsIDgsIDBdLCBbMCwgMCwgMCwgMCwgMCwgNywgMF0sIFswLCAwLCAwLCA3LCAwLCAwXSwgWzAsIDAsIDcsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMiwgMCwgMF1dO1xuXG52YXIgbmV4dEZpcnN0TGluZSA9IDA7XG52YXIgbmV4dEZpcnN0TGluZUl0ZW0gPSAwO1xuXG52YXIgbmV3Q3ViZSA9IG51bGw7XG52YXIgbmV3SXRlbSA9IG51bGw7XG5cbmNjLkNsYXNzKHtcblx0J2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cblx0cHJvcGVydGllczoge1xuXHRcdGdyaWRTaXplWDogMCwgLy8gUm93cyAtIGRvbnQgY2hhbmdlIGhlcmUgYnV0IGluIGNvY29zIGNyZWF0b3IhIVxuXHRcdGdyaWRTaXplWTogMCwgLy8gQ29sdW1uc1xuXG5cdFx0ZGVzcGF3bkhlaWdodDogMCxcblxuXHRcdGl0ZW06IHtcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLk5vZGVcblx0XHR9LFxuXG5cdFx0Ly9CbG9ja3Mgc3RhcnQgaGVyZVxuXHRcdEVtcHR5OiB7IC8vMFx0XHRFTVBUWVxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRHcmFzczogeyAvLzFcdFx0R1JBU1Ncblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0RGlydDogeyAvLzJcdFx0RElSVFxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRUcmFwZG9vcjogeyAvLzNcdFx0VFJBUERPT1Jcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0U3dpdGNoZXI6IHsgLy80XHRcdFNXSVRDSEVSXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdFBvaXNvbjogeyAvLzVcdFx0UE9JU09OXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdFNwaWtlOiB7IC8vNlx0XHRTUElLRVxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRXYXRlckM6IHsgLy83XHRcdFdBVEVSIChMaWtlIEVNUFRZKVxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblxuXHRcdC8vIEdhbWUgcmVmZXJlbmNlIHRvIHBhc3MgZmllbGRcblx0XHRnYW1lOiB7XG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5Ob2RlXG5cdFx0fSxcblxuXHRcdC8vSXRlbXMgc3RhcnQgaGVyZVxuXHRcdEFudGlkb3RlTDogeyAvLzFcdFx0QW50aWRvdGVMXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdEFudGlkb3RlUjogeyAvLzJcdFx0QW50aWRvdGVSXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdENvaW5MOiB7IC8vM1x0XHRDb2luTFxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRDb2luUjogeyAvLzRcdFx0Q29pblJcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0U3Rhckw6IHsgLy81XHRcdFN0YXJMXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdFN0YXJSOiB7IC8vNlx0XHRTdGFyUlxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblxuXHRcdEJsb2NrZWRCdXNoOiB7IC8vN1x0XHRCbG9ja2VkQnVzaFxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRCbG9ja2VkU3RvbmU6IHsgLy84XHRcdEJsb2NrZWRTdG9uZVxuXHRcdFx0J2RlZmF1bHQnOiBudWxsLFxuXHRcdFx0dHlwZTogY2MuUHJlZmFiXG5cdFx0fSxcblx0XHRTbG93RG93bkJvdHRvbTogeyAvLzlcdFx0U2xvd0Rvd25Cb3R0b20gKEJvdHRvbSBhbmQgVG9wIGFyZSBhbHdheXMgdG9nZXRoZXIpXG5cdFx0XHQnZGVmYXVsdCc6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdFNsb3dEb3duVG9wOiB7IC8vOVx0XHRTbG93RG93blRvcCAoQm90dG9tIGFuZCBUb3AgYXJlIGFsd2F5cyB0b2dldGhlcilcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH0sXG5cdFx0LypcclxuICAgV2F0ZXJMZWZ0OiB7XHRcdFx0XHRcdFx0Ly8xMFx0XHRXYXRlckxlZnRcclxuICAgZGVmYXVsdDogbnVsbCxcclxuICAgdHlwZTogY2MuUHJlZmFiLFxyXG4gICB9LCovXG5cdFx0V2F0ZXJSaWdodDogeyAvLzExXHRcdFdhdGVyUmlnaHRcblx0XHRcdCdkZWZhdWx0JzogbnVsbCxcblx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdH1cblxuXHR9LFxuXG5cdC8vUGxheWVyXG5cdC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuXHRvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcblx0XHQvL3JlZ2lzdGVyIGdhbWVmaWVsZCBhdCBnYW1lIGZvciBwcm9jZXNzaW5nIGdhbWVmaWVsZCBsb2dpY1xuXHRcdHRoaXMuZ2FtZS5nZXRDb21wb25lbnQoJ0dhbWUnKS5nYW1lZmllbGQgPSB0aGlzO1xuXG5cdFx0dGhpcy5wbGF5ZXIgPSBudWxsOyAvLyBsb2FkIGxhdGVyIHdoZW4gcGxheWVyIHJhbiBvbkxvYWQoKVxuXHRcdHRoaXMuY291bnQgPSAwO1xuXHRcdHRoaXMuZ2FtZUZpZWxkID0gW107XG5cdFx0dGhpcy5pdGVtcyA9IFtdO1xuXG5cdFx0dGhpcy5kaXNUWCA9IGRpc3RYO1xuXHRcdHRoaXMuZGlzVFkgPSBkaXN0WTtcblx0XHR0aGlzLnJlc2V0QXJyYXlzKCk7XG5cdFx0dGhpcy5pbml0aWFsaXplRmllbGQoKTtcblxuXHRcdHRoaXMuZ2FtZS5nZXRDb21wb25lbnQoJ0dhbWUnKS5vbkdhbWVGaWVsZExvYWRDYWxsYmFjaygpO1xuXHR9LFxuXG5cdHJlc2V0QXJyYXlzOiBmdW5jdGlvbiByZXNldEFycmF5cygpIHtcblx0XHRuZXh0Rmlyc3RMaW5lID0gMDtcblx0XHRuZXh0Rmlyc3RMaW5lSXRlbSA9IDA7XG5cdFx0cHVmZmVyRmllbGQgPSBbWzcsIDEsIDYsIDYsIDYsIDEsIDddLCBbNywgMSwgMiwgMiwgMSwgN10sIFs3LCAxLCAzLCAxLCAzLCAxLCA3XSwgWzcsIDEsIDIsIDIsIDEsIDddLCBbNywgMSwgMiwgMSwgMiwgMSwgN10sIFs3LCAzLCAyLCAyLCAzLCA3XSwgWzcsIDcsIDEsIDEsIDEsIDcsIDddLCBbNywgMSwgMSwgNCwgNCwgN10sIFs3LCA0LCAxLCA0LCAxLCA0LCA3XSwgWzcsIDQsIDEsIDEsIDEsIDddLCBbNywgNCwgMSwgMSwgMSwgMSwgN10sIFs3LCA1LCAxLCA1LCAxLCA3XSwgWzcsIDEsIDEsIDEsIDEsIDEsIDddLCBbNywgMSwgMSwgMSwgMSwgN10sIFs3LCA2LCAxLCAxLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddXTtcblx0XHRwdWZmZXJGaWVsZEl0ZW1zID0gW1swLCA4LCAwLCAwLCAwLCA4LCAwXSwgWzAsIDgsIDAsIDAsIDgsIDBdLCBbMCwgOCwgMCwgMCwgMCwgOCwgMF0sIFswLCA4LCAwLCAwLCA4LCAwXSwgWzAsIDgsIDAsIDcsIDAsIDgsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCA5LCA3LCA5LCAwLCAwXSwgWzAsIDksIDcsIDAsIDAsIDBdLCBbMCwgMCwgNywgMCwgNywgMCwgMF0sIFswLCAwLCA3LCA5LCA5LCAwXSwgWzAsIDAsIDcsIDcsIDAsIDcsIDBdLCBbMCwgMCwgNywgMCwgOCwgMF0sIFswLCAwLCAwLCAwLCAwLCA3LCAwXSwgWzAsIDAsIDAsIDcsIDAsIDBdLCBbMCwgMCwgNywgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAyLCAwLCAwXV07XG5cdH0sXG5cblx0aW5pdGlhbGl6ZUZpZWxkOiBmdW5jdGlvbiBpbml0aWFsaXplRmllbGQoKSB7XG5cdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCBzdGFydEZpZWxkLmxlbmd0aDsgeSsrKSB7XG5cdFx0XHR0aGlzLmdhbWVGaWVsZFt5XSA9IFtdO1xuXHRcdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBzdGFydEZpZWxkW3ldLmxlbmd0aDsgeCsrKSB7XG5cdFx0XHRcdGlmIChzdGFydEZpZWxkW3ldLmxlbmd0aCAlIDIgPT09IDApIHtcblx0XHRcdFx0XHRuZXdDdWJlID0gdGhpcy5zcGF3bkN1YmUoc3RhcnRYICsgeCAqIGRpc3RYLCBzdGFydFkgLSBkaXN0WSAqIHksIHN0YXJ0RmllbGRbeV1beF0sIHN0YXJ0RmllbGRJdGVtc1t5XVt4XSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bmV3Q3ViZSA9IHRoaXMuc3Bhd25DdWJlKHN0YXJ0WCArIHggKiBkaXN0WCAtIGRpc3RYIC8gMiwgc3RhcnRZIC0gZGlzdFkgKiB5LCBzdGFydEZpZWxkW3ldW3hdLCBzdGFydEZpZWxkSXRlbXNbeV1beF0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuZ2FtZUZpZWxkW3ldW3hdID0gbmV3Q3ViZTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0LyogRGlzcGxhY2VzIHRoZSBlbnRpcmUgZ2FtZWZpZWxkIGJ5ICpTcGVlZCotUGl4ZWxcclxuICAqIEluIGNhc2UgYm9yZGVyIGlzIGNyb3NzZWQgLT4gZGVsZXRlIGxvd2VzdCByb3cgKi9cblx0dXBkYXRlRmllbGRQb3NpdGlvbjogZnVuY3Rpb24gdXBkYXRlRmllbGRQb3NpdGlvbihzcGVlZCkge1xuXHRcdGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5nYW1lRmllbGQubGVuZ3RoOyB5KyspIHtcblx0XHRcdGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5nYW1lRmllbGRbeV0ubGVuZ3RoOyB4KyspIHtcblx0XHRcdFx0dmFyIHBvc1ggPSB0aGlzLmdhbWVGaWVsZFt5XVt4XS5nZXRQb3NpdGlvblgoKTtcblx0XHRcdFx0dmFyIHBvc1kgPSB0aGlzLmdhbWVGaWVsZFt5XVt4XS5nZXRQb3NpdGlvblkoKTtcblx0XHRcdFx0dGhpcy5nYW1lRmllbGRbeV1beF0uc2V0UG9zaXRpb24ocG9zWCwgcG9zWSArIHNwZWVkKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy51cGRhdGVQbGF5ZXJQb3NpdGlvbihzcGVlZCk7XG5cdFx0Lyp2YXIgZmllbGR4ID0gIHRoaXMubm9kZS5nZXRQb3NpdGlvblgoKTsgLy9CVUdHWVxyXG4gIHZhciBmaWVsZHkgPSB0aGlzLm5vZGUuZ2V0UG9zaXRpb25ZKCk7XHJcbiAgdGhpcy5ub2RlLnNldFBvc2l0aW9uKGZpZWxkeCwgZmllbGR5K3NwZWVkKTsgKi9cblx0XHRpZiAodGhpcy5nYW1lRmllbGRbdGhpcy5nYW1lRmllbGQubGVuZ3RoIC0gMV1bMF0uZ2V0UG9zaXRpb25ZKCkgPD0gdGhpcy5kZXNwYXduSGVpZ2h0KSB7XG5cdFx0XHR0aGlzLmRlc3Ryb3lMaW5lKHRoaXMuZ2FtZUZpZWxkLmxlbmd0aCAtIDEpO1xuXHRcdFx0dGhpcy5yZWFycmFuZ2VHYW1lRmllbGQoKTtcblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH0sXG5cblx0dXBkYXRlUGxheWVyUG9zaXRpb246IGZ1bmN0aW9uIHVwZGF0ZVBsYXllclBvc2l0aW9uKHNwZWVkKSB7XG5cdFx0dmFyIHggPSB0aGlzLnBsYXllci5ub2RlLmdldFBvc2l0aW9uWCgpO1xuXHRcdHZhciB5ID0gdGhpcy5wbGF5ZXIubm9kZS5nZXRQb3NpdGlvblkoKTtcblx0XHR0aGlzLnBsYXllci5ub2RlLnNldFBvc2l0aW9uKHgsIHkgKyBzcGVlZCk7XG5cdH0sXG5cblx0dXBkYXRlUGxheWVyQXJyYXlQb3M6IGZ1bmN0aW9uIHVwZGF0ZVBsYXllckFycmF5UG9zKCkge1xuXHRcdGlmICh0aGlzLmdhbWVGaWVsZFt0aGlzLnBsYXllci5hcnJheVBvc1ldLmxlbmd0aCAlIDIgPT0gMCkge1xuXHRcdFx0aWYgKHRoaXMucGxheWVyLmRpciA8IDApIHtcblx0XHRcdFx0dGhpcy5wbGF5ZXIuYXJyYXlQb3NYID0gdGhpcy5wbGF5ZXIuYXJyYXlQb3NYICsgMTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHRoaXMucGxheWVyLmRpciA+IDApIHtcblx0XHRcdFx0dGhpcy5wbGF5ZXIuYXJyYXlQb3NYID0gdGhpcy5wbGF5ZXIuYXJyYXlQb3NYIC0gMTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLnBsYXllci5hcnJheVBvc1kgPSB0aGlzLnBsYXllci5hcnJheVBvc1kgLSAxO1xuXHR9LFxuXG5cdHNldFBsYXllclN0YXJ0OiBmdW5jdGlvbiBzZXRQbGF5ZXJTdGFydChwbGF5ZXIpIHtcblx0XHR2YXIgbWlkID0gTWF0aC5yb3VuZChOdW1iZXIodGhpcy5nYW1lRmllbGRbdGhpcy5nYW1lRmllbGQubGVuZ3RoIC0gMV0ubGVuZ3RoIC8gMikpIC0gMTtcblx0XHR2YXIgc3RhcnRGaWVsZCA9IHRoaXMuZ2FtZUZpZWxkW3RoaXMuZ2FtZUZpZWxkLmxlbmd0aCAtIDFdW21pZF07XG5cdFx0cGxheWVyLmFycmF5UG9zWCA9IG1pZDtcblx0XHRwbGF5ZXIuYXJyYXlQb3NZID0gdGhpcy5nYW1lRmllbGQubGVuZ3RoIC0gMTtcblx0XHRwbGF5ZXIub2xkRGVzdCA9IHN0YXJ0RmllbGQ7XG5cdFx0dmFyIHN0YXJ0cG9zID0gY2MucChzdGFydEZpZWxkLmdldFBvc2l0aW9uWCgpLCBzdGFydEZpZWxkLmdldFBvc2l0aW9uWSgpICsgcGxheWVyLm9mZnNldFkpO1xuXHRcdHBsYXllci5ub2RlLnNldFBvc2l0aW9uKHN0YXJ0cG9zKTtcblx0fSxcblxuXHRnZXRKdW1wRmllbGQ6IGZ1bmN0aW9uIGdldEp1bXBGaWVsZChkaXIpIHtcblx0XHRpZiAodGhpcy5nYW1lRmllbGRbdGhpcy5wbGF5ZXIuYXJyYXlQb3NZXS5sZW5ndGggJSAyID09IDApIHtcblx0XHRcdGlmIChkaXIgPiAwKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmdhbWVGaWVsZFt0aGlzLnBsYXllci5hcnJheVBvc1kgLSAxXVt0aGlzLnBsYXllci5hcnJheVBvc1hdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2FtZUZpZWxkW3RoaXMucGxheWVyLmFycmF5UG9zWSAtIDFdW3RoaXMucGxheWVyLmFycmF5UG9zWCArIDFdO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoZGlyID4gMCkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5nYW1lRmllbGRbdGhpcy5wbGF5ZXIuYXJyYXlQb3NZIC0gMV1bdGhpcy5wbGF5ZXIuYXJyYXlQb3NYIC0gMV07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5nYW1lRmllbGRbdGhpcy5wbGF5ZXIuYXJyYXlQb3NZIC0gMV1bdGhpcy5wbGF5ZXIuYXJyYXlQb3NYXTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0ZGVzdHJveUxpbmU6IGZ1bmN0aW9uIGRlc3Ryb3lMaW5lKGxpbmUpIHtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZ2FtZUZpZWxkW2xpbmVdLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR0aGlzLmRlc3Ryb3lCbG9jayh0aGlzLmdhbWVGaWVsZFtsaW5lXVtpXSk7XG5cdFx0fVxuXHR9LFxuXG5cdGRlc3Ryb3lCbG9jazogZnVuY3Rpb24gZGVzdHJveUJsb2NrKGJsb2NrKSB7XG5cdFx0dmFyIGZhbGwgPSBjYy5tb3ZlVG8oMSwgY2MucChibG9jay5nZXRQb3NpdGlvbigpLngsIGRlc3Bhd25PZmZTZXRZKSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbkluKCkpO1xuXHRcdHZhciBmYWRlID0gY2MuZmFkZU91dCgxLjUpO1xuXHRcdGJsb2NrLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy5zcGF3bihmYWxsLCBmYWRlKSwgY2MuY2FsbEZ1bmModGhpcy5kZXN0cm95QmxvY2tEYXRhLCB0aGlzKSkpO1xuXHR9LFxuXG5cdGRlc3Ryb3lCbG9ja0RhdGE6IGZ1bmN0aW9uIGRlc3Ryb3lCbG9ja0RhdGEoYmxvY2spIHtcblx0XHRibG9jay5kZXN0cm95KCk7XG5cdH0sXG5cblx0cmVhcnJhbmdlR2FtZUZpZWxkOiBmdW5jdGlvbiByZWFycmFuZ2VHYW1lRmllbGQoKSB7XG5cdFx0dmFyIG5ld2FycmF5ID0gW107XG5cdFx0dmFyIHggPSB0aGlzLmdhbWVGaWVsZFsxXVswXS5nZXRQb3NpdGlvblgoKTtcblx0XHRuZXdhcnJheVswXSA9IHRoaXMuY3JlYXRlRmlyc3RMaW5lKHgpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5nYW1lRmllbGQubGVuZ3RoIC0gMTsgaSsrKSB7XG5cdFx0XHRuZXdhcnJheVtpICsgMV0gPSB0aGlzLmdhbWVGaWVsZFtpXTtcblx0XHR9XG5cdFx0dGhpcy5nYW1lRmllbGQgPSBuZXdhcnJheTtcblx0XHR0aGlzLmFkZFpPcmRlclRvR2FtZUZpZWxkKCk7XG5cdFx0dGhpcy5wbGF5ZXIuYXJyYXlQb3NZID0gdGhpcy5wbGF5ZXIuYXJyYXlQb3NZICsgMTtcblx0XHRpZiAodGhpcy5wbGF5ZXIuYXJyYXlQb3NZID49IHRoaXMuZ2FtZUZpZWxkLmxlbmd0aCkge1xuXHRcdFx0dGhpcy5wbGF5ZXIuZmFsbCgpO1xuXHRcdFx0dGhpcy5nYW1lLmdldENvbXBvbmVudCgnR2FtZScpLnN0YXRlID0gR2FtZVN0YXRlLkdhbWVPdmVyO1xuXHRcdH1cblx0fSxcblxuXHRjcmVhdGVGaXJzdExpbmU6IGZ1bmN0aW9uIGNyZWF0ZUZpcnN0TGluZSh4KSB7XG5cdFx0dmFyIG5ld2FycmF5ID0gW107XG5cdFx0dmFyIGJ1ZmZlcmFycmF5ID0gdGhpcy5nZXROZXh0TGluZUZyb21QdWZmZXIoKTtcblx0XHR2YXIgYXJyYXlJdGVtcyA9IHRoaXMuZ2V0TmV4dExpbmVGcm9tSXRlbVB1ZmZlcigpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBidWZmZXJhcnJheS5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKGJ1ZmZlcmFycmF5Lmxlbmd0aCAlIDIgPT0gMCkge1xuXG5cdFx0XHRcdG5ld2FycmF5W2ldID0gdGhpcy5zcGF3bkN1YmUoeCArIGkgKiBkaXN0WCwgeVNwYXduUG9zaXRpb24gKyBkaXN0WSAtIHNwYXduT2ZmU2V0WSwgYnVmZmVyYXJyYXlbaV0sIGFycmF5SXRlbXNbaV0pO1xuXHRcdFx0XHRuZXdhcnJheVtpXS5vcGFjaXR5ID0gMDtcblx0XHRcdFx0Ly8gTGV0IGJsb2NrcyBzbG93bHkgcmlzZSB3aGVuIHRoZXkgc3Bhd25cblx0XHRcdFx0dmFyIHJpc2UgPSBjYy5tb3ZlVG8oMSwgY2MucChuZXdhcnJheVtpXS5nZXRQb3NpdGlvbigpLngsIHlTcGF3blBvc2l0aW9uICsgZGlzdFkpKS5lYXNpbmcoY2MuZWFzZUN1YmljQWN0aW9uSW4oKSk7XG5cdFx0XHRcdHZhciBmYWRlID0gY2MuZmFkZUluKDEpO1xuXHRcdFx0XHRuZXdhcnJheVtpXS5ydW5BY3Rpb24oY2Muc3Bhd24oZmFkZSwgcmlzZSkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bmV3YXJyYXlbaV0gPSB0aGlzLnNwYXduQ3ViZSh4ICsgaSAqIGRpc3RYLCB5U3Bhd25Qb3NpdGlvbiArIGRpc3RZIC0gc3Bhd25PZmZTZXRZLCBidWZmZXJhcnJheVtpXSwgYXJyYXlJdGVtc1tpXSk7XG5cdFx0XHRcdG5ld2FycmF5W2ldLm9wYWNpdHkgPSAwO1xuXHRcdFx0XHR2YXIgcmlzZSA9IGNjLm1vdmVUbygxLCBjYy5wKG5ld2FycmF5W2ldLmdldFBvc2l0aW9uKCkueCwgeVNwYXduUG9zaXRpb24gKyBkaXN0WSkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25JbigpKTtcblx0XHRcdFx0dmFyIGZhZGUgPSBjYy5mYWRlSW4oMSk7XG5cdFx0XHRcdG5ld2FycmF5W2ldLnJ1bkFjdGlvbihjYy5zcGF3bihmYWRlLCByaXNlKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBuZXdhcnJheTtcblx0fSxcblxuXHQvL1xuXHQvLyBBbGwgcmVsZXZhbnQgZGF0YSBoYXMgdG8gYmUgbG9hZGVkIGFzIHByb3BlcnRpZXMgd2l0aGluIHRoZSBwcmVmYWJzIGluc3RhbnRpYXRlZCBoZXJlLiEhXG5cdC8vXG5cdHNwYXduQ3ViZTogZnVuY3Rpb24gc3Bhd25DdWJlKHgsIHksIGN1YmVOdW1iZXIsIGl0ZW1OdW1iZXIpIHtcblx0XHRjYy5sb2coJ006IHNwYXduQ3ViZScpO1xuXHRcdHN3aXRjaCAoY3ViZU51bWJlcikge1xuXHRcdFx0Y2FzZSAwOlxuXHRcdFx0XHR2YXIgbmV3Q3ViZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuRW1wdHkpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dmFyIG5ld0N1YmUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkdyYXNzKTtcblx0XHRcdFx0bmV3Q3ViZSA9IHRoaXMuc3Bhd25JdGVtKG5ld0N1YmUsIGl0ZW1OdW1iZXIpO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR2YXIgbmV3Q3ViZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuRGlydCk7XG5cdFx0XHRcdG5ld0N1YmUgPSB0aGlzLnNwYXduSXRlbShuZXdDdWJlLCBpdGVtTnVtYmVyKTtcblxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMzpcblx0XHRcdFx0bmV3Q3ViZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuVHJhcGRvb3IpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNDpcblx0XHRcdFx0dmFyIG5ld0N1YmUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLlN3aXRjaGVyKTtcblx0XHRcdFx0bmV3Q3ViZSA9IHRoaXMuc3Bhd25JdGVtKG5ld0N1YmUsIGl0ZW1OdW1iZXIpO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA1OlxuXHRcdFx0XHR2YXIgbmV3Q3ViZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuUG9pc29uKTtcblx0XHRcdFx0bmV3Q3ViZSA9IHRoaXMuc3Bhd25JdGVtKG5ld0N1YmUsIGl0ZW1OdW1iZXIpO1xuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA2OlxuXHRcdFx0XHR2YXIgbmV3Q3ViZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuU3Bpa2UpO1xuXHRcdFx0XHRuZXdDdWJlID0gdGhpcy5zcGF3bkl0ZW0obmV3Q3ViZSwgaXRlbU51bWJlcik7XG5cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDc6XG5cdFx0XHRcdHZhciBuZXdDdWJlID0gY2MuaW5zdGFudGlhdGUodGhpcy5XYXRlckMpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHZhciBuZXdDdWJlID0gY2MuaW5zdGFudGlhdGUodGhpcy5HcmFzcyk7XG5cdFx0XHRcdG5ld0N1YmUgPSB0aGlzLnNwYXduSXRlbShuZXdDdWJlLCBpdGVtTnVtYmVyKTtcblxuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRuZXdDdWJlLnNldFBvc2l0aW9uKHgsIHkpO1xuXG5cdFx0dGhpcy5ub2RlLmFkZENoaWxkKG5ld0N1YmUpO1xuXG5cdFx0cmV0dXJuIG5ld0N1YmU7XG5cdH0sXG5cblx0c3Bhd25JdGVtOiBmdW5jdGlvbiBzcGF3bkl0ZW0ocGFyZW50QmxvY2ssIGl0ZW1OdW1iZXIpIHtcblx0XHRzd2l0Y2ggKGl0ZW1OdW1iZXIpIHtcblx0XHRcdGNhc2UgMDpcblx0XHRcdFx0Ly9FbXB0eS8gbm8gaXRlbVxuXHRcdFx0XHR2YXIgbmV3SXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuRW1wdHkpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0Ly9hbnRpZG90ZUxlZnRcblx0XHRcdFx0dmFyIG5ld0l0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkFudGlkb3RlTCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHQvL2FudGlkb3RlUmlnaHRcblx0XHRcdFx0dmFyIG5ld0l0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkFudGlkb3RlUik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHQvL2NvaW5MZWZ0XG5cdFx0XHRcdHZhciBuZXdJdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5Db2luTCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA0OlxuXHRcdFx0XHQvL2NvaW5SaWdodFxuXHRcdFx0XHR2YXIgbmV3SXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuQ29pblIpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNTpcblx0XHRcdFx0Ly9zdGFyTGVmdFxuXHRcdFx0XHR2YXIgbmV3SXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuU3RhckwpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgNjpcblx0XHRcdFx0Ly9zdGFyUmlnaHRcblx0XHRcdFx0dmFyIG5ld0l0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLlN0YXJSKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDc6XG5cdFx0XHRcdC8vQmxvY2tlZEJ1c2hcblx0XHRcdFx0dmFyIG5ld0l0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkJsb2NrZWRCdXNoKTtcblx0XHRcdFx0cGFyZW50QmxvY2suZ2V0Q29tcG9uZW50KCdCbG9jaycpLmlzQmxvY2tlZCA9IHRydWU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA4OlxuXHRcdFx0XHQvL0Jsb2NrZWRTdG9uZVxuXHRcdFx0XHR2YXIgbmV3SXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuQmxvY2tlZFN0b25lKTtcblx0XHRcdFx0cGFyZW50QmxvY2suZ2V0Q29tcG9uZW50KCdCbG9jaycpLmlzQmxvY2tlZCA9IHRydWU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSA5OlxuXHRcdFx0XHQvL1Nsb3dEb3duIChUb3AgQU5EIEJvdHRvbSlcblx0XHRcdFx0dmFyIG5ld0l0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLlNsb3dEb3duQm90dG9tKTtcblx0XHRcdFx0dmFyIG5ld0l0ZW0yID0gY2MuaW5zdGFudGlhdGUodGhpcy5TbG93RG93blRvcCk7XG5cdFx0XHRcdG5ld0l0ZW0uYWRkQ2hpbGQobmV3SXRlbTIpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdC8vRW1wdHkvIG5vIGl0ZW1cblx0XHRcdFx0dmFyIG5ld0l0ZW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLkVtcHR5KTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXG5cdFx0dmFyIHBvc1kgPSBuZXdJdGVtLmdldFBvc2l0aW9uWSgpO1xuXHRcdHZhciBwb3NYID0gbmV3SXRlbS5nZXRQb3NpdGlvblgoKTtcblxuXHRcdGlmIChmbG9hdEFib3ZlQ3ViZS5pbmNsdWRlcyhpdGVtTnVtYmVyKSkge1xuXHRcdFx0bmV3SXRlbS5zZXRQb3NpdGlvbihwb3NYLCBwb3NZICsgNTApO1xuXHRcdH0gZWxzZSBpZiAocmlnaHRPblRvcE9mQ3ViZS5pbmNsdWRlcyhpdGVtTnVtYmVyKSkge1xuXHRcdFx0bmV3SXRlbS5zZXRQb3NpdGlvbihwb3NYLCBwb3NZICsgNDApO1xuXHRcdH1cblxuXHRcdHBhcmVudEJsb2NrLmdldENvbXBvbmVudCgnQmxvY2snKS5pdGVtID0gbmV3SXRlbTtcblx0XHRwYXJlbnRCbG9jay5hZGRDaGlsZChuZXdJdGVtKTtcblxuXHRcdHJldHVybiBwYXJlbnRCbG9jaztcblx0fSxcblxuXHRnZXROZXh0TGluZUZyb21QdWZmZXI6IGZ1bmN0aW9uIGdldE5leHRMaW5lRnJvbVB1ZmZlcigpIHtcblx0XHR2YXIgcmV0ID0gW107XG5cdFx0aWYgKHB1ZmZlckZpZWxkLmxlbmd0aCA9PT0gbmV4dEZpcnN0TGluZSkge1xuXHRcdFx0Ly9jYy5sb2coJ1B1ZmZlciBhcnJheSBpcyBlbXB0eSEnKTtcblx0XHRcdHRoaXMuZGVmaW5lTmV4dFJhbmRvbUFycmF5KCk7XG5cdFx0XHRyZXQgPSBwdWZmZXJGaWVsZFtuZXh0Rmlyc3RMaW5lXTtcblx0XHRcdG5leHRGaXJzdExpbmUgPSBuZXh0Rmlyc3RMaW5lICsgMTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly9jYy5sb2coJ0dldHRpbmcgbmV4dCBhcnJheSBsaW5lIGZybyBwdWZmZXIuLi4nKVxuXHRcdFx0cmV0ID0gcHVmZmVyRmllbGRbbmV4dEZpcnN0TGluZV07XG5cdFx0XHRuZXh0Rmlyc3RMaW5lID0gbmV4dEZpcnN0TGluZSArIDE7XG5cdFx0fVxuXHRcdC8vY2MubG9nKCdSZXR1cm5pbmcgbmV4dCBwdWZmZXIgYXJyYXkgbGluZSwgZXhpdGluZyBnZXROZXh0TGluZUZyb21QdWZmZXInLCByZXQpO1xuXHRcdHJldHVybiByZXQ7XG5cdH0sXG5cblx0Z2V0TmV4dExpbmVGcm9tSXRlbVB1ZmZlcjogZnVuY3Rpb24gZ2V0TmV4dExpbmVGcm9tSXRlbVB1ZmZlcigpIHtcblx0XHRjYy5sb2coJ006IGdldE5leHRMaW5lRnJvbUl0ZW1QdWZmZXInKTtcblx0XHR2YXIgcmV0ID0gW107XG5cblx0XHRpZiAocHVmZmVyRmllbGRJdGVtcy5sZW5ndGggPT09IG5leHRGaXJzdExpbmVJdGVtKSB7XG5cdFx0XHRyZXQgPSBwdWZmZXJGaWVsZEl0ZW1zW25leHRGaXJzdExpbmVJdGVtXTtcblx0XHRcdG5leHRGaXJzdExpbmVJdGVtID0gbmV4dEZpcnN0TGluZUl0ZW0gKyAxO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXQgPSBwdWZmZXJGaWVsZEl0ZW1zW25leHRGaXJzdExpbmVJdGVtXTtcblx0XHRcdG5leHRGaXJzdExpbmVJdGVtID0gbmV4dEZpcnN0TGluZUl0ZW0gKyAxO1xuXHRcdH1cblx0XHRyZXR1cm4gcmV0O1xuXHR9LFxuXG5cdGRlZmluZU5leHRSYW5kb21BcnJheTogZnVuY3Rpb24gZGVmaW5lTmV4dFJhbmRvbUFycmF5KCkge1xuXHRcdHZhciBzY29yZSA9IHRoaXMuZ2FtZS5nZXRDb21wb25lbnQoJ0dhbWUnKS5zY29yZTtcblxuXHRcdHB1ZmZlckZpZWxkID0gW107XG5cdFx0cHVmZmVyRmllbGRJdGVtcyA9IFtdO1xuXG5cdFx0dmFyIHJhbmQgPSBNYXRoLnJhbmRvbSgpICogMTAgKyAxO1xuXG5cdFx0aWYgKHNjb3JlIDw9IDM1KSB7XG5cdFx0XHRpZiAocmFuZCA8IDQpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1dJUiBXRUlTRSBMMTFDIHp1Jyk7XG5cdFx0XHRcdHB1ZmZlckZpZWxkID0gTGV2ZWwuTDExQztcblx0XHRcdFx0cHVmZmVyRmllbGRJdGVtcyA9IExldmVsLkwxMUk7XG5cdFx0XHR9IGVsc2UgaWYgKHJhbmQgPCA3KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXSVIgV0VJU0UgTDEyQyB6dScpO1xuXHRcdFx0XHRwdWZmZXJGaWVsZCA9IExldmVsLkwxMkM7XG5cdFx0XHRcdHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMTJJO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1dJUiBXRUlTRSBMMTNDIHp1Jyk7XG5cdFx0XHRcdHB1ZmZlckZpZWxkID0gTGV2ZWwuTDEzQztcblx0XHRcdFx0cHVmZmVyRmllbGRJdGVtcyA9IExldmVsLkwxM0k7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChzY29yZSA8PSA3MCkge1xuXHRcdFx0aWYgKHJhbmQgPCA0KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXSVIgV0VJU0UgTDIxQyB6dScpO1xuXHRcdFx0XHRwdWZmZXJGaWVsZCA9IExldmVsLkwyMUM7XG5cdFx0XHRcdHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMjFJO1xuXHRcdFx0fSBlbHNlIGlmIChyYW5kIDwgNykge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnV0lSIFdFSVNFIEwyMkMgenUnKTtcblx0XHRcdFx0cHVmZmVyRmllbGQgPSBMZXZlbC5MMjJDO1xuXHRcdFx0XHRwdWZmZXJGaWVsZEl0ZW1zID0gTGV2ZWwuTDIySTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXSVIgV0VJU0UgTDIzQyB6dScpO1xuXHRcdFx0XHRwdWZmZXJGaWVsZCA9IExldmVsLkwyM0M7XG5cdFx0XHRcdHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMjNJO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAocmFuZCA8IDQpIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1dJUiBXRUlTRSBMMzFDIHp1Jyk7XG5cdFx0XHRcdHB1ZmZlckZpZWxkID0gTGV2ZWwuTDMxQztcblx0XHRcdFx0cHVmZmVyRmllbGRJdGVtcyA9IExldmVsLkwzMUk7XG5cdFx0XHR9IGVsc2UgaWYgKHJhbmQgPCA3KSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdXSVIgV0VJU0UgTDMyQyB6dScpO1xuXHRcdFx0XHRwdWZmZXJGaWVsZCA9IExldmVsLkwzMkM7XG5cdFx0XHRcdHB1ZmZlckZpZWxkSXRlbXMgPSBMZXZlbC5MMzJJO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ1dJUiBXRUlTRSBMMzNDIHp1Jyk7XG5cdFx0XHRcdHB1ZmZlckZpZWxkID0gTGV2ZWwuTDMzQztcblx0XHRcdFx0cHVmZmVyRmllbGRJdGVtcyA9IExldmVsLkwzM0k7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdG5leHRGaXJzdExpbmUgPSAwO1xuXHRcdG5leHRGaXJzdExpbmVJdGVtID0gMDtcblx0fSxcblxuXHRhZGRaT3JkZXJUb0dhbWVGaWVsZDogZnVuY3Rpb24gYWRkWk9yZGVyVG9HYW1lRmllbGQoKSB7XG5cdFx0dmFyIGNvdW50ID0gMTtcblx0XHRmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuZ2FtZUZpZWxkLmxlbmd0aDsgeSsrKSB7XG5cdFx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuZ2FtZUZpZWxkW3ldLmxlbmd0aDsgeCsrKSB7XG5cdFx0XHRcdHRoaXMuZ2FtZUZpZWxkW3ldW3hdLnNldExvY2FsWk9yZGVyKGNvdW50KTtcblx0XHRcdFx0Y291bnQrKztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxufSk7XG4vKlxyXG4gaW5pdGlhbGl6ZUZpZWxkMjogZnVuY3Rpb24oeCx5KXtcclxuIHRoaXMuZ2FtZUZpZWxkID0gW3hdO1xyXG4gZm9yICh2YXIgaCA9IDA7IGggPCB4OyBoKyspIHsgLy9jcmVhdGUgYXJyYXkgd2l0aCB1bmV2ZW4gcm93c1xyXG4gaWYoaCUyPT09MSl7XHJcbiB0aGlzLmdhbWVGaWVsZFtoXSA9IFt5LTFdOyAvL3VuZXZlblxyXG4gfSBlbHNlIHtcclxuIHRoaXMuZ2FtZUZpZWxkW2hdID0gW3ldO1xyXG4gfVxyXG4gfVxyXG5cbiBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZ2FtZUZpZWxkLmxlbmd0aDsgaSsrKSB7XHJcbiBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuZ2FtZUZpZWxkW2ldLmxlbmd0aDsgaisrKSB7XHJcbiBpZih0aGlzLmdhbWVGaWVsZFtpXS5sZW5ndGglMj09PTEpeyAvLyBldmVuIGFycmF5L3Jvd1xyXG4gbmV3Q3ViZSA9IHRoaXMuc3Bhd25DdWJlKHN0YXJ0WCsoeCpkaXN0WCksIHN0YXJ0WS0oZGlzdFkqeSksIHN0YXJ0RmllbGQyW2ldW2pdKTtcclxuIH1cclxuIGVsc2V7IC8vIHVuZXZlbiBhcnJheS9yb3dcclxuIG5ld0N1YmUgPSB0aGlzLnNwYXduQ3ViZShzdGFydFgrKHgqZGlzdFgpLShkaXN0WC8yKSwgc3RhcnRZLShkaXN0WSp5KSwgc3RhcnRGaWVsZDJbaV1bal0pO1xyXG4gfVxyXG4gdGhpcy5nYW1lRmllbGRbaV1bal0gPSBuZXdDdWJlOyAvL1RPRE8gYWRkIGJsb2NrcyBub3QgbnVtYmVyc1xyXG4gfVxyXG4gfVxyXG5cblxuIGNjLmxvZyhcIkZpZWxkOlwiKTtcclxuIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5nYW1lRmllbGQubGVuZ3RoOyBpKyspIHtcclxuIGNjLmxvZyh0aGlzLmdhbWVGaWVsZFtpXS5qb2luKFwiUm93OiBcIitpK1wiIFwiKSk7XHJcbiB9XHJcbiB9LFxyXG5cbiBhZGRGaXJzdEZpZWxkUm93OiBmdW5jdGlvbihyb3cpe1xyXG4gdGhpcy5maWVsZC51bnNoaWZ0KHJvdyk7XHJcbiB9LFxyXG5cbiByZW1vdmVMYXN0RmllbGRSb3c6IGZ1bmN0aW9uKCl7XHJcbiB0aGlzLmZpZWxkLnBvcCgpO1xyXG4gfSxcclxuXG4gYWRkRmllbGRSb3cgOiBmdW5jdGlvbihpbmRleCwgcm93KXtcclxuIHRoaXMuZmllbGRbaW5kZXhdID0gcm93O1xyXG4gfSxcclxuXG4gcmVtb3ZlRmllbGRSb3cgOiBmdW5jdGlvbihpbmRleCl7XHJcbiB2YXIgdGVtcCA9IFt0aGlzLmdyaWRTaXplWF07XHJcbiBmb3IodmFyIGggPSAwOyBoIDwgdGhpcy5ncmlkU2l6ZVg7IGgrKyl7XHJcbiB0ZW1wW2hdID0gdGhpcy5maWVsZFtoXTtcclxuIH1cclxuXG4gZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuZ3JpZFNpemVYOyBpKyspe1xyXG4gaWYoaSAhPSAwKXtcclxuIHZhciBuZXdpbmRleCA9IGktMTtcclxuIGNjLmxvZyhcIkluZDogXCIrbmV3aW5kZXgpO1xyXG4gdGhpcy5maWVsZFtpXSA9IHRlbXBbbmV3aW5kZXhdO1xyXG4gfVxyXG4gfVxyXG4gfSxcclxuXG4gZ2VuZXJhdGVSb3cgOiBmdW5jdGlvbigpe1xyXG4gdmFyIGkgPSB0aGlzLmdyaWRTaXplWCt0aGlzLmNvdW50O1xyXG4gdGhpcy5jb3VudCsrO1xyXG4gcmV0dXJuIFtpLGksaSxpLGldO1xyXG4gLy9UT0RPOiBsb2FkIGEgcm93IGZyb20gdGlsZWQgZmlsZSByZXR1cm4gYXJyYXlcclxuIH0sKi9cblxuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcwNzZlZitDYnFWQ0ZLL1E5c2NyTDhVaScsICdHYW1lJyk7XG4vLyBzY3JpcHRzXFxHYW1lLmpzXG5cbi8vR2FtZVxuLy8gSW1wb3J0c1xudmFyIEdhbWVTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLkdhbWVTdGF0ZTtcbnZhciBQbGF5ZXJNb3ZlbWVudFN0YXRlID0gcmVxdWlyZSgnU3RhdGVzJykuUGxheWVyTW92ZW1lbnRTdGF0ZTtcbnZhciBTdGVwID0gcmVxdWlyZSgnVHlwZXMnKS5CbG9ja1R5cGU7XG5cbnZhciB3aGljaFN0ZXAgPSBTdGVwLk5vbmU7XG52YXIgdXBkYXRlQWNjZXNzID0gdHJ1ZTtcbnZhciBvblN0ZXBwS2lsbHMgPSBmYWxzZTtcbnZhciBraWxsQWN0aW9uRXhlY3V0ZWQgPSBmYWxzZTtcbnZhciBwcmVzc0RvdWJsZSA9IDA7XG5cbi8vZGlzYWJsZXMgdGhlIGFudGlhbGlhc2luZywgYmVjYXVzZSBpdCBkZXN0cm95cyB0aGUgcGl4ZWxhcnRcbnZhciBfX2NjVGV4dHVyZTJEX2hhbmRsZUxvYWRlZFRleHR1cmUgPSBjYy5UZXh0dXJlMkQucHJvdG90eXBlLmhhbmRsZUxvYWRlZFRleHR1cmU7XG5jYy5UZXh0dXJlMkQucHJvdG90eXBlLmhhbmRsZUxvYWRlZFRleHR1cmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgX19jY1RleHR1cmUyRF9oYW5kbGVMb2FkZWRUZXh0dXJlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgdGhpcy5zZXRBbGlhc1RleFBhcmFtZXRlcnMoKTtcbn07XG5cbnZhciBwcmVzc0NvdW50ID0gMDtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBzdGF0ZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBHYW1lU3RhdGUuTm9uZSxcbiAgICAgICAgICAgIHR5cGU6IEdhbWVTdGF0ZVxuICAgICAgICB9LFxuICAgICAgICAvLyBHYW1lIERhdGEvT2JqZWN0c1xuICAgICAgICBnYW1lZmllbGQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICBwbGF5ZXI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBHYW1lLVVJXG4gICAgICAgIGJhY2tncm91bmQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9LFxuXG4gICAgICAgIHNjb3JlTGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgbXVsdGlwbGllckxhYmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIE11c2ljIFRoZW1lXG4gICAgICAgIHRoZW1ldXJsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnN0b3JhZ2UgPSBjYy5zeXMubG9jYWxTdG9yYWdlO1xuICAgICAgICB0aGlzLnN0YXRlID0gR2FtZVN0YXRlLldhaXRpbmc7XG5cbiAgICAgICAgdGhpcy5pbml0YWxpemVJbnB1dENvbnRyb2woKTsgLy8gQWN0aXZhdGUgaW5wdXQgaGFuZGxpbmdcblxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5TXVzaWModGhpcy50aGVtZXVybCwgdHJ1ZSk7XG5cbiAgICAgICAgdGhpcy5zdG9yYWdlLnNldEl0ZW0oJ3Njb3JlJywgMCk7XG5cbiAgICAgICAgdGhpcy5zY29yZSA9IDA7XG4gICAgICAgIHRoaXMuc2NvcmVNdWx0aXBsaWVyID0gMTtcbiAgICAgICAgdGhpcy5tdWx0aXBsaWVyQWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5zdGVwcGVkQmxvY2sgPSBudWxsO1xuICAgIH0sXG5cbiAgICByZXNldDogZnVuY3Rpb24gcmVzZXQoKSB7fSxcblxuICAgIC8vIENhbGxlZCB3aGVuIHBsYXllciBvbkxvYWQoKSBoYXMgZmluaXNoZWRcbiAgICBvblBsYXllckxvYWRDYWxsYmFjazogZnVuY3Rpb24gb25QbGF5ZXJMb2FkQ2FsbGJhY2soKSB7XG4gICAgICAgIHRoaXMuZ2FtZWZpZWxkLnBsYXllciA9IHRoaXMucGxheWVyO1xuXG4gICAgICAgIC8vIFBsYXllciBpcyBhc3NlbWJsZWQuIHNldCBhbGwgbmVlZGVkIGdyYXBoaWNhbCBpbmZvcm1hdGlvblxuICAgICAgICB0aGlzLmdhbWVmaWVsZC5zZXRQbGF5ZXJTdGFydCh0aGlzLnBsYXllcik7XG4gICAgICAgIHRoaXMucGxheWVyLm5vZGUuc2V0TG9jYWxaT3JkZXIoMTAwMCk7XG4gICAgfSxcblxuICAgIC8vIENhbGxlZCB3aGVuIGdhbWVmaWVsZCBpcyBpbml0YWxpemVkICggb25Mb2FkKCkgaGFzIGZpbmlzaGVkIClcbiAgICBvbkdhbWVGaWVsZExvYWRDYWxsYmFjazogZnVuY3Rpb24gb25HYW1lRmllbGRMb2FkQ2FsbGJhY2soKSB7fSxcblxuICAgIHZhbGlkYXRlTW92ZTogZnVuY3Rpb24gdmFsaWRhdGVNb3ZlKGRpcikge1xuXG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBHYW1lU3RhdGUuR2FtZU92ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnBsYXllci5tb3Zlc3RhdGUgPT09IFBsYXllck1vdmVtZW50U3RhdGUuSnVtcGluZyB8fCB0aGlzLnBsYXllci5tb3Zlc3RhdGUgPT09IFBsYXllck1vdmVtZW50U3RhdGUuRmFsbGluZykge1xuICAgICAgICAgICAgLy9QbGF5ZXIgYWxyZWFkeSBqdW1waW5nL2ZhbGxpbmcgLT4gbmVnbGVjdCBpbnB1dFxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSGFuZGxlIHN3YXBlZCBjYXNlXG4gICAgICAgIGlmICh0aGlzLnBsYXllci5pc1N3YXBlZCkge1xuICAgICAgICAgICAgZGlyID0gLWRpcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhhbmRsZSBzbG93ZWQgY2FzZVxuICAgICAgICBpZiAodGhpcy5wbGF5ZXIuaXNTbG93ZWQpIHtcbiAgICAgICAgICAgIHByZXNzQ291bnQrKztcbiAgICAgICAgICAgIGlmIChwcmVzc0NvdW50IDwgMykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHJlc3NDb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIuaXNTbG93ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGVzdGZpZWxkID0gdGhpcy5nYW1lZmllbGQuZ2V0SnVtcEZpZWxkKGRpcik7XG4gICAgICAgIHZhciBzdGVwcGVkQmxvY2sgPSB0aGlzLmRlc3RmaWVsZC5nZXRDb21wb25lbnQoJ0Jsb2NrJyk7XG5cbiAgICAgICAgaWYgKHN0ZXBwZWRCbG9jay5pc0Jsb2NrZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBsYXllci5pc1N3YXBlZCA9IGZhbHNlO1xuXG4gICAgICAgIC8vXG4gICAgICAgIC8vTW92ZSB3YXMgY29ycmVjdC5cbiAgICAgICAgLy9cbiAgICAgICAgLy9DaGFuZ2UgcGxheWVyIGRpcmVjdGlvblxuICAgICAgICBpZiAodGhpcy5wbGF5ZXIuZGlyICE9IGRpcikgdGhpcy5hbmltYXRpb25OZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgICAgIHRoaXMucGxheWVyLmRpciA9IGRpcjtcbiAgICAgICAgdGhpcy5pbmNyZW1lbnRTY29yZSgxKTtcbiAgICAgICAgdGhpcy5zY29yZUxhYmVsLnN0cmluZyA9IHRoaXMuc2NvcmUudG9TdHJpbmcoKTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgaW5pdGFsaXplSW5wdXRDb250cm9sOiBmdW5jdGlvbiBpbml0YWxpemVJbnB1dENvbnRyb2woKSB7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih7XG4gICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCxcblxuICAgICAgICAgICAgb25LZXlQcmVzc2VkOiBmdW5jdGlvbiBvbktleVByZXNzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5zdGF0ZSA9PSBHYW1lU3RhdGUuUGF1c2VkKSByZXR1cm47XG4gICAgICAgICAgICAgICAgc3dpdGNoIChrZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLmE6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5zdGF0ZSA9PT0gR2FtZVN0YXRlLldhaXRpbmcpIHNlbGYuc3RhdGUgPSBHYW1lU3RhdGUuUGxheWluZztcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYudmFsaWRhdGVNb3ZlKDEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wbGF5ZXIubW92ZShzZWxmLmRlc3RmaWVsZCwgc2VsZik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5nYW1lZmllbGQudXBkYXRlUGxheWVyQXJyYXlQb3MoKTsgLy8gQ2hhbmdlIGFycmF5IHBvc2l0aW9uIGFmdGVyIGp1bXAgb3IgYnVncyB3aWxsIHNwYXduXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wYXJhbGxheEJhY2tncm91bmQoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLnBsYXllci5vbGREZXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wbGF5ZXIub2xkRGVzdC5nZXRDb21wb25lbnQoJ0Jsb2NrJykucGxheWVyT25Ub3AgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkuZDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLnN0YXRlID09PSBHYW1lU3RhdGUuV2FpdGluZykgc2VsZi5zdGF0ZSA9IEdhbWVTdGF0ZS5QbGF5aW5nO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi52YWxpZGF0ZU1vdmUoLTEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wbGF5ZXIubW92ZShzZWxmLmRlc3RmaWVsZCwgc2VsZik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5nYW1lZmllbGQudXBkYXRlUGxheWVyQXJyYXlQb3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnBhcmFsbGF4QmFja2dyb3VuZCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYucGxheWVyLm9sZERlc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnBsYXllci5vbGREZXN0LmdldENvbXBvbmVudCgnQmxvY2snKS5wbGF5ZXJPblRvcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS51OlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5nYW1lZmllbGQudXBkYXRlRmllbGQoLTEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5rOlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5wbGF5ZXIua2lsbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLmVzY2FwZTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmxvZyhcIkVzY2FwZSBwcmVzc2VkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogd2hhdCB0byBkbyBvbiBlc2NhcGVkLXByZXNzZWQ/XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkuZjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucGxheWVyLmZhbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIG9uS2V5UmVsZWFzZWQ6IGZ1bmN0aW9uIG9uS2V5UmVsZWFzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBjYy5LRVkuYTpcblxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLmQ6XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgc2VsZi5ub2RlKTtcbiAgICB9LFxuXG4gICAgcGFyYWxsYXhCYWNrZ3JvdW5kOiBmdW5jdGlvbiBwYXJhbGxheEJhY2tncm91bmQoKSB7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5ub2RlLnJ1bkFjdGlvbihjYy5tb3ZlQnkodGhpcy5wbGF5ZXIuanVtcFRpbWUsIGNjLnAodGhpcy5wbGF5ZXIuZGlyLCAwKSkpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ006IHVwZGF0ZScpO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gR2FtZVN0YXRlLlBsYXlpbmcpIHtcbiAgICAgICAgICAgIHRoaXMubW92ZUZpZWxkV2l0aFBsYXllcigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBHYW1lU3RhdGUuR2FtZU92ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmFnZS5zZXRJdGVtKCdzY29yZScsIHRoaXMuc2NvcmUpO1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKCdHYW1lT3ZlclNjZW5lJyk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gR2FtZVN0YXRlLkxvYWRpbmc7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgbW92ZUZpZWxkV2l0aFBsYXllcjogZnVuY3Rpb24gbW92ZUZpZWxkV2l0aFBsYXllcigpIHtcbiAgICAgICAgdmFyIHlTcGVlZCA9IHRoaXMucGxheWVyLmFycmF5UG9zWTtcbiAgICAgICAgLy8gY2MubG9nKCdQbGF5ZXJwb3MnLCB5U3BlZWQpO1xuICAgICAgICBpZiAodXBkYXRlQWNjZXNzKSB7XG4gICAgICAgICAgICAvL2NjLmxvZygnVVBEQVRFLUNhc2VzIGJldHJldGVuJyk7XG4gICAgICAgICAgICB1cGRhdGVBY2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIHN3aXRjaCAoeVNwZWVkKSB7XG4gICAgICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVBY2Nlc3MgPSB0aGlzLmdhbWVmaWVsZC51cGRhdGVGaWVsZFBvc2l0aW9uKC0wLjMpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUFjY2VzcyA9IHRoaXMuZ2FtZWZpZWxkLnVwZGF0ZUZpZWxkUG9zaXRpb24oLTAuNCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gdGhpcy5nYW1lZmllbGQudXBkYXRlRmllbGRQb3NpdGlvbigtMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gdGhpcy5nYW1lZmllbGQudXBkYXRlRmllbGRQb3NpdGlvbigtMS41KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVBY2Nlc3MgPSB0aGlzLmdhbWVmaWVsZC51cGRhdGVGaWVsZFBvc2l0aW9uKC0yKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVBY2Nlc3MgPSB0aGlzLmdhbWVmaWVsZC51cGRhdGVGaWVsZFBvc2l0aW9uKC00KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVBY2Nlc3MgPSB0aGlzLmdhbWVmaWVsZC51cGRhdGVGaWVsZFBvc2l0aW9uKC04KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVBY2Nlc3MgPSB0aGlzLmdhbWVmaWVsZC51cGRhdGVGaWVsZFBvc2l0aW9uKC0xMik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQWNjZXNzID0gdGhpcy5nYW1lZmllbGQudXBkYXRlRmllbGRQb3NpdGlvbigtMjApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVBY2Nlc3MgPSB0aGlzLmdhbWVmaWVsZC51cGRhdGVGaWVsZFBvc2l0aW9uKC0wLjMpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvL1xuICAgIC8vIEhFTFBJTkcgTUVUSE9EUy4gU01BTEwgU1RVRkZcbiAgICAvL1xuXG4gICAgY2hhbmdlTXVsdGlwbGllcjogZnVuY3Rpb24gY2hhbmdlTXVsdGlwbGllcih2YWx1ZSkge1xuICAgICAgICAvL1RPRE86IFN0b3AgYW5kIHN0YXJ0IGFjdGlvbiBieSB0YWdcbiAgICAgICAgdGhpcy5zY29yZU11bHRpcGxpZXIgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5tdWx0aXBsaWVyTGFiZWwuc3RyaW5nID0gXCJNdWx0aXBsaWVyOiBcIiArIHRoaXMuc2NvcmVNdWx0aXBsaWVyO1xuICAgICAgICB0aGlzLm11bHRpcGxpZXJMYWJlbC5ub2RlLm9wYWNpdHkgPSAyNTU7XG4gICAgICAgIHZhciByZXNldE11bHRpcGxpZXJDYWxsYmFjayA9IGNjLmNhbGxGdW5jKHRoaXMucmVzZXRNdWx0aXBsaWVyLCB0aGlzKTtcbiAgICAgICAgdGhpcy5tdWx0aXBsaWVyTGFiZWwubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2MuZmFkZU91dCg1KSwgcmVzZXRNdWx0aXBsaWVyQ2FsbGJhY2spKTtcbiAgICB9LFxuXG4gICAgcmVzZXRNdWx0aXBsaWVyOiBmdW5jdGlvbiByZXNldE11bHRpcGxpZXIoKSB7XG4gICAgICAgIHRoaXMuc2NvcmVNdWx0aXBsaWVyID0gMDtcbiAgICB9LFxuXG4gICAgaW5jcmVtZW50U2NvcmU6IGZ1bmN0aW9uIGluY3JlbWVudFNjb3JlKGluYykge1xuICAgICAgICB0aGlzLnNjb3JlICs9IGluYyAqIHRoaXMuc2NvcmVNdWx0aXBsaWVyO1xuICAgIH0sXG5cbiAgICAvL0RlcHJlY2F0ZWRcbiAgICBjaGVja0l0ZW1Db2xsaXNpb246IGZ1bmN0aW9uIGNoZWNrSXRlbUNvbGxpc2lvbihpdGVtKSB7XG4gICAgICAgIHZhciBpdGVtcG9zID0gaXRlbS5ub2RlLmdldFBvc2l0aW9uKCk7XG4gICAgICAgIHZhciBwcG9zID0gdGhpcy5wbGF5ZXIubm9kZS5nZXRQb3NpdGlvbigpO1xuICAgICAgICB2YXIgZGlzdCA9IGNjLnBEaXN0YW5jZShpdGVtcG9zLCBwcG9zKTtcbiAgICAgICAgaWYgKGRpc3QgPCBpdGVtLmNvbGxlY3RSYWRpdXMpIHtcbiAgICAgICAgICAgIGl0ZW0ub25QaWNrVXBDYWxsYmFjayh0aGlzLnBsYXllcik7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzY1YjkxbGxta3hKdEpraHFzWXpGcDcxJywgJ0dyYXNzJyk7XG4vLyBzY3JpcHRzXFxnYW1lZmllbGRcXGJsb2Nrc1xcR3Jhc3MuanNcblxudmFyIEJsb2NrVHlwZSA9IHJlcXVpcmUoJ1R5cGVzJykuQmxvY2tUeXBlO1xudmFyIFBsYXllck1vdmVtZW50U3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5QbGF5ZXJNb3ZlbWVudFN0YXRlO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGlzQmxvY2tlZDogZmFsc2UsXG4gICAgICAgIGhhc0l0ZW06IGZhbHNlLFxuXG4gICAgICAgIGJsb2NrdHlwZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBCbG9ja1R5cGUuTm9uZSxcbiAgICAgICAgICAgIHR5cGU6IEJsb2NrVHlwZVxuICAgICAgICB9LFxuXG4gICAgICAgIGl0ZW06IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnBsYXllck9uVG9wID0gZmFsc2U7XG4gICAgfSxcblxuICAgIG9uU3RlcENhbGxiYWNrOiBmdW5jdGlvbiBvblN0ZXBDYWxsYmFjayhwbGF5ZXIsIGdhbWUpIHtcbiAgICAgICAgY2MubG9nKCdNOiBvblN0ZXBDYWxsYmFjayBHcmFzcycpO1xuICAgIH0sXG5cbiAgICBjb2xsaWRlOiBmdW5jdGlvbiBjb2xsaWRlKCkge31cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2E5ZDVmaE1wRFJCN3Jud2d6bDBZMTlaJywgJ0l0ZW0nKTtcbi8vIHNjcmlwdHNcXGdhbWVvYmplY3RzXFxJdGVtLmpzXG5cblxudmFyIEl0ZW1UeXBlID0gcmVxdWlyZSgnVHlwZXMnKS5JdGVtVHlwZTtcbnZhciBJdGVtU3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5JdGVtU3RhdGU7XG52YXIgSXRlbUFjdGl2aXR5U3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5JdGVtQWN0aXZpdHlTdGF0ZTtcblxudmFyIHJpc2VZID0gNTA7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaXRlbXR5cGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogSXRlbVR5cGUuTm9uZSxcbiAgICAgICAgICAgIHR5cGU6IEl0ZW1UeXBlXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXRlbXN0YXRlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IEl0ZW1TdGF0ZS5QaWNrYWJsZSxcbiAgICAgICAgICAgIHR5cGU6IEl0ZW1TdGF0ZVxuICAgICAgICB9LFxuXG4gICAgICAgIGFjdGl2aXR5c3RhdGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogSXRlbUFjdGl2aXR5U3RhdGUuSWRsZSxcbiAgICAgICAgICAgIHR5cGU6IEl0ZW1BY3Rpdml0eVN0YXRlXG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGVjdFJhZGl1czogMCxcbiAgICAgICAgaXRlbVZhbHVlOiAwLCAvLyBWYWx1ZSBvZiB0aGUgaXRlbSB3aGVuIHBpY2tlZCB1cChwdXJlIHNjb3JlLCBzY29yZSBtdWx0aXBsaWVyKVxuICAgICAgICBpdGVtVGltZXI6IDAsXG5cbiAgICAgICAgYWN0aXZhdGlvbnNvdW5kOiB7IC8vIERyYWcgcmlnaHQgYXVkaW8gaGVyZS5cbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcblxuICAgIGRlc3Ryb3lJdGVtOiBmdW5jdGlvbiBkZXN0cm95SXRlbSgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJJdGVtdHlwZSB0byBkZXN0cm95OiBcIiArIHRoaXMuaXRlbXR5cGUudG9TdHJpbmcoKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKEl0ZW1UeXBlW3RoaXMuaXRlbXR5cGVdKTtcbiAgICAgICAgc3dpdGNoICh0aGlzLml0ZW10eXBlKSB7XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlNsb3dlcjpcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuQW50aWRvdGU6XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkNvaW46XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlN0YXI6XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvblBpY2tVcENhbGxiYWNrOiBmdW5jdGlvbiBvblBpY2tVcENhbGxiYWNrKHBsYXllciwgZ2FtZSkge1xuICAgICAgICB0aGlzLml0ZW1zdGF0ZSA9IEl0ZW1TdGF0ZS5QaWNrZWQ7XG4gICAgICAgIHRoaXMuYWN0aXZpdHlzdGF0ZSA9IEl0ZW1BY3Rpdml0eVN0YXRlLkFjdGl2ZTtcbiAgICAgICAgLy8gUGVyZm9ybSB0aGUgYWN0aW9uIHRoZSBpdGVtIHByb2R1Y2VzKGNoYW5nZSBwbGF5ZXIgb3IgZW52aXJvbm1lbnQpXG4gICAgICAgIHN3aXRjaCAodGhpcy5pdGVtdHlwZSkge1xuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5BbnRpZG90ZTpcbiAgICAgICAgICAgICAgICBwbGF5ZXIuaXNQb2lzb25lZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHBsYXllci5wb2lzb25UbXAgPSBwbGF5ZXIucG9pc29uVGltZXI7IC8vcmVzZXQgdGltbWVyXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkNvaW46XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0dBTUU6ICcsIGdhbWUubmFtZSk7XG4gICAgICAgICAgICAgICAgZ2FtZS5pbmNyZW1lbnRTY29yZSg1KTtcbiAgICAgICAgICAgICAgICBnYW1lLnNjb3JlTGFiZWwuc3RyaW5nID0gZ2FtZS5zY29yZS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBJdGVtVHlwZS5TdGFyOlxuICAgICAgICAgICAgICAgIHBsYXllci5pc1BvaXNvbmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcGxheWVyLmlzSW52aW5jaWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlNsb3dlcjpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNFVCBTV0FQRUQgVFJVRVwiKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuaXNTbG93ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwaWNrZWRDYWxsYmFjayA9IGNjLmNhbGxGdW5jKHRoaXMucGlja2VkLCB0aGlzKTtcbiAgICAgICAgdmFyIHNvdW5kY2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLnBsYXlTb3VuZCwgdGhpcyk7XG4gICAgICAgIC8vIFBlcmZvcm0gaXRlbSBhbmltYXRpb24gYW5kIGRlc3Ryb3kgaXRcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy5zcGF3bih0aGlzLmFzc2VtYmxlUGlja1VwQWN0aW9uKCksIHNvdW5kY2FsbGJhY2spLCBwaWNrZWRDYWxsYmFjaykpO1xuICAgIH0sXG5cbiAgICBhc3NlbWJsZVBpY2tVcEFjdGlvbjogZnVuY3Rpb24gYXNzZW1ibGVQaWNrVXBBY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuYWN0aXZpdHlzdGF0ZSA9IEl0ZW1BY3Rpdml0eVN0YXRlLkFjdGl2ZTtcbiAgICAgICAgLy8gUmlzZS1BbmltYXRpb24gZm9yIGl0ZW1zIHRvIHNob3cgdGhleSBoYXZlIGJlZW4gcGlja2VkIHVwICAgICAgIFxuICAgICAgICB2YXIgcmlzZVBvaW50ID0gY2MucCh0aGlzLm5vZGUuZ2V0UG9zaXRpb25YKCksIHRoaXMubm9kZS5nZXRQb3NpdGlvblkoKSArIHJpc2VZKTtcbiAgICAgICAgdmFyIGZhZGUgPSBjYy5mYWRlT3V0KHRoaXMuZ2V0SXRlbUFuaW1hdGlvblRpbWUoKSk7IC8vIExldCBpdGVtIGZhZGUgZHVyaW5nIGFuaW1hdGlvblxuICAgICAgICB2YXIgYW5pbSA9IG51bGw7XG4gICAgICAgIC8vUmVtb3ZlIHNoYWRvd3NcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5ub2RlLmNoaWxkcmVuO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjaGlsZHJlbltpXS5kZXN0cm95KCk7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHRoaXMuaXRlbXR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuU3RhcjpcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuQ29pbjpcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuQW50aWRvdGU6XG4gICAgICAgICAgICAgICAgYW5pbSA9IGNjLm1vdmVCeSh0aGlzLmdldEl0ZW1BbmltYXRpb25UaW1lKCksIHJpc2VQb2ludCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNjLnNwYXduKGZhZGUsIGFuaW0pO1xuICAgIH0sXG5cbiAgICBnZXRJdGVtQW5pbWF0aW9uVGltZTogZnVuY3Rpb24gZ2V0SXRlbUFuaW1hdGlvblRpbWUodHlwZSkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMuaXRlbXR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgSXRlbVR5cGUuQW50aWRvdGU6XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLkNvaW46XG4gICAgICAgICAgICBjYXNlIEl0ZW1UeXBlLlN0YXI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDEuNTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBwaWNrZWQ6IGZ1bmN0aW9uIHBpY2tlZCgpIHtcblxuICAgICAgICB0aGlzLmFjdGl2aXR5c3RhdGUgPSBJdGVtQWN0aXZpdHlTdGF0ZS5FeHBpcmVkO1xuICAgICAgICB0aGlzLmRlc3Ryb3lJdGVtKCk7XG4gICAgfSxcblxuICAgIHBsYXlTb3VuZDogZnVuY3Rpb24gcGxheVNvdW5kKCkge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmF0aW9uc291bmQgIT09IG51bGwpIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5hY3RpdmF0aW9uc291bmQsIGZhbHNlKTtcbiAgICB9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3YzQ1ZXRJR1V0QkM1VmJrQUpKMlVDVCcsICdMZXZlbCcpO1xuLy8gc2NyaXB0c1xcZ2FtZWZpZWxkXFxMZXZlbC5qc1xuXG4vL0xldmVsXG52YXIgTDExQyA9IFtbNywgMSwgMSwgNiwgMSwgMSwgN10sIFs3LCAxLCAxLCAxLCAxLCA3XSwgWzcsIDcsIDEsIDYsIDEsIDcsIDddLCBbNywgMSwgMSwgMSwgMSwgN10sIFs3LCA3LCAxLCA2LCAxLCA3LCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddLCBbNywgMSwgMSwgNiwgMSwgMSwgN10sIFs3LCA2LCAxLCAxLCA2LCA3XV07XG5cbnZhciBMMTFJID0gW1swLCA4LCAwLCAwLCAwLCA4LCAwXSwgWzAsIDgsIDAsIDAsIDgsIDBdLCBbMCwgMCwgOCwgMCwgOCwgMCwgMF0sIFswLCA4LCAwLCAwLCA4LCAwXSwgWzAsIDAsIDgsIDAsIDgsIDAsIDBdLCBbMCwgOCwgMCwgMCwgOCwgMF0sIFswLCA4LCAwLCAwLCAwLCA4LCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdXTtcblxudmFyIEwxMkMgPSBbWzcsIDEsIDEsIDEsIDEsIDEsIDddLCBbNywgMSwgMSwgMSwgMSwgN10sIFs3LCAxLCAxLCAxLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddLCBbNywgMSwgMSwgMSwgMSwgNCwgN10sIFs3LCAxLCAxLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDMsIDEsIDEsIDddLCBbNywgMSwgMSwgMSwgMSwgN11dO1xuXG52YXIgTDEySSA9IFtbMCwgNCwgNywgMCwgMCwgMCwgMF0sIFswLCA0LCA3LCAwLCAwLCAwXSwgWzAsIDQsIDQsIDcsIDAsIDAsIDBdLCBbMCwgNCwgNCwgNywgOSwgMF0sIFswLCA0LCA0LCA0LCA3LCAwLCAwXSwgWzAsIDAsIDAsIDAsIDYsIDBdLCBbMCwgMCwgNywgMCwgNywgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwXV07XG5cbnZhciBMMTNDID0gW1s3LCAxLCA1LCAxLCAxLCAxLCA3XSwgWzcsIDYsIDEsIDEsIDEsIDddLCBbNywgMSwgNywgMSwgMSwgMSwgN10sIFs3LCAxLCA3LCAxLCAxLCA3XSwgWzcsIDEsIDEsIDcsIDEsIDEsIDddLCBbNywgMSwgMSwgNywgNiwgN10sIFs3LCAxLCAxLCA3LCAxLCAxLCA3XSwgWzcsIDEsIDcsIDEsIDEsIDddXTtcblxudmFyIEwxM0kgPSBbWzAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgNCwgNywgMCwgMF0sIFswLCA5LCAwLCA0LCAwLCA3LCAwXSwgWzAsIDksIDAsIDQsIDAsIDBdLCBbMCwgMCwgMCwgMCwgNCwgMCwgMF0sIFswLCAwLCAxLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMiwgMCwgMF1dO1xuXG52YXIgTDIxQyA9IFtbNywgMiwgMiwgMiwgMiwgMiwgN10sIFs3LCAyLCAyLCAyLCAyLCA3XSwgWzcsIDIsIDIsIDIsIDIsIDIsIDddLCBbNywgMiwgMiwgMiwgMiwgN10sIFs3LCA3LCAyLCAyLCAyLCA3LCA3XSwgWzcsIDYsIDYsIDYsIDYsIDddLCBbNywgMiwgMiwgMiwgMiwgMiwgN10sIFs3LCAyLCAyLCAyLCAyLCA3XV07XG5cbnZhciBMMjFJID0gW1swLCA3LCAwLCA3LCA0LCA3LCAwXSwgWzAsIDcsIDMsIDAsIDcsIDBdLCBbMCwgNywgMCwgNywgMywgNywgMF0sIFswLCA5LCA3LCA3LCA5LCAwXSwgWzAsIDAsIDksIDQsIDksIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF0sIFswLCA5LCA3LCA2LCA3LCA5LCAwXSwgWzAsIDksIDksIDksIDksIDBdXTtcblxudmFyIEwyMkMgPSBbWzcsIDQsIDQsIDcsIDQsIDQsIDddLCBbNywgNCwgNywgNywgMiwgN10sIFs3LCA3LCAyLCA3LCA0LCA3LCA3XSwgWzcsIDQsIDcsIDcsIDQsIDddLCBbNywgNywgNCwgNywgMiwgNywgN10sIFs3LCA0LCA3LCA3LCA0LCA3XSwgWzcsIDcsIDIsIDcsIDQsIDcsIDddLCBbNywgNCwgNywgNywgNCwgN11dO1xuXG52YXIgTDIySSA9IFtbMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCA0LCAwXSwgWzAsIDAsIDQsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCA0LCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgNCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwXV07XG5cbnZhciBMMjNDID0gW1s3LCAyLCAyLCAyLCAyLCAyLCA3XSwgWzcsIDUsIDUsIDUsIDUsIDddLCBbNywgMywgMiwgMiwgMiwgMywgN10sIFs3LCAzLCAyLCAyLCAzLCA3XSwgWzcsIDMsIDMsIDIsIDIsIDIsIDddLCBbNywgMywgMiwgMywgMiwgN10sIFs3LCAzLCAyLCAzLCAzLCAyLCA3XSwgWzcsIDIsIDIsIDMsIDIsIDddXTtcblxudmFyIEwyM0kgPSBbWzAsIDksIDksIDYsIDksIDksIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCA5LCAzLCA5LCAwLCAwXSwgWzAsIDAsIDAsIDMsIDAsIDBdLCBbMCwgMCwgMCwgOSwgMywgMCwgMF0sIFswLCAwLCAyLCAwLCAzLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDMsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF1dO1xuXG52YXIgTDMxQyA9IFtbNywgMywgNSwgMywgNSwgMywgN10sIFs3LCA0LCAzLCAzLCA0LCA3XSwgWzcsIDMsIDYsIDMsIDYsIDMsIDddLCBbNywgMywgNCwgNCwgMywgN10sIFs3LCAzLCAzLCA2LCAzLCAzLCA3XSwgWzcsIDMsIDIsIDQsIDMsIDddLCBbNywgMywgNCwgMywgNiwgMywgN10sIFs3LCAzLCAyLCAzLCAyLCA3XV07XG5cbnZhciBMMzFJID0gW1swLCA0LCAwLCA0LCAwLCAwLCAwXSwgWzAsIDAsIDQsIDQsIDAsIDBdLCBbMCwgNCwgMCwgMCwgMCwgMCwgMF0sIFswLCAyLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDEsIDAsIDBdLCBbMCwgMCwgMiwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDQsIDAsIDAsIDMsIDBdXTtcblxudmFyIEwzMkMgPSBbWzcsIDcsIDIsIDcsIDIsIDcsIDddLCBbNywgNiwgNywgNywgNiwgN10sIFs3LCA3LCA0LCAzLCA0LCA3LCA3XSwgWzcsIDUsIDYsIDYsIDUsIDddLCBbNywgNiwgNywgMiwgNywgNiwgN10sIFs3LCA0LCA3LCA2LCA0LCA3XSwgWzcsIDcsIDIsIDcsIDIsIDcsIDddLCBbNywgMywgMiwgNywgMiwgN11dO1xuXG52YXIgTDMySSA9IFtbMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCA0LCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgNCwgOSwgMCwgMCwgMCwgMF0sIFswLCAyLCAxLCAwLCAxLCAwXV07XG5cbnZhciBMMzNDID0gW1s3LCAxLCA2LCAxLCA2LCAxLCA3XSwgWzcsIDEsIDMsIDEsIDMsIDddLCBbNywgNiwgMSwgNiwgMSwgNiwgN10sIFs3LCAxLCA0LCA0LCAxLCA3XSwgWzcsIDUsIDMsIDYsIDMsIDUsIDddLCBbNywgMSwgMSwgMSwgMSwgN10sIFs3LCAxLCAxLCAxLCAxLCAxLCA3XSwgWzcsIDEsIDEsIDEsIDEsIDddXTtcblxudmFyIEwzM0kgPSBbWzAsIDAsIDMsIDAsIDQsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMF0sIFswLCAwLCAwLCA0LCAwLCAwLCAwXSwgWzAsIDAsIDAsIDAsIDAsIDBdLCBbMCwgMCwgMCwgMCwgMCwgMCwgMF0sIFswLCA5LCA5LCA5LCA5LCAwXSwgWzAsIDksIDksIDksIDksIDksIDBdLCBbMCwgMCwgMSwgMiwgMCwgMF1dO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBMMTFDOiBMMTFDLFxuICAgIEwxMUk6IEwxMUksXG4gICAgTDEyQzogTDEyQyxcbiAgICBMMTJJOiBMMTJJLFxuICAgIEwxM0M6IEwxM0MsXG4gICAgTDEzSTogTDEzSSxcbiAgICBMMjFDOiBMMjFDLFxuICAgIEwyMUk6IEwyMUksXG4gICAgTDIyQzogTDIyQyxcbiAgICBMMjJJOiBMMjJJLFxuICAgIEwyM0M6IEwyM0MsXG4gICAgTDIzSTogTDIzSSxcbiAgICBMMzFDOiBMMzFDLFxuICAgIEwzMUk6IEwzMUksXG4gICAgTDMyQzogTDMyQyxcbiAgICBMMzJJOiBMMzJJLFxuICAgIEwzM0M6IEwzM0MsXG4gICAgTDMzSTogTDMzSVxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzEwOTE1a3krakJGcklzQUUvbG55V3FOJywgJ01lbnVCdXR0b25DYWxsYmFja3MnKTtcbi8vIHNjcmlwdHNcXHNjZW5lc2NyaXB0c1xcTWVudUJ1dHRvbkNhbGxiYWNrcy5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgYnV0dG9uQXVkaW86IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcblxuICAgIHN0YXJ0Q29udHJvbENhbGxiYWNrOiBmdW5jdGlvbiBzdGFydENvbnRyb2xDYWxsYmFjaygpIHtcbiAgICAgICAgdmFyIG9uTGF1bmNoZWQgPSBmdW5jdGlvbiBvbkxhdW5jaGVkKCkge1xuICAgICAgICAgICAgLy91c2UgdGhpcyBmb3IgY2FsbGJhY2tzIG9uIGxvYWRpbmdcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTY2VuZSBsYXVuY2hlZCcpO1xuICAgICAgICB9O1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ0dhbWVTY2VuZScsIG9uTGF1bmNoZWQpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuYnV0dG9uQXVkaW8sIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgYWJvdXRDb250cm9sQ2FsbGJhY2s6IGZ1bmN0aW9uIGFib3V0Q29udHJvbENhbGxiYWNrKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoJ0Fib3V0Jyk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5idXR0b25BdWRpbywgZmFsc2UpO1xuICAgIH0sXG5cbiAgICB0dXRvcmlhbENvbnRyb2xDYWxsYmFjazogZnVuY3Rpb24gdHV0b3JpYWxDb250cm9sQ2FsbGJhY2soKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnVHV0b3JpYWwnKTtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmJ1dHRvbkF1ZGlvLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIHF1aXRDb250cm9sQ2FsbGJhY2s6IGZ1bmN0aW9uIHF1aXRDb250cm9sQ2FsbGJhY2soKSB7XG4gICAgICAgIC8vY2MuZGlyZWN0b3IuZW5kKCk7IC8vVE9ETzogaG93IHRvIGVuZCB0aGUgZ2FtZT9cbiAgICAgICAgY2MubG9nKFwiUXVpdCBwcmVzc2VkLlwiKTtcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmJ1dHRvbkF1ZGlvLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIGJhY2tDb250cm9sQ2FsbGJhY2s6IGZ1bmN0aW9uIGJhY2tDb250cm9sQ2FsbGJhY2soKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnU3RhcnRtZW51Jyk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5idXR0b25BdWRpbywgZmFsc2UpO1xuICAgIH1cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdkZmNmZXpBQWNKQUFMWFBpSUhWSmoyZCcsICdQbGF5ZXInKTtcbi8vIHNjcmlwdHNcXGdhbWVvYmplY3RzXFxQbGF5ZXIuanNcblxudmFyIEdhbWVTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLkdhbWVTdGF0ZTtcbnZhciBQbGF5ZXJNb3ZlbWVudFN0YXRlID0gcmVxdWlyZSgnU3RhdGVzJykuUGxheWVyTW92ZW1lbnRTdGF0ZTtcbnZhciBQbGF5ZXJTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLlBsYXllclN0YXRlO1xuXG52YXIgZXhwbG9kZXRpbWUgPSAwLjI7XG52YXIgcmlzZURlYXRoWSA9IDI1O1xuXG52YXIgYW5pbWF0aW9uTmVlZHNVcGRhdGUgPSBmYWxzZTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBQbGF5ZXIgc3Bhd25zIGluIGEgc3RhbmRpbmcgc3RhdGVcbiAgICAgICAgbW92ZXN0YXRlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IFBsYXllck1vdmVtZW50U3RhdGUuU3RhbmRpbmcsXG4gICAgICAgICAgICB0eXBlOiBQbGF5ZXJNb3ZlbWVudFN0YXRlXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNJbnZpbmNpYmxlOiBmYWxzZSwgLy8gUGxheWVyIHBpY2tlZCB1cCBhbiBpdGVtIHdoaWNoIG1hZGUgaGltIHVua2lsbGFibGVcbiAgICAgICAgaXNQb2lzb25lZDogZmFsc2UsXG4gICAgICAgIGlzQWxpdmU6IGZhbHNlLFxuICAgICAgICBpc1N3YXBlZDogZmFsc2UsIC8vUGxheWVyIHN0YW5kcyBvbiBhIFN3aXRjaGVyIC8vVE9ETzogbnV0emxvcyBkYSBuaWUgdmVyd2VuZGV0IGluIHBsYXllclxuICAgICAgICBpc1Nsb3dlZDogZmFsc2UsXG5cbiAgICAgICAgcG9pc29uVGltZXI6IDAsXG4gICAgICAgIGludmluY2liaWx0eVRpbWVyOiAwLFxuXG4gICAgICAgIGRpcjogMCwgLy8gTmV4dCBQb3NpdGlvbiBwbGF5ZXIgaXMganVtcGluZyB0byAxIDogbGVmdCAgLTE6IHJpZ2h0XG5cbiAgICAgICAgYXJyYXlQb3NYOiAwLCAvL1Bvc2l0aW9uIGluIHRoZSBhcnJheSBnaXZlbiB3aXRoIHJvdyBhbmQgY29sdW1uXG4gICAgICAgIGFycmF5UG9zWTogMCxcblxuICAgICAgICBqdW1wVGltZTogMCwgLy8gVGltZSBmb3IganVtcGluZyBhY3Rpb24gdG8gcnVuXG4gICAgICAgIGZhbGxUaW1lOiAwLCAvLyBzYW1lOiBmYWxsaW5nXG5cbiAgICAgICAgLy8gQXRsYXMgaG9sZGluIGFsbCBzcHJpdGVzIG9mIHRoZSBwbGF5ZXIuXG4gICAgICAgIHBsYXllcmF0bGFzOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVBdGxhc1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFBsYXllciBBdWRpb3NcbiAgICAgICAganVtcEF1ZGlvOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuXG4gICAgICAgIGRlYXRoQXVkaW86IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG5cbiAgICAgICAgZmFsbEF1ZGlvOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuXG4gICAgICAgIGRyaW5rQXVkaW86IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG5cbiAgICAgICAgcG9pc29uZWRBdWRpbzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBHYW1lIHJlZmVyZW5jZSB0byBwYXNzIHBsYXllclxuICAgICAgICBnYW1lOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgLy9yZWdpc3RlciBwbGF5ZXIgYXQgZ2FtZSBmb3IgcHJvY2Vzc2luZyBwbGF5ZXIgbG9naWNcbiAgICAgICAgdGhpcy5nYW1lLmdldENvbXBvbmVudCgnR2FtZScpLnBsYXllciA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCF0aGlzLmFuaW1hdGlvbikgLy8gSW5pdCBhbmltYXRpb25cbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uID0gdGhpcy5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcblxuICAgICAgICAvL0luaXQgdGltZXJzXG4gICAgICAgIHRoaXMucG9pc29uVG1wID0gdGhpcy5wb2lzb25UaW1lcjtcbiAgICAgICAgdGhpcy5pbnZpbmNpYmlsdHlUbXAgPSB0aGlzLmludmluY2liaWx0eVRpbWVyO1xuXG4gICAgICAgIHRoaXMubW92ZXN0YXRlID0gUGxheWVyTW92ZW1lbnRTdGF0ZS5TdGFuZGluZztcbiAgICAgICAgdGhpcy5pc01vdmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzQWxpdmUgPSB0cnVlO1xuICAgICAgICAvL3RoaXMub2xkRGVzdCA9IHRoaXMuZ2FtZS5nZXRDb21wb25lbnQoJ0dhbWUnKS5nYW1lZmllbGQuZ2FtZUZpZWxkW2dhbWVGaWVsZC5sZW5ndGgtMV1bM107XG5cbiAgICAgICAgdGhpcy5vZmZzZXRZID0gdGhpcy5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0IC8gMjsgLy8gT2Zmc2V0IHRvIHNldCB0aGUgcGxheWVyIG9uIHRvcCBvZiBibG9ja3NcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbnBvcyA9IGNjLnAoMCwgMCk7XG5cbiAgICAgICAgLy9Mb2FkIGRhdGEgcmVsZXZhbnQgdG8gcGxheWVyICAgLS0gISEgTEVBVkUgQVQgRU5EIE9GIFRISVMgRlVOQ1RJT04gISEgLS1cbiAgICAgICAgdGhpcy5nYW1lLmdldENvbXBvbmVudCgnR2FtZScpLm9uUGxheWVyTG9hZENhbGxiYWNrKCk7XG4gICAgfSxcblxuICAgIGtpbGw6IGZ1bmN0aW9uIGtpbGwoKSB7XG4gICAgICAgIHRoaXMuaXNJbnZpbmNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNBbGl2ZSA9IGZhbHNlO1xuICAgICAgICB2YXIgZ2FtZXN0YXRlY2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLmNoYW5nZUdhbWVTdGF0ZSwgdGhpcyk7XG4gICAgICAgIHZhciBzb3VuZGNhbGxiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5wbGF5U291bmQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGNjLnNwYXduKHRoaXMuZGVmb3JtKCksIHRoaXMuYXNzZW1ibGVBY3Rpb24oKSksIGdhbWVzdGF0ZWNhbGxiYWNrLCBzb3VuZGNhbGxiYWNrKSk7XG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3BBbGxFZmZlY3RzKCk7IC8vVE9ETyBldnRsIGFscyBjYWxsYmFja1xuICAgIH0sXG5cbiAgICBmYWxsOiBmdW5jdGlvbiBmYWxsKCkge1xuICAgICAgICB0aGlzLmlzSW52aW5jaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1vdmVzdGF0ZSA9IFBsYXllck1vdmVtZW50U3RhdGUuRmFsbGluZztcbiAgICAgICAgLy92YXIgZ2FtZXN0YXRlY2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLmNoYW5nZUdhbWVGYWxsU3RhdGUsdGhpcyk7XG4gICAgICAgIHZhciBraWxsY2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLmtpbGwsIHRoaXMpO1xuICAgICAgICB2YXIgc291bmRjYWxsYmFjayA9IGNjLmNhbGxGdW5jKHRoaXMucGxheVNvdW5kLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy5zcGF3bih0aGlzLmRlZm9ybSgpLCB0aGlzLmFzc2VtYmxlQWN0aW9uKCkpLCBzb3VuZGNhbGxiYWNrLCBraWxsY2FsbGJhY2spKTtcbiAgICAgICAgdGhpcy5pc0FsaXZlID0gZmFsc2U7IC8vc2V0IGhlcmUgYmVjYXVzZSBhbGl2ZSBpbXBhY3RzIGRlYXRoIGFuaW0uXG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnN0b3BBbGxFZmZlY3RzKCk7XG4gICAgfSxcblxuICAgIGNoYW5nZUdhbWVTdGF0ZTogZnVuY3Rpb24gY2hhbmdlR2FtZVN0YXRlKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNBbGl2ZSkgdGhpcy5nYW1lLmdldENvbXBvbmVudCgnR2FtZScpLnN0YXRlID0gR2FtZVN0YXRlLkdhbWVPdmVyO1xuICAgIH0sXG5cbiAgICBjaGFuZ2VHYW1lRmFsbFN0YXRlOiBmdW5jdGlvbiBjaGFuZ2VHYW1lRmFsbFN0YXRlKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkFsaXZlOiBcIiArIHRoaXMuaXNBbGl2ZSk7XG4gICAgICAgIGlmICh0aGlzLmlzQWxpdmUpIHRoaXMuaXNBbGl2ZSA9IGZhbHNlO1xuICAgICAgICBjb25zb2xlLmxvZygnQ2hhbmdlIEdhbWVTdGF0ZTogJywgdGhpcy5nYW1lLmdldENvbXBvbmVudCgnR2FtZScpLnN0YXRlKTtcbiAgICAgICAgdGhpcy5nYW1lLmdldENvbXBvbmVudCgnR2FtZScpLnN0YXRlID0gR2FtZVN0YXRlLkdhbWVPdmVyO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmdhbWUuZ2V0Q29tcG9uZW50KCdHYW1lJykuc3RhdGUpO1xuICAgIH0sXG5cbiAgICBjaGFuZ2VQbGF5ZXJTdGF0ZTogZnVuY3Rpb24gY2hhbmdlUGxheWVyU3RhdGUoKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5tb3Zlc3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgUGxheWVyTW92ZW1lbnRTdGF0ZS5KdW1waW5nOlxuICAgICAgICAgICAgICAgIHRoaXMubW92ZXN0YXRlID0gUGxheWVyTW92ZW1lbnRTdGF0ZS5TdGFuZGluZztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBibG9ja1N0ZXBwZWQ6IGZ1bmN0aW9uIGJsb2NrU3RlcHBlZChwbGF5ZXIsIGdhbWUpIHtcbiAgICAgICAgdmFyIHN0ZXBwZWRCbG9jayA9IHRoaXMuZGVzdGZpZWxkLmdldENvbXBvbmVudCgnQmxvY2snKTtcbiAgICAgICAgc3RlcHBlZEJsb2NrLm9uU3RlcENhbGxiYWNrKHRoaXMsIGdhbWUpO1xuICAgICAgICB2YXIgaXRlbSA9IHN0ZXBwZWRCbG9jay5nZXRDb21wb25lbnRJbkNoaWxkcmVuKCdJdGVtJyk7XG4gICAgICAgIGlmIChpdGVtICE9PSBudWxsKSBpdGVtLm9uUGlja1VwQ2FsbGJhY2sodGhpcywgZ2FtZSk7XG4gICAgfSxcbiAgICAvL1xuICAgIC8vIE1vdmVtZW50IGFuZCBBY3Rpb25zXG4gICAgLy9cblxuICAgIC8vQ2FsbGVkIGV2ZXJ5dGltZSBhIHRoZSBmaWd1cmUgaXMgbW92ZWQgYnkgcHJlc3NpbmcgQSBvciBEXG4gICAgbW92ZTogZnVuY3Rpb24gbW92ZShkZXN0ZmllbGQsIGdhbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBbGl2ZSA9PT0gZmFsc2UpIHJldHVybjtcbiAgICAgICAgdGhpcy5vbGREZXN0ID0gdGhpcy5kZXN0ZmllbGQ7XG4gICAgICAgIHRoaXMuZGVzdGZpZWxkID0gZGVzdGZpZWxkOyAvLyBEaXJlY3Rpb24gcGxheWVycyB3YW50cyB0byBtb3ZlIHRoZSBmaWd1cmUoLTEgb3IgMSlcbiAgICAgICAgc3dpdGNoICh0aGlzLm1vdmVzdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLlN0YW5kaW5nOlxuICAgICAgICAgICAgICAgIHRoaXMubW92ZXN0YXRlID0gUGxheWVyTW92ZW1lbnRTdGF0ZS5KdW1waW5nO1xuXG4gICAgICAgICAgICAgICAgdmFyIHNvdW5kQ2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLnBsYXlTb3VuZCwgdGhpcyk7XG4gICAgICAgICAgICAgICAgdmFyIHBsYXllcnN0YXRlQ2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLmNoYW5nZVBsYXllclN0YXRlLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB2YXIgYmxvY2tzdGVwQ2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLmJsb2NrU3RlcHBlZCwgdGhpcywgZ2FtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hQbGF5ZXJBcHBlYXJhbmNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXREZXN0aW5hdGlvblBvcygpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShjYy5zcGF3bih0aGlzLmRlZm9ybSgpLCB0aGlzLmFzc2VtYmxlQWN0aW9uKCkpLCBibG9ja3N0ZXBDYWxsYmFjaywgc291bmRDYWxsYmFjaywgcGxheWVyc3RhdGVDYWxsYmFjaykpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFBsYXllck1vdmVtZW50U3RhdGUuSnVtcGluZzpcbiAgICAgICAgICAgIGNhc2UgUGxheWVyTW92ZW1lbnRTdGF0ZS5GYWxsaW5nOlxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXREZXN0aW5hdGlvblBvczogZnVuY3Rpb24gc2V0RGVzdGluYXRpb25Qb3MoKSB7XG4gICAgICAgIHRoaXMuZGVzdGluYXRpb25wb3MueCA9IHRoaXMuZGVzdGZpZWxkLmdldFBvc2l0aW9uWCgpO1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9ucG9zLnkgPSB0aGlzLmRlc3RmaWVsZC5nZXRQb3NpdGlvblkoKSArIHRoaXMub2Zmc2V0WTtcbiAgICB9LFxuXG4gICAgc3dpdGNoUGxheWVyQXBwZWFyYW5jZTogZnVuY3Rpb24gc3dpdGNoUGxheWVyQXBwZWFyYW5jZSgpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb25SdW5uaW5nID0gZmFsc2U7IC8vRm9yY2UgcGxheWVyIHVwZGF0ZSBldmVyeSBqdW1wXG4gICAgICAgIHRoaXMudXBkYXRlZCA9IHRoaXMudXBkYXRlQW5pbWF0aW9uKCk7XG4gICAgICAgIGlmICh0aGlzLnVwZGF0ZWQpIC8vIGlmIGFuaW1hdGlvbnMgaXMgcnVubmluZyBkb250IGdvIHRvIHNwcml0ZSBmcmFtZSBjaGFuZ2luZ1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5kaXIgPCAwKSB7XG4gICAgICAgICAgICAvLyBQbGF5ZXIgbG9va3MgbGVmdFxuICAgICAgICAgICAgdGhpcy5nZXRDb21wb25lbnQoY2MuU3ByaXRlKS5zcHJpdGVGcmFtZSA9IHRoaXMucGxheWVyYXRsYXMuZ2V0U3ByaXRlRnJhbWUoXCJwbGF5ZXJfbGVmdFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSkuc3ByaXRlRnJhbWUgPSB0aGlzLnBsYXllcmF0bGFzLmdldFNwcml0ZUZyYW1lKFwicGxheWVyX3JpZ2h0XCIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGFzc2VtYmxlQWN0aW9uOiBmdW5jdGlvbiBhc3NlbWJsZUFjdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBbGl2ZSA9PT0gZmFsc2UpIC8vUGxheWVyIGRlYWQgLT4gYWN0aW9uIFRPRE86IHZlcnNhdXQgZmFsbGVuIGFuaW1hdGlvblxuICAgICAgICAgICAgcmV0dXJuIGNjLm1vdmVCeShleHBsb2RldGltZSwgY2MucCgwLCByaXNlRGVhdGhZKSk7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLm1vdmVzdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLlN0YW5kaW5nOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLkZhbGxpbmc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNjLm1vdmVUbyh0aGlzLmZhbGxUaW1lLCBjYy5wKHRoaXMubm9kZS5nZXRQb3NpdGlvbigpLngsIDApKS5lYXNpbmcoY2MuZWFzZUN1YmljQWN0aW9uSW4oKSk7XG5cbiAgICAgICAgICAgIGNhc2UgUGxheWVyTW92ZW1lbnRTdGF0ZS5KdW1waW5nOlxuICAgICAgICAgICAgICAgIC8vIFBvaW50cyBmb3JtaW5nIHRoZSBiZXppZXJjdXJ2ZVxuICAgICAgICAgICAgICAgIHZhciBiZXppZXIgPSBbdGhpcy5ub2RlLmdldFBvc2l0aW9uKCksIHRoaXMuZGVzdGluYXRpb25wb3MsIHRoaXMuZGVzdGluYXRpb25wb3NdO1xuICAgICAgICAgICAgICAgIHJldHVybiBjYy5iZXppZXJUbyh0aGlzLmp1bXBUaW1lLCBiZXppZXIpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRlZm9ybTogZnVuY3Rpb24gZGVmb3JtKCkge1xuICAgICAgICBpZiAodGhpcy5pc0FsaXZlID09PSBmYWxzZSkgLy9QbGF5ZXIgZGVhZCAtPiBkZWZvcm1cbiAgICAgICAgICAgIHJldHVybiBjYy5zZXF1ZW5jZShjYy5zY2FsZVRvKGV4cGxvZGV0aW1lLCAxLjMsIDEuMyksIGNjLnNjYWxlVG8oZXhwbG9kZXRpbWUsIDAuMCwgMC4wKSk7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLm1vdmVzdGF0ZSkgey8vIFBsYXllciBpbiBhIG1vdmluZyBzdGF0ZSAtPiBhY3Rpb25cblxuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLkp1bXBpbmc6XG4gICAgICAgICAgICAgICAgdmFyIHNjYWxldGltZSA9IHRoaXMuanVtcFRpbWUgKiAwLjU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNjLnNlcXVlbmNlKGNjLnNjYWxlVG8oc2NhbGV0aW1lLCAxLCAxLjEpLCBjYy5zY2FsZVRvKHNjYWxldGltZSwgMSwgMC45KSwgY2Muc2NhbGVUbyhzY2FsZXRpbWUsIDEsIDEuMCkpO1xuXG4gICAgICAgICAgICBjYXNlIFBsYXllck1vdmVtZW50U3RhdGUuRmFsbGluZzpcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuc2V0TG9jYWxaT3JkZXIodGhpcy5kZXN0ZmllbGQuZ2V0TG9jYWxaT3JkZXIoKSk7IC8vVE9ETzogZmFsbCB3aXJkIHNjaG9uIHfDpGhyZW5kIGRlcyBqdW1wcyBhdXNnZWbDvGhydCAtPiBzcGllbGVyIHZlcnNjaHdpbmRldCBoaW50ZXIgdm9yYmVpZ2VzcHJ1bmdlbmVuIGJsw7Zja2VuXG4gICAgICAgICAgICAgICAgdmFyIGZhbGxEZWZvcm0gPSBjYy5zY2FsZVRvKHRoaXMuZmFsbFRpbWUsIDAuODUsIDAuODUpO1xuICAgICAgICAgICAgICAgIHZhciBmYWxsZmFkZSA9IGNjLmZhZGVPdXQodGhpcy5mYWxsVGltZSAqIDQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjYy5zcGF3bihmYWxsRGVmb3JtLCBmYWxsZmFkZS5lYXNpbmcoY2MuZWFzZUN1YmljQWN0aW9uT3V0KCkpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBNaWdodCBiZSB1c2VmdWwgc29tZXRpbWVcbiAgICAgICAgaWYgKHRoaXMuaXNQb2lzb25lZCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNJbnZpbmNpYmxlKSByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgLy9cbiAgICAvLyAgU291bmRzXG4gICAgLy9cblxuICAgIHBsYXlTb3VuZDogZnVuY3Rpb24gcGxheVNvdW5kKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNBbGl2ZSkge1xuICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmRlYXRoQXVkaW8sIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzUG9pc29uZWQpIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5wb2lzb25lZEF1ZGlvLCB0cnVlKTtcblxuICAgICAgICBzd2l0Y2ggKHRoaXMubW92ZXN0YXRlKSB7XG4gICAgICAgICAgICBjYXNlIFBsYXllck1vdmVtZW50U3RhdGUuSnVtcGluZzpcbiAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuanVtcEF1ZGlvLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFBsYXllck1vdmVtZW50U3RhdGUuRmFsbGluZzpcbiAgICAgICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuZmFsbEF1ZGlvLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvL1xuICAgIC8vIFN0YXR1cyBhbmQgVXBkYXRlIG9mIHBsYXllclxuICAgIC8vXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLmlzQWxpdmUpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVGltZXJzKGR0KTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQW5pbWF0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlQW5pbWF0aW9uOiBmdW5jdGlvbiB1cGRhdGVBbmltYXRpb24oKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1BvaXNvbmVkICYmICF0aGlzLmlzSW52aW5jaWJsZSkge1xuICAgICAgICAgICAgLy9OSUNFIFRPIEhBVkU6IG5vIGJvb2xzXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbi5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvblJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgodGhpcy5pc1BvaXNvbmVkIHx8IHRoaXMuaXNJbnZpbmNpYmxlKSAmJiAhdGhpcy5hbmltYXRpb25SdW5uaW5nKSB0aGlzLmFuaW1hdGlvbi5wbGF5KHRoaXMuZ2V0QW5pbWF0aW9uKCkpO1xuICAgICAgICB0aGlzLmFuaW1hdGlvblJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgdXBkYXRlVGltZXJzOiBmdW5jdGlvbiB1cGRhdGVUaW1lcnMoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNQb2lzb25lZCkgaWYgKHRoaXMucG9pc29uVG1wIDw9IDApIHtcbiAgICAgICAgICAgIC8vdGltZXIgcmFuIG91dCAtPiBraWxsIHBsYXllclxuICAgICAgICAgICAgdGhpcy5pc1BvaXNvbmVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmlzQWxpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMua2lsbCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wb2lzb25UbXAgLT0gZHQ7IC8vZGVjcmVhc2UgdGltZXIuLi5odXJyeSFcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzSW52aW5jaWJsZSkgaWYgKHRoaXMuaW52aW5jaWJpbHR5VG1wIDw9IDApIHtcbiAgICAgICAgICAgIC8vdGltZXIgcmFuIG91dCAtPiBkb3ducmFuayBwbGF5ZXJcbiAgICAgICAgICAgIHRoaXMuaXNJbnZpbmNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmludmluY2liaWx0eVRtcCA9IHRoaXMuaW52aW5jaWJpbHR5VGltZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmludmluY2liaWx0eVRtcCAtPSBkdDsgLy9kZWNyZWFzZSB0aW1lci4uLmh1cnJ5IVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGlzTW92aW5nOiBmdW5jdGlvbiBpc01vdmluZygpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLm1vdmVzdGF0ZSkgey8vc3dpdGNoIGZvciBwb3NzaWJsZSBmdXJ0aGVyIHN0YXRlc1xuICAgICAgICAgICAgY2FzZSBQbGF5ZXJNb3ZlbWVudFN0YXRlLkp1bXBpbmc6XG4gICAgICAgICAgICAgICAgdGhpcy5pc01vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgICAgIGNhc2UgUGxheWVyTW92ZW1lbnRTdGF0ZS5TdGFuZGluZzpcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgaXNBbGl2ZTogKGZ1bmN0aW9uIChfaXNBbGl2ZSkge1xuICAgICAgICBmdW5jdGlvbiBpc0FsaXZlKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9pc0FsaXZlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cblxuICAgICAgICBpc0FsaXZlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9pc0FsaXZlLnRvU3RyaW5nKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGlzQWxpdmU7XG4gICAgfSkoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gaXNBbGl2ZTtcbiAgICB9KSxcblxuICAgIGdldEFuaW1hdGlvbjogZnVuY3Rpb24gZ2V0QW5pbWF0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5kaXIgPCAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1BvaXNvbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdwb2lzb25fbGVmdF9hbmltJzsgLy9wbGF5KCdwb2lzb25fbGVmdF9hbmltJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzSW52aW5jaWJsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnc3Rhcl9sZWZ0X2FuaW0nOyAvL3BsYXkoJ3BvaXNvbl9sZWZ0X2FuaW0nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1BvaXNvbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAncG9pc29uX3JpZ2h0X2FuaW0nOyAvL3BsYXkoJ3BvaXNvbl9sZWZ0X2FuaW0nKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0ludmluY2libGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdzdGFyX3JpZ2h0X2FuaW0nOyAvL3BsYXkoJ3BvaXNvbl9sZWZ0X2FuaW0nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgfVxuXG59KTtcbi8qXHJcbm1ha2VJbnZpbmNpYmxlOiBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5pc0ludmluY2libGUgPSB0cnVlO1xyXG4gICAgLy9UT0RPOiBzdGFydCBpbnZpbmNpYmlsaXR5IHRpbWVyXHJcbn0sXHJcbiAgcG9pc29uOiBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5pc1BvaXNvbmVkID0gdHJ1ZTtcclxuICAgIC8vVE9ETzogc3RhcnQgcG9pc29uIHRpbWVyIGFuZCBraWxsaW5nIHBoYXNlIGlmIHR1cm4gYmFzZWQgcG9pc29uIGlzIG5lZ2xlY3RlZFxyXG59LFxyXG4gIHNob3QgOiBmdW5jdGlvbigpe1xyXG4gIH0sKi9cblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2UwNTBmZlpuVVZBaktCOGZ5U2QrWmRPJywgJ1BvaXNvbicpO1xuLy8gc2NyaXB0c1xcZ2FtZWZpZWxkXFxibG9ja3NcXFBvaXNvbi5qc1xuXG52YXIgQmxvY2tUeXBlID0gcmVxdWlyZSgnVHlwZXMnKS5CbG9ja1R5cGU7XG52YXIgUGxheWVyTW92ZW1lbnRTdGF0ZSA9IHJlcXVpcmUoJ1N0YXRlcycpLlBsYXllck1vdmVtZW50U3RhdGU7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaXNCbG9ja2VkOiBmYWxzZSxcbiAgICAgICAgaGFzSXRlbTogZmFsc2UsXG5cbiAgICAgICAgYmxvY2t0eXBlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IEJsb2NrVHlwZS5Ob25lLFxuICAgICAgICAgICAgdHlwZTogQmxvY2tUeXBlXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXRlbToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMucGxheWVyT25Ub3AgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgb25TdGVwQ2FsbGJhY2s6IGZ1bmN0aW9uIG9uU3RlcENhbGxiYWNrKHBsYXllciwgZ2FtZSkge1xuICAgICAgICBjYy5sb2coJ006IG9uU3RlcENhbGxiYWNrIFBvaXNvbicpO1xuICAgICAgICBjb25zb2xlLmxvZygnRFUgV1VSREVTVCBWRVJHSUZURVQnKTtcbiAgICAgICAgLyppZihwbGF5ZXIucG9pc29uVGltZXI8NiB8fCBwbGF5ZXIucG9pc29uVGltZXI+Nil7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEZXIgVGltZXIgaXN0IGtsZWluZXIgNicpO1xyXG4gICAgICAgICAgICBpZighcGxheWVyLmlzUG9pc29uZWQpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0RlciBTcGllbGVyIGlzdCBub2NoIG5pY2h0IHZlcmdpZnRldCcpO1xyXG4gICAgICAgICAgICAgICAgcGxheWVyLnBvaXNvblRpbWVyID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0qL1xuXG4gICAgICAgIGlmICghcGxheWVyLmlzSW52aW5jaWJsZSkgcGxheWVyLmlzUG9pc29uZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBjb2xsaWRlOiBmdW5jdGlvbiBjb2xsaWRlKCkge31cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2UyMmMzUTRnWEJOQ3A1V1RHQ3RHcVN6JywgJ1NwaWtlJyk7XG4vLyBzY3JpcHRzXFxnYW1lZmllbGRcXGJsb2Nrc1xcU3Bpa2UuanNcblxudmFyIGFscmVhZHlLaWxsZWQgPSBmYWxzZTtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpc0RlYWRseTogdHJ1ZVxuICAgIH0sXG5cbiAgICAvLyBmb286IHtcbiAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAvLyB9LFxuICAgIC8vIC4uLlxuICAgIHN3aXRjaERlYWRseTogZnVuY3Rpb24gc3dpdGNoRGVhZGx5KCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdpc0RlYWRseTogJywgdGhpcy5pc0RlYWRseSk7XG4gICAgICAgIHRoaXMuaXNEZWFkbHkgPSAhdGhpcy5pc0RlYWRseTtcbiAgICAgICAgdGhpcy5oYXNLaWxsZWQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuaXNEZWFkbHkgPSB0cnVlO1xuICAgICAgICB0aGlzLnBsYXllck9uVG9wID0gZmFsc2U7XG4gICAgfSxcblxuICAgIG9uU3RlcENhbGxiYWNrOiBmdW5jdGlvbiBvblN0ZXBDYWxsYmFjayhwbGF5ZXIsIGdhbWUpIHtcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXI7XG4gICAgICAgIHRoaXMucGxheWVyT25Ub3AgPSB0cnVlO1xuICAgICAgICBjb25zb2xlLmxvZygnTTogT25zdGVwIFNwaWtlJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdPblMgaXNEZWFkbHk6ICcsIHRoaXMuaXNEZWFkbHkpO1xuICAgICAgICBpZiAoIXRoaXMuaGFzS2lsbGVkKSB0aGlzLnBlcmZvcm1TcGlrZUtpbGwoKTtcbiAgICB9LFxuXG4gICAgcGVyZm9ybVNwaWtlS2lsbDogZnVuY3Rpb24gcGVyZm9ybVNwaWtlS2lsbCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVhZGx5ICYmICF0aGlzLnBsYXllci5pc0ludmluY2libGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdVdXBzLCBkYXMgd2FyIHTDtnRsaWNoJyk7XG4gICAgICAgICAgICBpZiAoIWFscmVhZHlLaWxsZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5raWxsKCk7XG4gICAgICAgICAgICAgICAgYWxyZWFkeUtpbGxlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmhhc0tpbGxlZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnR2zDvGNrIGdlaGFidCcpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLnBsYXllck9uVG9wKSB0aGlzLnBlcmZvcm1TcGlrZUtpbGwoKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2Y4YWYzbTNMZ2xQTlkzNERkYjlWV0QwJywgJ1N0YXRlcycpO1xuLy8gc2NyaXB0c1xcZW51bXNcXFN0YXRlcy5qc1xuXG52YXIgR2FtZVN0YXRlID0gY2MuRW51bSh7XG4gICAgTm9uZTogOTk5LFxuICAgIElkbGU6IC0xLCAvLyBXYWl0aW5nIGZvciBQbGF5ZXIgdG8gY2hvb3NlIHNvbWV0aGluZyBpbiB0aGUgbWVudVxuICAgIExvYWRpbmc6IC0xLCAvLyBQbGF5ZXIgcHJlc3NlZCBTdGFydCAtPiBsb2FkIGdhbWVcbiAgICBXYWl0aW5nOiAtMSwgLy8gV2FpdGluZyBmb3IgZmlyc3QgbW92ZSB0byBzdGFydCB0aW1lcnMgZXRjXG4gICAgUGxheWluZzogLTEsIC8vIEdhbWUgbG9hZGVkIGFuZCBzdGFydGVkXG4gICAgR2FtZU92ZXI6IC0xLCAvL1BsYXllciBkaWVkXG4gICAgUGF1c2VkOiAtMSwgLy8gR2FtZSB3YXMgcGF1c2VkIGJ5IHRoZSBwbGF5ZXJcbiAgICBSZXN1bWVkOiAtMSwgLy8gR2FtZSB3YXMgcmVzdW1lZCBhZnRlciBwYXVzaW5nXG4gICAgRW5kZWQ6IC0xIH0pO1xuXG4vLyBHYW1lIHdhcyBjbG9zZWQgYnkgdGhlIHBsYXllciBvciBoZSBsb3N0IC0+IGJhY2sgdG8gaWRsZT9cbnZhciBQbGF5ZXJNb3ZlbWVudFN0YXRlID0gY2MuRW51bSh7XG4gICAgU3RhbmRpbmc6IC0xLCAvL1BsYXllciBpcyBzdGFuZGluZyBzdGlsbCAoaGFzIGZ1bGx5IGFycml2ZWQgb24gYSBibG9jaylcbiAgICBKdW1waW5nOiAtMSwgLy9QbGF5ZXIgaXMgbW92aW5nIG9udG8gYW5vdGhlciBibG9jayhpbiBhbmltYXRpb24pXG4gICAgRmFsbGluZzogLTEgfSk7XG5cbi8vUGxheWVyIGlzIGZhbGxpbmcgZG93biB0aGUgZ2FtZWZpZWxkXG52YXIgSXRlbVN0YXRlID0gY2MuRW51bSh7XG4gICAgUGlja2FibGU6IC0xLFxuICAgIEJsb2NrZWQ6IC0xLFxuICAgIFBpY2tlZDogLTFcbn0pO1xuXG52YXIgSXRlbUFjdGl2aXR5U3RhdGUgPSBjYy5FbnVtKHtcbiAgICBJZGxlOiAtMSxcbiAgICBBY3RpdmU6IC0xLFxuICAgIEV4cGlyZWQ6IC0xXG59KTtcblxudmFyIFBsYXllclN0YXRlID0gY2MuRW51bSh7XG4gICAgQWxpdmU6IC0xLFxuICAgIERlYWQ6IC0xLFxuICAgIFBvaXNvbmVkOiAtMSxcbiAgICBJbnZpbmNpYmxlOiAtMVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEdhbWVTdGF0ZTogR2FtZVN0YXRlLFxuICAgIFBsYXllck1vdmVtZW50U3RhdGU6IFBsYXllck1vdmVtZW50U3RhdGUsXG4gICAgSXRlbVN0YXRlOiBJdGVtU3RhdGUsXG4gICAgUGxheWVyU3RhdGU6IFBsYXllclN0YXRlLFxuICAgIEl0ZW1BY3Rpdml0eVN0YXRlOiBJdGVtQWN0aXZpdHlTdGF0ZVxufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzQzMjNkNFhKNFpNaVoyd3greXg3RTduJywgJ1N3aXRjaGVyJyk7XG4vLyBzY3JpcHRzXFxnYW1lZmllbGRcXGJsb2Nrc1xcU3dpdGNoZXIuanNcblxudmFyIEJsb2NrVHlwZSA9IHJlcXVpcmUoJ1R5cGVzJykuQmxvY2tUeXBlO1xudmFyIFBsYXllck1vdmVtZW50U3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5QbGF5ZXJNb3ZlbWVudFN0YXRlO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGlzQmxvY2tlZDogZmFsc2UsXG4gICAgICAgIGhhc0l0ZW06IGZhbHNlLFxuXG4gICAgICAgIGJsb2NrdHlwZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBCbG9ja1R5cGUuTm9uZSxcbiAgICAgICAgICAgIHR5cGU6IEJsb2NrVHlwZVxuICAgICAgICB9LFxuXG4gICAgICAgIGl0ZW06IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnBsYXllck9uVG9wID0gZmFsc2U7XG4gICAgfSxcblxuICAgIG9uU3RlcENhbGxiYWNrOiBmdW5jdGlvbiBvblN0ZXBDYWxsYmFjayhwbGF5ZXIsIGdhbWUpIHtcbiAgICAgICAgY2MubG9nKCdNOiBvblN0ZXBDYWxsYmFjayBTd2l0Y2hlcicpO1xuICAgICAgICBwbGF5ZXIuaXNTd2FwZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBjb2xsaWRlOiBmdW5jdGlvbiBjb2xsaWRlKCkge31cblxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzFjNzEwWXZXdkJBY3FUQkIwV011Tjl2JywgJ1RyYXBkb29yJyk7XG4vLyBzY3JpcHRzXFxnYW1lZmllbGRcXGJsb2Nrc1xcVHJhcGRvb3IuanNcblxudmFyIEJsb2NrVHlwZSA9IHJlcXVpcmUoJ1R5cGVzJykuQmxvY2tUeXBlO1xudmFyIFBsYXllck1vdmVtZW50U3RhdGUgPSByZXF1aXJlKCdTdGF0ZXMnKS5QbGF5ZXJNb3ZlbWVudFN0YXRlO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGlzQmxvY2tlZDogZmFsc2UsXG4gICAgICAgIGhhc0l0ZW06IGZhbHNlLFxuXG4gICAgICAgIGJsb2NrdHlwZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBCbG9ja1R5cGUuTm9uZSxcbiAgICAgICAgICAgIHR5cGU6IEJsb2NrVHlwZVxuICAgICAgICB9LFxuXG4gICAgICAgIGl0ZW06IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnBsYXllck9uVG9wID0gZmFsc2U7XG4gICAgfSxcblxuICAgIG9uU3RlcENhbGxiYWNrOiBmdW5jdGlvbiBvblN0ZXBDYWxsYmFjayhwbGF5ZXIsIGdhbWUpIHtcbiAgICAgICAgdmFyIGFuaW1DdHJsID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICBhbmltQ3RybC5wbGF5KCd0cmFwZG9vcicpO1xuICAgICAgICB2YXIgZmFsbCA9IGNjLm1vdmVUbygxLCBjYy5wKHRoaXMubm9kZS5nZXRQb3NpdGlvblgoKSwgdGhpcy5ub2RlLmdldFBvc2l0aW9uWSgpIC0gMTAwKSk7XG4gICAgICAgIC8vdmFyIGNhbExiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5kZXN0cm95LCB0aGlzKTtcbiAgICAgICAgLy90aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGZhbGwsY2FsTGJhY2spKTtcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihmYWxsKTtcbiAgICAgICAgcGxheWVyLmZhbGwoKTtcbiAgICAgICAgLy9nYW1lLnN0YXRlID0gZ2FtZS5HYW1lU3RhdGUuR2FtZU92ZXI7XG4gICAgfSxcblxuICAgIGNvbGxpZGU6IGZ1bmN0aW9uIGNvbGxpZGUoKSB7fSxcblxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgfVxufSk7XG4vLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzcxYjkzU1JOMEJPMXFLU3E1NUVVL1dJJywgJ1R5cGVzJyk7XG4vLyBzY3JpcHRzXFxlbnVtc1xcVHlwZXMuanNcblxudmFyIEl0ZW1UeXBlID0gY2MuRW51bSh7XG4gICAgTm9uZTogOTk5LFxuICAgIFN0YXI6IC0xLCAvLyBTY29yZVxuICAgIENvaW46IC0xLCAvLyBDbGltYiB0d28oZi5lLikgcm93cyB1cFxuICAgIEFudGlkb3RlOiAtMSwgLy8gQ3VyZXMgcG9pc29uXG4gICAgQmxvY2tlcjogLTEsXG4gICAgU2xvd2VyOiAtMVxufSk7XG5cbnZhciBCbG9ja1R5cGUgPSBjYy5FbnVtKHtcbiAgICBOb25lOiAtMSxcbiAgICBFbXB0eTogLTEsXG4gICAgRGlydDogLTEsXG4gICAgR3Jhc3M6IC0xLFxuICAgIFBvaXNvbjogLTEsXG4gICAgU3dpdGNoZXI6IC0xLFxuICAgIFRyYXBkb29yOiAtMSxcbiAgICBTcGlrZTogLTFcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBJdGVtVHlwZTogSXRlbVR5cGUsXG4gICAgQmxvY2tUeXBlOiBCbG9ja1R5cGVcbn07XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5NmUyMEI5ekZwQ1VLS1ZVbnhQTi9IOScsICdXYXRlclJpZ2h0Jyk7XG4vLyBzY3JpcHRzXFxnYW1lZmllbGRcXGJsb2Nrc1xcV2F0ZXJSaWdodC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMucGxheWVyT25Ub3AgPSBmYWxzZTtcbiAgICB9XG5cbn0pO1xuLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbi8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbi8vIH0sXG5cbmNjLl9SRnBvcCgpOyJdfQ==
