/**
 * Component that is used to load and manage audio
 * 
 * @constructor
 * @param {Lapidos.os.Os} os
 * @param {Object} config The config object
 */
Ext.define('Lapidos.audio.Manager', {
	extend: 'Ext.util.Observable',
	
	///////////////////////////////////////////////////////////////////////////
	// Requires
	///////////////////////////////////////////////////////////////////////////
	requires:[
		'Lapidos.mixin.Event',
		'Lapidos.audio.model.Audio',
		'Lapidos.audio.model.Channel',
		'Lapidos.audio.model.Group',
		'Lapidos.audio.Group',
		'Lapidos.audio.Audio'
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
	
	config: {
		numLoading: 0,
		store: null,
		channels: null,
		groups: null
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Inits
	///////////////////////////////////////////////////////////////////////////
	constructor: function(os, config) {
		this.initConfig(config);
		this.os = os;
		this.callParent([config]);
		this.init();
	},
	
	init: function(){
		this.initGroups();
		this.initChannels();
		this.initStore();
	},
	
	initGroups: function() {
		this.setGroups(new Ext.data.Store({
			model: 'Lapidos.audio.model.Group'
		}));
	},
	
	initChannels: function() {
		this.setChannels(new Ext.data.Store({
			model: 'Lapidos.audio.model.Channel'
		}));
	},
	
	initStore: function() {
		this.setStore(new Ext.data.Store({
			model: 'Lapidos.audio.model.Audio'
		}));
	},
	
	createGroup: function(name) {
		var group = new Lapidos.audio.Group({
			name: name,
			manager: this
		});
		return group;
	}
	
});