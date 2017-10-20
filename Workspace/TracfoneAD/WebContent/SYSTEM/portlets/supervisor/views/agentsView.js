
Ext.ns("Jacada.supervisor");
var TOTAL_COUNT = "totalCount";
var RESULTS = "results";

//Adds tooltip (title) to each cell
function cellRenderer(value, metaData, record, rowIndex, colIndex, store){
	metaData.attr = "title='" + value + "'";
	return value;
}

loadAgentsView = function() {
	
/**
 *  The Class that responsible rendering the Agents View Panel
 */
Jacada.supervisor.AgentView = Ext.extend(Object,{
	
	
	
	panContainer: null,
	summaryMap: {},
	tasksPanel: {},
	tasksView: new Jacada.task.TaskView(AGENT_TASK_URL, taskToolBar, null, true, false, false),
	summaryViews: [],
	allGroups:  [],
	groupStore: null,
	agentsPanel: null,
	agentTaskPanel: null,
	mainPanel: null,
	containerPanel: null,
	chatAction:null,
	currentSummaryView: null,
	isSummaryLoaded: false,
	eastPanel: null,
	northPanel: null,
	PAGE_SIZE: 10,
	storeG:null,
	groupsCombo: null,
	
	constructor: function() {
		Jacada.supervisor.AgentView.superclass.constructor.call(this);
	},
	
	init: function() {
		if (agentTaskEnable) {
			this.tasksView.init();
		}
		
		
		// groups define in  agentsView.jsp
		var len=groups.length;
		var i=0;
		for( i=0; i<len; i++) {
			rec = [];
			rec.push(groups[i]);
			this.allGroups.push(rec);
		}
		/**
		 * Creates the Group Store 
		 * 
		 */
		this.createGroupStore();
		
		/**
		 * Creates the Agent Grid
		 * 
		 */
		this.createAgentsGrids();
		/**
		 * Create the Panel of the Agents Grid
		 */
//		this.createAgentPanels();
		/**
		 * Creates the panel of the task grid
		 */
		if (agentTaskEnable) {
			this.createAgentTaskPanel();
		}
		
		/**
		 * create the main panel
		 * by default we create a border layout
		 */
		this.createMainPanel();
		
		/**
		 * register for push messages of cti status changes
		 */
		this.registerForMessages();
		
		/**
		 * resize function declared in AgentsMainView js file
		 */
		$W().registerSupervisorResize(this);
	},
	
	resizeContent: function(frameElement) {
//		this.containerPanel.setWidth(frameElement.offsetWidth);
//		this.containerPanel.setHeight(frameElement.offsetHeight); //+ 30);
//		this.containerPanel.doLayout();
//		this.containerPanel.getEl().repaint();
		this.mainPanel.setWidth(frameElement.offsetWidth - 2);
		this.mainPanel.setHeight(frameElement.offsetHeight - 2); //+ 30);
		this.mainPanel.doLayout();
		this.mainPanel.getEl().repaint();
	},
	
	resizeTaskContent: function(frameElement) {
		// ignoring resize triggering of the AgentTask Element
		// handling the resize in the container panel.
	},
	
	createMainPanel: function() {
		var _this = this;
		var center = new Ext.Panel({
			layout: 'fit',
			title: this.getLocalizationValue('application.javascript.supervisor.gridpanel.title'),
			region: 'center',
			border: false,
			hidden: false,
			minWidth: 250,
			items: [this.gridG]
		});
		
		var eastItems = [];
		if (agentTaskEnable) {
			eastItems = [this.agentTaskPanel];
		}
		this.eastPanel = new Ext.Panel({
			layout: 'fit',
			region: 'east',
		    split: true,
		    border: false,
			width: '60%',
		    minWidth: 350,
		    hidden: !agentTaskEnable,
		    items: eastItems
		});
		
		this.northPanel  = new Ext.Panel({
			region: 'north',
			layout: 'fit',
		    border: false,
			title: this.getLocalizationValue('application.javascript.supervisor.summary.title'),
			collapsible: true,
			cls: 'summaryinfopanel-north',
		    split: true,
		    hidden: false,
		    autoScroll: false,
		    minHeight: 45,
		    height: 70,
		    items: this.summaryViews
		});
		
		this.mainPanel = new Ext.Panel({
			id: 'mainpanelE',
			layout: 'border',
			autoScroll: false,
			border: true,
			bodyBorder: false,
			renderTo: 'crtl2',
			tbar: this.createToolbar(),
			items: [center, this.eastPanel, this.northPanel]
		});
	},
	/**
	 * Creates the Tasks Panel
	 * Set the default sizes
	 */
	createAgentTaskPanel: function() {
		this.tasksView.getPanel().setHeight(200);
		this.agentTaskPanel = new Ext.Panel({
			border: false,
			layout: 'fit',
			title: this.getLocalizationValue('application.javascript.supervisor.task.title'),
			items: [this.tasksView.getPanel()]
		});
	},
	
//	createAgentPanels: function() {
//		var bar = null;
//		
//		this.summaryPanel = new Ext.Panel({
//			layout: 'fit',
//			border: false,
//			cls: 'summaryinfopanel',
//			items: this.summaryViews
//		});
//	},
//	
	createGroupStore: function() {
		this.groupStore = this.createStoreForAllGroups();
	},
	
	createAgentsGrids: function() {
		
		var len = groups.length;
		var i = 0;
		for(i = 0; i < len; i++) {
			var value = groups[i];
			this.createSummaryPanel(value,i);
		}
		var _this = this;
		
		this.storeG = new Ext.data.JsonStore({
		      root: RESULTS,
		        totalProperty: TOTAL_COUNT,
		        remoteSort:true,
		        fields: [ 
		      
		        {name: 'name', type: 'string'},
		        {name: 'status', type: 'string'},
		        {name: 'group', type: 'string'},
		        {name: 'extension', type: 'string'},
		        {name: 'ufn', type: 'string'}
		      ],
		      url: Spvcontroller_JSON_URL,
		      //init order by name
		      sortInfo:{field: 'name', direction: "ASC"},
		      baseParams: { method: "getSupervisedUsers" },
		      listeners: {
		    	  beforeLoad: function(store, options){
			    	  //need to attach the group to the request when using pagination
			    	  if (_this.groupsCombo){
			    	    	Ext.applyIf(options.params, {
			    	    		group: _this.groupsCombo.getValue()               
			    	    	});
			    	  }
		      	  },
			  	  load: function(records, options){
		      		  if(!_this.isSummaryLoaded){
		      			_this.isSummaryLoaded = true;
			      		  for(var group in _this.summaryMap){
			      			  if(group != 'extended'){
			      				_this.summaryMap[group].loadData();
			      			  }
			      		  }
		      		  }else{
		      			  //we do not want to create the summary panel for no reason,
		      			  //check if the number of agents has changed and reload the summary panel
		      			  var numberOfAgents = _this.summaryMap[_this.groupsCombo.value].summaryInfo.numberOfAgents;
		      			  var totalLength = records.totalLength;
		      			  if(numberOfAgents != totalLength){
		      				  _this.summaryMap[_this.groupsCombo.value].loadData();
		      			  }
		      			  //WS-2594: Clear the Agent Task area when no user is selected
					      _this.tasksView.agentName = null;
					      _this.agentTaskPanel.setTitle(_this.getLocalizationValue('application.javascript.supervisor.task.title'));
			      		  _this.tasksView.grid.getStore().removeAll();
			        	  _this.tasksView.clearTaskDetailsGrid();
			        	  _this.tasksView.realizeToolbarButtonsState();
		      		  }
		      		  //WS-2620: Disable the chat button (no user is selected by default)
		      		  _this.chatAction.disable();
		      	  }
		      }
		    });
			var items = [];
			if (chatEnable) {
				this.chatAction = new Jacada.task.StartChatAction();
			    this.chatAction.createStartChatBtn();
				var button = this.chatAction.getButton();
				items = ['-' , button];
			}
			
			var	pagingBar = new Ext.PagingToolbar({
						pageSize: this.getPageSize(),
						store: this.storeG,
						items:items
			});
			
			this.gridG = new Ext.grid.GridPanel({
		        store:this.storeG,
		        cm: this.createColumnModel(),
		        hidden: false,
		        autoWidth: true,
		        border: false,
		        sm: new Ext.grid.RowSelectionModel({singleSelect: true, moveEditorOnEnter: false}),
		        frame: true,
		        viewConfig:{autoFill:true},//causes the column to fit the grid
		        bbar: pagingBar
		    });
			this.storeG.load( {params: {method: "getSupervisedUsers" , group: groups[0], start:0, limit:this.getPageSize()} } );
			this.gridG.getSelectionModel().on('rowselect', function(sm, rowIndex, r) {
				_this.mainPanel.doLayout(false,true);
				_this.mainPanel.render();
	 	    	//if more than 1 row are selected, do not show details
	 	    	if (_this.gridG.getSelectionModel().getSelections().length > 1){
	 	    		
	 	    	}else{
	 	    		if (agentTaskEnable) {
	 	    			_this.tasksView.changeAgentData(r.data.name);
	 	    			_this.agentTaskPanel.setTitle(r.data.name);
	 	    		}
	 	    		
	 	    		if(chatEnable){
		 	    		_this.chatAction.setSelectedAgent(r.data.name);
		 	    		if (r.data.status === 'Offline') {
		 	    			_this.chatAction.disable();
		 	    		} else {
		 	    			_this.chatAction.enable();
		 	    		}
	 	    		}
	 	    	}
	 		});
	},
	
	createSummaryPanel: function(groupName, index) {
		var _this = this;
		var hidden = true;
		if ( index == 0 ) {
			hidden = false;
		}
		var summaryView = new Jacada.supervisor.SummaryView(groupName, hidden);	
		summaryView.init();
		_this.summaryViews.push(summaryView.getPanel());

		_this.summaryMap[groupName] = summaryView;
		if (!hidden) {
			_this.currentSummaryView = summaryView.getPanel();	
		}
			
	},
	createToolbar: function() {
		var _this= this;
		var val = "";
		if (this.allGroups[0] !== undefined && this.allGroups[0][0] !== undefined ) {
			val = this.allGroups[0][0];
		}
		 var groupsCombo = new Ext.form.ComboBox({
		        store: this.createStoreForAllGroups(),
		        triggerAction: 'all',
		        disableKeyFilter: true,
		        listAlign:'tl-bl',
		        valueField: 'name',
		        lazyInit : false,
		        displayField: 'name',
		        mode: 'local',
		    	value : val,
		    	width: 135,
		        minListWidth: 150

		    }); 
		 _this.groupsCombo = groupsCombo;
		var l = new  Ext.form.Label({
			text: this.getLocalizationValue('application.javascript.supervisor.view.toolbar.title') ,
			margins: {top:0, right:10, bottom:0, left:0}
		});
		 groupsCombo.on('select', 	
				 function(combo, record, index) {
			 		_this.currentSummaryView.setVisible(false);
			 		var selectedSummary = _this.summaryMap[record.data.name].getPanel();
			 		selectedSummary.setVisible(true);
			 		_this.currentSummaryView = selectedSummary;
			 		_this.gridG.getSelectionModel().clearSelections(true);
			 		
			 		// change the store of the grid to bring the agents of the selected group
			 		_this.storeG.load( {params: {method: "getSupervisedUsers" , group: record.data.name, start:0, limit:_this.getPageSize()} } );
		 		 }
			 	, this);
		
		var bar = new Ext.Toolbar([{xtype: 'tbspacer', width: 10}, ' ', l,  {xtype: 'tbspacer', width: 10},groupsCombo]);
		return bar;
	},
	createStoreForAllGroups: function() {
		// init the store of the groups 
		var rt = Ext.data.Record.create([
		                                 {name: 'name'}
		                             ]);
		store = new Ext.data.Store({
	    	reader: new Ext.data.ArrayReader(
	    	        {
	    	            idIndex: 0  // id for each record will be the first element
	    	        },
	    	        rt ),
	      
	        data : this.allGroups, 
	        //WS-2554 Sorts the user's groups lexicographically (case sensitive)
	        sortInfo:{field: 'name', direction: "ASC"}
	    });
		return store;
	},
	createColumnModel: function() {
		// creates the column model from the configuration file
		var col_model = [];
		var i = 0;
		for(i = 0 ; i < agent_view_grid_col_model.length; i++ ) {
			var column = {};
			column.id = agent_view_grid_col_model[i].id;
			column.renderer = cellRenderer;
			column.header = this.getLocalizationValue(agent_view_grid_col_model[i].header);
			column.dataIndex = agent_view_grid_col_model[i].dataIndex;
			column.width = agent_view_grid_col_model[i].width;
			column.hidden = agent_view_grid_col_model[i].hidden;
			column.editor = new Ext.form.TextField({
				allowBlank: false	
			});
			column.sortable = agent_view_grid_col_model[i].sortable;
			column.align = agent_view_grid_col_model[i].align;
			column.renderer = cellRenderer;
			col_model.push(column);
		}
		
		var cm = new Ext.grid.ColumnModel(col_model);
	    return cm;
	},
	getAllUsersFromCurrentGroup: function () {
		var fields = [];
		var pars = 'method=getAllSupervisedUsers&group='+this.groupsCombo.getValue();
		var request = new Ajax.Request(Spvcontroller_JSON_URL, { method: 'get', parameters: pars, asynchronous : false });
		if (request.success()) {
			var data = eval("(" + request.transport.responseText + ")");
			var total = data.totalCount;
			for( i=0; i<total; i++) {
				var field = [];
				field[0] = data.results[i].name;
				field[1] = data.results[i].ufn;
				fields[i] = field; 
			}
	    }
		return fields;
		
	},
	getLocalizationValue: function(key){
    	return $W().localeManager.getLocalizationValue(key);
    },
//    renderChatIcon: function(value,parent,record) {
//    	//alert("in renderchatIcon:" + value + "," + parent + "," + record.data);
//    	return '<img src="' + contextpath + "/SYSTEM/portlets/supervisor/images/OnLine16x16.gif" + '" onmouseclick="startchat(\'' + record.data['name'] + '\')"/>';
//
//    },
    registerForMessages: function() {
    	var _this = this;
    	
    	$W().Push.registerEventHandler( 'status_changed', function(data) {
    		
			var name = data.name;
			var status = data.status;
			var ext = data.extension;
			var groups = data.groups.split(",");
			var func = function(record) {
				if (record.data.name === name) {
					record.beginEdit();
					record.set('status',status);
					
					if (record.data.extension == null || record.data.extension == '') {
						record.set('extension', ext); 
					}
					record.endEdit();
					record.commit();
				}
			}; 
			_this.storeG.each(func);
			
			//WS-2619: Refresh the Chat button if the selected agent changed his status
			if(chatEnable){
				var selectedAgent =_this.gridG.getSelectionModel().getSelections().first();
	 	    	if(selectedAgent != null && selectedAgent.get("name") == name){
	 	    		if (status === 'Offline') {
	 	    			_this.chatAction.disable();
	 	    		} else {
	 	    			_this.chatAction.enable();
	 	    		}
 	    		}
			}
			
			//Recalculate "Group General Info"
			len = groups.length;
			for( i=0; i<len; i++) {
				var sumaryView = _this.summaryMap[groups[i]];
				if ( sumaryView !== undefined && sumaryView.summaryInfo != null) {
					sumaryView.recalculate(status, data.oldStatus);
				}
			}
    	});	
    },
    
    getPageSize: function() {
    	return this.PAGE_SIZE;
    },
    
    delegateResize: function(w, h){
		var frameElement = {};
		frameElement.offsetHeight = h;
		frameElement.offsetWidth = w;
		this.resizeContent(frameElement);
    }
});
}

