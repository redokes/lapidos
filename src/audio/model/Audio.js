/**
 * The Audio class wraps the html5 audio object and adds other special functionality
 * like fading effects
 * 
 * @constructor
 * @param {Object} config The config object
 */

Ext.define('Lapidos.audio.model.Audio', {
	extend: 'Ext.data.Model',
	
	config: {
		src: null,
		preload: 'auto',
		el: null,
		playedPercent: 0,
		fadeDuration: 0,
	},
	
	fadeStartTime: 0,
	fadeStopTime: 0,
	fadeStartVolume: 0,
	fadeStopVolume: 0,
	fadeCurrentTime: 0,
	fadeInterval: 0,
	
	fields: [
		'id',
		'src',
		'fileName',
		'instance',
		'isLoaded',
		'isLoading'
	],
	proxy: {
		type: 'memory'
	},
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		this.init();
	},
	
	init: function() {
		this.initEl();
		this.initListeners();
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
			this.setPlayedPercent(this.getEl().dom.currentTime / this.getEl().dom.duration);
			this.fireEvent('timeupdate', this, arguments);
		}, this);
		
		this.getEl().on('ended', function() {
			this.fireEvent('ended', this, arguments);
		}, this);
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
		this.getEl().dom.play();
	},
	
	stop: function() {
		this.getEl().dom.pause();
	},
	
	getVolume: function() {
		return this.getEl().dom.volume;
	},
	
	setVolume: function(volume) {
		this.getEl().dom.volume = volume;
	},
	
	seek: function(offset) {
		if (offset < 0) {
			this.el.dom.currentTime = this.el.dom.duration + offset;
		}
		else if (offset > 0 && offset > this.el.dom.duration) {
			this.el.dom.currentTime = offset;
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
	}
});