Ext.define('Lapidos.shell.panel.Navigation', {
    extend: 'Ext.panel.Panel',
	config: {
		views: [],
		rootView: null,
		activeView: null,
		navButtons: [],
		navDrawMethod: null,
		navType: 'default' // default, breadcrumb
	},
	layout: 'card',
	title: '&nbsp;',
	
	constructor: function(config) {
		this.callParent(arguments);
		this.initConfig(config);
		
		if (this.getNavDrawMethod() == null) {
			switch (this.navType) {
				case 'breadcrumb':
					this.setNavDrawMethod(this.drawNavBreadcrumb);
					break;
				default:
					this.setNavDrawMethod(this.drawNavDefault);
					break;
			}
			
		}
		
		this.on('afterrender', function() {
			var panel1 = new Ext.panel.Panel({
				title: 'View 1',
				html: 'This is view one'
			});

			var panel2 = new Ext.panel.Panel({
				title: 'View 2',
				html: 'This is view two'
			});

			var panel3 = new Ext.panel.Panel({
				title: 'View 3',
				html: 'This is view three'
			});

			var panel4 = new Ext.panel.Panel({
				title: 'View 4',
				html: 'This is view four'
			});
			
			window.panel1 = panel1;
			window.panel2 = panel2;
			window.panel3 = panel3;
			window.panel4 = panel4;
			this.pushView(panel1);
			this.pushView(panel2);
			this.pushView(panel3);
		}, this);
	},
	
	pushView: function(view, animated) {
		
		// Push this view on the view array
		this.views.push(view);
		
		// Set at the root view if this is the first view
		if (this.rootView == null) {
			this.setRootView(view);
		}
		
		// Set this view as the active view
		this.setActiveView(view);
		
		if (animated === true) {
			animated = 'left';
		}
		
		// Update the layout and title
		this.updateView(animated);
	},
	
	popView: function(animated) {
		// Do not pop the root view
		if (this.views.length <= 1) {
			return null;
		}
		
		var poppedView = this.views[this.views.length - 1];
		
		// Pop to the previous view
		this.popToView(this.views[this.views.length - 2], animated);
		
		return poppedView;
	},
	
	popToView: function(view, animated) {
		// Ignore this view if it isn't in the view array
		if (this.views.indexOf(view) == -1) {
			return;
		}
		
		// Iterate backwards from the active view
		while (this.getActiveView() != view) {
			
			// Pop the active view
			this.views.pop();
			
			// Set the active view to the previous view
			this.setActiveView(this.views[this.views.length - 1]);
		}
		
		if (animated === true) {
			animated = 'right';
		}
		
		// Update the layout and title
		this.updateView(animated);
	},
	
	setRootView: function(view) {
		// Pop to current root
		this.popToRootView();
		
		// Ignore if view is already rootView
		if (this.getRootView() == view) {
			return;
		}
		
		// Put new root at front of views array
		this.views.unshift(view);
		
		// Set new root
		this.rootView = view;
		
		// Pop to new root
		this.popToRootView();
		
	},
	
	popToRootView: function() {
		// Pop to the root view
		this.popToView(this.getRootView());
	},
	
	updateView: function(animated) {
		
		// Remember the current visible view
		var previousActiveView = this.getLayout().getActiveItem();
		
		// Tell the layout which view is active
		this.getLayout().setActiveItem(this.getActiveView());
		
		// Keep reference to current active view
		var currentActiveView = this.getLayout().getActiveItem();
		
		// Animate old view to the right
		if (animated != null) {
			
			if (animated == 'left') {
				currentActiveView.getEl().animate({
					duration: 500,
					from: {
						x: this.getWidth()
					},
					to: {
						x: currentActiveView.getEl().getAnchorXY()[0]
					},
					listeners: {
						beforeanimate:  function() {
							currentActiveView.originalStyles = currentActiveView.getEl().getStyles('position', 'left', 'top');
							previousActiveView.originalStyles = previousActiveView.getEl().getStyles('position', 'left', 'top', 'display');
							previousActiveView.show();
							previousActiveView.getEl().setStyle({
								position: 'absolute',
								left:0,
								top: 0
							});
							
						},
						afteranimate: function() {
							if (previousActiveView.originalStyles) {
								previousActiveView.getEl().setStyle(previousActiveView.originalStyles);
								delete previousActiveView.originalStyles;
							}
							
							if (currentActiveView.originalStyles) {
								currentActiveView.getEl().setStyle(currentActiveView.originalStyles);
								delete currentActiveView.originalStyles;
							}
						},
						scope: this
					}
				});
			}
			else if (animated == 'right') {
				previousActiveView.getEl().animate({
					duration: 500,
					from: {
						x: this.getActiveView().getEl().getAnchorXY()[0]
					},
					to: {
						x: this.getWidth()
					},
					listeners: {
						beforeanimate:  function() {
							previousActiveView.originalStyles = previousActiveView.getEl().getStyles('position', 'left', 'top', 'display');
							previousActiveView.show();
							previousActiveView.getEl().setStyle({
								position: 'absolute',
								left:0,
								top: 0
							});
						},
						afteranimate: function() {
							previousActiveView.getEl().setStyle(previousActiveView.originalStyles);
						},
						scope: this
					}
				});
			}
		}
		
		// Remove current items from the title bar
		var header = this.getHeader();
		header.removeAll();
		
		this.navDrawMethod(this, header);
	},
	
	drawNavDefault: function(nav, header) {
		
		// Create the left section
		var left = new Ext.container.Container({
			flex: 1,
			layout: {
				type: 'hbox',
				pack: 'start'
			}
		});
		
		// Make sure there is a previous view
		if (nav.views.length > 1) {
		
			// Add a button for previous item
			for (var i = nav.views.length - 2; i < nav.views.length-1; i++) {

				// Create a button with text of the view's title
				var button = new Ext.button.Button({
					text: '&lt; ' + nav.views[i].title
				});

				// Set a handler to pop to this view
				button.on('click', function(button, e, options) {
					this.popToView(options.relatedView, true);
				}, nav, {
					relatedView: nav.views[i]
				});

				// Add the button to the header
				left.add(button);
			}
		}
		
		// Create the center section
		var center = new Ext.container.Container({
			flex: 1,
			layout: {
				type: 'hbox',
				pack: 'center'
			}
		});
		
		if (this.getActiveView() != null) {
			// Add a button for the active view title
			var centerButton = new Ext.button.Button({
				text: nav.getActiveView().title
			});
			center.add(centerButton);
		}
		
		// Create the right section
		var right = new Ext.container.Container({
			flex: 1,
			layout: {
				type: 'hbox',
				pack: 'end'
			}
		});
		
		header.add(left, center, right);
	},
	
	drawNavBreadcrumb: function(nav, header) {
		// Create the left section
		var left = new Ext.container.Container({
			flex: 1,
			layout: {
				type: 'hbox',
				pack: 'start'
			}
		});
		
		// Make sure there is more than one item
		if (this.views.length > 1) {
			
			// Add a button for each nav item
			for (var i = 0; i < this.views.length - 1; i++) {

				// Create a button with text of the view's title
				var button = new Ext.button.Button({
					text: this.views[i].title
				});

				// Set a handler to pop to this view
				button.on('click', function(button, e, options) {
					this.popToView(options.relatedView);
				}, this, {
					relatedView: this.views[i]
				});

				// Add the button to the header
				left.add(button);
			}
		}
		
		// Create the center section
		var center = new Ext.container.Container({
			flex: 1,
			layout: {
				type: 'hbox',
				pack: 'center'
			}
		});
		
		if (this.getActiveView() != null) {
			// Add a button for the active view title
			var centerButton = new Ext.button.Button({
				text: nav.getActiveView().title
			});
			center.add(centerButton);
		}
		
		// Create the right section
		var right = new Ext.container.Container({
			flex: 1,
			layout: {
				type: 'hbox',
				pack: 'end'
			}
		});
		
		header.add(left, center, right);
	}
	
});