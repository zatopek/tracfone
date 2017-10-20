loadSummaryView = function() {

	Ext.ns("Jacada.supervisor");
	
	Jacada.supervisor.SummaryView = Ext.extend(Object,{
		
		summaryPanel: null,
		dataPanel: null,
		totalAgentsLabel: null,
		numberAgentsOnlineLabel: null,
		numberAgentsInCallLabel: null,
		numberAgentsAfterCallLabel: null,
		summaryInfo: null,
		group: null,
		hidden: false,
		numberAgentsOnlinePanelLabel: null,
        numberAgentsOnlinePanelValue: null,
        numberAgentsAfterCallPanelLabel: null,
        numberAgentsAfterCallPanelValue: null,
        numberAgentsInCallPanelLabel: null,
        numberAgentsInCallPanelValue: null,
        numberAgentsPanelLabel: null,
        numberAgentsPanelValue: null,
        utils: new Jacada.task.TaskUtils(),
		
		constructor: function(group, hidden) {
			Jacada.supervisor.AgentView.superclass.constructor.call(this);
			this.group = group;
			this.hidden = hidden;
		},
		init: function() {
			this.createTotalAgentsPanel();
			this.createAgentsOnlinePanels();
			this.createAgentsInCallPanels();
			this.createAgentsAfterCallPanels();
			this.createDataPanel();
			this.createSummaryPanel();
		},
		
		getPanel: function() {
			return this.summaryPanel;
		},
		
		createSummaryPanel: function() {
			this.summaryPanel = new Ext.Panel({
				layout: 'fit',
				border: false,
				hidden: this.hidden,
				items:[ this.dataPanel],
				cls: 'summaryinfomainpanel'
			});
		},
		
		createDataPanel: function() {
			
			var panel1 = new Ext.Panel({
				layout: 'table',
				border: false,
				autoWidth: true,
				layoutConfig: {
			   		columns: 2
				},
				items: [ this.numberAgentsPanelLabel,
				         this.numberAgentsPanelValue,
				         this.numberAgentsOnlinePanelLabel,
				         this.numberAgentsOnlinePanelValue
				         ]

			});
			var panel2 = new Ext.Panel({
				layout: 'table',
				border: false,
				autoWidth: true,
				layoutConfig: {
			   		columns: 2
				},
				items: [  this.numberAgentsAfterCallPanelLabel,
					         this.numberAgentsAfterCallPanelValue,
					         this.numberAgentsInCallPanelLabel,
					         this.numberAgentsInCallPanelValue
				         ]

			});
			
			this.dataPanel = new Ext.Panel({
				layout: 'table',
				border: false,
				autoWidth: true,
				layoutConfig: {
				    columns: 2
				},
				items: [
				        panel1,panel2
				       ]
			});
		},
		
		createTotalAgentsPanel: function() {
			
			this.numberAgentsPanelLabel = new Ext.Panel({
				border: false,
				cls: 'summaryinfolabelPanel',
				items:[{
						 xtype: 'label',
						 text: this.utils.getLocalizationValue('application.javascript.supervisor.summary.agents'),
						 cls: 'summaryinfolabel'
						}
				]
			});
			this.totalAgentsLabel =  new Ext.form.Label({
				text: this.getInfoFromData("total"),
				cls: 'summaryinfolabel'
			});
			this.numberAgentsPanelValue = new Ext.Panel({
				border: false,
				items:[this.totalAgentsLabel],
				cls: 'summaryinfolabelValue'
			});
		},
		createAgentsOnlinePanels: function() {
			this.numberAgentsOnlinePanelLabel = new Ext.Panel({
				border: false,
				cls: 'summaryinfolabelPanel',
				items:[{
						 xtype: 'label',
						 text: this.utils.getLocalizationValue('application.javascript.supervisor.summary.online'), 
						 cls: 'summaryinfolabel'
						}
				]
			});
			this.numberAgentsOnlineLabel =  new Ext.form.Label({
				text: this.getInfoFromData("online"),
				cls: 'summaryinfolabel'
			});
			this.numberAgentsOnlinePanelValue = new Ext.Panel({
				border: false,
				items:[this.numberAgentsOnlineLabel],
				cls: 'summaryinfolabelValue'
			});
		},
		
		createAgentsInCallPanels: function() {
			
			this.numberAgentsInCallPanelLabel = new Ext.Panel({
				border: false,
				cls: 'summaryinfolabelPanel',
				items:[{
						 xtype: 'label',
						 text:  this.utils.getLocalizationValue('application.javascript.supervisor.summary.incall'),
						 cls: 'summaryinfolabel'
						}
				]
			});
			this.numberAgentsInCallLabel =  new Ext.form.Label({
				text: this.getInfoFromData("incall"),
				cls: 'summaryinfolabel'
			});
			this.numberAgentsInCallPanelValue = new Ext.Panel({
				border: false,
				items:[this.numberAgentsInCallLabel],
				cls: 'summaryinfolabelValue'
			});
			
		},
		
		createAgentsAfterCallPanels: function() {
			
			this.numberAgentsAfterCallPanelLabel = new Ext.Panel({
				border: false,
				cls: 'summaryinfolabelPanel',
				items:[{
						 xtype: 'label',
						 text: this.utils.getLocalizationValue('application.javascript.supervisor.summary.aftercall'),
						 cls: 'summaryinfolabel'
						}
				]
			});
			
			this.numberAgentsAfterCallLabel =  new Ext.form.Label({
				text: this.getInfoFromData("aftercall"),
				cls: 'summaryinfolabel'
			});
			this.numberAgentsAfterCallPanelValue = new Ext.Panel({
				border: false,
				cls: 'summaryinfolabelValue',
				items:[this.numberAgentsAfterCallLabel]
			});
			
		},
		
		loadData: function() {
			var _this = this;
			var conn = new Ext.data.Connection();
	        conn.request({
	            url: Spvcontroller_JSON_URL,
	            method: 'POST',
	            params: { method: "getGeneralInformation", group: _this.group},
	            success: function(responseObject) {
	            	
	            	_this.summaryInfo = Ext.util.JSON.decode(responseObject.responseText).data;
	            	_this.populateFields();
	            	
	             },
	             failure: function(r,a,b) {
	            	 _this.summaryInfo = {};
	             }
	        });
		},
		
		getInfoFromData: function(type) {
			if ( null == this.summaryInfo) {
				return "N/A";
			}
			if (type == 'online') {
				return this.summaryInfo.numberOfAgentsOnline + '';
			} else if (type == 'aftercall') {
				return this.summaryInfo.numberOfAgentsAfterCallWork + '';
			} else if (type == 'incall') {
				return this.summaryInfo.numberOfAgentsInCall + '';
			} else if (type == 'total'){
				return this.summaryInfo.numberOfAgents + '';
			} else {
				return 'N/A';
			}
		},
		
		populateFields: function() {
			
			if (this.numberAgentsOnlineLabel != null) {
				this.numberAgentsOnlineLabel.setText(this.getInfoFromData('online'));
			} 
			if (this.totalAgentsLabel != null) {
				this.totalAgentsLabel.setText(this.getInfoFromData('total'));
			} 
			if (this.numberAgentsAfterCallLabel != null) {
				this.numberAgentsAfterCallLabel.setText(this.getInfoFromData('aftercall'));
			} 
			if (this.numberAgentsInCallLabel != null) {
				this.numberAgentsInCallLabel.setText(this.getInfoFromData('incall'));
			} 
		}, 
		
		recalculate: function(status, oldStatus) {
			if (oldStatus == 'Online' &&  this.summaryInfo.numberOfAgentsOnline > 0 ) {
				this.summaryInfo.numberOfAgentsOnline--;
			} else if(oldStatus == 'In call' && this.summaryInfo.numberOfAgentsInCall > 0) {
				this.summaryInfo.numberOfAgentsInCall--;
			}  else if(oldStatus == 'After call work' && this.summaryInfo.numberOfAgentsAfterCallWork > 0) {
				this.summaryInfo.numberOfAgentsAfterCallWork--;
			}
			if (status == 'Online') {
				this.summaryInfo.numberOfAgentsOnline++;
			} else if(status == 'In call') {
				this.summaryInfo.numberOfAgentsInCall++;
			}  else if(status == 'After call work') {
				this.summaryInfo.numberOfAgentsAfterCallWork++;
			}
			this.populateFields();
				
		},
		
		resizeContent: function(frameElement) {
			this.summaryPanel.setWidth(frameElement.offsetWidth);
			this.summaryPanel.doLayout();
			this.summaryPanel.getEl().repaint();
		},

	    delegateResize: function(w, h){
			var frameElement = {};
			frameElement.offsetHeight = h;
			frameElement.offsetWidth = w;
	    }
	});
}