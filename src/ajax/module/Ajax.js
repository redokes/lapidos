Ext.define('Lapidos.ajax.module.Ajax', {
	extend: 'Lapidos.module.Module',
	
	requires: [
		'Lapidos.ajax.service.BasicAuth',
		'Lapidos.ajax.service.Batcher'
	],
	
	config: {
		name: 'ajax',
		title: 'Ajax',
		services: [
			'Lapidos.ajax.service.BasicAuth',
			'Lapidos.ajax.service.Batcher'
		]
	}

});