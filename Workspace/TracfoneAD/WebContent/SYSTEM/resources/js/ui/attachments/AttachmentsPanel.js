Ext.define('Jacada.system.ui.attachments.AttachmentsPanel', {
    extend: 'Ext.panel.Panel',

    itemId: 'attachmentsPanel',
    border: false,
	layout: {
		type: 'hbox',
		align: 'stretch'
	},
	initComponent: function(){
		var me = this;
		var items = [];
		
		items.push(me.buildAttachFileFormPanel());
		items.push(me.buildAttachmentsLabel());
		items.push(me.buildAttachmentsContainer());
		
        items = items.compact();
        Ext.applyIf(me, {
        	items: items
        });
        me.callParent(arguments);
	},
	buildAttachFileFormPanel: function(){
		return {
			xtype: 'form',
			border: false,
			itemId: 'attachFileFormPanel',
			width: 115,
			hidden: true,
			items:{			  
				itemId: 'attachFileField',
				xtype: 'filefield',
				name: 'file',
				hideLabel: true,
				buttonOnly: true,
				margin: '0 0 5 10',
				//add '<b>' here cause in IE9 file type style doesn't work
				buttonText: '<b>'+$W().localeManager.getLocalizationValue('application.javascript.attachments.button.text')+':</b>',
				buttonConfig: {
		            baseCls: 'emailActionLink'
		        },
		        listeners: {
		        	scope: this,
		            change: function(fb, value){
		            	//There is some problem happens in IE.
		            	//change event is fired twice. Second time with empty value
		            	if(value && value != ''){
		            		fb.up('#attachmentsPanel').up().uploadAttachment(fb, value);
		            	}
		            }
		        }
			}
	    };
	},
	buildAttachmentsLabel: function(){
		return {
	        xtype: 'label',
	        itemId: 'attachmentsLabel',
	        html: '<b>'+$W().localeManager.getLocalizationValue('application.javascript.attachments.button.text')+':</b>',
	        margin: '0 5 5 10',
	        width: 100
	    };
	},
	buildAttachmentsContainer: function(){
		return Ext.create('Jacada.system.ui.attachments.AttachmentsContainer', {padding: '0 0 5 0'});
	},
	getAttachmentsContainer: function(){
		return this.getComponent('attachmentsContainer');
	},
	addAttachment: function(attachmentData, uniqueId){
		attachmentData.id = attachmentData.id||attachmentData.Id;
		attachmentData.name = attachmentData.name||attachmentData.Name;
		attachmentData.size = attachmentData.size||attachmentData.Size;
		var attachmentUI = Ext.create('Jacada.system.ui.attachments.Attachment', {
			itemId: attachmentData.id + '-Attachment',
			attachmentId: attachmentData.id,
			attachmentName: attachmentData.name,
			sizeInBytes: attachmentData.size,
			contextUniqueId: uniqueId
		});
		this.getAttachmentsContainer().add(attachmentUI);
	},
	hideDeleteButtons: function(){
		this.getAttachmentsContainer().hideDeleteButtons();
	},
	showDeleteButtons: function(){
		this.getAttachmentsContainer().showDeleteButtons();
	},
	removeAllAttachments: function(){
		this.getAttachmentsContainer().removeAllAttachments();
	},
	tryRemoveAttachment: function(attachment){
		this.getAttachmentsContainer().tryRemoveAttachment(attachment);
	},
	removeAttachment: function(attachmentItemId){
		this.getAttachmentsContainer().removeAttachment(attachmentItemId+ '-Attachment');
	},
	editMode: function(edit){
		this.getComponent('attachmentsLabel').setVisible(!edit);
		this.getComponent('attachFileFormPanel').setVisible(edit);
	}
});