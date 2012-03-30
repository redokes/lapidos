/**
 * Base service class that all services extend that are used within a Lapidos.os.OS system. 
 * A service is a shared group of functions that any other service and module can access within 
 * the system.
 * 
 * <pre><code>
 Ext.define('Lapidos.notification.service.Notification', {
	extend: 'Lapidos.service.Service',
	config: {
		name: 'notification',
		title: 'Notification',
		autoStart: true
	},
	notify: function(message) {
		this.fireEvent('notify', this, message);
	}
});
 * </code></pre>
 * 
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Lapidos.service.Service', {
	extend: 'Ext.util.Observable',
	
	///////////////////////////////////////////////////////////////////////////
	// Config
	///////////////////////////////////////////////////////////////////////////
	config: {
		
		/**
		 * @cfg {String} 
		 * Name of the service, all services must have a unique name.
		 * 
		 * @accessor
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
		 * @cfg {Lapidos.os.OS} 
		 * 
		 * A reference to the main {@link Lapidos.os.OS operating system}
		 * 
		 * @accessor
		 */
		os: null,
		
		/**
		 * @cfg {Lapidos.module.Manager} 
		 * 
		 * A reference to the {@link Lapidos.service.Manager service manager}
		 * 
		 * @accessor
		 */
		manager: null,
		
		/**
		 * @cfg {Boolean} 
		 * 
		 * True to start this service as soon as it is registered.
		 * 
		 * @accessor
		 */
		autoStart: true
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Properties
	///////////////////////////////////////////////////////////////////////////
	running: false,
	persistentEvents: null,
	
	///////////////////////////////////////////////////////////////////////////
	// Init Functions
	///////////////////////////////////////////////////////////////////////////
	constructor: function(config) {
		this.initConfig(config);
		
		this.persistentEvents = Ext.create('Ext.util.MixedCollection');
		this.persistentEvents.addAll([
			'start',
			'stop'
		]);
		
		this.callParent(arguments);
		this.addEvents('start', 'stop');
		
		// Make sure there is a name
		if (this.getName() == null) {
			console.error('[' + this.self.getName() + ']' + ' - Please set a name for this service');
		}
		
		this.init();
	},
	
	init: Ext.emptyFn,
	
	
	///////////////////////////////////////////////////////////////////////////
	// Methods
	///////////////////////////////////////////////////////////////////////////
	checkAutoStart: function() {
		if(this.getAutoStart()){
			this.start();
		}
	},
	
	start: function(){
		if (this.isRunning()) {
			return false;
		}
		
		this.running = true;
		this.onStart();
		this.fireEvent('start', this);
	},
	
	onStart: Ext.emptyFn,
	
	stop: function(){
		if (!this.isRunning()) {
			return false;
		}
		
		this.running = false;
		this.onStop();
		this.fireEvent('stop', this);
		this.clearListeners();
	},
	
	onStop: Ext.emptyFn,
	
	fireEvent: function() {
		if (this.isRunning()) {
			this.callParent(arguments);
		}
	},
	
	clearListeners: function() {
        var events = this.events,
            event,
            key;

        for (key in events) {
            if (events.hasOwnProperty(key)) {
                event = events[key];
                if (event.isEvent && !this.persistentEvents.contains(key)) {
                    event.clearListeners();
                }
            }
        }

        this.clearManagedListeners();
    },
	
	onRegister: Ext.emptyFn,
	
	///////////////////////////////////////////////////////////////////////////
	// Checkers
	///////////////////////////////////////////////////////////////////////////
	isRunning: function() {
		return this.running;
	}
});