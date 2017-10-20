
document.onkeypress = dialpad_keypress;

function updateWindow() {
     if (($('dialPopupWindowNumber').value) &&  $('dialPopupWindowNumber').value != ''){
         $('applyBtn').disabled = false;
     }
     else{
        $('applyBtn').disabled = true;
     }
}

function dialpad_keypress(e) {
    var clickedOn = window.event.keyCode;
           
    var allowedChar = false;
    var clickedOnParsed = String.fromCharCode(clickedOn);
    if(clickedOnParsed == '*' || clickedOnParsed == '#' || 
        clickedOnParsed >= '0' && clickedOnParsed <= '9')
    {
        allowedChar = true;
    }
    
    if(clickedOn == 13) // enter
    {
        $("applyBtn").click();
        return;
    }
    
    if( !allowedChar  )
    {
        window.event.keyCode = 0; 
        window.event.cancelBubble = true; 
        window.event.returnValue = false;
    }
    updateWindow();
    return;
    
    
    /*
    //Implementation when the pad works even when not in focus
    //Limitation: typing will be concatenated to the end of the value.
    var clickedOn = window.event.keyCode;
           
    var allowedChar = false;
    var clickedOnParsed = String.fromCharCode(clickedOn);
    if(clickedOnParsed == '*' || clickedOnParsed == '#' || 
        clickedOnParsed >= '0' && clickedOnParsed <= '9')
    {
        allowedChar = true;
    }
    
    if( document.selection.createRange().text != "" && clickedOn != 13 )
    {
        if( !allowedChar )
        {
            window.event.keyCode = 0; 
            window.event.cancelBubble = true; 
            window.event.returnValue = false;
        }
        return;
    }
     
     // cancel the handling of the current key, we'll take care of it
     window.event.keyCode = 0; 
     window.event.cancelBubble = true; 
     window.event.returnValue = false;
   
    
    if(clickedOn == 13) // enter
        $("dialBtn").click();
    else
    {
        if( allowedChar )
        {
            pad(clickedOnParsed);   
        }            
    }   
        
    */
       
}

function pad(number) {
  $('dialPopupWindowNumber').value = $('dialPopupWindowNumber').value + number
  updateWindow();
}


DialPadWindow = Class.create();
DialPadWindow.prototype = {
  initialize: function() {
    updateWindow();
    this._connectEvents();
     $('dialPopupWindowNumber').focus();
  },
  
  _connectEvents: function() {   
    $('applyBtn').onclick     = this._applyClicked.bindAsEventListener(this);
    $('cancelBtn').onclick    = this._cancelClicked.bindAsEventListener(this);
  },
  
  
  _applyClicked: function(event) {
     $W().cti.dialFromDialPadWindow($('dialPopupWindowNumber').value);
     $W().removeWindow(window);
     window.close();
  },
  
  _cancelClicked: function(event) {
     $W().removeWindow(window);
     window.close();
  } 
  
}


var dialPadWindow = new DialPadWindow();