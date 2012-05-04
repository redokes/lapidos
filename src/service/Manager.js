/**
 * Component that is used to manage all services within a Lapidos.os.Os system. 
 * The service manager keeps track of all registered services, as well as which services
 * are running and not running.
 * 
 * @constructor
 * @param {Lapidos.os.Os} os
 * @param {Object} config The config object
 */
Ext.define('Lapidos.service.Manager', {
	extend: 'Ext.util.Observable',
	
	///////////////////////////////////////////////////////////////////////////
	// Requires
	///////////////////////////////////////////////////////////////////////////
	requires:[
		'Lapidos.service.model.Service',
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
			model: 'Lapidos.service.model.Service'
		});
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Methods
	///////////////////////////////////////////////////////////////////////////
	
	/**
	* Register a service(s) with the system
	* @param {String[]/String} cls classname of the service
	* @return {Lapidos.service.Service} service
	*/
	register: function(cls, config){
		// Check if array of modules to register
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
		
		//Check if this record already exists
		var record = this.get(cls, 'cls');
		if (record != null) {
			console.warn(this.self.getName() + ' - ' + record.get('instance').self.getName() + ' is already registered');
			return false;
		}
		
		//Try to load the service
		var instance = Ext.create(cls, config);

		instance.on('start', this.onStart, this);
		instance.on('stop', this.onStop, this);

		instance.checkAutoStart();

		if (instance.getName() != null) {
			var records = this.store.add({
				instance: instance,
				cls: cls,
				name: instance.getName(),
				title: instance.getTitle()
			});
			this.onRegister(records[0], instance);
			return instance;
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
	* Gets a services model from the {@link #store}. To get the instance of the service
	* see {@link #getInstance}.
	* 
	* @param {String/Object} value value to find in the store 
	* @param {String} field field to search for, defaults to name
	* @return {Lapidos.service.model.Service} model null if not found
	*/
	get: function(value, field){
		if(field == null){
			field = 'name';
		}
		return this.store.findRecord(field, value, 0, false, false, true);
	},
	
	/**
	* Gets a services class instance
	* @param {String/Object} value value to match against  
	* @param {String} field field to look up with
	* @return {Lapidos.service.Service} service
	*/
	getInstance: function(value, field) {
		var record = this.get(value, field);
		if (record != null) {
			return record.get('instance');
		}
		return null;
	},
	
	/**
	* Shortcut to {@link Lapidos.service.Manager#callService}
	* @param {String} name name of the service
	* @param {String} method name of the service method
	* @param {Mixed...} params params to send with the service call
	*/
	callService: function(name, method) {
		var service = this.getInstance(name);
		if (service && service.isRunning()) {
			var args = [];
			var numArgs = arguments.length;
			for (var i = 2; i < numArgs; i++) {
				args.push(arguments[i]);
			}
			service[method].apply(service, args);
		}
	},
	
	onRegister: function(record, service){
		service.onRegister();
		this.fireEvent('register', this, service);
	},
	
	/**
     * A special listener/function that allows you to listen for when a service
	 * has started. Much like Ext.onReady
     * @param {String} name Name of the service to listen for
     * @param {Function} callback Function to run when the service has started
	 * @param {Object} scope Scope to run the callback function in
	 * @param {Object} options Any additional options to pass to the callback function
     */
	onServiceStart: function(name, callback, scope, options){
		console.log('DEPRECATED onServiceStart');
		if(scope == null){
			scope = this;
		}
		if(options == null){
			options = {};
		}
		
		if(this.get(name)){
			if (this.get(name).get('instance').isRunning()) {
				Ext.bind(callback, scope)(this.get(name).get('instance'), options);
			}
		}
		
		this.on('start', function(manager, service, options){
			if(service.name == options.name){
				Ext.bind(options.callback, options.scope)(service, options.options);
			}
		}, this, {name: name, callback: callback, scope: scope, options: options});
	},
	
	onStartReady: function(options) {
		var instance = this.getInstance(options.name);
		if (instance != null) {
			if (instance.isRunning()) {
				return {
					params: [this.get(options.name).get('instance'), options]
				}
			}
			else {
				// Just listen for when this service starts instead of every service
				return {
					eventName: 'start',
					target: instance
				}
			}
		}
	},
	
	/**
     * Fired when a service starts and fires its start event
	 */
	onStart: function(service) {
		this.fireEvent('start', this, service);
	},
	
	/**
     * Fired when a service stop and fires its stop event
	 */
	onStop: function(service) {
		this.fireEvent('stop', this, service);
	}
	
});