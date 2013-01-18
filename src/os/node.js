express = require('express');
extjs = require('node-extjs-fork');
socketio = require('socket.io');
probe = require('node-ffprobe')


//for (var i = 0; i < tracks.length; i++) {
//    probe(dir + tracks[i], function(err, probeData) {
//        console.log(probeData);
//    });
//}


Ext.Loader.setConfig({
	enabled: true,
	paths: {
		Lapidos: __dirname + '/..'
	}
});

var requires = [
	'Lapidos.os.Os',
	'Lapidos.shell.Console',
	'Lapidos.node.server.module.Server',
    'Lapidos.audio.module.Server'
];

Ext.require(requires, function() {
    var os = new Lapidos.os.Os({
        shell: new Lapidos.shell.Console()
    });
    os.boot();

    var modules = [
        'Lapidos.node.server.module.Server',
        'Lapidos.audio.module.Server'
    ];
    os.getModuleManager().register(modules);
    os.moduleManager.getInstance('audio-server').launch({
        directories: [
            '/Users/wesokes/Music'
        ]
    });
});