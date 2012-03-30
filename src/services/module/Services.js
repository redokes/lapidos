Ext.define('Lapidos.services.module.Services', {
	extend: 'Lapidos.module.Viewable',
	
	requires: Ext.isMobile ? [
		'Lapidos.services.service.ServiceViewer',
		'Lapidos.services.mobile.view.List'
	] : [
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
			},
			mobilehome: {
				cls: 'Ext.container.Container',
				config: {
					layout: 'card'
				}
			}
		},
//		viewCls: 'Lapidos.services.view.Interface',
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
			this.initGrid();
			view.add(this.getGrid());
		}, this);
		this.on('initviewmobilehome', function(module, view) {
			this.initList();
			view.setActiveItem(this.getList());
		}, this);
		
	},
	
	initGrid: function() {
		this.setGrid(new Lapidos.services.view.Grid({
			store: this.getOs().getServiceManager().getStore()
		}));
		this.grid.on('notify', function(message) {
			this.getOs().getServiceManager().callService('notification', 'notify', message);
		}, this);
	},
	
	initList: function() {
		this.setList(new Lapidos.services.mobile.view.List({
			store: this.getOs().getServiceManager().getStore()
		}));
	}
});