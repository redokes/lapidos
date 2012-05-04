Ext.define('Lapidos.node.shared.Object', {
	requires: [
		'Lapidos.node.client.SharedObject'
	],
	sharedObject: null,
	
	createShared: function(client, config) {
		config = config || {};
		config.clsName = this.self.getName();
		
		if (this.sharedObject) {
			console.log('so exists so sync');
			this.syncShared(config);
		}
		else if (client) {
			console.log('object create shared');
			client.createSharedObject(config, function(config) {
				this.sharedObject = new Lapidos.node.client.SharedObject(config);
				console.log('made this guy');
				console.log(arguments);
				console.log(this.sharedObject);
			}.bind(this));
		}
	},
	
	callSharedMethod: function(methodName, args) {
		this[methodName].apply(this, args);
		if (this.sharedObject) {
			this.game.client.callSharedMethod({
				id: this.sharedObject.id,
				methodName: methodName,
				args: arguments[1]
			});
		}
	},
	
	syncShared: function(config) {
		console.log('sync object');
		if (this.sharedObject) {
			console.log('yes sync it');
			config.id = this.sharedObject.id
			this.game.client.syncSharedObject(config);
		}
	}
	
});