Ext.define('Jacada.system.ui.email.TemplatesPanel', {
    extend: 'Ext.panel.Panel',
    
    border: false,
    itemId: 'templatesPanel',
    
	initComponent: function() {
	    var me = this;
	    Ext.applyIf(me, {
	    	layout: 'border',
	        items: [
	                me.createTree(me),
	                me.createPreview(me)
	                ]
	    });
	    me.callParent(arguments);
	    me.loadTemplates(me);
	},
	createTree: function(me){
		
		return Ext.create('Ext.tree.Panel', {
		    width: 220,
		    border: false,
		    useArrows: true,
		    region: 'west',
		    rootVisible: false,
		    itemId: 'templatesTree',
		    listeners:{
		    	select: function(container, record, index, eOpts){
		    		if(record.raw.template.templateNodeType != 'Folder'){
		    			if(!$W().emailTemplates){
		    				$W().emailTemplates = new Object();
		    			}
		    			var template = record.raw.template;
		    			var templateObj = $W().emailTemplates[template.templateIdentifier];
		    			if(!templateObj){
		    				//load template
		    				Ext.Ajax.request({
		    					url : 'rest/resource/template?templateId='+template.templateIdentifier+'&sessionId='+$W().wsSessionId,
		    				    headers: {
		    				    	'Accept': 'application/json',
		    				    	'Content-Type': 'application/json'
		    				    },
		    				    success: function(response){
		    				        var templateObj = Ext.decode(Ext.decode(response.responseText));
		    				        templateObj.templateIdentifier = template.templateIdentifier;
		    				        //templateObj=...
		    				        //save to cache
		    				        //$W().emailTemplates[template.templateIdentifier] = ...templateObj
		    				        me.loadPreview(templateObj);
		    				    }
		    				});
		    			}else{
		    				me.loadPreview(templateObj);
		    			}
		    		}else{
		    			me.cleanPreview();
		    		}
		    	}
		    }
		});
	},
	
	cleanPreview: function(){
		this.allowTemplateInsertion(false);
		var preview = this.down('#preview');
		preview.down('#subject').setValue('');
		preview.down('#bodyPreview').update('');
	},
	createPreview: function(me){
		return {
			
		    itemId: 'preview',
		    layout: {
		    	type: 'vbox',
		    	align: 'stretch'
		    },
		    region: 'center',
		    //bodyStyle :  'padding:5px 10px 5px 10px;',
		    items:[{
				xtype: 'displayfield',
				padding :  '5px 10px 5px 10px',
				itemId: 'subject',
				fieldLabel: '<b>'+$W().localeManager.getLocalizationValue('application.javascript.email.subject')+'</b>'
			},
			Ext.create('Jacada.system.ui.attachments.AttachmentsPanel')	
			,{
				xtype:'fieldset',
				margin: '0 5 5 10',
				title: $W().localeManager.getLocalizationValue('application.javascript.email.templates.preview'),
				flex: 1,
				layout: {
			    	type: 'vbox',
			    	align: 'stretch'
			    },
				items: {itemId: 'bodyPreview', flex: 1, border: false, autoScroll: true}
			}]
		};
	},
	loadPreview: function(templateObj){
		this.allowTemplateInsertion(true);
		this.templateObj = templateObj;
		var preview = this.down('#preview');
		var workItem = templateObj.eventData.WorkItem;
		preview.down('#subject').setValue(workItem.Subject);
		preview.down('#bodyPreview').update(Base64.decode(workItem.Body));
		//convert link targets so it will open in a new window
		Jacada.Utils.processEmailBody( preview.down('#bodyPreview').el.dom);
		
		var attachmentsPanel = preview.getComponent('attachmentsPanel');
		attachmentsPanel.removeAllAttachments();
		var attachments = templateObj.eventData.Attachments;
		if(attachments){
			attachments.each(function(attachmentData){
				attachmentsPanel.addAttachment(attachmentData, templateObj.templateIdentifier);
			});
		}
		attachmentsPanel.hideDeleteButtons();
		attachmentsPanel.editMode(false);
	},
	loadTemplates: function(panel){
		var loader = Ext.create('Jacada.system.ui.email.TemplatesLoader');
		loader.loadTemplates(panel.getComponent('templatesTree').getRootNode());
	},
	getTemplate: function(){
		return this.templateObj;
	}
    
});