// define custom validation functions in this file

/* Prototype description:
 * Return value: true if input is valid; false otherwise.
 * Arguments: inputString  - the current value of the input element
 *            inputElement - the input element that is being validated
 *            validator    - the current validator that runs this function   
 */    
 
// Example: a custom validator that uses this example function accepts "sesame" or any string containing *
function exampleValidation(inputString, inputElement, validator)
{	    
	if ((inputString == "sesame") || (inputString.indexOf('*') >= 0))
        return true;
    else
        return false;    
}


// edit this function to change the roll back year used for 2-digit year formats.
// The behavior:
// if YY <= RollBackYear, the year is interpreted as 20YY.
// if YY >  RollBackYear, the year is interpreted as 19YY.
// for example, when returning 20 the year 20 is interpreted as 2020, the year 17 is interpreted as 2017,
// and the year 33 is interpreted as 1933.
function getRollBackYear()
{
    return 20; 
}