---
sidebar_position: 280
title: Patch level 09
---

Version 3.1 maintenance 09 release note
=======================================

Changes
-------

- A negative value for `RAILWAY` system parameter now means no railway
- Updated jQuery&reg; and Bootstrap&reg;
- Updated ACEeditor&reg; and added new system parameter `ACE_KEYBINDINGS` to use alternative key bindings
- Custom zones/pages inclusions are now made on client side using `jQuery.load`
- Added `org.json` package to default server script includes
- Dropped all legacy IE6/IE7 compatibility stuff
- Forced `rhino` as server side script engine to avoid ambiguities of default `javascript` engine (which is Rhino in JVM versions 1.6 and 1.7 and NashHorn in JVM versions 1.8+)
- Moved listeners to new package `com.simplicite.webapp.listeners`, this should be transparent as platform's listeners are declared using annotations
  (if you still have explicit listener declarations in your `web.xml` you **must** remove thgem)
- Changed default link type to _Restricted_ when using create link wizard
- Added server-side Markdown to HTML conversion in `MarkdownTool`
- Added optional `USE_IO` and `USE_API` system parameters to enable/disable the I/O and API enpoints (all endpoints are enabled by default)
- `Tool.readUrl` and its variants now follows HTTP 301/302/303/307 redirects + added `Tool.readUrlWithClientCert` for calling with client certificates
- Added `Message.formatSimpleText` for returning plain text to UI
- Added `GoogleAPITool` with OAuth2-related APIs
- Object form templates tags `[*RESOURCEURL:<template name>]` now also look for resource at disposition level if not found at objet level
- Improved module diff (XML vs ZIP, etc.) and fixed side effects in particular cases (diff on different versions' exports, etc.)
- Added `provider` entry in `SESSION_INFO` hash map when using OAuth2 for forward compatibility
- Added action on module to export all business data from business object
- Added `Tool.sort` method for instance to sort search rows on a given field
- Improved script logging (traces now include object name)

Fixes
-----

- Fixed Module Diff for object with empty "object" field type 
- Fixed Search preference on referenced fields
- Added missing `super` calls on inheritors of `ConfigurationObject`
- REST/JSON services: limit access to non-private system parameters
- validate search: fixed to bypass not searchable and semi-required fields
- REST/JSON: Fix `inlineThumbs` parameter to apply only on image fields and not on document fields
- HTML Editor (TinyMCE): fixed `hasChange` and save
- Inhibited change password features in case of OAuth2 authentication
- Fixed double format and validation on read-only fields
- Fixed session duration issues when using UI and services endpoints within the same session
- Fixed concurrency issues on websocket logs
- Fixed useless creation of public sessions in some tricky cases
- Fixed some wrong `super` hooks calls in `ScriptedObjectDB` and `ScriptedDisposition`