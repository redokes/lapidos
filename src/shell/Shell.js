/**
 * The most basic shell for the system. Extend this class to create a custom shell
 * 
 * @constructor
 * @param {Lapidos.os.OS} os
 * @param {Object} config The config object
 */
Ext.define('Lapidos.shell.Shell', {
    extend: 'Ext.util.Observable',
	
	///////////////////////////////////////////////////////////////////////////
	// Requires
	///////////////////////////////////////////////////////////////////////////
    requires:[
		'Lapidos.shell.navigation.Store',
		'Lapidos.mixin.Event'
	],
	
	mixins: {
		event: 'Lapidos.mixin.Event'
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Properties
	///////////////////////////////////////////////////////////////////////////
	
	/**
	* @type {Lapidos.os.OS}
	* 
	* Operating system being used with this manager
	*/
	os: null,
	
	/**
	* @type {Lapidos.shell.navigation.Store}
	* 
	* Contains all menu information for each module.
	*/
	navigationStore: null,
	
	///////////////////////////////////////////////////////////////////////////
	// Inits
	///////////////////////////////////////////////////////////////////////////
    constructor: function(os, config){
		this.initConfig(config);
		this.os = os;
		this.os.setShell(this);
		this.callParent([config]);
		this.initListeners();
		this.initNavigationStore();
		this.initServices();
		this.init();
	},
	
	initServices: Ext.emptyFn,
	init: Ext.emptyFn,
	initListeners: function(){
		this.getOs().getModuleManager().on('register', this.onModuleRegister, this);
		this.getOs().getModuleManager().on('launch', this.onModuleLaunch, this);
		this.getOs().getModuleManager().on('quit', this.onModuleQuit, this);
		this.getOs().getServiceManager().onReady('start', function(service) {
			service.on('notify', this.showNotification, this);
		}, this, {
			name: 'notification'
		});
	},
	initNavigationStore: function(){
		this.navigationStore = Ext.create('Lapidos.shell.navigation.Store', {
			os: this.getOs()
		});
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Accessors
	///////////////////////////////////////////////////////////////////////////
	
	/**
	* Returns the value of {@link #os}
	* @return {Lapidos.os.OS} os
	*/
	getOs: function(){
		return this.os;
	},
	
	/**
	* Returns the value of {@link #navigationStore}
	* @return {Lapidos.shell.navigation.Store} store
	*/
	getNavigationStore: function(){
		return this.navigationStore;
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Events
	///////////////////////////////////////////////////////////////////////////
	onModuleRegister: Ext.emptyFn,
	onModuleLaunch: Ext.emptyFn,
	onModuleQuit: Ext.emptyFn,
	showNotification: Ext.emptyFn
});