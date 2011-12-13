Ext.define('Lapidos.module.model.Module', {
	extend: 'Ext.data.Model',
	fields: [
		'instance',
		'cls',
		'title',
		'name'
	],
	proxy: {
		type: 'memory'
	}
});