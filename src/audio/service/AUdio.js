Ext.define('Lapidos.audio.service.Audio', {
	extend: 'Lapidos.service.Service',
	requires: [
		'Lapidos.audio.Manager'
	],
	
	///////////////////////////////////////////////////////////////////////////
	// Config
	///////////////////////////////////////////////////////////////////////////
	config: {
		name: 'audio',
		title: 'Audio',
		autoStart: true,
		manager: null
	},
	
	init: function() {
		this.initAudioManager();
		this.initListeners();
	},
	
	initAudioManager: function() {
		this.setManager(new Lapidos.audio.Manager(this.getOs()));
	},
	
	createGroup: function(config) {
		var group = this.getManager().createGroup(config);
		this.fireEvent('creategroup', this, group);
		return group;
	},
	
	removeGroup: function(name) {
		var group = this.getManager().getGroup(name);
		if (group) {
			this.fireEvent('beforeremovegroup', this, group);
			this.getManager().removeGroup(group);
		}
	},
	
	getGroups: function() {
		return this.getManager().getGroupStore().data.items;
	},
	
	getGroup: function(name) {
		return this.getManager().getGroup(name);
	},
	
	createChannel: function(groupName, channelName) {
		var group = this.getGroup(groupName);
		if (group) {
			return group.createChannel(channelName);
		}
		return null;
	},
	
	initListeners: function() {
		
		this.getOs().getModuleManager().on('register', function(manager, module) {
			this.createGroup({
				name: module.getName(),
				title: module.getTitle(),
				icon: module.getIcon()
			});
		}, this);
		
		this.getOs().getModuleManager().on('quit', function(manager, module) {
			this.removeGroup(module.getName());
		}, this);
		
	}
	
});