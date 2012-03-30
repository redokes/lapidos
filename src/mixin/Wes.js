Ext.define('Lapidos.mixin.Wes', {
	extend: 'Ext.util.Observable',
	requires: [
		'Lapidos.mixin.Event'
	],

	mixins: {
		testing: 'Lapidos.mixin.Event'
	},
	
	isCool: false,
	
	onCoolReady: function() {
		if (this.isCool) {
			return {
				params: [this, 'extra1', 'extra2']
			};
		}
	},
	
	onWesReady: function() {
		if (this.isCool) {
			return {
				params: [this, 'goats', 'yes']
			};
		}
		
		return {
			eventName: 'differentevent'
		};
	},
	
	coolStuff: function() {
		this.isCool = true;
		this.fireEvent('cool', 'one', 'two');
	},
	
	different: function() {
		this.isCool = true;
		this.fireEvent('differentevent', 'does', 'not', 'matter');
	}

});