---
sidebar_position: 220
title: Patch level 29
---

Version 3.0 maintenance 29 release note
=======================================

Changes
-------

**The version 3.0 used to be compiled using a JVM version 1.6. As JVM version 1.6 support ended more than 3 years ago (end of Oracle long term support on Feb. 2013),
the compilation will now be done using a JVM version 1.7 in JVM version 1.6 compatibility mode.**

- A negative value for `RAILWAY` system parameter now means no railway
- Updated jQuery&reg;, Bootstrap&reg; and ACEeditor&reg;
- Custom zones/pages inclusions made more robust
- Forced `rhino` as server side script engine to avoid ambiguities of default `javascript` engine (which is Rhino in JVM versions 6 and 7 and NashHorn in JVM version 1.8+)
- Changed default link type to _Restricted_ when using create link wizard
- `Tool.readUrl` and its variants now follows HTTP 301/302/303/307 redirects
- Backported API/WS/UI services endpoints management from 3.1 (this fixes some issues on SOAP services on the API endpoint)

Fixes
-----

- Fixed Search preference on referenced fields
- Fixed REST service: get for create and copy context
- Added missing `super` calls on inheritors of `ConfigurationObject`
- REST/JSON services: limit access to non-private system parameters
- validate search: fix to bypass not searchable and semi-required fields
- REST/JSON: Fix `inlineThumbs` parameter to apply only on image fields and not on document fields
- Export POI: option is not proposed when POI is not installed
- Object default SearchSpec: `[login]` and `[userid]` substitution have been fixed
- Fixed double format and validation on read-only fields
- Fixed concurrency issues on websocket logs
- Fixed useless creation of public sessions in some tricky cases
- Removed jCaptcha which does not support OpenJDK JVM
- Fixed wrong `super` hooks calls in `ScriptedObjectDB` and `ScriptedDisposition`