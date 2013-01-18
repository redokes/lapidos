express = require('express');
extjs = require('node-extjs-fork');
socketio = require('socket.io');

Ext.Loader.setConfig({
	enabled: true,
	paths: {
		Lapidos: __dirname + '/..'
	}
});

var requires = [
	'Lapidos.os.Os',
	'Lapidos.shell.Console',
	'Lapidos.node.server.module.Server'
];

Ext.require(requires, function() {
    var os = new Lapidos.os.Os({
        shell: new Lapidos.shell.Console()
    });
    os.boot();

    var modules = [
        'Lapidos.node.server.module.Server'
    ];
    os.getModuleManager().register(modules);
});