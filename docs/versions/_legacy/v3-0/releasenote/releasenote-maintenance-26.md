---
sidebar_position: 190
title: Patch level 26
---

Version 3.0 maintenance 26 release note
=======================================

Changes
-------

- Added `ObjectDB.count()` as alias to `ObjectDB.getCount()`
- Updated Rhino&reg; engine to 1.7.8
- Added `LOGIN` field type (accepting both simple login and email addresses) and used for the user login field `usr_login`

Fixes
-----

- Fixed "server" clear cache error from UI
- Fixed title on script editor that was sometimes not displaying the right name for scripts
- Panel lists now opens main instance form. Note that this may impact misusages of the `getParentObject()` or inapropriate instance checking (e.g. using `isPanelInstance()`) in such contexts.
- Disposition default display if `display` function is not implemented on custom scripted disposition