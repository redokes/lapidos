Ext.define('Lapidos.form.Group', {
	alias: 'widget.lapidosformgroup',
	extend: 'Lapidos.form.Panel',
	
	config: {
		managerViewCls: 'Ext.tab.Panel',
		layout: 'fit'
	},
	
	constructor: function() {
		this.callParent(arguments);
		this.initManagerView();
	},
	
	addForm: function() {
		this.managerInstance.add.apply(this.managerInstance, arguments);
	},
	
	initManagerView: function() {
		this.managerInstance = Ext.create(this.getManagerViewCls(), {
			
		});
		this.add(this.managerInstance);
		this.managerInstance.on('add', function(manager, item, index) {
			var forms = this.query('.lapidosform');
			var numForms = forms.length;
			for (var i = 0; i < numForms; i++) {
				forms[i].bottomBar.hide();
			}
		}, this);
	},
	
	setRecord: function(record) {
		this.callParent(arguments);
		var forms = this.query('.lapidosform');
		var numForms = forms.length;
		var hashName = '';
		for (var i = 0; i < numForms; i++) {
			forms[i].setRecord(record);
		}
	},
	
	getValues: function() {
		var values = {};
		var forms = this.query('.lapidosform');
		var numForms = forms.length;
		var hashName = '';
		for (var i = 0; i < numForms; i++) {
			var originalJsonSubmit = forms[i].getJsonSubmit();
			forms[i].setJsonSubmit(false);
			var formValues = forms[i].getValues();
			forms[i].setJsonSubmit(originalJsonSubmit);
			hashName = forms[i].getHashName();
			
			// Check if we are building an array of json value submits
			if (hashName.length) {
				
				// Make the array to store encoded objects for this hash name
				if (values[hashName] == null) {
					values[hashName] = [];
				}
				
				// Push this form's data onto the array for this hash name
				values[hashName].push(formValues);
			}
			else {
				values = Ext.apply(values, formValues);
			}
		}
		for (hashName in values) {
			if (Ext.isArray(values[hashName]) || Ext.isObject(values[hashName])) {
				values[hashName] = Ext.encode(values[hashName]);
			}
		}
		
		return values;
	}
	
});