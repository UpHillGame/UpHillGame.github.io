var alreadyKilled = false;

cc.Class({
    extends: cc.Component,

    properties: {
        isDeadly: true,
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    switchDeadly: function(){
        //console.log('isDeadly: ', this.isDeadly);
        this.isDeadly = !this.isDeadly;
        this.hasKilled = false;
    },

    // use this for initialization
    onLoad: function () {
        this.isDeadly = true;
        this.playerOnTop = false;
    },

    onStepCallback: function(player, game){
        this.player = player;
        this.playerOnTop = true;
        console.log('M: Onstep Spike');
        console.log('OnS isDeadly: ', this.isDeadly);
        if(!this.hasKilled)
            this.performSpikeKill();
    },

    performSpikeKill: function () {
        if (!this.isDeadly && !this.player.isInvincible) {
            console.log('Uups, das war tötlich');
            if(!alreadyKilled){
                this.player.kill();
                alreadyKilled = true;
            }
            this.hasKilled = true;
        }
        else {
            console.log('Glück gehabt');
        }
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.playerOnTop)
            this.performSpikeKill();
    },
});
