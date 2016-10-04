cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.clouds = [];
    },

    generateCloudSpeed: function(){

    },

    animate: function(cloud){

    },

    randomInRangeInclusive: function (min, max) {
        var ret;
        for (; ;) {
            ret = min + (Math.random() * (max - min) * 1.1);
            if (ret <= max) { break; }
        }
        return ret;
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        for(var i = 0; i < clouds.length; i++){
            animate(clouds[i]);
        }
    },
});
