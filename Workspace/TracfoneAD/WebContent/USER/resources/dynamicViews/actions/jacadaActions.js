$W = function getMainWindow() {
	var w = window;
    while (w != w.parent) {
        w = w.parent;
    }
    while (w.opener != null) {
        w = w.opener;
    }
    while (w != w.parent) {
        w = w.parent;
    }
    return w;
}

afrous.dashboard.actions.register({
  name : "jacada-actions", // should be unique in custom action groups
  title : "Jacada Actions", // shown as separator header in action menu. 
  items: [{
    name: "show-tab", // should be unique in this custom action group
    title: "Show Tab", // shown as custom action menu label
    params: [{
        label: "Tab ID",
        name:  "tabId"
    }],
    action : function(event, params, data) {   // action function
      // event is name of the event (e.g. "click" or "submit"). Type:String.
      // data is a JavaScript object which is assigned to the event. Type:Any.
      if(!params.tabId){
    	  alert('Could not find property tabId in the event');
    	  return;
      }
      if(typeof ($W().ShowTabById) != 'undefined'){   //check if workspace runtime
    	  $W().ShowTabById(params.tabId);
      } else {
        Ext.MessageBox.alert('Action', 'Show Tab (' + params.tabId + ')' );
      }
    }
  }, {
	  name: "hide-tab", // should be unique in this custom action group
	    title: "Hide Tab", // shown as custom action menu label
	    params: [{
                label: "Tab ID",
                name:  "tabId"
            }],
	    action : function(event, params, data) { // action function
	      // event is name of the event (e.g. "click" or "submit"). Type:String.
	      // data is a JavaScript object which is assigned to the event. Type:Any.
	    	 if(!params.tabId){
	       	  alert('Could not find property tabId in the event');
	       	  return;
	         }
	        if(typeof ($W().HideTabById) != 'undefined'){   //check if workspace runtime
	        	$W().HideTabById(params.tabId);
            } else {
                Ext.MessageBox.alert('Action', 'Hide Tab (' + params.tabId + ')' );
            }
	    }
  },{
	  name: "end-call", // should be unique in this custom action group
	  title: "End call", // shown as custom action menu label
	  action : function(event, data) { // action function
	    	if(typeof ($W().ctiAPI) != 'undefined'){
	    	    //window.cti.doEndAction('endCall');
	    		$W().ctiAPI.clickButton('end');
	    	} else {
                Ext.MessageBox.alert('Action', 'End Call');
            }
	    }
    }

]
});


