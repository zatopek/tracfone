Ext.define('Jacada.system.ui.core.WelcomeDialog', {
    extend: 'Ext.window.Window',
    
    id: 'welcomeDialog',
    height: 485,
	width: 760,
	resizable: false,
	header: false,
	border: false,
	shadow: false,
    modal: true,
    layout: 'fit',
    cls: "workspaceDialog",
    
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
			    	    	   html: Jacada.Utils.format($W().localeManager.getLocalizationValue('application.javascript.welcome.label.welcome'), $W().agentName),
			    	    	   bodyCls : 'form-panel-main-title',
			    	    	   width: 500,
			    	    	   border: false,
			    	    	   margin: '10 0 15 0'
			    	       },
			    	       {
			    	    	   xtype: 'panel',
			    	    	   html: $W().localeManager.getLocalizationValue('application.javascript.welcome.label.readInfo'),
			    	    	   bodyCls : 'form-panel-sub-title-welcome',
			    	    	   width: 500,
			    	    	   border: false
			    	       },
			    	       {
			    	       		width: 500,
			    	       		flex: 1,
			    	       		layout: 'fit',
			    	       		bodyStyle : 'background:none; ',
			    	       		bodyCls : 'form-panel-sub-title-welcome',
			    	       		margin: '10 0 0 0',
			    	       		border: false,
			    	       		items: Ext.create('Jacada.system.ui.core.WelcomeMessagesGrid')
			    	       }
			    	       ,{
			    	       		xtype: 'panel',
			    	       		layout: 'vbox',
			    	       		bodyStyle : 'background:none; ',
			    	       		margin: '15 0 0 0',
			    	       		border: false,
			    	       		flex: 1,
			    	       		items: {
			    	       			xtype: 'button',
			    	       			height: 44,
								    text: $W().localeManager.getLocalizationValue('application.javascript.welcome.button.done'),
								    cls: 'btn-ok-big',
								    handler: function() {
								    	me.closeDialog(me, true);
								    }
			    	       		}
							    
							}
					
			    	  ]
			    	}
			    ] 
    }
	    });
	    me.callParent(arguments);
	    setTimeout(function(){
	    	me.interval = setInterval(function(){
	    		me.closeDialog(me, false);
	    		}, $W().WELCOME_TIMOUT_IN_SECONDS*1000);
	    }, $W().WELCOME_TIMOUT_IN_SECONDS*1000);
	    
	},
	closeDialog: function(me, showMessage){
		var welcomeMessageBoard = Ext.getCmp('welcomeMessageBoard');
		if(!welcomeMessageBoard){
			return;
		}
		var hasManadatoryMessages = welcomeMessageBoard.hasManadatoryMessages();
		Jacada.Logger.debug("hasManadatoryMessages: "+hasManadatoryMessages);
		if(hasManadatoryMessages){
    		if(showMessage){
    			Ext.MessageBox.alert('', $W().localeManager.getLocalizationValue('application.javascript.welcome.label.readMandatory'));
    		}
    		return;
    	}
    	if(me.interval){
    		clearInterval(me.interval);
    		me.interval = null;
    	}
    	$W().ShowCurrentVisibleTab();
    	me.close();
	}

});