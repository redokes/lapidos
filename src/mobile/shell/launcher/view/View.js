Ext.define('Lapidos.mobile.shell.launcher.view.View', {
	extend: 'Ext.dataview.DataView',
	requires: [
		'TMS.Util'
	],
	
	config: {
		trackOver: true,
//		autoScroll: true
	},
	
	constructor: function() {
		this.callParent(arguments);
		this.initItemTpl();
		this.initListeners();
	},
	
	initItemTpl: function() {
		this.setItemTpl(new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="{[this.getCls(this.me, "item")]}" style="{[!this.hasIcon(values.icon) ? "display: none;" : ""]}">',
					'<div class="{[this.getCls(this.me, "item", "icon")]}">',
						'<img src="{icon}" />',
					'</div>',
					'<div class="{[this.getCls(this.me, "item", "title")]}">',
						'<span>',
							'{title}',
						'</span>',
					'</div>',
				'</div>',
			'</tpl>',
			'<div class="clear"></div>',
			{
				me: this,
				getCls: TMS.Util.generateCssClass,
				hasIcon: function(icon) {
					if (icon.length) {
						return true;
					}
					return false;
				},
				getIcon: function(icon) {
					console.log('setting src to ' + icon);
					return icon;
				}
			}
		));
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