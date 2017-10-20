// the document will be opened in a new window or in the WS tab
function generalOpenDocument(documentLocation, url) {	
	if (documentLocation == 'tab') {
		$W().ShowTabById('SearchResultTab');
	    $W().loadintoIframe('SearchResultTabFrame', url);   
	}
	else {
		window.open(url);
	}
}


