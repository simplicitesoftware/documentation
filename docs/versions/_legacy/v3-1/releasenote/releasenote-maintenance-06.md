---
sidebar_position: 250
title: Patch level 06
---

Version 3.1 maintenance 06 release note
=======================================

Changes
-------

- Included Mustache&reg; javascript client-side library
- Added `getUser` method in the Ajax API to get basic user information (names, email, picture) from login
- Update TinyMCE version from 4.1.10 to 4.2.7. Use more modern default skin.
- Add TinyMCE textcolor plugin.
- HTML resources not included automatically anymore in external object when `hasDecoration()` is `false`, this means all non decorated external object **must** now include explicitly all required HTML resources
- Added Ajax API to change user password

Fixes
-----

- Added `Cache-Control: no-transform` to avoid JS and CSS injection in HTML pages by mobile 3G/4G networks transparent proxies.
- Fixed clear cache issue on I/O and API
- Fixed some concurrent access issues on Ajax and REST APIs
- `ConfigurationObject.postSearch()` was not calling `super`
- Fixed issue on completion select list on Google Chrome browser
- Fixed `preLock` and `postLock` hooks calls on scripted workflows
- Direct write to output stream for raw data services to save memory on huge volumes of data
