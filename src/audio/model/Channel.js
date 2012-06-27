Ext.define('Lapidos.audio.model.Channel', {
	extend: 'Ext.data.Model',
	requires: [
		'Lapidos.mixin.Event',
		'Lapidos.audio.model.Audio'
	],
	mixins: {
		event: 'Lapidos.mixin.Event'
	},
	
	fields: [{
		name: 'name',
		type: 'string'
	},{
		name: 'title',
		type: 'string'
	},{
		name: 'icon',
		type: 'string'
	},{
		name: 'volume',
		defaultValue: 1
	},{
		name: 'relativeVolume',
		defaultValue: 1
	},{
		name: 'realVolume',
		defaultValue: 1
	}],

	proxy: {
		type: 'memory'
	},
	
	config: {
		audioStore: null,
		currentIndex: 0
	},
	
	oldVolume: 1,
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.init();
	},
	
	init: function() {
		this.initAudioStore();
	},
	
	getCurrentAudio: function() {
		return this.getAudioStore().getAt(this.getCurrentIndex());
	},
	
	initAudioStore: function() {
		this.setAudioStore(new Ext.data.Store({
			model: 'Lapidos.audio.model.Audio'
		}));
	},
	
	addAudio: function(audio) {
		var record = new Lapidos.audio.model.Audio({
			id: audio.dom.id,
			src: audio.dom.src,
			fileName: audio.fileName,
			instance: audio,
			isLoading: true,
			isLoaded: false
		});
		this.getAudioStore().add(record);
		
		record.on('finish', function(record) {
			this.getAudioStore().remove(record);
		}, this);
	},
	
	/**
	 * currentTime
	 * duration
	 * pause()
	 * paused
	 * play()
	 * currentSrc
	 * loop
	 * 
	 */
	
	killAll: function() {
		var items = this.getAudioItems();
		var numItems = items.length;
		for (var i = 0; i < numItems; i++) {
			items[i].stop();
			this.getAudioStore().remove(items[i]);
		}
	},
	
	play: function(audio) {
		var currentAudio = this.getCurrentAudio();
		if (audio == null && currentAudio) {
			currentAudio.play();
			return currentAudio;
		}
		audio = audio || this.getCurrentAudio();
		if (typeof(audio) == 'string') {
			audio = new Lapidos.audio.model.Audio({
				src: audio
			});
		}
		
		return audio;
	},
	
	enqueue: function(audio) {
		// Add to store if not added
		if (this.getAudioStore().indexOf(audio) == -1) {
			this.getAudioStore().add(audio);
		}
	},
	
	stop: function() {
		if (this.getCurrentAudio()) {
			this.getCurrentAudio().stop();
		}
	},
	
	seek: function(offset) {
		this.getCurrentAudio().seek(offset);
	},
	
	pause: function() {
		var audioItems = this.getAudioItems();
		var numAudioItems = audioItems.length;
		for (var i = 0; i < numAudioItems; i++) {
			audioItems[i].pause()
		}
	},
	
	togglePause: function() {
		
	},
	
	getAudioItems: function() {
		return this.getAudioStore().data.items;
	},
	
	setVolume: function(volume) {
		if (volume > 1 && volume <= 100) {
			volume /= 100;
		}
		
		this.set('volume', volume);
		
		if (volume > 0) {
			this.oldVolume = this.get('volume');
		}
		
		this.setRealVolume(this.get('volume') * this.get('relativeVolume'));
		
		this.fireEvent('volumechange', this, volume);
	},
	
	setRelativeVolume: function(volume) {
		if (volume > 1 && volume <= 100) {
			volume /= 100;
		}
		this.set('relativeVolume', volume);
		this.setRealVolume(this.get('volume') * this.get('relativeVolume'));
	},
	
	setRealVolume: function(volume) {
		if (volume > 1 && volume <= 100) {
			volume /= 100;
		}
		this.set('realVolume', volume);
		
		var audioItems = this.getAudioItems();
		var numAudioItems = audioItems.length;
		for (var i = 0; i < numAudioItems; i++) {
			audioItems[i].setRelativeVolume(this.get('realVolume'));
		}
	},
	
	mute: function() {
		this.setVolume(0);
	},
	
	unmute: function() {
		this.setVolume(this.oldVolume);
	}
});