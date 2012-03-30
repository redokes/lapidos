require('node-extjs');

Ext.Loader.setConfig({
	enabled: true,
	paths: {
		Lapidos: __dirname + '/../'
	}
});

var requires = [
	'Lapidos.JSON',
	'Lapidos.os.OS',
	'Lapidos.shell.Console',
	'Lapidos.node.server.module.Server'
];

Ext.require(requires, function() {
	var os = new Lapidos.os.OS();
	var shell = new Lapidos.shell.Console(os);
	
	var modules = [
		'Lapidos.node.server.module.Server'
	];
	os.getModuleManager().register(modules);
});