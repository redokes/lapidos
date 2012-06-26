Ext.define('Lapidos.audio.module.Audio', {
	extend: 'Lapidos.module.Viewable',
	
	requires: [
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
				cls: 'Ext.container.Container',
				config: {
					layout: 'card'
				}
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
        this.launch({
			view: 'group'
		});
    },
	
	showViewChannel: function(module, view, params) {
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