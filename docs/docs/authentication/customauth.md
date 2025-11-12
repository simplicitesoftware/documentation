---
sidebar_position: 40
title: Custom auth
---

Tomcat custom authentication
============================

This document applies to version **3.2 MAINTENANCE 05** and above.

Webapp configuration
--------------------

As for OAuth2, SAML, LDAP or Crowd authentication, all realm-related configuration must be removed from the web application descriptors:

- Remove all realm-related settings in `WEB-INF/web.xml` (security-constraint, login-config and security-role tags)
- Optionally remove also the realm definition in `META-INF/context.xml`
- Remove all other authentication's mechanisms system parameters if present (e.g. `OAUTH2_*`, `SAML_*`, `LDAP_*`, ...)

Custom authentication
---------------------

The custom authentication can be implemented using the `customAuth` grant hook (which takes the HTTP request/response as argument). E.g.

```java
@Override
public String customAuth(HttpServletRequest request, HttpServletResponse response) throws Exception {
	String l = req.getHeader("X-Simplicite-Login");
	if (!Tool.isEmpty(l))
	{
		AppLog.info("HTTP header login: = " + l,null);
		return l;
	}
	return super.customAuth(request, response);
}
```

In the basic above example the content of a custom `X-Simplicite-Login` is directly returned and used as the user's login.
In real life, the implementation of this custom authentication will certainly be slightly more complex...

Default custom authentication
-----------------------------

The platform provides a default custom authentication that returns the value of an HTTP header, with the header name
specified in the `AUTH_HEADER` system parameter.

If the value of this header does not contain a simple plain text login, the appropriate login can be determined using the `parseAuth` hook.

Optionally -typically when request/responses goes thru a SSO reverse proxy - this default implementation checks the origin of the request against a
comma-separated list of IP addresses stored in the `AUTH_ORIGIN` system parameter.

Client certificate authentication
---------------------------------

When using an Apache or NGINX webserver as reverse proxy it can enforce client certificate authentication
(see [this document](/docs/misc/webserver-ssl) for details).

They typically can be configured to propagate the verified client certificate's DN as the `X-SSL-Client-S-DN` HTTP header.
Then the authentication on Simplicité side is easy as it is just a matter of parsing this DN, e.g. extracting the `CN` field as login:

```java
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

Custom authentication can be used in conjunction with OAuth2, SAML, LDAP, or Crowd authentication providers (each being mutually exclusive).
When implementing the `customAuth` and `parseAuth` hooks, ensure that all relevant authentication cases are properly managed.

The `simplicite` OAuth2 authentication provider functions as the traditional database realm authentication mechanism.
This allows custom authentication to coexist with standard password-based authentication.
