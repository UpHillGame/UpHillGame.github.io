"use strict";
cc._RFpush(module, '71b93SRN0BO1qKSq55EU/WI', 'Types');
// scripts\enums\Types.js

var ItemType = cc.Enum({
    None: 999,
    Star: -1, // Score
    Coin: -1, // Climb two(f.e.) rows up
    Antidote: -1, // Cures poison
    Blocker: -1,
    Slower: -1
});

var BlockType = cc.Enum({
    None: -1,
    Empty: -1,
    Dirt: -1,
    Grass: -1,
    Poison: -1,
    Switcher: -1,
    Trapdoor: -1,
    Spike: -1
});

module.exports = {
    ItemType: ItemType,
    BlockType: BlockType
};

cc._RFpop();