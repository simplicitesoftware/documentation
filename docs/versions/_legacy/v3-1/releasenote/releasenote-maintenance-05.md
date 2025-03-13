---
sidebar_position: 240
title: Patch level 05
---

Version 3.1 maintenance 05 release note
=======================================

Changes
-------

- Added `mdl_url` field in module export
- Possibility to add resources in `MDDocument` (available with _markdown documentation_ module)
- Added a `JSONObject` to `Map` converter
- Added Mustache&reg; templating as a java library and a `MustacheTool` helper class
- Upgraded JQuery to 1.11.3
- Changed loading of external objects in views: now done on client side using jQuery `load` (previously the inclusion was done on server side) 
- The previous versions' `Grant.getAdmin()` is now renamed to `Grant.getSystemAdmin()`. The old naming was causing too much risks of confusion with the`Grant.getAgmin(this.getGrant())` in scripts (causing tricky concurrent access bugs). To get the global admin grant singleton you need to call `Grant.getSystemAdmin()`, to get a session admin grant you need to call `this.getGrant().getAdmin()` (`Grant.getAgmin(this.getGrant()` is however kept for compatibility reasons).

Fixes
-----

- Fixed servlet behavior on concurrent calls
- Fixed missing CSS and JS resources inclusion for non decorated external objects
- Fixed completion on fields that was not working on new Chrome version  >= 0.46