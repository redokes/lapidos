Ext.define('Lapidos.controller.Action', {
	extend: 'Ext.util.Observable',
	requires:[
		'Lapidos.controller.Front'
	],
	
	config: {
		frontController: null,
		action: null,
		doRender: true
	},
	
	constructor: function(config) {
		this.callParent(arguments);
		this.initConfig(config);
		this.init();
		if (Ext.isFunction(this[this.getAction()])) {
			this[this.getAction()]();
		}
		
		this.sendHeaders();
	},
	
	init: function() {
		
	},
	
	sendHeaders: function() {
		if (this.doRender) {
//			this.getView().render();
		}
	},
	
	setRequestParam: function(key, value) {
		this.getFrontController().getRequestParser().setRequestParam(key, value);
	},
	
	getRequestParam: function(key, defaultValue) {
		return this.getFrontController().getRequestParser().getRequestParam(key, defaultValue);
	}
	
});
