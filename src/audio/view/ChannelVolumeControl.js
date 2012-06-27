Ext.define('Lapidos.audio.view.ChannelVolumeControl', {
	extend: 'Lapidos.audio.view.VolumeControl',
	requires: [
		'Lapidos.audio.view.VolumeControl'
	],
	config: {
		record: null
	},
	
	constructor: function(config) {
		this.initConfig(config);
		
		var record = this.getRecord();
		this.setTitle(record.get('name'));
		this.setIcon(record.get('icon'));
		
		this.callParent(arguments);
	},
	
	initButtons: function() {
		this.callParent(arguments);
		this.initPreviousButton();
		this.initPlayButton();
		this.initPauseButton();
		this.initNextButton();
	},
	
	initPreviousButton: function() {
		this.previousButton = this.buttonPanel.add(new Ext.button.Button({
			scope: this,
			text: '&lt;&lt;',
			handler: this.onPreviousButtonClick
		}));
	},
	
	initPlayButton: function() {
		this.playButton = this.buttonPanel.add(new Ext.button.Button({
			scope: this,
			text: '&gt;',
			handler: this.onPlayButtonClick
		}));
	},
	
	initPauseButton: function() {
		this.pauseButton = this.buttonPanel.add(new Ext.button.Button({
			scope: this,
			text: '||',
			handler: this.onPauseButtonClick
		}));
	},
	
	initNextButton: function() {
		this.nextButton = this.buttonPanel.add(new Ext.button.Button({
			scope: this,
			text: '&gt;&gt;',
			handler: this.onNextButtonClick
		}));
	},
	
	onPreviousButtonClick: function() {
		this.getRecord().playPrevious();
	},
	
	onPauseButtonClick: function() {
		this.getRecord().pause();
	},
	
	onPlayButtonClick: function() {
		this.getRecord().play();
	},
	
	onNextButtonClick: function() {
		this.getRecord().playNext();
	}
	
});