Ext.define('Lapidos.audio.model.channel.Queued', {
	extend: 'Lapidos.audio.model.Channel',
	
	config: {
		crossfade: false,
		crossfadeDuration: 0
	},
	
	playNext: function() {
		console.log('Play next');
		return this.play(this.getAudioStore().getAt(this.getNextIndex()), true);
	},
	
	getNextIndex: function() {
		var numRecords = this.getAudioItems().length;
		return (this.getCurrentIndex() + 1) % numRecords;
	},
	
	getNumAudioItems: function() {
		return this.getAudioStore().data.items.length;
	},
	
	play: function(audio, now) {
		audio = this.callParent(arguments);
		
		this.enqueue(audio);
		
		// Check if we need to play now
		if (now != null || this.getNumAudioItems() == 1) {
			if (this.getNumAudioItems() >= 1) {
				this.getCurrentAudio().stop();
			}
			audio.play();
			this.setCurrentIndex(this.getAudioStore().indexOf(audio));
		}
		
		return audio;
	},
	
//	startPlaying: function(audio) {
//		var oldAudio = this.getActiveAudio();
//		this.setActiveAudio(audio);
//		this.getActiveAudio().on('timeupdate', this.onTimeUpdate, this);
//		this.getActiveAudio().play();
//		this.fireEvent('changeaudio', this, audio, oldAudio);
//	},
	
//	onTimeUpdate: function(audio) {
//		// Check if we need to cross fade
//		// Check if the cross fade duration + 1 second is greater than the remaining time of the playing audio
//		if (this.getCrossfade() && this.getCrossfadeDuration() + 500 > audio.getRemainingTime() * 1000) {
//			// Unregister the time update event
//			audio.un('timeupdate', this.onTimeUpdate, this);
//			
//			// Start a fast interval to check the current time so we can hit the cross fade change more closely
//			this.fastInterval = setInterval(function() {
//				if (this.getCrossfadeDuration() >= audio.getRemainingTime() * 1000) {
//					clearInterval(this.fastInterval);
//					this.playNext(); 	
//				}
//			}.bind(this), 5);
//		}
//	},
	
});