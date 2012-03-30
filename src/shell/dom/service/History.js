Ext.define('Lapidos.shell.dom.service.History', {
	extend: 'Lapidos.service.Service',
	
	config:{
		name: 'history',
		title: 'History Manager'
	},
	ignoreNextToken: '',
	
	init: function(){
		this.initIframe();
		this.initHistory();
		this.initModuleManager();
	},
	
	initIframe: function(){
		this.iframeTemplate = new Ext.XTemplate(
			'<!-- Fields required for history management -->',
			'<form id="history-form" class="x-hide-display">',
				'<input type="hidden" id="x-history-field" />',
				'<iframe id="x-history-frame"></iframe>',
			'</form>'
		);
		this.iframeTemplate.append(Ext.getBody(), {});
	},
	
	initHistory: function(){
		Ext.History.init();
		Ext.History.Delimiter = '/';
		Ext.History.parseToken = function(token){
			if(token != null){
				return token.split(Ext.History.Delimiter);
			}
			return [];
		};
		Ext.History.on('change', this.onHistoryChange, this);
	},
	
	initModuleManager: function(){
		this.getOs().getModuleManager().on('launch', this.onModuleLaunch, this);
	},
	
	/**
	 * Add a level to the history stack
	 * @param {Lapidos.module.Module} module
	 * @param {Object} params
	 */
	add: function(module, params){
		if(Ext.isEmpty(params)){
			params = {};
		}
		Ext.History.add(this.getToken(module, params), true);
	},
	
	back: function(){
		console.log('called back');
		Ext.History.back();
	},
	
	loadAddress: function(){
		var token = this.getCurrentToken();
		if(!Ext.isEmpty(token)){
			Ext.History.fireEvent('change', token);
		}
		else{
			Ext.History.fireEvent('change', null);
		}
	},
	
	getToken: function(module, params){
		//Build an array version of the params object
		var parts = [module.getName()];
		for(var key in params){
			parts.push(key);
			parts.push(params[key]);
		}
		
		//Build the history string
		return parts.join(Ext.History.Delimiter);
	},
	
	getCurrentToken: function(){
		var parts = decodeURI(location.href).split("#");
		if(parts.length == 2){
			return parts[1];
		}
		else{
			return null;
		}
	},
	
	onModuleLaunch: function(manager, module, launchParams){
		this.ignoreNextToken = this.getToken(module, launchParams);
		this.add(module, launchParams, true);
	},
	
	onHistoryChange: function(token){
		var module = null;
		var moduleName = '';
		var parts = [];
		var params = {};
		if(!Ext.isEmpty(token)){
			parts = token.split(Ext.History.Delimiter);
			moduleName = parts.shift();
			module = this.getOs().getModuleManager().getInstance(moduleName);
		}
		
		if(this.ignoreNextToken == token){
			this.ignoreNextToken = '';
			return;
		}
		
		//Create the params from the parts
		for(var i = 0; i < parts.length; i++){
			var part = parts[i];
			if(!Ext.isEmpty(parts[i+1])){
				params[part] = parts[i+1];
			}
		}
		this.fireEvent('change', module, params);
	}
});