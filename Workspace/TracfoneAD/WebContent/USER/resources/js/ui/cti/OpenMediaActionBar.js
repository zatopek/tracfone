Ext.define('Jacada.user.ui.cti.OpenMediaActionBar', {
    extend: 'Ext.panel.Panel',
    
    itemId: 'openMediaActionBar',
    height: '100%',
	border: false,
	layout: {
		type: 'hbox',
		align: 'middle'
	},
	defaults:{
		margin: '0 5 0 0'
	},
	
	initComponent: function(){
		var me = this;
		var items = [];
		
		items.push(me.getEndOpenMediaBtn());
		
        items = items.compact();
        Ext.applyIf(me, {
        	items: items
        });
        me.callParent(arguments);
	},
	
	getEndOpenMediaBtn: function(){
		return $W().cti.createCTIButton('endOpenMedia', $W().cti.getButtonText('endItemWithShort'),
				$W().UserCTIRoles.CTIEndUser,
				function(){
					$W().cti._onCTIButtonClicked('endOpenMedia');
				}
		);
	}
});
