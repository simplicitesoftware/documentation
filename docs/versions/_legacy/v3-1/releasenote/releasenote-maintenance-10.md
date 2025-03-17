---
sidebar_position: 290
title: Patch level 10
---

Version 3.1 maintenance 10 release note
=======================================

Changes
-------

- Updated jQuery, Bootstrap, AceEditor and FullCalendar
- Added simplified date interval search filters syntax for REST/JSON services e.g. `"myDateField": "2016-01-01,2016-12-31"`
- Public agenda and public print pages and print gadget marked deprecated
- Added `GOOGLE_API_KEY` system parameter for Google APIs key
- Upgraded TinyMCE to latest version (4.4.3)
- Scope request: force a valid scope when the requested scope is not granted

Fixes
-----

- Ajax lib methods `documentURL`, `imageURL`, ... fixed to include user token
- Fixed bug on boolean filters in API calls
- Fixed encoding issues on search validation messages
- Added missing `ALM_ADMIN` group to `ADMIN` group profile
- Fixed unappropriate usage of `of` SQL99 reserved word as table alias in some platform's core requests
- Prevented unwanted password autocompletion in change password form
- Fixed bug on apply changes on web zones
- Added `{MD5}` at the beginning of hashed passwords when using base 64 encoding (system parameter `HASH_PASSWORD` = `BASE64`)
  NB: when migrating from a previous version using base 64 encoding you should alter manually the encoded passwords directly
  in the database by `update m_user set usr_password = '{MD5}' || usr_password where usr_password is not null`
- Fixed credentials management on remote Simplicité objects
- Fixed clear user token action
- Fixed internal Cron to execute only one daemon per application and JVM
- Synchronize XML import per UI session
- Fixed handling of advanced `[EXPR:(...)]` actions' and external objects' URL