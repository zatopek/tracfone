function getTimeString(elapsedSecs) {
	var hours = Math.floor( elapsedSecs / 3600 );
	elapsedSecs = elapsedSecs - (hours*3600);

	var minutes = 	Math.floor( elapsedSecs / 60 );
	elapsedSecs = elapsedSecs - (minutes*60);

	var seconds = elapsedSecs;

	var timeValue = "" + ((hours < 10) ? "0" : "") + hours;
    timeValue  += ((minutes < 10) ? ":0" : ":") + minutes
    timeValue  += ((seconds < 10) ? ":0" : ":") + seconds

    return timeValue.substring(0, 8);
}

Timer = Class.create();
Timer.prototype = {
  initialize: function(id) {
    this.element = $(id);
    this.startDate = null;
    this.startValue = 0;
    this.totalValue = 0;
    this.stopped = true;

  },
  
  start: function(date) {
    this.startDate = date;

    this.startValue = this.startDate.valueOf();
    this.startValue -= this.totalValue;

    this.stopped = false;
    
    this.showTime(date);
  },
  
  stop: function(date) {
    if (this.timerID) {
       clearTimeout(this.timerID);
       this.timerID  = 0;
    }
 
    if (this.startDate != null) {
        var nowValue = date.valueOf();
    
        this.totalValue = nowValue - this.startValue;
    }
    
    this.showTime(date);
    
    this.startDate = null;
    this.stopped = true;
  },
  
  reset: function(date) {
    this.stop(date);
    this.startDate = null;
    this.startValue = 0;
    this.totalValue = 0;
    
    if (this.element != null) {
        this.element.innerText = '00:00:00';
		this.element.className = "normal-counter";
    }
  },
  
  showTime: function(date) {
    if (this.stopped) {
       return;
    }
    
    if (this.element == null) {
        return;
    }
    
	var elapsedSecs = this.getElapsedTime(date);

    var timeValue = getTimeString(elapsedSecs);

    // Update display
    this.element.innerText = timeValue;
    
    this.updateColor();
    
  },
  
  getElapsedTime: function(date) {
    if (this.startDate == null) {
       return Math.round((this.totalValue) / 1000);
    }
    
    if (this.elapsedSecs != null) {
        return this.elapsedSecs;
    }
    
    var nowValue = date.valueOf();
    
	var elapsedSecs = Math.round((nowValue - this.startValue) / 1000);
    
    return elapsedSecs;
  },
  showElapsedSecs: function() {
    if (this.element == null){
        return;
    }
	
	if(this.elapsedSecs == null) {
		this.showTime(date);
		return;
	}
	
    var timeValue = getTimeString(this.elapsedSecs);

    // Update display
    this.element.innerText = timeValue;
    this.updateColor();
    
    
  },

  getTotalTime: function(){

	return this.totalValue;
  },
  
  updateColor: function(){
  	//check if we have SLA deciding the timer colors
    var counterClassName = "normal-counter";
    if($W().cti.getTimerClassName() == ""){
    	//this is when SLA did not decide the timer colors
    	counterClassName = "normal-counter";
    	// this is the elapsed time to change the color of the counter to red.
		// comment this if statment if you don't want to change it to red, 
		//  or change the number of seconds to change the red.
		if (this.elapsedSecs >= getCallCounterThresholdInSec()) {
			counterClassName = "end-counter";
		}
		
	} else {
		//this is when SLA decide the timers color
		counterClassName = $W().cti.getTimerClassName();
	}
	
	
	this.element.className = counterClassName;
  }
}