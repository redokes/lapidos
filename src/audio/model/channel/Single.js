Ext.define('Lapidos.audio.model.channel.Single', {
	extend: 'Lapidos.audio.model.Channel',
	
	play: function() {
		var audio = this.callParent(arguments);
		
		// Default is to play one at a time so kill any existing audio
		if (this.getAudioStore().indexOf(audio) == -1) {
			this.killAll();
			this.enqueue(audio);
		}
		audio.play();
		
		return audio;
	}
	
});