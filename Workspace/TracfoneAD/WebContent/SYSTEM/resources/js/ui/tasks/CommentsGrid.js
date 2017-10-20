Ext.define('Jacada.system.ui.tasks.CommentsGrid', {
    extend: 'Ext.grid.Panel',

    itemId: 'commentsGrid',
    taskId: null,
    height: 250,
    autoScroll: true,
    minHeight: 250,
    border: false,
    viewConfig: {
        listeners: {
            itemdblclick: function(dataview, record, item, index, e) {
            	var grid = dataview.up();
            	if(grid.canEdit(record.data)){
            		grid.addComment(false, record.data.comment);
            	}
            }
        }
    },
    loadComments: function(taskId){
    	this.taskId = taskId;
    	this.store.load({params: {method: 'getComments', taskId: taskId}});
    	this.updateActionState();
    },
    commentAdded: function(comment){
    	if(this.taskId == comment.taskId){
    		this.loadComments(comment.taskId);
    	}
    },
    commentUpdated: function(comment){
    	if(this.taskId == comment.taskId){
    		this.loadComments(comment.taskId);
    	}
    },
    commentDeleted: function(taskId){
    	if(this.taskId == taskId){
    		this.loadComments(taskId);
    	}
    },
    updateActionState: function(){
    	var toolbar = this.getComponent('commentsToolbar');
    	if(this.getSelectionModel().getSelection().length == 0){
    		toolbar.getComponent('deleteComment').setDisabled(true);
    	}else{
    		var comment = this.getSelectionModel().getSelection()[0].data;
    		if(this.canEdit(comment)){
    			toolbar.getComponent('deleteComment').setDisabled(false);
    		}else{
    			toolbar.getComponent('deleteComment').setDisabled(true);
    		}
    	}
    },
    canEdit: function(comment){
    	if(comment){
    		var isSupervisor = $W().rapManager.isUserSupervisor();
    		//only owner or supervisor can edit/delete a comment
    		return  comment.addedBy == $W().agentName || isSupervisor;
    	}
    	return false;
    },
    //add or edit comment
    addComment: function(isNew, comment){
    	var me = this;
    	var commentId = -1;
    	if(!isNew){
    		commentId = me.getSelectedCommentId();
    	}
    	Ext.MessageBox.show({
            title: isNew? me.getLocalizedValue('add.title'):me.getLocalizedValue('edit.title'),
            msg: me.getLocalizedValue('edit.label'),
            width:300,
            buttons: Ext.MessageBox.OKCANCEL,
            multiline: true,
            value: isNew? '':comment,
            fn: function(btn, value){
            	if(btn == 'ok'){
            		Ext.Ajax.request({
                	    url: $W().contextPath + '/HTManager.json',
                		disableCaching: true,
                		params: {method: 'addOrUpdateComment', taskId: me.taskId, comment:value, commentId:commentId },
                	    failure: function(response, opts) {
                	    	alert('Your request cannot be processed at this time.\nPlease refresh your comment list.');
                	    }
                	});
            	}
            }
        });
    },
    deleteComment: function(commentId){
    	var me = this;
    	Ext.Ajax.request({
    	    url: $W().contextPath + '/HTManager.json',
    		disableCaching: true,
    		params: {method: 'deleteComment', taskId: me.taskId, commentId:commentId },
    	    success: function(response, opts) {
    	    	me.getSelectionModel().deselectAll();
    	    },
    	    failure: function(response, opts) {
    	    	alert('Your request cannot be processed at this time.\nPlease refresh your comment list.');
    	    }
    	});
    },
    getSelectedCommentId: function(){
    	var selection = this.getView().getSelectionModel().getSelection()[0];
         if (selection) {
             return selection.data.id;
         }
         return null;
    },
    getLocalizedValue: function(key){
    	return $W().localeManager.getLocalizationValue('application.javascript.tasks.comment.'+key);
    },
    registerForMessages: function(){
    	$W().Push.registerEventHandler( 'HT_COMMENT_ADDED', this.commentAdded.bind(this));
    	$W().Push.registerEventHandler( 'HT_COMMENT_UPDATED', this.commentUpdated.bind(this));
    	$W().Push.registerEventHandler( 'HT_COMMENT_DELETED', this.commentDeleted.bind(this));
    },
    initComponent: function () {
    	var me = this;
    	//model
    	Ext.define('Comment', {
    	     extend: 'Ext.data.Model',
    	     fields: [{name: 'commentId'}, {name: 'comment'}, {name: 'addedBy'}, {name: 'createdMillis'}]
    	 });
    	//store
    	 var commentsStore = Ext.create('Ext.data.Store', {
    	     model: 'Comment',
    	     proxy: {
    	         type: 'ajax',
    	         url: $W().contextPath + '/HTManager.json',
    	         reader: {
    	             type: 'json',
    	             root: 'results',
	                 totalProperty: 'totalCount',
	                 idProperty: 'commentId'
    	         }
    	     },
    	     autoLoad: false
    	 });
    	 
    	 Ext.applyIf(me, {
        	 store: commentsStore,
        	 listeners: {
    		    select: function(selModel, record, index, options){
    		        me.updateActionState();
    		    },
    		    deselect: function(selModel, record, index, options){
    		        me.updateActionState();
    		    }
        	 },
        	 columns: [
        	              { text: me.getLocalizedValue('column.comment'),  dataIndex: 'comment' , flex: 1, renderer: me.taskDataCellRenderer},
        	              { text: me.getLocalizedValue('column.addedBy'),  dataIndex: 'addedBy' , renderer: me.taskDataCellRenderer, width: 120},
        	              { text: me.getLocalizedValue('column.date'),  dataIndex: 'createdMillis' , renderer: me.taskDataCellRenderer, width: 140}
        	          ],
        	 dockedItems: [{
        	        dock: 'top',
        	        itemId: 'commentsToolbar',
        	        xtype: 'toolbar',
        	        items: [
        	            {
        		        	itemId: 'addComment',
        		    		iconCls: 'noteAddIcon',
        		   	        text: me.getLocalizedValue('action.add'),
        		   	        handler: function(){
        		   	        	me.addComment(true);
        		   	        }
        	            },
        	   	        {
        		        	itemId: 'deleteComment',
        		    		iconCls: 'noteDeleteIcon',
        		   	        text: me.getLocalizedValue('action.delete'),
        		   	        handler: function(){
        		   	        	me.deleteComment(me.getSelectedCommentId());
        		   	        }
        	   	        },
        	   	       {
	        	     		itemId: 'refresh',
	        	     		iconCls: 'x-tbar-loading',
	        	 	        text: me.getLocalizedValue('action.refresh'),
	        	 	        handler: function(){
	        	 	        	me.loadComments(me.taskId);
	        	 	        }
        	   	       }]
        	 	    }]
        	    });
    	 this.callParent();
    	 me.registerForMessages();
    },
    /**
     * Custom function used for column renderer
     */
    taskDataCellRenderer: function(value, metaData, record, row, col, store, gridView) {
    	var dataIndex = metaData.column.dataIndex;
    	if(dataIndex == 'createdMillis'){
    		value = Ext.Date.format(new Date(value), DATE_FORMAT + " " + TIME_FORMAT)
    	}
    	//add tooltip to all cells
    	metaData.tdAttr = 'data-qtip="' + value + '"';
        return value;
    }
});

  