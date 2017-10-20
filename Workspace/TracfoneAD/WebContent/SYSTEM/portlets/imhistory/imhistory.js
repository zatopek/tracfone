var currentSessionsCount = 0;
var conn = new Ext.data.Connection();

var sessionsListStore = new Ext.data.JsonStore({
    root: 'sessions',
    totalProperty: 'totalCount',
    baseParams: { method: "loadSessionsHistoryData" },
    url:CONTACT_LIST_JSON_URL,
    remoteSort:true,//bug ws-764 this is for sorting in the server, we cannot sort in client because of pagination
    sortInfo: { // this will hold thw sort info during the sorting, upon login we want the sorting to be creationDate-ascending
			field: 'initiator',
			direction: 'ASC'
			},
	//bug ws-764 make sure to update the applicationContext-instantMessaging if you change those fields names  
    fields: ['initiator', 'recipient', 'startDate', 'length'] 
});
var chartDataStore = new Ext.data.JsonStore({
    root: 'sessions',
    baseParams: { method: "loadChartData" },
    url:CONTACT_LIST_JSON_URL,
    fields: ['time','count','xpos']
});
chartDataStore.on('loadexception', function(proxy, store, response, e) {
    
});
//refresh button
refreshButton = new Ext.Button({
    text: getLocalizationValue('application.javascript.imHistory.buttonRefresh'),
    handler:refreshHandler
});

Ext.onReady(function() {

    var pagingBar = new Ext.PagingToolbar({
        pageSize: SESSIONS_ON_PAGE,
        store: sessionsListStore
    });

    var sessionsGrid = new Ext.grid.GridPanel({
        //autoHeight:true,
        title: getLocalizationValue('application.javascript.imHistory.table.caption'),
        store: sessionsListStore,
        trackMouseOver:false,
        disableSelection:true,
        loadMask: true,

        // grid columns
        columns:[{
            header: getLocalizationValue('application.javascript.imHistory.column.initiator'),
            dataIndex: 'initiator',
            sortable: true
        },{
            header: getLocalizationValue('application.javascript.imHistory.column.recipient'),
            dataIndex: 'recipient',
            sortable: true
        },{
            header: getLocalizationValue('application.javascript.imHistory.column.sessionStart'),
            dataIndex: 'startDate',
            sortable: true
        },{
            header: getLocalizationValue('application.javascript.imHistory.column.sessionLength'),
            dataIndex: 'length',
            sortable: true
        }],

        // paging bar on the bottom
        bbar: pagingBar
    });      

    var activeSessionsPanel = new Ext.Panel({
       id:'mycomp',
       html: '<b>' + currentSessionsCount + '</b> '+ getLocalizationValue('application.javascript.imHistory.activeSession.title')
    });
    
    var graphPanel = new Ext.Panel({
        width: '100%',
        height: '100%',
        title: getLocalizationValue('application.javascript.imHistory.chart.title'),
        items: {
            xtype: 'columnchart',
            store: chartDataStore,
            yField: 'count',
            url: $W().contextPath+'/SYSTEM/resources/js/extJS/resources/charts.swf',
            xField: 'time',
            xAxis: new Ext.chart.CategoryAxis({
                title: getLocalizationValue('application.javascript.imHistory.label.time')
            }),
            yAxis: new Ext.chart.NumericAxis({
                title: getLocalizationValue('application.javascript.imHistory.label.sessions')
            }),
            extraStyle: {
                yAxis: {
                     labelRotation: -90
                 }
             }
        }
    });
    
    // graph and session list tabs:
    tabPanel = new Ext.TabPanel({
        activeTab: 0,
        region: 'center',
        deferredRender: false,
        defaults: {
        	hideMode: "offsets",
        	style: 'padding: 2px 10px 2px 10px;'
        },
        items: [graphPanel, sessionsGrid ]
    });

	// main form:
	new Ext.Panel({
        renderTo: Ext.getBody(),
        height: 500,
        header:false,
        frame: true,
        layout: 'border',
        items: [tabPanel,
        		{layout:'column',
        		region: 'south',
        		height: 30,
        		bodyStyle: 'padding: 5 0 0 0',
                items:[{
                    columnWidth:.5,
                      items: [activeSessionsPanel]
                },{
                    columnWidth:.2,
                    items: [refreshButton]
                }]}
            	]
    });
    refreshHandler();
});

function generateData(){
    var data = [];
    for(var i = 0; i < 12; ++i){
        data.push([Date.monthNames[i], (Math.floor(Math.random() *  11) + 1) * 10]);
    }
    return data;
}

//refresh button handler
function refreshHandler() {
    conn.request({
        url: CONTACT_LIST_JSON_URL,
        method: 'POST',
        params: { method: "getCurrentSessionsCount"},
        success: function(responseObject) {
            currentSessionsCount = responseObject.responseText;
            Ext.getCmp('mycomp').getEl().update('<b>' + currentSessionsCount + '</b> '+ getLocalizationValue('application.javascript.imHistory.activeSession.title'));
        },
        failure: function() {
        }
    });
    
    sessionsListStore.load({params:{start:0, limit:SESSIONS_ON_PAGE}});
    chartDataStore.load();
}
