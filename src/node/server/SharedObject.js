Ext.define('Lapidos.node.server.SharedObject', {
	extend: 'Ext.util.Observable',
	
	config: {
		id: null
	},
	
	statics: {
		objectCount: 0
	},
	
	constructor: function(config) {
		this.initConfig(config);
		if (!this.id) {
			this.setId('so-' + Lapidos.node.server.SharedObject.objectCount++);
		}
		Ext.apply(this, config);
    }
	
});