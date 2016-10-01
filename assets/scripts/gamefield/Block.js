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

    },

    //What happens if you step on a block
    onStepCallback: function(player){
        // Perform the action the block produces(change player or environment)
        switch(this.blocktype){
            case BlockType.Empty:
                    player.fall();
                break;
        }

        // Perform block animation
        this.node.runAction(this.assembleBlockAction());
        
    },

    // Action(Animation etc) for every block
   assembleBlockAction : function(){
        switch(this.blocktype){
            case BlockType.Empty:
                return cc.moveTo(0,this.node.getPosition());

            case BlockType.Trapdor:
                return cc.moveTo(1, cc.p(this.node.getPositionX(), this.node.getPositionY()-100))
        }
        
    },

    // Part of animation see above
    deform: function(){
        
    },

    destroy: function(){
        this.node.destroy();
    },

    setBlocked: function(bool){
        this.isBlocked = bool;  
    },
    
    isBlocked: function(){
        return this.isBlocked;  
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
