Ext.define('Lapidos.audio.view.Group', {
	extend: 'Ext.panel.Panel',
	requires: [
		'Lapidos.audio.view.GroupVolumeControl'
	],
	config: {
		title: 'Audio Manager',
		overflowX: 'auto',
		module: null
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
	
	initListeners: function() {
		this.on('afterrender', function() {
				
			// Add controls for all existing audio groups
			var serviceManager = this.getModule().getOs().getServiceManager();
			var audioService = serviceManager.getInstance('audio');
			var groups = serviceManager.callService('audio', 'getGroups');
			var numGroups = groups.length;
			for (var i = 0; i < numGroups; i++) {
				this.addGroup(groups[i]);
			}
			
			// Listen for new groups being created
			audioService.on('creategroup', function(service, group) {
				this.addGroup(group);
			}, this);
			
			this.on('moduleiconclick', function(panel, record) {
				this.getModule().launch({
					view: 'channel',
					config: {
						group: record
					}
				});
			}, this);
		}, this);
	},
	
	addGroup: function(record) {
		this.add(new Lapidos.audio.view.GroupVolumeControl({
			record: record
		}));
	}
	
});