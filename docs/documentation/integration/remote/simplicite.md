---
sidebar_position: 10
title: Simplicité
---

Simplicité remote business objects
==============================================

It describes how to configure and use 
- remote Simplicité business objects,
- datalinks between several applications.

Remote object configuration
---------------------------

- This feature allows to access a remote object data stored in another application.
- The data are only read in memory, a remote object is never copied in the local database.
- It allows to update the remote records with CRUD rights
- Do not use a remote object to make inner join with a local database: data access is not based on SQL but API/REST.

To configure a remote Simplicité business object the _Table_ field value must be `service-simplicite`.

The configuration of the remote Simplicité business object is then set in the _Filter_ field as JSON:

```json
{
	"name": "<logical name of remote business object>",
	"credentials": "<name of the parameter containing the credentials>"
	[, "debug": true|false ]
}
```

Nothing else needs to be configured as the remote business object configuration is dynamically processed to build the local logical business object.

> **Note**: the debug mode generates verbose logs, avoid enabling it when you don't need it

The credentials, that can be shared among several business objects of the same remote instance are configured as JSON in a system parameter (either a global server parameter or a user server parameter):

```json
{
	"url": "<instance base URL>",
	"username": "<user name>",
	"password": "<user password>",
	"encoding": "<instance encoding (optional) defaults to local instance encoding>",
	"http_timeout": "<HTTP requests timeout in milliseconds (optional) defaults to 30000>"
}
```

> **Note**: multiple credentials can also be configured if you need to access to several remote instances.

DataLink configuration
----------------------

Only available from version 5.3.

This feature allows to synchronize automatically object data (tables) in several applications.
Then linked objects are usable as local business objects: search, links, `row_id` join with foreign-keys...

### Design

- The objects to be data-linked must be designed in a separate module to be installed everywhere. The metadata must be the same to share consistent data.
- Those objects need the **timestamp** option because the last update date is needed between databases, otherwise a slow full-scan will occur.
- Each application can inherit the linked-objects locally (in another business module) to extend them, add non-synchronized fields, rules...
- In another setting module, all **Hosts** (URL of applications) must be shared 
	- with the API/REST credentials with **CRUD rights** on objects
	- the host name must match with the instance deployment to detect if it is the dependant or the main:
		- Forced named: JVM property `-Dapplication.name=MyAppName1` or by hook `Globals.setApplicationName("MyAppName1")` in startup hook `PlatformHooks.postPlatformInit(Grant sys)`
		- Forced URL: JVM property `-Dapplication.url=https://appli1.mydomain.io` or by hook `Globals.setApplicationURL("https://appli1.mydomain.io")`
		- With system parameter `SERVER_URL` or `DIRECT_URL` or by default the webapp context path
- Finally designer have to define the **DataLinks**:
	- between hosts: set as primary or secondary, anyone can be a primary, but there can't be only secondaries
	- with objects to synchronize in a given order of dependencies (it can synchronized objects and related links).

### Runtime

- Datalinks are loaded once at startup/clear-cache, and tracked in server logs.
- In case of UI update, the primaries call all known hosts **synchronously** (to guarantee the order of possible successive calls). The update must be designed fast without many hooks/rules.
- It uses the common API/REST interface: the "sync" service is like a POST but it forces the same `row_id` everywhere (no data mapping needed).
- In case of host shutdown or HTTP error, the **cron `DataLink`** checks and resynchronizes the tables from the last timestamp stored in system parameters `_SYNC_MASTER_<object>`
- Removing all parameters `_SYNC_MASTER_<object>` will make a full-resync.
- In the worst case if everything has been stopped or the databases are mostly corrupted with outer SQL access (i.e sync by HTTP/REST calls is the worst solution): 
it is possible to disable the cron and copy the tables with faster DB mechanisms, there is a strict equality of data (especially `row_id`),
 beware to keep optional added columns locally.

Current limitations:

- Designer can't specify which fields are to be synchronized, it's the whole object that is synchronized (use inheritance to extend objects locally).
- There will surely be undetermined cases of flows that cross when there are several primaries in parallel that allow concurrent accesses: the last update wins.
- The system will not set a lock between applications: the `m_object_usage` table remains for local access concurrency.
