Ext.define('Lapidos.node.client.service.Manager', {
	extend: 'Lapidos.service.Service',
	requires: [
		'Lapidos.node.client.Client'
	],
	
	config: {
		name: 'socket-manager',
		title: 'Socket Manager',
		autoStart: true,
		
		namespaces: {},
		serverUrl: false
	},
	
	start: function() {
		// Make sure the socket io exists
		if (window.io == null) {
			return false;
		}
		this.callParent(arguments);
		
		if (this.isRunning()) {
			this.initClient('');
		}
	},
	
	/**
	 * Makes sure the namespace exists and creates a client object
	 * to manage the namespace connection
	 */
	onConnect: function(name, callback, scope, options) {
		var service = this.getOs().getServiceManager().getInstance('socket-manager');
		if (!service.isRunning()) {
			return false;
		}
		
		if (scope == null) {
			scope = this;
		}
		if (options == null) {
			options = {};
		}
		
		this.on('connect', function(client, options) {
			if (client.name == options.name) {
				Ext.bind(options.callback, options.scope)(client, options.options);
			}
		}, this, {name: name, callback: callback, scope: scope, options: options});
		
		var client = this.getClient(name);
		if (client == null) {
			this.initClient(name);
		}
		else {
			Ext.bind(callback, scope)(client, options);
		}
	},
	
	/**
	 * Creates a client object to manage the namespace connection
	 */
	initClient: function(name) {
		var service = this.getOs().getServiceManager().getInstance('socket-manager');
		if (!service.isRunning()) {
			return false;
		}
		
		// Make sure this client does not exist
		var client = this.getClient(name);
		if (client != null) {
			return client;
		}
		
		// Check if we need to make a namespace
		if (name.length && !Ext.isDefined(this.getNamespaces()[name])) {
			// Make sure global namespace exists
			var globalClient = this.getClient('');
			if (globalClient == null) {
				// Need to make the global namespace before making others
				this.onConnect('', function(client, options) {
					this.initClient(options.name);
				}, this, {
					name: name
				});
			}
			else {
				globalClient.socket.emit('connectToNamespace', {
					name: name
				}, Ext.bind(function(params) {
					this.getNamespaces()[params.name] = null;
					this.initClient(params.name);
				}, this))
			}
			return;
		}
		
		/**
		 * Create the client object for the namespace connection and keep track
		 * of it in the namespaces propery
		 */
		client = new Lapidos.node.client.Client({
			url: this.getServerUrl(),
			name: name
		});
		this.setClient(client);
		
		// Fire an event for setting up the client object
		this.fireEvent('connect', client);
		this.initClientListeners(client);
		return client;
	},
	
	initClientListeners: function(client) {
		client.socket.on('callService', Ext.bind(function(params) {
			var data = params.data;
			var config = data.config;
			this.getManager().callService(data.name, data.method, config);
		}, this));
	},
	
	/**
	 * Returns the client for the specified namespace if it exists
	 */
	getClient: function(name) {
		return this.getNamespaces()[name];
	},
	
	setClient: function(client) {
		this.getNamespaces()[client.getName()] = client;
	},
	
	callService: function(namespace, name, method, config) {
		var client = this.getClient(namespace);
		if (client != null) {
			client.send('callService', {
				name: name,
				method: method,
				config: config
			});
		}
	},
	
	/**
	 * Disconnects the namespace connection if it exists
	 */
	removeClient: function(name) {
		var client = this.getClient(name);
		if (client) {
			client.disconnect();
//			delete this.namespaces[name];
		}
	}
	
});