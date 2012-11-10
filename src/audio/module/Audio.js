Ext.define('Lapidos.audio.module.Audio', {
	extend: 'Lapidos.module.Viewable',
	
	requires: [
		'Lapidos.shell.panel.Navigation',
		'Lapidos.audio.service.Audio'
	],
	
	config: {
		name: 'audio',
		title: 'Audio',
		icon: '/js/lapidos/src/audio/img/audio-32.png',
		services: [
			'Lapidos.audio.service.Audio'
		],
		menu: [{
			display: 'Audio'
		}],
		viewConfig: {
			home: {
				cls: 'Lapidos.shell.panel.Navigation'
			},
			group: {
				cls: 'Lapidos.audio.view.Group'
			},
			channel: {
				cls: 'Lapidos.audio.view.Channel'
			}
		}
	},
	
	showViewHome: function(module, view, params) {
		this.loadViewNamed('group', function(view) {
			this.getView('home').setRootView(view);
		}, this);
    },
	
	showViewGroup: function(module, view, params) {
		console.log('show group');
		console.log(arguments);
	},
	
	showViewChannel: function(module, view, params) {
		console.log('show channel');
		var group = params.config.group;
		var channelView = this.getView('channel');
		channelView.showGroup(group);
	},
	
	initListeners: function() {
		this.callParent(arguments);
		
		this.on('initviewgroup', function(module, view) {
			view.setModule(this);
		}, this);
		
		this.on('initviewchannel', function(module, view) {
			
		}, this);
		
		
		
	}
	
});