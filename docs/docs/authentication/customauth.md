---
sidebar_position: 40
title: Custom auth
---

Tomcat custom authentication
============================

This document applies to version **3.2 MAINTENANCE 05** and above.

Webapp configuration
--------------------

As for OAuth2, SAML, LDAP or Crowd authentication, you must remove all realm-related configuration from you web application descriptors:

- Remove all realm-related settings in `WEB-INF/web.xml` (security-constraint, login-config and security-role tags)
- Optionally remove also the realm definition in `META-INF/context.xml`
- Remove all other authentication's mechanisms system parameters if present (e.g. `OAUTH2_*`, `SAML_*`, `LDAP_*`, ...)

Custom authentication
---------------------

The custom authentication can be implemented using the `customAuth` grant hook (which takes the HTTP request/response as argument). E.g.

```javascript
GrantHooks.customAuth = function(req, res) {
	var l = req.getHeader("X-Simplicite-Login");
	if (l) {
		console.log("Login from HTTP header: " + l);
		return l;
	}
};
```

In the basic above example the content of a custom `X-Simplicite-Login` is directly returned and used as the user's login.
In real life, the implementation of this custom authentication will certainly be slightly more complex...

Default custom authentication
-----------------------------

The platform includes a default custom authentication that returns the value of an HTTP header whose name is configured
in the `AUTH_HEADER` system parameter.

If this returned header values does not contain a simple plain text login you can use it to determine the appropriate login by using the `parseAuth` hook.

Optionally -typically when request/responses goes thru a SSO reverse proxy - this default implementation checks the origin of the request against a
comma-separated list of IP addresses stored in the `AUTH_ORIGIN` system parameter.

Client certificate authentication
---------------------------------

When using an Apache or NGINX webserver as reverse proxy you can configure it to enforce client certificate authentication (see [this document](/docs/misc/webserver-ssl) for details).

They typically can be configured to propagate the verified client certificate's DN as the `X-SSL-Client-S-DN` HTTP header.
Then the authentication on Simplicité side is easy as it is just a matter of parsing this DN, e.g. extracting the `CN` field as login:

```javascript
GrantHooks.customAuth = function(req, res) {
	var dn = req.getHeader("X-SSL-Client-S-DN");
	if (dn)
	{
		console.log("Client certificate DN = " + dn);
		var cn = Tool.extractItemFromDN(dn, "cn", null);
		console.log("Client certificate CN = " + cn);
		return cn;
	}
}
```
**Java**
```Java
@Override
public String customAuth(HttpServletRequest request, HttpServletResponse response) throws Exception {
	String dn = request.getHeader("X-SSL-Client-S-DN");
	if (!Tool.isEmpty(dn))
	{
		AppLog.info("Client certificate DN = " + dn,null);
		String cn = Tool.extractItemFromDN(dn, "cn", null);
		AppLog.info("Client certificate CN = " + cn,null);
		return cn;
	}
	return super.customAuth(request, response);
}
```

Compatibility with OAuth2/SAML/LDAP/Crowd
-----------------------------------------

It is possible to have custom authentication along with OAuth2, SAML, LDAP or Crowd authentications (each of the being mutually exclusive).
You just have to be careful in the way you implement your `customAuth` and `parseAuth` hooks so as you take into account the different cases.

Among the provided OAuth2 authentication providers, the `simplicite` provider acts like the traditional database realm authentication mechanism.
You can thus have a custom authentication co-existing with the usual password-based authentication. 
