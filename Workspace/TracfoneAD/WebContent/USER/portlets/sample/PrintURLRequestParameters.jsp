<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ page import = "java.util.Map" %>
<%@ page import = "java.util.Set" %>
<%@ page import = "java.util.Map.Entry" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Print URL Request Parameters</title>
<style>
table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
}
th, td {
    padding: 15px;
}
</style>
<script type="text/javascript">
function replaceAll(find, replace, str) {
	  return str.replace(new RegExp(find, 'g'), replace);
}

function removeAngleBrackets(value){
	if(value.indexOf('<') != -1 || value.indexOf('>') != -1){
		value = replaceAll('>', '', value);
		value = replaceAll('<', '', value);
	}

	return value;
}

</script>
</head>
<body>
<h1>Request Parameters Table</h1>

<table  style="width:100%;">
<tr><td>Key</td><td>Value</td></tr>
<%
Map<String, String[]> params = request.getParameterMap();
Set<Entry<String, String[]>> entrySet = params.entrySet();
for(Entry<String, String[]> param: entrySet){
%>	
<script type="text/javascript">

var value = '<%= param.getValue()[0] %>';
value = removeAngleBrackets(value);
var key = '<%= param.getKey() %>';
document.write('<tr><td>'+ key + '</td><td>' + value +'</td><tr>');

</script>
	
<%	
};
%>
</table>
<p>
<script>
	document.write(new Date());
</script>
</p>
	
</body>
</html>