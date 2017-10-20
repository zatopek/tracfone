Ext.define('Jacada.system.ui.attachments.Attachment', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.attachment',
    
    layout: 'hbox',
    border: false,
	bodyCls: 'attachmentStyle',
	margin: '0 10 0 0',
	attachmentId: null,
	attachmentName: null,
	sizeInBytes: null,
	contextUniqueId: null,
	       
   initComponent: function(){
	   var me = this;
	   var items = [];
	   items.push(me.buildAttachmentWrapperPanel());
	   items.push(me.buildDeleteButton());
	   Ext.applyIf(me, {
		   items: items
	   });
	   me.callParent(arguments);
   	},
   	
   	buildAttachmentWrapperPanel: function(){
   		var me = this;
   		var size = '(?)';
   		if(this.sizeInBytes){
   			size = '('+Ext.util.Format.fileSize(this.sizeInBytes)+')';
   		}
   		return {
   			html: me.attachmentName + ' ' + size,
   			bodyCls: 'attachmentStyle',
   			overCls: 'attachmentStyle attachmentMouseOver',
   			border: false,
   			listeners: {
   		        click: {
   		            element: 'el',
   		            fn: function(){
   		            	Jacada.Logger.debug("Downloading attachment uniqueId: " + me.contextUniqueId 
   		            			+ ", attachmentId:" + me.attachmentId + ", attachmentName:" + me.attachmentName);
   		            	$W().mediaAPI.downloadAttachment(me.contextUniqueId, me.attachmentId, me.attachmentName);
   		            }
   		        }
   			}
   		};
   	},
   	buildDeleteButton: function(){
   		var me = this;
   		return {
			xtype: 'button',
			ui: 'default-toolbar',
			itemId: 'deleteAttachmentBtn',
			iconCls: 'deleteAttachmentBtnIcon',
			width: '14px',
			height: '14px',
			handler: function(){
				me.up().tryRemoveAttachment(me);
			}
   		};
   	},
   	setDeleteButtonVisibility: function(visible){
   		this.getComponent('deleteAttachmentBtn').setVisible(visible);
   	}

});