Ext.define('Jacada.user.ui.cti.TasksActionBar', {
	    extend: 'Ext.panel.Panel',
	    
	    itemId: 'tasksActionBar',
	    height: '100%',
		border: false,
		layout: {
			type: 'hbox',
			align: 'middle'
		},
		defaults:{
			margin: '0 5 0 0',
			xtype:'button',
			ui: 'default-toolbar',//give it a toolbar button style
			scale: 'medium',
			iconAlign: 'top',
			cls: 'cti-btn'
		},
		
		items: [
		{			  
			iconCls: 'saveTask24Icon',
			itemId: 'save',
			text: $W().localeManager.getLocalizationValue('application.javascript.tasks.save'),
			handler: function(){
				var taskInfoTab = Ext.getCmp('contextContentPanel').getTab(
						'TaskInfoTab' + $W().activeContext.groupId, 
						$W().activeContext.groupId);
				if(taskInfoTab){
					taskInfoTab.items.items[0].child().submitTaskOutput();
				}else{
					Jacada.Logger.error("could not find TaskInfoTab to save output. activeContext.groupId:" + $W().activeContext.groupId);
				}
			}
		},
		{			  
			iconCls: 'complete24Icon',
			itemId: 'complete',
			text: $W().localeManager.getLocalizationValue('application.javascript.tasks.complete'),
			handler: function(){
				var result = Ext.getCmp('taskBoard').completeTask($W().activeContext.task.id);
				if(result){
					Ext.getCmp('contextNavigation').removeTaskContextGroupNode($W().activeContext.task.id);
				}
			}
		},
		{			  
			iconCls: 'closeIcon',
			text: $W().localeManager.getLocalizationValue('application.javascript.tasks.close'),
			handler: function(){
				Ext.getCmp('contextNavigation').removeTaskContextGroupNode($W().activeContext.task.id);
			}
		}
		],
		listeners:{
			refreshActionBar: function(actionBar, eOpts){
				this.getComponent('complete').setDisabled(!Ext.getCmp('taskBoard').allowComplete($W().activeContext.task));
				this.getComponent('save').setDisabled(!Ext.getCmp('taskBoard').allowEdit($W().activeContext.task));
			}
		}
	});    