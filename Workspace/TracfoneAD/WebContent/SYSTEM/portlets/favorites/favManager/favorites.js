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

function openFavorite(url, newWindow) {
    currURL = url;
    currNewWindow = newWindow;
}

Favorites = Class.create();
Favorites.prototype = {
  initialize: function() {
    this._connectEvents();
    this._createTree();
  },
  
  _connectEvents: function() {
    $('addBtn').onclick        = this._addClicked.bindAsEventListener(this);
    $('updateBtn').onclick        = this._updateClicked.bindAsEventListener(this);
    $('newFolderBtn').onclick = this._newFolderClicked.bindAsEventListener(this);
    $('editBtn').onclick      = this._editClicked.bindAsEventListener(this);
    $('deleteBtn').onclick    = this._deleteClicked.bindAsEventListener(this);
    $('applyBtn').onclick     = this._applyClicked.bindAsEventListener(this);
    $('cancelBtn').onclick    = this._cancelClicked.bindAsEventListener(this);
  },
  
  _createTree: function() {
    this.tree  = new Tree('tree');
    this.tree.tooltipEnabled = true;
    this.tree.onselected = this._nodeSelected.bindAsEventListener(this);
  
    this.onFavoritesListHandler = this._onFavoritesList.bind(this);
    $W().Push.registerEventHandler( 'favorites_list', this.onFavoritesListHandler);    
    
    var url = '../Controller.jpf';
    var pars = 'action=getFavorites';

    new Ajax.Request(url, { method: 'get', asynchronous : false , parameters: pars });
  },

  _onFavoritesList: function(xmlStr) {
    var flag = $W().Push.unregisterEventHandler( 'favorites_list', this.onFavoritesListHandler);    
    if (flag == false) {
        var msg = "in _onFavoritesList - unregistering to favorites_list messages failed";
        $W().LogManager.getLogger("FavoritesJS").error(msg);
    }
    //debugger;
    this.favoritesNodeKey = "application.javascript.menuBar.menu.favorites";
    this.favoritesNode = new TreeNode(this.tree, $W().localeManager.getLocalizationValue(this.favoritesNodeKey), true, '../folder.jpg');

    // create the XML DOM
    var xmlDoc;
    
    if (typeof DOMParser != "undefined") {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(xmlStr, "text/xml");
    } else {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async=false;
        xmlDoc.loadXML(xmlStr);
    }
    
    var menus = xmlDoc.getElementsByTagName('menus')[0]; 
    if (menus != null) {
       this._createTreeNodes(menus, this.favoritesNode);
    }

    this.tree.setSelectedNode(this.favoritesNode);
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
            eval(value.substring(value.indexOf('openFavorite')));
            folder = false;
            image = '../ie.jpg';
        } else {
            currURL = null;
            image = '../folder.jpg';
        }
        
        var childNode = new TreeNode(container, name, folder, image);
        if (!folder) {
            childNode.url = currURL;
            childNode.inNewWindow = currNewWindow;
        }
        
        this._createTreeNodes(childDOMNode, childNode);
    }
  },
  
  _saveData: function() {
     var data = '<menus>';
    
     data += this._saveNodesData(this.tree.nodes);
     
     data += '</menus>';
     return data;
  },

  _saveNodesData: function(nodes) {
    if (nodes == null || nodes.length == 0) {
       return '';
    }

    var data = '';
    
    for (var pos=0; pos<nodes.length; pos++) {    
      var itemData = this._saveNodeData(nodes[pos]);
      if (itemData != null) {
         data += itemData;
      }
    }

    return data;   
  },

  _saveNodeData: function(node) {
  	var name = node.name;
  	if (node == this.favoritesNode) {
  		name = this.favoritesNodeKey;
  	}
    var itemData = '<item name="' + name + '"';
    
    if (node.folder) {
      if (node.nodes == null || node.nodes.length == 0) {
        itemData += '/>';
      } else {
        itemData += '>';
        
        itemData += this._saveNodesData(node.nodes);
        
        itemData += '</item>';
      }
    } else {
    
      var newWindow = false;
      if (node.inNewWindow) {
         newWindow = true;
      }
      
      var value = "openFavorite('" + node.url + "', " + newWindow + ", '" + name + "');";
      itemData += ' value="' + value + '"';
      
      itemData += '/>';
    }
    return itemData;
  },
  
  _isExist: function(parent, node, name) {
    if (parent.nodes == null || parent.nodes.length == 0) {
       return false;
    }
    
    for (var pos=0; pos<parent.nodes.length; pos++) {    
      var child = parent.nodes[pos];
      
      if (node != null && child == node) {
         continue;
      }
      
      if (child.name == name) {
        return true;
      } 
    }

    return false;  
  },
    
  // Events
  _nodeSelected: function(node) {    
  },
  
  _addClicked: function(event) {
    var name = $F('name');
    if (name == null || name.length == 0) {
        alert($W().localeManager.getLocalizationValue('application.javascript.favManager.alert.nameOfFavorite'));
        $('name').focus();
        return;
    }
    
    var url = $F('url');
    if (url == null || url.length == 0) {
        alert($W().localeManager.getLocalizationValue('application.javascript.favManager.alert.urlForFavorite'));
        $('url').focus();
        return;
    }
    
    var selectedNode = this.tree.selected;
    if (selectedNode == null) {
        selectedNode = this.favoritesNode;
    } else {
        if (!selectedNode.folder) {
            alert($W().localeManager.getLocalizationValue('application.javascript.favManager.alert.selectFolderFirst'));
            return;
        }
    }
    
    if (this._isExist(selectedNode, null, name)) {
       alert($W().localeManager.getLocalizationValue('application.javascript.favManager.alert.favoriteNamed') + ' "' + name + '" ' + $W().localeManager.getLocalizationValue('application.javascript.favManager.alert.alreadyExists'));
       return;
    }

    var newNode = new TreeNode(selectedNode, name, false, '../ie.jpg');
    newNode.url = url;
    newNode.inNewWindow = document.getElementsByName("newWindow")[0].checked;
       
    this.tree.setSelectedNode(newNode);
    
  //return to default
    $('name').value = '';
    $('url').value = '';
    document.getElementsByName("newWindow")[0].checked=true;
    document.getElementsByName("newWindow")[1].checked=false;

    
  },

  _updateClicked: function(event) {
    if (this.editNode == null) {
      return;
    }
   
    var name = $F('name');
    if (name == null || name.length == 0) {
        alert($W().localeManager.getLocalizationValue('application.javascript.favManager.alert.nameOfFavorite'));
        $('name').focus();
        return;
    }
    
    var url = $F('url');
    if (url == null || url.length == 0) {
        alert($W().localeManager.getLocalizationValue('application.javascript.favManager.alert.urlForFavorite'));
        $('url').focus();
        return;
    }
    if (this._isExist(this.editNode.container, this.editNode, name)) {
       alert($W().localeManager.getLocalizationValue('application.javascript.favManager.alert.favoriteNamed') + ' "' + name + '" ' + $W().localeManager.getLocalizationValue('application.javascript.favManager.alert.alreadyExists'));
       return;
    }
        
    this.editNode.setName(name);
    this.editNode.inNewWindow = document.getElementsByName("newWindow")[0].checked;
    this.editNode.url = $F('url');
        
    $('addBtn').style.display = 'block';
    $('updateBtn').style.display = 'none';
//return to default
    $('name').value = '';
    $('url').value = '';
    document.getElementsByName("newWindow")[0].checked=true;
    document.getElementsByName("newWindow")[1].checked=false;
    
    this.editNode = null;
  },
  
  _newFolderClicked: function(event) {
    var selectedNode = this.tree.selected;
    if (selectedNode == null) {
        selectedNode = this.tree;
    }
    
    if (!selectedNode.folder) {
        alert($W().localeManager.getLocalizationValue('application.javascript.favManager.alert.newFolderOnlyUnderFolder'));
        return;
    }

    var name = window.prompt($W().localeManager.getLocalizationValue('application.javascript.favManager.prompt.folderName'),'');
    if (name == null || name.length == 0) {
        return;
    }

    if (this._isExist(selectedNode, null, name)) {
       alert($W().localeManager.getLocalizationValue('application.javascript.favManager.alert.favoriteNamed') + ' "' + name + '" ' + $W().localeManager.getLocalizationValue('application.javascript.favManager.alert.alreadyExists'));
       return;
    }

    var newNode = new TreeNode(selectedNode, name, true, '../folder.jpg');
    this.tree.setSelectedNode(newNode);
  },
  
  _editClicked: function(event) {
    var selectedNode = this.tree.selected;
    if (selectedNode == null) {
        alert($W().localeManager.getLocalizationValue('application.javascript.favManager.alert.itemToEdit'));
        return;
    }

    var name = selectedNode.name;
    var url = selectedNode.url;
    
    if (url == null) {
		if( name == 'Favorites' )
            return;
        var newName = window.prompt($W().localeManager.getLocalizationValue('application.javascript.favManager.prompt.newFolderName'),name);
        if (newName == null) {
          return;
        }
        
        if (this._isExist(selectedNode.container, selectedNode, newName)) {
           alert($W().localeManager.getLocalizationValue('application.javascript.favManager.alert.favoriteNamed') + ' "' + name + '" ' + $W().localeManager.getLocalizationValue('application.javascript.favManager.alert.alreadyExists'));
           return;
        }
        
        selectedNode.setName(newName);        
    } else {
        $('name').value = name;
        $('url').value = url;
        document.getElementsByName("newWindow")[0].checked=selectedNode.inNewWindow;
        document.getElementsByName("newWindow")[1].checked=!selectedNode.inNewWindow;
        
        this.editNode = selectedNode;
        
        $('addBtn').style.display = 'none';
        $('updateBtn').style.display = 'block';
    }

  },
  
  _deleteClicked: function(event) {
    var selectedNode = this.tree.selected;
    if (selectedNode == null) {
        alert($W().localeManager.getLocalizationValue('application.javascript.favManager.alert.itemToDelete'));
        return;
    }
    
    if (selectedNode == this.favoritesNode) {
        alert($W().localeManager.getLocalizationValue('application.javascript.favManager.alert.deleteFavorites'));
        return;
    }
    
    if (confirm($W().localeManager.getLocalizationValue('application.javascript.favManager.confirm.areYouSure'))) {
        this.tree.deleteNode(selectedNode);
        this.tree.setSelectedNode(this.favoritesNode);
    }
  },
  
  _applyClicked: function(event) {
     
     var url = '../Controller.jpf';
     var data = encodeURIComponent(this._saveData());
     var postData = 'action=saveFavorites&data=' + data;
    
     new Ajax.Request(url, { method: 'post', asynchronous : false, postBody: postData });
     $W().removeWindow(window);
     window.close();
  },
  
  _cancelClicked: function(event) {
     $W().removeWindow(window);
     window.close();
  } 
  
}


var favorites = new Favorites();