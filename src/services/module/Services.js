Ext.define('Lapidos.services.module.Services', {
	extend: 'Lapidos.module.Viewable',
	
	requires: [
		'Lapidos.services.service.ServiceViewer',
		'Lapidos.services.view.Grid'
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
		icon: '/js/lapidos/src/services/img/services-32.png',
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
			this.initGrid();
			view.add(this.getGrid());
		}, this);
	},
	
	initGrid: function() {
		this.setGrid(new Lapidos.services.view.Grid({
			store: this.getOs().getServiceManager().getStore()
		}));
		this.grid.on('notify', function(message) {
			this.getOs().getServiceManager().callService('notification', 'notify', message);
		}, this);
	}
});