Ext.define('Lapidos.mixin.Event', {
	
	onReady: function(eventName, callback, scope, options) {
		
		// Set the scope to the current target if one isn't defined'
		if (scope == null) {
			scope = this;
		}
		
		// Set default options object if one isn't defined'
		if (options == null) {
			options = {};
		}
		
		// Generate the method name that will be called
		var methodName = this.getEventMethodName(eventName);
		
		// Make sure this method exists
		if (Ext.isFunction(this[methodName])) {
			
			// Call the method
			var returnData = this[methodName](options);
			
			// Check if we have a new event name to listen for
			if (typeof returnData == 'string') {
				
				// Set this callback to single so it only fires once
				options.single = true;
				
				// Store original onReady data so we can make the call again
				options._callback = callback;
				options._eventName = eventName;
				options._scope = scope;
				
				// Listen for the new event name to be fired from this object
				this.on(returnData, function() {
					var options = {};
					if (arguments.length) {
						options = arguments[arguments.length - 1];
					}
					
					// Call the original onReady call with the original data
					// Because the condition should be satisfied now
					this.onReady(options._eventName, options._callback, options._scope, options);
					
				}, this, options);
			}
			else if (Ext.isArray(returnData)) {
				// Returned data is an argument list because the condition
				// was satisfied. Call the callback
				callback.apply(scope, returnData);
			}
		}
	},
	
	/**
	 * Returns the method name to call based on the event name
	 * "test" becomes "onTestReady""
	 * "test-event" becomes "onTestEventReady"
	 */
	getEventMethodName: function(eventName) {
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