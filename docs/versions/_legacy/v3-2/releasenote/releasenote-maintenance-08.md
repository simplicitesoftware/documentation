---
sidebar_position: 280
title: Patch level 08
---

Version 3.2 maintenance 08 release note
=======================================

Changes
-------

- **Cached** resources are now also cached on server side

Fixes
-----

- Fixed email from/subject encoding
- Fixed concatenation method for SQLServer
- Fixed `prepareDate/Time` in various cases
- Refactored `WebPage.appendLayoutHTML()` to avoid hard-coded labels
- Fixed `BusinessObjectTool` return value for search method
- Fixed broken inlined JS identation causing errors in register servlet
- Fixed user-key unicity in case of warning during preValidate
- Fixed XSS vulnerabilities
