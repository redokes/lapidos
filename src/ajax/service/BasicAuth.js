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

		}

		// Check if request url matches any url patterns
		for (var urlPattern in this.urlPatterns) {

			if (matchUrl.match(urlPattern)) {
				options.headers = options.headers || {};
				options.headers = Ext.apply(options.headers, this.urlPatterns[urlPattern].header)
			}

		}

		return true;

	}
	
});