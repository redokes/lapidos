Ext.define('Lapidos.shell.Console', {
    extend: 'Lapidos.shell.Shell',
	
	init: function() {
		
	},
	
	showNotification: function(service, message) {
		if (typeof message == 'string') {
			console.log('Notification: ' + message);
		}
		else {
			console.log('Notification:');
			console.log(message);
		}
	}
    
});