/**
This file was created for solving known issues of prototype that were not solved yet.<b> 
*/

/**
This method overrides the element mothod of event for prevent a null exception.<b>
This problem was found when using scriptaculous.js of extjs.<b>
Foolw Workspace documentation to include this file in the problematic scenarios.<b> 
It is documented in the extjs forums as well as in this link:https://prototype.lighthouseapp.com/projects/8886/tickets/190-node-has-no-properties 
*/
Event.element = (function(event) {
	var node = Event.extend(event).target;
	if (node) {
		return Element.extend(node.nodeType == Node.TEXT_NODE ? node.parentNode : node);
	}
	else {
		return false;
	}
	 
});
