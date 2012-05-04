Ext.define('Lapidos.controller.Api', {
	extend: 'Lapidos.controller.Action',
	requires:[
		'Lapidos.controller.Action'
	],
	config: {
		doRender: false
	},
	
	constructor: function() {
		this.callParent(arguments);
	},
	
	setResponseParam: function(key, value) {
		this.getResponse().setParam(key, value);
	},
	
	getResponseParam: function(key) {
		return this.getResponse().getParam(key);
	},
	
	getResponse: function() {
		return this.getFrontController().getResponseManager();
	},
	
	sendHeaders: function() {
		this.getResponse().sendHeaders();
	}
	
});