var TASK_DATE_FORMAT = $W().DATE_FORMAT;
var TASK_TIME_FORMAT = $W().TIME_FORMAT;

loadUtils = function(){
	
	
	
	
	/**
	 * a Class for all the static methods
	 * 
	 */
	Ext.ns("Jacada.task");
	Jacada.task.TaskUtils = Ext.extend(Object, {
    	
    	constructor: function(){
    		
		},
    	/*
    	 * Finds a record in the given datastore
    	 */
    	getRowIndexById: function (id, datastore){
    		for(var i = 0, len = datastore.getCount(); i < len; i++){
    			var recordId = datastore.getAt(i).data.id;
    			if(id == recordId){
    				return i;
    			}
    		}
    		return -1
    	},
    	isTaskDue: function (taskDueDate){
    		//if it's not a date, turn it into one
    		if (!Ext.isDate(taskDueDate)){
    			taskDueDate = new Date(taskDueDate);
    		}
    		return (new Date().valueOf() - taskDueDate.valueOf())>0;
    	},
    	//this function can be overriden in project level to return a different id
    	getTaskTabName: function (){
    		return 'TasksTab';
    	},
    	getLocalizationValue: function(key){
        	return $W().localeManager.getLocalizationValue(key);
        },
        validateFutureDate: function(value, dateTimeField){
       	 var date = dateTimeField.df.parseDate(value);
       	    if (!date){
       	        return;
       	    }
       	    if (dateTimeField && dateTimeField.tf.value) {
       	    	//it's a future date, all hours range is fine
       	    	if (date > new Date()){
       				dateTimeField.tf.minValue = null;
       			}else{//it's today, accept only now and up
       				dateTimeField.tf.minValue = new Date();
       				//update the time field
       				var newTime = date.getTime() + Math.abs(date.getTime() - dateTimeField.tf.parseDate(dateTimeField.tf.value).getTime());
       				dateTimeField.tf.value = new Date(newTime);
       			}
       			//validate
       	        dateTimeField.tf.validate();
       	    }
       	    return true;
       }
    });
    
};