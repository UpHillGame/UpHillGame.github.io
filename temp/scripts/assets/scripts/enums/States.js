"use strict";
cc._RFpush(module, 'f8af3m3LglPNY34Ddb9VWD0', 'States');
// scripts\enums\States.js

var GameState = cc.Enum({
    None: 999,
    Idle: -1, // Waiting for Player to choose something in the menu
    Loading: -1, // Player pressed Start -> load game
    Waiting: -1, // Waiting for first move to start timers etc
    Playing: -1, // Game loaded and started
    GameOver: -1, //Player died
    Paused: -1, // Game was paused by the player
    Resumed: -1, // Game was resumed after pausing
    Ended: -1 });

// Game was closed by the player or he lost -> back to idle?
var PlayerMovementState = cc.Enum({
    Standing: -1, //Player is standing still (has fully arrived on a block)
    Jumping: -1, //Player is moving onto another block(in animation)
    Falling: -1 });

//Player is falling down the gamefield
var ItemState = cc.Enum({
    Pickable: -1,
    Blocked: -1,
    Picked: -1
});

var ItemActivityState = cc.Enum({
    Idle: -1,
    Active: -1,
    Expired: -1
});

var PlayerState = cc.Enum({
    Alive: -1,
    Dead: -1,
    Poisoned: -1,
    Invincible: -1
});

module.exports = {
    GameState: GameState,
    PlayerMovementState: PlayerMovementState,
    ItemState: ItemState,
    PlayerState: PlayerState,
    ItemActivityState: ItemActivityState
};

cc._RFpop();