HideArea = Class.create();

HideArea.prototype = {
   initialize: function( container, titleBarElement, contentBoxElement, vertical ) {
      this.container = container;
      this.titleBarElement = titleBarElement;
      this.contentBoxElement = contentBoxElement;
      this.vertical = vertical;            
      this.hover = false;

      this._addMouseMoveEvent();

      this.init = false;     
      this._init();
   },
   
   _init: function() {
      if (this.init) {
         return;
      }
      
      if ($(this.container) == null) {
         return;         
      }
      
      this.init = true;

      $(this.container).hideArea = this;
      
      if (!this.vertical) {
         $(this.titleBarElement).style.writingMode = "tb-rl"; 
      }

      LogManager.getLogger("autohide").debug('constractor');
            
      this._attachBehaviors();
      this.opened = true;
      this.pinned = false;
      this.inAnimation = false;
   },

   _attachBehaviors: function() {
      this.contentHeight = $(this.contentBoxElement).offsetHeight;
      
      if (this.vertical) {
         this.openedHeight = $(this.container).offsetHeight;
         this.closedHeight = $(this.titleBarElement).offsetHeight;

         this.openedWidth = null;
         this.closedWidth = null;

      } else {
         this.openedHeight = null;
         this.closedHeight = null;

         this.openedWidth = $(this.container).offsetWidth;
         this.closedWidth = $(this.titleBarElement).offsetWidth;
      }
   },

   _addMouseMoveEvent: function() {
      if ( typeof document.implementation != "undefined" &&
         document.implementation.hasFeature("HTML",   "1.0") &&
         document.implementation.hasFeature("Events", "2.0") &&
         document.implementation.hasFeature("CSS",    "2.0") ) {
         document.addEventListener("mousemove", this._mouseMoveHandler.bindAsEventListener(this), false);
      }
      else {
         document.attachEvent( "onmousemove", this._mouseMoveHandler.bindAsEventListener(this) );
      }
   },

   _mousePointInContainer: function(e) {

      var absoluteRect = this.getAbsoluteRect();

      return e.clientX  > absoluteRect.left  &&
             e.clientX  < absoluteRect.right &&
             e.clientY  > absoluteRect.top   &&
             e.clientY  < absoluteRect.bottom;
   },


   toggle: function() {
      this.pinned = !this.pinned;

      if (this.pinned) {
         $(this.container).className = 'header-pin';
      } else {
         $(this.container).className = 'header';
      }
   },

   getAbsoluteRect: function() {
      if ( this.absoluteRect == null ) {
         var pos = RicoUtil.toViewportPosition($(this.container));

         this.absoluteRect = {
            top:    pos.y,
            left:   pos.x,
            bottom: pos.y + $(this.container).offsetHeight,
            right:  pos.x + $(this.container).offsetWidth
         };
      }
      return this.absoluteRect;
   },

   _getDirectChildrenByTag: function(e, tagName) {
      var kids = new Array();
      var allKids = e.childNodes;
      for( var i = 0 ; i < allKids.length ; i++ )
         if ( allKids[i] && allKids[i].tagName && allKids[i].tagName == tagName )
            kids.push(allKids[i]);
      return kids;
   },

   hideContentDone: function() {
      $(this.contentBoxElement).style.display = "none";
      this.absoluteRect = null;
      this.inAnimation = false;

      if (!this.vertical) {
         $(this.container).style.height = "100%"
      }
   }, 

   _hideContentArea: function() {
     if (!this.opened || this.hover) {
        return;
     }
   
     this.inAnimation = true;
     var area = this;

     this.opened = false;

     new Effect.Size($(this.container), 
                     this.closedWidth, this.closedHeight, 1, 1,
                     { 
                       complete: function() {
                         area.hideContentDone()
                       } 
                     });
      $(this.contentBoxElement).style.display = "none";
   },

   showContentDone: function() {
      $(this.contentBoxElement).style.display = "";
      this.absoluteRect = null;
      this.inAnimation = false;

      if (!this.vertical) {
         $(this.container).style.height = "100%"
      }
   }, 

   _showContentArea: function() {
     if (this.opened || !this.hover) {
        return;
     }
     
     this.inAnimation = true;
     this.opened = true;
     var area = this;

     new Effect.Size($(this.container), 
                     this.openedWidth, this.openedHeight, 1, 1,
                     { 
                       complete: function() {
                         area.showContentDone()
                       } 
                     });
   },

   // Events
   _mouseMoveHandler: function(e) {
      if ($(this.container) == null) {
         this.init = false;
         return;
      } else {
         if (!this.init) {
            this._init();
         }
      }

      if (!this.vertical) {
         $(this.titleBarElement).style.writingMode = "tb-rl"; 
      }
      
      if (this.inAnimation) {
         return;
      }
	
      if (this.pinned) {
         return;
      }

      if (this._mousePointInContainer(e)) {
         this.hover = true;
         if (!this.opened) {
            setInterval(this._showContentArea.bind(this), 1000);
         }
      } else {
         this.hover = false;
         if (this.opened) {
            setInterval(this._hideContentArea.bind(this), 1000);
         }
      }
   }	
}

function togglehide(htmlElement) {
  $(htmlElement).hideArea.toggle();
}
