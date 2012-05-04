/**
 * An audio channel is a group of sounds within an audio group. Some example
 * channels: background music, sound fx, notification sounds. Channels will be
 * assigned to an audio group which is all managed by the audio manager
 * 
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Lapidos.audio.Channel', {
	extend: 'Ext.util.Observable',
	
	///////////////////////////////////////////////////////////////////////////
	// Requires
	///////////////////////////////////////////////////////////////////////////
	requires:[
		'Lapidos.mixin.Event',
		'Lapidos.audio.model.Audio',
		'Lapidos.audio.model.Channel'
	],
	
	mixins: {
		event: 'Lapidos.mixin.Event'
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Properties
	///////////////////////////////////////////////////////////////////////////
	
	config: {
		store: null,
		name: '',
		group: null,
		mode: 'multi', // multi, single
		activeAudio: null,
		playQueue: [],
		crossfade: false,
		crossfadeDuration: 0
	},
	
	///////////////////////////////////////////////////////////////////////////
	// Inits
	///////////////////////////////////////////////////////////////////////////
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.init();
	},
	
	init: function() {
		this.initStore();
	},
	
	initStore: function() {
		this.setStore(new Ext.data.Store({
			model: 'Lapidos.audio.model.Audio'
		}));
	},
	
	load: function(files) {
		return;
		if (!Ext.isArray(files)) {
			files = [files];
		}
		var numFiles = files.length;
		for (var i = 0; i < numFiles; i++) {
			var audio = this.createAudio(files[i]);
			this.addAudio(audio);
		}
	},
	
	addAudio: function(audio) {
		var records = this.getStore().add({
			id: audio.dom.id,
			src: audio.dom.src,
			fileName: audio.fileName,
			instance: audio,
			isLoading: true,
			isLoaded: false
		});
		var record = records[0];
		record.on('finish', function(record) {
			this.getStore().remove(record);
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
	
	play: function(src, options) {
		var defaultOptions = {
			enqueue: false
		};
		options = options || {};
		options = Ext.apply(defaultOptions, options);
		
		var audio;
		if (typeof src == 'string') {
			audio = new Lapidos.audio.Audio({
				src: src
			});
		}
		else {
			audio = src;
		}
		
		if (this.getMode() == 'multi') {
			if (this.getActiveAudio() && options.enqueue) {
				this.playQueue.push(audio);
			}
			else {
				this.startPlaying(audio);
			}
		}
		else {
			if (this.getActiveAudio()) {
				this.getActiveAudio().stop();
			}
			this.startPlaying(audio);
		}
	},
	
	startPlaying: function(audio) {
		this.setActiveAudio(audio);
		this.getActiveAudio().on('timeupdate', this.onTimeUpdate, this);
		this.getActiveAudio().play();
		this.fireEvent('changeaudio', this, audio);
	},
	
	onTimeUpdate: function(audio) {
		// Check if channel is in multi audio mode
		// Check if we need to cross fade
		// Check if the cross fade duration + 1 second is greater than the remaining time of the playing audio
		if (this.getMode() == 'multi' && this.getCrossfade() && this.getCrossfadeDuration() + 500 > audio.getRemainingTime() * 1000) {
			// Unregister the time update event
			audio.un('timeupdate', this.onTimeUpdate, this);
			
			// Start a fast interval to check the current time so we can hit the cross fade change more closely
			this.fastInterval = setInterval(function() {
				if (this.getCrossfadeDuration() >= audio.getRemainingTime() * 1000) {
					clearInterval(this.fastInterval);
					this.playNext(); 	
				}
			}.bind(this), 5);
		}
	},
	
	seek: function(offset) {
		this.getActiveAudio().seek(offset);
	},
	
	pause: function() {
		if (this.getActiveAudio()) {
			this.getActiveAudio().dom.pause();
		}
	},
	
	togglePause: function() {
		var activeAudio = this.getActiveAudio();
		if (activeAudio) {
			if (activeAudio.dom.paused) {
				activeAudio.dom.play();
			}
			else {
				activeAudio.dom.pause();
			}
		}
	},
	
	playNext: function() {
		if (this.playQueue.length) {
			this.startPlaying(this.playQueue[0]);
			this.playQueue.splice(0, 1);
		}
	},
	
	// playAudio: function(audio) {
		// audio.dom.play();
		// this.fireEvent('play', audio);
	// },
// 	
	// createAudio: function(src, options) {
		// return;
		// el.on('ended', function(e, el) {
			// console.log('ended');
			// var record = this.getStore().findRecord('id', el.id)
			// console.log(record);
			// this.getStore().remove(record);
		// }, this);
// 		
		// return el;
	// },
	
});