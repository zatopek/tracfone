
//***  Adjust personalization for web pages that includes ExtJs components ***
         
function extPersonalizationInit(doc, contextPath){
  // set default blank image url to a local image 
  // to avoid non secure item warning in IE when running in HTTPS:
  Ext.BLANK_IMAGE_URL = contextPath+"/SYSTEM/resources/images/1x1.gif";
  Ext.SSL_SECURE_URL = contextPath+"/SYSTEM/resources/html/empty.html";
  setExtStyle(doc, contextPath);
  setExtLocale(doc, contextPath);
  overrideExtStyleForSpecificClass(doc, contextPath);

}

function setExtLocale(doc, contextPath){
  var ss = doc.createElement("script");
   ss.setAttribute("type", "text/javascript");
   if(Ext.version && Ext.version.indexOf('3.4')>=0){
	   ss.setAttribute("src", contextPath+"/SYSTEM/resources/js/extJS/src/locale/"+getLocale());//3.4
   }else if(Ext.getVersion().major == 4){
	   ss.setAttribute("src", contextPath+"/SYSTEM/resources/js/extJS_/locale/"+getLocale()); // 4.x
   }else{
	   alert('This version of ExtJS is not supported!');
   }
   doc.getElementsByTagName("head")[0].appendChild(ss);
}

function setExtStyle(doc, contextPath){
	var url;
	if(Ext.version && Ext.version.indexOf('3.4')>=0){
		url = contextPath+"/SYSTEM/resources/js/extJS/resources/css/"+$W().theme.ext3Style;
   	}else{
   		url = contextPath+"/SYSTEM/resources/js/extJS_/resources/css/"+$W().theme.extStyle;
   	}
  var ss = doc.createElement("link");
       ss.setAttribute("rel", "stylesheet");
       ss.setAttribute("type", "text/css");
       ss.setAttribute("id", "ext_theme");
       ss.setAttribute("href", url);
       doc.getElementsByTagName("head")[0].appendChild(ss);
      }

function overrideExtStyleForSpecificClass(doc, contextPath){
   //add the overriding style for unordered list,ordered list, bold etc it will only take affect when using the classes inside
  var url = contextPath+"/SYSTEM/resources/css/overrideExtStyleForSpecificClasses.css";
  var override_ss = doc.createElement("link");
       override_ss.setAttribute("rel", "stylesheet");
       override_ss.setAttribute("type", "text/css");
       override_ss.setAttribute("id", "override_ext_formatting");
       override_ss.setAttribute("href", url);
       doc.getElementsByTagName("head")[0].appendChild(override_ss);
  
}



function getLocale(){
	if(!$W().localeManager){
		return "ext-lang-en.js";
	}
  var locale = $W().localeManager.getLocale();
    return "ext-lang-"+locale+".js";
    
}