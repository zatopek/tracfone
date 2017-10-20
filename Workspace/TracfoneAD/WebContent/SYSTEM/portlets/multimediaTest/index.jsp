
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>

<netui:html>
<head>
 <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/jad.js"></script>
    <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/common.js"></script>
    <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/resources/js/prototype.js"></script>
    <script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/USER/resources/js/override.js"></script>
<script language="JavaScript" type="text/javascript" src="<%=request.getContextPath()%>/SYSTEM/portlets/multimediaTest/multimediatest.js"></script>
</head>
<body>
        <netui:form action="doMultimedia">
     
        <!--This is the multimedia test portlet-->
      Multimedia operations:
      <br/>
      
      <select id="operation">
              <option value="answer" >Answer Incoming Item</option>
              <option value="end" >End Multimedia Item</option>      
              <option value="attachdata" >attach data</option>  
              <option value="deleteattachdata" >delete attach data</option>
              <option value="getattachdata" >get attach data</option>
      </select>
          <br/>
          <br/>
      
      
      
      <netui:button action="doMultimedia" value="Test Multimedia operation" />
        Multimedia Event Data:
        <br/>
        <textarea rows="10" cols="30" id="eventText" ></textarea>
        <br/>
       Multimedia Attach Data:
        <br/>
      key:<input type="text" id="key" />
			<br />
      
      value:<input type="text" id="value" />
			<br />
      
      interaction id:<input type="text" id="interaction" />
			<br />
      <script> 
        multimediatest = new multimediatest();
	    multimediatest.init();      
      </script> 
      
    
      
      
       </netui:form>
</body>       
 </netui:html>