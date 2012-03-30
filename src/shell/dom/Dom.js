Ext.define('Lapidos.shell.dom.Dom', {
    extend: 'Lapidos.shell.Shell',
	requires: [
		'Lapidos.shell.dom.service.History'
	],
    
	///////////////////////////////////////////////////////////////////////////
	// Init Functions
	///////////////////////////////////////////////////////////////////////////
	initServices: function(){
		this.getOs().getServiceManager().register('Lapidos.shell.dom.service.History');
	},
	
	//////////////////////////////////////////////////////////////////////
	//	Utility Functions
	/////////////////////////////////////////////////////////////////////
	
	/**
     * Adds a javascript file to the dom
	 * @param {String} src path to the file
     */
	addJs: function(src, onLoad, onError, scope) {
		onLoad = onLoad || Ext.emptyFn;
		onError = onError || Ext.emptyFn;
		scope = scope || window;
		
		var needToAdd = true;
		Ext.select('script').each(function(el) {
			if (el.dom.src.replace(src, '') != el.dom.src) {
				needToAdd = false;
			}
		});
		if (needToAdd) {
			var newEl = Ext.Loader.injectScriptElement(src, onLoad, onError, scope);
			return newEl;
		}
		else {
			return false;
		}
	},
	
	/**
     * Adds a css file to the dom
	 * @param {String} href path to the file
     */
	addCss: function(href) {
		var needToAdd = true;
		Ext.select('link').each(function(el) {
			if (el.dom.href.replace(href, '') != el.dom.href) {
				needToAdd = false;
			}
		});
		if (needToAdd) {
			var newEl = Ext.core.DomHelper.append(Ext.getDoc().down('head'), {
				tag:'link',
				type:'text/css',
				rel: 'stylesheet',
				href:href
			});
			return newEl;
		}
		else {
			return false;
		}
	},
	
	showNotification: function(service, message) {
		var config = message;
		if (typeof message == 'string') {
			config = {
				html: message
			};
		}
		
		var notification = Ext.create('Lapidos.notification.ui.Notification', Ext.apply({
			corner: 'tr',
			cls: 'ux-notification-light',
			manager: 'fullscreen',
			closable: true,
			title: '',
			html: '',
			slideInDelay: 1000,
			slideDownDelay: 1000,
			autoDestroyDelay: 5000,
			slideInAnimation: 'elasticIn',
			slideDownAnimation: 'elasticIn'
		}, config));
		if(notification.autoShow){
			notification.show();
		}
		if(!Ext.isEmpty(notification.callback)){
			Ext.bind(notification.callback, notification.scope || this, [notification])();
		}
	}
});