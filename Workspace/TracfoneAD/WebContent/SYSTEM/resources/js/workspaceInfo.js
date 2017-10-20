WorkSpaceInfo = Class.create();
WorkSpaceInfo.prototype = {
	initialize: function(){
		this.generalInfo = new Hash({
			'application.javascript.workspaceInfo.generalInfo.context': $W().contextPath,
			'application.javascript.workspaceInfo.generalInfo.protocol': $W().location.protocol.replace(":","")
		});
		this.sessionInfo = new Hash({
			'application.javascript.workspaceInfo.sessionInfo.serverHost': $W().serverHost,
			'application.javascript.workspaceInfo.sessionInfo.serverPort': $W().serverPort,
			'application.javascript.workspaceInfo.sessionInfo.serverName': $W().serverName,
			'application.javascript.workspaceInfo.sessionInfo.sessionId': $W().wsSessionId,
			'application.javascript.workspaceInfo.sessionInfo.agentName': $W().agentName,
			'application.javascript.workspaceInfo.sessionInfo.agentLoginTime': $W().agentLoginTime
		});
		this.clientInfo = new Hash({
			'application.javascript.workspaceInfo.clientInfo.browser': this.getBrowserInfo(),
			'application.javascript.workspaceInfo.clientInfo.currentTime': ''
		});
		this.projectInfo = new Hash();
		this.message = '';
	},

	open: function(){
		//Arranging general info
		var message = '<p><div><span class="wsInfoTitle">' 
			+ $W().localeManager.getLocalizationValue('application.javascript.workspaceInfo.generalInfo.title') 
			+ '</span>';
		this.generalInfo.each(function(info){
			message += '<div><span class="wsInfoLabel">' + $W().localeManager.getLocalizationValue(info.key) 
					+ ': </span><span class="wsInfoValue">' + info.value + '</span></div>';
		});
		
		//Arranging session info
		message += '</p><p><div><span class="wsInfoTitle">' 
			+ $W().localeManager.getLocalizationValue('application.javascript.workspaceInfo.sessionInfo.title') 
			+ '</span></div>';
		this.sessionInfo.each(function(info){
			message += '<div><span class="wsInfoLabel">' + $W().localeManager.getLocalizationValue(info.key) 
					+ ': </span><span class="wsInfoValue">' + info.value + '</span></div>';
		});
		
		//Arranging client info
		message += '</p><p><div><span class="wsInfoTitle">' 
			+ $W().localeManager.getLocalizationValue('application.javascript.workspaceInfo.clientInfo.title') 
			+ '</span></div>';
		this.clientInfo.set('application.javascript.workspaceInfo.clientInfo.currentTime', this.getCurrentTime());
		this.clientInfo.each(function(info){
			message += '<div><span class="wsInfoLabel">' + $W().localeManager.getLocalizationValue(info.key) 
					+ ': </span><span class="wsInfoValue">' + info.value + '</span></div>';
		});
		
		//Arranging project info is exists
		if(this.projectInfo.size() > 0){
			message += '</p><p><div><span class="wsInfoTitle">' 
				+ $W().localeManager.getLocalizationValue('application.javascript.workspaceInfo.projectInfo.title') 
				+ '</span></div>';
			this.projectInfo.each(function(info){
				message += '<div><span class="wsInfoLabel">' + $W().localeManager.getLocalizationValue(info.key) 
						+ ': </span><span class="wsInfoValue">' + info.value + '</span></div>';
			});
		}else{
			message += '</p>';
		}
		this.message = message;
		$W().HideCurrentVisibleTab();
		var win = Ext.create('Ext.window.Window', {
	        layout: 'fit',
	        modal: true,
	        resizable: true,
	        closeAction: 'close',
	        title: $W().localeManager.getLocalizationValue('application.javascript.workspaceInfo.window.title'),
	        items: [{
	        	xtype: 'panel',
	        	border:false,
		        bodyPadding: 5,
	        	html: this.message
	        }],
	        fbar: [{
	        	type: 'button',
	            text: $W().localeManager.getLocalizationValue('application.javascript.workspaceInfo.window.buttons.ok'),
	            handler: function(){
	                win.close();
	            }
	        }],
	        listeners: {
	        	close: function(panel, eOpts){
	        		$W().ShowCurrentVisibleTab();
	        	}
	        }
	    });
		//Toolbar windows zIndex is managed in WorkSpace,
		//thus we must set explicitly zIndex of the WorkSpace Info window
		win.on('show', function(thisWin){
			thisWin.getEl().applyStyles({zIndex:$W().getTopZIndex() + 100});
		});
		win.on('move', function(thisWin){
			thisWin.getEl().applyStyles({zIndex:$W().getTopZIndex() + 100});
		});
		win.show();
	},
	
	addProjectInfo: function(label, value){
		this.projectInfo.set(label, value);
	},
	
	getCurrentTime: function(){
		return Ext.Date.format(new Date(), 'd M Y H:i:s P');
	},
	
	getClientIps: function(){
		var ips = $W().getClientIPAddresses();
		if(ips == null){
			ips = 'N/A';
		}else{
			ips = ips.without("127.0.0.1");
		}
		return ips;
	},

	getBrowserInfo: function(){
		var browser = "N/A";
		if(Ext.isIE){
			browser = "Internet Explorer " + Ext.ieVersion;
		}else if(Ext.isChrome){
			browser = "Chrome";
		}else if(Ext.isFF){
			browser = "FireFox";
		}
		return browser;
	}
};

$W().workspaceInfo = new WorkSpaceInfo();
