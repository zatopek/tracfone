Ext.define('Jacada.system.ui.reporting.ReportsPanel', {
    extend: 'Ext.panel.Panel',
    
    canDisplay: true,
    border: false,
    tabs: [],
    ALL_GROUPS: $W().localeManager.getLocalizationValue('application.javascript.reporting.label.groups.all'),
    Reporting_JSON_URL: 'Reporting.json',
    
    initComponent: function() {
        var me = this;
        
        var REPORTING_DATE_FORMAT = $W().DATE_FORMAT;
        var RESULTS = "results";
        var TOTAL_COUNT = "totalCount";
        var Reporting_JSON_URL = 'Reporting.json';
        
      //Defining  a new 'daterange' type used by the date fields in the main panel
        Ext.apply(Ext.form.VTypes, {
            daterange : function(val, field) {
                var date = field.parseDate(val);

                if(!date){
                    return false;
                }
                if (field.startDateField) {
                    var start = Ext.getCmp(field.startDateField);
                    if (!start.maxValue || (date.getTime() != start.maxValue.getTime())) {
                        start.setMaxValue(date);
                        start.validate();
                    }
                }
                else if (field.endDateField) {
                    var end = Ext.getCmp(field.endDateField);
                    if (!end.minValue || (date.getTime() != end.minValue.getTime())) {
                        end.setMinValue(date);
                        end.validate();
                    }
                }
                /*
                 * Always return true since we're only using this vtype to set the
                 * min/max allowed values (these are tested for after the vtype test)
                 */
                return true;
            }

        });
        
        Ext.applyIf(me, {
        	layout: 'border',
            border: false,
            defaults:{
    			border: false
            },
        	items: [
        	        {
        	        	title : $W().localeManager.getLocalizationValue('application.javascript.reporting.mangement.title'),
        	        	region: 'west',
        	        	split: true,
        	        	collapsible: true,
        	        	bodyStyle: 'padding: 5px; background:white;',
        	        	minWidth: 200,
        	        	width: 200,
        	        	layout: {
        	        		type: 'vbox',
        	        		align:'stretch'
        	        	},
        				buttons:[{
        					id: 'runBtn',
        					cls: 'actionButton',
        					text : $W().localeManager.getLocalizationValue('application.javascript.reporting.button.run'),
        					handler: me.runReport,
        					scope: me
        				},{
        					id: 'cancelBtn',
        					cls: 'actionButton',
        					text : $W().localeManager.getLocalizationValue('application.javascript.reporting.button.cancel'),
        					handler: me.cancelReport
        				}
        				],
        	        	items: {
            	        	xtype: 'form',
            	        	id: 'reportForm',
            	        	border: false,
            	        	fieldDefaults: {
            	                labelAlign: 'top'
            	            },
            	            listeners:{
            	            	validitychange: function ( c, valid, eOpts ){
            	            		me.setBtnStatus();
            	            	}
            	            },
            				items: [{
            					//report type
            					id: 'reportTypes',
            					xtype: 'combobox',
            					displayField : 'displayName',
            					valueField : 'name',
            					queryMode : 'local',
            					width: 180,
            					editable : false,
            					triggerAction : 'all',
            					fieldLabel: $W().localeManager.getLocalizationValue('application.javascript.reporting.label.reports'),
            					store: new Ext.data.Store({
            				        storeId: 'reportTypeStore',
            				        proxy: {
            				            type: 'ajax',
            				            url: Reporting_JSON_URL,
            				            reader: {
            				                type: 'json',
            				                idProperty: 'name',
        				                	root : RESULTS,
        				                	totalProperty : TOTAL_COUNT
            				            }
            				        },
            				        fields : [{name:'name'},
            						          {name:'displayName',
            						          convert: function(value){
            						                return $W().localeManager.getLocalizationValue(value);
            						             }}
            								],
    								listeners:{
            				        	load: function(store){
            				        		if (store.getCount() >=1){
            				        			//insert the empty record as the first record
            				        			var value = store.data.items[0].data.name;
            				        		    Ext.getCmp('reportTypes').setValue(value);
            				        		}
            				        	}
            				        }
            				    })
            					
            				},{
            					//groups
            					id: 'groups',
            					xtype: 'combobox',
            					displayField : 'groupName',
            					valueField : 'groupName',
            					multiSelect: true,
            					queryMode : 'local',
            					allowBlank: false,
            					width: 180,
            					editable : false,
            					triggerAction : 'all',
            					minLength: 1,
            					fieldLabel: $W().localeManager.getLocalizationValue('application.javascript.reporting.label.groups'),
            					listeners:{
            						select: function(combo, records, opts) {					
            							//if records contain 'All', remove other groups
            							if(records[records.length-1].data.groupName == me.ALL_GROUPS){
            								combo.clearValue();
        									combo.setValue(me.ALL_GROUPS);
            							}else if(records.length.length = 2 && records[0].data.groupName == me.ALL_GROUPS){
            								combo.clearValue();
        									combo.setValue(records[1]);
            							}
            						}
            					},
            					store: new Ext.data.Store({
            				        storeId: 'groupsStore',
            				        proxy: {
            				            type: 'ajax',
            				            url: Reporting_JSON_URL,
            				            reader: {
            				                type: 'json',
            				                idProperty: 'name',
        				                	root : RESULTS,
        				                	totalProperty : TOTAL_COUNT
            				            }
            				        },
            				        fields : [{name:'groupName'}],
            				        listeners:{
            				        	load: function(store){
            				        		//insert the empty record as the first record
        				        		    store.insert(0, {groupName: me.ALL_GROUPS});
        				        		    Ext.getCmp('groups').setValue(me.ALL_GROUPS);
            				        	}
            				        }
            				    })
            					
            				},{
            					xtype: 'datefield',
            		            name: 'startDate',
            		            id: 'startDate',
            		            msgTarget : "under",
            		            maxValue : new Date(),
            		            value : new Date(),
            		            allowBlank : false,
            		            vtype: 'daterange',
            		            endDateField: 'endDate',
            		            fieldLabel : $W().localeManager.getLocalizationValue('application.javascript.reporting.label.startDate'),
            		            width: 100,
            		            format : REPORTING_DATE_FORMAT,
            		    		invalidText: $W().localeManager.getLocalizationValue('application.javascript.reporting.validation.date')+ REPORTING_DATE_FORMAT
            				},{
            					xtype: 'datefield',
            		            name: 'endDate',
            		            id: 'endDate',
            		            msgTarget : "under",
            		            maxValue : new Date(),
            		            value : new Date(),
            		            allowBlank : false,
            		            vtype: 'daterange',
            		            startDateField: 'startDate',
            		            fieldLabel: $W().localeManager.getLocalizationValue('application.javascript.reporting.label.endDate'),
            		            width: 100,
            		            format : REPORTING_DATE_FORMAT,
            		    		invalidText: $W().localeManager.getLocalizationValue('application.javascript.reporting.validation.date')+ REPORTING_DATE_FORMAT
            				}
            				]
            	        }
        	        },{
        	        	id :'pnlDisplay',
        	        	xtype: 'tabpanel', 
        	            activeTab: 0, 
        	            region: 'center',
        	            flex: 1,
        	            autoScroll : true,
        	    		enableTabScroll:true,
        	    		defaults : {
        	    			hideMode : 'offsets',
        	    			style : 'padding: 0px 0px 0px 0px;'
        	    		}
        	        }
        	 ]
        });
        me.callParent(arguments);
        me.registerForMessages();
        //load data
        Ext.getCmp('groups').store.load({
            params: {
            	method: "getGroups"
            },
            scope: this
        });
        Ext.getCmp('reportTypes').store.load({
            params: {
            	method: "getAvailableReports"
            },
            scope: this
        });
    },
    runReport: function(){
    	var me = this;
    	//create a temp tab with status init
    	var tempTab  = this.createReportTab();
    	tempTab.reportStatus = 'init';
    	//add to the cache
    	this.tabs[this.tabs.length] = tempTab;
    	
    	var reportForm = Ext.getCmp('reportForm');
    	if (!reportForm.loadMask) {
    		reportForm.loadMask=new Ext.LoadMask(reportForm, {msg:$W().localeManager.getLocalizationValue('application.javascript.reporting.message.initializing')});
    	}
    	reportForm.loadMask.show();
    	
    	//send the request
    	Ext.Ajax.request({
    	    url: me.Reporting_JSON_URL,
    	    timeout: 120000,
    	    method: 'POST',
    	    params: {
        		method: 'runReport',
        		reportName: Ext.getCmp('reportTypes').getValue(),
        		groups: me.getGroups(),
        		startDate: Ext.Date.format(Ext.getCmp('startDate').getValue(), "m-d-Y H:i"),
        		endDate:  Ext.Date.format(Ext.getCmp('endDate').getValue(), "m-d-Y H:i")
        	},
    	    success: function(response){
    	        me.reportExecutionStarted(response);
    	    },
    	    failure: function() {
            	//unmask the panel
    	    	reportForm.loadMask.hide();
            	//show error message
                Ext.Msg.alert($W().localeManager.getLocalizationValue('application.javascript.reporting.message.initializing.error.title'),
                			$W().localeManager.getLocalizationValue('application.javascript.reporting.message.initializing.error.body'));
             }
    	});
    	
    	this.setBtnStatus();
    	
    },
    reportExecutionStarted: function(response){
    	var reportForm = Ext.getCmp('reportForm');
    	var pnlDisplay = Ext.getCmp('pnlDisplay');
    	//unmask the panel
    	reportForm.loadMask.hide();
    	
    	var reportId = response.responseText;
    	
    	//try an locate the tab by rpoertId. It might be already there since we got an error before execution started
    	var tab = this.findTab(reportId);
    	//incase the tab exists and is showing an error - do nothing
    	if (tab && tab.reportStatus=='error') {
    		return;
    	}
    	
    	if (tab && tab.reportStatus=='finished') {
    		//add to the panel
    		pnlDisplay.add(tab).show();
    		//set the status of the buttons
    		 this.setBtnStatus();
    		 return;
    	}
    	
    	 //If tab was not found by the reportId, get the last tab from the cache (this is always the tab that is currently being initialized)
    	 tab = this.tabs[this.tabs.length-1];
    	 
    	//add to the panel
    	pnlDisplay.add(tab).show();
    	 
    	//set the reportID on the tab, so it can be identified when the finished report comes back form the server 
    	 tab.reportId = reportId;
    	 	 
    	 //set it's status to running
    	 tab.reportStatus='running';
    	 
    	 //set the mask message to show the generating message
    	 tab.loadMask = new Ext.LoadMask(tab, {msg:$W().localeManager.getLocalizationValue('application.javascript.reporting.message.generating')});
    	 tab.loadMask.show();
    	 
    	 
    	 //set the status of the buttons
    	 this.setBtnStatus();
    },
    findTab: function(reportId) {
    	
    	for (var i=0; i<this.tabs.length; i++) {
        	if(this.tabs[i].reportId == reportId) {
        		return this.tabs[i];
            }
    	}
    	return null;
    },
    /*
     * Returns the list of groups to send to the server.
     */
    getGroups: function(){
    	//get the value from the groups combo
    	var groupsCombo =  Ext.getCmp('groups');
    	var groups = groupsCombo.getValue();
    	//if the value is 'All' - iterate the combo-box and get all the values.
    	if(groups == this.ALL_GROUPS) {
    		groups = "";
    		var length = groupsCombo.store.data.items.length;
    		var currentGroup = "";
    		for (var i=1; i<length; i++) {
    			currentGroup = groupsCombo.store.data.items[i].data.groupName;
    			groups+=currentGroup;
    			if(i<length-1) {
    				groups+=',';
    			}
    		}
    	}
    	
    	return groups;
    },
    cancelReport: function(){
    	//get the active tab
    	var activeTab = Ext.getCmp('pnlDisplay').getActiveTab();
    	//get the id
    	if (activeTab) {
    		activeTab.reportStatus='cancel';
    		var activeId = activeTab.reportId;
    		//send the request to cancel the report
    		conn.request({
    	        url: Reporting_JSON_URL,
    	        method: 'POST',
    	        params: {method: 'cancelReport', reportId: activeId },
    	        failure: function() {
    	             alert('failed to cancel report');
    	        }
    	    });
    	}
    },
    createReportTab: function(){
    	var currentTime = Ext.Date.format(new Date(), $W().TIME_FORMAT);
    	var titlePrefix = $W().localeManager.getLocalizationValue('application.javascript.reporting.disaplyTab.title');
    	var titleSuffix = $W().localeManager.getLocalizationValue('application.javascript.reporting.disaplyTab.ranOn');
    	var tab = new Ext.Panel({
    		title : titlePrefix + ' ('+titleSuffix+' '+currentTime+')',
    		layout : 'fit', 
    		border : false,
    		closable:true		
    	});
    	 return tab;
    },
    setBtnStatus: function(){
    	var runBtn = Ext.getCmp('runBtn');
    	var cancelBtn = Ext.getCmp('cancelBtn');
    	
    	//special case - while initializing a report disable  the buttons
    	var lastTab = this.tabs[this.tabs.length-1];
    	if(lastTab && lastTab.reportStatus == 'init') {
    		runBtn.setDisabled(true);
    		cancelBtn.setDisabled(true);	
    		return;
    	}
    	
    	var isFormFilled=  Ext.getCmp('reportForm').isValid();			
    	var activeTab = Ext.getCmp('pnlDisplay').getActiveTab();
    	var status='';
    	if(activeTab)	{
    		status = activeTab.reportStatus;
    	}
    	
    	switch (status) {
    			
    	case 'running': //both enabled, but run enabled only if form is filled
    		runBtn.setDisabled(!isFormFilled);
    		cancelBtn.setDisabled(false);
    		break;
    		
    	case 'error': //run enabled (if form is filled), cancel disabled
    		runBtn.setDisabled(!isFormFilled);
    		cancelBtn.setDisabled(true);
    		break;
    		
    	case 'finished': //run enabled (if form is filled), cancel disabled
    		runBtn.setDisabled(!isFormFilled);
    		cancelBtn.setDisabled(true);
    		break;
    		
    	default: //run enabled (if form is filled), cancel disabled
    		
    		runBtn.setDisabled(!isFormFilled);
    		cancelBtn.setDisabled(true);
    		
    			
    	}
    },
    /*
     * Displayed the finished  report in a tab
     */
    displayReport: function(reportId){
    	//get the correct tab
    	var currentTab = this.findTab(reportId);
    	var pnlDisplay = Ext.getCmp('pnlDisplay');
    	
    	//in case the tab was already removed - ignore
    	if(!currentTab) {
    		currentTab = this.tabs[this.tabs.length-1];
    		if (currentTab.reportId==undefined) { //this mean the tab was created, but the response did nto come back fomr the server yet
    			currentTab.reportId=reportId;
    		}
    		else {
    			return;
    		}
    	}
    	
    	//in case the report was canceled - remove the tab
    	if(currentTab.reportStatus=='cancel') {
    		
    		pnlDisplay.remove(currentTab);
    		
    	}
    	
    	//unmask the tab
    	if(currentTab.loadMask!=null) {
    		currentTab.loadMask.hide();
    	}
    	
    	//mark the report as finished
    	currentTab.reportStatus='finished';
    	
    	//url for retrieving the report content
    	 var url = this.Reporting_JSON_URL+'?method=displayReport&reportId='+reportId;
    	 
    	 //add the Iframe to the report tab	 
    	 currentTab.add(Ext.create('Jacada.core.IFrameComponent', { id: reportId, url: url }));
    	
    	//finaly - set the status of the buttons
    	this.setBtnStatus();
    },
    reportReady: function(reportId){
    	if (!this.canDisplay) {
    		setTimeout('this.reportReady(\''+reportId+'\')',500);
    	}
    	else {
    		this.displayReport(reportId);
    	}
    },
    reportError: function(event){
    	var tab = this.findTab(event.reportId)
    	var pnlDisplay = Ext.getCmp('pnlDisplay');
    	//if tab is null - this means the error was received  before we got the response with the 
    	//tab id - i.e the tab was just generated, and it is the last tab in the array. 
    	//It also means we need to add it to the panel
    	if (tab == null) {
    		tab = this.tabs[this.tabs.length-1];
    		pnlDisplay.add(tab).show();
    	}
    	
    	//set the reportId for the tab
    	tab.reportId=event.reportId;
    	
    	//set the stauts to indicate error
    	tab.reportStatus='error';
    	
    	//set the title of the tab
    	tab.setTitle($W().localeManager.getLocalizationValue('application.javascript.reporting.displayTab.title.error'));
    	//set the content, by setting the HTML content of the dom element.
    	tab.el.dom.innerHTML = $W().localeManager.getLocalizationValue('application.javascript.reporting.message.error')+event.abortMessage;
    	
    	//set the status of the buttons
    	this.setBtnStatus();
    },
    reportCancelled: function(event){
    	//mark the report as canceled
    	var tab = this.findTab(event.reportId)
    	tab.reportStatus = 'cancel';
    	
    	//remove the tab from the panel
    	var pnlDisplay = Ext.getCmp('pnlDisplay');
    	pnlDisplay.remove(tab);		
    },
    registerForMessages: function(){
    	$W().Push.registerEventHandler( 'reportReady', this.reportReady.bind(this));
    	$W().Push.registerEventHandler( 'reportError', this.reportError.bind(this));
    	$W().Push.registerEventHandler( 'reportCancelled', this.reportCancelled.bind(this));
    }
});    