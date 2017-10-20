/** 
 * @class RAPManager - This class represents the object responsible for roles and privileges API in client side.
 */
var RAPManager = Class.create(
/** 
@lends RAPManager.prototype 
*/ 
{
	initialize: function() {
		this.cacheEnabled = isRAPCacheEnabled();
		this.cache = {};
		//initialize cache elements for specific and common methods which are:isPermitted,isPrivileged,isUserInRole
		//will store results via: this.cache['isPermitted'][privilege][permission]
		this.cache['isPermitted']={};
		//will store results via: this.cache['isPrivileged'][privilege]
		this.cache['isPrivileged']={};
		//will store results via: this.cache['isUserInRole'][role]
		this.cache['isUserInRole']={};
	},
	setIsCacheEnabled: function(flag) {
		this.cacheEnabled = flag;
	},
	getIsCacheEnabled: function() {
		return this.cacheEnabled;
	},
	
	/**
	* Returns a boolean indicating whether the authenticated user has a permission on specified privilege.
	* This method will use the cache functionality if cache is enabled. 
	* @param privilege a String specifying the name of the privilege
	* @param permission a PermissionType specifying the type of the permission
	* @return a boolean indicating whether the authenticated user has a permission on specified privilege
	*/    
	isPermitted: function(privilege, permission){
		var methodName = 'isPermitted';
		//first check the cache
		if (this.cacheEnabled){
			//if exists in the cache use the cache
			if (!Object.isUndefined(this.cache[methodName][privilege]) && !Object.isUndefined(this.cache[methodName][privilege][permission])){
				return this.cache[methodName][privilege][permission];
			}
		}
		
		//retrieving result from server
		var urlParams = "";
		urlParams += this._createUrlParam('privilege',privilege);
		urlParams += this._createUrlParam('permission',permission);
		var request = this._sendToServer(methodName, urlParams);	
		if (request.success()) {
		 	obj = (request.transport.responseText).evalJSON();
			if(this._getError(obj) != null){
				return this._returnUponError();
			}
			var res = obj['result'];
			//cache the result if cach is enabled
			if (this.cacheEnabled) {
				//initialize the map for this privilege
				if (Object.isUndefined(this.cache[methodName][privilege])) {
					this.cache[methodName][privilege] = {}
				}
				this.cache[methodName][privilege][permission] = res;
			}
			return res;
		}
		
		return false;	
	},
	
	/**
	* Returns a boolean indicating whether the authenticated user has a privilege.
	* This method will use the cache functionality if cache is enabled. 
	* @param privilege a String specifying the name of the privilege
	* @return a boolean indicating whether the authenticated user has a privilege
	*/ 
	isPrivileged: function(privilege){
		var methodName = 'isPrivileged';
		//first check the cache
		if (this.cacheEnabled){
			//if exists in the cache use the cache
			if (!Object.isUndefined(this.cache[methodName][privilege])){
				return this.cache[methodName][privilege];
			}
		}
		//retrieving result from server
		var urlParams = "";
		urlParams += this._createUrlParam('privilege',privilege);
		var request = this._sendToServer(methodName, urlParams);
		if (request.success()) {
		 	obj = (request.transport.responseText).evalJSON();
			if(this._getError(obj) != null){
				return this._returnUponError();
			}
			var res = obj['result'];
			//cache the result if cach is enabled
			if (this.cacheEnabled) {
				//initialize the map for this privilege
				this.cache[methodName][privilege] = res;
			}
			return res;
		}
		
		return false;	
	},
	
	/**
	* Returns a boolean indicating whether the authenticated user is included in the specified logical "role".
	* This method will use the cache functionality if cache is enabled. 
	* @param request HttpServletRequest
	* @param role a String specifying the name of the role
	* @return a boolean indicating whether the authenticated user is included in the specified logical "role".
	*/   
	isUserInRole: function(role){
		var methodName = 'isUserInRole';
		//first check the cache
		if (this.cacheEnabled){
			//if exists in the cache use the cache
			if (!Object.isUndefined(this.cache[methodName][role])){
				return this.cache[methodName][role];
			}
		}
		//retrieving result from server
		var urlParams = "";
		urlParams += this._createUrlParam('role',role);
		var request = this._sendToServer(methodName, urlParams);
		if (request.success()) {
		 	obj = (request.transport.responseText).evalJSON();
			if(this._getError(obj) != null){
				return this._returnUponError();
			}
			var res = obj['result'];
			//cache the result if cach is enabled
			if (this.cacheEnabled) {
				//initialize the map for this role
				this.cache[methodName][role] = res;
			}
			return res;
		}
		return false;
	},
	/**
	* Returns List of all roles of the authenticated user.
	* This method will use the cache functionality if cache is enabled. 
	* @return List of all roles of the authenticated user
	*/
	getRoles: function(){
		var methodName = 'getRoles';
		//first check the cache
		if (this.cacheEnabled){
			//if exists in the cache use the cache
			if (!Object.isUndefined(this.cache[methodName])){
				return this.cache[methodName];
			}
		}
		//retrieving result from server
		var urlParams = "";
		var request = this._sendToServer(methodName, urlParams);
		if (request.success()) {
		 	obj = (request.transport.responseText).evalJSON();
			if(this._getError(obj) != null){
				return this._returnUponError();
			}
			var res = obj['roles'];
			//cache the result if cach is enabled
			if (this.cacheEnabled) {
				//initialize the map for this user
				this.cache[methodName] = res;
			}
			return res;
		}
		return null;
		
	},
	/**
	* Returns the array of the supervisors user names for the specified agent
	* The method will return all the configured supervisors for all the groups 
	* that the specified agent belongs 
	* @return
	*/
	getSupervisorsForUser: function(){
		var urlParams = "";
		var request = this._sendToServer('getSupervisorsForUser', urlParams);
		if (request.success()) {
		 	obj = (request.transport.responseText).evalJSON();
			if(this._getError(obj) != null){
				return this._returnUponError();
			}
			return obj['supervisors'];
		}
		return null;
	},
	
	/**
	* Returns the single supervisor user name for the current agent
	* @return
	*/ 
	getSupervisorForUser: function(){
		var urlParams = "";
		var request = this._sendToServer('getSupervisorForUser', urlParams);
		if (request.success()) {
		 	obj = (request.transport.responseText).evalJSON();
			if(this._getError(obj) != null){
				return this._returnUponError();
			}
			return obj['supervisor'];
		}
		return null;
	},
	
	/**
	* Returns true is the specified agent is a supervisor -
	* belongs to a group with SupervisorsRole and
	* was assigned as a supervisor to some group.
	* This method will use the cache functionality if cache is enabled. 
	* @return
	*/
	isUserSupervisor: function(){
		var methodName = 'isUserSupervisor';
		//first check the cache
		if (this.cacheEnabled){
			//if exists in the cache use the cache
			if (!Object.isUndefined(this.cache[methodName])){
				return this.cache[methodName];
			}
		}
		//retrieving result from server
		var urlParams = "";
		var request = this._sendToServer(methodName, urlParams);
		if (request.success()) {
		 	obj = (request.transport.responseText).evalJSON();
			if(this._getError(obj) != null){
				return this._returnUponError();
			}
			var res = obj['result'];
			//cache the result if cach is enabled
			if (this.cacheEnabled) {
				//initialize the map for this user
				this.cache[methodName] = res;
			}
			return res;
			
		}
		return false;
	},
	
	/**
	* Returns the set of the group names that the specified agent belongs to
	* @param userName
	* @return
	*/ 
	getUserGroups: function(){
		var urlParams = "";
		var request = this._sendToServer('getGroups', urlParams);
		if (request.success()) {
		 	obj = (request.transport.responseText).evalJSON();
			if(this._getError(obj) != null){
				return this._returnUponError();
			}
			return obj['groups'];
		}
		return null;
	},
	
	/***********Experts API********/
	/**
	* Provides a set of the experts groups names for the current logged in agent
	* @return
	*/
	getExpertsGroupsNames: function(){
		var urlParams = "";
		var request = this._sendToServer('getExpertsGroupsNames', urlParams);
		if (request.success()) {
		 	obj = (request.transport.responseText).evalJSON();
			if(this._getError(obj) != null){
				return this._returnUponError();
			}
			return obj['groups'];
		}
		return null;
	},
	
	/**
	* Provides a set of the experts users names for the current logged in agent
	* @return
	*/
	getExpertsNames: function(){
		var urlParams = "";
		var request = this._sendToServer('getExpertsNames', urlParams);
		if (request.success()) {
		 	obj = (request.transport.responseText).evalJSON();
			if(this._getError(obj) != null){
				return this._returnUponError();
			}
			return obj['experts'];
		}
		return null;
	},
	
	/**
	* Provides a set of skills for the specified group name 
	* @param groupName
	* @return
	*/
	getGroupSkills: function(groupName){
		var urlParams = "";
		urlParams += this._createUrlParam('group',groupName);
		var request = this._sendToServer('getGroupSkills', urlParams);
		if (request.success()) {
		 	obj = (request.transport.responseText).evalJSON();
			if(this._getError(obj) != null){
				return this._returnUponError();
			}
			return obj['skills'];
		}
		return null;
		
	},
	
	/**
	* Provides a set of skills for the current logged in agent  
	* @param groupName
	* @return
	*/
	getUserSkills: function(){
		var urlParams = "";
		var request = this._sendToServer('getUserSkills', urlParams);
		if (request.success()) {
		 	obj = (request.transport.responseText).evalJSON();
			if(this._getError(obj) != null){
				return this._returnUponError();
			}
			return obj['skills'];
		}
		return null;
	},
	
	/**
	* Returns true if the current logged in agent is an expert
	* Some user is an expert if he belongs to some group
	* that was assigned to be an expert group for some other group
	* @return
	*/
	
	isUserExpert: function(){
		var urlParams = "";
		var request = this._sendToServer('isUserExpert', urlParams);
		if (request.success()) {
		 	obj = (request.transport.responseText).evalJSON();
			if(this._getError(obj) != null){
				return this._returnUponError();
			}
			return obj['result'];
		}
		return false;
	},
	
	
	/********peers API********/
	/**
	* Provides a set of the peer groups current logged in agent
	* @return
	*/
	getPeersGroupsNames: function(){
		var urlParams = "";
		var request = this._sendToServer('getPeersGroupsNames', urlParams);
		if (request.success()) {
		 	obj = (request.transport.responseText).evalJSON();
			if(this._getError(obj) != null){
				return this._returnUponError();
			}
			return obj['groups'];
		}
		return null;
	},
	
	/**
	* Returns true if the specified peerName is a peer of the current logged in agent
	* @param peerName
	* @return
	*/
	peers: function(peerName){
		var urlParams = "";
		urlParams += this._createUrlParam('peer',peerName);
		var request = this._sendToServer('peers', urlParams);
		if (request.success()) {
			obj = (request.transport.responseText).evalJSON();
			if(this._getError(obj) != null){
				return this._returnUponError();
			}
			return obj['result'];
		}
		return null;
	},
	/*
	private method for creating url parameters, for example returns &role='myrole'
	*/
	_createUrlParam: function(keyParam,valParam)
	{
		var urlParam="";
	    if (valParam != null)
	    {
	        urlParam = "&"+keyParam+"=" + valParam;
	    }
	    return urlParam;
	},
	_sendToServer: function(methodName, urlParams){
		var url = $W().contextPath+'/rap.json';
		var pars = 'method='+methodName;
     	if (urlParams != null) {
     		pars += urlParams;
     	}
     	pars += '&nocache=' + new Date().getTime();         
    	return new Ajax.Request(url, { method: 'get', parameters: pars, asynchronous : false ,
			onFailure: function(transport) {
				//alert("problem in ajax: "+transport.status);
			},
			onSuccess: function(transport) {
				obj = (transport.responseText).evalJSON();
				//using $W().rapManager because this is a callback of prototype therefore "this" is a prototype obj
				var error = $W().rapManager._getError(obj)
				if (error != null){
					//logging error
					$W().rapManager._error("The following error occured: "+ error+". The parameters causing this error are: " +pars);
				}
			}
		});
	},
	_getError: function(obj)    { 
	   if (!Object.isUndefined(obj['error'])) {
			return obj['error'];
	   }
	   return null;
	},
	//note: the initial intention was to throw exception in such case
	//however throwing exceptions between iframes is problemtic (the catch doesnt really catch the exception)
	_returnUponError: function(){
		return null;
	},
	/**
  @private - This method is for reporting errors.<b> 
  */
  _error: function(msg)
  {
        $W().LogManager.getLogger("RAPManager").error(" RAPManager.js  " + msg );
  }
});

function isRAPCacheEnabled(){
	return true;
}


