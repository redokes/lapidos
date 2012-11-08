Ext.define('Lapidos.audio.module.Chart', {
	extend: 'Lapidos.module.Viewable',
	
	requires: [
		
	],
	
	config: {
		name: 'chart',
		title: 'Chart',
//		icon: '/js/lapidos/src/audio/img/audio-32.png',
		services: [
			
		],
		menu: [{
			display: 'Chart'
		}],
		viewConfig: {
			home: {
				cls: 'Ext.Container',
				config: {
					layout: 'fit',
					title: 'Test'
				}
			}
		},
		groupBy: 'month'
	},
	
	getFields: function() {
		var groupNames = ['date_display', 'year', 'month', 'day', 'hour', 'minute', 'second'];
		var fields = [];
		for (var i = 0; i < groupNames.length; i++) {
			fields.push(groupNames[i]);
			if (groupNames[i] == this.groupBy) {
				break;
			}
		}
		for (var i = 0; i < 30; i++) {
			fields.push('user__' + i);
		}
		return fields;
	},
	
	getSeries: function(legendMap, records) {
		var series = [];
		
		for (var key in legendMap) {
			series.push({
				type: 'line',
				smooth: true,
				highlight: {
					size: 7,
					radius: 7
				},
				axis: 'left',
				title: legendMap[key],
				xField: 'date_display',
				yField: key,
				markerConfig: {
					type: 'cross',
					size: 4,
					radius: 4,
					'stroke-width': 0
				}
			});
		}
		
		return series;
	},
	
	createChart: function(record) {
		var legendMap = record.get('legend_map');
		var records = record.get('records');
		var xAxisLabel = record.get('x_label');
		var yAxisLabel = record.get('y_label');
		
		this.chartStore = Ext.create('Ext.data.Store', {
			fields: this.getFields(),
			data: records
		});
		if (this.chart) {
			this.chart.destroy();
		}
		this.chart = this.chart = Ext.create('Ext.chart.Chart', {
			xtype: 'chart',
			style: 'background:#fff',
			animate: true,
			store: this.chartStore,
			shadow: true,
			theme: 'Category1',
			legend: {
				position: 'right'
			},
			axes: [{
				type: 'Numeric',
				minimum: 0,
				position: 'left',
				fields: this.getFields(),
				title: yAxisLabel,
				minorTickSteps: 1,
				grid: {
					odd: {
						opacity: 1,
						fill: '#ddd',
						stroke: '#bbb',
						'stroke-width': 0.5
					}
				}
			}, {
				type: 'Category',
				position: 'bottom',
				fields: ['date_display'],
				title: xAxisLabel
			}],
			series: this.getSeries(legendMap, records)
		});
		this.chartPanel.add(this.chart);
	},
	
	init: function() {
		this.chartInfoStore = Ext.create('Ext.data.Store', {
			fields: [
				'legend_map',
				'records',
				'x_label',
				'y_label',
			],
			proxy: {
				type: 'ajax',
				url: 'http://127.0.0.1:8000/colonic/ticket-stats/read?date_range=year'
			}
		});
		this.chartInfoStore.on('load', function(store, records) {
			this.createChart(records[0])
		}, this);
	},
	
	showViewHome: function(module, view, params) {
		if (this.chartPanel) {
			return;
		}
		
		this.chartPanel = Ext.create('Ext.panel.Panel', {
			minHeight: 400,
			minWidth: 550,
			hidden: false,
			title: 'Line Chart',
			layout: 'fit',
			tbar: [{
				scope: this,
				text: 'Save Chart',
				handler: function() {
					Ext.MessageBox.confirm('Confirm Download', 'Would you like to download the chart as an image?', function(choice){
						if(choice == 'yes'){
							this.chart.save({
								type: 'image/png'
							});
						}
					});
				}
			}, {
				text: 'Reload Data',
				scope: this,
				handler: function() {
					this.chartInfoStore.load();
				}
			}, {
				text: 'Month',
				scope: this,
				handler: function() {
					this.groupBy = 'month'
					this.chartInfoStore.load();
				}
			}, {
				text: 'Day',
				scope: this,
				handler: function() {
					this.groupBy = 'month'
					this.chartInfoStore.load();
				}
			}]
		});
		view.add(this.chartPanel);
		this.chartInfoStore.load();
    }
	
});
