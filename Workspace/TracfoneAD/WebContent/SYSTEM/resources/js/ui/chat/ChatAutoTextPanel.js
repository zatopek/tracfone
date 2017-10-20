Ext.define('Jacada.system.ui.chat.ChatAutoTextPanel', {
	extend : 'Ext.grid.Panel',
	itemId : 'chatAutoTextPanel',
	layout : 'fit',
	collapsible: false,
	hideHeaders: true,
	initComponent: function(){
		var me = this;
        Ext.applyIf(me, {
        	listeners : {
        		celldblclick : function(chatAutoTextPanel, td, cellIndex, record, tr,
        				rowIndex, e, eOpts) {
        			$W().getTab().down('#chatPanel').setMsgEditorValue(record.data.value);
        		},
        		select: function(_this, record, index, eOpts){
        			me.down('#add').enable();
        			me.down('#send').enable();
        		},
        		contextStarted: function(type, data){
        			var ClientAutoTextListName = encodeURIComponent(data.ClientAutoTextListName);
        			var store = me.getStore();
        			store.getProxy().url = $W().contextPath+ '/rest/resource/chat/autotext/'+ ClientAutoTextListName +'?sessionId=' + $W().wsSessionId;
        			store.load();
        		},
        		contextTabChanged: function(type, data){
        			//this portlet is available only for chat editor tab
        			if($W().getTab().itemId.indexOf('ChatInfoTab')<0){
        				me.disable();
        			}else{
        				if($W().getTab().down('#chatPanel').chatClosed){
        					me.disable();
        				}//do not enable for history items
        				else if(!data.chat.retrieved){
	        				me.enable();
        				}
        			}
        		}

        	},
        	columns : [ {
        		text:  me.getLocalizedValue('column.value'),
        		dataIndex : 'value',
        		flex : 1,
        		renderer: me.dataCellRenderer
        	} ],
        	buttons : [ {
        		text : me.getLocalizedValue('add'),
        		width : '100px',
        		itemId : 'add',
        		style : 'margin:2px',
        		cls: 'actionButton',
        		disabled: true,
        		handler : function() {
        			$W().getTab().down('#chatPanel').setMsgEditorValue(me.getSelection());
        		}
        	}, {
        		text : me.getLocalizedValue('send'),
        		width : '100px',
        		itemId : 'send',
        		cls: 'actionButton',
        		style : 'margin:2px 8px 2px 2px',
        		disabled: true,
        		handler : function() {
        			$W().getTab().down('#chatPanel').sendAgentMessageFromRemote(me.getSelection());
        		}
        	} ]

        });
        me.callParent(arguments);
        Ext.getCmp('contextNavigation').registerContextListener(me);
	},
	store : {
		xtype : 'store',
		fields : [ 'topic', 'value' ],
		groupField : 'topic',
		proxy : {
			type : 'rest',
			headers: {
		    	'Accept': 'application/json',
		    	'Content-Type': 'application/json'
		    }
		}
	},
	features : [ {
		ftype : 'grouping',
		startCollapsed : true,
		groupHeaderTpl : '{name}'
	} ],
	getSelection: function(){
		return this.getSelectionModel().getSelection()[0].data.value;
	},
	dataCellRenderer: function(value, metaData, record, row, col, store, gridView){
		//add tooltip to all cells
    	metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
    	return value;
	},
    getLocalizedValue: function(key){
    	return $W().localeManager.getLocalizationValue('application.javascript.chat.autoText.'+key);
    }
});

//Extjs bug fix: http://www.sencha.com/forum/showthread.php?264961-Grid-Grouping-Bug/page3
Ext.view.Table.override
({
    hasActiveGrouping: function () 
    {
        return this.isGrouping && this.store.isGrouped();
    },
 
    getRecord: function (node) 
    {
        var me = this,
            record,
            recordIndex;
 
        // If store.destroyStore has been called before some delayed event fires on a node, we must ignore the event.
        if (me.store.isDestroyed)
         {
            return;
        }
 
        node = me.getNode(node);
        if (node) 
        {
            // If we're grouping, the indexes may be off
            // because of collapsed groups, so just grab it by id
            if (!me.hasActiveGrouping()) 
            {
                recordIndex = node.getAttribute('data-recordIndex');
                if (recordIndex) 
                {
                    recordIndex = parseInt(recordIndex, 10);
                    if (recordIndex > -1) 
                    {
                        // The index is the index in the original Store, not in a GroupStore
                        // The Grouping Feature increments the index to skip over unrendered records in collapsed groups
                        return me.store.data.getAt(recordIndex);
                    }
                }
            }
            //record = me.store.getByInternalId(node.getAttribute('data-recordId')); // comment this line for the getByInternalId error.
            //console.dir(node.getAttribute('data-recordId'));
 
            if (!record) 
            {
                record = this.dataSource.data.get(node.getAttribute('data-recordId'));
            }
 
            return record;
        }
    },
 
    indexInStore: function (node) 
    {
        //node = node.isCollapsedPlaceholder ? this.getNode(node) : this.getNode(node, false); // comment this line for the isCollapsedPlaceholder error.
        node = this.getNode(node, true);
        if (!node && node !== 0) 
        {
            return -1;
        }
        var recordIndex = node.getAttribute('data-recordIndex');
        if (recordIndex) 
        {
            return parseInt(recordIndex, 10);
        }
        return this.dataSource.indexOf(this.getRecord(node));
    }
});


Ext.override(Ext.grid.plugin.CellEditing, 
{    
    showEditor: function(ed, context, value) 
    {
        var me = this,
        record = context.record,
        columnHeader = context.column,
        sm = me.grid.getSelectionModel(),
        selection = sm.getCurrentPosition(),
        otherView = selection && selection.view;


        // Selection is for another view.
        // This can happen in a lockable grid where there are two grids, each with a separate Editing plugin
        if (otherView && otherView !== me.view) 
        {
            return me.lockingPartner.showEditor(ed, me.lockingPartner.getEditingContext(selection.record, selection.columnHeader), value);
        }


        me.setEditingContext(context);
        me.setActiveEditor(ed);
        me.setActiveRecord(record);
        me.setActiveColumn(columnHeader);


        // Select cell on edit only if it's not the currently selected cell
        if (sm.selectByPosition && (!selection || selection.column !== context.colIdx || selection.row !== context.rowIdx)) 
        {
            sm.selectByPosition
            ({
                row: (context.store.getGroupField && !! context.store.getGroupField())? context.record.index : context.rowIdx,
                column: context.colIdx,
                view: me.view
            });
        }


        ed.startEdit(me.getCell(record, columnHeader), value, context);
        me.editing = true;
        me.scroll = me.view.el.getScroll();
    }
});