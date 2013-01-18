Ext.define('Lapidos.node.server.service.Http', {
	extend: 'Lapidos.service.Service',
	
	requires: [
		'Lapidos.controller.Front',
		'Lapidos.controller.response.Manager'
	],
	
	http: require('http'),
	https: require('https'),
	fs: require('fs'),
	qs: require('querystring'),
	utils: require('util'),
    url: require('url'),
	httpServer: null,
	httpsServer: null,
    express: express,
    app: null,
    root: '/projects/nodejs/game/public/',
	
	config: {
		name: 'node-http',
		title: 'Node HTTP Server',
		port: 8080,
		frontController: null
	},
	
	init: function() {
		this.callParent(arguments);
        this.initApp();
		this.initHttpServer();
	},

    initApp: function() {
        this.app = express();

        this.app.all(/^\/([a-z0-9\-]+)\/?([a-z0-9\-]+)?\/?([a-z0-9\-]+)?\/?([^\.]*)$/, function(request, response, next) {
            var frontController = new Lapidos.controller.Front({
                request: request,
                response: response,
                server: this
            });

            frontController.run();

        }.bind(this));

        this.app.get('/', function(request, response) {
            response.sendfile('/index.html', {
                root: this.root
            });
        }.bind(this));

        this.app.get('*', function(request, response) {
            this.sendFile(request.path, response);
        }.bind(this));
    },

    sendFile: function(path, response, callback) {
        callback = callback || function() {}
        console.log('callback');
        console.log(callback);
        response.sendfile(path, {
            root: this.root
        }, function() {
            console.log('real callback');
            console.log(arguments);
        }, function() {
            console.log('maybe here');
        });
    },
	
	initHttpServer: function() {

        this.httpServer = this.http.createServer(this.app).listen(this.port);
//        this.httpsServer = this.https.createServer({}, this.app).listen(443);

        return;
		this.httpServer = this.http.createServer(function(request, response) {
			var requestObject = require('url').parse(request.url, true);
			var path = requestObject.pathname.replace(/^\//, "").replace(/\/$/, "");
			var parts = path.split('/');
			
			//Total Rig for now
			if (parts[0] == 'file') {
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

        // Determine if this is a file or a controller
        if (request.url === '/favicon.ico') {
            response.writeHead(200, {'Content-Type': 'image/x-icon'} );
            response.end();
            return;
        }

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