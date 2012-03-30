Ext.define('Lapidos.form.Panel', {
	alias: 'widget.lapidosform',
	extend: 'Ext.form.Panel',
	
	config: {
		url: '',
		hashName: '',
		jsonSubmit: true,
		extraParams: {},
		submitText: 'Submit'
	},
	
	constructor: function(config) {
//		if (this.items == null) {
//			this.initConfig(config);
//			this.dockedItems = [];
//		}
		this.callParent(arguments);
		this.initBottomBar();
		this.initSubmitButton();
	},
	
	initBottomBar: function() {
		this.bottomBar = Ext.create('Ext.toolbar.Toolbar', {
			docked: 'bottom',
			dock: 'bottom'
		});
		
		if (this.dockedItems == null) {
			this.add(this.bottomBar);
		}
		else {
			this.addDocked(this.bottomBar);
		}
	},
	
	initSubmitButton: function() {
		this.submitButton = Ext.create('Ext.button.Button', {
			scope: this,
			text: this.getSubmitText(),
			flex: 1,
			ui: 'confirm',
			handler: function() {
				this.submit({
					scope: this,
					url: this.getUrl(),
					method: 'post',
					success: this.onSuccess,
					failure: this.onFailure,
					waitMsg: {
						message: 'Submitting',
						cls: 'needaclass'
					}
				});
			}
		});
		this.bottomBar.add(this.submitButton);
	},
	
	/**
	 * Apply the passed object with the baseParams of the form
	 * @param {Object} params key value object 
	 */
	setParams: function(object) {
		Ext.apply(this.getExtraParams(), object);
	},
	
	setParam: function(key, value) {
		var param = {};
		param[key] = value;
		this.setParams(param);
	},
	
	getValues: function() {
		var values = this.callParent(arguments);
		values = Ext.apply(this.getExtraParams(), values);
		if (this.getJsonSubmit()) {
			var jsonValues = {};
			if (this.getHashName().length) {
				var encodedValues = Ext.encode(values);
				jsonValues[this.getHashName()] = encodedValues;
			}
			return jsonValues;
		}
		return values;
	},
	
	submit: function(submitParams) {
		if (this.rendered) {
			var values = this.getValues();
			if (!values) {
				return;
			}
			console.log(values);
			arguments[0] = {
				scope: this,
				url: this.getUrl(),
				params: values,
				success: function(form, result) {
					if (result.result != null) {
						result = result.result;
					}
					this.onSuccess(form, result);
					this.onSubmit(form, result);
					this.fireEvent('success', form, result);
					this.fireEvent('submit', form, result);
				},
				failure: function(form, result) {
					if (result.result != null) {
						result = result.result;
					}
					this.onFailure(form, result);
					this.onSubmit(form, result);
					this.fireEvent('failure', form, result);
					this.fireEvent('submit', form, result);
					var errors = result.errors;
					var errorStr = result.errorStr;
					
					var overlay = Ext.create('Ext.panel.Panel', {
						floating: true,
						modal: true,
						hidden: true,
						height: 300,
						width: '50%',
						html: errorStr,
						styleHtmlContent: true,
						scrollable: true,
						items: [{
							docked: 'top',
							xtype : 'toolbar',
							title : 'Errors'
						}]
					});
					overlay.showBy(this.submitButton);
					return;
					
					var errorsArray = [];
					for (var id in errors) {
						var errorValue = errors[id];
						if(Ext.isObject(errorValue)){
							errorsArray.push(errorValue);
						}
						else{
							errorsArray.push({
								id: id,
								msg: errorValue
							});
						}
					}
					if (this.getForm != null) {
						this.getForm().markInvalid(errorsArray);
					}
				}
			};
			this.callParent(arguments);
		}
		else {
			this.onCancelSubmit(this);
			this.fireEvent('cancelsubmit', this);
		}
	},
	
	onSubmit: Ext.emptyFn,
	onSuccess: Ext.emptyFn,
	onFailure: Ext.emptyFn,
	onCancelSubmit: Ext.emptyFn
	
});