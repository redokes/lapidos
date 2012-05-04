/**
 * The Audio class wraps the html5 audio object and adds other special functionality
 * like fading effects
 * 
 * @constructor
 * @param {Object} config The config object
 */

Ext.define('Lapidos.audio.model.Audio', {
	extend: 'Ext.data.Model',
	
	fadeStartTime: 0,
	fadeStopTime: 0,
	fadeStartVolume: 0,
	fadeStopVolume: 0,
	fadeCurrentTime: 0,
	fadeInterval: 0,
	
	fields:[{
		name: 'url',
		type: 'string'
	},{
		name: 'file'
	},{
		name:'name',
		type:'string'
	},{
		name:'size',
		type:'integer'
	},{
		name:'type',
		type:'string'
	},{
		name:'path',
		type:'string'
	},{
		name:'title',
		type:'string'
	},{
		name:'artist',
		type:'string'
	},{
		name:'album',
		type:'string'
	},{
		name:'year',
		type:'string'
	},{
		name:'track',
		type:'string'
	},{
		name: 'preload',
		type: 'string',
		defaultValue: 'auto'
	},{
		name: 'el',
		defaultValue: null
	},{
		name: 'fadeDuration',
		type: 'number',
		defaultValue: 0
	},{
		name: 'src',
		type: 'string'
	}, {
		name: 'isLoading',
		defaultValue: false
	}, {
		name: 'isLoaded',
		defaultValue: false
	}],
	
	proxy:{
		type:'memory',
		reader:{
			type:'json',
			root:'records'
		}
	},
	
	playing: false,
	paused: false,
	
	// TODO: remove these wrappers
	getEl: function() {
		return this.get('el')
	},
	setEl: function(el) {
		this.set('el', el)
	},
	getSrc: function() {
		return this.get('src')
	},
	setSrc: function(src) {
		console.log('set src method');
		if (!this.get('el')) {
			this.initEl();
			this.initListeners();
		}
		this.getEl().dom.src = src;
	},
	getPreload: function() {
		return this.get('preload')
	},
	
	constructor: function() {
		this.callParent(arguments);
	},
	
	initEl: function() {
		var options = {
			tag: 'audio',
			src: this.getSrc(),
			preload: this.getPreload()
		};
		this.setEl(Ext.get(Ext.DomHelper.createDom(options)));
		this.getEl().hide();
		Ext.getBody().appendChild(this.getEl());
	},
	
	initListeners: function() {
		this.getEl().on('progress', function() {
			this.fireEvent('progress', this, arguments)
		}, this);
		
		this.getEl().on('timeupdate', function() {
			this.fireEvent('timeupdate', this, arguments);
		}, this);
		
		this.getEl().on('ended', function() {
			this.fireEvent('ended', this, arguments);
		}, this);
	},
	
	setPlayedPercent: function(percent) {
		this.getEl().dom.currentTime = this.getEl().dom.duration * percent;
	},
	
	getPlayedPercent: function() {
		return this.getEl().dom.currentTime / this.getEl().dom.duration;
	},
	
	getRemainingTime: function() {
		return this.getDuration() - this.getCurrentTime();
	},
	
	getCurrentTime: function() {
		return this.getEl().dom.currentTime;
	},
	
	getDuration: function() {
		return this.getEl().dom.duration;
	},
	
	pause: function() {
		this.paused = true;
		this.getEl().dom.pause();
		this.fireEvent('pause', this);
		return;
		if (this.getFadeDuration()) {
			this.fade(this.getFadeDuration());
		}
		else {
			this.getEl().dom.pause();
		}
	},
	
	togglePause: function() {
		var dom = this.getEl().dom;
		if (dom.paused) {
			dom.play();
		}
		else {
			dom.pause();
		}
	},
	
	play: function() {
		this.playing = true;
		this.getEl().dom.play();
	},
	
	stop: function() {
		this.playing = false;
		this.paused = false;
		if (this.getEl()) {
			this.getEl().dom.pause();
		}
	},
	
	getVolume: function() {
		return this.getEl().dom.volume;
	},
	
	setVolume: function(volume) {
		this.getEl().dom.volume = volume;
	},
	
	preload: function() {
		
	},
	
	seek: function(offset) {
		if (offset < 0) {
			offset = this.getEl().dom.duration - offset;
		}
		if (offset > 0 && offset < this.getEl().dom.duration) {
			this.getEl().dom.currentTime = offset;
		}
	},
	
	fade: function(volume, duration) {
		this.setFadeDuration(duration || this.getFadeDuration());
		
		this.fadeStartTime = (new Date()).getTime();
		this.fadeStopTime = this.fadeStartTime + this.getFadeDuration();
		this.fadeStartVolume = this.getVolume();
		this.fadeStopVolume = volume;
		this.fadeCurrentTime = this.fadeStartTime;
		this.fadeInterval = setInterval(function() {
			this.fadeCurrentTime = (new Date()).getTime();
			if ((new Date()).getTime() > this.fadeStopTime) {
				this.setVolume(this.fadeStopVolume);
				clearInterval(this.fadeInterval);
				this.fireEvent('fadefinish', this);
			}
			else {
				var percent = (this.fadeCurrentTime - this.fadeStartTime) / this.fadeDuration;
				var newVolume = this.fadeStartVolume - (this.fadeStartVolume - this.fadeStopVolume) * percent;
				this.setVolume(newVolume);
			}
		}.bind(this), 50);
	},
	
	isPlaying: function(){
		return this.playing;
	},
	
	isPaused: function(){
		return this.paused;
	}
});