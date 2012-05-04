/**
 * The most basic shell for the system. Extend this class to create a custom shell
 * 
 * @constructor
 * @param {Lapidos.os.Os} os
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
	
	config: {
		/**
		* @type {Lapidos.os.Os}
		* 
		* Operating system being used with this manager
		*/
		os: null,
		
		/**
		* @type {Lapidos.shell.navigation.Store}
		* 
		* Contains all menu information for each module.
		*/
		navigationStore: null
	},
	
	mixins: {
		event: 'Lapidos.mixin.Event'
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Inits
	///////////////////////////////////////////////////////////////////////////
    constructor: function(os, config){
		this.callParent([config]);
		this.initConfig(config);
		this.setOs(os);
		this.getOs().setShell(this);
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
		this.setNavigationStore(new Lapidos.shell.navigation.Store({
			os: this.getOs()
		}));
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Events
	///////////////////////////////////////////////////////////////////////////
	onModuleRegister: Ext.emptyFn,
	onModuleLaunch: Ext.emptyFn,
	onModuleQuit: Ext.emptyFn,
	showNotification: Ext.emptyFn
});