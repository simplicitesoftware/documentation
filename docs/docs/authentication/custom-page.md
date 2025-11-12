---
sidebar_position: 100
title: custom page or redirect
---

Custom authentication page or redirect
=======================================

:::note
This document only applies to **version 5.3** and above.
:::

:::warning
This authentication method bypasses some of the Simplicité security measures.
Ensuring the security of the custom page is the responsibility of the implementer. Particular
care must be taken to address common vulnerabilities associated with login pages
(such as SQL injection, XSS, brute force attacks, inappropriate error handling, and password security).
:::

Webapp settings
---------------

Declare your custom authentication provider in the `AUTH_PROVIDERS` system parameter, e.g.:

```json
[
	{
		"name": "XXX_external_auth",
		"type": "custom",
		"label": "External authentication"
	},
	{ "name": "simplicite", "type": "internal" }
	(...)
]
```

See [this document](/docs/authentication/auth-providers) for details on how to configure authentication providers.

:::warning
Before making these changes, ensure that access will remain possible with at least one user the ADMIN responsibility.
:::

### Grant hooks

The `PlatformHooks`'s `customAuthPage method` can be implemented to redirect to external login page or to return custom html page,
and `customAuth method` to interpret the return of the custom auth page.

The **example** below uses the mustache template of `XXX_CUSTOM_LOG` resource for the auth page.

```Java
	@Override
	public void customAuthPage(HttpServletRequest request, HttpServletResponse response, String error) throws Exception {
		Grant g=Grant.getSystemAdmin();
		// Get the authentication provider of the request.
		JSONObject provider = AuthTool.getAuthProvider(request);

		if (provider != null && "XXX_external_auth".equals(provider.getString("name"))) {
			// If the provider is our custom auth "XXX_external_auth"...

			// Create a JSON object to store data for template.
			JSONObject HTMLdata = new JSONObject()
				.put("style",HTMLTool.getResourceCSSContent(g,"OAUTH2_STYLES"))
				.put("Title","Title")
				.put("isError",!Tool.isEmpty(error))
				.put("error",Grant.getPublic().T(Tool.toHTML(error)))
				.put("path",Globals.WEB_CUSTOMAUTH_PATH )
				.put("provider",provider.getString("name") );

			try (PrintWriter out = response.getWriter()) {
				// Use MustacheTool to apply a custom HTML template
				// and write the result to the response.
				out.println(MustacheTool.apply(HTMLTool.getResourceHTMLContent(g, "XXX_CUSTOM_LOG"), HTMLdata));
			}
		} else{
			super.customAuthPage(request, response, error);
		}
	}

	@Override
	public String customAuth(HttpServletRequest request, HttpServletResponse response) throws Exception {
		JSONObject provider = AuthTool.getAuthProvider(request);
		Grant g=Grant.getSystemAdmin();
		if (provider != null && "XXX_external_auth".equals(provider.getString("name"))) {
			// If the provider is our custom auth "XXX_external_auth"...
			String login = ServletTool.getParamValue(request, "login", null);
			if(login == null)
			// if empty login do nothing
				return super.customAuth(request, response);
			login = HTMLTool.toSafeHTML​(login);
			String password = HTMLTool.toSafeHTML(ServletTool.getParamValue(request, "password", null));
			//use toSafeHTML to avoid SQL injection
			List<String> userAdmin = GroupDB.getUsers("ADMIN",null,null);
			if(Grant.exists(login, false) && userAdmin.contains(login)){
				//prohibits the use of custom authentication for admin users
				return  "ERROR: Admin can't use this auth page";
			}

			if(!yourCustomAuth(login,password))//check user with your custom function
				return  "ERROR: invalid login or password ";
			//if auth is valid, return the user login
			return login;
		} else{
			return super.customAuth(request, response);
		}
	}
```

Example of **XXX_CUSTOM_LOG**:

```html
<head>
	<title>{{Title}}</title>
	<style>
		{{style}}
	</style>
</head>
<body spellcheck="true" cz-shortcut-listen="true">
	<div id="auth-main" class="auth-signin" style="text-align: center;">
	<div class="cadre">
	{{#isError}}<p><strong>Error: {{{error}}}</strong></p>{{/isError}}
		<form class="auth-signin" id="auth-signin-form" method="post" action="{{path}}?_provider={{provider}}">
			<input type="text" name="login" id="auth-signin-login" placeholder="login" value="">
			<input type="password" name="password" id="auth-signin-password" placeholder="password" value="">

			<input type="submit" class="auth-signin-submit" value="connexion">
		</form>
	</div>
</body>
```
