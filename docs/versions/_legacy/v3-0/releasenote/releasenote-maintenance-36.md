---
sidebar_position: 290
title: Patch level 36
---

Version 3.0 maintenance 36 release note
=======================================

> **Warning**: This maintenance release is the **FINAL** release of version 3.0,
> no further maintenance releases are scheduled.

Changes
-------

- Updated scripting engine Rhino lib to its up-to-date version (1.7.10)
- **Cached** resources are now also cached on server side

Fixes
-----

- Fixed potential double entries in grant's object list
- Fixed cross site scripting vulnerability on error pages
- Fixed missing call to `initAssociate` hooks in scripted objects
