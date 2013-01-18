Ext.define('Lapidos.audio.controller.Music', {
    extend: 'Lapidos.controller.Api',
    requires:[
        'Lapidos.controller.Api'
    ],

    readAction: function() {
        var os = Lapidos.os.Manager.defaultOs;
        var module = os.moduleManager.getInstance('audio-server');
        this.frontController.responseManager.setParam('objects', module.metaData);
    },

    getMp3Action: function() {
        this.frontController.server.sendFile('2.mp3', this.frontController.response, function() {
            console.log('callback');
            console.log(arguments);
        });
    },


});
