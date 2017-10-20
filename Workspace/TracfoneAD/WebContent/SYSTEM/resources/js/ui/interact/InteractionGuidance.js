  Ext.define('Jacada.system.ui.interact.InteractionGuidance',{
    	extend: 'Ext.panel.Panel',
        bodyPadding: 10,
        layout: 'anchor',
        autoScroll: true,
        border: false,

        initComponent: function() {
            var me = this;
            
            Ext.define("Interactions", {
                extend: 'Ext.data.Model',
                proxy: {
					type: 'rest',
					url:  $W().contextPath + '/rest/interactInformation/interactions',
					jsonData: {
						url: $W().interact.host + '/interact/version/1/account/' + $W().interact.tenantId + '/interaction',
                    	tenantId : $W().interact.tenantId,
                    	accessToken : $W().interact.accessToken,
                    	appKey: $W().interact.appKey 
					},
					limitParam: false,
	                startParam: false,
	                pageParam: false,
	                actionMethods: {create: 'POST', read: 'POST', update: 'POST', destroy: 'POST'},
					reader:{
						type: 'json',
						root: 'resources.spaces[1].spaceInteractions'
					},
					writer: {
						type: 'json',
						encode: true
					},
		            doRequest: function(operation, callback, scope) {//allow sending json using post
		                var writer  = this.getWriter(),
		                    request = this.buildRequest(operation, callback, scope);
		                   
		                if (operation.allowWrite()) {
		                    request = writer.write(request);
		                }
		               
		                Ext.apply(request, {
		                    headers       : this.headers,
		                    timeout       : this.timeout,
		                    scope         : this,
		                    callback      : this.createRequestCallback(request, operation, callback, scope),
		                    method        : this.getMethod(request),
		                    jsonData        : this.jsonData,
		                    disableCaching: false // explicitly set it to false, ServerProxy handles caching
		                });
		                Ext.Ajax.request(request);               
		                return request;
		            }
				
                },

                fields: [
                    {name: 'id', mapping: 'id'},
                    {name: 'name', mapping: 'interactionName'},
                    {name: 'description', mapping: 'description'}
                ]
            });
            
            
            Ext.applyIf(me, {
          	  
          	  items: [{
                    xtype: 'combobox',
                    itemId: 'interactionSearchCombobox',
                    store: Ext.create('Ext.data.Store', {
                        pageSize: 10,
                        autoLoad: true,
                        model: 'Interactions'
                    }),
                    displayField: 'name',
                    valueField: 'id',
                    queryMode: 'local',
                    anchor: '100%',
                    enableKeyEvents: true,

                    listeners:{
                    	select: function (combo, records, eOpts){
                    		me.runInteraction(records[0].data.id);
                    		
                    	},
                    	
                    	keypress: function(combo, e, eOpts){
                    		if(e.getKey() == e.ENTER){
                    			me.runInteraction(combo.getValue());
                    		}
                    	}
                    },
                    pageSize: 10
                }]
            });
            me.callParent(arguments);
        },
        runInteraction: function(interactionId){
        	var interactionViewerId = 'interactionViewer';
          this.remove(this.getComponent(interactionViewerId), true);
      	  this.add(Ext.create('Jacada.core.IFrameComponent', {layout: 'anchor', flex: 1, itemId: interactionViewerId, url:'SYSTEM/portlets/interact/interact.jsp?interactionId=' + interactionId}));
        }
  });
  
