<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<%-- jsf:pagecode language="java" location="/src/pagecode/USER/portlets/userInfo/UserInfoSSO.java" --%><%-- /jsf:pagecode --%>
<%@page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@page import="org.springframework.context.ApplicationContext"%>
<%@page import="org.springframework.web.context.support.WebApplicationContextUtils"%>

<html>
<head>
<title>User Info</title>



<%
			// set attribute to true if extJs should be included
			request.setAttribute("isExtJsComponent", true);
		%>
		<%@ include file = "/USER/resources/jspf/includes/moduleIncludes.jspf"%>

<script>
function submitViaEnter(){
	if(window.event && window.event.keyCode == 13){
		try{
			document.getElementById('submit').focus();
		}catch(e){
			return false;
		}
		updataUserInfo();
	}
}

function updataUserInfo(){
			var u = "/AgentDesktop/portlets/userInfo/insertUserInfo2?";
			var sysId = document.getElementsByName('sysId')[0].value;
			var sysPassword = document.getElementsByName('sysPassword')[0].value;
			var eboId;
			var eboPassword;
			var eboSecGrp;
			var userSecGroup;
			var crisRegion;
			if(document.getElementsByName('eboId')[0] != null){
				eboId = document.getElementsByName('eboId')[0].value;
				eboPassword = document.getElementsByName('eboPassword')[0].value;
				eboSecGrp = document.getElementsByName('eboSecGroup')[0].value;
			}else{
				eboId = '';
				eboPassword = '';
				eboSecGrp = '';
			}
			if(document.getElementsByName('userSecGroup')[0] != null){
				userSecGroup = document.getElementsByName('userSecGroup')[0].value;
			}else{
				userSecGroup = '';
			}
			if(document.getElementsByName('crisRegion')[0] != null){
				crisRegion = document.getElementsByName('crisRegion')[0].value;
			}else{
				crisRegion = '';
			}
			var agentExtn = document.getElementsByName('agentExtension')[0].value;
			var site = document.getElementsByName('awsSite')[0].value;
			var awsId = document.getElementsByName('awsId')[0].value;
			var awsPassword = document.getElementsByName('awsPassword')[0].value;
			var initials = document.getElementsByName('agentInitials')[0].value;
			eboSecGrp = eboSecGrp.replace(/'/g,"''");
			agentExtn = agentExtn.replace(/'/g,"''");
			site = site.replace(/'/g,"''");
			initials = initials.replace("'","''");
			var ctiAgentID = '';
			if(document.getElementsByName('ctiAgentID')[0] != null){
				ctiAgentID	=  document.getElementsByName('ctiAgentID')[0].value;			
			}
			
			if(!validate()){
				return false;
			}
			document.getElementById('submit').disabled = true;
			Ext.Ajax.request({ 
	                  url : u,
	                  method: 'GET',
	                  timeout: 120000,
   	                  params: {
   	                   'sysId' : sysId,
   	                   'sysPassword' : sysPassword,
   	                   'eboId' : eboId,
   	                   'eboPassword' : eboPassword,
   	                   'eboSecGrp': eboSecGrp,
   	                   'agentExtension': agentExtn, 
   	                   'awsSite': site,
   	                   'awsId': awsId,
   	                   'awsPassword': awsPassword,
   	                   'initials': initials,
   	                   'ctiAgentID':ctiAgentID,
   	                   'userSecGroup':userSecGroup,
   	                   'crisRegion':crisRegion
   	                     },
	                  success : 
	                  		function(request,parameters){
	                  			//alert('success: ' + request.responseText);
	                  			var data = Ext.util.JSON.decode(request.responseText);
	                  			$D().getElementById('msg').style.display = '';
	                  			if(data.ssoStatus.code == 0){
	                  				$D().getElementById('msg').innerText = 
	                  				'Credentials updated successfully.';
	                  			}else{
	                  				$D().getElementById('msg').style.color = 'red';
	                  				$D().getElementById('msg').innerText =
	                  				'Failure in updating credentials. See Administrator.';
	                  			}
	                  			document.getElementById('submit').style.display="none";
	                  			document.getElementById('close').style.display="";
	                  			document.getElementById('close').focus();
					         },
	                  failure : 
	                  		function(request,parameters){
	                  				$D().getElementById('msg').style.display = '';
	                  				$D().getElementById('msg').style.color = 'red';
	                  				 $D().getElementById('msg').innerText =
	                  				'Failure in updating credentials. See Administrator.';
								document.getElementById('submit').style.display="none";
	                  			document.getElementById('close').style.display="";
	                  			moveFocus();
	                  		}
	               });		
	               
	               return false;
 }
 

function validate(){
	if(document.getElementsByName('agentExtension')[0].value.length > 4){
		alert('Enter a 4 digit extention.');
		return false;
	}
	if(document.getElementsByName('agentInitials')[0].value.length > 4){
		alert('Enter an initial not more than 4 charectors');
		return false;
	}
	if(document.getElementsByName('ctiAgentID')[0] != null){
		if(document.getElementsByName('ctiAgentID')[0].value.length > 5){
			alert('Enter an CTI Agent ID not more than 5 charectors');
			return false;
}
}
	return true;
}

function moveFocus(){
	if($W().sourceSystem == 'CRIS'){
				document.getElementsByName('sysId')[0].focus();
			}else{
				document.getElementsByName('eboId')[0].focus();
			}
}
 </script> 

</head>
	<body bgcolor="dadada" onUnload="unregisterUserInfoHandler();">
	
		<form name="userForm" onSubmit="return updataUserInfo();" action="#">	
		
			<table class="userInfoTable">
				<tr>
				<c:choose>
				<c:when test="${userInfo.system == 'CAS'}">
				<td>EBO ID: </td><td><input tabindex="1" type="text" name="eboId" value="<c:out value="${userInfo.eboId}"/>"/></td>
				</c:when>
				<c:otherwise>
				<td>CRIS ID: </td><td><input tabindex="1" type="text" name="sysId" value="<c:out value="${userInfo.sysId}"/>"/></td>
				</c:otherwise>
				</c:choose>				
				<td>Agent WebStation ID: </td><td><input tabindex="7" type="text" name="awsId" value="<c:out value="${userInfo.awsId}"/>"/></td>
				</tr>
				
				<tr>
				<c:choose>
				<c:when test="${userInfo.system == 'CAS'}">
					<td>EBO Password: </td><td><input tabindex="2" type="password" name="eboPassword" value="<c:out value="${userInfo.eboPassword}"/>"/></td>
				</c:when>
				<c:otherwise>
					<td>CRIS Password: </td><td><input tabindex="2" type="password" name="sysPassword" value="<c:out value="${userInfo.sysPassword}"/>"/></td>
				</c:otherwise>	
				</c:choose>				
				<td>Agent WebStation Password: </td><td><input tabindex="8" type="password" name="awsPassword" value="<c:out value="${userInfo.awsPassword}"/>"/></td>
				</tr>
				
				<tr>
				<c:choose>
				<c:when test="${userInfo.system == 'CAS'}">
					<td>EBO Security Group: </td><td><input tabindex="3" type="text" name="eboSecGroup" value="<c:out value="${userInfo.eboSecGrp}"/>"/></td>
				</c:when>
				<c:otherwise>
					<td>User Security Group: </td><td><input tabindex="3" type="text" name="userSecGroup" value="<c:out value="${userInfo.userSecGrp}"/>"/></td>
				</c:otherwise>	
				</c:choose>

				<td>Agent WebStation - ACD: </td>
						<!--  -->
				<c:if test="${userInfo==null}">
  				<td>
  					<select name="awsSite"  class="awsSiteSelect" tabindex="9" >				
					<c:forEach items="${sitesList}" var="ngSites">
					<option value="${ngSites.awsSite}" >${ngSites.awsSite}</option>
					</c:forEach>		
					</select>
				</td>
				</c:if>
				<c:if test="${userInfo!=null}">
				<td>
  					<select name="awsSite"  class="awsSiteSelect" tabindex="9" onkeypress="return submitViaEnter();">						
					<c:forEach items="${sitesList}" var="ngSites">
							<c:if test="${userInfo.awsSite==ngSites.awsSite}">
							<option selected="selected" value="${ngSites.awsSite}" >${ngSites.awsSite}</option>
							</c:if>
							<c:if test="${userInfo.awsSite!=ngSites.awsSite}">
							<option value="${ngSites.awsSite}" >${ngSites.awsSite}</option>
							</c:if>
					</c:forEach>		
					</select>
					</td>
				</c:if>
				</tr>
				<c:choose>
				<c:when test="${userInfo.system == 'CRIS'}">
				<tr>
					<td>CTI Agent ID: </td><td><input tabindex="4" type="text" name="ctiAgentID" value="<c:out value="${userContact.ctiAgentID}"/>"/></td>
					<td>CRIS Region:</td>
					<c:if test="${userContact==null}">
					<td>
  						<select name="crisRegion"  class="awsSiteSelect" tabindex="10" onkeypress="return submitViaEnter();">				
							<c:forEach items="${crisRegList}" var="crisRegList">
								<option value="${crisRegList}" >${crisRegList}</option>
							</c:forEach>		
						</select>
					</td>
					</c:if>
					<c:if test="${userContact!=null}">
					<td>
  						<select name="crisRegion"  class="awsSiteSelect" tabindex="10" onkeypress="return submitViaEnter();">						
						<c:forEach items="${crisRegList}" var="crisRegList">
								<c:if test="${userContact.crisRegion==crisRegList}">
								<option selected="selected" value="${userContact.crisRegion}" >${userContact.crisRegion}</option>
								</c:if>
								<c:if test="${userContact.crisRegion!=crisRegList}">
								<option value="${crisRegList}" >${crisRegList}</option>
								</c:if>
						</c:forEach>		
						</select>
					</td>
					</c:if>
				</tr>
				</c:when>
				</c:choose>
				<tr>
				<c:choose>
					<c:when test="${userInfo.system == 'CAS'}">
					<td>CAS ID:</td><td><input tabindex="5" type="text" name="sysId" value="<c:out value="${userInfo.sysId}"/>"/></td>
					</c:when>
					<c:otherwise>
					<td>Agent Extension: </td><td><input tabindex="5" type="text" name="agentExtension" value="<c:out value="${userContact.agentExtn}"/>"/></td>
					</c:otherwise></c:choose>
					
					<c:if test="${userInfo.system == 'CAS'}">
					<td>Agent Extension: </td><td><input tabindex="10" type="text" name="agentExtension" value="<c:out value="${userContact.agentExtn}"/>"/></td>
					</c:if>
				</tr>
				
				<tr>				
				<c:choose>
					<c:when test="${userInfo.system == 'CAS'}">
					<td>CAS Password: </td><td><input tabindex="6" type="password" name="sysPassword" value="<c:out value="${userInfo.sysPassword}"/>"/></td>
					</c:when>
					<c:otherwise>
					<td>Initials: </td><td><input tabindex="6" type="text" name="agentInitials" value="<c:out value="${userContact.initials}"/>"/></td>
					 </c:otherwise></c:choose>
					 <c:if test="${userInfo.system == 'CAS'}">
					<td>Initials: </td><td><input tabindex="11" type="text" name="agentInitials" value="<c:out value="${userContact.initials}"/>"/></td>
					</c:if>
				</tr>
				<br>
				<tr>
 					<td><input type="button" id="submit" value="Close" name="close" tabindex="12" onclick="$W().closeFlyin('ngtUserInfo');" style="display:none"/>
 						<input type="submit" id="submit" value="Submit" name="submit" tabindex="11" onclick="return updataUserInfo();" /></td>
					<td><label id="msg" style="display:none"></label></td>
					<td></td>
					<td align="right"><a tabindex="13" href="javascript:$W().openAutenticatorDialog();"><u>Forgot Password?</u></a></td>
					<a tabindex="14" onkeyup="javascript:moveFocus();"/></a>
 				</tr> 
			</table>
		</form>
		<script language=JavaScript>
			if($W().sourceSystem == 'CRIS'){
				document.getElementsByName('sysId')[0].focus();
			}else{
				document.getElementsByName('eboId')[0].focus();
			}
		</script>
	</body>
</html>
