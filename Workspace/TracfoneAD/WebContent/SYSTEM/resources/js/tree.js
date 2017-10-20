/**
 *  Sample 'CustomDraggable' object which extends the Rico.Draggable to
 *  override the behaviors associated with a draggable object...
 *
 **/
TreeNodeDraggable = Class.create();

TreeNodeDraggable.prototype = Object.extend( new Rico.Draggable(), {

   initialize: function( node ) {  
      this.type       = 'TreeNodeDraggable';     
      this.node       = node;
      this.htmlElement = node.node;
      this.dragObject = null;
      this.selected   = false;
   },

   select: function() {
      this.selected = true;     
   },

   deselect: function() {
      this.selected = false;
   },

   startDrag: function() {
   },

   cancelDrag: function() {
   },

   endDrag: function() {
   },

   getSingleObjectDragGUI: function() {
      var div = document.createElement("div");
      
      if (this.node.image == null) {
          div.innerHTML = this.node.name;
      } else {
          div.innerHTML = "<img src='" + this.node.image + "'/>" + this.node.name;
      }
      
      div.style.bgcolor = "#E0DDB5";
      div.style.color = "#5B5B5B";
      div.style.border = "1px solid #5B5B5B";
      div.style.filter = "alpha(Opacity=70)";      
      
      
      div.style.width = (this.htmlElement.offsetWidth) + "px";
      div.style.height = (this.htmlElement.offsetHeight) + "px";
      //this line cause exception see WS-986 
      //It looks like it works without this line  
      //new Insertion.Top( div, "" );

      this.dragObject = div;
      return div;
   }

} );


var TreeNodeDropzone = Class.create();

TreeNodeDropzone.prototype = Object.extend( new Rico.Dropzone(), {

   initialize: function(node) {
      this.node = node;
      this.htmlElement  = node.node;

      this.savedBackgroundColor = this.node.node.style.backgroundColor;
      this.savedColor = this.node.node.style.color;
      
      this.currDraggableObjects = null;
   },

   showHover: function() {
      if (this.showingHover)
         return;

      this.node.node.style.backgroundColor = "blue";      
      this.node.node.style.color = "white";
      
      this.showingHover = true;
   },

   hideHover: function() {
      if (!this.showingHover )
         return;

      this.node.node.style.backgroundColor = this.savedBackgroundColor;
      this.node.node.style.color = this.savedColor;

      this.showingHover = false;
   },
   
   activate: function() {
   },
   
   deactivate: function() {
   },
   
   accept: function(draggableObjects) {  
      n = draggableObjects.length;
      for ( var i = 0 ; i < n ; i++ ) {
         var aDraggable = draggableObjects[i];
         
         aDraggable.node.tree.deleteNode(aDraggable.node);
         this.node.appendChild(aDraggable.node);
      }
      
   },

   canAccept: function(draggableObjects) {
      n = draggableObjects.length;
      for ( var i = 0 ; i < n ; i++ ) {
         var aDraggable = draggableObjects[i];
         
         if (aDraggable.type != 'TreeNodeDraggable') {
            return false;
         }
         
         var currNode = this.node;
         while (currNode != aDraggable.tree) {

             if (currNode == aDraggable.node) {
                return false;
             }
         
            currNode = currNode.container;
         }
         
      }
 
      return true;
   }

} );

Tree = Class.create();
Tree.prototype = {
  initialize: function(container, enableDrag) {
    this.container = $(container);
    this.enableDrag = true;
        
    if (enableDrag != null) {
        this.enableDrag = enableDrag;
    }
    
    this.tooltipEnabled = false;
    
    this.selected = null;
    this.nodes = new Array();
  },

  appendChild: function(node) {
    node.container = this;
    this.container.appendChild(node.table);
    this.nodes.push(node);
  },

  insertChild: function(node, index) {
    node.container = this;
    var existNode = this.nodes[index];
    this.nodes.insert(index, node);
   
    this.container.insertBefore(node.table, existNode.table);
  },
  
  deleteNode: function(node) {
    if (node.container == this) {
        this.container.removeChild(node.table);                
        this.nodes.remove(node);
    } else {
        node.container.deleteNode(node);    
    }
  },
  
  getTree: function() {
    return this;
  },
   
  _selectNode: function() {
  	this.selected.node.className = "navbarlinkselected";
  },

  setSelectedNode: function(newNode) {
    this._setSelectedNode(newNode, true);
  },

  setSelectedNodeNoEvent: function(newNode) {
    this._setSelectedNode(newNode, false);
  },

  _setSelectedNode: function(newNode, sendEvent) {
    if (this.selected) {
      this._unselectNode();
    }
    this.selected = newNode;    
    if (this.selected != null) {
    
      this._selectNode();
    
      if (sendEvent && this.onselected) {
        this.onselected(this.selected);
      }
    }
  },
  
  _unselectNode: function() {
  	this.selected.node.className = "navbarlinkunselected";
  }
}

TreeNode = Class.create();
TreeNode.prototype = {
  initialize: function(container, name, folder, image) {
    this.container = container;
    this.tree = this.container.getTree();
    this.name = name;
    this.image = image;
    this.opened = true;
    this.folder = folder;
    this.nodes = new Array();
    
    this._createNode();
  },

  _createNode: function() {
    this.table = document.createElement('table');
    this.table.cellPadding = 0;
    this.table.cellSpacing = 0;
    
    var row = this.table.insertRow();
    var cell = row.insertCell();
    cell.style.width = "10px";
    
    this.sign = document.createElement('div');
    this.sign.style.cursor = "hand";
    this.sign.innerHTML = "";
    if (this.folder) {
        this.sign.onclick = this._toggleNode.bindAsEventListener(this);
    }
    this.sign.style.width = "10px";
        
    cell.appendChild(this.sign);
    
    cell = row.insertCell();

    this.node = document.createElement('div');
	this.node.className = "navbarlinkdefault";
    
    if (this.folder) {
        this.node.ondblclick = this._toggleNode.bindAsEventListener(this);
    }
    
    this.setName(this.name);
    
    this.node.onclick = this._selectNode.bindAsEventListener(this);
    cell.appendChild(this.node);
    
    row = this.table.insertRow();
    cell = row.insertCell();
    
    cell = row.insertCell();

    this.nodesElement = document.createElement('div');
    
    cell.appendChild(this.nodesElement);
    
    this.container.appendChild(this);
    
    if (this.tree.enableDrag) {
       dndMgr.registerDraggable (new TreeNodeDraggable(this));
       if (this.folder) {
         dndMgr.registerDropZone (new TreeNodeDropzone(this));
       }
    }    
  },
  
  _toggleNode: function(event) {
    if (this.opened) {
        this.sign.innerHTML = "+";
        this.nodesElement.style.display = 'none';
    } else {
        this.sign.innerHTML = "-";
        this.nodesElement.style.display = 'block';
    }
    
    this.opened = !this.opened;
  },
  
  _selectNode: function(event) {   
    this.tree.setSelectedNode(this);
  },
  
  setName: function(newName) {
    this.name = newName;

    var innerHTML = '<nobr>';
    if (this.tree.tooltipEnabled) {
        innerHTML += '<span title="' + this.name + '">';    
    }
    
    if (this.image != null) {
       innerHTML += '<img src="' + this.image + '"/>';
    }
    
    innerHTML += this.name;

    if (this.tree.tooltipEnabled) {
        innerHTML += '</span>';
    }
    innerHTML += '</nobr>';
    
    this.node.innerHTML = innerHTML;
  },

  deleteNode: function(node) {
    this.nodesElement.removeChild(node.table);
    this.nodes.remove(node);
    
    if (this.nodes.length == 0) {
        this.sign.innerHTML = '';
    }
  }, 
    
  appendChild: function(node) {
    node.container = this;
    this.nodesElement.appendChild(node.table);      
    this.nodes.push(node);

    if (this.opened) {
        this.sign.innerHTML = "-";
    } else {
        this.sign.innerHTML = "+";
    }

  },

  insertChild: function(node, index) {
    node.container = this;
    var existNode = this.nodes[index];
    this.nodes.insert(index, node);
   
   this.nodesElement.insertBefore(node.table, existNode.table);
  },
  
  setVisible: function(value) {
     if (this.visible == value) {
        return;
     } 
     this.visible = value;    
     this.table.style.display = value ? 'block' : 'none';
  },
  
  getTree: function() {
    return this.tree;
  }
  
}

