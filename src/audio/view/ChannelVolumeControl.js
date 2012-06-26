Ext.define('Lapidos.audio.view.ChannelVolumeControl', {
	extend: 'Lapidos.audio.view.VolumeControl',
	requires: [
		'Lapidos.audio.view.VolumeControl'
	],
	config: {
		record: null
	},
	
	constructor: function(config) {
		this.initConfig(config);
		
		var record = this.getRecord();
		this.setTitle(record.get('name'));
		this.setIcon(record.get('icon'));
		
		this.callParent(arguments);
	},
	
	init: function() {
		this.callParent(arguments);
	}
	
});