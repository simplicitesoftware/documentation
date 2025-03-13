---
sidebar_position: 260
title: Patch level 33
---

Version 3.0 maintenance 33 release note
=======================================

Changes
-------

- **Minimal JVM requirement is now version 1.7** (previously the compilation was already done using a JVM version 1.7 but in version 1.6 compatibility mode)
- Static content URL are using relative path syntax `<root>/content/<static file relative path>`
  (the legacy URL syntax `<root>/content?file=<static file relative path>` is kept for backward compatibility but its use is discouraged)
- Added last login date in health check service

Fixes
-----

- Fixed some missing credentials options on some jQuery Ajax calls
- Fixed ZIP export failure when an attached file is missing
- Fixed some servlets `Content-Type` HTTP header not properly set
- Fixed cross domain issue with basic authentication in Ajax lib
- Fixed ZIP import to ignore non XML files in root directory
- Fixed action check in XML imports that was causing some imports to fail in some particular cases
- Fixed View with Predefined search on Enum field
- Fixed Predefined search deletion when user is not granted to Research
