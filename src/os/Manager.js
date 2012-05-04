/**
 * Component that is used to manage all OSs within an application.
 * The OS manager keeps track of all registered modules, as well as which modules 
 * are running and not running.
 * 
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Lapidos.os.Manager', {
	extend: 'Ext.util.Observable',
	singleton: true,
	
	///////////////////////////////////////////////////////////////////////////
	// Requires
	///////////////////////////////////////////////////////////////////////////
	requires:[
		'Lapidos.mixin.Event',
		'Lapidos.os.model.Os'
	],
	
	config: {
		store: null,
		defaultOs: null
	},
	
	mixins: {
		event: 'Lapidos.mixin.Event'
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Properties
	///////////////////////////////////////////////////////////////////////////
	
	/**
	* @type {Ext.data.Store}
	* 
	* Data store used to hold all the registered OS objects.
	* 
	*/
	store: null,
	
	///////////////////////////////////////////////////////////////////////////
	// Inits
	///////////////////////////////////////////////////////////////////////////
	constructor: function(config){
		this.initConfig(config);
		this.callParent([config]);
		this.init();
	},
	
	init: function(){
		this.initStore();
	},
	
	initStore: function() {
		this.store = new Ext.data.Store({
			model: 'Lapidos.os.model.Os'
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
	register: function(os) {
		this.getStore().add({
			instance: os
		});
		
		if (!this.getDefaultOs()) {
			this.setDefaultOs(os);
		}
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Accessors
	///////////////////////////////////////////////////////////////////////////
	
    /**
	* Gets a modules model from the {@link #store}. To get the instance of the module 
	* see {@link #getInstance}.
	* 
	* @param {String/Object} value value to find in the store 
	* @param {String} field field to search for, defaults to name
	* @return {Lapidos.module.model.Module} model null if not found
	*/
	get: function(field, value) {
		if (field == null) {
			field = 'name'
		}
		return this.getStore().findRecord(field, value, 0, false, false, true);
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
	}
	
});