// behavior.js - by Dave Herman
// Copyright (C) 2005 by Dave Herman
//
// Based on behaviour.js by Ben Nolan, June 2005
// and getElementBySelector.js by Simon Willison, 2004.
//
// This library is free software; you can redistribute it and/or modify it
// under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation; either version 2.1 of the License, or (at
// your option) any later version.
//
// This library is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public
// License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this library; if not, write to the Free Software Foundation,
// Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA


// =============================================================================
// Function Class: getElementsBySelector
// =============================================================================
/* document.getElementsBySelector(selector)
   - returns an array of element objects from the current document
     matching the CSS selector. Selectors can contain element names, 
     class names and ids and can be nested. For example:
     
       elements = document.getElementsBySelect('div#main p a.external')
     
     Will return an array of all 'a' elements with 'external' in their 
     class attribute that are contained inside 'p' elements that are 
     contained inside the 'div' element which has id="main"

   New in version 0.4: Support for CSS2 and CSS3 attribute selectors:
   See http://www.w3.org/TR/css3-selectors/#attribute-selectors

   Version 0.4 - Simon Willison, March 25th 2003
   -- Works in Phoenix 0.5, Mozilla 1.3, Opera 7, Internet Explorer 6, Internet Explorer 5 on Windows
   -- Opera 7 fails 
*/

function getAllChildren(e) {
  // Returns all children of element. Workaround required for IE5/Windows. Ugh.
  return e.all ? e.all : e.getElementsByTagName('*');
}

document.getElementsBySelector = function(selector) {
  // Attempt to fail gracefully in lesser browsers
  if (!document.getElementsByTagName) {
    return new Array();
  }
  // Split selector in to tokens
  var tokens = selector.split(' ');
  var currentContext = new Array(document);
  for (var i = 0; i < tokens.length; i++) {
    token = tokens[i].replace(/^\s+/,'').replace(/\s+$/,'');;
    if (token.indexOf('#') > -1) {
      // Token is an ID selector
      var bits = token.split('#');
      var tagName = bits[0];
      var id = bits[1];
      var element = document.getElementById(id);
      if (tagName && element.nodeName.toLowerCase() != tagName) {
        // tag with that ID not found, return false
        return new Array();
      }
      // Set currentContext to contain just this element
      currentContext = new Array(element);
      continue; // Skip to next token
    }
    if (token.indexOf('.') > -1) {
      // Token contains a class selector
      var bits = token.split('.');
      var tagName = bits[0];
      var className = bits[1];
      if (!tagName) {
        tagName = '*';
      }
      // Get elements matching tag, filter them for class selector
      var found = new Array;
      var foundCount = 0;
      for (var h = 0; h < currentContext.length; h++) {
        var elements;
        if (tagName == '*') {
            elements = getAllChildren(currentContext[h]);
        } else {
            elements = currentContext[h].getElementsByTagName(tagName);
        }
        for (var j = 0; j < elements.length; j++) {
          found[foundCount++] = elements[j];
        }
      }
      currentContext = new Array;
      var currentContextIndex = 0;
      for (var k = 0; k < found.length; k++) {
        if (found[k].className && found[k].className.match(new RegExp('\\b'+className+'\\b'))) {
          currentContext[currentContextIndex++] = found[k];
        }
      }
      continue; // Skip to next token
    }
    // Code to deal with attribute selectors
    if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
      var tagName = RegExp.$1;
      var attrName = RegExp.$2;
      var attrOperator = RegExp.$3;
      var attrValue = RegExp.$4;
      if (!tagName) {
        tagName = '*';
      }
      // Grab all of the tagName elements within current context
      var found = new Array;
      var foundCount = 0;
      for (var h = 0; h < currentContext.length; h++) {
        var elements;
        if (tagName == '*') {
            elements = getAllChildren(currentContext[h]);
        } else {
            elements = currentContext[h].getElementsByTagName(tagName);
        }
        for (var j = 0; j < elements.length; j++) {
          found[foundCount++] = elements[j];
        }
      }
      currentContext = new Array;
      var currentContextIndex = 0;
      var checkFunction; // This function will be used to filter the elements
      switch (attrOperator) {
        case '=': // Equality
          checkFunction = function(e) { return (e.getAttribute(attrName) == attrValue); };
          break;
        case '~': // Match one of space seperated words 
          checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('\\b'+attrValue+'\\b'))); };
          break;
        case '|': // Match start with value followed by optional hyphen
          checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('^'+attrValue+'-?'))); };
          break;
        case '^': // Match starts with value
          checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) == 0); };
          break;
        case '$': // Match ends with value - fails with "Warning" in Opera 7
          checkFunction = function(e) { return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length); };
          break;
        case '*': // Match ends with value
          checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) > -1); };
          break;
        default :
          // Just test for existence of attribute
          checkFunction = function(e) { return e.getAttribute(attrName); };
      }
      currentContext = new Array;
      var currentContextIndex = 0;
      for (var k = 0; k < found.length; k++) {
        if (checkFunction(found[k])) {
          currentContext[currentContextIndex++] = found[k];
        }
      }
      // alert('Attribute Selector: '+tagName+' '+attrName+' '+attrOperator+' '+attrValue);
      continue; // Skip to next token
    }
    // If we get here, token is JUST an element (not a class or ID selector)
    tagName = token;
    var found = new Array;
    var foundCount = 0;
    for (var h = 0; h < currentContext.length; h++) {
      var elements = currentContext[h].getElementsByTagName(tagName);
      for (var j = 0; j < elements.length; j++) {
        found[foundCount++] = elements[j];
      }
    }
    currentContext = found;
  }
  return currentContext;
}

/* That revolting regular expression explained 
/^(\w+)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/
  \---/  \---/\-------------/    \-------/
    |      |         |               |
    |      |         |           The value
    |      |    ~,|,^,$,* or =
    |   Attribute 
   Tag
*/


// =============================================================================
// Class: HandlerSet
// =============================================================================

function HandlerSet() {
    this.clearHandlers();
}

HandlerSet.prototype = {
    addHandler : function(f, key) {
        key = key || this.uniqueID++;
        this.installedHandlers[key] = f;
        return key;
    },

    removeHandler : function(key) {
        delete this.installedHandlers[key];
    },

    clearHandlers : function() {
        this.installedHandlers = { };
        this.uniqueID = 0;
    },

    replaceHandlers : function(f, key) {
        clearHandlers();
        return addHandler(f, key);
    },

    applyAll : function(object, arguments) {
        for (var handler in this.installedHandlers) {
            this.installedHandlers[handler].apply(object, arguments);
        }
    },

    debug : function() {
        var str = "";
        for (var p in this.installedHandlers) {
            str += p + " => " + this.installedHandlers[p] + "\n";
        }
        alert(str);
    }
};

// =============================================================================
// Function Class: EventHandler
// =============================================================================

function isEventHandler(x) {
    return (typeof x == 'function' &&
            x.handlers &&
            x.handlers.constructor == HandlerSet);
}

function makeEventHandler(original) {
    var handlers = new HandlerSet();

    if (typeof original == 'function') {
        handlers.addHandler(original);
    }

    // The event handler is a function, so it can be used with the DOM.
    // But when it's called, we apply all the handlers in the set.
    var result = function() {
        handlers.applyAll(this, arguments);
    };

    // We also expose its handler set so we can get at it later.
    result.handlers = handlers;

    return result;
}

// =============================================================================
// Module: Behavior
// =============================================================================

var Behavior = {
    registry : new Array,

    register : function(sheet) {
        Behavior.registry.push(sheet);
    },

    registerEventHandlers : function(element, handlers) {
        for (var event in handlers) {
            if (!isEventHandler(element[event])) {
                element[event] = makeEventHandler(element[event]);
            }
            element[event].handlers.addHandler(handlers[event]);
        }
    },

    apply : function() {
        for (var i = 0; i < Behavior.registry.length; i++) {
            var sheet = Behavior.registry[i];
            for (var selector in sheet) {
                var list = document.getElementsBySelector(selector);
                if (!list) {
                    continue;
                }
                for (var j = 0; j < list.length; j++) {
                    Behavior.registerEventHandlers(list[j], sheet[selector]);
                }
            }
        }
    },

    addLoadHandler : function(handler) {
        var oldHandler = window.onload;

        if (typeof oldHandler != 'function') {
            window.onload = handler;
        }
        else {
            window.onload = function() {
                oldHandler();
                handler();
            };
        }
    }
};

Behavior.addLoadHandler(function() { Behavior.apply(); });
