const BlockType = require('Types').BlockType;
const PlayerMovementState = require('States').PlayerMovementState;

cc.Class({
    extends: cc.Component,

    properties: {
        isBlocked: false,
        hasItem: false,

        blocktype: {
            default: BlockType.None,
            type: BlockType,
        },

        item: {
            default: null,
            type: cc.Node,
        },

    },

    // use this for initialization
    onLoad: function () {
        this.playerOnTop = false;
    },

    onStepCallback: function(player, game){
        cc.log('M: onStepCallback Dirt');
    },

    collide: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
