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
        var id = this.frontController.requestParser.getRequestParam('id', 0);
        var os = Lapidos.os.Manager.defaultOs;
        var module = os.moduleManager.getInstance('audio-server');
        var file = module.metaData[id]['file'];
        this.frontController.response.sendfile(file, this.frontController.response, function() {

        });
    },

    sendHeaders: function() {

    }


});
