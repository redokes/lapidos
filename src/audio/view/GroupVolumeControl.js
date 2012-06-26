Ext.define('Lapidos.audio.view.GroupVolumeControl', {
	extend: 'Lapidos.audio.view.VolumeControl',
	requires: [
		'Lapidos.audio.view.VolumeControl'
	],
	config: {
		record: null,
		bubbleEvents: [
			'moduleiconclick'
		]
	},
	
	constructor: function(config) {
		this.initConfig(config);
		
		var record = this.getRecord();
		this.setTitle(record.get('title'));
		this.setIcon(record.get('icon'));
		
		this.callParent(arguments);
	},
	
	init: function() {
		this.initModuleIcon();
		this.callParent(arguments);
	},
	
	initModuleIcon: function() {
		if (!this.getIcon()) {
			this.setIcon(this.defaultIcon);
		}
		this.moduleIcon = this.add(new Ext.button.Button({
			scope: this,
			scale: 'large',
			icon: this.getIcon(),
			handler: this.onModuleIconClick
		}));
	},
	
	onModuleIconClick: function(button) {
		this.fireEvent('moduleiconclick', this, this.getRecord());
	}
	
});