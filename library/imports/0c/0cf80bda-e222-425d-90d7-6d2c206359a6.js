var BlockType = require('Types').BlockType;
var PlayerMovementState = require('States').PlayerMovementState;

var tempParent;

cc.Class({
    'extends': cc.Component,

    properties: {
        isBlocked: false,
        hasItem: false,
        isDeadly: false,

        blocktype: {
            'default': BlockType.None,
            type: BlockType
        },

        item: {
            'default': null,
            type: cc.Node
        },

        onSteppedSound: {
            'default': null,
            type: cc.Node
        },

        defaultSound: {
            'default': null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        //If block has animation load it
        var anim = this.node.getComponent(cc.Animation);
        if (anim !== null || undefined) this.anim = anim;
        //Initalize Block coressponding to its type
        switch (this.blocktype) {
            case BlockType.Spike:
                this.hasKilled = false;
            case BlockType.Trapdoor:
            case BlockType.Empty:
                this.isDeadly = true;
                break;
            case BlockType.Dirt:
            case BlockType.Gras:
            case BlockType.Switcher:
            case BlockType.Poison:
                break;
        }
    },

    //What happens if you step on a block
    onStepCallback: function onStepCallback(player, game) {
        this.player = player;
        // Perform the action the block produces(change player or environment)
        switch (this.blocktype) {
            case BlockType.Dirt:
            case BlockType.Gras:
                break;
            case BlockType.Empty:
                this.player.fall();
                break;
            case BlockType.Switcher:
                this.player.isSwaped = true;
                break;
            case BlockType.Trapdoor:
                this.anim.play('trapdoor');
                this.player.fall();
                break;
            case BlockType.Poison:
                if (!this.player.isInvincible) this.player.isPoisoned = true;
                break;
            case BlockType.Spike:
                this.playerOnTop = true;
                if (!this.hasKilled) this.performSpikeKill();
                break;
        }

        // Perform block animation
        var stepFinishedCallback = cc.callFunc(this.finishStep, this);
        //var blockaction = cc.spawn(this.assembleBlockAction(), this.deform());
        this.node.runAction(cc.sequence(this.shake(), stepFinishedCallback));
        this.player.node.runAction(this.shake());
    },

    //Let blocks shake when they are stepped on (including player)
    shake: function shake() {
        var down = cc.moveBy(0.2, cc.p(0, -2)).easing(cc.easeCubicActionIn());
        var up = cc.moveBy(0.2, cc.p(0, +2)).easing(cc.easeCubicActionIn());
        var shake = cc.sequence(down, up);
        return shake;
    },

    finishStep: function finishStep() {},

    // Action(Animation etc) for every block
    assembleBlockAction: function assembleBlockAction() {
        switch (this.blocktype) {
            case BlockType.Empty:
            case BlockType.Dirt:
            case BlockType.Gras:
            case BlockType.Switcher:
            case BlockType.Poison:
            case BlockType.Spike:
                return cc.moveTo(0, this.node.getPosition());
            case BlockType.Trapdor:
                return cc.moveTo(1, cc.p(this.node.getPositionX(), this.node.getPositionY() - 100));
        }
    },

    // Part of animation see above
    deform: function deform() {
        switch (this.blocktype) {
            case BlockType.Empty:
            case BlockType.Dirt:
            case BlockType.Gras:
            case BlockType.Switcher:
            case BlockType.Trapdoor:
            case BlockType.Poison:
            case BlockType.Spike:
                return cc.moveTo(0, this.node.getPosition());
        }
    },

    performSpikeKill: function performSpikeKill() {
        if (!this.isDeadly && !this.player.isInvincible) {
            if (!this.hasKilled) {
                this.player.kill();
                this.hasKilled = true;
            }
        } else {}
    },

    destroy: function destroy() {
        this.node.destroy();
    },

    setBlocked: function setBlocked(bool) {
        this.isBlocked = bool;
    },

    isBlocked: function isBlocked() {
        return this.isBlocked;
    },

    switchDeadly: function switchDeadly() {
        //console.log('isDeadly: ', this.isDeadly);
        this.isDeadly = !this.isDeadly;
        this.hasKilled = false;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (this.playerOnTop) this.performSpikeKill();
    }
});