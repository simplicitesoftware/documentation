---
sidebar_position: 220
title: Patch level 02
---

Version 3.2 maintenance 02 release note
=======================================

Changes
-------

- Added `displayHome`, `displayPublic`, `displayPublicHome`, `displayLogon` and `displayLogout` to disposition to override home page, public main page, public home page, logon page and logout page when needed
- Improved CSV import (added `MAPPINGS=<field>:<col #>[:date|datetime|time|float|boolean][,(...)]` parameter to add column mapping and basic transformation when needed), upgraded CSV import UI to reflect these changes
- Added `PRV` (private) system parameter type filtered for public grant
- Simplified OAuth2 configuration
- Made call to Google+ API non mandatory during Google OAuth2 identification/authentication sequence
- Added business object hook `isMergeMaster` to tell wether a record is the "master" in a multi-record merge
- Substituted new lines in long strings fields for CSV export
- A negative value for `RAILWAY` system parameter now means no railway
- Updated jQuery&reg; and Bootstrap&reg;

Fixes
-----

- Fixed pivot table on REST APIs
- Fixed UI when `canReference` hide the current view
- Fixed length and type of `usr_login_read`that was breaking long usernames at password change
- Fixed CSV import with tab separator
- Fixed usage of `EMAIL_DEFAULT_SENDER` system parameter on alerts when `BPMALERT_FROM` is not set
- Fixed `Tool.shiftMonths`
- Fixed Module Diff for object with empty "object" field type 
- Fixed Search preference on referenced fields
- Added missing `super` calls on inheritors of `ConfigurationObject`
