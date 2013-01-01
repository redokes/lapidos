Ext.define('Lapidos.shell.neptune.Viewport', {
    extend: 'Lapidos.shell.Shell',
	requires: [
		'Lapidos.shell.neptune.Navigation'
	],
    
	config: {
		view: null,
		center: null
	},
	
    init: function() {
		this.callParent(arguments);
		this.initViewport();
		this.initCenter();
		this.initNav();
	},
	
	initViewport: function() {
		this.setView(new Ext.Viewport({
			layout: 'border'
		}));
	},
	
	initCenter: function() {
		this.center = new Ext.panel.Panel({
			region: 'center',
			layout: 'card'
		});
		this.view.add(this.center);
	},
	
	initNav: function() {
		this.nav = new Lapidos.shell.neptune.Navigation({
			region: 'north',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            height: 40,
			store: this.getNavigationStore()
		});
		this.view.add(this.nav);
	},
	
	setActiveView: function(view) {
		this.getCenter().getLayout().setActiveItem(view);
	},
	
	getActive: function() {
        return this.getCenter().getLayout().getActiveItem();
    },
	
	onModuleLaunch: function(manager, module, launchParams) {
        this.callParent(arguments);
        if (Ext.isFunction(module.isViewable) && module.isViewable()) {
            this.getCenter().setLoading('Loading ' + module.getName() + '...');
            module.getActiveView(function(view) {
                this.getCenter().setLoading(false);
                this.setActiveView(view);
            }, this);
        }
    }
	
});