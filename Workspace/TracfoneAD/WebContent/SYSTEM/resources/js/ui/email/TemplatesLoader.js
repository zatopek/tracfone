Ext.define('Jacada.system.ui.email.TemplatesLoader', {

	loadTemplates: function(rootNode){
		var me = this;
		me.rootNode = rootNode;
		this.store.load({
			url : 'rest/resource/templates?sessionId='+$W().wsSessionId,
		    scope: this,
		    callback: function(records, operation, success) {
		    	//build nodes hierarchy
	    		if(!records){
	    			return;
	    		}
	    		me.populateTree(records);
		    }
		});
	},

    constructor: function() {
    	Ext.define('Template.Model', {
    	    extend: 'Ext.data.TreeModel',
    	    fields: ['templateName', 'templateIdentifier', 'parentIdentifier', 'templateMediaType', 'templateNodeType', 'templateDescription', 'templateFileName', 'attachmentFileList']
    	});
    	
	    var me = this;
	    Ext.applyIf(me, {
	    	store: Ext.create('Ext.data.Store', {
	    	    storeId: 'templatesStore',
	    	    autoLoad: false, //will be loaded when loadTemplates is invoked
	    	    model: 'Template.Model',
	    	    proxy: {
		            type: 'ajax',
		            reader: {
		                type: 'xml',
		                record: 'Template',
		                root: 'TemplateLibrary'
		            }
	    	    }
	    	})
	    });
	    me.callParent(arguments);
	},

/*
 * Sample XML looks like this
 * 	<Template>
 * 	<templateVersion>1</templateVersion>
 * 	<templateChanged>False</templateChanged>
 * 	<templateIdentifier>7d4a72dc-8b60-473c-856b-c14f2059a595</templateIdentifier>
 * 	<templateMediaType>Email</templateMediaType>
 * 	<templateNodeType>Template</templateNodeType>
 * 	<templateName>some template</templateName>
 * 	<templateDescription>none</templateDescription>
 * 	<templateFileName>C:\Program Files (x86)\Avaya\Avaya Aura CC Elite Multichannel\Server\Media Stores\Email Media Store\Templates\7d4a72dc-8b60-473c-856b-c14f2059a595</templateFileName>
 * 	<templateCharacterSet> </templateCharacterSet>
 * 	<attachmentFileList> </attachmentFileList>
 * 	<parentIdentifier>ed2f3f1e-7ec0-494e-a998-79894e6c8a6d</parentIdentifier>
 * </Template>
 */
	populateTree: function(records) {
		var me = this;
		var lastNode;
		var nodes = new Object();
		me.rootNode.removeAll();
		records.each(function(record){
			var data = record.data;
			var node = { id:data.templateIdentifier, itemId: data.templateIdentifier, text: data.templateName, template: data, parentId: data.parentIdentifier, leaf: data.templateNodeType != 'Folder' };
			var parentNode;
			if(data.parentIdentifier && data.parentIdentifier.trim().length > 0){
				parentNode = nodes[data.parentIdentifier];
				if(!parentNode){
					parentNode = me.rootNode;
				}
			}else{
				parentNode = me.rootNode;
			}
			node = parentNode.appendChild(node);
			nodes[data.templateIdentifier] = node; 
    	});
		//currently there is a bug in treePicker, If we do not expand, the treePanel won't grow when you expand nodes
		me.rootNode.getOwnerTree().expandAll();
	}

});