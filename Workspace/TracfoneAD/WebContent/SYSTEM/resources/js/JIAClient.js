/**
* @class JIAClient
* This class is used for integration with JIA. The client allow making calls across domains
* Please make sure to enable cors support in JIA service using "CorsEnabled" attribute
* JIAClient.get("/customer/1000", requestParams); JIAClient.get("?customer=1000", requestParams);
* JIAClient.post(requestObject, requestParams);
**/
var JIAClient = {

    /**
    *  @public @function Make GET request
    *  @param {String} urlParams
    *  @param {Object} requestParams
    *  @param {String} requestParams.url           The url of JIA Service
    *  @param {Boolean} [requestParams.async]      Asynchronous - default is true
    *  @param {Integer} [requestParams.timeout]    Request timeout default is 0 - no timeout
    *  @param {Function} [requestParams.onsuccess] success handler function
    *  @param {Function} [requestParams.onerror]   error handler function
    *  @param {Function} [requestParams.ontimeout] timeout handler function
    **/
    get : function (urlParams, requestParams) {
        this._doRequest('get', urlParams, requestParams);
    },

    /**
    *  @public @function Make POST request
    *  @param {Object} postBody - will be serialized to JSON and send in the post body
    *  @param {Object} requestParams See @function get
    **/
    post: function (postBody, requestParams) {
        this._doRequest('post', postBody, requestParams);
    },

    _doRequest : function (method, postBody, requestParams) {
        Ajax.getTransport = function() {
            return Try.these(
                function() {
                    var xdr = new XDomainRequest();
                    xdr.onload = function () {
                        try {
                            var jsonResponse = xdr.responseText.evalJSON(true);
                            requestParams.onsuccess.call(this, jsonResponse);
                        } catch (e) {
                            $W().LogManager.getLogger("JIAClient").trace(e);
                        }

                    };
                    xdr.onerror = function (e) {
                        if (requestParams.onerror != undefined) {
                            requestParams.onerror.call(this, xdr);
                        }
                        $W().LogManager.getLogger("JIAClient").trace("Got error response for " + requestParams.url);
                    };
                    xdr.ontimeout = function () {
                        if (requestParams.ontimeout != undefined) {
                            requestParams.ontimeout.call(this, xdr);
                        }
                        $W().LogManager.getLogger("JIAClient").trace("requestTimeout for " + requestParams.url);
                    };
                    xdr.onprogress = function () {
                    };
                    if (requestParams.timeout != undefined) {
                        xdr.timeout = requestParams.timeout;
                    }
                    return xdr;
                },
                function() {
                    var xhr = new XMLHttpRequest();
                    if ("withCredentials" in xhr) {
                        xhr.open(method, requestParams.url, true);
                        xhr.send();
                    }
                    return xhr;
                }
                ) || false;
        };

        if (method == 'get') {
            requestParams.url = requestParams.url + postBody;
        }
        this.request = new Ajax.Request(requestParams.url,
                {method: method,
                 postBody: Object.toJSON(postBody),
                 onSuccess: function (transport) {
                    var jsonResponse = transport.responseJSON;
                    if (requestParams.onsuccess != undefined) {
                        requestParams.onsuccess(jsonResponse);
                    }
                 },
                 onFailure: function (transport) {
                     var jsonResponse = new Object();
                     jsonResponse.status = transport.status;
                     jsonResponse.statusText = transport.statusText;
                     if (requestParams.onerror != undefined) {
                         requestParams.onerror(jsonResponse);
                     }
                 },

                 onCreate: function(request) {
                     var t = request.transport;
                     if (request.transport.setRequestHeader != undefined ) {
                        t.setRequestHeader = t.setRequestHeader.wrap(
                        function(original, k, v) {
                            if (/^(accept|accept-language|content-language)$/i.test(k)) {
                                return original(k, v);
                            }
                            if (/^content-type$/i.test(k) &&  /^(application\/x-www-form-urlencoded|multipart\/form-data|text\/plain)(;.+)?$/i.test(v)) {
                                return original(k, v);
                            }
                            return;
                     });
                     } else {
                        request.transport.setRequestHeader = Prototype.emptyFunction;
                     }

                 }, asynchronous : (requestParams.async != undefined ?requestParams.async : true)
                 } );
    }
}