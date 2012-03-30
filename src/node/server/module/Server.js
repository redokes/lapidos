Ext.define('Lapidos.node.server.module.Server', {
	extend: 'Lapidos.module.Module',
	
	requires: [
		'Lapidos.node.server.service.Http',
		'Lapidos.node.server.service.Socketio'
	],
	
	config: {
		name: 'socket-server',
		title: 'Socket Server',
		services: [
			'Lapidos.node.server.service.Http',
			'Lapidos.node.server.service.Socketio'
		]
	}

});