Ext.define('Lapidos.controller.request.Parser', {
	extend: 'Ext.util.Observable',
	requires:[
		'Lapidos.mixin.Event'
	],
	
	config: {
		requestString: '',
		action: 'index',
		module: 'index',
		controller: 'index',
		requestParams: {},
		root: false
	},
	
	constructor: function(config) {
		this.callParent(arguments);
		this.initConfig(config);
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
		var requestParts = this.getRequestString().split('/');
		var requestCount = requestParts.length;
		var lastPart = requestParts[requestCount-1];
		
		// check the last element to see if there are any ?key=value
		if (lastPart.indexOf('?') != -1) {
			var paramParts = lastPart.split('?');
			if (paramParts.length > 1) {
				requestParts[requestCount - 1] = paramParts[0];
			}
		}
		
		if (requestCount && requestParts[0].length) {
			this.setModule(requestParts[0]);
			if (requestCount > 1 && requestParts[1].length) {
				this.setController(requestParts[1]);
				if (requestCount > 2 && requestParts[2].length) {
					this.setAction(requestParts[2]);
					if (requestCount > 3) {
						for (var i = 3; i < requestCount; i += 2) {
							if ((i + 1) < requestCount) {
								this.getRequestParams()[requestParts[i]] = requestParts[i + 1];
							}
							else if (requestParts[i].length) {
								this.getRequestParams()[requestParts[i]] = false;
							}
						}
					}
				}
			}
		}
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
