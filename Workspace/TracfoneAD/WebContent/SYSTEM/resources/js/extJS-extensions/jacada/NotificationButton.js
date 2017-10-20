Ext.define('Jacada.core.NotificationButton', {
    extend: 'Ext.button.Button',

    inAnimation: null,
    notificationWindow: null,
    
    initComponent: function(){
		var me = this;
        Ext.applyIf(me, {
        	listeners: {
        		disable: function(thisBtn, eOpts){
        			thisBtn.stopNotification();
        		},
        		hide: function(thisBtn, eOpts){
        			thisBtn.stopNotification();
        		}
        	}
        });
    	
        this.callParent(arguments);
    },
    startNotification: function(data){
    	var me = this;
    	if(this.inAnimation != null){
    		me.stopNotification();
    	}
    	$W().HideCurrentVisibleTab();
    	this.inAnimation = setInterval(function(){
	    		if(me.isNotificationIconShown()){
	    			me.clearNotificationIcon();
	    		}else{
	    			me.showNotificationIcon();
	    		}
    		},
    		1000);
    	if(!data.notificationPopup){
    		Jacada.Logger.debug('notificationPopup is false. No need to show pop up.');
    		return;
    	}
    	if(me.id == 'answerEmailBtn' || me.id == 'answerBtn' || me.id == 'answerChatBtn'){
    		if (!me.notificationWindow && $W().ctiSettings.ctiNotificationAutoCloseDelay != '-1') {
    			me.notificationWindow = Ext.create('Ext.ux.window.Notification', {
    				position: 'br', //bottom-right
    				cls: 'ux-notification-light',
    				slideInDuration: 1200,
    				autoCloseDelay: parseInt($W().ctiSettings.ctiNotificationAutoCloseDelay),
    				height: 80,
    				width: 240,
    				resizable: false,
    				autoClose: $W().ctiSettings.ctiNotificationAutoCloseDelay != '0',
    				closeAction: 'hide',
    				closable: true,
    				items: {
						itemId: 'popupBody',
						baseCls: 'popupActionLink',
						listeners: {
			   		        click: {
			   		            element: 'el',
			   		            fn: function(){
			   		            	$W().cti.notificationButtonHandler(me.id);
			   		            }
			   		        }
			   			}
					}
    			});
    		}
    	}
		if(me.notificationWindow){
			me.notificationWindow.setTitle(Ext.String.htmlEncode(data.title));
			me.notificationWindow.getComponent('popupBody').update(Ext.String.htmlEncode(data.msg));
			me.notificationWindow.setIconCls(data.iconCls);
			me.notificationWindow.show();
		}
    },
    isNotificationIconShown: function(){
    	return this.iconCls.indexOf('Blink') > -1;
    },
    clearNotificationIcon: function(){
    	if(this.isNotificationIconShown()){//already blinking icon
    		this.setIconCls(this.iconCls.substring(0, this.iconCls.indexOf('Blink')));
		}
    },
    showNotificationIcon: function(){
    	this.clearNotificationIcon();
    	this.setIconCls(this.iconCls+'Blink');
    },
    
    stopNotification: function(){
    	clearInterval(this.inAnimation);
    	this.inAnimation = null;
    	this.clearNotificationIcon();
    	if(this.notificationWindow != null){
    		this.notificationWindow.hide();
    		$W().ShowCurrentVisibleTab();
    	}
    }
});