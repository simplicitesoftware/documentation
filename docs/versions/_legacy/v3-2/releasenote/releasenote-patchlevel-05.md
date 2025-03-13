---
sidebar_position: 150
title: Patch level 05
---

Version 3.2 patchlevel 05 release note
======================================

Changes
-------

### Object instance isolation in script

Use this new design pattern in script:

```javascript
// Get a timestamped instance / unique instance in memory
var obj = this.getGrant().getIsolatedInstance("MyObject");
try {
	// use the isolated object...
}
finally {
	// remove explicitly this instance from user session (more efficient than waiting for the internal Object GC)
	obj.destroy();
}
```

### Parameter MAX_USER_SESSION

This new system parameter controls users UI access (not applied to batch or APIs).
- 0 = not limited, user can open all sessions he needs (default value)
- 1 = the user can only have one session
- positive value = the max sessions he can open simultaneously

### Script to add/remove user's responsibility

See the Java doc:

- `Grant.addResponsibility`
- `Grant.removeResponsibility`

### Apply default value

This new Action has been added to field definition, it applies the default value:
- to all known columns in the database
- excepted the not null columns

### Others

- System admin singleton's `Grant.getAdmin()` renamed to `Grant.getSystemAdmin()` to avoid ambiguity with session level admin.
- Included Mustache&reg; javascript client-side library
- Added `getUser` method in the Ajax API to get basic user information (names, email, picture) from login
- Added Bootstrap&reg; datetime picker
- HTML resources not included automatically in external object when `hasDecoration()` is `false`, this means all non decorated external object **must** now include explicitly all required HTML resources 
- Resources can be configured per language or for all languages (image with text, html contents...)
- Clear cache button on Disposition

Fixes
-----

- Added `Cache-Control: no-transform` to avoid JS and CSS injection in HTML pages by mobile 3G/4G networks transparent proxies.
- Fixed clear cache issue on I/O and API
- Fixed some concurrent access issues on Ajax and REST APIs
- `ConfigurationObject.postSearch()` was not calling `super`
- Fixed modeler popups and autosave on logout
- Fixed custom disposition in scopes
- Fixed issue on completion select list on Google Chrome browser
- Fixed `preLock` and `postLock` hooks calls on scripted workflows
- Direct write to output stream for raw data services to save memory on huge volumes of data
- Fixed `Tool.shiftMonths`
- Fixed Module Diff for object with empty "object" field type
- Fixed Search preference on referenced fields
- Export POI: option is not proposed when POI is not installed
- Object default SearchSpec: [login] and [userid] substitution have been fixed
- Fixes decimal format and validation on read-only fields
- Fixed some servlets `Content-Type` HTTP header not properly set
- Fixed cross domain issue with basic authentication in Ajax lib

