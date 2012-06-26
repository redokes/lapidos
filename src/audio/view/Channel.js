Ext.define('Lapidos.audio.view.Channel', {
	extend: 'Ext.panel.Panel',
	requires: [
		'Lapidos.audio.view.ChannelVolumeControl'
	],
	config: {
		title: 'Channel Audio',
		overflowX: 'auto',
		group: null
	},
	layout: {
		type: 'hbox',
		align: 'stretch'
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.init();
	},
	
	init: function() {
		this.initListeners();
	},
	
	showGroup: function(group) {
		this.setGroup(group);
		this.removeAll(true);
		
		// Get all channels for this group
		var channels = group.getChannels();
		var numChannels = channels.length;
		for (var i = 0; i < numChannels; i++) {
			this.addChannel(channels[i]);
		}
	},
	
	addChannel: function(record) {
		this.add(new Lapidos.audio.view.ChannelVolumeControl({
			record: record
		}));
	},
	
	removeGroup: function() {
		this.setGroup(null);
	},
	
	initListeners: function() {
		
	}
	
});