---
sidebar_position: 20
title: LDAP
---

LDAP objects
============

This document applies to version 4.0 P 21 and above.

It describes how to configure and use remote LDAP objects.

> **Warning**: this configuraton item is still being developed, its configuration strategy is likely to change.

Configuration
-------------

To configure a remote LDAP business object the _Table_ field value must be `service-ldap`.

The configuration of the remote LDAP business object is then set in the _Filter_ field as JSON:

```json
{
	"url": "ldap://<LDAP host>:<LDAP port>",
	"basedn": "<base DN for LDAP entries, e.g. ou=People,dc=myorg>",
	"subtree": <true|false, optional flag to tell whether to search in base DN subtree or just at base DN level, defaults to true>,
	"userdn": "<Optional LDAP user DN for authenticated requests, e.g. cn=myadmin,dc=myorg",
	"userpassword": "<Optional LDAP user password for authenticated requests>",
	"limit": <Optional limit for search, defaults to user max page size, note that LDAP objects are forced non paginated>,
	"filter": "<Optional static filter>"
}
```

Then you need to configure fields with the LDAP attribute name as column name.

A good practice is to use the `uid` attribute for the custom row ID field of your object.