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
        cc.log('M: onStepCallback Poison');
        console.log('DU WURDEST VERGIFTET');
        /*if(player.poisonTimer<6 || player.poisonTimer>6){
            console.log('Der Timer ist kleiner 6');
            if(!player.isPoisoned){
                console.log('Der Spieler ist noch nicht vergiftet');
                player.poisonTimer = 0;
            }
        }*/
        
        if(!player.isInvincible)
            player.isPoisoned = true;

    },

    collide: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
