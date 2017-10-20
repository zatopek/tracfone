
document.body.scroll="no";   
var currentForm;
function findEnclosingForm(elem) {
   var currElem = elem;
   while (currElem.tagName!='FORM') {
       currElem = currElem.parentElement;
   }
   return currElem;
}

function findEnclosingId(elem,id) {
   var currElem = elem;
   while (currElem.id.indexOf(id)<0) {
       currElem = currElem.parentElement;
   }
   return currElem;
  
}
function onSubmitValidation() {
    if (onSubmitValidationInternal()) {
        return doSubmit();
    }
}

function doSubmit() {
    currentform = findEnclosingForm(window.event.srcElement);
    var elem = findEnclosingId(currentform,'scriptArea');
    var j=elem.id.substring(10);
    if (j != '') {
        var last=$('scriptArea');
        while (last!= null && last.id != elem.id) {
            var par = last.parentElement;
            par.removeChild(last);
            last=par;
        }
        elem.id="scriptArea";
        i=j+1;
    }
      var getstr = Form.serialize(currentform);
      //syncNavBar(currentform.action);

      new Ajax.Request(currentform.action, { method: 'get', parameters: getstr, onSuccess : onScript });
      return false;
   }

var i=0;
function onScript(param) {
    var elem = document.createElement('div');
    elem.innerHTML=param.responseText
    var scriptArea = $("scriptArea");
    scriptArea.id='scriptArea'+i;
    i++;
    //elem.style.backgroundColor="#FFFFFF";
    scriptArea.appendChild(elem);
    //window.scrollTo(0,1000000);
    elem=$("scriptArea0");
    if (elem!= null) {
       //elem.doScroll("scrollbarPageDown");
       ///setTimeout('$("scriptArea0").scrollIntoView(true);',300);
       //elem.scrollIntoView(true);
       document.forms[document.forms.length-1].scrollIntoView(true);
       document.forms[document.forms.length-1].doScroll();
    }
    elem=$("scriptArea");
    if (elem!=null) {
        syncNavBar(elem.children[0].id);
        elem.className = "selectedForm";
        elem.parentElement.parentElement.className = "notSelectedForm";
        var form = elem.getElementsByTagName('FORM')[0];
        var button = document.createElement('div');
        button.innerHTML='<input type="submit" value="Next">'
        form.appendChild(button);
    }

}


function continueOnSelection(el)
{   
    // to disable continue on selection of a radio button, just uncomment next line:
    return;
    var currentform = findEnclosingForm(window.event.srcElement);
    currentform.submit();     
    
}

 
function selectCheckBox(ckbox)
{
    var currentform = findEnclosingForm(window.event.srcElement);
    var inputs = currentform.all.tags("INPUT");
    for(var i=0; i<inputs.length; i++){
        if (inputs[i].type == 'checkbox' && inputs[i].id!=ckbox) {
            inputs[i].checked = false;
        }
    }
    
}    
 

function localDoNext() {
    var form = findEnclosingForm(window.event.srcElement);
    if(form != null) {
        if (form.action == "goBack.do") {
            return;
        }
    }

    if (onSubmitValidationInternal()) {
        $W().cti.startCallDisposition();
    }
}


 

