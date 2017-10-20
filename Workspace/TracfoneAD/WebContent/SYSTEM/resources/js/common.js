// This function is called upon submiting the login form.
// Please override it if any special handling is required.
function onLogin()
{
    return true;
}

function onKeyDownHandler(e) 
{ 
	var event = e || window.event;
	if(event == null){
		return;		
	}
	var srcElement = event.srcElement||event.target; 
	
	if ( event.keyCode == 8 ) // 8 is backspace - in such case cancel event, unless it is a text area in which we do not want override backspace           
    { 
		if(srcElement.tagName.toUpperCase() != 'INPUT' && 
		   srcElement.tagName.toUpperCase() != 'TEXTAREA')
		
		{
			e.preventDefault();
		}
		// in case of input or text area - cancel the event if the area is not editable
		/*else if(srcElement.isContentEditable == false ||
				srcElement.isDisabled == true ||
				srcElement.readOnly == true) { 
			event.keyCode = 0; 
        	event.cancelBubble = true; 
        	event.returnValue = false; 
		}*/
    }


    else if ( event.keyCode == 116) // f5 key code is 116 - in such case cancel event                  
    { 
        event.keyCode = 0; 
        event.cancelBubble = true; 
        event.returnValue = false; 
    } 
    else 
    {
        if (event.ctrlKey && (event.keyCode == 78 || event.keyCode == 82 || event.keyCode == 79))//78 is N - ctrl+N is new window,79 is O - ctrl+O is to open a window, 82 is R - ctrl+R is refresh 
        {
            event.keyCode = 0; 
            event.cancelBubble = true; 
            event.returnValue = false; 
        }
        else 
        { 
            event.cancelBubble = false; 
            event.returnValue = true; 
        } 
    } 
    if ( event.ctrlKey && event.keyCode == 76 && event.altKey ) { //ctrl+alt+L  - to show the local logger console
        $W().LogManager.showConsole();
    }
   

    
}

function goToOtherPath(id, submit) 
{
    parent.NavigationBarFrame.selectLinkById(id);
    if (submit)
        document.forms[0].submit();
}

function forceEndCall()
{
    parent.parent.callLoggingFlag=true;
    if (parent.parent.frames.CallInfoFrame)
    {
        parent.parent.frames.CallInfoFrame.endCallButton.click();
    }
    if (parent.parent.frames.CTIFrame)
    {
        parent.parent.frames.CTIFrame.endCallButton.click();
    }
    
}

function localOnLoad()
{
   return true;
}
function selectRadio(radio) 
{
    $(radio).checked = true;
}
function selectCheckBox(ckbox)
{
    var inputs = document.getElementsByTagName("INPUT");
    for(var i=0; i<inputs.length; i++){
        if (inputs[i].type == 'checkbox') {
            inputs[i].checked = false;
        }
    }
    document.getElementById(ckbox).checked = true;
}    
String.prototype.ltrim = function () {
  //Match spaces at beginning of text and replace with a null string
  return this.replace(/^\s+/,'');
}

String.prototype.rtrim = function () {
  //Match spaces at end of text and replace with a null string
  return this.replace(/\s+$/,'');
}

String.prototype.trim = function () {
    //Match spaces at beginning and end of text and replace
    //with null strings
    return this.replace(/^\s+/,'').replace(/\s+$/,'');
}

String.prototype.removeBlanks = function () {
  return this.replace('\s','');
}
    
    
function moveFocusForAccessKey()
{   
    $W().focus();
}

function runLink(elementId)
{
    var link = document.getElementById(elementId);
    if (link == null)
        return;
   
    if ((link.style.visibility == 'hidden') || (link.disabled) || (link.style.display == 'none') ||
        (link.parentElement.style.visibility == 'hidden') || (link.parentElement.disabled) || (link.parentElement.style.display == 'none'))           
    {   
        return;
    }  
    link.click();
}    



// SYSTEM level event handlers


function SystemOnLoadHandler()
{
 enableValidation();
 localOnLoad();
}

//support speciel charcters in xml
function encodeXml(s)
{
	//copied from tiny_mce.js
	return s.replace(/[<>&"]/g,function(v){switch(v){case'<':return'&lt;';case'>':return'&gt;';case'&':return'&amp;';case'"':return'&quot;';}
	
	return v;});
}
	
function decodeXml(s){
	//copied from tiny_mce.js
	return s.replace(/[<>&"]/g,function(v){switch(v){case'&lt;':return'<';case'&gt;':return'>';case'&amp;':return'&';case'&quot;':return'"';}
	
	return v;});
}

function getNullSafe(str){
	if(str == null || typeof str == 'undefined'){
		return '';
	}
	return str;
}