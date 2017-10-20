 ctitest = Class.create();

ctitest.prototype = {
  initialize: function() {
  }, 
  
  init: function() { 
 $W().Push.registerEventHandler( 'UpdateCTIClient', this.showTest.bind(this));    
 $W().Push.registerEventHandler( 'testCTIAPI', this.testAPI.bind(this));
 $W().Push.registerEventHandler( 'testButtonClickedAPI', this.testButtonClickedAPI.bind(this));    
 $W().Push.registerEventHandler( 'testScriptOperationAPI', this.testScriptOperationAPI.bind(this));
 $W().Push.registerEventHandler( 'testSmartPadTransferable', this.showTransferableEvent.bind(this));
 },
 
 showTransferableEvent: function(eventInfo) { 
    $('transferedDataEventText').value = eventInfo;
    },
    
  showTest: function(ctiClientInfo) { 
  
  
    //var clientStateName = ctiClientInfo.clientStateName; 
    
    this.ctiClientInfo = ctiClientInfo;  
    
     $('customerCallId').value = this.ctiClientInfo.customerCallId;     
     $('superCallId').value = this.ctiClientInfo.superCallId;
     $('customerId').value = this.ctiClientInfo.customerId;
     $('superId').value = this.ctiClientInfo.superId;
     $('customerState').value = this.ctiClientInfo.customerState;
     $('superState').value = this.ctiClientInfo.superState;
    },
    
  
  testScriptOperationAPI: function(operation) {
  	var url = 	$('url').value;
	  	 //load script case
	  if (operation == 'loadScript'){
	    $W().loadScript(url);
	  } 
	  // unload script case
	  else if (operation == 'unloadScript'){
	    $W().unloadScript();
	  }
	   // unload script case
	  else if (operation == 'navigateToLink'){
	    $W().navigateToLink(url);
	  }  
	  else{
	  	alert("unsupported operation: "+operation);
	  }
  	 
  	
  },
  
   testButtonClickedAPI: function(operation) {
  	 var dn = 	$('dn').value;
  	 var location = 	$('location').value;
  	 var channel = 	$('dn').channel;
  	 if(channel == null){
  	 	channel='';
  	 }
  	 
  	 return $W().ctiAPI.clickButton(operation,dn,location,channel);
  },
  
  testAPI: function(operation) { 
  //retrive required operation and params
  var param1 = 	$('param1').value;
  var param2 =	$('param2').value;
  var param3 = $('param3').value;
  var param4 = $('param4').value;
  var param5 = $('param5').value;
  //answer case
  if (operation == 'answer'){
    $W().cti.answerCallAPI();
  } 
  // transferCallAPI
  else if (operation == 'transfer'){
    $W().cti.transferCallAPI("", param1, param2, param3, param4, param5);
  } 
  
  // setAgentStatusAPI
  else if (operation == 'setAgentStatus'){
    $W().cti.setAgentStatusAPI(param1,param2);
  }
  
  // attachUserDataAPI
  else if (operation == 'attachUserData'){
    $W().cti.attachUserDataAPI(param1,param2, param3);
  }
  
  // deleteAttachedUserDataAPI
  else if (operation == 'deleteAttachedUserData'){
    $W().cti.deleteAttachedUserDataAPI(param1,param2);
  }    
  
  // updateAttachedUserDataAPI
  else if (operation == 'updateAttachedUserData'){
    $W().cti.updateAttachedUserDataAPI(param1,param2, param3);
  }  
  
  // dialCallAPI
  else if (operation == 'dial'){
    $W().cti.dialCallAPI(param1, param2);
  }
  
  // releaseItemAPI
  else if (operation == 'release'){
    $W().cti.releaseItemAPI();
  }  
  
   // holdCallAPI
  else if (operation == 'hold'){
    $W().cti.holdCallAPI();
  }
   // offHoldCallAPI
  else if (operation == 'offhold'){
    $W().cti.offHoldCallAPI();
  }  
  
  else{
  alert('Illegal operation');
  }


 }
 
 
 
    
}