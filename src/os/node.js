require('node-extjs');

Ext.Loader.setConfig({
	enabled: true,
	paths: {
		Lapidos: __dirname + '/../'
	}
});

Ext.require('Lapidos.os.OS');