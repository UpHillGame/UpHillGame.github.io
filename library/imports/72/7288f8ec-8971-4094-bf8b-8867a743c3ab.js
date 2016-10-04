cc.Class({
    "extends": cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        this.clouds = [];
    },

    generateCloudSpeed: function generateCloudSpeed() {},

    animate: function animate(cloud) {},

    randomInRangeInclusive: function randomInRangeInclusive(min, max) {
        var ret;
        for (;;) {
            ret = min + Math.random() * (max - min) * 1.1;
            if (ret <= max) {
                break;
            }
        }
        return ret;
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        for (var i = 0; i < clouds.length; i++) {
            animate(clouds[i]);
        }
    }
});