/**
 * Module class used with Lapidos.os.Os. Every module that needs to run within 
 * the os should extend this class.
 * 
 * <pre><code>
 * Ext.define('Lapidos.module.Test', {
	extend:'Lapidos.module.Module',
	
	//Config
	config:{
		name: 'contact',
		title: 'Contacts',
		menu:[{
			display: 'Test'
		}]
	}
});
 * </code></pre>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Lapidos.module.Module', {
	extend: 'Ext.util.Observable',
	requires: [
		'Lapidos.mixin.Event'
	],
	mixins: {
		event: 'Lapidos.mixin.Event'
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Config
	///////////////////////////////////////////////////////////////////////////
	config: {
		
		/**
		 * @cfg {String}
		 *  
		 * Name of the module, every module should have a unique name. 
		 * The name should be all lowercase with "-" or "_" characters as 
		 * seperators.
		 * 
		 *  @accessor 
		 */
		name: null,
		
		/**
		 * @cfg {String} 
		 * 
		 * Title should be a more user friendly readable version of 
		 * {@link #name}
		 * 
		 * @accessor
		 */
		title: '',
		
		/**
		 * @cfg {String} 
		 * Path to the modules icon
		 */
		icon: '',
		
		/**
		 * @cfg {Lapidos.os.Os} 
		 * 
		 * A reference to the main {@link Lapidos.os.Os operating system}
		 * 
		 * @accessor
		 */
		os: null,
		
		/**
		 * @cfg {Lapidos.module.Manager} 
		 * 
		 * A reference to the {@link Lapidos.module.Manager module manager}
		 * 
		 * @accessor
		 */
		manager: null,
		
		/**
		 * @cfg {Array} 
		 * An optional array of {@link Lapidos.service.Service services} to 
		 * start with this module
		 * 
		 * @accessor
		 */
		services: [],
		
		/**
		 * @cfg {menu}
		 *  
		 * An array of menu items to be used with the system shell to display a 
		 * module hierarchy to the user.
		 *  
		 * ###Options:
		 * 
		 * - **display** : String
		 * 
		 *   What the user will see when attempting to launch this module
		 *
		 * - **icon** : Object
		 * 
		 *   paths to the icons to use for this module
		 * 
		 *   - small
		 *   - medium
		 *   - large
		 *   
		 * - **params** : Object
		 * 
		 *   Any additional params to launch the module with when this item is clicked
		 * 
		 * - **items** : Array
		 * 
		 *   An array of subitems that will be located directly under this item, 
		 *   subitems follow the same config as this item.
		 *   
		 * - **scope**: Object
		 * 
		 *	The scope to run the handler in
		 *   
		 * - **handler**: Function
		 * 
		 *	A function to run when the menu item is clicked
		 *   
		 * @accessor
		 */
		menu: []
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Events
	///////////////////////////////////////////////////////////////////////////
	
	/**
	* @event beforelaunch
	* Fires before a module is launched, return false to cancel the launch
	* @param {Lapidos.module.Module} module
	* @param {Object} params launch params
	*/
	
	/**
	* @event launch
	* Fires after a module is launched.
	* @param {Lapidos.module.Module} module
	* @param {Object} params launch params
	*/
   
   /**
	* @event quit
	* Fires when a module has quit.
	* @param {Lapidos.module.Module} module
	*/
	
	///////////////////////////////////////////////////////////////////////////
	// Properties
	///////////////////////////////////////////////////////////////////////////
	running: false,
	
	constructor: function(config) {
		this.callParent(arguments);
        this.initConfig(config);
		
		// Make sure there is a name
		if (this.getName() == null) {
			console.warn('[' + this.self.getName() + ']' + ' - Please set a name for this module');
		}
		
		this.initMenu();
		this.initServices();
		this.initListeners();
		this.initModule();
		this.init();
	},
	
	initMenu: function(){
		var module = this;
		function addModule(items){
			if(!Ext.isArray(items)){
				items = [items];
			}
			Ext.each(items, function(item){
				item.module = module;
				if(item.items != null){
					addModule(item.items);
				}
			});
		}
		addModule(this.getMenu());
	},
	initListeners: Ext.emptyFn,
	initServices: function() {
		this.getOs().getServiceManager().register(this.getServices());
	},
	initModule: Ext.emptyFn,
	
	/**
	* Empty placeholder function to overwrite in extended modules. Used to setup the 
	* the module.
	*/
	init: Ext.emptyFn,
	
	///////////////////////////////////////////////////////////////////////////
	// Methods
	///////////////////////////////////////////////////////////////////////////
	
	/**
	* Launches the module. Fires the beforelaunch event, and the 
	* launch event. The module manager will inform the {@link #os} that 
	* this module wants to launch.
	* 
	* @param {Object} params launch params
	*/
	launch: function(params) {
		if(params == null){
			params = {};
		}
		if (this.fireEvent('beforelaunch', this, params) !== false) {
			this.onBeforeLaunch(params);
			this.onLaunch(params);
			this.fireEvent('launch', this, params);
		}
	},
	
	/**
	* Quits the module. Fires the quit event.
	*/
	quit: function() {
		if (!this.isRunning()) {
			return false;
		}
		this.fireEvent('quit', this);
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Checkers
	///////////////////////////////////////////////////////////////////////////
	
	/**
	* Returns true if the module is currently running
	* @return {Boolean} running
	*/
	isRunning: function() {
		return this.running;
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Events
	///////////////////////////////////////////////////////////////////////////
	
	/**
	* Method that runs right before a module is launched. Extend this method to do any 
	* actions that need to be performed prior to a module launch.
	* @param {Object} params launch params 
	*/
	onBeforeLaunch: function(params) {
	},

	onRegister: Ext.emptyFn,
	onAfterRegister: Ext.emptyFn,
	
	/**
	* Method that runs right after a method has been launched
	* @param {Object} params launch params 
	*/
	onLaunch: Ext.emptyFn
});