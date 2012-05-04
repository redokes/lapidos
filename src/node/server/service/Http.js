Ext.define('Lapidos.node.server.service.Http', {
	extend: 'Lapidos.service.Service',
	
	requires: [
		'Lapidos.controller.Front',
		'Lapidos.controller.response.Manager'
	],
	
	http: require('http'),
	fs: require('fs'),
	qs: require('querystring'),
	utils: require('util'),
	httpServer: null,
	
	config: {
		name: 'node-http',
		title: 'Node HTTP Server',
		port: 8080,
		frontController: null
	},
	
	init: function() {
		this.callParent(arguments);
		this.initHttpServer();
	},
	
	initHttpServer: function() {
		this.httpServer = this.http.createServer(function(request, response) {
			var requestObject = require('url').parse(request.url, true);
			var path = requestObject.pathname.replace(/^\//, "").replace(/\/$/, "");
			var parts = path.split('/');
			
			//Total Rig for now
			if(parts[0] == 'file'){
				console.log('------File-------');
				console.log(request.headers);
			}

			//Handle the post params
			if (request.method == 'POST') {
				var body = '';
				request.on('data', function(data) {
					body += data;
				}.bind(this));
				request.on('end', function() {
					var post = this.qs.parse(body.replace( /\+/g, ' ' ));
					this.onRequest(request, response, path, post);
				}.bind(this));
			}
			else{
				this.onRequest(request, response, path, {});
			}
		}.bind(this));
		this.httpServer.listen(this.port);
	},
	
	onRequest: function(request, response, path, params) {
		// Handle any params
		var parts = require('url').parse(request.url, true)
		Ext.apply(params, parts.query);
		var frontController = new Lapidos.controller.Front();
		frontController.getRequestParser().applyParams(params);
		
		// Set reference to node response object
		frontController.getResponseManager().setResponse(response);
		
		// Set the request string
		frontController.getRequestParser().setRequestString(path);
		frontController.getRequestParser().parse();
		
		// Run the front controller
		frontController.run();
		
		return;
		
		
		
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end('');
		var module = 'index';
		var action = 'index';
		if (path.length) {
			var parts = path.split('/');
			module = parts[0];
			if (parts.length > 1) {
				action = parts[1];
			}
		}
		
		var eventName = 'request' + module;
		var methodName = this.getActionName(action);
		
		this.fireEvent(eventName, methodName, request, response, path, params);
		response.end('');
	},
	
	getActionName: function(name) {
		var parts = name.split('-');
		var numParts = parts.length;
		parts[0] = parts[0].toLowerCase();
		for (var i = 1; i < numParts; i++) {
			
			parts[i] = parts[i].toLowerCase();
			parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
		}
		return parts.join('') + 'Action';
	}
});