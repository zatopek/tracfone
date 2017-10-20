
// Panel Functions

var selectedGroup=new Object();
var selectedGroupTL=0;
var selectedGroupTD=0;
var selectedGroupH=0;
var selectedGroupEIA=false;

function ShowPanel() {
  if (selectedGroupEIA) {
    return;
  }

  var buttonElement = window.event.srcElement;
  
  // Get child element
  var child = document.getElementById(buttonElement.getAttribute("child", false));
  if (child == null) {
     buttonElement = buttonElement.parentElement;
     child = document.getElementById(buttonElement.getAttribute("child", false));
  }

  selectedGroup = child;
  if(child.style.display=='inline'){
    buttonElement.className="panelHeaderClosed";
    selectedGroupH=child.offsetHeight;
    ElementClose(0);
  }else{
    buttonElement.className="panelHeaderOpened";
    child.style.display='inline';
    selectedGroupH=child.offsetHeight;
    child.style.height=1;
    ElementOpen(selectedGroupH);
  }
}

function onPanelTextHover(){
  var buttonElement = window.event.srcElement;
  
  var text = document.getElementById(buttonElement.getAttribute("text", false));
  if (text == null) {
     text = buttonElement;
  }

  text.className='panelTextHvr';
}

function onPanelTextOut(){
  var buttonElement = window.event.srcElement;
  
  var text = document.getElementById(buttonElement.getAttribute("text", false));
  if (text == null) {
     text = buttonElement;
  }

  text.className='panelText';
}

function ElementOpen(l){
  var RES=3;
  selectedGroupEIA=true;
  selectedGroupTL=l;
  if (selectedGroupTL==0) {
    selectedGroup.style.height=selectedGroupH;
    selectedGroupEIA=false;
  } else {
    if (selectedGroupTL<=RES) {
      selectedGroupTD=1;
    } else {
      selectedGroupTD=parseInt(selectedGroupTL/RES);
    }
    if (selectedGroupH!=selectedGroupTL) {
      selectedGroup.style.height=selectedGroupH-selectedGroupTL;
    }
    setTimeout('ElementOpen(selectedGroupTL-selectedGroupTD);',25);
  }
}

function ElementClose(l){
  var RES=6;
  selectedGroupEIA=true;
  selectedGroupTL=l;
  if (selectedGroupH==selectedGroupTL) {
    selectedGroup.style.display='none';
    selectedGroup.style.height=selectedGroupH;
    selectedGroupEIA=false;
  } else {
    if ((selectedGroupH-selectedGroupTL)<=RES) {
      selectedGroupTD=1;
    } else {
      selectedGroupTD=parseInt((selectedGroupH-selectedGroupTL)/RES);
    }
    selectedGroup.style.height=selectedGroupH-selectedGroupTL;
    setTimeout('ElementClose(selectedGroupTL+selectedGroupTD);',10);
  }
}

function getElementsByClassName(oElm, strTagName, strClassName){
    var arrElements = (strTagName == "*" && document.all)? document.all : oElm.getElementsByTagName(strTagName);
    var arrReturnElements = new Array();
    strClassName = strClassName.replace(/\-/g, "\\-");
    var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
    var oElement;
    for(var i=0; i<arrElements.length; i++){
        oElement = arrElements[i];      
        if(oRegExp.test(oElement.className)){
            arrReturnElements.push(oElement);
        }   
    }
    return (arrReturnElements)
}



