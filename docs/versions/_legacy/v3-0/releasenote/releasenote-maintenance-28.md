---
sidebar_position: 210
title: Patch level 28
---

Version 3.0 maintenance 28 release note
=======================================

Changes
-------

- Substituted new lines in long strings fields for CSV export
- Back-ported improvements on home pages (in particular on home pages using lists).

Fixes
-----

- Fixed regression on collapsed panels
- Fixed length and type of `usr_login_read` that was breaking long usernames at password change
- Use of a dedicated business object instance for script editor to avoid side effects on origin instance
- Fixed usage of `EMAIL_DEFAULT_SENDER` system parameter on alerts when `BPMALERT_FROM` is not set
- Fixed `Tool.shiftMonths`
