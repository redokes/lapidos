Ext.define('Lapidos.ajax.service.Batcher', {
	extend: 'Lapidos.service.Service',
	
	///////////////////////////////////////////////////////////////////////////
	// Config
	///////////////////////////////////////////////////////////////////////////
	config: {
		name: 'ajax-batcher',
		title: 'Ajax Batcher',
		autoStart: false,
		
		/**
		 * @cfg {String} 
		 * The url to sendf the bulk request to
		 * @accessor
		 */
		url: null,
		
		/**
		 * @cfg {Integer} 
		 * The amount of time to wait for new requests before we send the batch request
		 * @accessor
		 */
		wait: 50,

		/**
		 * @cfg {Integer} 
		 * The total amount of requests captured before the bulk request is sent
		 * @accessor
		 */
		limit: 5
	},
	
	/**
	 * @type {Boolean}
	 * True if the controller is currently enabled and batching requests
	 */
	
	requestTimeout: false,
	requests: [],
	
	init: function(){
		this.initListeners();	
	},
	
	initListeners: function(){
		
		Ext.Ajax.on('beforerequest', function(connection, request) {
			// Ignore if this request is bulk or a form
			if (request.ignoreBatch === true || !this.isRunning() || this.getUrl() == null || request.bulk === true || request.async === false || request.form != null) {
				return true;
			}
			
			//Change the passed callback to the userCallback and set the callback to an empty function
			request.userCallback = request.callback;
			request.callback = function(){};
			
			//Clear timeout
			if (this.requestTimeout) {
				clearTimeout(this.requestTimeout);
			}
			
			if (this.requests.length >= this.limit) {
				this.sendBulkRequest();
				this.requestTimeout = false;
			}
			else {
				this.requestTimeout = setTimeout(Ext.bind(function() {
					this.sendBulkRequest();
					this.requestTimeout = false;
				}, this), this.wait);
			}
			
			//Queue requests
			this.requests.push(request);
			request.transactionId = this.requests.length - 1;
			
			//Return false to cancel request
			//Ext.Ajax.abort();
			return false;
		}, this);
	},
	
	sendBulkRequest: function() {
		var requests = [];
		
		//make a copy of requests
		while (this.requests.length) {
			requests.push(this.requests.pop());
		}
		this.requests = [];
		
		//build the request object to send
		var requestArray = [];
		
		Ext.each(requests, function(request) {
			//Look for any arrays
			var arraysFound = [];
			for(var i in request.params){
				var value = request.params[i];
				if(i.substr(-2) == '[]'){
					if(typeof value != 'array'){
						value = [];
					}
					//Create correct one
					request.params[i.replace('[]', '')] = value;
					
					//Delete old one
					delete request.params[i];
				}
			}
			
			//Look for any arays and remove them, this will probably break everything
			for (var key in request.params) {
				if(typeof request.params[key] == "object"){
					var valueObject = request.params[key];
					for(var valueObjectKey in valueObject){
						request.params[key] = valueObject[valueObjectKey];
						break;
					}
				}
			}
			
			var requestObject = {
				transactionId: request.transactionId,
				url: request.url,
				params: request.params || {},
				method: request.method || 'post'
			};
			requestArray.push(requestObject);
		}, this);
		
		//console.log("just sent a bulk ajax request of " + requests.length);
		//Send a bulk request
		Ext.Ajax.request({
			scope: this,
			bulk: true,
			url: this.url,
			requests: requests,
			method:'post',
			params: {requests: Ext.encode(requestArray)},
			callback: function(request, success, r){
				var requests = request.requests;
				var response = Ext.decode(r.responseText);
				
				//Request was successfull
				if(!Ext.isEmpty(response)){
					var results = response.results;
					Ext.each(results, function(result){
						var request = requests[requests.length - result.transactionId - 1];
						var sendResponse = {};
						Ext.apply(sendResponse,{
							request: request,
							requestId: request.id,
							responseText: Ext.encode(result)
						}, r);
						
						//get the callback function, can be success or callback
						if(request.success){
							Ext.bind(request.success, request.scope)(sendResponse, request);
			            }
			            if(request.userCallback){
							try{
								Ext.callback(request.userCallback, request.scope, [request.options, success, sendResponse]);
							}
							catch(e){
							}
			            }
					}, this);
				}
				
				//Request timed out
				else{
					Ext.each(requests, function(request){
						var sendResponse = {};
						Ext.apply(sendResponse,{
							request: request,
							requestId: request.id,
							responseText: ''
						}, r);
						
						//get the callback function, can be success or callback
						if(request.failure){
							Ext.bind(request.failure, request.scope)(sendResponse, request);
			            }
			            if(request.userCallback){
							try{
								Ext.callback(request.userCallback, request.scope, [request.options, success, sendResponse]);
							}
							catch(e){
							}
			            }
					}, this);
				}
			}
		});
	}
	
});