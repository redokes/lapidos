/**
 * Extend this class if you want your module to have a view or multiple views associated with it. 
 * 
 * Viewable extends Lapidos.module.Module giving it the ability to contain views. 
 * It is then up to the shell to handle and display the views.
 * 
 * ## Configuring views
 * 
 * All viewable modules by default can contain as many views as it needs. These views 
 * are stored in the {@link #viewStore}. There are several different ways to configure 
 * the modules views.
 * 
 * - **viewCls** : String
 *   
 *   The most basic way, the class of the view you wish to use with this module.
 *
 * - **viewConfig** : Object
 * 
 *   If you have more than one view that needs to be created you should use the {@link #viewConfig}. 
 *   The viewConfig is just a key/value object of view types to view classes. The value can be either a class string, 
 *   or an object that contains a "cls" and an optional "config" key.
 * 
 * ## Magic View Events
 * 
 * Whenever a new view has been created a magic event will be called. For example if the **"home"** view was just created 
 * an event of **"initviewhome"** would be fired, as well as the {@link #initview initview} event.
 * 
 * ## Magic View Methods
 * 
 * If your module has a single view but has subviews of that single view the viewable class allows you to easily 
 * manipulate your view when a new view type is launched. Each time a new view is launched the class will look 
 * for a magic method to run if it is implemented. For example if you have a sub view of **"add"** the viewable will 
 * try to find the method **"showViewAdd"**. If that method exists it is called with the following paramaters.
 * 
 * - **module** : Lapidos.module.Module
 * - **view** : View  
 * - **params** : Object launch params  
 * 
 * ## Basic viewable module
 * 
 * <pre><code>
 * Ext.define('Lapidos.module.Test', {
	extend:'Lapidos.module.Module',
	
	//Config
	config:{
		name: 'test',
		title: 'Test Module',
		viewCls: 'Ext.panel.Panel',
		menu:[{
			display: 'Test'
		}]
	}
});
 * </code></pre>
 * 
 * ## Viewable module with multiple view classes
 * 
 * <pre><code>
 * Ext.define('Lapidos.module.Test', {
	extend:'Lapidos.module.Module',
	
	//Config
	config:{
		name: 'test',
		title: 'Test Module',
		viewConfig: {
			home: {
				cls: 'Ext.panel.Panel',
				config:{
					title: 'Test Module',
					width: 500,
					height: 500
				}
			},
			add: 'Ext.form.Panel'
		},
		menu:[{
			display: 'View Test Home',
			items:[{
				display: 'View Add',
				params:{
					view: 'add'
				}
			}]
		}]
	}
});
 * </code></pre>
 * 
 * ## Viewable module with one view, but multiple versions of that view
 * 
 * <pre><code>
 * Ext.define('Lapidos.module.Test', {
	extend:'Lapidos.module.Module',
	
	//Config
	config:{
		name: 'test',
		title: 'Test Module',
		viewConfig: {
			home: {
				cls: 'Ext.tab.Panel',
				config:{
					title: 'Test Module',
					width: 500,
					height: 500,
					items: [{
						title: 'Tab One',
						html: 'this is tab one'
					},{
						title: 'Tab Two',
						html: 'this is tab two'
					}]
				}
			}
		},
		menu:[{
			display: 'View Tab One',
			items:[{
				display: 'View Tab Two',
				params:{
					view: 'two'
				}
			}]
		}]
	},

	//Magic Functions
	showViewHome: function(module, view) {
		view.setActiveTab(0);
	},

	showViewTwo: function(module, view) {
		view.setActiveTab(1);
	}
});
 * </code></pre>
 * 
 * @constructor
 * @param {Object} config The config object
 */

Ext.define('Lapidos.module.Viewable', {
	extend: 'Lapidos.module.Module',
	
	///////////////////////////////////////////////////////////////////////////
	// Config
	///////////////////////////////////////////////////////////////////////////
	config: {
		viewCls: null,
		viewConfig: null,
		viewParam: 'view',
		viewDefault: 'home'
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Properties
	///////////////////////////////////////////////////////////////////////////
	activeView: null,
	viewStore: null,
	viewable: false,
	
	///////////////////////////////////////////////////////////////////////////
	// Inits
	///////////////////////////////////////////////////////////////////////////
	initModule: function() {
		this.initViewStore();
		this.initViewConfig();
	},
	
	initViewStore: function() {
		this.viewStore = new Ext.data.Store({
			fields:[{
				name: 'cls'
			},{
				name: 'type'
			},{
				name: 'config',
				defaultValue: {}
			},{
				name: 'instance',
				defaultValue: null
			},{
				name: 'loading',
				defaultValue: false
			},{
				name: 'loaded',
				defaultValue: false
			}]
		});
		
		this.viewStore.on('add', function() {
			this.viewable = true;
		}, this);
		
		this.viewStore.on('addrecords', function() {
			this.viewable = true;
		}, this);
		
		this.viewStore.on('remove', function() {
			if (!this.viewStore.getCount()) {
				this.viewable = false;
			}
		}, this);
		
		this.viewStore.on('removerecords', function() {
			if (!this.viewStore.getCount()) {
				this.viewable = false;
			}
		}, this);
	},
	
	initViewConfig:function() {
		var viewConfig = {};
		
		// Ensure a viewConfig
		if (this.getViewConfig() == null) {
			if (!Ext.isEmpty(this.getViewCls())) {
				viewConfig[this.getViewDefault()] = this.getViewCls();
			}
			this.setViewConfig(viewConfig);
		}
		
		// Process the viewconfig
		viewConfig = this.getViewConfig();
		for (var type in viewConfig) {
			var value = viewConfig[type];
			if (Ext.isString(value)) {
				value = {
					cls: value
				};
			}
			this.viewStore.add(Ext.apply({
				type: type
			}, value));
		}
		
		// Set the active view
		var activeRecord = this.viewStore.findRecord('type', this.getViewDefault());
		if (activeRecord != null) {
			this.setActiveView(activeRecord);
		}
	},
	
	initView: function(type) {
		//Ensure a type
		if (type == null) {
			type = this.getViewDefault();
		}
		
		//Get the view record
		var record = this.viewStore.findRecord('type', type);
		if (record == null) {
			//Try to find default view
			record = this.viewStore.findRecord('type', this.getViewDefault());
			if (record == null) {
				return null;
			}
		}
		
		//Check if this view has already loaded
//		this.setActiveView(record);
		if (record.get('loaded') || record.get('loading')) {
			return record;
		}
		
		//Set the record to loading
		record.set({
			loading: true
		});
		
		//Load the view and then create it
		Ext.require(record.get('cls'), Ext.bind(function(record) {
			var view = Ext.create(record.get('cls'), record.get('config'));
			record.set({
				instance: view,
				loading: false,
				loaded: true
			});
//			this.setActiveView(record);
			
			var functionName = 'onInitView';
			if (Ext.isFunction(this[functionName])) {
				this[functionName](this, view, record);
			}
			this.fireEvent('initview', this, view, record);
			
			var typeName = record.get('type');
			typeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);
			functionName += typeName
			if (Ext.isFunction(this[functionName])) {
				this[functionName](this, view, record);
			}
			this.fireEvent('initview' + record.get('type'), this, view, record);
		}, this, [record]), this);
		
		return record;
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Methods
	///////////////////////////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////////////////////////
	// Accessors
	///////////////////////////////////////////////////////////////////////////
	getView: function(type) {
		var record = this.getViewRecord(type);
		if (record != null) {
			return record.get('instance');
		}
		return null;
	},
	
	getActiveView: function(callback, scope) {
		scope = scope || this;
		this.loadView(this.activeView, callback, scope);
	},
	
	getViewStore: function() {
		return this.viewStore;
	},
	
	getViewRecord: function(type) {
		if (type == null) {
			type = this.getViewDefault();
		}
		var record = this.viewStore.findRecord('type', type);
		return record;
	},
	
	loadViewNamed: function(viewName, callback, scope) {
		this.loadView(this.getViewRecord(viewName), callback, scope);
	},
	
	loadView: function(view, callback, scope) {
		scope = scope || this;
		if (view == null) {
			return;
		}
		if (view.get('loaded')) {
			Ext.bind(callback, scope)(view.get('instance'));
		}
		else {
			this.on('initview' + view.get('type'), function(module, view, record, options) {
				Ext.bind(options.callback, options.scope)(record.get('instance'));
			}, this, {
				callback: callback, 
				scope: scope
			});
		}
		this.initView(view.get('type'));
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Mutators
	///////////////////////////////////////////////////////////////////////////
	setActiveView: function(record) {
		this.activeView = record;
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Checkers
	///////////////////////////////////////////////////////////////////////////
	isViewable: function() {
		return this.viewable;
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Events
	///////////////////////////////////////////////////////////////////////////
	
	/**
     * A special listener/function that allows you to listen for when the view has been created. 
	 * Much like Ext.onReady
     * @param {Function} callback Function to run when the view is ready
	 * @param {Object} scope Scope to run the callback function in
	 * @param {Object} options Any additional options to pass to the callback function
     */
	onViewReady2: function(callback, scope, options) {
		if (scope == null) {
			scope = this;
		}
		if (options == null) {
			options = {};
		}
		
		//Find the record for the view
		var type = options.type || this.getViewDefault();
		var record = this.viewStore.findRecord('type', type);
		if (record == null) {
			return;
		}
		
		if (record.get('loaded')) {
			Ext.bind(callback, scope)(this, record.get('instance'), options);
		}
		else {
			this.on('initview' + type, function(module, view, record, options) {
				Ext.bind(options.callback, options.scope)(this, record.get('instance'), options);
			}, this, Ext.apply({
				single: true, 
				callback: callback, 
				scope: scope
			}, options));
		}
	},
	
	onViewReady: function(options) {
		// TODO: revisit this property name. it shouldn't be either view or type
		var type = options.view || options.type || this.getViewDefault();
		var record = this.viewStore.findRecord('type', type);
		if (record != null && record.get('loaded')) {
			return [this, record.get('instance'), options];
		}
		return 'initview' + type;
	},
	
	onBeforeLaunch: function(params) {
		this.callParent(arguments);
		var viewRecord = this.initView(params[this.getViewParam()] || this.getViewDefault());
		if (viewRecord) {
			this.setActiveView(viewRecord);
		}
	},
	
	onLaunch: function(params) {
		this.callParent(arguments);
		var view = params[this.getViewParam()] || this.getViewDefault();
		var functionName = 'showView' + view.charAt(0).toUpperCase() + view.slice(1);
		//params.showViewFunction = functionName;
		if (Ext.isFunction(this[functionName])) {
			this.onReady('view', function(viewable, view, options) {
				Ext.defer(this[functionName], 1, this, arguments);
			}, this, params);
		//			this.onViewReady(this[functionName], this, params);
		}
	}
});