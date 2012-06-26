/**
 * Component that is used to load and manage audio
 * 
 * @constructor
 * @param {Lapidos.os.Os} os
 * @param {Object} config The config object
 */
Ext.define('Lapidos.audio.Manager', {
	extend: 'Ext.util.Observable',
	
	///////////////////////////////////////////////////////////////////////////
	// Requires
	///////////////////////////////////////////////////////////////////////////
	requires:[
		'Lapidos.mixin.Event',
		'Lapidos.audio.model.Group',
		'Lapidos.audio.model.Audio',
	],
	
	mixins: {
		event: 'Lapidos.mixin.Event'
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Properties
	///////////////////////////////////////////////////////////////////////////
	
	config: {
		groupStore: null,
		os: null
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Inits
	///////////////////////////////////////////////////////////////////////////
	constructor: function(os, config) {
		this.setOs(os);
		this.initConfig(config);
		this.callParent([config]);
		this.init();
	},
	
	init: function() {
		this.initGroupStore();
	},
	
	initGroupStore: function() {
		
		// Create the data store for group records
		this.setGroupStore(new Ext.data.Store({
			model: 'Lapidos.audio.model.Group'
		}));
		
		// Create master group
		this.createGroup({
			name: 'master',
			title: 'Master'
		});
		var master = this.getGroup('master');
//		var channel = master.createQueuedChannel('Music');
//		var channel2 = master.createChannel('Music 2');
//		var channel3 = master.createChannel('Test 3');
//		
//		channel.play('/1.mp3');
//		setTimeout(function() {
//			channel.play('/2.mp3');
//		}, 6000);
		
		// Create groups for registered modules
		var moduleManager = this.getOs().getModuleManager();
		var items = moduleManager.getStore().data.items;
		var numItems = items.length;
		for (var i = 0; i < numItems; i++) {
			var instance = items[i].get('instance');
			this.createGroup({
				name: instance.getName(),
				title: instance.getTitle(),
				icon: instance.getIcon(),
				module: instance
			});
		}
		
	},
	
	createGroup: function(config) {
		var group = new Lapidos.audio.model.Group(config);
		this.getGroupStore().add(group);
		return group;
	},
	
	getGroup: function(name) {
		return this.getGroupStore().findRecord('name', name);
	},
	
	removeGroup: function(record) {
		this.getGroupStore().remove(record);
	}
	
});