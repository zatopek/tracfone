Ext.define('Jacada.user.ui.cti.SectionPanel', {
	    extend: 'Ext.panel.Panel',
	    
	    layout: {type: 'vbox', align: 'center'},
	    border: false,
	    margin: '0 5 5 5',
	    bodyStyle : 'background:none;',
	    
	    defaults:{
	    	bodyStyle : 'background:none;'
	    },
	    
	    listeners: {
	    	afterrender: function(_this, eOpts){
	    		_this.add({xtype:'tbspacer', flex:1});
	    		_this.add({
			        xtype: 'label',
			        text: _this.sectionName,
			        cls: 'statusLabel'
			    });
	    	}
	    }
	    
});