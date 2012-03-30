Ext.define('Lapidos.mixin.Event', {
	
	onReady: function(eventName, callback, scope, options) {
		if (scope == null) {
			scope = this;
		}
		if (options == null) {
			options = {};
		}
		
		var methodName = this.getMethodName(eventName);
		if (Ext.isFunction(this[methodName])) {
			var returnData = this[methodName](options);
			
			if (returnData != null && returnData.params != null) {
				if (!Ext.isArray(returnData.params)) {
					returnData.params = [returnData.params];
				}
				returnData.params.push(options);
				callback.apply(scope, returnData.params);
			}
			else {
				var data = Ext.apply({
					eventName: eventName,
					target: scope
				}, returnData);
				
				data.target.on(data.eventName, function() {
					options = arguments[arguments.length-1];
					// TODO ultimate rig - not sure why there is another param sometimes
					if (options.options == null) {
						options = arguments[arguments.length-2];
					}
					
					// need to call the original callback because the new event has been met
//					this.onReady(options.eventName, options.callback, options.scope, options.options);
					this.onReady(options.eventName, options.callback, options.scope, options.options);
				}, this, {
					single: true,
					callback: callback,
					scope: scope,
					eventName: eventName,
					options: options
				});
			}
		}
	},
	
	getMethodName: function(eventName) {
		var methodName = 'on';
		var parts = eventName.split('-');
		var numParts = parts.length;
		for (var i = 0; i < numParts; i++) {
			parts[i] = parts[i].toLowerCase();
			parts[i] = parts[i].substr(0, 1).toUpperCase() + parts[i].substr(1);
		}
		return methodName + parts.join('') + 'Ready';
	}
	
});