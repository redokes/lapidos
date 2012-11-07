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
    constructor: function(config){
		this.callParent(arguments);
		this.initConfig(config);
	},
	
	setOs: function(os) {
		this.os = os;
		this.getOs().on('beforeboot', this.init, this);
	},
	
	initListeners: function() {
		this.getOs().getModuleManager().on('register', this.onModuleRegister, this);
		this.getOs().getModuleManager().on('launch', this.onModuleLaunch, this);
		this.getOs().getModuleManager().on('quit', this.onModuleQuit, this);
		this.getOs().getServiceManager().onReady('start', function(service) {
			service.on('notify', this.showNotification, this);
		}, this, {
			name: 'notification'
		});
	},
	
	init: function() {
		this.initNavigationStore();
		this.initServices();
		this.initListeners();
	},
	
	initNavigationStore: function(){
		this.setNavigationStore(new Lapidos.shell.navigation.Store({
			os: this.getOs()
		}));
	},
	
	initServices: Ext.emptyFn,
	
	///////////////////////////////////////////////////////////////////////////
	// Events
	///////////////////////////////////////////////////////////////////////////
	onModuleRegister: Ext.emptyFn,
	onModuleLaunch: Ext.emptyFn,
	onModuleQuit: Ext.emptyFn,
	showNotification: Ext.emptyFn
});