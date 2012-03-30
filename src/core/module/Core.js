Ext.define('Lapidos.core.module.Core', {
	extend: 'Lapidos.module.Module',
	
	requires: [
		'Lapidos.notification.service.Notification',
		'Lapidos.ajax.service.Batcher'
	],
	
	config: {
		name: 'core',
		title: 'Core',
		services: [
			'Lapidos.notification.service.Notification',
			'Lapidos.ajax.service.Batcher'
		]
	}

});