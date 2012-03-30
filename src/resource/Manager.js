/**
 * Component that is used to load and manage all types of reources.
 * 
 * @constructor
 * @param {Lapidos.os.OS} os
 * @param {Object} config The config object
 */
Ext.define('Lapidos.resource.Manager', {
	extend: 'Ext.util.Observable',
	
	///////////////////////////////////////////////////////////////////////////
	// Requires
	///////////////////////////////////////////////////////////////////////////
	requires:[
		'Lapidos.mixin.Event',
		'Lapidos.resource.model.Resource'
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
	
	config: {
		numLoading: 0,
		store: null
	},
	
	success: null,
	callbackScope: null,
	
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
		this.setStore(new Ext.data.Store({
			model: 'Lapidos.resource.model.Resource'
		}));
	},
	
	load: function(options) {
		this.callbackScope = options.scope || this;
		this.success = options.success || Ext.emptyFn;
		var items = options.items || [];
		
		if (!Ext.isArray(items)) {
			items = [items];
		}
		var numResources = items.length;
		this.setNumLoading(this.getNumLoading() + numResources);
		for (var i = 0; i < numResources; i++) {
			this.processResource(items[i]);
		}
	},
	
	processResource: function(resource) {
		// Find item in store
		if (this.getStore().findRecord('src', resource)) {
			this.onItemLoaded();
			return;
		}
		
		var element = this.getElement(resource);
		this.getStore().add({
			src: resource,
			extension: this.getExtension(resource),
			element: element
		});
		element.on('load', function(e, el) {
			this.onItemLoaded();
		}, this);
	},
	
	onItemLoading: function() {
		
	},
	
	onItemLoaded: function() {
		this.setNumLoading(this.getNumLoading() - 1);
		if (this.getNumLoading() == 0) {
			this.success.apply(this.callbackScope, [this]);
		}
	},
	
	getExtension: function(resource) {
		var parts = resource.split('.');
		var extension = parts[parts.length-1].toLowerCase();
		return extension;
	},
	
	getElement: function(resource) {
		var extension = this.getExtension(resource);
		switch (extension) {
			case 'png':
			case 'jpg':
			case 'jpeg':
			case 'jpeg':
			case 'gif':
				return this.createImage(resource);
				break;
			case 'mp3':
				var el = this.createAudio(resource);
				this.onItemLoaded();
				return el;
				break;
		}
	},
	
	createImage: function(resource) {
		var el = Ext.get(document.createElement('img'));
		el.dom.src = resource;
		return el;
	},
	
	createAudio: function(resource, options) {
		options = options || {};
		var el = Ext.get(Ext.DomHelper.createDom({
			tag: 'audio',
			src: resource,
			preload: options.preload || 'auto',
			loop: options.loop
		}));
		return el;
	},
	
	playAudio: function(src, options) {
		// Make a new audio element and play it
		var el = this.createAudio(src)
		el.dom.play();
	}
	
});