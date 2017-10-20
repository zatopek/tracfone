/** @ignore */
Array.prototype.indexOf =function(item){
	var length =this.length;
	if (length !=0){
		for (var index =0;index <length;index++){
			if (this[index]==item){
				return index;
			}
		}
	}
	return -1;
}

Array.prototype.insert =function(index,item){
	this.splice(index,0,item);
}

Array.prototype.remove =function(item){
	var index =this.indexOf(item);
	if (index >=0){
		this.splice(index,1);
	}
}

Array.prototype.removeAt =function(index){
	this.splice(index,1);
}

Boolean.parse =function(value){
	if (typeof(value)=='string'){
		return (value.toLowerCase()=='true');
	}
	return value ?true :false;
}

var currURL = null;
var currNewWindow = false;

/*
 * Presents the relevant page when a favorite is clicked from the Favorites portlet
 *  url - The page's url
 * 	newWindow - A boolean that indicates if the page should be opened in a new window or in the Favorites tab
 * 	name - The displayed favorite's name
 */
function openFavorite(url, newWindow, name) {
    currURL = url;
    currNewWindow = newWindow;
    if(newWindow)
    {
        if (url.toLowerCase().indexOf("http")!=-1)
            window.open(url);
        else {
            var baseUrl=window.location.protocol+"//"+window.location.host+"/";
            var appName=window.location.href.slice(baseUrl.length);
            appName=appName.slice(0,appName.indexOf('/')+1);
            window.open(baseUrl+appName+url);
        }
    }
    else
    {
    	$W().ShowTabById('FavoritesTab');
 	   if($W().isFavoritesTabTitleDynamic){
		   $W().setTabTitle("FavoritesTab", $W().localeManager.getLocalizationValue(name));
	   }
	  $W().loadintoIframe('FavoritesFrame', url);   
    }
  
}

Favorites = Class.create();
Favorites.prototype = {
  initialize: function() {
    this._createTree();
  },
   
  _createTree: function() {
  //debugger;
    this.tree  = new Tree('tree',false);
  
    this.onFavoritesListForFavLayoutHandler = this._onFavoritesListForFavLayout.bind(this);
    $W().Push.registerEventHandler( 'favorites_list_for_layout', this.onFavoritesListForFavLayoutHandler);    
    
    var url = 'Controller.jpf';
    var pars = 'action=getFavoritesForLayouts';

    new Ajax.Request(url, { method: 'get', asynchronous : false , parameters: pars });
  },

  _onFavoritesListForFavLayout: function(xmlStr) {
    //debugger;
    var flag = $W().Push.unregisterEventHandler( 'favorites_list_for_layout', this.onFavoritesListForFavLayoutHandler);    
    if (flag == false) {
        var msg = "in _onFavoritesListForFavLayout - unregistering to favorites_list messages failed";
        $W().LogManager.getLogger("FavoritesJS").error(msg);
    }
    
    this.favoritesNodeKey = "application.javascript.menuBar.menu.favorites";
    this.favoritesNode = new TreeNode(this.tree, $W().localeManager.getLocalizationValue(this.favoritesNodeKey), true, 'folder.jpg');

    // create the XML DOM
    var xmlDoc = RicoUtil.createXmlDocument();
    xmlDoc.async = false;
    xmlDoc.loadXML(xmlStr);
    
    var menus = xmlDoc.getElementsByTagName('menus')[0]; 
    if (menus != null) {
       this._createTreeNodes(menus, this.favoritesNode);
    }

    this.tree.setSelectedNode(this.favoritesNode);
    
    if( parent.lymgr.enablePageVerticalScroll && parent.document.getElementById('FavoritesPortlet_Main').parentElement.className != 'avportlet' )
    {
        parent.document.getElementById('FavoritesPortlet_Main').height = parseInt( this.tree.container.children[0].scrollHeight ) + 52;
    }
        
  }, 
  
    _createTreeNodes: function(domnode, container) {
    if (domnode.childNodes == null) {
       return;
    }
    
    var length = domnode.childNodes.length;
    for (var pos=0; pos<length; pos++) {
        var childDOMNode = domnode.childNodes[pos];

        var folder = true;
        var image = null;

        var name = childDOMNode.getAttribute("name");
        var value = childDOMNode.getAttribute("value");
               
        if (value !=  null) {
            //eval(value.substring(value.indexOf(':') + 1));
            name = '<a href="' + value + '" title="' + name + '">' + name + '</a>';
            
            folder = false;
            image = 'ie.jpg';
        } else {
            currURL = null;
            name = '<span title="' + name + '">' + name + '</span>';

            image = 'folder.jpg';
        }
        
        var childNode = new TreeNode(container, name, folder, image);
        if (!folder) {
            childNode.url = currURL;
            childNode.inNewWindow = currNewWindow;
        }
             
        this._createTreeNodes(childDOMNode, childNode);
    }
  }
  

 
  
}


var favorites = new Favorites();