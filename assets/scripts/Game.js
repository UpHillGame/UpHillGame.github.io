//Game
// Imports
const GameState = require('States').GameState;
const PlayerMovementState = require('States').PlayerMovementState;
const Step = require('Types').BlockType;

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
    extends: cc.Component,

    properties: {
        state: {
            default: GameState.None,
            type: GameState
        },
        // Game Data/Objects
        gamefield: {
            default: null,
            type: cc.Node,
        },

        player: {
            default: null,
            type: cc.Node,
        },

        // Game-UI
        background: {
            default: null,
            type: cc.Sprite,
        },

        scoreLabel: {
            default: null,
            type: cc.Label,
        },

        multiplierLabel: {
            default: null,
            type: cc.Label,
        },

        // Music Theme
        themeurl: {
            default: null,
            url: cc.AudioClip,
        },
    },

    // use this for initialization
    onLoad: function () {
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

    reset: function () {

    },

    // Called when player onLoad() has finished
    onPlayerLoadCallback: function () {
        this.gamefield.player = this.player;

        // Player is assembled. set all needed graphical information
        this.gamefield.setPlayerStart(this.player);
        this.player.node.setLocalZOrder(1000);

    },

    // Called when gamefield is initalized ( onLoad() has finished )
    onGameFieldLoadCallback: function () {

    },

    validateMove: function (dir) {

        if (this.state === GameState.GameOver) {
            return false;
        }

        if (this.player.movestate === PlayerMovementState.Jumping ||
            this.player.movestate === PlayerMovementState.Falling) { //Player already jumping/falling -> neglect input
            return false;
        }

        // Handle swaped case
        if (this.player.isSwaped) {
            dir = -dir;
        }

        // Handle slowed case
        if(this.player.isSlowed){
             pressCount++;
             if(pressCount < 3){
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
        if(this.player.dir != dir)
            this.animationNeedsUpdate = true;
        this.player.dir = dir;
        this.incrementScore(1);
        this.scoreLabel.string = this.score.toString();

        return true;
    },


    initalizeInputControl: function () {

        var self = this;

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,

            onKeyPressed: function (keyCode, event) {
                if (self.state == GameState.Paused) return;
                switch (keyCode) {
                    case cc.KEY.a:
                        if (self.state === GameState.Waiting)
                            self.state = GameState.Playing;

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
                        if (self.state === GameState.Waiting)
                            self.state = GameState.Playing;

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

            onKeyReleased: function (keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:

                        break;
                    case cc.KEY.d:

                        break;
                }
            }
        }, self.node);
    },


    parallaxBackground: function(){
        this.background.node.runAction(cc.moveBy(this.player.jumpTime, cc.p(this.player.dir, 0)));
    },


    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
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

    moveFieldWithPlayer: function () {
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

    changeMultiplier: function (value) {
        //TODO: Stop and start action by tag
        this.scoreMultiplier = value;
        this.multiplierLabel.string = "Multiplier: " + this.scoreMultiplier;
        this.multiplierLabel.node.opacity = 255;
        var resetMultiplierCallback = cc.callFunc(this.resetMultiplier, this);
        this.multiplierLabel.node.runAction(cc.sequence(cc.fadeOut(5), resetMultiplierCallback));
    },

    resetMultiplier: function () {
        this.scoreMultiplier = 0;
    },

    incrementScore: function (inc) {
        this.score += inc * this.scoreMultiplier;
    },



    //Deprecated
    checkItemCollision: function (item) {
        var itempos = item.node.getPosition();
        var ppos = this.player.node.getPosition();
        var dist = cc.pDistance(itempos, ppos);
        if (dist < item.collectRadius) {
            item.onPickUpCallback(this.player);
        }
    },
});
