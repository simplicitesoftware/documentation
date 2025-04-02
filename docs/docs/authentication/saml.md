---
sidebar_position: 20
title: SAML
---

SAML Authentication
==========================

The example below is given for **Google** SAML Identity Provider (IdP) provider but this can be
transposed to other providers.

> **Note**: This document only applies to **version 4.0** and above.

Webapp settings
---------------

The changes to be done are :

- Remove all realm-related settings in `WEB-INF/web.xml` (security-constraint, login-config and security-role tags)
- Optionaly remove also the realm definition in `META-INF/context.xml`

> **Note**: If you are using our standard Docker images or our instance tempates these changes are already done

Then declare your SAML authentication provider in the `AUTH_PROVIDERS` system parameter, e.g.:

```json
[
	{ "name": "google", "type": "saml", "label": "Sign in with Google SAML IdP", "sync": true },
	(...)
]
```

You can get the resulting SAML SP meta data by calling `<base URL>/saml?_provider=<your provider name, e.g. gogle>&metadata`

See [this document](/docs/authentication/auth-providers) for details on how to configure authentication providers.

> **Warning**: Before doing these changes, **make sure** that you will still be able to login with a user having at least a responsibility on the `ADMIN` group.

Google settings
---------------

Declare a new SAML app on [Google Admin Console](https://admin.google.com) (in _Apps &gt; SAML apps_)
for the application (the SAML ACS URL and start URL will be `<url>/saml`):

![Client ID](img/saml/tomcat-saml-google.jpg)

If you configure several SAML apps you **must** choose a unique entity ID for each of them.

Application settings
--------------------

> Note: this section is **depprecated** as of version 4.0.P23 for which the authentication providers configuration is done using the `AUTH_PROVIDERS` JSON system parameters.
> See [this document](/docs/authentication/auth-providers) for details.

Add the IDP settings of your Google SAML app as system parameters:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<simplicite xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.simplicite.fr/base" xsi:schemaLocation="http://www.simplicite.fr/base http://www.simplicite.fr/schemas/base.xsd">
<object>
	<name>SystemParam</name>
	<action>upsert</action>
	<data>
		<sys_code>SAML_IDP_ENTITY_ID</sys_code>
		<sys_value><![CDATA[https://accounts.google.com/o/saml2?idpid=<Your Google IDP ID>]]></sys_value>
		<sys_desc>IdP entity ID</sys_desc>
		<sys_type>PRV</sys_type>
		<row_module_id.mdl_name>MyModule</row_module_id.mdl_name>
	</data>
	<data>
		<sys_code>SAML_IDP_SSO_URL</sys_code>
		<sys_value><![CDATA[https://accounts.google.com/o/saml2/idp?idpid=<Your Google IDP ID>]]></sys_value>
		<sys_desc>IdP SSL URL</sys_desc>
		<sys_type>PRV</sys_type>
		<row_module_id.mdl_name>MyModule</row_module_id.mdl_name>
	</data>
	<data>
		<sys_code>SAML_IDP_CERTIFICATE</sys_code>
		<sys_value><![CDATA[[-----BEGIN CERTIFICATE-----
(...)
-----END CERTIFICATE-----]]></sys_value>
		<sys_desc>IdP certificate</sys_desc>
		<sys_type>PRV</sys_type>
		<row_module_id.mdl_name>MyModule</row_module_id.mdl_name>
	</data>
</object>
</simplicite>
```
### Other optional settings
   
Depending on the SSO strategies others configurations are possible :  

| System parameter           | Value                                                        | Description                                                                                   |
|----------------------------|--------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| SAML_ASSERTIONS_ENCRYPTED  | true/false                                                   | Indicates a requirement for the Assertions received by this SP to be encrypted                |
| SAML_ASSERTIONS_SIGNED     | true/false                                                   | Indicates a requirement for the `<saml:Assertion>` elements received by this SP to be signed.   |
| SAML_AUTHNREQUEST_SIGNED   | true/false                                                   | Indicates whether the `<samlp:AuthnRequest>` messages sent by this SP will be signed.           |
| SAML_IDP_SLO_URL           | Logout IDP URL                                               | SLO endpoint info of the IdP.  URL Location of the IdP where the SP will send the SLO Request |
| SAML_LOGOUTREQUEST_SIGNED  | true/false                                                   | Indicates whether the `<samlp:logoutRequest>` messages sent by this SP will be signed.          |
| SAML_LOGOUTRESPONSE_SIGNED | true/false                                                   | Indicates whether the `<samlp:logoutResponse>` messages sent by this SP will be signed.         |
| SAML_SP_CERTIFICATE        | -----BEGIN CERTIFICATE-----(...)-----END CERTIFICATE         | Certificate of the SP                                                                         |
| SAML_SP_PRIVATEKEY         | -----BEGIN RSA PRIVATE KEY-----(...)-----END RSA PRIVATE KEY | Private key of the SP.                                                                        |
| SAML_USERINFO_MAPPINGS     | JSON data                                                    | User info fields mappings for synchronization (firstname, lastname, email and phone)          |

### Grant hooks

Then you can implement `GrantHooks`'s `parseAuth` method to handle the returned
Google account identifier if required.

The **example** below checks and removes the domain part of the account name in `parseAuth`
.


```Java
@Override
public String parseAuth(Grant sys, SessionInfo info) {
	// Check if the account is in authorized domain
	String domain = sys.getParameter("MY_GOOGLE_DOMAIN", "simplicite.fr");

	// Auth string from session info after SAML authentication (e.g. username@simplicite.fr)
	String auth = info.getLogin();

	// Reject auth string not on domain
	if (!auth.matches("^.*@" + domain + "$")) {
		AppLog.globalError("Invalid domain for account = " + auth, sys);
		return null;
	}

	// Remove domain part from the auth string to get a plain username login
	return auth.replaceFirst("@" + domain, "");
}
```

<details>
<summary>Rhino Javascript equivalent</summary>
```javascript
GrantHooks.parseAuth = function(sys, info) {
	// Check if the account is in authorized domain
	var domain = sys.getParameter("MY_GOOGLE_DOMAIN", "simplicite.fr");

	// Auth string from session info after SAML authentication (e.g. username@simplicite.fr)
	var auth = info.getLogin();

	// Reject auth string not on domain
	if (!auth.matches("^.*@" + domain + "$")) {
		console.error("Invalid domain for account = " + auth);
		return null;
	}

	// Remove domain part from the auth string to get a plain username login
	return auth.replaceFirst("@" + domain, "");
};
```
</details>
