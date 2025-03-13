---
sidebar_position: 3
title: Patch level 03
---

Version 4.0 patchlevel 03 release note
======================================

Changes
-------

- Added server-side Markdown to HTML conversion in `MarkdownTool`
- Added optional `USE_IO`, `USE_GIT` and `USE_API` system parameters to enable/disable the I/O, GIT and API endpoints (all endpoints are enabled by default)
- `Tool.readUrl` and its variants now follows HTTP 301/302/303/307 redirects + added `Tool.readUrlWithClientCert` for calling with client certificates
- Added `Message.formatSimpleText()` for returning plain text to UI
- Added `GoogleAPITool` with OAuth2-related APIs
- Object form templates tags `[*RESOURCEURL:<template name>]` now also look for resource at disposition level if not found at objet level
- Added possibility to configure object-level expressions for field styles and icons using `[EXPR:...]` syntax
- Improved module diff (XML vs ZIP, etc.) and fixed side effects in particular cases (diff on different versions' exports, etc.)

#### visualCaptcha on Registration form

- See http://visualcaptcha.net for documentation
- This captcha has been released to use Simplicité language: texts are translated into PUBLIC language
- The accessibility audios are only available in english, only image translations are include in this version
- jCaptcha has been totally removed from the platform
- Sample in French:

![visualCaptcha](captcha.png)

Fixes
-----

- Fixed session duration issues when using UI and services endpoints within the same session
- Fixed concurrency issues on websocket logs
- Fixed useless creation of public sessions in some tricky cases