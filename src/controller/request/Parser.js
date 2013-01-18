Ext.define('Lapidos.controller.request.Parser', {
	extend: 'Ext.util.Observable',
	requires:[
		'Lapidos.mixin.Event'
	],
	
	config: {
        request: null,

        module: 'index',
        controller: 'index',
        action: 'index',

        url: require('url'),

		requestString: '',
		requestParams: {},
		root: false
	},
	
	constructor: function(config) {
		this.callParent(arguments);
		this.initConfig(config);
        return;
		if (this.getRequestString() == '') {
			if (typeof(location) != 'undefined') {
				if (location.hash.length) {
					var hash = location.hash.replace('#', '');
					this.setRequestString(hash);
				}
				else if (location.pathname.length > 1) {
					this.setRequestString(location.pathname.slice(1));
				}
			}
		}
	},
	
	parse: function() {
        this.module = this.request.params[0] || this.module
        this.controller = this.request.params[1] || this.controller
        this.action = this.request.params[2] || this.action
        var parts = this.url.parse(this.request.url, true)
        Ext.apply(this.requestParams, parts.query);
	},
	
	ucfirst: function(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	},
	
	applyParams: function(params) {
		this.setRequestParams(Ext.apply(this.getRequestParams(), params));
	},
	
	setRequestParam: function(key, value) {
		this.getRequestParams()[key] = value;
	},
	
	getRequestParam: function(key, defaultValue) {
		if (typeof(this.getRequestParams()[key]) != 'undefined') {
			return this.getRequestParams()[key];
		}
		return defaultValue;
	},
	
	getModuleName: function(str) {
		str = str || this.getModule();
		str = str.toLowerCase();
		str = str.replace('.', '');
		var parts = str.split('-');
		var numParts = parts.length;
		for (var i = 1; i < numParts; i++) {
			parts[i] = this.ucfirst(parts[i]);
		}
		return parts.join('');
	},
	
	getControllerName: function(str) {
		str = str || this.getController();
		str = str.toLowerCase();
		var parts = str.split('-');
		var numParts = parts.length;
		for (var i = 0; i < numParts; i++) {
			parts[i] = this.ucfirst(parts[i]);
		}
		return parts.join('');
	},
	
	getActionName: function(str) {
		str = str || this.getAction();
		str = str.toLowerCase();
		var parts = str.split('-');
		var numParts = parts.length;
		for (var i = 1; i < numParts; i++) {
			parts[i] = this.ucfirst(parts[i]);
		}
		var actionName = parts.join('');
		if (actionName.length) {
			return actionName + 'Action';
		}
		return false;
	}
	
});
