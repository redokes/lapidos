Ext.define('Lapidos.notification.service.Notification', {
	extend: 'Lapidos.service.Service',
	
	///////////////////////////////////////////////////////////////////////////
	// Config
	///////////////////////////////////////////////////////////////////////////
	config: {
		name: 'notification',
		title: 'Notification',
		autoStart: true
	},
	
	init: function() {
		
	},
	
	notify: function(message) {
		this.fireEvent('notify', this, message);
	}
	
});