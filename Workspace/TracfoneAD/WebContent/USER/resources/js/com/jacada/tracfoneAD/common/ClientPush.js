ClientPush = Class.create();

ClientPush.prototype = {

	initialize : function() {

		this.exit = false;

		this.registerEventHandler("testPush", this._OnTest.bind(this));

	},

	init : function() {
	},

	/**
	 * 
	 * This function registers event handler
	 * 
	 * @param {}
	 *            keyword - the event keyword
	 * 
	 * @param {}
	 *            handler - the specific function that is called during the
	 *            event
	 * 
	 * @param {}
	 *            reset - indicates whether an existing event handler should be
	 *            replaced
	 * 
	 */

	registerEventHandler : function(keyword, handler, reset) {

		var shouldReset = reset || false;

		var handlerList = null;

		if (!shouldReset) {

			handlerList = this['on' + keyword];

		}

		if (handlerList == null) {

			handlerList = new Array();

			this['on' + keyword] = handlerList;

		}

		this.unregisterEventHandler(keyword, handler);

		handlerList.push(handler);

	},

	/**
	 * 
	 * This function unregisters event handler
	 * 
	 * @param {}
	 *            keyword - the event keyword
	 * 
	 * @param {}
	 *            handler - the specific function that is called during the
	 *            event
	 * 
	 */

	unregisterEventHandler : function(keyword, handler) {

		var handlerList = this['on' + keyword];

		if (handlerList == null) {

			return false;

		}

		for (var i = 0; i < handlerList.length; i++) {

			if (handlerList[i] == handler) {

				handlerList.splice(i, 1);

				return true;

			}

		}

		return false;

	},

	unregisterAllEventHandlers : function(keyword) {

		this['on' + keyword] = null;

	},

	_processEvent : function(keyword, data) {

		var handlerList = this['on' + keyword];

		if (handlerList != null) {

			var size = handlerList.length;

			var i = 0;
			while (i < size) {

				try {

					var shouldUnregister = handlerList[i](data);

					if (shouldUnregister == true) {

						handlerList.splice(i, 1);

						i--;

						size--;

					}

				} catch (ex) {

					var logger = LogManager.getLogger("client.push");

					logger
							.error("got exception while trying to call a push handler for keyword: "
									+ keyword
									+ "; Exception: "
									+ ex.description);

				}

				i++;

			}

		}

	},

	pushMessage : function(keyword, data) {

		this._processEvent(keyword, data);

	},

	_OnTest : function(data) {

		alert('onTestMessage was published' + data);

	}

}

var clientPush = new ClientPush();