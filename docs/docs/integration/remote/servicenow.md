---
sidebar_position: 50
title: ServiceNow
---

ServiceNow integration
======================

This document applies to minor version 5.3 and above

It describes how to configure [ServiceNow&reg;](https://www.servicenow.com) (SNOW) tables as Simplicité business objects.

SNOW table as a service business object
---------------------------------------

### Service object configuration

To configure a remote SNOW table as a SNOW service business object the _Table_ field (physical name) value must be `service-servicenow`.

The configuration of the SNOW table is then provided in the _Filter_ field as JSON:

```json
{
	"table": "<SNOW table name, e.g. sn_customerservice_access_request>",
	"credentials": "<system parameter name, e.g. MY_SNOW_CONFIG>",
	"debug": true
}	
```

The `credentials` value above refers to a dedicated JSON system parameter, e.g. `MY_SNOW_CONFIG`:

```json
{
	"url": "https://<my SNOW app name>.service-now.com",
	"username": "<my SNOW username>",
	"password": "<my SNOW password>"
}
```

The `debug` flag enable/disable detailed logging, this is only useful in development mode, **NEVER** leave this flag to `true` in production.

### Service object fields configuration

The configured fields are using the physical name to map to the SNOW object's columns. Logical names and translations are free to be configured as you like.
They must match the SNOW column type.

For naming compatibility reasons all physical names **MUST** be prefixed by `ServiceNow.`, e.g. `ServiceNow.number` or `ServiceNow.state`
