---
sidebar_position: 70
title: Disposition code examples
---

Custom disposition example
==========================

Starting with version 3.0, if you **don't want to use** the default generic UI (e.g. for some of your users)
you can develop a custom disposition.

The authentication mechanism will remain the same but, once connected, the user will get a custom UI
built by a server side script (by implementing the `<Disposition name>.display` function which can
using associated resources if required).

In the example below we will implement a basic single page Bootstrap&reg;-based custom UI that uses the Ajax API
within a client-side JavaScript resource. The name of this example disposition is `MyDisp`.


Server side script
------------------

In the example, the server side script just builds the static parts of the disposition page
(including the main div which will be used by the client side script):

**Java**
```java
import com.simplicite.webapp.HTMLPage;
import com.simplicite.webapp.web.BootstrapWebPage;
@Override
public String display(Parameters params) {
	Grant g = getGrant();
	BootstrapWebPage wp = new BootstrapWebPage(params.getRoot(), g.getParameter("WINDOW_TITLE", "Simplicité"));
	wp.appendAjax();
	wp.appendJSInclude(HTMLPage.getResourceJSURL(g, "SCRIPT")); // Include a client side JavaScript
	wp.appendCSSInclude(HTMLPage.getResourceCSSURL(g, "STYLES")); // Include a custom stylesheet
	wp.setFavicon(HTMLPage.getResourceIconURL(g, "FAVICON"));
	wp.setReady("mydisp(\"" + wp.getRoot() + "\");");
	
	LinkedHashMap sm = new LinkedHashMap();
	sm.put("submenu1", "My sub menu 1");
	sm.put("submenu2", "My sub menu 2");
	LinkedHashMap m = new LinkedHashMap();
	m.put("menu1", "My menu 1");
	m.put("menu2", wp.subMenu("menu2", "My menu 2", sm));
	m.put("quit", "<span class=\"glyphicon glyphicon-off\"></span> " + g.T("QUIT"));
	wp.setMenu("home", "<img src=\"" + HTMLPage.getResourceImageURL(g, "LOGO") + "\" style=\"margin: 5px;\"/>", m, false, true, true);
	
	wp.appendHTML("<div id=\"main\"></div>");
	
	wp.appendHTML("<div id=\"footer\">&copy; Simplicité Software</div>");
	
	return wp.toString();
}
```


As of version **3.1 MAINTENANCE 08**, the `displayPublic`, `displayPublicHome`, `displayHome`, `displayLogon` and `displayLogout`
functions can be used on the same principle to override the public main page, public home page, authenticated home page, logon page and logout page when needed.

For instance to override the default logon script with a Bootstrap&reg; page, you can implement the `displayLogon` function as:

**Java**
```Java
import com.simplicite.webapp.HTMLPage;
import com.simplicite.webapp.web.BootstrapWebPage;
@Override
public String display(Parameters params) {
	Grant g = getGrant();

	BootstrapWebPage wp = new BootstrapWebPage(params.getRoot(), g.getParameter("WINDOW_TITLE", "Simplicité"));
	
	wp.appendJSInclude(HTMLPage.getResourceJSURL(g, "SCRIPT"));
	wp.appendCSSInclude(HTMLPage.getResourceCSSURL(g, "STYLES"));
	wp.setFavicon(HTMLPage.getResourceIconURL(g, "FAVICON"));
	
	wp.append(HTMLPage.getResourceHTMLContent(g, "LOGON"));
	wp.setReady("loaded();");
	
	return wp.toString();
}
```


The disposition `LOGON` HTML resource being:

```html
<div class="panel panel-default" style="margin-top: 50px;">
	<div class="panel-heading text-center">
		![](https://www.simplicite.io/logos/logo.svg)
	</div>
	<div class="panel-body">
		<form role="form" method="post" action="j_security_check">
			<div class="form-group">
				<label for="login">Login:</label>
				<input type="text" class="form-control" id="login" name="j_username">
			</div>
			<div class="form-group">
				<label for="pwd">Password:</label>
				<input type="password" class="form-control" id="pwd" name="j_password">
			</div>
			<button type="submit" class="btn btn-default">OK</button>
		</form>
	</div>
</div>
<script>
function loaded() {
	$("#login").focus();
}
</script>
```

Client side resources
---------------------

The client side JavaScript `SCRIPT` resource uses the Ajax API to dynamically build the main div content:

```javascript
function mydisp(root) {
	var app = new Simplicite.Ajax(root);
	home();
	
	$("#home").click(function() { home(); });
	$("#menu1").click(function() { alert("You clicked menu 1 !"); });
	$("#submenu1").click(function() { alert("You clicked sub menu 1 !"); });
	$("#submenu2").click(function() { alert("You clicked sub menu 2 !"); });
	$("#quit").click(function() { document.location.replace("../logout.jsp"); });

	function loading() {
		$("#main").empty().append($("<img/>", { src: "../images/image/inprogress.gif" }));
	}
	
	function home() {
		loading();
		app.getGrant(function() {
			$("#main").empty().append("Hello " + app.grant.login + " !");
		});
	}
}
```

And the CSS `STYLES` resource could be something like:

```javascript
#main { padding: 10px; border-radius: 5px; background-color: #F7F7F7; }
#footer { margin-top: 25px; border-top: solid 2px #F0F0F0; }
```