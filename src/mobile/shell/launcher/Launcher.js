Ext.define('Lapidos.mobile.shell.launcher.Launcher', {
	extend: 'Lapidos.module.Viewable',
	
	config:{
		name: 'home',
		title: 'Home',
		viewConfig: {
			home: {
				cls: 'Lapidos.mobile.shell.launcher.view.View'
			},
			mobilehome: {
				cls: 'Lapidos.mobile.shell.launcher.view.View'
			}
		}
	},
	
	init: function() {
		this.on('initviewmobilehome', function(module, view) {
			view.setStore(this.getManager().getStore());
		}, this);
	}
});