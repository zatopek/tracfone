/**
 *
 */
var WindowsManager
(function () {
	WindowsManager = function () {
		var windows = {};

		var _internal = {
            ssoWindow: function () {
                windows['ssoWindow'] = Ext.create('Jacada.user.com.jacada.tracfoneAD.sSO.SSO');
            },
            recentTicketWindow: function () {
                windows['recentTicketWindow'] = Ext.create('Jacada.user.com.jacada.tracfoneAD.tickets.RecentTickets');
            },
            activeFlashesWindow: function () {
                windows['activeFlashesWindow'] = Ext.create('Jacada.user.com.jacada.tracfoneAD.common.ActiveFlashes');
            }
        }

		return {
			show: function (name, data, forceCreate) {
				if (!windows[name] || forceCreate) {
					if (!_internal[name]) {
						reject({
							msg: 'Unknown window requested'
						})
						return;
					}
					_internal[name]();
				}
				if (data)
					windows[name].data = data;
				windows[name].show();
			},
			hide: function (name) {
				if (!windows[name]) {
					return;
				}
				windows[name].hide();
			},
			reset: function () {
				//Hide all windows.
				for (var window in windows) {
					windows[window].hide();
				}
			}
		};
	};
})()
