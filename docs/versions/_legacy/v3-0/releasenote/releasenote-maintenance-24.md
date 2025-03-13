---
sidebar_position: 170
title: Patch level 24
---

Version 3.0 maintenance 24 release note
=======================================

Changes
-------

- Added `mdl_url` field in module export
- Addd `MarkdownTool` class (backported from 3.1). The _markdown documentation_ module can now be used on 3.0 as well.
- Upgraded JQuery to 1.11.3

Fixes
-----

- Fixed asynchronous action called in a synchronous method
- Fixed servlets behavior on concurrent calls
- Fixed completion on fields that was not working on new Chrome version  >= 0.46