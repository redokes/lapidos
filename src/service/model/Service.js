Ext.define('Lapidos.service.model.Service', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [{
			name: 'instance'
		},{
			name: 'cls',
			type: 'string'
		},{
			name: 'name',
			type: 'string',
			defaultValue: ''
		},{
			name: 'title',
			type: 'string',
			defaultValue: ''
		},{
			name: 'running',
			type: 'boolean',
			defaultValue: false
		}],
		proxy: {
			type: 'memory'
		}
	},
	
	fields: [{
		name: 'instance'
	},{
		name: 'cls',
		type: 'string'
	},{
		name: 'name',
		type: 'string',
		defaultValue: ''
	},{
		name: 'title',
		type: 'string',
		defaultValue: ''
	},{
		name: 'running',
		type: 'boolean',
		defaultValue: false
	}],
	proxy: {
		type: 'memory'
	}
});