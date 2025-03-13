---
sidebar_position: 10
title: Patch level 10
---

Version 4.0 patchlevel 10 release note
======================================

Core changes
------------

- Added SHA-1, SHA-256 and SHA-512 hashing algorithms for local password (fully supported by internal OAuth2 authentication,
  support on application servers' authentication modules such as Tomcat Realms and JEE JAAS modules may vary)
- Upgrade libs Apache POI to 3.17 for security reasons
- Partial clear cache of Shared scripts
- Added a `SMSTool` utility for handling SMS service (needs service configuration in the `SMS_SERVICE` system parameter)
- Publication template changes:
	- Added support for tags `[<type>RESOURCE:<code>]` where type is `CSS`, `JS`, `HTML`, '`MD`, .. in the publication templates to inline resources contents
	- Changed behavior of `[FIELD:<name>]` substitutions for document and images fields, now this substitutes de Bas64-encoded data URL of the document
	  (this allow self containd publications including documents and images)
- Improved OAuth2 connection to handle optional `state` attribute

UI changes
----------

- Bulk action `Associate` between objects is implemented
- New action: copy object deeplink to the clipboard. It allows to paste absolute URL in blogs, emails...
- Crosstab and charts
	- it supports previous parameters (zgraph, ztable, zcaption...)
	- responsive charts (when width/height are set in %)
	- search filters
	- Export to PDF (coming soon)
- Undo/Redo feature (CTRL-Z/Y on document) and Ajax APIs
- New field rendering on ENUM and ENUM_MULTI to allow search and pillbox in `<select/>` (see [select2 plugin](https://select2.org/getting-started/basic-usage) for usage demo)

Fixes
-----

- Fixed placemap issue whith hidden on list fields on responsive UI
- Fixed field completion with timer
- Fixed export date to Excel thru POI