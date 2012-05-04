Ext.define('Lapidos.audio.model.Audio', {
	extend: 'Ext.data.Model',
	
	fields: [
		'id',
		'src',
		'fileName',
		'instance',
		'isLoaded',
		'isLoading'
	],
	proxy: {
		type: 'memory'
	}
});