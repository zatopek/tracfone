navTree = null;

// check the nextSelection variable, and if it contains
// the id of the next selected link, click on this link
function checkNextSelection() {
    if(window.nextSelection && nextSelection != null && nextSelection.length > 0) {
        var node = getNodeById(navTree.nodes, nextSelection);
        if (node != null) {
            navTree.setSelectedNode(node);
        }
    }
}

function navBarSelectLink(node) {
  var pars = 'action=select&path=' + node.path + '&last=';
  
  new Ajax.Request('NavigationBarController.jpf', 
           { method: 'get', asynchronous : false , parameters: pars });

  if (node.url != null) { 
    var frameName = 'frame_' + node.tabId;
    var frame = parent.loadintoIframe(frameName, node.url);
    
    if (node.container == node.tree) {
       node.url = null;
    }
  }
  
  if (navTree != null) {
      navTree.setSelectedNodeNoEvent(node);
  } 
  parent.ShowNavTabById(node.tabId);
}

function selectLinkById(id) {
    if (navTree == null) {
      return;
    } 
    
    var node = getNodeById(navTree.nodes, id);
    if (node != null) {
      navTree.setSelectedNode(node);
    }
}

function clickOnLink(id) {
    if (navTree == null) {
        return;
    }

    var node = getNodeById(navTree.nodes, id);
    return navBarSelectLink(node);
}

function ____clickOnLink(id) {
    if (navTree == null) {
      return;
    } 
    var node = getNodeById(navTree.nodes, id);
    if (node != null) {
      if (node.currChild != null) {
        node = node.currChild
      }

      navTree.setSelectedNodeNoEvent(node);

      var pars = 'action=select&path=' + node.path + '&last=';
  
      new Ajax.Request('NavigationBarController.jpf', 
           { method: 'get', asynchronous : false , parameters: pars });


      parent.ShowNavTabById(node.tabId);
    }
}

function getNodeById(nodes, id) {
  if (nodes != null) {
    var i;
    for (i=0; i<nodes.length; i++) {
      var node = nodes[i];
      if (node.path == id) {
        return node;
      }
      
      node = getNodeById(node.nodes, id);
      if (node != null) {
        return node;
      }
    }
  }
  return null;
}

function getNodeByUrl(nodes, url) {
  if (nodes != null) {
    var i;
    for (i=0; i<nodes.length; i++) {
      var node = nodes[i];
      if (node.url == url) {
        return node;
      }
      
      node = getNodeByUrl(node.nodes, url);
      if (node != null) {
        return node;
      }
    }
  }
  return null;
}

function syncNavBar(url) {
  if (parent.NavigationBarFrame)
  {
    parent.NavigationBarFrame.syncNodeByUrl(url);
  }
}

function syncNodeByUrl(url) {
 var selected = navTree.selected;
  if (selected != null && selected.url == url) {
    return;
  }
  
  var node = getNodeByUrl(navTree.nodes, url);
  if (node != null) { 
    navTree.setSelectedNodeNoEvent(node);
    
    // set the parent last child
    if (node.container != node.tree) {
      node.container.currChild = node;
    }
  }
}

// called when 'Back' is pressed
function doBack()
{
    var backForm = $('backButtonForm');
    if (backForm != null) {
       backForm.action = "goBack.do";
       backForm.submit();
    }
   
}

// called when 'Next' is pressed, or a radio button navigation is done
function doNext()
{
    submitForm(0);
}

// submit the form by its index in the document
function submitForm(index) {
    var form = document.forms[index];
    if(form != null) {
        if(form.onsubmit == null){
            form.submit();
            return;
        }
        var tmp = form.onsubmit();
        if(tmp == null || tmp == true) {
            form.submit();
        }
    }
}

// Check whether the direction input field has "back" value
function isGoingBack() {
    var backForm = $('backButtonForm');   
    if(backForm != null && backForm.action == "goBack.do") {
        return true;
    }
    return false;
}

// check that there is one selected radio button in the first form
// needed for FAQ pages
function checkSelection() {
    if(isGoingBack()) {
        return true;
    }

    var form = document.forms[0];
    var selected = false;
    var elements = form.elements;
    for(i = 0; i < elements.length; i++) {
        var element = elements[i];
        if(element.type == "radio" && element.checked) {
             return true;
        }
    }
    alert($W().localeManager.getLocalizationValue("application.javascript.message.alert.selectSomeOption"));
    return false;
}

// a proxy function for the branch tag 'continue on selection' feature
function continueOnSelection(el)
{   
    // to disable continue on selection of a radio button, just uncomment next line:
    // return;
         
    doNext();
}

/*


// selects a link in the navigation bar
function selectLink(path) {
    var form = document.forms[0];
    var elements = form.elements;
    for(i = 0; i < elements.length; i++) {
        var element = elements[i];
        if(element.type == 'hidden' && element.id == '{actionForm.select}') {
            element.value = path;
            return;
        }
    }
}

// selects a link in the navigation bar 
function selectLinkbyUrl(url) {

    var navBarDoc = parent.NavigationBarFrame.document;
    var matchExist = false;
    
   //find whether a match exists
    var elements = navBarDoc.getElementsByTagName("A");
    for(i = 0; i < elements.length; i++) {
        var element = elements[i];
        var tmp = element.href;
        
        if(tmp.indexOf(url) != -1) {
            matchExist = 'true';
        }
    }
    
    
    if(matchExist)
    {
        //reset selected link
        var classElements = navBarDoc.getElementsByClassName('navbarlinkselected');
        if(classElements[0] )
        {
            var classElement = classElements[0];
            classElement.className = 'navbarlink';
            if( classElement.parentElement.className == 'navbarlink2selected')
            {
                classElement.parentElement.className = 'navbarlink2';
            }
            if( classElement.parentElement.className == 'navbarlink1selected')
            {
                classElement.parentElement.className = 'navbarlink1';
            }  
        }
    
    
        //make the selection
        for(i = 0; i < elements.length; i++) {
            var element = elements[i];
            var tmp = element.href;
            
            if(tmp.indexOf(url) != -1) {
                matchExist = 'true';
                element.className = 'navbarlinkselected';
                if(element.parentElement.className == 'navbarlink2')
                {
                    element.parentElement.className = 'navbarlink2selected';
                }
                if(element.parentElement.className == 'navbarlink1')
                {
                    element.parentElement.className = 'navbarlink1selected';
                }
                return;
            }
        }
    }
}    
  
// clicks on link by its id
function clickOnLink(id) {
    var link = document.getElementById(id);
    if(link != null) {
        link.click();
    }
}



*/
//perform submit to the navigation bar, to reload selected from the wrapper
function navSubmit() {
/*
    var navBarDoc = parent.NavigationBarFrame.document;
    var form = navBarDoc.forms[0];
    if(form != null)
    {
        form.submit();
    }
*/    
}
/*
//THIS FUNCTION IS NOT IN USE AND CAN BE REMOVED
//Show call Disposition in the navigation bar
function showCallDisposition(){
    var navBarDoc = parent.NavigationBarFrame.document;
    var elements = navBarDoc.getElementsByTagName("TD");
    for(i = 0; i < elements.length; i++) {
        var element = elements[i];
        if(element.style.display == 'none') {
            element.style.display = '';
            return;
        }
    }
}
*/

//Navigation Tabs and TabSet
function ShowNavTabById(tabId) {
  if (document.getElementById(tabId)) {
     var tabElement = document.getElementById(tabId);
     ShowTabNav(tabElement);
  }
}

function ShowTabNav(tabElement) {
  HideAllNavTabs(tabElement);
 
  var frameName = tabElement.id + "Frame";
  var frameElement = document.getElementById(frameName);

  frameElement.style.display='inline';
  tabElement.className = "curr";
}

function HideAllNavTabs(tabElement) { 
  var parentElement = tabElement.parentElement;
  var children = parentElement.children;
  for(i = 0; i < children.length; i++) {
    if (children(i).className != "def") {
      children(i).className = "def"; 
    }
  }
  var frameName = tabElement.id + "Frame";
  var frameElement = document.getElementById(frameName);
 
  var framesElement = frameElement.parentElement;
  children = framesElement.children;
  for(i = 0; i < children.length; i++) children(i).style.display='none';
}

function ShowTabNavEvent(e) {
  var event = e || window.event;
  var el = event.srcElement || event.target;
  var tabElement = GetTabHeaderElement(el);
  HideAllNavTabs(tabElement);
 
  var frameName = tabElement.id + "Frame";
  //var frameElement = document.getElementById(frameName);
  var frameElement = parent.document.getElementById(frameName);

  frameElement.style.display='inline';
  tabElement.className = "curr";
}

function ShowCallLogging() {
	  // var tree = $W().frames[10].NavigationBarFrame.tree;
      if (($W().ScriptZone.NavigationBarFrame != null) && ($W().ScriptZone.NavigationBarFrame.tree != null)) 
      {
        var tree = $W().ScriptZone.NavigationBarFrame.tree;
        for( var i=0; i < tree.children.length ; i++ )
        {
            // displaying all the nodes of the call logging
            if( tree.children[i].innerHTML.indexOf('Wrap Up') != -1 )
            {
                 tree.children[i].style.display = 'block';
            }
        }
    }   
}

/*
This function disables/enables a link in the left navigation bar portlet.
linkText is a partial text as appears in the relevant link
disable should be either true(disable) or false(enable)
*/
function DisableNavigationBarLink(linkText, disable) {
      if (($W().ScriptZone.NavigationBarFrame != null) && ($W().ScriptZone.NavigationBarFrame.tree != null)) 
      {
        var tree = $W().ScriptZone.NavigationBarFrame.tree;
        var imgElements = tree.getElementsByTagName('img');
        for( var i=0, lenI = imgElements.length; i < lenI ; i++ )
        {
            if(imgElements.item(i).parentNode.innerText.indexOf(linkText) != -1 )
            {
                imgElements.item(i).parentNode.parentNode.disabled = disable;
                break;
            }
        }
    }   
}
