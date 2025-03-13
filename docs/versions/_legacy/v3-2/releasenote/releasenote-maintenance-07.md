---
sidebar_position: 270
title: Patch level 07
---

Version 3.2 maintenance 07 release note
=======================================

Changes
-------

- Added business object helper methods `getStatus(row)` and `getFieldValue(name, row)`
- Updated scripting engine Rhino lib to its up-to-date version (1.7.10)
- Default value for git.basedir property (backport from 4.0)
- Updated POI libs (this fixes a "random" issue on some Excel exports)

Fixes
-----

- Fixed potential double entries in grant's object list
- Allowed log events without translated text associated (fixes missing log events issue)
- Clarified error reporting if objet is not granted when using `Grant.get[Tmp|Main|...]Object`
- Fixed cross site scripting vulnerability on error pages
- Fixed missing call to `initAssociate` hooks in scripted objects
