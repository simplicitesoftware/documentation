---
sidebar_position: 240
title: Patch level 04
---

Version 3.2 maintenance 04 release note
=======================================

Changes
-------

- Forced `rhino` as server side script engine to avoid ambiguities of default `javascript` engine (which is Rhino in JVM version 1.6 and 1.7 and NashHorn in JVM versions 1.8+)
- Added optional (and **experimental**) GIT endpoint for modules on `[/<root>]/git/<module name>`
- Object _Module_ now inherits from `ScriptedObjectDB` so as it is now possible to add scripted behaviors in (very) particular cases
- Changed default link type to _Restricted_ when using create link wizard
- Added server-side Markdown to HTML conversion in `MarkdownTool`
- Added optional `USE_IO`, `USE_GIT` and `USE_API` system parameters to enable/disable the I/O, GIT and API endpoints (all endpoints are enabled by default)
- `Tool.readUrl` and its variants now follows HTTP 301/302/303/307 redirects + added `Tool.readUrlWithClientCert` for calling with client certificates
- Added `Message.formatSimpleText()` for returning plain text to UI
- Added `GoogleAPITool` with OAuth2-related APIs
- Object form templates tags `[*RESOURCEURL:<template name>]` now also look for resource at disposition level if not found at objet level
- Added possibility to configure object-level expressions for field styles and icons using `[EXPR:...]` syntax
- jCaptcha has been replaced by visualCaptcha on the registration form
- Improved module diff (XML vs ZIP, etc.) and fixed side effects in particular cases (diff on different versions' exports, etc.)
- Backported from 4.0 the internal OAuth2 provider and the capability to handle multiple OAuth2 providers
- Added action on module to export all business data from business object
- Added `Tool.sort` method for instance to sort search rows on a given field
- Improved script logging (traces now include object name)

Fixes
-----

- Fixed OAuth2 redirects issues when `PUBLIC_PAGE` is `yes`
- Fixed session duration issues when using UI and services endpoints within the same session
- Fixed create on list of panel Disposition/Resource
- Fixed concurrency issues on websocket logs
- Fixed useless creation of public sessions in some tricky cases
- Removed jCaptcha which does not support OpenJDK JVM
- Fixed some wrong `super` hooks calls in `ScriptedObjectDB` and `ScriptedDisposition`
- Fixed regression on management of `isPrintTemplateEnable` hooks