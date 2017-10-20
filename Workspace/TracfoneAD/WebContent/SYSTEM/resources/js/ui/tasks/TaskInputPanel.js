Ext.define('Jacada.system.ui.tasks.TaskInputPanel', {
	extend: 'Ext.form.Panel',
	
	bodyPadding: 5,
   itemId: 'taskInputPanel',
   labelAlign: 'middle',
   border:false,
   columnWidth: .5,
   fieldDefaults: {
       labelWidth: 180
   },
	
	updateInputPanel: function(taskInfo, task){
    	this.removeAll(true);
    	var items = [];
		if(taskInfo.complex){
			this.populateComplexData(taskInfo, items);
		}else{
			this.populateSimpleData(taskInfo, items);
		}
		this.add(items);
	},
	
	populateComplexData: function(field, containerItems){
		var me = this;
		var fieldSetConfig = {
				xtype: 'fieldset',
				title: '<span class="task-input-group-label">' + Jacada.Utils.getPrettyLabel(field.name) + '</span>',
				bodyPadding: 5,
		        layout: 'anchor',
		        defaults: {anchor: '100%'}
		};
		var items = [];
		if(field.members){
			field.members.each(function(member){
				if(member.complex){
					me.populateComplexData(member, items);
				}else{
					me.populateSimpleData(member, items);
				}
			});
			fieldSetConfig.items = items;
			containerItems.push(fieldSetConfig);
		}
	},
	populateSimpleData: function(field, containerItems){
		var config = {
				xtype: 'displayfield',
				fieldLabel: Jacada.Utils.getPrettyLabel(field.name),
				value: field.value,
				name: field.name,
				labelCls: 'task-input-field-label'
		};
		containerItems.push(config);
	}
});
/*
{
   "name":"loanProcessRequest",
   "complex":true,
   "members":[
      {
         "name":"loanType",
         "complex":false,
         "value":"Automobil"
      },
      {
         "name":"firstName",
         "complex":false,
         "value":"Misha"
      },
      {
         "name":"lastName",
         "complex":false,
         "value":"Ilfirovych"
      },
      {
         "name":"dayPhone",
         "complex":false,
         "value":"111-111-1111"
      },
      {
         "name":"nightPhone",
         "complex":false,
         "value":"222-222-2222"
      },
      {
         "name":"socialSecurityNumber",
         "complex":false,
         "value":"123-456-7890"
      },
      {
         "name":"amountRequested",
         "complex":false,
         "value":"10001"
      },
      {
         "name":"loanDescription",
         "complex":false,
         "value":"spent on vacation"
      },
      {
         "name":"otherInfo",
         "complex":false,
         "value":"some info"
      },
      {
         "name":"responseEmail",
         "complex":false,
         "value":"a@b.com"
      }
   ]
}
 */
