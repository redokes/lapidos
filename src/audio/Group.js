/**
 * 
 * 
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Lapidos.audio.Group', {
	extend: 'Ext.util.Observable',
	
	///////////////////////////////////////////////////////////////////////////
	// Requires
	///////////////////////////////////////////////////////////////////////////
	requires:[
		'Lapidos.mixin.Event',
		'Lapidos.audio.model.Channel',
		'Lapidos.audio.Channel'
	],
	
	mixins: {
		event: 'Lapidos.mixin.Event'
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Properties
	///////////////////////////////////////////////////////////////////////////
	
	config: {
		store: null,
		name: '',
		manager: null
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Inits
	///////////////////////////////////////////////////////////////////////////
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.init();
	},
	
	init: function() {
		this.initStore();
	},
	
	initStore: function() {
		this.setStore(new Ext.data.Store({
			model: 'Lapidos.audio.model.Channel'
		}));
	},
	
	addChannel: function(channel) {
		channel.setGroup(this);
		
		var record = this.getStore().add({
			name: channels[i],
			instance: channel
		});
	},
	
	createChannels: function(channels) {
		if (!Ext.isArray(channels)) {
			channels = [channels];
		}
		var numChannels = channels.length;
		for (var i = 0; i < numChannels; i++) {
			var channel = new Lapidos.audio.Channel({
				name: channels[i]
			});
			this.addChannel(channel);
		}
	},
	
	getChannel: function(name) {
		var record = this.getStore().findRecord('name', name);
		if (!record) {
			return false;
		}
		return record.get('instance');
	}
	
});