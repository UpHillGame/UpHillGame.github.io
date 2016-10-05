const GameState = require('States').GameState;

cc.Class({
    extends: cc.Component,

    properties: {
        pauseOverlay: {
            default: null,
            type: cc.Node
        },

        scoreLabel: {
            default: null,
            type: cc.Label
        },
        
        buttonAudio: {
            default: null,
            url: cc.AudioClip,
        },

        game: {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {
        /*if(game !== undefined)
            this.scoreLabel.string = "Score: "+game.getComponent('Game').score.toString();
            */
        this.score = cc.sys.localStorage.getItem('score');
        console.log('Score in GameButtonCallback: ', this.score);
        if(this.scoreLabel !== null){
            console.log('SCORELABEL');
            console.log(this.scoreLabel);
             this.scoreLabel.string = "Score: " + this.score.toString();
        }
        this.paused = false; // TODO: spread this to the outer world
    },


    pauseControlCallback: function(){
        //TODO: change pause button to different sprite
        if(this.paused){
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

    againControlCallback: function(){
        cc.director.loadScene('GameScene');
        cc.audioEngine.playEffect(this.buttonAudio, false);

    },

    backControlCallback: function(){
        this.game.state = GameState.Ended;
        cc.director.loadScene('Startmenu');
        cc.audioEngine.playEffect(this.buttonAudio, false);

    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
