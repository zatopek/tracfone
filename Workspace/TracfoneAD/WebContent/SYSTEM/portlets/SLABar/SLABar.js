var progressSLABarInterval;
var startingWidth = 0;
var counter = 0;
var unit = 0;
var blinkingInterval;
var blinkOn = 0;
var extraOffset = 0;
var miliSecondsToProgress = 500;
var miliSecondsToProgressInASecond = 2;
var firstThird = 0;
var secondThird = 0;
var timeInSeconds;

$W().Push.registerEventHandler( 'resetSLABar',  resetSLABar);
$W().Push.registerEventHandler( 'startSLABar',  startSLABar);
$W().Push.registerEventHandler( 'freezeSLABar',  freezeSLABar);


/**
 * This method starts the SLA progress.<br>
 * @param (String) timeInSeconds This is the length of the progress bar.<br> 
 * 
 */
function startSLABar(timeInSeconds) {
	if( timeInSeconds == null || 
		((timeInSeconds != null) && timeInSeconds == '')){
		timeInSeconds = getSLAMaxTimeInSeconds();
	} 
	resetSLABar(timeInSeconds);
	if(startingWidth == 0){
		startingWidth = parseInt(document.getElementById("mask").offsetWidth);		
	}
	unit = Math.floor((startingWidth / timeInSeconds) / 2) ; //how many px to advance in half a second
	intervalInMs = (timeInSeconds * 1000) / startingWidth;
	
	initCTITimersUnits();
	
	progressSLABarInterval = setInterval(function() { doProgressSLABar(eval(timeInSeconds)); },miliSecondsToProgress);
}


/**
 * This method resets the SLA bar to zero progress with given length.<br>
 * @param (String) timeInSeconds This is the length of the progress bar.<br> 
 * 
 */
function resetSLABar(timeInSeconds) {
	if(timeInSeconds == null || 
		((timeInSeconds != null) && timeInSeconds == '')){
		timeInSeconds = getSLAMaxTimeInSeconds();
	} 
	//first stop progress
	freezeSLABar()
	
	//now reset the bar length
	var divWidth = document.getElementById("mContainer").offsetWidth;
	var img = 'WorkspaceGradient.bmp';
	if(divWidth>1600){
		img = 'WorkspaceGradient_1920.bmp';
	}else if(divWidth>1280){
		img = 'WorkspaceGradient_1600.bmp';
	}else if(divWidth>1024){
		img = 'WorkspaceGradient_1280.bmp';
	}
	Jacada.Logger.debug("slabar image is "+img+ " for width "+divWidth);
	
	document.getElementById("gradient").style.display = "block";
	document.getElementById("gradient").style.backgroundImage="url("+img+")";
	document.getElementById("mask").style.left = "0px";
	document.getElementById("mask").style.width = divWidth+20 + "px";
	document.getElementById("progressIndicator").style.zIndex  = 10;
	document.getElementById("mask").style.display = "block";
	
	minutes = Math.floor((timeInSeconds / 60));
	seconds = (timeInSeconds % 60);
	minutes = (minutes < 1) ? "0" : minutes;
	timeValue  = ((minutes < 10) ? "0" : "") + minutes;
    timeValue  += ((seconds < 10) ? ":0" : ":") + seconds;
	document.getElementById("progressIndicator").innerHTML =  timeValue ;
	extraOffset = 0;
	unit = 0;
}


/**
 * This method advance the SLA bar.<br>
 * @param (String) timeInSeconds This is the length of the progress bar.<br> 
 * 
 */
function doProgressSLABar(timeInSeconds) {
	curWidth = parseInt(document.getElementById("mask").offsetWidth);
	curLeft = parseInt(document.getElementById("mask").offsetLeft);
	
	
	
	//on first run add the extra offset
	if(extraOffset == 0){
		extraOffset = startingWidth - (unit * miliSecondsToProgressInASecond * timeInSeconds)
		curWidth = curWidth - extraOffset;
		curLeft = curLeft + extraOffset; 
	} else {
		curWidth = curWidth - unit;
		curLeft = curLeft + unit;
	}

	//stopping condition
	if(curLeft >= startingWidth) {
		clearInterval(progressSLABarInterval);
		document.getElementById("mask").style.display = "none";
		onSLATimeExceeded();
		return;
	}

	//updating SLA progress elements
	document.getElementById("mask").style.left = curLeft + "px";
	if(parseInt(document.getElementById("mask").offsetWidth)>10) {
		document.getElementById("mask").style.width = curWidth + "px";
	}
	
	//updating cti timers color
	handleCTITimerColor(curLeft);
	
	//For future use - to display precentage of progress
	//document.getElementById("progressIndicator").innerHTML = Math.floor((curLeft / parseInt(document.getElementById("gradient").offsetWidth))*100) + "%";
}


/**
 * This method will freeze the SLA Bar progress.<br>
 * 
 */
function freezeSLABar() {
	clearInterval(progressSLABarInterval);
	clearInterval(blinkingInterval);
	//display the last progress
	document.getElementById("gradient").style.display = "block";
	//reset timers class\color - only if cti bar is present
	if($W().cti != null && $W().cti.setTimerColorBySLA != null){
		$W().cti.setTimerColorBySLA("");
	}
}


/**
 * This method is to set the SLA time.<br>
 * 
 */
function getSLAMaxTimeInSeconds(){
	return 300;
}


/**
 * On SLA time expire this method is activated,
 * add operations to perform upon SLA Time Exceeded.
 * 
 */
function onSLATimeExceeded () {
	//This is the timer for the blinking SLA bar upon time expired
	blinkingInterval = setInterval('blinkSLABar()',400);
}

function blinkSLABar(){
  switch(blinkOn)
     {
     case 0:
     document.getElementById("gradient").style.display = "block";
     blinkOn=1
     break;
     case 1:
     document.getElementById("gradient").style.display = "none";
     blinkOn=0
     break;
     }
}


/**
 * method to init the CTI timers bar-length
 * 
 */
function initCTITimersUnits(){
 	firstThird = Math.floor(startingWidth / 3);
 	secondThird = firstThird * 2;
}

/**
 * method to determine the CTI timers color
 * 
 */
function handleCTITimerColor(currentLeft){
	//update CTI Timers every 1/3 progress - only if cti bar is present
	if($W().cti == null){
		return;
	}
	// I third - green
	if(currentLeft <  firstThird){
		$W().cti.setTimerColorBySLA('begin');
	}
	//II third - yellow 
	else if((currentLeft > firstThird) && (currentLeft < secondThird)) {
		$W().cti.setTimerColorBySLA('middle');
	} 
	//III third - red 
	else if(currentLeft > secondThird) {
		$W().cti.setTimerColorBySLA('end');
	}
}