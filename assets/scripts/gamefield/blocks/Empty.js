const BlockType = require('Types').BlockType;
const PlayerMovementState = require('States').PlayerMovementState;

cc.Class({
    extends: cc.Component,

    properties: {
        /*gamefield: {
            default: null,
            type: cc.Node,
        },*/

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
        // Perform the action the block produces(change player or environment)
        player.fall();
    },

    collide: function () {
        cc.log('wir sind in der Methode');
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
