Ext.define('Lapidos.services.mobile.view.List', {
    extend: 'Ext.dataview.List',
    
	config: {
		title: 'Services Mobile',
		itemTpl: new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="service-item">{title} - {[this.runningDisplay(values.instance)]}</div>',
			'</tpl>', {
				runningDisplay: function(instance) {
					if (instance.isRunning()) {
						return 'Running';
					}
					else {
						return 'Stopped';
					}
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
		var instance = record.get('instance');
		var actions = [];
		
		if (instance.isRunning()) {
			actions.push({
				scope: this,
				text: 'Stop',
				ui: 'decline',
				handler: function() {
					this.stopServices([record]);
					this.actionSheet.hide();
				}
			});
		}
		else {
			actions.push({
				scope: this,
				text: 'Start',
				ui: 'confirm',
				handler: function() {
					this.startServices([record]);
					this.actionSheet.hide();
				}
			});
		}
		
		actions.push({
			scope: this,
			text: 'Restart',
			handler: function() {
				this.restartServices([record]);
				this.actionSheet.hide();
			}
		});
		
		actions.push({
			scope: this,
			text: 'Cancel',
			handler: function() {
				this.actionSheet.hide();
			}
		});
		
		this.actionSheet = Ext.create('Ext.ActionSheet', {
			items: actions
		});
		
//		this.actionSheet.show();
		
		// Use show by for now because it errors in b1
		this.actionSheet.showBy(this);
	},
	
	getModuleNames: function(records) {
		var names = [];
		var numRecords = records.length;
		for (var i = 0; i < numRecords; i++) {
			names.push(records[i].get('title'));
		}
		return names.join(', ');
	},
	
	startServices: function(records) {
		records = records || this.getSelectionModel().getSelection();
		var numRecords = records.length;
		for (var i = 0; i < numRecords; i++) {
			records[i].get('instance').start();
		}
		this.refreshView();
		
		if (numRecords) {
			this.fireEvent('notify', {
				title: 'Started Services',
				html: this.getModuleNames(records) + ' started'
			});
		}
	},
	
	stopServices: function(records) {
		records = records || this.getSelectionModel().getSelection();
		var numRecords = records.length;
		for (var i = 0; i < numRecords; i++) {
			records[i].get('instance').stop();
		}
		this.refreshView();
		if (numRecords) {
			this.fireEvent('notify', {
				title: 'Stopped Services',
				html: this.getModuleNames(records) + ' stopped'
			});
		}
	},
	
	restartServices: function(records) {
		records = records || this.getSelectionModel().getSelection();
		var numRecords = records.length;
		for (var i = 0; i < numRecords; i++) {
			records[i].get('instance').stop();
			records[i].get('instance').start();
		}
		this.refreshView();
		
		if (numRecords) {
			this.fireEvent('notify', {
				title: 'Restarted Services',
				html: this.getModuleNames(records) + ' restarted'
			});
		}
	},
	
	refreshView: function() {
		this.refresh();
	}
	
});