Ext.define('Lapidos.os.model.Os', {
	extend: 'Ext.data.Model',
	
	config: {
		fields: [{
				name: 'instance',
				type: 'object'
			}, {
				name: 'title',
				type: 'string'
			}, {
				name: 'name',
				type: 'string'
			}, {
				name: 'icon',
				type: 'string'
			}
		],
		proxy: {
			type: 'memory'
		}
	},
	
	fields: [{
			name: 'instance',
			type: 'object'
		}, {
			name: 'title',
			type: 'string'
		}, {
			name: 'name',
			type: 'string'
		}, {
			name: 'icon',
			type: 'string'
		}
	],
	proxy: {
		type: 'memory'
	}
});