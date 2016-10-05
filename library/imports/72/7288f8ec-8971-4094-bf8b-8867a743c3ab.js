var cloudsprites = 7; //How many cloud sprites we have in the atlas

var cloudspawnYmin = 140; //
var cloudspawnYmax = 360; //

cc.Class({
    "extends": cc.Component,

    properties: {
        cloudsAmount: 0,
        cloudsSpeedVariance: 0,

        background: {
            "default": null,
            type: cc.Node
        },

        cloudsatlas: {
            "default": null,
            type: cc.SpriteAtlas
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.clouds = [];
        this.speeds = [];
        this.initalizeClouds();
    },

    initalizeClouds: function initalizeClouds() {
        for (var i = 0; i < this.cloudsAmount; i++) {
            this.generateCloud(i);
        }
    },

    //Returns a cloud node as Sprite from a SpriteFrame
    generateCloud: function generateCloud(id) {
        var rndm = this.randomInRangeInclusive(1, this.cloudsprites);
        var cloudsprite = this.cloudsatlas.getSpriteFrame(this.getCloudRandomSprite(rndm));

        var x = this.randomInRangeInclusive(-700, -800);
        var y = this.randomInRangeInclusive(cloudspawnYmin, cloudspawnYmax);
        var node = new cc.Node("New CloudSprite");
        node.addComponent(cc.Sprite);
        node.getComponent(cc.Sprite).spriteFrame = cloudsprite;
        node.setPosition(cc.p(x, y));

        this.clouds[id] = node;
        this.speeds[id] = this.randomInRangeInclusive(1, this.cloudsSpeedVariance);

        this.background.addChild(node);
    },

    updateCloud: function updateCloud(cloudId, dt) {
        var cloud = this.clouds[cloudId];
        var speed = this.speeds[cloudId];
        var x = cloud.getPositionX();

        if (x > 550) {
            //canvas.width+cloud.getContentSize().width //Cloud is outside the frame
            cloud.destroy(); //destroy this cloud ..
            this.generateCloud(cloudId); //and create a new one
        }

        var y = cloud.getPositionY();
        cloud.setPosition(cc.p(x + speed * 2 * dt, y));
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        for (var i = 0; i < this.clouds.length; i++) {
            this.updateCloud(i, dt);
        }
    },

    //
    // Helping functions
    //
    getCloudRandomSprite: function getCloudRandomSprite(int) {
        switch (int) {
            case 0:
                return "cloud_01";
            case 1:
                return "cloud_02";
            case 2:
                return "cloud_03";
            case 3:
                return "cloud_04";
            case 4:
                return "cloud_05";
            case 5:
                return "cloud_06";
            case 6:
                return "cloud_07";
            default:
                return "cloud_01";
        }
    },

    randomInRangeInclusive: function randomInRangeInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});