Ext.define('Lapidos.shell.navigation.Store', {
	extend: 'Ext.data.Store',
	requires:[
		'Lapidos.shell.navigation.model.Item'
	],
	config: {
		os: null,
		model: 'Lapidos.shell.navigation.model.Item'
	},
	model: 'Lapidos.shell.navigation.model.Item',
	
	constructor: function(config){
		this.callParent(arguments);
		this.initConfig(config);
		
		this.getOs().getModuleManager().on('register', this.onModuleRegister, this);
	},
	
	lookupRecord: function(data) {
		var index = this.findBy(function(record) {
			if (record.get('path') == this.path && record.get('display') == this.display) {
				return true;
			}
			return false;
		}, data);
		if (index == -1) {
			return null;
		}
		else {
			return this.getAt(index);
		}
	},
	
	addModuleMenu: function(items, passedParent) {
		if (!Ext.isArray(items)) {
			items = [items];
		}
		
		var numItems = items.length;
		if (numItems == 0) {
			return;
		}
		for (var itemIndex = 0; itemIndex < numItems; itemIndex++) {
			// Get reference to the item in this iteration of the loop
			var item = items[itemIndex];
			
			// Get a reference to the parent object passed to this method
			var parent = passedParent;
			
			// Apply the scope if there is a handler
			if (item.handler) {
				// If no scope set, set it to the module
				if (!item.scope) {
					item.scope = item.module;
				}
			}
			
			// Generate the inherited path based on the parent
			var inheritedPath = false;
			if (parent) {
				if (parent.get('path') == '/') {
					inheritedPath = parent.get('path') + parent.get('display');
				}
				else {
					inheritedPath = parent.get('path') + '/' + parent.get('display');
				}
			}
			
			// Make sure items have a tags array
			if (!item.tags) {
				item.tags = [];
			}
			
			// Check if item has any tags
			if (!item.tags.length) {
				// Check if there is a parent to inherit tags from
				if (parent) {
					// Inherit parent tags because none were set
					item.tags = parent.get('tags')
				}
			}
			
			// Make sure all items have the * tag
			if (item.tags.indexOf('*') == -1) {
				item.tags.push('*');
			}
			
			// Set a default path for this item if it doesn't have one
			if (!item.path) {
				if (parent) {
					item.path = inheritedPath;
				}
				else {
					item.path = '/';
				}
			}
			else {
				if (item.path && parent && item.path != inheritedPath) {
					parent = null;
				}
			}
			
			var addedRecursively = false;
			
			// Check if we need to replace an existing nav item
			var existingRecord = this.lookupRecord({
				display: item.display,
				path: item.path
			});
			
			// If there is an existing record, overwrite the info and add to the tags
			if (existingRecord) {
				existingRecord.set({
					display: item.display,
					icon: item.module.icon,
					module: item.module,
					params: item.params,
					tags: Ext.apply(existingRecord.get('tags'), item.tags),
					scope: item.scope,
					handler: item.handler
				});
				existingRecord.commit();
			}
			else if (item.path != '/' && parent == null) {
				// Make sure parent items exist
				// Analyze path
				var pathParts = item.path.split('/');
				var numPathParts = pathParts.length;
				var lookupPath = '';
				var lookupPathArray = item.path.split('/');
				var lookupDisplay = '';
				
				for (var i = numPathParts; i > 0; i--) {
					lookupPathArray.pop();
					lookupPath = lookupPathArray.join('/');
					if (!lookupPath.length) {
						lookupPath = '/';
					}
					
					lookupDisplay = pathParts[i-1];
					if (lookupDisplay.length) {
						
						parent = this.lookupRecord({
							path: lookupPath,
							display: lookupDisplay
						});
						if (parent) {
							
						}
						else {
							// Need to add this parent through a recursive function
							this.addModuleMenu({
								display: lookupDisplay,
								path: lookupPath,
								items: [item],
								tags: item.tags,
								module: item.module
							});
							
							// Need to skip the rest of the processing
							addedRecursively = true;
						}
					}
				}
			}
			
			if (!addedRecursively) {
				if (!existingRecord) {
					// Add the item to the store
					var records = this.add(item);
					var record = records[0];
					record.set({
						items: []
					});
					existingRecord = record;
				}


				// Link to parent
				if (parent) {
					existingRecord.set({
						parent: parent
					});
					parent.get('items').push(existingRecord);
				}

				//Process children
				if (item.items != null && item.items.length) {
					this.addModuleMenu(item.items, existingRecord);
				}
			}
		}
		
		return;
	},
	
	onModuleRegister: function(manager, module) {
		var records = this.addModuleMenu(module.getMenu());
		this.fireEvent('addmodule', this, module, records);
	}
	
});