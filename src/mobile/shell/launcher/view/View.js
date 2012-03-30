Ext.define('Lapidos.mobile.shell.launcher.view.View', {
	extend: 'Ext.dataview.DataView',
	
	autoScroll: true,
	baseCls: 'tms-shell-launcher-module-view',
	trackOver: true,
	config: {
		title: 'TMS Home',
		itemTpl: new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="{[this.baseCls]}-item" style="float: left; width:100px; height: 100px; text-align: center; margin: 20px; {[!this.hasIcon(values.icon) ? "display: none;" : ""]}">',
					'<div class="{[this.baseCls]}-item-icon">',
						'<img src="{icon}" width="64" height="64" />',
					'</div>',
					'<div class="{[this.baseCls]}-item-title" style="text-align: center; font-weight: bold;">',
						'{title}',
					'</div>',
				'</div>',
			'</tpl>',
			'<div class="clear"></div>',
			{
				baseCls: this.baseCls,
				hasIcon: function(icon){
					if(icon.length){
						return true;
					}
					return false;
				}
			}
		)
	},
	
	constructor: function() {
		this.callParent(arguments);
		this.initListeners();
	},
	
	initListeners: function() {
		this.on('itemtap', this.handleItemTap, this);
	},
	
	handleItemTap: function(dataView, index, target, record) {
		// For some reason the record is not passed as an argument.. maybe beta bug?
		// Get record
		var record = this.getStore().getAt(index);
		var instance = record.get('instance');
		instance.launch();
	}
	
});