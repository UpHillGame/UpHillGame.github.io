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

    reset: function () {

    },

    // Called when player onLoad() has finished
    onPlayerLoadCallback: function () {
        this.gamefield.player = this.player;

        // Player is assembled. set all needed graphical information
        this.player.node.setPosition(this.gamefield.getStartPosition());
        this.player.node.setLocalZOrder(1000);
        this.player.dx = this.gamefield.disTX / 2; //only half the distance on x!!
        this.player.dy = this.gamefield.disTY;

    },

    // Called when gamefield is initalized ( onLoad() has finished )
    onGameFieldLoadCallback: function () {

    },

    //TODO hier wird ein Fehler verursacht, wenn Gift NACH einem Switcher kommt!
    validateMove: function (dir) {

        if (this.state === GameState.GameOver) {
            //console.log('Du darfst nicht bewegen, weil du gameOver bist');
            return false;
        }

        if (this.player.movestate === PlayerMovementState.Jumping ||
            this.player.movestate === PlayerMovementState.Falling) { //Player already jumping/falling -> neglect input
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
        if(this.player.isSlowed){
             console.log("PRESSCOUNT" + pressCount);
             pressCount++;
             if(pressCount < 3){
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
                            if (self.player.oldDest !== undefined) {
                                self.player.oldDest.getComponent(self.player.oldDest.name).playerOnTop = false;
                            }

                        }
                        break;
                    case cc.KEY.d:
                        if (self.state === GameState.Waiting)
                            self.state = GameState.Playing;

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

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        //console.log('M: update');
        if (this.state === GameState.Playing) {
            this.moveFieldWithPlayer();
        }
        if (this.state === GameState.GameOver) {
            this.storage.setItem('score', this.score);
            cc.director.loadScene('GameOverScene');
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
});
