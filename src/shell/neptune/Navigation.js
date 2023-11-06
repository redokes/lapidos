Ext.define('Lapidos.shell.neptune.Navigation', {
	extend: 'Ext.Component',
	
	config: {
		store: null
	},
	
	constructor: function(config){
		this.initConfig(config);
		this.callParent(arguments);
	},
	
	initComponent: function() {
		this.init();
		this.callParent(arguments);
	},
	
	init: function() {
		this.initStore();
		
	},
	
	initStore: function() {
		this.store.on({
			scope: this,
			datachanged: {
				scope: this,
				buffer: 100,
				fn: this.onDataChange
			}
		});
	},
	
	onDataChange: function() {
		var numRecords = this.store.data.items.length;
		for (var i = 0; i < numRecords; i++) {
			this.add({
				xtype: 'button',
				text: 'test'
			})
		}
	}
});