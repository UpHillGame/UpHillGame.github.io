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