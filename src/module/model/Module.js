Ext.define('Lapidos.module.model.Module', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [
			'instance',
			'cls',
			'title',
			'name',
			'icon'
		],
		proxy: {
			type: 'memory'
		}
	},
	
	fields: [
		'instance',
		'cls',
		'title',
		'name',
		'icon'
	],
	proxy: {
		type: 'memory'
	}
});