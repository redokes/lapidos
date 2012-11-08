Ext.define('Lapidos.core.module.Core', {
	extend: 'Lapidos.module.Module',
	
	requires: [
		'Lapidos.notification.service.Notification'
	],
	
	config: {
		name: 'core',
		title: 'Core',
		services: [
			'Lapidos.notification.service.Notification'
		]
	}

});