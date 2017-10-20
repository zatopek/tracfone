JComboBox = Class.create();
JComboBox.prototype = { 
  initialize: function(element) {  
     this._init(element);
     var obj = this._build(document, this.parent, element);

     this.topElement = obj.topElement;
     this.edit = obj.edit;
     this.button = obj.button;
     this.hidden = obj.hidden;
     this.firstonsubmit = true;
     this.ispopupOpen = false;
     this._connectEvents();
     
	 this._selectByText(this.text);        

     element.removeNode(true);
  },

  _init: function(element) {  
     this.element = element;
     this.parent = element.parentElement;

     this.id = element.id;
     this.width = (element.width || "100px");     
     this.value = (element.value || "");     
     this.size = (element.size || "5");     
     this.text = this.value;
     this.onchanged = element.onchanged;
     this.onselected = element.onselected;
     this.bkpOnSubmit = null;
     
     this._createPopup(element);

  },

  _build: function(doc, parent, element) { 
     var obj = new Object();

     // todo - need to put it just before or after the element
     obj.topElement = doc.createElement("<SPAN class='ComboBox'>");
     element.insertAdjacentElement("afterEnd", obj.topElement);

     var temp1 = doc.createElement("<SPAN class='ComboBoxTextAndButton'>");
     obj.topElement.appendChild(temp1);

     var temp2 = doc.createElement("<NOBR>");
     temp1.appendChild(temp2);

     obj.edit = doc.createElement("<INPUT class='ComboBoxText ComboBoxTextDynamic' tabIndex='0' AUTOCOMPLETE='OFF' value='' style='BORDER-RIGHT: white 0px solid; WIDTH: " + this.width + "'>");
     temp2.appendChild(obj.edit);
     
     obj.hidden = doc.createElement("<INPUT type='hidden' id='" + this.id + "' name='" + this.id + "' value=''>");     
     temp2.appendChild(obj.hidden);
     obj.hidden.combo = this;

     var temp3 = doc.createElement("<SPAN class='ComboBoxButton' tabIndex='-1'>");
     temp2.appendChild(temp3);

     obj.button = doc.createElement("<SPAN class='ComboBoxButtonImg' src='images/blank.gif' tabIndex='-1'>");
     temp3.appendChild(obj.button);

     return obj;
  },

  // Events

  _connectEvents: function() {  
    this.button.onclick = this._buttonClicked.bindAsEventListener(this);
    this.edit.onkeydown = this._editKeyDown.bindAsEventListener(this);
    this.edit.onkeyup = this._editKeyUp.bindAsEventListener(this);
    if (this.hidden.form) {
      this.hidden.form.attachEvent('onsubmit', this._formSubmit.bindAsEventListener(this));
    }
    //for hover and pressed effects
    this.button.onmouseover = this._mouseOver.bindAsEventListener(this);
    this.button.onmouseout = this._mouseOut.bindAsEventListener(this);
    this.button.onmousedown = this._mouseDown.bindAsEventListener(this);
    this.button.onmouseup = this._mouseUp.bindAsEventListener(this);
    
  },
  
  
  _mouseOver: function(event) {
	    
	  if(this.button) {
		  this.button.className = 'ComboBoxButtonImgOver';
	  }	  	  
  },
  
 _mouseOut: function(event) {
	  
	  if (this.button) {		  
		  this.button.className = 'ComboBoxButtonImg';
	  }	  
  },
  
  _mouseDown: function(event) {

	  if (this.button) {		  
		  this.button.className = 'ComboBoxButtonImgPressed';
	  }  
  },
  
  _mouseUp: function(event) {

	  if (this.button) {		  
		  this.button.className = 'ComboBoxButtonImg';
	  }   
  },
  
 
  _buttonClicked: function(event) {
	  
	  
    if( this.firstonsubmit )
    {
        this.bkpOnSubmit = document.forms[0].onsubmit;
        document.forms[0].onsubmit = new Function ("return false");
        this.firstonsubmit = false;
    }    
   
    try
    {
        this.edit.focus();    
        this._togglePopup();
    }
    catch (e) // disabled?
    {    
    }
  },

  _listChanged: function(event) {
    this._hidePopup();
	this._updateFromList();
  },
  
  _updateFromList: function() {
    this.value = this.list.options(this.list.selectedIndex).value;
    this.text = this.list.options(this.list.selectedIndex).text;

    this.edit.value = this.text;
    this.hidden.value = this.value;
    
    this._raiseChangedEvent();
  },

  _editKeyDown: function(event) {
    if( this.firstonsubmit )
    {
        this.bkpOnSubmit = document.forms[0].onsubmit;
        document.forms[0].onsubmit = new Function ("return false");
        this.firstonsubmit = false;
    }
	if (event.keyCode < 48 && (event.keyCode != 40 && event.keyCode != 38 && event.keyCode != 8 && event.keyCode != 46)) {
		return;
	}

    this._showPopup();
  },
 
  _editKeyUp: function(event) {
    var text = this.edit.value;
    if (this.text != text) {   
	    this.text = text;
	    this.value = text;
    
        this.hidden.value = text;
        
		if (event.keyCode == 8 || event.keyCode == 46) {
		    this._unselectAll();	    
		} else {
			this._selectByText(text);    		    
		}
		
	}
    
    var list = this.list;
    
   	switch (event.keyCode) {
	  case 40: // down
 	    var selectedIndex = list.selectedIndex;
	    if (selectedIndex != (list.options.length-1)) {
		  if (selectedIndex != -1) {
		  	list.options(selectedIndex).selected = false;
		  }
		  selectedIndex++;
		  list.options(selectedIndex).selected = true;
	  	  this._updateFromList();
	    }
	    break;   
	  case 38: // up
 	    var selectedIndex = list.selectedIndex;
	    if (selectedIndex > 0) {
		  if (selectedIndex != -1) {
			list.options(selectedIndex).selected = false;
			selectedIndex--;
		  } else {
			selectedIndex = 0;
		  }
		  list.options(selectedIndex).selected = true;
	  	  this._updateFromList();
		}
	    break;   
	  case 13: // enter
        // _formSubmit is always called prior to reaching this code
		this._raiseSelectedEvent();
        break;
    }   
  },

  _formSubmit: function(event) {
    this._hidePopup();
  },
  
  _raiseChangedEvent: function() {
    if (this.onchanged != null) {
      if (typeof this.onchanged == 'function') {
        var event = new Object;
        event.sender = this;
        
        this.onchanged(event);
      } else {
        eval(this.onchanged);
      }

    }
  },

  _raiseSelectedEvent: function() {
    if (this.onselected != null) {
      if (typeof this.onselected == 'function') {
        var event = new Object;
        event.sender = this;
        
        this.onselected(event);
      } else {
        eval(this.onselected);
      }

    }
  },

  _togglePopup: function() {
     if (this.ispopupOpen) {
        this._hidePopup();
     } else {
        this._showPopup();
     }
  },

  _hidePopup: function() {
    if( this.popup == null ) return;
    this.popup.hide();
    this.ispopupOpen = false;
    
    document.forms[0].onsubmit = this.bkpOnSubmit;
    this.firstonsubmit = true;
  },

  _showPopup: function() {
    if (!this.ispopupOpen) {
       this.list.style.width = this.topElement.offsetWidth;
       this.popup.show(0, this.topElement.offsetHeight, 0, 0, this.topElement);
       this.popup.show(0, this.topElement.offsetHeight, this.topElement.offsetWidth, this.list.offsetHeight, this.topElement);
       this.ispopupOpen = true;
    }
  },


  
  
  _unselectAll: function() {
	var list = this.list;
	
	for (pos=0; pos<list.options.length;pos++) {
        list.options(pos).selected = false;
	}
  }, 
  
  _selectByText: function(text) {
	var list = this.list;
	var selected = false;
	
	for (pos=0; pos<list.options.length;pos++) {
		var index = -1;
		if (text != "") {
			index = list.options(pos).text.indexOf(text);
		}
		
		if (index == 0 && !selected) {
			list.options(pos).selected = true;

			this.value = list.options(pos).value;
			this.text = list.options(pos).text;

            this.hidden.value = this.value;
			this.edit.value = this.text;
			
			var sel = list.options(pos).text.substring(text.length, list.options(pos).text.length)
			if (sel != "") {
				var r = this.edit.createTextRange();
				r.moveStart('character', text.length);
				r.findText(sel);
				r.select();
		    }

			selected = true;
		} else {
			list.options(pos).selected = false;
		}		
	 }
  },
  
   _preDefinedOnChange: function(event)
  {
     this._listChanged();
     
     if( window.myComboOnChange )
        window.myComboOnChange();
  },
  
  _createPopup: function(element) {
     this.popup = window.createPopup();
     var popupD = this.popup.document;

     this.list = popupD.createElement("<select multiple size='" + this.size + "' tabIndex='-1' type='select-one' class='ComboBoxList'/>");
     popupD.body.appendChild(this.list);
     
     //this.list.onchange = this._listChanged.bindAsEventListener(this);
     this.list.onchange = this._preDefinedOnChange.bindAsEventListener(this);
     this.list.onclick = this._listChanged.bindAsEventListener(this);

     var op = element.nextSibling;
     while (op.tagName != "/JACADA:COMBO") {
        if (op.tagName == "JACADA:OPTION") {

          var oOption = popupD.createElement("OPTION");
          oOption.value= op.value;
          oOption.text= (op.text || op.value);

          this.list.add(oOption);

        } else if (op.tagName == "OPTION") {
          var oOption = popupD.createElement("OPTION");
          oOption.value= op.value;
          
          oOption.text= op.value;
          if (op.nextSibling.nodeName == "#text") {
           oOption.text = op.nextSibling.nodeValue;
          }

          this.list.add(oOption);
        }        

        var prev = op;
        op = op.nextSibling;

        prev.removeNode(true);
        
     }
     op.removeNode(true);

	 if (this.list.options.length < this.size) {
	   this.size = this.list.options.length;
	   this.list.size = this.size;
	 }
	 
     return this.popup;    
  }



  


}













if (!window.attachedComboOnLoadEvent) {
  if (window.addEventListener) {
	  window.addEventListener('load', createCombos, false);
	} else if (window.attachEvent) {
		window.attachEvent('onload', createCombos);
	}
  window.attachedComboOnLoadEvent = true;
}

function createCombos() {
  removeEvent(window, 'load', createCombos);
  var combos = document.getElementsByTagName("jacada:combo");
  while(combos.length > 0) {
    var el = combos[0];
    var combo = new JComboBox(el);
  }
}
