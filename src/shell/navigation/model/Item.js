Ext.define('Lapidos.shell.navigation.model.Item', {
	extend: 'Ext.data.Model',
	requires: ['Ext.data.SequentialIdGenerator'],
	idProperty: 'id',
	fields:[{
		name: 'id',
		convert: function(value, record){
			return Ext.id();
		}
	},{
		name: 'module'
	},{
		name: 'display'
	},{
		name: 'icon',
		defaultValue: ''
	},{
		name: 'params',
		defaultValue: {}
	},{
		name: 'items',
		defaultValue: []
	},{
		name: 'tags',
		defaultValue: []
	},{
		name: 'path',
		defaultValue: false
	},{
		name: 'parent',
		defaultValue: false
	},{
		name: 'scope',
		defaultValue: null
	},{
		name: 'handler',
		defaultValue: Ext.emptyFn
	}],

	config: {
		fields:[{
			name: 'id',
			convert: function(value, record){
				return Ext.id();
			}
		},{
			name: 'module'
		},{
			name: 'display'
		},{
			name: 'icon',
			defaultValue: ''
		},{
			name: 'params',
			defaultValue: {}
		},{
			name: 'items',
			defaultValue: []
		},{
			name: 'tags',
			defaultValue: []
		},{
			name: 'path',
			defaultValue: false
		},{
			name: 'parent',
			defaultValue: false
		},{
			name: 'scope',
			defaultValue: null
		},{
			name: 'handler',
			defaultValue: Ext.emptyFn
		}]
	}
	
});