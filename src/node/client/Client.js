Ext.define('Lapidos.node.client.Client', {
	extend: 'Ext.util.Observable',
	config: {
		url: '',
		port: 8080,
		name: '',
		socket: null
	},
	
	constructor: function(config) {
        this.callParent(arguments);
		this.initConfig(config);
//		this.addEvents('connect', 'disconnect', 'otherConnect', 'otherDisconnect', 'userConnect', 'userDisconnect');
		this.initSocket();
    },
	
	initSocket: function() {
		var url = this.url;
		if (this.getName().length) {
			url += '/' + this.name
		}
		
		if (window.io == null) {
			this.socket = false;
			return false;
		}
		console.log('connect to ' + url);
		this.socket = io.connect(url);
		
		this.socket.on('connect', Ext.bind(function() {
			this.fireEvent('connect', this, arguments);
		}, this));
		this.socket.on('disconnect', Ext.bind(function() {
			this.fireEvent('disconnect', this, arguments);
		}, this));
		this.socket.on('otherConnect', Ext.bind(function() {
			this.fireEvent('otherConnect', this, arguments);
		}, this));
		this.socket.on('otherDisconnect', Ext.bind(function() {
			this.fireEvent('otherDisconnect', this, arguments);
		}, this));
		this.socket.on('userConnect', Ext.bind(function() {
			this.fireEvent('userConnect', this, arguments);
		}, this));
		this.socket.on('userDisconnect', Ext.bind(function() {
			this.fireEvent('userDisconnect', this, arguments);
		}, this));
		
		this.socket.on('createSharedObject', Ext.bind(function(config) {
//			console.log('socket on create shared in here');
			var instance = Ext.create(config.clsName, config)
			this.fireEvent('createSharedObject', this, instance);
		}, this));
		
		this.socket.on('syncSharedObject', Ext.bind(function(config) {
//			console.log('socket on sync shared in here');
			this.fireEvent('syncSharedObject', this, config);
		}, this));
		
		this.socket.on('callSharedMethod', Ext.bind(function(config) {
//			console.log('call shared method in here');
//			console.log(arguments);
			// Get the instance
			this.fireEvent('callSharedMethod', this, config);
		}, this));
		
	},
	
	disconnect: function() {
		this.socket.disconnect();
//		delete this.socket;
	},
	
	send: function(action, data) {
		this.socket.json.send({
    		action: action,
    		data: data
    	});
	},
	
	createSharedObject: function(config, callback) {
//		console.log('create shared');
		this.socket.emit('createSharedObject', config, callback);
	},
	
	syncSharedObject: function(config, callback) {
//		console.log('sync shared');
//		console.log(arguments);
		this.socket.emit('syncSharedObject', config);
	},
	
	callSharedMethod: function(config, callback) {
//		console.log('call shared');
//		console.log(config);
		this.socket.emit('callSharedMethod', config);
	}
});