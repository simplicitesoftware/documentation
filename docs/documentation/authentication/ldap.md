---
sidebar_position: 30
title: LDAP
---

LDAP authentication
==========================

The example below is given for an example LDAP schema but it can be easily
transposed to other schemas.

> **Note**: This document only applies to **version 4.0** and above.

Webapp settings
---------------

The changes to be done are :

- Remove all realm-related settings in `WEB-INF/web.xml` (security-constraint, login-config and security-role tags)
- Optionaly remove also the realm definition in `META-INF/context.xml`
- Remove all other authentication's mechanisms system parameters if present (e.g. `OAUTH2_*`, `SAML_*`, ...)

LDAP settings
-------------

The authentication mode in place consist in a bind to the LDAP with the provided credentials.

Make sure the LDAP is available from the application server (the authentication bind is done on server side).

Application settings
--------------------

Add the LDAP configuration as a JSON value in the `LDAP_AUTH_CONFIG` **private** system parameter.

Example (if you want to use a single-level DN pattern for binding):

```json
{
	"url": "ldap://localhost:389",
	"dnpattern": "uid=[USERNAME],ou=People,dc=simplicite,dc=com"
}
```

Example 2 (if you want first to search for DN to use for binding in the subtree of a base DN):

```json
{
	"url": "ldap://localhost:389",
	"basedn": "ou=People,dc=simplicite,dc=com",
	"filter": "&(uid=[USERNAME])"
}
```

After successful bind to LDAP, the user's entry is retreived from the LDAP using anonymous access.
If authenticated requests are required for this, you need to add both `userdn` and `userpassword` in your `LDAP_AUTH_CONFIG`.

The following default LDAP attribute are used:

- Email: `mail`
- First name: `givenName`
- Last name: `sn`

If you need other attribute mappings you need to add a `mappings` object in your `LDAP_AUTH_CONFIG`:

```json
"mappings" : {
	"email": "myCustomLDAPAttributeForEmail",
	"firstname": "myCustomLDAPAttributeForFirstName",
	"lastname": "myCustomLDAPAttributeForLastName"
}
```

Then you can implement `GrantHooks`'s `parseAuth` method to handle the LDAP username if required (e.g. to map it to an actual application user).
