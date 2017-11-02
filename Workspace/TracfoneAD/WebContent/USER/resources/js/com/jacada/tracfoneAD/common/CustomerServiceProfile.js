Ext.define('Jacada.user.com.jacada.tracfoneAD.common.CustomerServiceProfile', {
    extend: 'Ext.panel.Panel',
    //title: 'CUSTOMER SERVICE PROFILE',
    layout: 'column',
    defaults: {
        margin: '0 10 0 0' //top right bottom left (clockwise) margins of each item/column
    },
    items: [{
        columnWidth: 0.2,
        border: false,
        defaults: {
            xtype: 'displayfield',
            labelStyle: 'white-space: nowrap;',
            margin: '0 0 0 0'
        },
        items: [{

            fieldLabel: 'Serial Number',
            name: 'Serial Number',
            value: 'S90830283493928748374374'
        }, {

            fieldLabel: 'Hex Serial Number',
            name: 'textvalue'
        }, {

            fieldLabel: 'Port Number',
            name: 'textvalue'
        }, {

            fieldLabel: 'Technology',
            name: 'textvalue'
        }, {

            fieldLabel: 'Device Type',
            name: 'textvalue'
        }, {

            fieldLabel: 'Brand',
            name: 'textvalue'
        }, {

            fieldLabel: 'Sequence',
            name: 'textvalue'
        }]
    }, {
        columnWidth: 0.2,
        border: false,
        defaults: {
            xtype: 'displayfield',
            labelStyle: 'white-space: nowrap;'
        },
        items: [{

            fieldLabel: 'Dealer',
            name: 'Serial Number'
        }, {

            fieldLabel: 'Phone Status',
            name: 'textvalue'
        }, {

            fieldLabel: 'SIM',
            name: 'textvalue'
        }, {

            fieldLabel: 'SIM Status',
            name: 'textvalue'
        }, {

            fieldLabel: 'MIN',
            name: 'textvalue'
        }, {

            fieldLabel: 'MIN Status',
            name: 'textvalue'
        }, {

            fieldLabel: 'MSID',
            name: 'textvalue'
        }]
    }, {
        columnWidth: 0.2,
        border: false,
        defaults: {
            xtype: 'displayfield',
            labelStyle: 'white-space: nowrap;'
        },
        items: [{

            fieldLabel: 'Carrier',
            name: 'Serial Number'
        }, {

            fieldLabel: 'Customer ID',
            name: 'textvalue'
        }, {

            fieldLabel: 'Contact Name',
            name: 'textvalue'
        }, {

            fieldLabel: 'LID',
            name: 'textvalue'
        }, {

            fieldLabel: 'Group ID',
            name: 'textvalue'
        }, {

            fieldLabel: 'Activation Date',
            name: 'textvalue'
        }, {

            fieldLabel: 'Deact Date',
            name: 'textvalue'
        }]
    }, {
        columnWidth: 0.2,
        border: false,
        defaults: {
            xtype: 'displayfield',
            labelStyle: 'white-space: nowrap;'
        },
        items: [{

            fieldLabel: 'Zip',
            name: 'Serial Number'
        }, {

            fieldLabel: 'Cards in reserve',
            name: 'textvalue'
        }, {

            fieldLabel: 'Service End Date',
            name: 'textvalue'
        }, {

            fieldLabel: 'Next Charge Date',
            name: 'textvalue'
        }, {

            fieldLabel: 'Rate Plan',
            name: 'textvalue'
        }, {

            fieldLabel: 'Service Plan Objd',
            name: 'textvalue'
        }, {

            fieldLabel: 'Service Type',
            name: 'textvalue'
        }, {

            fieldLabel: 'Auto Refills',
            name: 'textvalue'
        }]
    }, {
        columnWidth: 0.2,
        border: false,
        defaults: {
            xtype: 'displayfield',
            labelStyle: 'white-space: nowrap;'
        },
        items: [{

            fieldLabel: 'Next Refill Date',
            name: 'Serial Number'
        }, {

            fieldLabel: 'Warranty Exchanges',
            name: 'textvalue'
        }, {

            fieldLabel: 'Basic Warranty Found',
            name: 'textvalue'
        }, {

            fieldLabel: 'Extended Warranty',
            name: 'textvalue'
        }, {

            fieldLabel: 'Current Throttle Status',
            name: 'textvalue'
        }, {

            fieldLabel: 'Leased to Finance',
            name: 'textvalue'
        }, {

            fieldLabel: 'Lease Status',
            name: 'textvalue'
        }, {

            fieldLabel: 'Phone Gen',
            name: 'textvalue'
        }]
    }]
})