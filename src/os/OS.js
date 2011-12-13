Ext.define('Lapidos.os.OS', {
	extend: 'Ext.util.Observable',
    singleton: true,
	
	///////////////////////////////////////////////////////////////////////////
	// Requires
	///////////////////////////////////////////////////////////////////////////
	requires:[
		'Lapidos.module.Manager',
		'Lapidos.service.Manager'
	],
	
	///////////////////////////////////////////////////////////////////////////
	// Config
	///////////////////////////////////////////////////////////////////////////
	config: {
		moduleManager: null,
		serviceManager: null,
		shell: null
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Properties
	///////////////////////////////////////////////////////////////////////////
	modules: false,
	
	/**
	* @type {RedAmp.module.Manager}
	* Module manager that handles all modules that are registered with the OS
	*/
	moduleManager: false,
	
	///////////////////////////////////////////////////////////////////////////
	// Events
	///////////////////////////////////////////////////////////////////////////
	/**
	* @event before-boot
	* Fires before the OS begins booting
	* @param {OS} os
	* @param {Object} config
	*/
   
   /**
	* @event boot
	* Fires when the OS has booted.
	* @param {OS} os
	*/
   
   /**
	* @event init-service-manager
	* Fires when the service manager has been created.
	* @param {OS} os
	* @param {Lapidos.service.Manager} manager
	*/
   
   /**
	* @event init-module-manager
	* Fires when the module manager has been created.
	* @param {OS} os
	* @param {Lapidos.service.Manager} manager
	*/
   
   /**
	* @event before-launch
	* Fires before the OS launches a module
	* @param {OS} os
	* @param {RedOkes.module.Module} module
	*/
   
   /**
	* @event launch
	* Fires when the OS launches a module.
	* @param {OS} os
	* @param {RedOkes.module.Module} module
	*/
	
	///////////////////////////////////////////////////////////////////////////
	// Inits / Bootup
	///////////////////////////////////////////////////////////////////////////
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.boot();
	},
	
	boot: function() {
		this.onBeforeBoot();
		this.initShell();
		this.initServiceManager();
		this.initModuleManager();
		this.processRegistry();
		this.onBoot();
	},
	
	processRegistry: function() {
		// Look up auto start modules and services
		var modules = [
			'Lapidos.module.Test',
			'Lapidos.module.Test2',
		];
		Ext.require(modules, function() {
			var numModules = modules.length;
			for (var i = 0; i < numModules; i++) {
				this.moduleManager.register(modules[i]);
			}
		}, this);
	},
	
	//Debug
	fireEvent: function(){
		console.log(this.self.getName() + ' - ' + arguments[0]);
		return this.callParent(arguments);
	},
	
	initShell: function() {
		Ext.require('Lapidos.shell.Viewport', function() {
			this.shell = Ext.create('Lapidos.shell.Viewport', {
				os: this
			});
		}, this);
	},
	
	initServiceManager: function(){
		this.serviceManager = Ext.create('Lapidos.service.Manager', {
			os: this
		});
		this.fireEvent('init-service-manager', this, this.serviceManager);
	},
	
	initModuleManager: function(){
		this.moduleManager = Ext.create('Lapidos.module.Manager', {
			os: this
		});
		this.fireEvent('init-module-manager', this, this.moduleManager);
	},
	
	
	///////////////////////////////////////////////////////////////////////////
	// On Events
	///////////////////////////////////////////////////////////////////////////
	onBeforeBoot: function() {
		this.fireEvent('before-boot', this, this.config);
	},
	
	onBoot: function() {
		this.fireEvent('boot', this, this.config);
	}
	
});
