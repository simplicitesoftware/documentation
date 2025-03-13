---
sidebar_position: 180
title: Patch level 25
---

Version 3.0 maintenance 25 release note
=======================================

Changes
-------

- Added `Grant.getSystemAdmin()` method as an alias to the legacy `Grant.getAdmin()`. It is **highly recommended** to refactor your code right now to replace all calls to `Grant.getAdmin()` by calls to `Grant.getSystemAdmin()`, as a matter of fact the legacy `Grant.getAdmin()` has been **removed** from all subsequent versions >= 3.1
- Added JSON format on health check servlet

Fixes
-----

- Added `Cache-Control: no-transform` to avoid JS and CSS injection in HTML pages by mobile 3G/4G networks transparent proxies.
- Fixed clear cache issue on I/O and API
- `ConfigurationObject.postSearch()` was not calling `super`
- Fixed issue on completion select list on Google Chrome browser
- Fixed `preLock` and `postLock` hooks calls on scripted workflows
- Direct write to output stream for raw data services to save memory on huge volumes of data
