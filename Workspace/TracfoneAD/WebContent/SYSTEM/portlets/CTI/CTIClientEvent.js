CTIClientEvent = Class.create();


CTIClientEvent.prototype = {
  initialize: function() {
  }, 
  
  init: function() {
     
    $W().Push.registerEventHandler( 'receivedCTIEvent', this.handleCTIEvent.bind(this));   
     
  },
  
  
/********************************************************************************
   * This is the handler for the CTI events. This function should be filled up by the customer 
   *********************************************************************************/
  handleCTIEvent: function(ctiClientEvent) { 
 
  this.ctiClientEvent = ctiClientEvent;  
   //debugger;
    // handle busy/ready
    var busy = this.ctiClientEvent.bBusy;
   if (this.ctiClientEvent.errorMessage && this.ctiClientEvent.errorMessage != ''){
	//        debugger;
	//here you need to parse the error message that will look like this when such info arrived from the switch
	//hold operation failed .Error code=1161:Error mesage=Incorrect object state:Error info=Unsupported operation:
	//if the cti did not provide errorCode etc, this string may contain a workspace error message, e.g:
	//"login operation failed. Error code=login failed agent or extension already logged in:Error mesage=login failed agent or extension already logged in:Error info=:"


   }
    //this is how you retreive the atached data
     //var receivedObject = eval('(' + this.ctiClientEvent.attachedDataJsonString + ')');
     // //this is how you retreive alll the params, not only the ones that are exposed with getters/setters 
     //var receivedObject = eval('(' + this.ctiClientEvent.paramsJsonString + ')');
    
    
    
   }
  
  }
  
  //end of class