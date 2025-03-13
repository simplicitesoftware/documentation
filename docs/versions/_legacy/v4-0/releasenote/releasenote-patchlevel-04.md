---
sidebar_position: 4
title: Patch level 04
---

Version 4.0 patchlevel 04 release note
======================================

Changes
-------

- Added capability to handle multiple OAuth2 providers
- Added LinkedIn&reg; OAuth2 provider
- Added action on module to export all business data from business object
- Added `Tool.sort` method for instance to sort search rows on a given field
- Improved script logging (traces now include object name)
- New datetime picker (see [this website](http://xdsoft.net/jqplugins/datetimepicker) for details). The javascript is preserved to wrap the new picker on UI:
```javascript
new Simplicite.Calendar(form, target, name, timepicker).display();
```
![jquery.datetimepicker](datetimepicker.png)

Fixes
-----

- Removed jCaptcha which does not support OpenJDK JVM
- Fixed some wrong `super` hooks calls in `ScriptedObjectDB` and `ScriptedDisposition`
- Fixed regression on management of `isPrintTemplateEnable` hooks