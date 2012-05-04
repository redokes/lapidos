Ext.define('Lapidos.audio.model.Channel', {
	extend: 'Ext.data.Model',
	
	fields: [{
		name: 'name'
	}, {
		name: 'instance'
	}],
	proxy: {
		type: 'memory'
	}
});