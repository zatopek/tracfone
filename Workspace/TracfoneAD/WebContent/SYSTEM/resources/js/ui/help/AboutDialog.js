Ext.define('Jacada.system.ui.help.AboutDialog', {
    extend: 'Ext.window.Window',
    
    id: 'aboutDialog',
    height: 485,
	width: 760,
	resizable: false,
	header: false,
	border: false,
	shadow: false,
    modal: true,
    layout: 'fit',
    
    initComponent: function() {
	    var me = this;
	    Ext.applyIf(me, {
	    	items: {  
        height: '100%',
			    border: false,

			    // Fields will be arranged vertically, stretched to full width
			    layout: {
			    	type: 'vbox',
			    	align: 'stretch'
			    },
			    defaults: {
			        border: false
			    },
			    items: [{
			    	xtype: 'panel',
			    	bodyCls : 'logo-panel',
			    	height: 149
			    },{
			    	xtype: 'panel',
			    	bodyCls : 'form-panel',
			    	flex: 1,
			    	layout: {
				    	type: 'vbox',
				    	align: 'center'
				    },
			    	url: 'j_spring_security_check',
			    	items:[
			    	       {
			    	    	   xtype: 'panel',
			    	    	   html: Jacada.Utils.format($W().localeManager.getLocalizationValue('application.javascript.helpabout.label.jacadaWorkSpace'), $W().productInfo.version),
			    	    	   bodyCls : 'form-panel-main-title',
			    	    	   border: false,
			    	    	   margin: '30 0 48 0'
			    	       },
			    	       {
			    	    	   xtype: 'panel',
			    	    	   html: Jacada.Utils.format($W().localeManager.getLocalizationValue('application.javascript.helpabout.label.copyrights'), new Date().getFullYear()),
			    	    	   bodyCls : 'form-panel-sub-title',
			    	    	   border: false
			    	       },
			    	       {
			    	    	   xtype: 'panel',
			    	    	   html: $W().localeManager.getLocalizationValue('application.javascript.helpabout.label.trademark'),
			    	    	   bodyCls : 'form-panel-sub-title',
			    	    	   border: false
			    	       },{
			    	       		xtype: 'panel',
			    	       		layout: 'vbox',
			    	       		bodyStyle : 'background:none; ',
			    	       		padding: '30 0 0 0',
			    	       		border: false,
			    	       		flex: 1,
			    	       		items: {
			    	       			xtype: 'button',
			    	       			height: 44,
								    text: $W().localeManager.getLocalizationValue('application.javascript.helpabout.button.ok'),
								    cls: 'btn-ok-big',
								    handler: function() {
								    	$W().ShowCurrentVisibleTab();
								    	me.close();
								    }
			    	       		}
							    
							}
					
			    	  ]
			    	}
			    ] 
    }
	    });
	    me.callParent(arguments);
	}

});