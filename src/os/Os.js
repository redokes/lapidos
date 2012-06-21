/**
 * Provides an entry point to handle all lapidos operations and events. The OS 
 * sets up everything you need to manage all services and modules.
 * 
 * At its basics the OS consists of the following
 * 
 *  - Module Manager
 *  - Service Manager
 *  - Shell
 * 
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Lapidos.os.Os', {
	extend: 'Ext.util.Observable',
	
	///////////////////////////////////////////////////////////////////////////
	// Requires
	///////////////////////////////////////////////////////////////////////////
	requires: [
		'Lapidos.os.Manager',
		'Lapidos.module.Manager',
		'Lapidos.service.Manager',
		'Lapidos.shell.Shell',
		'Lapidos.core.module.Core'
	],
	
	///////////////////////////////////////////////////////////////////////////
	// Config
	///////////////////////////////////////////////////////////////////////////
	config: {
		
		/**
		 * @cfg {Lapidos.module.Manager} 
		 * Module manager used to manage all registered modules with the system. 
		 * Handles launching and quiting of modules.
		 * 
		 * @accessor
		 */
		moduleManager: null,
		
		/**
		 * @cfg {Lapidos.service.Manager} 
		 * Service manager used to manage all registered services with the system. 
		 * Handles the starting and stopping of services.
		 * 
		 * @accessor
		 */
		serviceManager: null,
		
		/**
		 * @cfg {Lapidos.shell.Shell} 
		 * Contains a reference to the shell of the OS. The shell determins how 
		 * the user will see the system.
		 * 
		 * @accessor
		 */
		shell: null
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Events
	///////////////////////////////////////////////////////////////////////////
	/**
	* @event beforeboot
	* Fires before the OS begins booting
	* @param {Lapidos.os.Os} os
	* @param {Object} config
	*/
   
   /**
	* @event boot
	* Fires when the OS has booted.
	* @param {Lapidos.os.Os} os
	*/
   
   /**
	* @event initservicemanager
	* Fires when the service manager has been created.
	* @param {Lapidos.os.Os} os
	* @param {Lapidos.service.Manager} manager
	*/
   
   /**
	* @event initmodulemanager
	* Fires when the module manager has been created.
	* @param {Lapidos.os.Os} os
	* @param {Lapidos.service.Manager} manager
	*/
	
	///////////////////////////////////////////////////////////////////////////
	// Inits / Bootup
	///////////////////////////////////////////////////////////////////////////
	constructor: function(config) {
		// Register this os with Lapidos
		Lapidos.os.Manager.register(this);
		
		this.initConfig(config);
		this.callParent(arguments);
		this.init();
		this.boot();
	},
	
	init: Ext.emptyFn,
	
	boot: function() {
		this.onBeforeBoot();
		this.initServiceManager();
		this.initModuleManager();
		this.initShell();
		this.onBoot();
	},
	
	//Debug
	fireEvent: function(){
		return this.callParent(arguments);
	},
	
	initShell: function() {
		if (this.getShell() != null) {
			return;
		}
		this.setShell(new Lapidos.shell.Shell(this));
	},
	
	initServiceManager: function(){
		this.setServiceManager(new Lapidos.service.Manager(this));
		this.fireEvent('initservicemanager', this, this.getServiceManager());
	},
	
	initModuleManager: function(){
		this.setModuleManager(new Lapidos.module.Manager(this));
		this.fireEvent('initmodulemanager', this, this.getModuleManager());
		
		this.getModuleManager().register('Lapidos.core.module.Core');
	},
	
	///////////////////////////////////////////////////////////////////////////
	// On Events
	///////////////////////////////////////////////////////////////////////////
	
	/**
	* Function called before the system runs the boot commands
	*/
	onBeforeBoot: function() {
		this.fireEvent('beforeboot', this, this.config);
	},
	
	/**
	* Function called after the system has booted
	*/
	onBoot: function() {
		this.fireEvent('boot', this, this.config);
	}
});