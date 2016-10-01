cc.Class({
    extends: cc.Component,

    properties: {

        buttonAudio: {
            default: null,
            url: cc.AudioClip,
        },
    },

    // use this for initialization
    onLoad: function () {

    },

    startControlCallback: function () {
        var onLaunched = function () { //use this for callbacks on loading
            console.log('Scene launched');
        };
        cc.director.loadScene('GameScene', onLaunched);
        cc.audioEngine.playEffect(this.buttonAudio, false);

    },

    aboutControlCallback: function () {
        cc.director.loadScene('About');
        cc.audioEngine.playEffect(this.buttonAudio, false);

    },


    tutorialControlCallback: function () {
        cc.director.loadScene('Tutorial');
        cc.audioEngine.playEffect(this.buttonAudio, false);
    },

    quitControlCallback: function () {
        //cc.director.end(); //TODO: how to end the game?
        cc.log("Quit pressed.");
        cc.audioEngine.playEffect(this.buttonAudio, false);
    },

    backControlCallback: function () {
        cc.director.loadScene('Startmenu');
        cc.audioEngine.playEffect(this.buttonAudio, false);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
