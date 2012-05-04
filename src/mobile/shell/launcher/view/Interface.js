Ext.define('Lapidos.mobile.shell.launcher.view.Interface', {
	extend: 'Ext.panel.Panel',
	
	///////////////////////////////////////////////////////////////////////////
	// Requires
	///////////////////////////////////////////////////////////////////////////
	requires:[
		'Lapidos.mobile.shell.launcher.view.View',
	],
	
	///////////////////////////////////////////////////////////////////////////
	// Config
	///////////////////////////////////////////////////////////////////////////
	config:{
		moduleView: null
	},
	
	initComponent: function() {
		this.callParent(arguments);
		this.init();
	},
	
	init: function() {
		this.initModuleView();
	},
	
	initModuleView: function(){
		this.setModuleView(new Lapidos.mobile.shell.launcher.view.View());
		this.add(this.moduleView);
	}
	
});