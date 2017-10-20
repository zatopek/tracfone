 multimediatest = Class.create();

multimediatest.prototype = {
  initialize: function() {
  }, 
  
  init: function() { 
 $W().Push.registerEventHandler( 'updateMultimediaPortlet', this.showEvent.bind(this));    
 $W().Push.registerEventHandler( 'testMultimediaAPI', this.testAPI.bind(this));  
 },
 
 
  showEvent: function(eventInfo) { 
    $('eventText').value = eventInfo;
    },
    
  
  
  testAPI: function(empty) { 

  var operation = $('operation').value;
  //answer case
  if (operation == 'answer'){
    $W().cti.acceptCustomItemAPI();
  }  
  // endItemAPI
  else if (operation == 'end'){
	  $W().cti._onCTIButtonClicked('endOpenMedia');
  }  
  // attach data
  else if (operation == 'attachdata'){
    var url = 'MultimediaTestController.jpf';
    var pars = 'action=attachData' + '&key=' + $('key').value+ '&value=' + $('value').value  + '&id=' + $('interaction').value ;                
     return new Ajax.Request(url, { method: 'get', parameters: pars, asynchronous : false });
  } 
  // delete attach data
  else if (operation == 'deleteattachdata'){
    var url = 'MultimediaTestController.jpf';
    var pars = 'action=deleteAttachData' + '&key=' + $('key').value+ '&id=' + $('interaction').value ;                
     return new Ajax.Request(url, { method: 'get', parameters: pars, asynchronous : false });
  } 
  // get attach data
  else if (operation == 'getattachdata'){
    var url = 'MultimediaTestController.jpf';
    var pars = 'action=getAttachData' + '&key=' + $('key').value+ '&id=' + $('interaction').value ;                
     return new Ajax.Request(url, { method: 'get', parameters: pars, asynchronous : false });
  } 
  else{
    alert('Illegal operation');
  }


 }
 
 
 
    
}