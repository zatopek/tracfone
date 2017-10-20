Ext.Loader.enabled = true;
Ext.Loader.setConfig({
        enabled: true,
        paths : {
        	'Jacada.core' : 'SYSTEM/resources/js/extJS-extensions/jacada',
        	'Jacada.system' : 'SYSTEM/resources/js',
        	'Jacada.user' : 'USER/resources/js'
        }
      }); 

Ext.onReady(function(){
	
   		Ext.QuickTips.init();	
   		if($W().WELCOME_TIMOUT_IN_SECONDS > 0){
			Ext.create('Jacada.system.ui.core.WelcomeDialog').show();
		}
    ///////////////////////////
 	  // Build The Layout       //
 	  //////////////////////////
   		var layout = Jacada.Utils.loadLayout();
   		if(layout){
   			var config = {
  					layout: 'border',
  					defaults: {
  			            split: false
  			        }
  			};
  			$W().workspaceUI = Ext.create('Jacada.core.WorkSpaceUI', config);
  			$W().workspaceUI.init(layout);
  			$W().Push.listen();
   		}
    });