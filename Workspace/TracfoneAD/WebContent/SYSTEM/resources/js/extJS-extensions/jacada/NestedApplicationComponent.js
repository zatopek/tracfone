Ext.define('Jacada.core.NestedApplicationComponent', {
    extend: 'Ext.Component',
    
    initComponent: function(){
    	this.updateHTML();
        this.callParent(arguments);
    },
    updateHTML: function() {
    	this.html = this.createHostingHTML();
    },
	createHostingHTML: function(){
		var html;
		if(!this.width){
			this.width = "100%";
		}
		if(!this.height){
			this.height = "100%";
		}
		//start as hidden, we don't want all nested application to pop up on login.
		html = '<div id="nested-div-' + this.id +'" style="display:none;" >\n';
		html += '<OBJECT id="nested-object-' + this.id+ '" CLASSID="CLSID:8356B5EC-F565-4220-BA38-0626A92A3252" CODEBASE="ApplicationHolder.CAB#version=1,0,0,1" width="' + this.width +'" height="' + this.height +'" isActiveXObject="true" style="position: relative;">\n';
		html += '<PARAM NAME="Width"  VALUE="' + this.width +'"/>\n';
		html += '<PARAM NAME="Height" VALUE="' + this.height +'"/>\n';
		html += '<PARAM NAME="ExeName" VALUE="' + this.exeName +'"/>\n';
		html += '<PARAM NAME="WorkingDirectory" VALUE="' + this.workingDirectory +'"/>\n';
		html += '<PARAM NAME="Arguments" VALUE="' + this.arguments +'"/>\n';
		html += '<PARAM NAME="Id" VALUE="' + this.id +'"/>\n';
		html += '<PARAM NAME="LinkCaption" VALUE="' + this.linkCaption +'"/>\n';
		html += '<PARAM NAME="ExeNameRegKey" VALUE="' + this.exeRegKey +'"/>\n';
		html += '<PARAM NAME="WorkingDirectoryRegKey" VALUE="' + this.workDirRegKey +'"/>\n';
		html += '<PARAM NAME="WorkingDirectory" VALUE="' + this.workingDirectory +'"/>\n';
		html += '<PARAM NAME="ArgumentsRegKey" VALUE="' + this.argRegKey +'"/>\n';
		html += '<PARAM NAME="ScrollbarsEnabled" VALUE="' + this.enableScrollBars +'"/>\n';
		html += '<PARAM NAME="BackgroundColor" VALUE="' + this.backgroundColor +'"/>\n';
		html += '<PARAM NAME="RecreateApplication" VALUE="' + this.recreateApp +'"/>\n';
		html += '<PARAM NAME="DetectBusyApp" VALUE="' + this.detectBusy +'"/>\n';
		
		html += '<PARAM NAME="BusyMessage" VALUE="' + this.busyMessage +'"/>\n';
		html += '<PARAM NAME="ShowLoadMsg" VALUE="' + this.showLoadMsg +'"/>\n';
		html += '<PARAM NAME="LoadingMsg" VALUE="' + this.loadingMsg +'"/>\n';
		html += '<PARAM NAME="CentralizeApps" VALUE="' + this.centerApps +'"/>\n';
		html += '<PARAM NAME="ExcludeProcess" VALUE="' + this.excludeProcess +'"/>\n';
		html += '<PARAM NAME="AlwaysHideWindowList" VALUE="' + this.alwaysHideWin +'"/>\n';
		
		html += '<PARAM NAME="ServerTimeInMillis" VALUE="' + this.serverTimeInMillis +'"/>\n';
		html += '<PARAM NAME="AvoidPlaceInsideHost" VALUE="' + this.avoidPlaceInsideHost +'"/>\n';
		html += '<PARAM NAME="ShowWindowInCorrectTab" VALUE="' + this.showWindowInCorrectTab +'"/>\n';
		html += '<PARAM NAME="WorkSpaceSessionId" VALUE="' + $W().wsSessionId +'"/>\n';
		html += '</OBJECT></div>'
		Jacada.Logger.debug(html);	
		return html;
	}
});