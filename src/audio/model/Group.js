Ext.define('Lapidos.audio.model.Group', {
	extend: 'Ext.data.Model',
	
	fields: [{
		name: 'name',
		type: 'string'
	}],
	proxy: {
		type: 'memory'
	}
});