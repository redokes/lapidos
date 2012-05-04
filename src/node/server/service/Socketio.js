Ext.define('Lapidos.node.server.service.Socketio', {
	extend: 'Lapidos.service.Service',
	
	requires: [
		'Lapidos.node.server.Namespace'
	],
	
	config: {
		name: 'node-socketio',
		title: 'Node Socket.io Server'
	},
	
	socketio: require('socket.io'),
	io: false,
	httpServerWrapper: null,
	httpServer: null,
	namespace: null,
	
	init: function() {
		this.callParent(arguments);
		this.getManager().onReady('start', this.initHttpServer, this, {
			name: 'node-http'
		});
	},
	
	
	initHttpServer: function(service) {
		this.httpServer = service.httpServer;
		this.io = this.socketio.listen(this.httpServer);
		this.io.set('log level', 1);
		this.createNamespace('');
	},
	
	/**
	 * Creates a new namespace if it doesn't already exist
	 * @param {String} name
	 */
	createNamespace: function(name) {
//		this.getManager().callService('notification', 'notify', 'Check to create namespace ' + name);
		if (!this.io.sockets.manager.namespaces['/' + name]) {
			this.getManager().callService('notification', 'notify', 'Create namespace ' + name);
			this.namespace = new Lapidos.node.server.Namespace({
				name: name,
				io: this.io,
				socket: this
			});
		}
	}
	
});