Ext.define('Lapidos.audio.model.channel.Multi', {
	extend: 'Lapidos.audio.model.Channel',
	
	play: function() {
		var audio = this.callParent(arguments);
		
		this.enqueue(audio);
		audio.play();
		
		return audio;
	}
	
});