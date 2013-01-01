Ext.define('Lapidos.ajax.service.BasicAuth', {
	extend: 'Lapidos.service.Service',
	
	///////////////////////////////////////////////////////////////////////////
	// Config
	///////////////////////////////////////////////////////////////////////////
	config: {
		name: 'basic-auth',
		title: 'Basic Auth',
		autoStart: false,
		urlPatterns: {}
	},
	
	addUrlPattern: function(urlPattern, username, password) {
		this.urlPatterns[urlPattern] = {
			username: username,
			password: password,
			header: {
				Authorization: 'Basic ' + btoa(Ext.String.format('{0}:{1}', username, password))
			}
		};
	},
	
	removeUrlPattern: function(urlPattern) {
		delete this.urlPatterns[urlPattern];
	},
	
	initListeners: function() {
		Ext.Ajax.on('beforerequest', this.onBeforeRequest, this);
	},
	
	removeListeners: function() {
		Ext.Ajax.un('beforerequest', this.onBeforeRequest, this);
	},
	
	onStart: function() {
		this.initListeners();
	},
	
	onStop: function() {
		this.removeListeners();
	},
	
	onBeforeRequest: function(connection, options) {
		var matchUrl = options.url;
		if (matchUrl.match('http://') || matchUrl.match('https://')) {

		}
		else {
			matchUrl = location.host + '/' + options.url;
			matchUrl = matchUrl.replace('//', '/');
			matchUrl = location.protocol + '//' + matchUrl;
			
			// Remove trailing slash
			if (matchUrl.charAt(matchUrl.length - 1) == '/') {
				matchUrl = matchUrl.substring(0, matchUrl.length - 1);
			}
		}
		
		// Check if request url matches any url patterns
		for (var urlPattern in this.urlPatterns) {

			if (matchUrl.match(urlPattern)) {
				// Make sure headers is an object
				options.headers = options.headers || {};
				
				// Set auth header if one isn't already set
				options.headers = Ext.apply(this.urlPatterns[urlPattern].header, options.headers);
				console.log('matched and set headers');
				console.log(options.headers);
			}

		}

		return true;

	}
	
});