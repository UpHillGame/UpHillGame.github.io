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