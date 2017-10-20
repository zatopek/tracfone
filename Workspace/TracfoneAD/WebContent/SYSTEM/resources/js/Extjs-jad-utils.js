/*
This file contains utility functions that we (Jacada) created while working with extjs
*/

  
  
  
/********************************************************************************
   * Functions that can be used when working with Ext.ux.form.DateTime
   
    *********************************************************************************/

/**This function validates that the conbination of startDate:startTime occurs before endDate:endTime.
e.g: validateRange(25/12/08, 08:00, 25/12/08, 07:00) should return false because 25/1208 08:00 DOES NOT occur before 25/1208 08:00
Note: this function assumes the given input is the value of the date feilds (not the date it self)
parameters:
startDateVal - the value to be assigned to the starting date (with no time).
startTimeVal - the value to be assigned to the starting time.
endDateVal - the value to be assigned to the ending date (with no time).
endTimeVal - the value to be assigned to the ending time.
startDateTimeField - the field containing the startDateVal, startTimeVal in the dt,tf.
endDateTimeField - the field containing the endDateVal, endTimeVal in the dt,tf.

*/
function validateRange(startDateVal, startTimeVal, endDateVal, endTimeVal, startDateTimeField, endDateTimeField) {
	//checking value exist, otherwise we havent initialized yet.return true because we have nothing to validate
	if (!startDateVal || startDateVal.length == 0 || !startTimeVal || startTimeVal.length == 0 || !endDateVal || endDateVal.length == 0 || !endTimeVal ||endTimeVal.length == 0){
		return true;
	}
	


	var start;
	var end; 
	var timeDiffTemp;
	var miliSecondTemp;
	//parsing the values
	var parsedStartDate = startDateTimeField.df.parseDate(startDateVal);
	//Note: parsed values for time are always with "TODAY's" date
	var parsedStartTime = startDateTimeField.tf.parseDate(startTimeVal);
	var parsedEndDate = endDateTimeField.df.parseDate(endDateVal);
	//Note: parsed values for time are always with "TODAY's" date
	var parsedEndTime = endDateTimeField.tf.parseDate(endTimeVal);
	
	//checking parsed succedded, otherwise cannot validate
	if (!parsedStartDate || !parsedStartTime || !parsedEndDate || !parsedEndTime){
		return false;
	}
	//1.construct "date:time" combination for start
	//find the timeDiff in miliseconds by substracting vlues with/without time
	timeDiffTemp = Math.abs(parsedStartTime.getTime()-parsedStartTime.clearTime().getTime());
	miliSecondTemp = parsedStartDate.getTime() + timeDiffTemp; 
	start = new Date(miliSecondTemp);
	
	//2.construct "date:time" combination for end
	//find the timeDiff in miliseconds by substracting vlues with/without time
	timeDiffTemp = Math.abs(parsedEndTime.getTime()-parsedEndTime.clearTime().getTime());
	miliSecondTemp = parsedEndDate.getTime() + timeDiffTemp; 
	end = new Date(miliSecondTemp);
	

	
	if (start > end){
		return false;
	}
	return true; 
}
/*
This function is specifically for handling a range of two fields [taken from extjs forum]. It should act in the following way:
Selecting an initial date sets the minimum value for the end field. Selecting an ending date sets a maximum value for the start field.
Specifically in our case this function will be assigned to the displayDateFrom.df and displayDateTo.df to affect the range of dates there.
Note: It doesnt deal with the "time" fields in our form but only with the "date" fields.
parameters:
val - the date Value that changed
field - the DateField that is about to hold the given value
*/
function updateDateRange(val, field) {
   var date = field.parseDate(val);
   // We need to force the picker to update values to recaluate the disabled dates display
   var dispUpd = function(picker) {
      var ad = picker.activeDate;
      picker.activeDate = null;
      picker.update(ad);
   }
  
  //startDateField exists on the displayDateTo.df feild so we know that displayDateTo.df changed. need to set displayDateFrom.df range so that its max value will not excced displayDateTo.df 
  if (field.startDateField) {
  	//we store in the startDateField the id of the component that represents the start time of the range (displayDateFrom)
      var sd = Ext.getCmp(field.startDateField);
      //displayDateFrom.df should have a max date accrodingly
      sd.df.maxValue = date;
      
      //updating the picker/menu of the date accordingly if exist 
      if (sd.df.menu && sd.df.menu.picker) {
        sd.df.menu.picker.maxDate = date;
        dispUpd(sd.df.menu.picker);
      }
    
      
       
   } else //displayDateFrom.df changed
  	//endDateField exists on the displayDateFrom.df feild so we know that displayDateFrom.df changed. need to set displayDateTo.df range so that its min value will not excced displayDateFrom.df  	
   	  if (field.endDateField) {
   	  	//we store in the endDateField the id of the component that represents the end time of the range (displayDateTo)
	      var ed = Ext.getCmp(field.endDateField);
	      // updating the min value for the endTimeField which is displayDateTo
	      ed.df.minValue = date;
	     
	      if (ed.df.menu && ed.df.menu.picker) {
	        ed.df.menu.picker.minDate = date;
	        dispUpd(ed.df.menu.picker);
	      }
	      
	  }
    
   
    
    return true;
   
}


/*
 * update the the mintime to be in the future - relevant for fields that need to be in the future
 * dateTimeField -  dateTimeField (Ext.ux.form.DateTime) containing the df, dt
 * chosenDate - the date value that is about to be assigned to the df 
 * Note: We need this function because the tf always has "Today" as a date. For example even if we chose 25/12 as date and 08:00 as time and now is 24/12 09:00 then
 * if we try to give time a minimum of "now" (dateTimeField.tf.minValue= newDate()) then it isnt good because the validation will fail when comparing time ("today" 08:00) and its minimum ("today" 09:00). 
 * The solution here is to NOT set a minimum for the time when the date is already in the future.
 */
function updateMinTimeAndDateToFuture(chosenDate, dateTimeField) {
	//check that the chosen date is valid (not changing the dateTimeField.df )
    var date = dateTimeField.df.parseDate(chosenDate);
    if (!date){
        return;
    }
    var minTimeValue;
    var minDateValue = dateTimeField.df.parseDate(new Date()).clearTime();//today without time
    if (dateTimeField && dateTimeField.tf.value) {
    	//it's a future date, all hours range is fine
    	if (date > new Date()){
    		//in such case elapse the minValue of the time
			dateTimeField.tf.minValue = null;
		}else{//it's today, accept only time that is now and up
			dateTimeField.tf.minValue = new Date();
		}
    }
    
    //update the min date value only if it is bigger than the current one (because minValue could have been updated as a result of the updateRange function
    if (dateTimeField.df.minValue < minDateValue){
    	dateTimeField.df.minValue = minDateValue;
    }
    //always return true, because we do not really validate, we simply update the min value
    return true;
}   
  
  
  
  //end of class