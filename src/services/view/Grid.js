Ext.define('Lapidos.services.view.Grid', {
    extend: 'Ext.grid.Panel',
    
	title: 'Services Grid',
	
    initComponent: function() {
        this.items = this.items || [];
		this.dockedItems = this.dockedItems || [];
        this.init();
        this.callParent(arguments);
    },
    
    init: function() {
		this.initSelectionModel();
		this.initColumns();
		this.initActionBar();
		this.initListeners();
    },
	
	initSelectionModel: function() {
		this.selModel = new Ext.selection.CheckboxModel({
			mode: 'SIMPLE'
		});
	},
	
	initColumns: function() {
		this.columns = [{
			header: 'Title',
			dataIndex: 'title',
			flex: 1
		},{
			header: 'Name',
			dataIndex: 'name',
			flex: 1
		},{
			header: 'Status',
			dataIndex: 'instance',
			renderer: function(instance) {
				if (instance.isRunning()) {
					return 'Running';
				}
				else {
					return 'Stopped';
				}
			}
		}];
	},
	
	initActionBar: function() {
		this.topBar = new Ext.toolbar.Toolbar({
			dock: 'top',
			items:[{
				scope: this,
				text: 'Stop',
//				icon: '/resources/icons/edit-24.png',
				scale: 'medium',
				handler: this.stopServices
			},{
				scope: this,
				text: 'Start',
//				icon: '/resources/icons/edit-24.png',
				scale: 'medium',
				handler: this.startServices
			},{
				scope: this,
				text: 'Restart',
//				icon: '/resources/icons/edit-24.png',
				scale: 'medium',
				handler: this.restartServices
			}]
		});
		this.dockedItems.push(this.topBar);
	},
	
	initListeners: function() {
		
	},
	
	getModuleNames: function(records) {
		var names = [];
		var numRecords = records.length;
		for (var i = 0; i < numRecords; i++) {
			names.push(records[i].get('title'));
		}
		return names.join(', ');
	},
	
	startServices: function() {
		var records = this.getSelectionModel().getSelection();
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
	
	stopServices: function() {
		var records = this.getSelectionModel().getSelection();
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
	
	restartServices: function() {
		var records = this.getSelectionModel().getSelection();
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
		this.getView().refresh();
	}
	
});