Ext.define('Jacada.user.com.jacada.tracfoneAD.transferGuidelines.TransferGuidelines', {
    extend: 'Ext.panel.Panel',
    border: false,
    width: '100%',
    bodyStyle: ' padding: 5px 5px 5px 5px',
    //layout: 'vbox',
    defaults: {
        xtype: 'component',
        cls: 'weblink'
    },
    items: [{
    	autoEl:{
    		tag:'p'
    	}
    },
        {
            autoEl: {
                tag: 'a',
                href: '#',
                html: 'ST CRT'
            }
        }, {
        	autoEl:{
        		tag:'p'
        	}
        },{
            autoEl: {
                tag: 'a',
                href: '#',
                html: 'ST Sup ERD'
            }
        }, {
        	autoEl:{
        		tag:'p'
        	}
        },{
            autoEl: {
                tag: 'a',
                href: '#',
                html: 'Corp ERD'
            }
        }, {
        	autoEl:{
        		tag:'p'
        	}
        },{
            autoEl: {
                tag: 'a',
                href: '#',
                html: 'VAS'
            }
        }, {
        	autoEl:{
        		tag:'p'
        	}
        },{
            autoEl: {
                tag: 'a',
                href: '#',
                html: 'Call Carriers'
            }
        }]
});

