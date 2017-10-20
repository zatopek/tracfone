Ext.define('Jacada.system.ui.tasks.PotentialOwnersGrid', {
    extend: 'Ext.grid.Panel',

    itemId: 'potentialOwnersGrid',
    taskId: null,
    border: false,
    autoScroll: true,
    hideHeaders: true,
    forceFit: true,
    columns: [
              { 
            	  text: 'The header is hidden',
            	  dataIndex: 'userid',
            	  renderer: function(value, metaData, record, row, col, store, gridView){
            		  return record.data.displayName;
            	  }
              }
          ],
    viewConfig: {
        listeners: {
            itemdblclick: function(dataview, record, item, index, e) {
            	var grid = dataview.up();
            	grid.assignTask();
            }
        }
    },
    updateActionState: function(record){
    	var toolbar = this.getDockedItems('toolbar[dock="bottom"]')[0];
    	if(!record || this.getSelectionModel().getSelection().length == 0){
    		toolbar.getComponent('ok').setDisabled(true);
    	}else{
    		toolbar.getComponent('ok').setDisabled(false);
    	}
    },
    assignTask: function(){
    	var selection = this.getView().getSelectionModel().getSelection()[0];
        if (selection) {
        	var me = this;
        	Ext.Ajax.request({
        	    url: $W().contextPath + '/HTManager.json',
        		disableCaching: true,
        		params: {method: 'delegate', taskId: me.taskId, user:selection.data.userid },
        	    success: function(response, opts) {
        	    	//close parent window
        	    	me.up().close();
        	    },
        	    failure: function(response, opts) {
        	    	var msg = 'Your request cannot be processed at this time.\nPlease refresh your task list.';
        	    	try{
        	    		msg = Ext.decode(response.responseText).error;
        	    	}catch(e){
        	    		//do nothing
        	    	}
        	    	alert(msg);
        	    }
        	});
        }
    },
    initComponent: function () {
    	var me = this;
    	//model
    	Ext.define('PotentialOwner', {
    	     extend: 'Ext.data.Model',
    	     fields: [{name: 'userid'}, {name: 'displayName'}]
    	 });
    	//store
    	 var usersStore = Ext.create('Ext.data.Store', {
    	     model: 'PotentialOwner',
    	     proxy: {
    	         type: 'ajax',
    	         url: $W().contextPath + '/HTManager.json?method=getPotentialTaskDelegatees&taskId='+this.taskId,
    	         reader: {
    	             type: 'json',
    	             root: 'results',
	                 totalProperty: 'totalCount',
	                 idProperty: 'userid'
    	         }
    	     },
    	     autoLoad: true
    	 });
    	 
    	 Ext.applyIf(me, {
        	 store: usersStore,
        	 listeners: {
    		    select: function(selModel, record, index, options){
    		        me.updateActionState(record.data);
    		    },
    		    deselect: function(selModel, record, index, options){
    		        me.updateActionState();//call with empty record
    		    }
        	 },
        	 dockedItems: [{
                 dock: 'top',
                 xtype: 'toolbar',
                 itemId: 'toolbar',
                 ui: 'footer',//give the button a look of a button with frame
                 items: [{
                     xtype: 'textfield',
                     itemId: 'searchField',
                     enableKeyEvents: true,
                     flex: 1,
                     listeners:{
                    	 keypress: function(tf, e, eOpts){
                     		if(e.getKey() == e.ENTER){
                     			 me.filterUsers();
                     		}
                     	}
                     }
                 },{
                	 xtype: 'button', 
                     text:  getLocalizedValue('search'),
                     handler: function() {
                    	 me.filterUsers();
                     }
                 }]
             }],
        	 buttons: [
     	              { text: getLocalizedValue('ok'), width: '100px', itemId: 'ok', disabled:true, style: 'margin:2px', handler: function(){me.assignTask()} },
     	              { text: getLocalizedValue('cancel'),width: '100px', itemId: 'cancel', style: 'margin:2px',  handler: function(){me.up().close();}}
     	            ]
         }); 
        this.callParent();
    },
    filterUsers: function(){
    	this.setLoading(true);
    	var toolbar = this.getComponent('toolbar');
    	var tf = toolbar.getComponent('searchField');
    	var newValue = tf.getRawValue();
    	this.store.filterBy(function(record, id){
			 if(!newValue || newValue.trim().length == 0){
				 return true;
			 }
			 return record.data.displayName.indexOf(newValue.trim())>=0;
		 });
    	this.setLoading(false);
    }
});

function getLocalizedValue(key){
	return $W().localeManager.getLocalizationValue('application.javascript.tasks.assign.'+key);
}
