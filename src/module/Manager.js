/**
 * Component that is used to manage all modules within a Lapidos.os.Os system. 
 * The module manager keeps track of all registered modules, as well as which modules 
 * are running and not running.
 * 
 * @constructor
 * @param {Lapidos.os.Os} os
 * @param {Object} config The config object
 */
Ext.define('Lapidos.module.Manager', {
	extend: 'Ext.util.Observable',
	
	///////////////////////////////////////////////////////////////////////////
	// Requires
	///////////////////////////////////////////////////////////////////////////
	requires:[
		'Lapidos.module.Module',
		'Lapidos.module.model.Module',
		'Lapidos.mixin.Event'
	],
	
	mixins: {
		event: 'Lapidos.mixin.Event'
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Properties
	///////////////////////////////////////////////////////////////////////////
	
	/**
	* @type {Lapidos.os.Os}
	* 
	* Operating system being used with this manager
	*/
	os: null,
	
	/**
	* @type {Ext.data.Store}
	* 
	* Data store used to hold all the registered modules. 
	* uses the {@link Lapidos.module.model.Module module} model.
	* 
	*/
	store: null,
	
	///////////////////////////////////////////////////////////////////////////
	// Inits
	///////////////////////////////////////////////////////////////////////////
	constructor: function(os, config){
		this.initConfig(config);
		this.os = os;
		this.callParent([config]);
		this.init();
	},
	
	init: function(){
		this.initStore();
	},
	
	initStore: function() {
		this.store = new Ext.data.Store({
			model: 'Lapidos.module.model.Module'
		});
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Methods
	///////////////////////////////////////////////////////////////////////////
	
	/**
	* Register a module(s) with the system
	* @param {String[]/String} cls classname of the module 
	* @return {Lapidos.module.Module} module
	*/
	register: function(cls, config) {
		if (Ext.isArray(cls)) {
			var numCls = cls.length;
			for (var i = 0; i < numCls; i++) {
				this.register(cls[i]);
			}
			return;
		}
		
		// Check if this is a class name or an object with config
		if (typeof cls != 'string') {
			// This is a config object
			this.register(cls.cls, cls.config);
			return;
		}
		
		config = config || {};
		Ext.apply(config, {
			manager: this,
			os: this.getOs()
		});
		
		var record = this.get(cls, 'cls');
		if (record != null) {
			return false;
		}
		var module = Ext.create(cls, config);
		module.on('beforelaunch', this.onBeforeLaunch, this);
		module.on('launch', this.onLaunch, this);
		module.on('quit', this.onQuit, this);
		if (module.getName() != null) {
			var records = this.store.add({
				instance: module,
				cls: cls,
				name: module.getName(),
				title: module.getTitle(),
				icon: module.getIcon()
			});
			this.onRegister(records[0], module);
			return module;
		}
		return false;
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Accessors
	///////////////////////////////////////////////////////////////////////////
	
	/**
	* Returns the value of {@link #os}
	* @return {Lapidos.os.Os} os
	*/
	getOs: function(){
		return this.os;
	},
	
	/**
	* Returns the value of {@link #store}
	* @return {Ext.data.Store} store
	*/
	getStore: function(){
		return this.store;
	},
   
    /**
	* Gets a modules model from the {@link #store}. To get the instance of the module 
	* see {@link #getInstance}.
	* 
	* @param {String/Object} value value to find in the store 
	* @param {String} field field to search for, defaults to name
	* @return {Lapidos.module.model.Module} model null if not found
	*/
	get: function(value, field) {
		if(field == null){
			field = 'name'
		}
		return this.store.findRecord(field, value, 0, false, false, true);
	},
	
	/**
	* Gets a modules class instance
	* @param {String/Object} value value to match against  
	* @param {String} field field to look up with
	* @return {Lapidos.module.Module} module
	*/
	getInstance: function(value, field) {
		var record = this.get(value, field);
		if (record != null) {
			return record.get('instance');
		}
		return null;
	},
	
	 /**
     * A special listener/function that allows you to listen for when a module
	 * has launched. Much like Ext.onReady
     * @param {String} name Name of the module to listen for
     * @param {Function} callback Function to run when the module has launched
	 * @param {Object} scope Scope to run the callback function in
	 * @param {Object} options Any additional options to pass to the callback function
     */
	onModuleLaunch: function(name, callback, scope, options){
		if(scope == null){
			scope = this;
		}
		if(options == null){
			options = {};
		}
		
		if(this.get(name)){
			Ext.bind(callback, scope)(this.get(name).get('instance'), options);
		}
		else{
			this.on('launch', function(manager, module, options){
				if(name == options.name){
					Ext.bind(options.callback, options.scope)(module, options.options);
				}
			}, this, {name: name, callback: callback, scope: scope, options: options});
		}
	},
	
	onRegister: function(record, module){
		module.onRegister();
		this.fireEvent('register', this, module);
	},
	
	/**
	* Fired when a module launches and fires its launch event
	*/
	onLaunch: function(module, params) {
		return this.fireEvent('launch', this, module, params);
	},
	
	/**
	* Fired when a module launches and fires its launch event
	*/
	onBeforeLaunch: function(module, params) {
		return this.fireEvent('beforelaunch', this, module, params);
	},
	
	/**
	* Fired when a module quits and fires its quit event
	*/
	onQuit: function(module) {
		this.fireEvent('quit', this, module);
	}
});