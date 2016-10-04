const GameState = require('States').GameState;
const PlayerMovementState = require('States').PlayerMovementState;
const PlayerState = require('States').PlayerState;

const explodetime = 0.2;
const riseDeathY = 25;


var animationNeedsUpdate = false;

cc.Class({
    extends: cc.Component,

    properties: {
        // Player spawns in a standing state
        movestate: {
            default: PlayerMovementState.Standing,
            type: PlayerMovementState
        },

        isInvincible: false, // Player picked up an item which made him unkillable
        isPoisoned: false,
        isAlive: false,
        isSwaped: false,    //Player stands on a Switcher //TODO: nutzlos da nie verwendet in player
        isSlowed: false,

        poisonTimer: 0,
        invincibiltyTimer: 0,

        dir: 0, // Next Position player is jumping to 1 : left  -1: right

        arrayPosX: 0, //Position in the array given with row and column
        arrayPosY: 0,

        jumpTime: 0, // Time for jumping action to run
        fallTime: 0, // same: falling 
        
        // Atlas holdin all sprites of the player. 
        playeratlas:{
            default: null,
            type:cc.SpriteAtlas,
        },


        // Player Audios
        jumpAudio: {
            default: null,
            url: cc.AudioClip
        },

        deathAudio: {
            default: null,
            url: cc.AudioClip
        },

        fallAudio: {
            default: null,
            url: cc.AudioClip
        },
        
        drinkAudio: {
            default: null,
            url: cc.AudioClip
        },

        poisonedAudio: {
            default: null,
            url: cc.AudioClip
        },

        // Game reference to pass player
        game: {
        	default: null,
        	type: cc.Node,
        },

        
    },

    // use this for initialization
    onLoad: function () {
        //register player at game for processing player logic 
        this.game.getComponent('Game').player = this;

        if(!this.animation) // Init animation 
            this.animation = this.getComponent(cc.Animation);

        //Init timers
        this.poisonTmp = this.poisonTimer;
        this.invincibiltyTmp = this.invincibiltyTimer;

        this.movestate = PlayerMovementState.Standing;
        this.isMoving = false;
        this.isAlive = true;
        //this.oldDest = this.game.getComponent('Game').gamefield.gameField[gameField.length-1][3];

        this.offsetY = this.node.getContentSize().height/2; // Offset to set the player on top of blocks
        this.destinationpos = cc.p(0,0);

        //Load data relevant to player   -- !! LEAVE AT END OF THIS FUNCTION !! --
        this.game.getComponent('Game').onPlayerLoadCallback();

    },

    kill : function(){
        this.isInvincible = false;
        this.isAlive = false;
        var gamestatecallback = cc.callFunc(this.changeGameState,this);
        var soundcallback = cc.callFunc(this.playSound,this);
        this.node.runAction(cc.sequence(cc.spawn(this.deform(),this.assembleAction()), gamestatecallback, soundcallback));
        cc.audioEngine.stopAllEffects(); //TODO evtl als callback

    },

    fall: function(){
        this.isInvincible = false;
        this.movestate = PlayerMovementState.Falling;
        //var gamestatecallback = cc.callFunc(this.changeGameFallState,this);
        var killcallback = cc.callFunc(this.kill,this);
        var soundcallback = cc.callFunc(this.playSound,this);
        this.node.runAction(cc.sequence(cc.spawn(this.deform(),this.assembleAction()), soundcallback, killcallback));
        this.isAlive = false; //set here because alive impacts death anim.
        cc.audioEngine.stopAllEffects();

    },

    changeGameState: function(){
        if (!this.isAlive)
            this.game.getComponent('Game').state = GameState.GameOver;

    },

    changeGameFallState: function(){
        console.log("Alive: "+this.isAlive);
        if (this.isAlive)
        this.isAlive = false;
            console.log('Change GameState: ', this.game.getComponent('Game').state);
            this.game.getComponent('Game').state = GameState.GameOver;
            console.log(this.game.getComponent('Game').state);

    },

    changePlayerState: function(){
        switch(this.movestate){
            case PlayerMovementState.Jumping:
                this.movestate = PlayerMovementState.Standing;
            break;
        }
    },

    blockStepped: function (player, game) {
        var steppedBlock = this.destfield.getComponent('Block');
        steppedBlock.onStepCallback(this, game);
        var item = steppedBlock.getComponentInChildren('Item');
        if(item !== null)
            item.onPickUpCallback(this, game);
    },
    //
    // Movement and Actions
    //
    
    //Called everytime a the figure is moved by pressing A or D
    move : function(destfield, game){
        if(this.isAlive === false) return;
        this.oldDest = this.destfield;
        this.destfield = destfield; // Direction players wants to move the figure(-1 or 1)
        switch(this.movestate){
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

    setDestinationPos: function(){
        this.destinationpos.x = this.destfield.getPositionX();
        this.destinationpos.y = this.destfield.getPositionY()+ this.offsetY;
    },

    switchPlayerAppearance: function () {
        this.animationRunning = false; //Force player update every jump
        this.updated = this.updateAnimation();
        if(this.updated) // if animations is running dont go to sprite frame changing
            return;
        if (this.dir < 0) { // Player looks left
            this.getComponent(cc.Sprite).spriteFrame = this.playeratlas.getSpriteFrame("player_left");
        } else {
            this.getComponent(cc.Sprite).spriteFrame = this.playeratlas.getSpriteFrame("player_right");
        }
    },

    assembleAction : function(){
        if (this.isAlive === false) //Player dead -> action TODO: versaut fallen animation
            return cc.moveBy(explodetime, cc.p(0,riseDeathY));

        switch(this.movestate){
            case PlayerMovementState.Standing:
                break;
            case PlayerMovementState.Falling:
                return cc.moveTo(this.fallTime, cc.p(this.node.getPosition().x,0)).easing(cc.easeCubicActionIn());
                
            case PlayerMovementState.Jumping:
                // Points forming the beziercurve
                var bezier = [this.node.getPosition() , this.destinationpos , this.destinationpos];
                return cc.bezierTo(this.jumpTime, bezier);
        }
        
    },

    deform: function () {
        if (this.isAlive === false) //Player dead -> deform
            return cc.sequence(cc.scaleTo(explodetime, 1.3, 1.3), cc.scaleTo(explodetime, 0.0, 0.0));
    
        switch (this.movestate) { // Player in a moving state -> action

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
        if (this.isPoisoned)
            return null;

        if (this.isInvincible)
            return null;
    },
        


    // 
    //  Sounds
    //
    
    playSound: function () {
        if(!this.isAlive){
            cc.audioEngine.playEffect(this.deathAudio, false);
            return;
        }

        if(this.isPoisoned)
            cc.audioEngine.playEffect(this.poisonedAudio, true);

        switch(this.movestate){
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
    update: function (dt) {
        if (this.isAlive) {
            this.updateTimers(dt);
            this.updateAnimation();
        }
    },

    updateAnimation: function () {
        if ((!this.isPoisoned && !this.isInvincible)) { //NICE TO HAVE: no bools
            this.animation.stop();
            this.animationRunning = false;
            return false;
        }

        if ((this.isPoisoned || this.isInvincible) && !this.animationRunning)
            this.animation.play(this.getAnimation());
            this.animationRunning = true;
            return true;
    },


    updateTimers : function(dt){
        if(this.isPoisoned)
            if(this.poisonTmp <= 0){ //timer ran out -> kill player
                this.isPoisoned = false;
                this.isAlive = false;
                this.kill();
            } else {
                this.poisonTmp -= dt; //decrease timer...hurry!
            }

        if(this.isInvincible)
            if(this.invincibiltyTmp <= 0){ //timer ran out -> downrank player
                this.isInvincible = false;
                this.invincibiltyTmp = this.invincibiltyTimer;
            } else {
                this.invincibiltyTmp  -= dt; //decrease timer...hurry!
            }
    },
    
    isMoving : function(){
        switch(this.movestate){ //switch for possible further states
            case PlayerMovementState.Jumping:
                this.isMoving = true;
            return true;

            case PlayerMovementState.Standing:
            return false;
        } 
    },
    
    isAlive : function(){
        return isAlive;
    },
    
    getAnimation: function(){
        if (this.dir < 0) {
            if (this.isPoisoned) {
                return 'poison_left_anim';//play('poison_left_anim');
            }

            if (this.isInvincible) {
                return 'star_left_anim';//play('poison_left_anim');
            }
        } else {
            if (this.isPoisoned) {
                return 'poison_right_anim';//play('poison_left_anim');
            }

            if (this.isInvincible) {
                return 'star_right_anim';//play('poison_left_anim');
            }
        }
    },

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
});
