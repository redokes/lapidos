Ext.define('Lapidos.shell.dom.Viewport', {
    extend: 'Lapidos.shell.Shell',
	requires: [
		'Lapidos.shell.dom.Tree',
		'Lapidos.shell.navigation.Dom'
	],
    
	config: {
		view: null,
		center: null
	},
	
    init: function() {
		this.callParent(arguments);
		this.initCenter();
		this.initNorth();
		this.initSouth();
		this.initEast();
		this.initWest();
		this.initViewport();
		this.initNav();
		this.initLauncher();
	},
	
	initCenter: function() {
		this.center = new Ext.panel.Panel({
			region: 'center',
			layout: 'card'
		});
	},
	
	initNorth: function() {
		this.north = new Ext.container.Container({
            region: 'north',
            cls: 'lapidos-shell-navigation-container',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            height: 40
        });
	},
	
	initSouth: function() {
		this.south = new Ext.container.Container({
			region: 'south',
			height: 40,
			layout: 'fit'
		});
	},
	
	initEast: function() {
		this.east = new Ext.container.Container({
			region: 'east',
			width: 100,
			layout: 'fit'
		});
	},
	
	initWest: function() {
		this.west = new Ext.container.Container({
			region: 'west',
			width: 100,
			layout: 'fit'
		});
	},
	
	initViewport: function() {
		this.setView(new Ext.Viewport({
			layout: 'border',
			items: [
				this.center,
				this.north
			]
		}));
	},
	
	initNav: function() {
		this.nav = new Lapidos.shell.navigation.Dom({
			store: this.getNavigationStore()
		});
		this.north.add(this.nav);
	},
	
	initLauncher: function() {
		this.launcher = new Lapidos.shell.dom.Tree({
			shell: this
			
		});
		this.west.add(this.launcher);
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