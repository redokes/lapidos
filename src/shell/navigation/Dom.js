Ext.define('Lapidos.shell.navigation.Dom', {
	extend: 'Ext.Component',
	
	///////////////////////////////////////////////////////////////////////////
	// Requires
	///////////////////////////////////////////////////////////////////////////
	requires:[
		'Lapidos.shell.navigation.model.Item'
	],
	
	///////////////////////////////////////////////////////////////////////////
	// Config
	///////////////////////////////////////////////////////////////////////////
	config: {
		store: null,
		baseCls: 'lapidos-shell-navigation',
		overCls: 'over',
		activeCls: 'active',
		tags: [],
		tagMode: 'any' // any, all, none
	},
	
	constructor: function(config){
		this.initConfig(config);
		this.callParent(arguments);
	},
	
	initComponent: function(){
		this.init();
		this.callParent(arguments);
	},
	
	init: function(){
		this.initStore();
		this.initRenderTemplate();
		this.initRenderSelectors();
		this.initMenuTemplate();
	},
	
	initStore: function(){
		this.getStore().on({
			scope: this,
			datachanged: {
				scope: this,
				buffer: 100,
				fn: this.onDataChange
			}
		});
	},
	
	initRenderTemplate: function(){
		this.renderTpl = new Ext.XTemplate(
			'<ul class="{[this.baseCls]}-menu"></ul>',
			{
				baseCls: this.baseCls
			}
		);
	},
	
	initRenderSelectors: function(){
		this.renderSelectors = {
			menuEl: '.' + this.baseCls + '-menu'
		};
	},
	
	initMenuTemplate: function(){
		this.menuTemplate = new Ext.XTemplate(
			'<li class="{[this.getCls("item")]} {[values.module.icon.length ? this.getCls("item", "icon") : this.getCls("item", "no", "icon")]}" id="{id}">',
				'<div class="{[this.getCls("item", "display")]}">{display}</div>',
				'<tpl if="module.icon.length">',
					'<div class="{[this.getCls("item", "image")]}"><img src="{module.icon}" /></div>',
				'</tpl>',
				'<tpl if="items != null">',
					'{[this.createSubMenu(values.items)]}',
				'</tpl>',
			'</li>',
			{
				baseCls: this.baseCls,
				getCls: this.getCls,
				createSubMenu: function(items) {
					if(!Ext.isArray(items)){
						items = [items];
					}
					var html = '<ul class="' + this.getCls('menu') + ' ' + this.getCls('sub', 'menu') + '">';
					Ext.each(items, function(item) {
						html +=  this.apply(item.data);
					}, this);
					html += '</ul>';
					return html;
				}
			}
		);
	},
	
	afterRender: function(){
		var listeners = {
            scope: this,
            click: this.handleEvent,
            mousedown: this.handleEvent,
            mouseup: this.handleEvent,
            dblclick: this.handleEvent,
            contextmenu: this.handleEvent,
            mouseover: this.handleEvent,
            mouseout: this.handleEvent
        };

        this.mon(this.getTargetEl(), listeners);
		return this.callParent(arguments);
	},
	
	handleEvent: function(e){
		var item = e.getTarget('.' + this.getCls('item'));
		var menu = e.getTarget('.' + this.getCls('sub', 'menu'));
		var type = e.type;
		
		//Handle menu events
		if(menu != null){
			switch(type){
				case 'mouseover':
					this.onSubMenuMouseOver(menu, e);
					this.fireEvent('submenumouseover', menu, e);
				break;
				case 'mouseout':
					this.onSubMenuMouseOut(menu, e);
					this.fireEvent('submenumouseout', menu, e);
				break;
			}
		}
		
		//Handle item events
		if(item != null){
			var record = this.store.findRecord('id', item.id);
			switch(type){
				case 'mouseover':
					this.onItemMouseOver(record, item, e);
					this.fireEvent('itemmouseover', record, item, e);
				break;
				case 'mouseout':
					this.onItemMouseOut(record, item, e);
					this.fireEvent('itemmouseout', record, item, e);
				break;
				case 'click':
					this.onItemClick(record, item, e);
					this.fireEvent('itemclick', record, item, e);
				break;
				case 'dblclick':
					this.onItemDblClick(item, e);
					this.fireEvent('itemdblclick', record, item, e);
				break;
			}
		}
	},
	
	getCls: function() {
		var cls = "" + this.baseCls;
		Ext.each(arguments, function(arg){
			cls += "-" + arg;
		}, this);
		return cls;
	},
	
	getNode: function(record){
		return Ext.get(record.get('id'));
	},
	
	activateItem: function(item){
		var activeCls = this.getCls('item', this.activeCls);
		
		// Remove any currently active items
		this.menuEl.select("." + activeCls).removeCls(activeCls);
		
		// Set the item and its parents as active
		function applyActiveCls(item) {
			Ext.fly(item).addCls(activeCls);
			var parent = Ext.fly(item).up("." + this.getCls('item'));
			if(parent != null){
				Ext.bind(applyActiveCls, this)(parent);
			}
		}
		Ext.bind(applyActiveCls, this)(item);
		
	},
	
	hasTag: function(tags) {
		var filterTags = this.tags;
		if (filterTags.length) {
			// Check if this item has a tag
			if (tags && tags.length) {

				// Check if this item has tags matching those in this store's tags
				var intersection = Ext.Array.intersect(tags, filterTags);
				switch(this.tagMode) {
					case 'any':
						if (intersection.length) {
							return true;
						}
						break;
						
					case 'all':
						if (intersection.length == filterTags.length) {
							return true;
						}
						break;
						
					case 'none':
						if (intersection.length == 0) {
							return true;
						}
						break;
				}
			}
			
			return false;
		}
		else {
			// Do not need to filter
			return true;
		}
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Events
	///////////////////////////////////////////////////////////////////////////
	
	onDataChange: function(store) {
		var records = this.getStore().data.filterBy(Ext.bind(function(record) {
			if (record.get('path') == '/' && this.hasTag(record.get('tags'))) {
				return true;
			}
			return false;
		}, this));
		
		this.menuEl.update('');
		
		var numRecords = records.items.length;
		for (var i = 0; i < numRecords; i++) {
			this.menuTemplate.append(this.menuEl, records.items[i].data);
		}
	},
	
	onSubMenuMouseOver: Ext.emptyFn,
	onSubMenuMouseOut: Ext.emptyFn,
	onItemMouseOver: function(record, item){
		var overCls = this.getCls('item', this.overCls);
		function applyOverCls(item){
			Ext.fly(item).addCls(overCls);
			var parent = Ext.fly(item).up("." + this.getCls('item'));
			if(parent != null){
				Ext.bind(applyOverCls, this)(parent);
			}
		}
		Ext.bind(applyOverCls, this)(item);
	},
	onItemMouseOut: function(record, item){
		var overCls = this.getCls('item', this.overCls);
		function removeOverCls(item){
			Ext.fly(item).removeCls(overCls);
			var parent = Ext.fly(item).up("." + this.getCls('item'));
			if(parent != null){
				Ext.bind(removeOverCls, this)(parent);
			}
		}
		Ext.bind(removeOverCls, this)(item);
	},
	onItemClick: function(record, item) {
		//Attempt to run the handler
		var scope = record.get('scope') || this;
		var handlerResponse = Ext.bind(record.get('handler'), scope)();
		if(handlerResponse === false){
			return;
		}
		
		//Activate the item
		this.activateItem(item);
		
		//Launch the module
		record.get('module').launch(record.get('params'));
	},
	onItemDblClick: Ext.emptyFn
});