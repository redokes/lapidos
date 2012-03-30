Ext.define('Lapidos.resource.model.Resource', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [
			'src',
			'extension',
			'element',
			'isLoaded',
			'isLoading'
		],
		proxy: {
			type: 'memory'
		}
	},
	
	fields: [
		'src',
		'extension',
		'element',
		'isLoaded',
		'isLoading'
	],
	proxy: {
		type: 'memory'
	}
});