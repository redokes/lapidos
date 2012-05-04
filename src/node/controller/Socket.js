Ext.define('Lapidos.node.controller.Socket', {
	extend: 'Lapidos.controller.Api',
	requires:[
		'Lapidos.controller.Api'
	],
	
	init: function() {
		var os = Lapidos.os.Manager.getDefaultOs();
		os.getServiceManager().onReady('start', function(service) {
			this.io = service.io;
		}, this, {
			name: 'node-socketio'
		});
//		this.io = 
	},
	
	viewNamespacesAction: function() {
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
//			this.getFrontController().getResponseManager().getResponse().write(line);
		}
	},
	
	getNamespacesAction: function() {
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
		this.setResponseParam('records', records);
		this.setResponseParam('total', records.length);
	},
	
	getSocketsAction: function() {
		var namespaceName = this.getRequestParam('namespace', '');
		var namespaces = this.io.sockets.manager.namespaces;
		var sockets = {};
		if (typeof(namespaces[namespaceName]) != 'undefined') {
			sockets = namespaces[namespaceName].sockets;
		}
		var records = [];
		for (var i in sockets) {
			var socket = sockets[i];
			var id = socket.id;
			records.push({
				id: id
			});
		}
		this.setResponseParam('records', records);
		this.setResponseParam('total', records.length);
	}
	
});
