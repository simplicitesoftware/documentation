---
sidebar_position: 230
title: Patch level 03
---

Version 3.2 maintenance 03 release note
=======================================

Changes
-------

- Updated ACEeditor&reg; and added new system parameter `ACE_KEYBINDINGS` to use alternative key bindings
- Custom zones/pages inclusions are now made on client side using `jQuery.load`
- Added `org.json` package to default server script includes
- Added optional (and experimental) GIT endpoint for modules on `[/<root>]/git/<module name>`
- Removed system parameters `LOGIN_PAGE` and `LOGOUT_PAGE` used to point to custom login/logout pages
  (useless because of new disposition-level methods introduced in the previous release)
- OAuth2 and SAML authentication now relies on a standard filter (it used to rely on a specific Tomcat valve)
- Dropped all legacy IE6/IE7 compatibility stuff
- Moved listeners to new package `com.simplicite.webapp.listeners`, this should be transparent as platform's listeners are declared using annotations
  (if you still have explicit listener declarations in your `web.xml` you **must** remove thgem)

Fixes
-----

- REST/JSON services: limit access to non-private system parameters
- validate search: fix to bypass not searchable and semi-required fields
- REST/JSON: Fix `inlineThumbs` parameter to apply only on image fields and not on document fields
- HTML Editor (TinyMCE): fixed `hasChange` and save
- Inhibited change password features in case of OAuth2 authentication
- Fixed UI deadlock between extra gadgets and grant hooks
- Fixed UI/Disposition initialization on first user access
- Fixed I/O servlet's alt service names management
- Fixed double format and validation on read-only fields
