Ext.define('Lapidos.shell.Viewport', {
    extend: 'Lapidos.shell.Shell',
	requires: [
		'Lapidos.shell.Tree'
	],
    
	config: {
		viewport: null
	},
	
    init: function() {
		this.initCenter();
		this.initWest();
		this.initViewport();
		this.initLauncher();
	},
	
	initViewport: function() {
		this.viewport = new Ext.Viewport({
			layout: 'border',
			items: [
				this.center,
				this.west
			]
		});
	},
	
	initCenter: function() {
		this.center = new Ext.panel.Panel({
			title: 'Center',
			region: 'center',
			layout: 'card'
		});
	},
	
	initWest: function() {
		this.west = new Ext.panel.Panel({
			title: 'West',
			region: 'west',
			width: 200,
			layout: 'fit'
		});
	},
	
	initLauncher: function() {
		this.launcher = new Lapidos.shell.Tree({
			shell: this
			
		});
		this.west.add(this.launcher);
	},
	
	getCenter: function() {
		return this.center;
	},
	
	setActiveView: function(view) {
		this.getCenter().getLayout().setActiveItem(view);
	},
	
	launchModule: function(manager, module) {
		if (module.isViewable != null && module.isViewable) {
			this.getCenter().add(module.view);
			this.setActiveView(module.view);
		}
	}
	
});