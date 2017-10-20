<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0"
	prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0"
	prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0"
	prefix="netui-template"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jacada" prefix="jacada"%>
<%@ taglib uri="http://jakarta.apache.org/taglibs/log-1.0" prefix="log"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jacada-component"
	prefix="jacada-component"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jadvalidation"
	prefix="jacada-validation"%>

<netui:html>
<head>
<script language="JavaScript" type="text/javascript"
	src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
<script language="JavaScript" type="text/javascript"
	src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>
<script language="JavaScript" type="text/javascript"
	src="<%=request.getContextPath()%>/SYSTEM/resources/js/prototype.js"></script>
<script language="JavaScript" type="text/javascript"
	src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>
<script language="JavaScript" type="text/javascript"
	src="<%=request.getContextPath()%>/SYSTEM/portlets/CTITest/ctitest.js"></script>
</head>
<netui:body >



	<netui:form action="repeat">
	
	
	<br />
		<netui:button action="startSMT" value="Start SMT" />
			<br />
		<netui:button action="stopSMT" value="Stop SMT" />
			<br />
      file name:
      <netui:textBox dataSource="pageFlow.smtFileName" />
      <br />
      Description:
      <netui:textBox dataSource="pageFlow.smtDescription" />
		<br />
		<br />
        
        Select CTI Client state:
            <netui:select
			dataSource="pageFlow.ctiClientInfo.clientStateName"
			defaultValue="not_initialized">
			<netui:selectOption value="not_initialized" />
			<netui:selectOption value="ready_to_start_outbound" />
			<netui:selectOption value="ready_to_dial" />
			<netui:selectOption value="dialing" />
			<netui:selectOption value="notready" />
			<netui:selectOption value="ready" />
			<netui:selectOption value="first_incall" />
			<netui:selectOption value="incall" />
			<netui:selectOption value="inhold" />
			<netui:selectOption value="inconsultation" />
			<netui:selectOption value="inconference" />
			<netui:selectOption value="inconference_end" />
			<netui:selectOption value="inconference_quit" />
			<netui:selectOption value="manual_ready" />
			<netui:selectOption value="manual_incall" />
			<netui:selectOption value="manual_disposition" />
			<netui:selectOption value="disposition" />
			<netui:selectOption value="disposition_in_progress" />
			<netui:selectOption value="ready_in_progress" />
			<netui:selectOption value="notready_in_progress" />
			<netui:selectOption value="hold_in_progress" />
			<netui:selectOption value="offhold_in_progress" />
			<netui:selectOption value="consult_in_progress" />
			<netui:selectOption value="conference_in_progress" />
			<netui:selectOption value="return_in_progress" />
			<netui:selectOption value="cold_transfer_in_progress" />
			<netui:selectOption value="warm_transfer_in_progress" />
			<netui:selectOption value="ringing" />
			<netui:selectOption value="answer_in_progress" />
			<netui:selectOption value="sync_in_progress" />
			<netui:selectOption value="manual_ready_resync" />
			<netui:selectOption value="manual_incall_resync" />
			<netui:selectOption value="manual_disposition_resync" />

		</netui:select>
		<br />
		<br />
      Error status:
      <netui:textBox dataSource="pageFlow.ctiClientInfo.errorMessage" />
		<br />
		<br />
		<%
			/*
			Select timers to reset:<br>
			<netui:checkBox dataSource="{pageFlow.ctiClientInfo.resetCallTimer}"/>Call<br>
			<netui:checkBox dataSource="{pageFlow.ctiClientInfo.resetHoldTimer}"/>Hold<br>
			<netui:checkBox dataSource="{pageFlow.ctiClientInfo.resetPreparationTimer}"/>Preparation<br>
			<netui:checkBox dataSource="{pageFlow.ctiClientInfo.resetWrapupTimer}"/>Wrapup<br>
			 */
		%>
      Select operations the server support (has destinations for):<br>
		<netui:checkBox dataSource="pageFlow.ctiClientInfo.hasConsultInfo" />Consult<br>
		<netui:checkBox dataSource="pageFlow.ctiClientInfo.hasTransferInfo" />Transfer<br>
		<br>
		<netui:checkBox dataSource="pageFlow.ctiClientInfo.allowCTIResync" />enable Resync<br>
      
       Number of calls:
      <netui:textBox dataSource="pageFlow.ctiClientInfo.numberOfCalls" />
		<br />
      Call ID:
      <netui:textBox dataSource="pageFlow.ctiClientInfo.callId" />
		<br />
		<br />
      
      customer:<br>
      CallId:<input type="text" id="customerCallId" />
		<br>
      DN:<input type="text" id="customerId" />
      State:<input type="text" id="customerState" />
		<br />
      
      supervisor:<br>
      CallId:<input type="text" id="superCallId" />
		<br>
      DN:<input type="text" id="superId" />
      State:<input type="text" id="superState" />
		<br />
		<br />
		<netui:button action="queryStatus" value="Query Status" />
		<br />
		<!--This is an internal test part-->
		<jacada:if expr="${pageFlow.enableTestCtiOperation}">   
      Select CTI Client operation to test:
      <br />

			<netui:select dataSource="pageFlow.operation" defaultValue="answer">
				<netui:selectOption value="answer" />
				<netui:selectOption value="transfer" />
				<netui:selectOption value="setAgentStatus" />
				<netui:selectOption value="attachUserData" />
				<netui:selectOption value="deleteAttachedUserData" />
				<netui:selectOption value="updateAttachedUserData" />
				<netui:selectOption value="dial" />
				<netui:selectOption value="release" />
				<netui:selectOption value="hold" />
				<netui:selectOption value="offhold" />
			</netui:select>
			<br />
			<br />
      
      param1:<input type="text" id="param1" />
			<br />
      
      param2:<input type="text" id="param2" />
			<br />
      
      param3:<input type="text" id="param3" />
			<br />
      
      param4:<input type="text" id="param4" />
      <br />
      
      param5:<input type="text" id="param5" />
			<netui:button action="testClient" value="Test client operation" />
		</jacada:if>
		
    	<netui:button action="sendDTMF" value="sendDTMF" />
		<script> 
        ctitest = new ctitest();
	    ctitest.init();      
      </script>
 <br />
 section for testing project-level cti bar:
  <br />
  <br />
   select button operation for the clickButton API:	
 <netui:select dataSource="pageFlow.buttonOperation" defaultValue="answer">
				<netui:selectOption value="answerOpenMedia" />
				<netui:selectOption value="endOpenMedia" />
				<netui:selectOption value="end" />
				<netui:selectOption value="answer" />
				<netui:selectOption value="hold" />
				<netui:selectOption value="holdOff" />
				<netui:selectOption value="return" />
				<netui:selectOption value="join" />
				<netui:selectOption value="consult" />
				<netui:selectOption value="handshaketransfer" />
				<netui:selectOption value="warmtransfer" />
				<netui:selectOption value="coldtransfer" />
				<netui:selectOption value="transfer" />
				<netui:selectOption value="dial" />
				<netui:selectOption value="start" />
				<netui:selectOption value="transferFromConsult" />
				<netui:selectOption value="returnCall" />
				<netui:selectOption value="completeTransfer" />
				<netui:selectOption value="startOutbound" />
				<netui:selectOption value="aftercallwork" />
				<netui:selectOption value="busy" />
				<netui:selectOption value="resync" />
				<netui:selectOption value="ready" />
			</netui:select>
			
		
  
 
      <br />
	enter dn:(relevant for dial/transfer/consult)<input type="text" id="dn" />
			<br />
	enter location:(relevant for multi-site)<input type="text" id="location" />
			<br />
	enter channel:(voice/customItem channels ae available, leave this param empty to perform the operation on all channels)<input type="text" id="channel" value="" />
			<br />
			
	<netui:button action="testButtonClicked" value="Test buttonClicked operation" />
	
	<br />
  <br />
   select script operation:	
   <br />
 <netui:select dataSource="pageFlow.scriptOperation" defaultValue="loadScript">
				<netui:selectOption value="loadScript" />
				<netui:selectOption value="unloadScript" />
				<netui:selectOption value="navigateToLink" />

</netui:select>
			
		
   <br />
	enter url:(relevant for loadScript/NavgateToLink)<input type="text" id="url" />
			<br />
 
      <br />
      <netui:button action="testScriptOperation" value="Test script operation" />
	
Smart Pad Transfered Data:
        <br/>
        <textarea rows="10" cols="30" id="transferedDataEventText" ></textarea>
        <br/>
	</netui:form>
</netui:body>
</netui:html>