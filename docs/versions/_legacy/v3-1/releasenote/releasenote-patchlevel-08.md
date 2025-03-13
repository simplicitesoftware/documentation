---
sidebar_position: 110
title: Patch level 08
---

Version 3.1 patchlevel 08 release note
======================================

Changes
-------

<div id='cache'/>

### Cache optimizations ###

Some strong loading optimizations have been done on the core system:

- Objects core definitions are now loaded once and cloned in each user's session
- Static elements (Resources, Scripts, Fields, InternalObject, ExternalObjects, BPM process...) are loaded in the heap to keep cleaning agility with few memory
- User's grants are not serialized and will be loaded on each session
- The physical serializations per user has been abandoned
- The cron lock has been moved in DB: the system parameter `CRON_LOCK` is managed by the platform
- Navigation history is now stored in DB as a user's preference `HISTORY` (hidden on UI)

The `cache` directory is not used anymore, if you restarts the server, it will clear automatically the core cache memory.

_Note: this feature has been partially back ported to the 3.0 maintenance branch to optimize the cache loading._

<div id='nav'/>

### Navigation history ###

The user's navigation history is now stored as a system preference `HISTORY`.
It contains the navigation serialization and is not accessible thru UI.
During a full clear-cache those preferences are destroyed.

<div id='blob'/>

### Documents as BLOB

Document can be stored in the database for Cloud usage:
- the `DOC_DIR` path must be set to `BLOB`
- The local file system is now only used to store temporary files (system param `DOC_LOCAL_DIR`)
- the table `m_document` gest 2 new columns (doc_content and image doc_thumbnail)
- When a document is not yet in database, the system search on the local file system and put it the DB
- Lucene indexation is not allowed in this case, the full-text indexation must be set to `sql`

<div id='transaction'/>

### Transactions & Tomcat

EJB containers of application servers (jboss, websphere...) manage all SQL transactions.
But because Tomcat has no transaction manager inside (it's only a web container), Simplicité will now manage it for you :

- In a same thread, all CRUD and SQL update (internal or scripted hooks) are grouped in a single transaction
- If an Action is asynchronous, it will use its own transaction
- Long transaction can throw exception : see DB documentation to increase the timeout
- All DB reads are made on commited data (wait for unlock)

This behavior is optional :
- `DIRECT_TRANSACTION = no` means to keep the auto-commit mode
- `DIRECT_TRANSACTION = yes` means to manage the transactions for you (you have to checks if your DB supports transactions)

By code/script it is also possible to manage a transaction:
- when a parent one is not already running
- with simple API `beginTransaction`, `commitTransaction` and `rollbackTransaction`

```javascript
MyObject.MyAction = function() {
	var g = this.getGrant();
	try {
		g.beginTransaction();

		// Direct SQL
		g.update("update...");
		g.update("delete...");
		// ...
		
		// Object updates
		var o = g.getTmpObject("OtherObject");
		// ...
		o.save();
		
		if (ok) {
			g.commitTransaction();
			return "OK";
		}
		else throw "Error";
	}
	catch (e) {
		g.rollbackTransaction();
		return "KO";
	}
}
```

<div id='fixes'/>

Fixes
-----

N/A