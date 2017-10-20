<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ include file = "/SYSTEM/resources/jspf/pageIncludes.jspf"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-databinding-1.0" prefix="netui-data"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-html-1.0" prefix="netui"%>
<%@ taglib uri="http://beehive.apache.org/netui/tags-template-1.0" prefix="netui-template"%>
<%@ taglib uri="http://www.jacada.com/taglibs/jacada" prefix="jacada"%>

<%@ include file = "/SYSTEM/resources/jspf/checkHierarchy.jspf"%>

<netui-template:template templatePage="../../resources/jsp/wizardScriptTemplate.jsp">
    <netui-template:setAttribute name="title" value="FAQ selection page"/>

    <netui-template:section name="scriptArea">
        <table width="100%">
            <tr><td align="center">
                <jacada:faqSelectedItem name="heading" src="/USER/portlets/faq/faq.jsp" ></jacada:faqSelectedItem>
            </td></tr>
            <tr><td align="center">
                <jacada:faqSelectedItem name="greeting" src="/USER/portlets/faq/faq.jsp" ></jacada:faqSelectedItem>
            </td></tr>
            <tr><td>
                <span class="faqQuestion">C:</span>
                <jacada:faqSelectedItem name="question" src="/USER/portlets/faq/faq.jsp" ></jacada:faqSelectedItem>
            </td></tr>
            <tr><td>
                <span class="faqAnswer">A:</span>
                <jacada:faqSelectedItem name="answer" src="/USER/portlets/faq/faq.jsp" ></jacada:faqSelectedItem>
            </td></tr>
            <tr><td>
                <jacada:faqSelectedItem name="agentmessage" src="/USER/portlets/faq/faq.jsp" ></jacada:faqSelectedItem>
            </td></tr>
            <tr><td>
                <jacada:faqSelectedItem name="freetext" src="/USER/portlets/faq/faq.jsp" ></jacada:faqSelectedItem>
            </td></tr>
        </table>
        
        <netui:form action="selectFaq">
        </netui:form>        
    
    </netui-template:section>

</netui-template:template>
