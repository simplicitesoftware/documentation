---
sidebar_position: 100
title: Patch level 17
---

Version 3.0 maintenance 17 release note
=======================================

Changes
-------

### Refactored place maps

The place maps features has been refactored so as to use the new geocoordinates type field instead of 2 float
fields for latlitude and logitude.

### Google server side tools

A new tool class `com.simplicite.util.tools.GMapTool` is now available to use Google geocodig API on the server side.

Typical usage is with a geocoordinates field, for example in a `pre/postValidate` or `preSave` hook of a business object:

```javascript
var coords = this.getField("myCoords");
var address = this.getField("myAddressField");
if (!address.isEmpty() && (coords.isEmpty() || address.hasChanged())
	coords.setValue(GMapTool.geocodeOne(address.getValue()));
```

Be careful that calling the methods of this class does a call to Google web services which takes time and is limited by quotas.
For example, it does not make sense to use it in a hook that can be called in mass (e.g. in a `init*` hook of a business object).

Fixes
-----

N/A
