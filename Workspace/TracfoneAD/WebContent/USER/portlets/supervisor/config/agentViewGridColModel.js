var agent_view_grid_col_model = [
                             
                                 {
                                 	id: 'name'
                                    ,header:'application.javascript.supervisor.agents.grid.name.header'
                                    ,sortable:true
                                    ,hidden :true
                                    ,dataIndex:'name'
                                    ,editor:'textfield'
                                    ,description: "The Agent ID in the system."
                                 },
                                 {
                                  	id: 'ufn'
                                     ,header:'application.javascript.supervisor.agents.grid.ufn.header'
                                     ,sortable:true
                                     ,dataIndex:'ufn'
                                     ,editor:'textfield'
                                     ,description: "User Friendly Name - the agent display name in the system."
                                  },
                                 {
                                  	 id: 'status'
                                     ,header:'application.javascript.supervisor.agents.grid.status.header'
                                     ,sortable:true
                                     ,dataIndex:'status'
                                     ,editor:'textfield'
                                     ,description: "The CTI Status of the Agent."
                                 },
                                 {
                                	 id: 'groups'
                                         ,header:'application.javascript.supervisor.agents.grid.groups.header'
                                         ,sortable:true
                                         ,dataIndex:'group'
                                         ,editor:'textfield'
                                         ,description: "All the groups of the Agent."
                                 },{
                                	 id: 'extension'
                                         ,header:'application.javascript.supervisor.agents.grid.extension.header'
                                         ,sortable:false
                                         ,dataIndex:'extension'
                                         ,editor:'textfield'
                                         ,description: "The extension number of the Agent."
                                 }
                                 
                                 ];