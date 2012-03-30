Ext.define('Lapidos.node.client.module.Manager', {
	extend: 'Lapidos.module.Module',
	
	requires: [
		'Lapidos.node.client.service.Manager'
	],
	
	config: {
		name: 'socket-manager',
		title: 'Socket Manager',
		services: [
			'Lapidos.node.client.service.Manager'
		],
		
		serverUrl: false,
		jsFile: false,
		timeout: 3000
	},
	
	initServices: function() {
		this.callParent(arguments);
		this.getOs().getServiceManager().getInstance('socket-manager').setServerUrl(this.getServerUrl());
	},
	
	init: function() {
		// Check if we can connect. and if so, start the socket manager service
		if (this.getJsFile()) {
			this.getOs().getShell().addJs(this.getJsFile(), this.startService, Ext.emptyFn, this);
		}
		
		this.callParent(arguments);
	},
	
	onRegister: function() {
		
	},
	
	startService: function() {
		var service = this.getOs().getServiceManager().getInstance('socket-manager');
		if (window.io == null) {
			service.stop();
		}
		else if (service.getAutoStart()) {
			service.start();
		}
	}
	
});