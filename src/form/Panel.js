Ext.define('Lapidos.form.Panel', {
	alias: 'widget.lapidosform',
	extend: 'Ext.form.Panel',
	requires: [
		'Lapidos.form.Button'
	],
	
	config: {
		url: '',
		hashName: '',
		jsonSubmit: true,
		extraParams: {},
		submitText: 'Submit',
		
		autoCreateSubmit: true,
		submitButtonDock: 'bottom',
		dockSubmit: true,
		submitUi: 'confirm'
	},
	
	constructor: function() {
		this.callParent(arguments);
		
		if (this.getAutoCreateSubmit()) {
			var config = {
				scope: this,
				text: this.getSubmitText(),
				ui: this.getSubmitUi(),
				handler: this.handleSubmitButton,
				flex: 1,
				docked: this.getSubmitButtonDock(),
				margin: 20
			};
			this.add(this.createSubmitButton(config));
		}
	},
	
	createSubmitButton: function(config) {
		return new Lapidos.form.Button(config);
	},
	
	handleSubmitButton: function(button) {
		this.submit({
			scope: this,
			url: this.getUrl(),
			method: 'post',
			success: this.onSuccess,
			failure: this.onFailure,
			waitMsg: {
				message: 'Submitting',
				cls: 'needaclass'
			},
			button: button
		});
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
		this.submitParams = submitParams;
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
					
					if (!this.overlay) {
						this.overlay = Ext.Viewport.add(new Ext.panel.Panel({
							modal: true,
							hideOnMaskTap: true,
							showAnimation: {
								type: 'popIn',
								duration: 250,
								easing: 'ease-out'
							},
							hideAnimation: {
								type: 'popOut',
								duration: 250,
								easing: 'ease-out'
							},
							centered: true,
							width: '60%',
							height: '50%',
							styleHtmlContent: true,
							html: errorStr,
							items: [{
								docked: 'top',
								xtype : 'toolbar',
								title : 'Errors'
							}],
							scrollable: true
						}));
					}
					else {
						this.overlay.setHtml(errorStr);
					}
					this.overlay.show();
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