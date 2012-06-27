Ext.define('Lapidos.audio.model.Group', {
	extend: 'Ext.data.Model',
	requires: [
		'Lapidos.audio.model.Channel',
		'Lapidos.audio.model.channel.Single',
		'Lapidos.audio.model.channel.Multi',
		'Lapidos.audio.model.channel.Queued'
	],
	
	fields: [{
		name: 'name',
		type: 'string'
	},{
		name: 'title',
		type: 'string'
	},{
		name: 'icon',
		type: 'string'
	},{
		name: 'module'
	},{
		name: 'volume',
		defaultValue: 1
	},{
		name: 'relativeVolume',
		defaultValue: 1
	},{
		name: 'realVolume',
		defaultValue: 1
	}],
	
	proxy: {
		type: 'memory'
	},
	
	config: {
		channelStore: null
	},
	
	oldVolume: 1,
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.init();
	},
	
	init: function() {
		this.initChannelStore();
	},
	
	initChannelStore: function() {
		this.setChannelStore(new Ext.data.Store({
			model: 'Lapidos.audio.model.Channel'
		}));
	},
	
	createChannel: function(name) {
		var channel = new Lapidos.audio.model.channel.Single({
			title: name,
			name: name
		});
		this.getChannelStore().add(channel);
		return channel;
	},
	
	createSingleChannel: function(name) {
		return this.createChannel(name);
	},
	
	createMultiChannel: function(name) {
		var channel = new Lapidos.audio.model.channel.Multi({
			title: name,
			name: name
		});
		this.getChannelStore().add(channel);
		return channel;
	},
	
	createQueuedChannel: function(name) {
		var channel = new Lapidos.audio.model.channel.Queued({
			title: name,
			name: name
		});
		this.getChannelStore().add(channel);
		return channel;
	},
	
	getChannel: function(name) {
		return this.getChannelStore().findRecord('name', name);
	},
	
	getChannels: function() {
		return this.getChannelStore().data.items;
	},
	
	setVolume: function(volume) {
		if (volume > 1 && volume <= 100) {
			volume /= 100;
		}
		
		this.set('volume', volume);
		
		if (volume > 0) {
			this.oldVolume = this.get('volume');
		}
		
		this.setRealVolume(this.get('volume') * this.get('relativeVolume'));
		this.fireEvent('volumechange', this, volume);
	},
	
	setRelativeVolume: function(volume) {
		if (volume > 1 && volume <= 100) {
			volume /= 100;
		}
		this.set('relativeVolume', volume);
		this.setRealVolume(this.get('volume') * this.get('relativeVolume'));
	},
	
	setRealVolume: function(volume) {
		if (volume > 1 && volume <= 100) {
			volume /= 100;
		}
		this.set('realVolume', volume);
		
		if (this.get('title') == 'Master') {
			var groups = this.manager.getGroups();
			var numGroups = groups.length;
			for (var i = 0; i < numGroups; i++) {
				if (groups[i] != this) {
					groups[i].setRelativeVolume(volume);
				}
			}
		}
		
		var channels = this.getChannels();
		var numChannels = channels.length;
		for (var i = 0; i < numChannels; i++) {
			channels[i].setRelativeVolume(volume);
		}
	},
	
	mute: function() {
		this.setVolume(0);
	},
	
	unmute: function() {
		this.setVolume(this.oldVolume);
	}
});