"use strict";
cc._RFpush(module, 'a9d5fhMpDRB7rnwgzl0Y19Z', 'Item');
// scripts\gameobjects\Item.js


var ItemType = require('Types').ItemType;
var ItemState = require('States').ItemState;
var ItemActivityState = require('States').ItemActivityState;

var riseY = 50;

cc.Class({
    'extends': cc.Component,

    properties: {
        itemtype: {
            'default': ItemType.None,
            type: ItemType
        },

        itemstate: {
            'default': ItemState.Pickable,
            type: ItemState
        },

        activitystate: {
            'default': ItemActivityState.Idle,
            type: ItemActivityState
        },

        collectRadius: 0,
        itemValue: 0, // Value of the item when picked up(pure score, score multiplier)
        itemTimer: 0,

        activationsound: { // Drag right audio here.
            'default': null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},

    destroyItem: function destroyItem() {
        console.log("Itemtype to destroy: " + this.itemtype.toString());
        console.log(ItemType[this.itemtype]);
        switch (this.itemtype) {
            case ItemType.Slower:
                break;
            case ItemType.Antidote:
            case ItemType.Coin:
            case ItemType.Star:
                this.node.destroy();
                break;
        }
    },

    onPickUpCallback: function onPickUpCallback(player, game) {
        this.itemstate = ItemState.Picked;
        this.activitystate = ItemActivityState.Active;
        // Perform the action the item produces(change player or environment)
        switch (this.itemtype) {
            case ItemType.Antidote:
                player.isPoisoned = false;
                player.poisonTmp = player.poisonTimer; //reset timmer
                break;
            case ItemType.Coin:
                console.log('GAME: ', game.name);
                game.incrementScore(5);
                game.scoreLabel.string = game.score.toString();
                break;
            case ItemType.Star:
                player.isPoisoned = false;
                player.isInvincible = true;
                break;
            case ItemType.Slower:
                console.log("SET SWAPED TRUE");
                player.isSlowed = true;
                break;
        }
        var pickedCallback = cc.callFunc(this.picked, this);
        var soundcallback = cc.callFunc(this.playSound, this);
        // Perform item animation and destroy it
        this.node.runAction(cc.sequence(cc.spawn(this.assemblePickUpAction(), soundcallback), pickedCallback));
    },

    assemblePickUpAction: function assemblePickUpAction() {
        this.activitystate = ItemActivityState.Active;
        // Rise-Animation for items to show they have been picked up       
        var risePoint = cc.p(this.node.getPositionX(), this.node.getPositionY() + riseY);
        var fade = cc.fadeOut(this.getItemAnimationTime()); // Let item fade during animation
        var anim = null;

        switch (this.itemtype) {
            case ItemType.Star:
            case ItemType.Coin:
            case ItemType.Antidote:
                anim = cc.moveBy(this.getItemAnimationTime(), risePoint);
                break;
        }
        return cc.spawn(fade, anim);
    },

    getItemAnimationTime: function getItemAnimationTime(type) {
        switch (this.itemtype) {
            case ItemType.Antidote:
            case ItemType.Coin:
            case ItemType.Star:
                return 1.5;
        }
    },

    picked: function picked() {
        this.activitystate = ItemActivityState.Expired;
        this.destroyItem();
    },

    playSound: function playSound() {
        if (this.activationsound !== null) cc.audioEngine.playEffect(this.activationsound, false);
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();