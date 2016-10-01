cc.Class({
    'extends': cc.Component,

    properties: {

        buttonAudio: {
            'default': null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},

    startControlCallback: function startControlCallback() {
        var onLaunched = function onLaunched() {
            //use this for callbacks on loading
            console.log('Scene launched');
        };
        cc.director.loadScene('GameScene', onLaunched);
        cc.audioEngine.playEffect(this.buttonAudio, false);
    },

    aboutControlCallback: function aboutControlCallback() {
        cc.director.loadScene('About');
        cc.audioEngine.playEffect(this.buttonAudio, false);
    },

    tutorialControlCallback: function tutorialControlCallback() {
        cc.director.loadScene('Tutorial');
        cc.audioEngine.playEffect(this.buttonAudio, false);
    },

    quitControlCallback: function quitControlCallback() {
        //cc.director.end(); //TODO: how to end the game?
        cc.log("Quit pressed.");
        cc.audioEngine.playEffect(this.buttonAudio, false);
    },

    backControlCallback: function backControlCallback() {
        cc.director.loadScene('Startmenu');
        cc.audioEngine.playEffect(this.buttonAudio, false);
    }
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },