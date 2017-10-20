function xml2json(xmlRoot) {
    var object = {};
    for (var attr, i=0, attrs=xmlRoot.attributes, l=attrs.length; i<l; i++){
       attr = attrs.item(i);
       object[attr.nodeName] = attr.nodeValue;
    }
    for (var node, i=0, l=xmlRoot.childNodes.length; i<l; i++) {
       node = xmlRoot.childNodes[i];
       if (node.nodeName != "#text") {
           object[attr.nodeName] = attr.nodeValue;
       }
    }
    return object;
}

function xml2array(xmlRoot) {
	var values=[];
    for (var attr, i=0, attrs=xmlRoot.attributes, l=attrs.length; i<l; i++){
        attr = attrs.item(i);
        values.push(attr.nodeValue);
    }
    for (var node, i=0, l=xmlRoot.childNodes.length; i<l; i++) {
        node = xmlRoot.childNodes[i];
        if (node.nodeName != "#text") {
            values.push(node);
        }
    }
    return values;
}