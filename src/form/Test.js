Ext.define('Lapidos.form.Test', {
	extend: 'Lapidos.form.Group',
	requires: [
		'Lapidos.form.Panel'
	],
	
	config: {
		url: '/ajax/contact/process/test',
		hashName: 'test_test'
	},
	
	init: function() {
		var form1 = new Lapidos.form.Panel({
			title: 'Form 1',
			hashName: 'form_one',
			items: [{
				xtype: 'fieldset',
				title: 'Contact Us',
				instructions: '(email address is optional)',
				items: [
					{
						xtype: 'textfield',
						name: 'name',
						fieldLabel: 'Name'
					},
					{
						xtype: 'textfield',
						name: 'email',
						fieldLabel: 'Email'
					},
					{
						xtype: 'textareafield',
						name: 'message',
						fieldLabel: 'Message'
					}
				]
			}]
		});
		
		var form2 = new Lapidos.form.Panel({
			title: 'Form 2',
			hashName: 'form_two',
			items: [{
				xtype: 'fieldset',
				title: 'Contact Us',
				instructions: '(email address is optional)',
				items: [
					{
						xtype: 'textfield',
						name: 'name',
						fieldLabel: 'Name'
					},
					{
						xtype: 'textfield',
						name: 'email',
						fieldLabel: 'Email'
					},
					{
						xtype: 'textareafield',
						name: 'message',
						fieldLabel: 'Message'
					}
				]
			}]
		});
		
		var form3 = new Lapidos.form.Panel({
			title: 'Form 2 clone',
			hashName: 'form_two',
			items: [{
				xtype: 'fieldset',
				title: 'Contact Us',
				instructions: '(email address is optional)',
				items: [
					{
						xtype: 'textfield',
						name: 'name',
						fieldLabel: 'Name'
					},
					{
						xtype: 'textfield',
						name: 'email',
						fieldLabel: 'Email'
					},
					{
						xtype: 'textareafield',
						name: 'message',
						fieldLabel: 'Message'
					}
				]
			}]
		});
		
		this.addForm(form1, form2, form3);
	}
	
});