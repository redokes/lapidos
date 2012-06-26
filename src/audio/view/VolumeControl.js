Ext.define('Lapidos.audio.view.VolumeControl', {
	extend: 'Ext.panel.Panel',
	config: {
		title: ' ',
		margin: 5,
		width: 150,
		bodyPadding: 10,
		icon: false,
		record: null,
		volume: 1
	},
	layout: {
		type: 'vbox',
		align: 'center'
	},
	defaultIcon: '/js/lapidos/src/audio/img/audio-32.png',
	
	constructor: function(config) {
		this.initConfig(config);
		this.callParent(arguments);
		
		if (this.getRecord()) {
			this.setVolume(this.getRecord().get('volume'));
		}
		
		this.init();
	},
	
	init: function() {
		this.initSlider();
		this.initMuteIcon();
		this.initListeners();
	},
	
	getSliderValue: function() {
		return this.getVolume() * 100;
	},
	
	setSliderValue: function(value) {
		this.slider.setValue(value * 100);
		this.setVolume(value);
	},
	
	initSlider: function() {
		this.slider = this.add(new Ext.slider.Single({
			vertical: true,
			value: this.getSliderValue(),
			minValue: 0,
			maxValue: 100,
			flex: 1,
			margin: '10 0',
			useTips: true,
			tipText: function(thumb){
				return Ext.String.format('{0}%', thumb.value);
			}
		}));
	},
	
	initMuteIcon: function() {
		this.muteIcon = this.add(new Ext.button.Button({
			scope: this,
			enableToggle: true,
			icon: '/js/lapidos/src/audio/img/audio-16.png',
			handler: this.onMuteIconClick
		}));
	},
	
	onMuteIconClick: function(button) {
		if (button.pressed) {
			console.log('Mute ' + this.getTitle());
			if (this.getRecord()) {
				this.getRecord().mute();
			}
		}
		else {
			console.log('Unmute '  + this.getTitle());
			if (this.getRecord()) {
				this.getRecord().unmute();
			}
		}
	},
	
	initListeners: function() {
		if (this.getRecord()) {
			this.slider.on('change', function(slider, newValue) {
				this.getRecord().setVolume(newValue);
			}, this);
			this.getRecord().on('volumechange', function(record, newVolume) {
				this.setSliderValue(newVolume);
			}, this);
		}
	}
	
});