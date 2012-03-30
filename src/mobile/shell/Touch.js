Ext.define('Lapidos.mobile.shell.Touch', {
    extend: 'Lapidos.shell.Shell',
    
	config: {
		name: '',
		view: null
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Init Functions
	///////////////////////////////////////////////////////////////////////////
	init: function() {
		Ext.application({
			name: this.getName(),

			launch: Ext.bind(this.onLaunch, this)
		});
	},
	
	onLaunch: function(){
		this.initView();
		
		this.fireEvent('launch', this);
	},
	
	initView: function() {
		
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
	
	showNotification: function(service, data) {
		console.log(data.title + ' - ' + data.html);
	}
});