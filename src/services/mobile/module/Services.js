Ext.define('Lapidos.services.mobile.module.Services', {
	extend: 'Lapidos.module.Viewable',
	
	requires: [
		'Lapidos.services.service.ServiceViewer',
		'Lapidos.services.mobile.view.List'
	],
	
	config: {
		name: 'services',
		title: 'Services',
		viewConfig: {
			home: {
				cls: 'Ext.container.Container',
				config: {
					layout: 'card'
				}
			}
		},
		icon: '/resources/icons/services-128.png',
		services: [
			'Lapidos.services.service.ServiceViewer'
		],
		menu: [{
			display: 'Services',
			path: '/Admin'
		}],
	
		grid: null,
		list: null
	},
	
	initModule: function() {
		this.callParent(arguments);
		this.on('initviewhome', function(module, view) {
			this.initList();
			view.setActiveItem(this.getList());
		}, this);
	},
	
	initList: function() {
		this.setList(new Lapidos.services.mobile.view.List({
			store: this.getOs().getServiceManager().getStore()
		}));
	}
});