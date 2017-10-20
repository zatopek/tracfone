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
                <jacada:faqList name="heading" src="/USER/portlets/faq/faq.jsp" ></jacada:faqList>
            </td></tr>
            <tr><td align="center">
                <jacada:faqList name="greeting" src="/USER/portlets/faq/faq.jsp" ></jacada:faqList>
            </td></tr>

            <tr><td>
                <jacada:faqList name="freetext" src="/USER/portlets/faq/faq.jsp" ></jacada:faqList>
            </td></tr>
    
            <tr><td>
                <netui:form action="showFaq" onSubmit="return checkSelection();">
                    <jacada:faqList name="options" src="/USER/portlets/faq/faq.jsp" ></jacada:faqList>
                </netui:form>
            </td></tr>
        
            <tr><td>
                <jacada:faqList name="agentmessage" src="/USER/portlets/faq/faq.jsp" ></jacada:faqList>
            </td></tr>
        </table>
        
    </netui-template:section>

</netui-template:template>
