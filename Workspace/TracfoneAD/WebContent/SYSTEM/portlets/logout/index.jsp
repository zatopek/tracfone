<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ include file = "/SYSTEM/resources/jspf/pageIncludes.jspf"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jacada" prefix="jacada"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ include file = "/SYSTEM/resources/jspf/checkHierarchy.jspf"%>
<%@ include file = "/SYSTEM/resources/jspf/includes/locale.jspf"%>
<netui:html>
	<HEAD>
		<title>goodbye</title>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>
        <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>
		<style type="text/css"> 
    BODY { BACKGROUND-COLOR: white; }
	.welcomeImage { BACKGROUND-IMAGE: url(<%=request.getContextPath()%>/USER/resources/images/welcome.png); BACKGROUND-REPEAT: no-repeat; }
	.welcomeHeader { FONT-WEIGHT: bold; FONT-SIZE: 22px; COLOR: #878787; FONT-FAMILY: arial; }
	.welcomeText { FONT-WEIGHT: bold; FONT-SIZE: 14px; COLOR: #878787; FONT-FAMILY: arial; }
	.actionButton {BACKGROUND-IMAGE: url(<%=request.getContextPath()%>/USER/resources/images/button_Blue_Normal.png);text-align:center; width: 55px; height:14px; FONT-SIZE: 12px; FONT-FAMILY: arial;color: white;TEXT-DECORATION: NONE; BACKGROUND-POSITION: right center; }
    .actionButton a{text-align:center; width: 55px; height:14px; FONT-SIZE: 12px; FONT-FAMILY: arial;color: white;TEXT-DECORATION: NONE; BACKGROUND-POSITION: right center;  }
     .actionButton:hover { BACKGROUND-IMAGE: url(<%=request.getContextPath()%>/USER/resources/images/button_Grey_Hover.png);  }
     .actionButton a:visited { BACKGROUND-IMAGE: url(<%=request.getContextPath()%>/USER/resources/images/button_Grey_Hover.png);  }
    .collapsedButton { cursor:hand; BACKGROUND-POSITION: 5px center; BACKGROUND-IMAGE: url(<%=request.getContextPath()%>/USER/resources/images/icon_Plus.png); BACKGROUND-REPEAT: no-repeat; width: 20px;}
    .expendedButton { cursor:hand; BACKGROUND-POSITION: 5px center; BACKGROUND-IMAGE: url(<%=request.getContextPath()%>/USER/resources/images/icon_Minus.png); BACKGROUND-REPEAT: no-repeat; width: 20px;}
    .subjectText { FONT-SIZE: 14px; COLOR: white; FONT-FAMILY: arial; }
	.messageText { FONT-SIZE: 14px; COLOR: white; FONT-FAMILY: arial; }
    .loginErrorMsg { FONT-WEIGHT: bold; FONT-SIZE: 14px; COLOR: red; FONT-FAMILY: arial; }
		</style>
		<script language="javascript">
			function changemode() {
				var srcElement = window.event.srcElement;
				var displayMode = "none";
				
				if (srcElement.className == "collapsedButton") {
					srcElement.className = "expendedButton";
					displayMode = "inline";
				} else {
					srcElement.className = "collapsedButton";
				}
				
                var childName = event.srcElement.getAttribute("child", false);
                if (document.getElementById(childName)) {
        			var child = document.getElementById(childName);
					child.style.display = displayMode;
				}
			}
		</script>
	</HEAD>
	<body onkeydown="onKeyDownHandler(event);">
 

    <form name="jad_logout_form">
		<table align="center" height="470" width="790" >
			<tr>
				<td class="welcomeImage" valign="top">
					<table  height="386">
						<tr>
							<td width="50" height="141"></td>
						</tr>
						<tr>
							<td width="50" height="205"></td>
							<td width="570px" height="205">
								<table width="403" >
									<tr>
										<td width="101" height="50"></td>
										<td class="welcomeHeader" colspan="4"></td>
									</tr>
									<tr>
										<td height="4"></td>
									</tr>
                                     
                                     <tr height="20"><td/></tr>
                                     
                                    <tr>
										<td width="101"></td>
										<td class="welcomeHeader" colspan="4"><fmt:message bundle="${applicationMessages}" key="application.logout.label.goodbye"></fmt:message> <netui:label value="${sharedFlow.globalApp.CTIManager.agentInformation.name}"/><br></td>                                        
									</tr>	
                                   
									<tr>
										<td width="101" height="10"></td>
										<td class="welcomeText" colspan="4" height="10"><fmt:message bundle="${applicationMessages}" key="application.logout.label.reasonForLeaving"/></td>                                    
									</tr>
                                    
                                    <tr>
										<td width="101"></td>
										<td align=right colspan=4>
                                        <p align="center">
                                        <select name="jad_logout_reason" onchange="selcetedReason(this.value);" STYLE="width: 130px">
                                            <option value ="9995"><fmt:message bundle="${applicationMessages}" key="application.logout.combo.restroom"/></option>
                                            <option value ="9997"><fmt:message bundle="${applicationMessages}" key="application.logout.combo.lunch"/></option>
                                            <option value ="9998"><fmt:message bundle="${applicationMessages}" key="application.logout.combo.break"/></option>
                                            <option value ="9999" selected="selected"><fmt:message bundle="${applicationMessages}" key="application.logout.combo.endOfShift"/></option>                                            
                                        </select>
                                    
                                       </td>
									</tr>	
									
									 <tr style="height: 40px" valign="top">
						       <td width="100px"></td>
                               <td style="padding-left: 83px;" >
                                 <div style="float: left; width: 130;">
                                 	<div style="float: left;" class="actionButton">
									<a id="logoutId" style="TEXT-DECORATION: none" href="javascript:doLogout(false);"><fmt:message bundle="${applicationMessages}" key="application.logout.button.logout"/></a>
									</div>
                                 	<div style="float: right;" class="actionButton">
                                 	<a id="cancelId" style="TEXT-DECORATION: none" href="javascript:doLogout(true);parent.ShowCurrentVisibleTab();"><fmt:message bundle="${applicationMessages}" key="application.logout.button.cancel"/></a>
									</div>
								</div>
                                 
                               </td>
						     </tr>	
                                     
                                    								
                                    <tr>
										<td width="101"></td>
										<td class="welcomeText" colspan="4">
                                        
                                            <span id="myid" style="visibility:hidden;"><fmt:message bundle="${applicationMessages}" key="application.logout.label.departmentCode"></fmt:message><input name="jad_new_dep_code_input" type="text"/></span><br>
                                        </td>
                                        
									</tr>		
                                    <tr>
                                        <td></td>
                                        <td valign="top" class="loginErrorMsg" colspan="4">
                                            <span style="visibility:hidden;"><fmt:message bundle="${applicationMessages}" key="application.logout.label.digitsDepartmentCode"></fmt:message><input name="jad_logout_error_msg" type="hidden"/></span><br>
                                        </td>                                                                           
                                    </tr>	
                                     <tr>
										<td width="101"></td>
										<td class="welcomeText" colspan="4"><br></td>
                                        
									</tr>	
                                    
								</table>
							</td>							
						</tr>
						<tr>
							<td></td>
                            <td align="right">
                              <div align="center">
                              <table width="100%" >
                                <tr valign=top height=50>
                                  
                                  <td ></td>
                                  
                                  
								<td width="201" ></td>                               
							 </tr>
                              </table>
                            	</div>
                            </td>
						</tr>
                        
					</table>
				</td>
			</tr>
		</table>
        </form>
        
        
<script language="JavaScript" type="text/javascript">
<!--
function doLogout(cancel)
{
	//debugger;
    var sel = document.jad_logout_form.jad_logout_reason;
    var reas = sel.value;  
    
    var inp = document.jad_logout_form.jad_new_dep_code_input;
    var dept = inp.value;  
    
    var isNewDepartment = (reas == '__new_department__'); 
    
    if (!cancel && isNewDepartment)
    {
        if ((dept == null) || (!dept.match(/^\d{4}$/)))
        {
            document.jad_logout_form.jad_logout_error_msg.parentNode.childNodes[0].data = "Enter a 4 digits department code";
            showErrorMsg(true);
            return;
        }
    
    }
    
    showErrorMsg(false);   
     var ret; 
    if (isNewDepartment)
    {
       ret = parent.logout(cancel, dept, true);
    }
    else
    {
       ret = parent.logout(cancel, reas, false);
    }
    if (!cancel && ret != 'OK') 
    {
        document.jad_logout_form.jad_logout_error_msg.parentNode.childNodes[0].data = ret;
       showErrorMsg(true);
    }
    
    
} 

function showErrorMsg(show)
{
    var inp = document.jad_logout_form.jad_logout_error_msg;
    var errorSpan = inp.parentNode;
        
    errorSpan.style.visibility = show ? '' : 'hidden';    

}

function selcetedReason(reas)
{
    var inp = document.jad_logout_form.jad_new_dep_code_input;
    var deptSpan = inp.parentNode;
        
    deptSpan.style.visibility = (reas == '__new_department__') ? '' : 'hidden'; 
    showErrorMsg(false);   
}
 

//-->
</script>
        
        
        
        
        
	</body>
</netui:html>