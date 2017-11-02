//Ext.onReady(function(){
// shorthand alias

Ext.define('Jacada.user.com.jacada.tracfoneAD.redemption.AirtimePlanGrid', {


    extend: 'Ext.panel.Panel',


    initComponent: function () {
        store.load(myData);
        //this.callParent();
    },
    
    items:[
       grid
    ]
})


// create the editor grid
var grid = new Ext.grid.GridPanel({
    store: store,
    cm: cm,
    //renderTo: 'editor-grid',
    width: 600,
    height: 250,
    //autoExpandColumn: 'common', // column with this id will be expanded
    //title: 'Airtime Plans',
    frame: true
    /*
    clicksToEdit: 1,
    tbar: [{
        text: 'Airtime Plans',
        handler: function () {
            // access the Record constructor through the grid's store
            var Plant = g;//rid.getStore().recordType;
            var p = new Plant({
                common: 'New Plant 1',
                light: 'Mostly Shade',
                price: 0,
                availDate: (new Date()).clearTime(),
                indoor: false
            });
            grid.stopEditing();
            store.insert(0, p);
            grid.startEditing(0, 0);
        }
    }]
    */
});

// sample static data for the store
var myData = [
    ['STAPP300023',  '$35 30 Days UNL TALK/TXT/DTA, first 2 GB at High Speeds then at 2G', 35,  0],
    ['STAPP300067',  '$45 30 Days UNL TALK/TXT/DTA, first 10 GB at High Speeds then at 2G', 45,  0],
    ['STAPP300078',  '$55 30 Days UNL TALK/TXT/DTA, first 15 GB at High Speeds then at 2G', 55,  0],
    ['STAPP300099',  '$65 30 Days UNL TALK/TXT/DTA, first 20 GB at High Speeds then at 2G', 65,  0]
];

// create the Data Store
//var store = new Ext.data.Store({
var store = new Ext.data.ArrayStore({
    // destroy the store if the grid is destroyed
    //autoDestroy: true,

    // load remote data using HTTP
    //url: 'plans.xml',

    // specify a XmlReader (coincides with the XML format of the returned data)
    //reader: new Ext.data.XmlReader({

        //record: 'plan',
        fields: [
            {name: 'partNumber', type: 'string'},
            {name: 'description', type: 'string'},
            {name: 'price', type: 'float'},
            {name: 'qty', type: 'int'}
        ],
    //}),

   sortInfo: {field: 'price', direction: 'ASC'}
});


var fm = Ext.form;

var cm = new Ext.grid.ColumnModel({
    // specify any defaults for each column
    defaults: {
        sortable: true // columns are not sortable by default
    },
    columns: [{
        id: 'partNumber',
        header: 'Part Number',
        dataIndex: 'partNumber',
        width: 120,
        // use shorthand alias defined above
        editor: new fm.TextField({
            allowBlank: false
        })
    }, {
        id: 'description',
        header: 'Description',
        dataIndex: 'description',
        width: 350,
        // use shorthand alias defined above
        editor: new fm.TextField({
            allowBlank: false
        })
    }, {
        header: 'Price',
        dataIndex: 'price',
        width: 70,
        align: 'right',
        //renderer: 'usMoney',
        editor: new fm.NumberField({
            allowBlank: false,
            allowNegative: false,
            maxValue: 100000
        })
    }, {
        header: 'Qty',
        dataIndex: 'qty',
        width: 40,
        editor: new fm.NumberField({
            allowBlank: true,
            allowNegative: false,
            maxValue: 10
        })
    }]
});

/*
// manually trigger the data store load
loadStore: function () {
    store.load({
        // store loading is asynchronous, use a load listener or callback to handle results

         callback: function(){
            Ext.Msg.show({
                title: 'Store Load Callback',
                msg: 'store was loaded, data available for processing',
                modal: false,
                icon: Ext.Msg.INFO,
                buttons: Ext.Msg.OK
            });
        }
    });
}
*/

