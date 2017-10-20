Ext.define('Jacada.system.ui.attachments.AttachmentsContainer', {
    extend: 'Ext.panel.Panel',

    itemId: 'attachmentsContainer',
    flex: 1,
	layout: 'column',
	autoScroll: true,
	border: false,

	hideDeleteButtons: function(){
		var attachment = this.child();
		while(attachment){
			attachment.setDeleteButtonVisibility(false);
			attachment = attachment.nextSibling();
		}
	},
	showDeleteButtons: function(){
		var attachment = this.child();
		while(attachment){
			attachment.setDeleteButtonVisibility(true);
			attachment = attachment.nextSibling();
		}
	},
	removeAllAttachments: function(){
		this.removeAll(true);
	},
	tryRemoveAttachment: function(attachment){
		this.up().up().deleteAttachment(attachment.contextUniqueId, attachment.attachmentId, attachment.attachmentName);
	},
	removeAttachment: function(attachmentItemId){
		var attachment = this.getComponent(attachmentItemId);
		this.remove(attachment);
	}
});