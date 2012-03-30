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
		service.on('requestsocket', this.onRequest, this);
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
			this.namespace = Ext.create('Lapidos.node.server.Namespace', {
				name: name,
				io: this.io,
				socket: this
			});
		}
	},
	
	onRequest: function(methodName, request, response, path, data) {
		if (Ext.isFunction(this[methodName])) {
			var args = [];
			var numArgs = arguments.length;
			for (var i = 1; i < numArgs; i++) {
				args.push(arguments[i]);
			}
			this[methodName].apply(this, args);
		}
	},
	
	
	viewNamespacesAction: function(request, response, path, params) {
		var namespaces = this.io.sockets.manager.namespaces;
		for (var i in namespaces) {
			var namespace = namespaces[i];
			var name = '';
			if (namespace.name.length) {
				name = namespace.name;
			}
			else {
				name = '(global)';
			}
			var line = name + ' = ' + Ext.Object.getSize(namespace.sockets) + ' connections\n';
			response.write(line);
		}
	},
	
	getNamespacesAction: function(request, response, path, params) {
		var namespaces = this.io.sockets.manager.namespaces;
		var records = [];
		for (var i in namespaces) {
			var namespace = namespaces[i];
			var name = '';
			if (namespace.name.length) {
				name = namespace.name;
			}
			else {
				name = '(global)';
			}
			records.push({
				name: name,
				numConnections: Ext.Object.getSize(namespace.sockets)
			});
		}
		var data = {
			records: records,
			total: records.length
		}
		response.write(Ext.encode(data));
	},
	
	getSocketsAction: function(request, response, path, params) {
		var namespaceName = params.namespace || '';
		var namespaces = this.io.sockets.manager.namespaces;
		var sockets = namespaces[namespaceName].sockets;
		var records = [];
		for (var i in sockets) {
			var socket = sockets[i];
			var id = socket.id;
			records.push({
				id: id
			});
		}
		var data = {
			records: records,
			total: records.length
		}
		response.write(Ext.encode(data));
	}
	
});