
function auxIsZip(str) 
{   
    return (str.match(/^\d{5}$|^\d{5}(-\d{4})$/) != null);
}

function jad_validateZipcode(inputStr, inputElement)
{
    //var inp = input.getAttribute('value');
    var inp = inputStr + "";    
    if (inp == "")
        return true;
    return auxIsZip(inp);
}    

function jad_validateCreditCard(inputStr, inputElement)
{
    var inp = inputStr + "";
    
    if (inp == "")
        return true;        
    
    return  ( ((inp.match(/^\d{13,16}$/) != null) ||
               (inp.match(/^\d{4} \d{4} \d{4} \d{4}$/) != null) ||
               (inp.match(/^\d{4}-\d{4}-\d{4}-\d{4}$/) != null) ||
               (inp.match(/^\d{4} \d{6} \d{5}$/) != null) ||
               (inp.match(/^\d{4}-\d{6}-\d{5}$/) != null))
        && (jad_isValidCardNumber(inp)));         
}


function jad_isValidCardNumber(strNum) 
{
   var nCheck = 0;
   var nDigit = 0;
   var bEven  = false;
   
   for (n = strNum.length - 1; n >= 0; n--) 
   {
      var cDigit = strNum.charAt (n);
      if (jad_isDigit (cDigit))
      {
         var nDigit = parseInt(cDigit, 10);
         if (bEven)
         {
            if ((nDigit *= 2) > 9)
               nDigit -= 9;
         }
         nCheck += nDigit;
         bEven = ! bEven;
      }
      else if (cDigit != ' ' && cDigit != '.' && cDigit != '-')
      {
         return false;
      }
   }
   return (nCheck % 10) == 0;
}

function jad_isDigit (c)
{
   var strAllowed = "1234567890";
   return (strAllowed.indexOf (c) != -1);
}

function auxValidCreditCard(CreditCard)
{
	// Valid Input Syntax:
	// Type1: **************** (16 columns)
	// Type2: **** **** **** **** (19)
	// Type3: ****-****-****-**** (19)
	// Input is a credit card number in the form of a string.
	// Validates numbers which use a "double-add-double MOD 10"
	// check digit Output is False if not valid, True if valid.

	var Validity = false;       // Assume invalid card
	var LN = CreditCard.length;	 // Get input value length

	if ((16 <= LN) && (LN <= 19))
	{
		LN --;
		CheckSum = 0;	// start with 0 checksum
		Dbl = false;	// Start with a non-doubling

		//------------------------------------------------------------
		//	Beginning backward loop through string
		//-------------------------------------------------------------

		for (Idx = LN; Idx >= 0; Idx --)
		{
			Digit = CreditCard.substr(Idx, 1);	  // Isolate character
			if (("0" <= Digit && Digit <= "9")
			     || Digit == " " || Digit == "-")
			{
				if (Digit != " " && Digit != "-")
				{ // Skip connector
					Digit -= "0";	  // Remove ASCII bias
					if (Dbl)
					{		  // If in the "double-add" phase
						Digit += Digit; // Then double first
						if (Digit > 9){ // Cast nines
						Digit -= 9;
					}
				}
				Dbl = !Dbl; // Flip doubling flag
				CheckSum += Digit;  // Add to running sum
				if (CheckSum > 9){  // Cast tens
				CheckSum -= 10; // Same as MOD 10, but faster
				}
			}
		}
		else
		{
			return(Validity);	// Invalid
		}
    }
    Validity = (CheckSum == 0) ? true : false; // Must sum to 0
  }
  return(Validity);
}


function jad_getDateArrayFromFormat(inputStr, format)
{   
    if (format == null)
    {
        return null;    
    }     
    
    format = format.toLowerCase();
    var input = inputStr + "";        
   
    if (input == "")
        return null;            
    
    var day;
    var month;
    var year;
    
    // define the relevant regexps 
    var regex_spaces = /(^\d{1,2})\ (\d{1,2})\ (\d{4,4})|(^\d{1,2})\ (\d{1,2})\ (\d{2,2})/;
    var regex_nothing = /(^\d{2})(\d{2})(\d{4})$|(^\d{2})(\d{2})(\d{2})$/    
    var regex_bs = /(^\d{1,2})\/(\d{1,2})\/(\d{4,4})$|(^\d{1,2})\/(\d{1,2})\/(\d{2,2})$/;
    var regex_point = /(^\d{1,2})\.(\d{1,2})\.(\d{4,4})$|(^\d{1,2})\.(\d{1,2})\.(\d{2,2})$/;
    var regex_kv = /(^\d{1,2})\-(\d{1,2})\-(\d{4,4})$|(^\d{1,2})\-(\d{1,2})\-(\d{2,2})$/;
    
    var regex_spaces_yyyy   = /(^\d{4})\ (\d{2})\ (\d{2})/;
    var regex_nothing_yyyy  = /(^\d{4})(\d{2})(\d{2})$/    
    var regex_bs_yyyy       = /(^\d{4})\/(\d{2})\/(\d{2})$/;
    var regex_point_yyyy    = /(^\d{4})\.(\d{2})\.(\d{2})$/;
    var regex_kv_yyyy       = /(^\d{4})\-(\d{2})\-(\d{2})$/;
    
    // find the regexp to use by looking for a delimiter (-,/,., ) in the inpur
    var currRegexp;
    var currRegexpForYYYYMMDD;
    if (inputStr.indexOf("/") > 0)
    {
        currRegexp = regex_bs;
        currRegexpForYYYYMMDD = regex_bs_yyyy;    
    }    
    else if (inputStr.indexOf(".") > 0)
    {
        currRegexp = regex_point;  
        currRegexpForYYYYMMDD = regex_point_yyyy;      
    }     
    else if (inputStr.indexOf("-") > 0)
    {      
        currRegexp = regex_kv; 
        currRegexpForYYYYMMDD = regex_kv_yyyy;    
    }
    else if (inputStr.indexOf(" ") > 0)
    {
        currRegexp = regex_spaces;    
        currRegexpForYYYYMMDD = regex_spaces_yyyy;    
    }
    else 
    {
        currRegexp = regex_nothing; 
        currRegexpForYYYYMMDD = regex_nothing_yyyy;   
    }
   
    if (format != 'yyyymmdd')
    {
        // verify that the input is according to regexp
        if ( currRegexp.test(inputStr) )
        {
            var month = new String(RegExp.$1);
            var day = new String(RegExp.$2);
            var year = new String(RegExp.$3);
            
            if ( month.length == 0 ) 
            {
                if ((format == 'ddmmyyyy') || (format == 'mmddyyyy'))
                {
                    return null; // needed a 4 chars year and couldn't find
                }
                else            
                {
                    month = new String(RegExp.$4);
                    day = new String(RegExp.$5);
                    year = new String(RegExp.$6);                    	
                    
                    var rollBackYear = getRollBackYear();                    
                    if (parseInt(year) <= rollBackYear-0)
                    {
                        year = new String(2000 -0 + (year-0));
                    }
                    else
                    {
                        year = new String(1900 -0 + (year-0));
                    }
                    
                }
            }  
            else // found a 4 chars year, check if that what we wanted
            {
                if ((format != 'ddmmyyyy') && (format != 'mmddyyyy')) 
                    return null;            
            }   
        }
        else
        {
           return null;
        }
    
        // replace day & month if needed           
        if ((format == 'ddmmyy') || (format == 'ddmmyyyy')) 
        {
            var tmp = day;
            day = month;
            month = tmp;
        }
    
        return new Array(day, month, year);
    }
    else // format is YYYYMMDD
    {
        // verify that the input is according to regexp
        if ( currRegexpForYYYYMMDD.test(inputStr) )
        {
            var year    = new String(RegExp.$1);
            var month   = new String(RegExp.$2);
            var day     = new String(RegExp.$3);            
        }
        else
        {
           return null;
        }    
        
        return new Array(day, month, year);
    }
}

function jad_getDateArray(inputStr, inputElement, validator)
{
    var format = validator.getAttribute('format');
    
    return jad_getDateArrayFromFormat(inputStr, format);
}



function jad_validateDate(inputStr, inputElement, validator)
{
    var dateArr = jad_getDateArray(inputStr, inputElement, validator);
    if (dateArr == null)
        return false;    
    
    var day   = dateArr[0];
    var month = dateArr[1];
    var year  = dateArr[2];

    return auxValidateDate(day, month, year);     
}




function auxValidateDate(day, month, year)
{
    month = month -1;
    
    var dteDate;
    
    //set up a Date object based on the day, month and year arguments
    //javascript months start at 0 (0-11 instead of 1-12)
    dteDate=new Date(year,month,day);        

    /*
    Javascript Dates are a little too forgiving and will change the date to a reasonable guess if it's invalid. We'll use this to our advantage by creating the date object and then comparing it to the details we put it. If the Date object is different, then it must have been an invalid date to start with...
    */
    return ((day==dteDate.getDate()) && (month==dteDate.getMonth()) &&
                         ((year==dteDate.getFullYear()) || (year==dteDate.getYear())));
}

function validateNumber(field)
{
	if(isNaN(field))
		return false;
	else
		return true; 
}

function validateInteger(field)
{
    var objRegExp  = /(^(\-|\+)?\d\d*$)/;
    return objRegExp.test(field);
}

function validateMaxLength(field, max)
{ 
	if (!max)
		return true;
	
	var inp = field + ""; // make sure it's a string	
		
	return (inp.length - 0 <= max - 0)    
}

function validateMinLength(field, min)
{ 
	if (!min)
		return true;
	
	var inp = field + ""; // make sure it's a string	
		
	return (inp.length - 0 >= min - 0)    
}

function validateMinValueNumber(field, validator)
{
    
    var min = getMinValue(validator);    
    if (validateNumber(min) == false)
    {       
        signalValidatorError(validator, null, '##Invalid minValue##');	 
		return true;
    }
	    
	if (validateNumber(field) == false)
    {    
		return true;
    }	   
        
	return (field-0 >= min-0);
}


function validateMaxValueNumber(field, validator)
{
    var max = getMaxValue(validator);
    
    if (validateNumber(max) == false)
    {   
        signalValidatorError(validator, null, '##Invalid maxValue##');	 
		return true;
    }
	    
	if (validateNumber(field) == false)
    {    
		return true;
    }
	    
	return (field-0 <= max-0);
}

// note: always get in ddmmyyyy format
function validateMinDate(inputStr, input, validator, doMax)
{    
    // create an object for minimum date
    if (doMax == true)
        var minDateArr = jad_getDateArrayFromFormat(getMaxValue(validator), getFormat(validator));
    else
        var minDateArr = jad_getDateArrayFromFormat(getMinValue(validator), getFormat(validator));
    if (minDateArr == null)
    {
        if (doMax == true)
        {
            signalValidatorError(validator, input, '##Invalid maxValue##');                
        }
        else
        {
            signalValidatorError(validator, input, '##Invalid minValue##');                
        }
        return true;    
    }
    var minDay   = minDateArr[0];
    var minMonth = minDateArr[1];
    var minYear  = minDateArr[2];
    
    var minDateObj = new Date(minYear,minMonth-1,minDay);
    
    // create an object for input date
    var dateArr = jad_getDateArray(inputStr, input, validator);
    
    if (dateArr == null)
        return true;
    
    var day   = dateArr[0];
    var month = dateArr[1];
    var year  = dateArr[2];
    
    var dateObj = new Date(year,month-1,day);    
    
    if (doMax == true)
    {
        return (dateObj <= minDateObj);    
    }
    else    
        return (dateObj >= minDateObj);    
}


    



function validateString(field, min, max)
{ 
	if (!min) { min = 1 } 
	if (!max) { max = 65535 } 

	if (!field.value || field.value.length < min ||  field.value.max > max) 
	{ 	
		return false; 
	} 
	return true; 
}


function jad_validateEmail(inputStr, inputEl) 
{    
    var reg1 = /(@.*@)|(\.\.)|(@\.)|(\.@)|(^\.)/; // not valid
    var reg2 = /^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,3}|[0-9]{1,3})(\]?)$/; // valid
    if (!reg1.test(inputStr) && reg2.test(inputStr)) 
    { 
        // if syntax is valid
        return true;
    }
    return false;
}


function jad_validatePhoneNumber(PhoneNumber)
{	
    if ((PhoneNumber == null) || (PhoneNumber == ""))
        return true;
    var PNum = new String(PhoneNumber);
    //	555-555-5555	
    //	(555)555-5555	
    //	(555) 555-5555	
    //	555-5555        
  
    var regex = /^[0-9]{3,3}\-[0-9]{3,3}\-[0-9]{4,4}$|^\([0-9]{3,3}\) [0-9]{3,3}\-[0-9]{4,4}$|^\([0-9]{3,3}\)[0-9]{3,3}\-[0-9]{4,4}$|^[0-9]{3,3}\-[0-9]{4,4}$/;
    return regex.test(PNum);}


function jad_validateSSN(SSN, in1, in2)
{
    if ((SSN == "") || (SSN == null))
        return true;
        
	var SSNum = new String(SSN);
    var regex = /^[0-9]{3,3}\-[0-9]{2,2}\-[0-9]{4,4}$/;
    return regex.test(SSNum);
}


function validateRegexp(field, regexp) 
{ 	
    if ((field == null) || (field == ""))
        return true;    
   
	var strField = field + "";		// convert to strings
	var strRegexp = regexp + "";    
    
	var reg = new RegExp(regexp);
    
    return reg.test(strField); 	
}

function runCustom(validator, inputStr, inputEl)
{	
	var funcName = validator.getAttribute('onvalidate');
	if (!funcName)		
		return true;
	    
	var func = this[funcName];		// get the function by its name
    
    if (func == null)   // no such validtion function
    {        
        signalValidatorError(validator, inputEl, '##JavaScript function not found: ' + funcName + '##');                
        return true;
    }
    
    // invoke the function with the input element as a parameter	    
	return (func(inputStr, inputEl, validator) == true);	
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function attrExists(validator, attrName)
{
	return (validator.getAttribute(attrName) != null);	
}



function attrIsTrue(validator, attrName)
{
	var attr  = validator.getAttribute(attrName);
	if (attr == null)
		return false;
	if (attr.toLowerCase() == "true")
		return true;
	else
		return false;
}

function attrIsFalse(validator, attrName)
{
	var attr  = validator.getAttribute(attrName);
	if (attr == null)
		return false;
	if (attr.toLowerCase() == "false")
		return true;
	else
		return false;
}

function getMinValue(validator)
{
	return validator.getAttribute('minValue');
}

function getMinLength(validator)
{
	return validator.getAttribute('minLength');
}

function getMaxLength(validator)
{
	return validator.getAttribute('maxLength');
}

function getFormat(validator)
{
	return validator.getAttribute('format');
}


function hasGoodDateFormat(validator)
{
    var format = getFormat(validator);
    if ((format == null) || (format == ""))
        return false;
    
    format = format.toLowerCase();
    return ((format == 'mmddyy') || (format == 'mmddyyyy') || 
            (format == 'ddmmyy') || (format == 'ddmmyyyy') || (format == 'yyyymmdd'));
}


function getMaxValue(validator)
{
	return validator.getAttribute('maxValue');
}

function getStyleClass(validator)
{
	return validator.getAttribute('styleClass');
}

function getInputType(validator)
{
	return (validator.getAttribute('inputType') !=null ? validator.getAttribute('inputType') : "");
}

function getRegexp(validator)
{
	return validator.getAttribute('regexp');
}

function getRange(validator)
{
	return validator.getAttribute('range');
}

function getErrorMessage(validator)
{
	return validator.getAttribute('errorMessage');
}



function shouldValidateNumber(validator)
{
	return attrIsTrue(validator, 'number');	
}

function shouldValidateMinLength(validator)
{
	return attrExists(validator, 'minLength');	
}

function shouldValidateMaxLength(validator)
{
	return attrExists(validator, 'maxLength');	
}

function shouldValidateNumberRange(validator)
{    
    return getRange(validator) == 'numeric';
}

function shouldValidateDateRange(validator)
{    
    var range = getRange(validator);
    if (range == null)
        return false;
        
    range = getRange(validator).toLowerCase();
    return (range == 'date');
}    
    /*
    return ((format == 'mmddyy')   || 
            (format == 'mmddyyyy') ||
            
            (format == 'ddmmyy')   ||            
            (format == 'ddmmyyyy') ||            
            (format == 'yyyymmdd'));
    */


function shouldValidateRequired(validator)
{
	if (attrIsTrue(validator, 'required'))
    {        
		return true;
    }
	else
     
		return false;		
}

function shouldValidateMinValue(validator)
{
	return attrExists(validator, 'minValue');		
}

function shouldValidateMaxValue(validator)
{
	return attrExists(validator, 'maxValue');			
}

function shouldValidateInteger(validator)
{
	return attrIsTrue(validator, 'integer');			
}

function shouldValidateRegexp(validator)
{
	return attrExists(validator, 'regexp');			
}

function shouldRunCustom(validator)
{
	return attrExists(validator, 'onValidate');	
}

function shouldDisplayStatic(validator)
{
	return (attrExists(validator, 'layout') && (validator.getAttribute('layout') == "static"));
}

function shouldTrim(validator)
{
	if (attrIsFalse(validator, 'trim'))
		return false;
	else
		return true;
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////


// -----------------------------------------
//                  trim
// Trim leading/trailing whitespace off string
// -----------------------------------------
function trim(str)
{ 
    if (str == null)
        return "";
        
    str = str + "";
    return str.replace(/^\s+|\s+$/g, '')
}

function trimAndLower(str)
{
	var str1 = trim(str);
	if (str1 != null)
		return str1.toLowerCase();
  
}

function jadAssert(cond, str)
{
	if (cond)
		return;
	else
		alert('assertion failed: ' + str);
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////


// should be operated on 'onLoad' event (e.g. of body) 
// loop through all validator in document and run initializeValidator() for each one of them
function enableValidation()
{
	// loop through all span elements and look for ones that have 'jadValidation' attribute. 
 	var elements = document.getElementsByTagName('span'); 
 	
 	for(var i = 0; i < elements.length; i++) 
 	{ 	 
   		var attr = elements.item(i).getAttribute('jadValidation'); 
   		if (attr != null) 
   		{ 
	   		initializeValidator(elements.item(i));
   		}
	}	
}


// this function is invoked by the 'OnSubmit' for all validators
function runValidator(validator)
{        
		if (validator == null)
			return true;
			
		var inputElement = getInputFromValidator(validator);	
	   	if (inputElement == null)
	   		return true; // no input conected, don't block submission
	   	else
	   	{ 
            var ret = activateValidator(validator, inputElement);
            return ret; 			
	   	}	   		   	
}



function getInputFromValidator(validator)
{
	// get the validator's input element
    var inputElement = null;
    var elementId = validator.getAttribute('for');    
    if (trim(elementId) != "") 
    {                        
          var tagName = lookupNameByTagId(elementId, this );        
          if ((tagName != null) && (tagName != ""))        
          {
              inputElement = document.getElementById(tagName);
          }                         
                  
        // if not found by tagId, try to use the original id (the value of the 'name' attribute)
        if (inputElement == null)
            inputElement = document.getElementById(elementId);        
    }
    return inputElement;    
}

function signalValidatorError(validator, inputEl, msg)
{               
        validator.setAttribute('innerHTML', msg);
        handleInvalid(validator, inputEl);
        validator.setAttribute('errorState', 'true');
        return;
}


function initializeValidator(validator)
{
	// TODO: initialization to the validator... set all attributes etc, e.g. according to type
	
	var inputElement = getInputFromValidator(validator);
	
	if (inputElement == null)   // no such input element
    {
        signalValidatorError(validator, inputElement, '##Input element not found##');                
        return true;        
    }	
	
	// add the current validator to the validators string (space seperated) of the input object
	var validators = inputElement.getAttribute('validators');
	if (validators == null)
		validators = "";
	validators = trim(validators);	
	inputElement.setAttribute('validators', validators + " " + validator.getAttribute('id'));
	
	// add the onchange event handler unless 'valitationTime' is set to onSubmit
	if (requestedEachFieldValidation(validator))
    {       
		inputElement.onchange=validateInput;	    
    }
}



// return true unless only submit-time validation is explicitly requested 
function requestedEachFieldValidation(validator)
{

	var validationTime = validator.getAttribute('validationTime');    
	if (validationTime == null)
		return true;
	if ('onsubmit' == validationTime.toLowerCase())
		return false;
	else
		return true;
}

// return true if unless only submit-time validation is explicitly requested 
function requestedOnBackValidation(validator)
{
	var validateOnBack = validator.getAttribute('validateOnBack');
	if (validateOnBack == null)
		return false;
	if ('true' == validateOnBack.toLowerCase())
		return true;
	else
		return false;
}



function validateInput()
{
	// note: 'this' is the input object being validated. 	
	var validatorsString = this.getAttribute('validators');
	validatorsString = trim(validatorsString);	
	var validatorsArray = validatorsString.split(" ");
	
	var i=0;

	while (i < validatorsArray.length )		// foreach validator of this input 
	{        
		var validator = document.getElementById(validatorsArray[i]);
        
        // activate only validator that requested each field validation [validationTime!='onSubmit']
        if ((validator != null) && requestedEachFieldValidation(validator))
            activateValidator(validator, this);		
		
		i+=1;
	}   
}


function activateValidator(validator, input)
{    
    if (validator == null)
        return true;
	var valid = doValidation(validator, input);
	
	if (valid)
	{        
		handleValid(validator, input);
		return true;
	}
		
	else
	{        
		handleInvalid(validator, input);
		return false;	
	}
}

// this function is invoked when a validation has been made
function handleValid(validator, input)
{
    if (validator.getAttribute('errorState') == 'true')
        return; // don't remove the error message.
        
	if (shouldDisplayStatic(validator))
	{
		validator.style.visibility = 'hidden'; 
	}
	else
	{
		validator.style.display = 'none';
	}	
}

// this function is invoked when an invalidation has been made
function handleInvalid(validator, input)
{
    // note: input may be null in case of a wrong TagId
    
    	validator.style.visibility = '';	
        validator.style.display = '';	    
        
    /*
	if (shouldDisplayStatic(validator))  // only make it visible
	{
		validator.style.visibility = '';	
	}
	else
	{
		// should remove the style.display = none
		validator.style.display = '';		
	}
    */	
}


// this function is called when a validation is needed for an input according to a validator, e.g. upon 
// submission or on the input's 'onChange'. Called by the input object while running 'validateInput'.
function doValidation(validator, input)
{    
	jadAssert((validator != null) && (input != null), "doValidation");
	
//alert('input is of type ' + input.getAttribute('type'));
    
    // handle checkbox/radio inputs
    if ((input.getAttribute('type') == "radio") ||
        (input.getAttribute('type') == "checkbox"))
        
    {
        if (shouldValidateRequired(validator))
        {   
            var inputArray = input.parentNode.parentNode.getElementsByTagName('input');
            var forText = validator.getAttribute('for');
			var forTextTagName = (lookupNameByTagId(trim(forText), this));
			if (forTextTagName == null) {
				forTextTagName = trim(forText);
			}
            var i;
            for (i=0; i < inputArray.length; i ++)
            {                
                if (inputArray[i].name == forTextTagName) {
	                if ( ((inputArray[i].type == 'radio'   ) || 
	                      (inputArray[i].type == 'checkbox')) 
	                    &&  (inputArray[i].checked)             )
	                {             
	                    return true;            
	                }
				}
            }         
            return false;
        }                 
    }
    
    // handle select-one inputs     
    if (input.getAttribute('type') == "select-one")        
    {
        if (shouldValidateRequired(validator))
        {            
            return (input.value != 'netui_null');
        }              
    }
    
   
    
	var inputStr = input.getAttribute('value');	
	
    if (shouldTrim(validator))
		inputStr = trim(inputStr);
    
    // if empty, valid if no value is required.
	if (inputStr == "")
		return (!shouldValidateRequired(validator));	
        
        
	if (shouldRunCustom(validator)) 
        return (runCustom(validator, inputStr, input) == true);
		
		
	if (shouldValidateNumber(validator) &&	!validateNumber(inputStr))
		return false;
		
	if (shouldValidateInteger(validator) &&	!validateInteger(inputStr))
		return false;	
		
	if (shouldValidateMaxLength(validator) && !validateMaxLength(inputStr, getMaxLength(validator)))
		return false;
	
	if (shouldValidateMinLength(validator) && !validateMinLength(inputStr, getMinLength(validator)))
		return false;
        
    if (shouldValidateNumberRange(validator))
    {            
        if (shouldValidateMinValue(validator) && !validateMinValueNumber(inputStr, validator))
            return false;
		
        if (shouldValidateMaxValue(validator) && !validateMaxValueNumber(inputStr, validator))
            return false;    
    }
    
   
    if (shouldValidateDateRange(validator))
    {       
        if (hasGoodDateFormat(validator) == false)
        {    
              signalValidatorError(validator, input, '##Invalid date format##');  
              return true;
        }
        else
        { 
            if (shouldValidateMinValue(validator) && (!validateMinDate(inputStr, input, validator, false)) && 
                                                (jad_validateDate(inputStr, input, validator)))
                return false;
            
            if ((shouldValidateMaxValue(validator) && !validateMinDate(inputStr, input, validator, true)) &&
                                                (jad_validateDate(inputStr, input, validator)))
                return false;		
        }
    }
   
	if (shouldValidateRegexp(validator) && !validateRegexp(inputStr, getRegexp(validator)))
		return false;
		
	return true;

}

function isDoingBack()
{
    return isGoingBack(); // in navigation.js    
}

function onSubmitValidation() {
   return onSubmitValidationInternal();
}


function onSubmitValidationInternal()
{   
    //requestedOnBackValidation(validator)
    var doingBack = isDoingBack();
    
	var canSubmit = true;	
	// loop through all span elements and look for ones that have 'jadValidation' attribute. 
 	var elements = document.getElementsByTagName('span'); 
 	
    var focusValidator = null; // the first invalid validator that will get the focus
 	for(var i = 0; i < elements.length; i++) 
 	{ 	 
   		var attr = elements.item(i).getAttribute('jadValidation'); 
         
   		if (attr != null) 
   		{                     
            if (!doingBack || (requestedOnBackValidation(elements.item(i)) ))
            {
                var res = runValidator(elements.item(i));
                
                if (!res && (focusValidator == null))
                {
                    focusValidator = elements.item(i);                    
                }
                canSubmit = (canSubmit && res);                    
            }
            else // should not validate this input - 'clean' it
            {
                handleValid(elements.item(i));
            }
   		}
	}	   
    
    if (canSubmit != true)
    {
        alert($W().localeManager.getLocalizationValue("application.javascript.message.alert.invalid.field.values"));
        setFocus(focusValidator); // set the focus on the first error
        return false;
    } 
	else
        return true;
}

function setFocus(validator)
{
    if (!validator)
        return;
        
    var inp = getInputFromValidator(validator);
    
    if (inp != null)
        inp.focus();
}

// example custom function
function myval(inputStr, inputEl, validator)
{	
	var val = inputEl.getAttribute('value');
	val = trim(val);
	return (val == "jacada"); 
    
    // or just: return (inputStr == "jacada");
}



