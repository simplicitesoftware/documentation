---
sidebar_position: 320
title: Patch level 13
---

Version 3.1 maintenance 13 release note
=======================================

Changes
-------

- Updated scripting engine Rhino lib to its up-to-date version (1.7.10)
- Updated POI libs (this fixes a "random" issue on some Excel exports)

Fixes
-----

- Fixed potential double entries in grant's object list
- Fixed cross site scripting vulnerability on error pages
- Fixed missing call to `initAssociate` hooks in scripted objects
