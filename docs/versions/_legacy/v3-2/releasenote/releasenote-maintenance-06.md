---
sidebar_position: 260
title: Patch level 06
---

Version 3.2 maintenance 06 release note
=======================================

JVM
---

For compatibility with some dependencies, this version is now compiled using a **OpenJDK version 1.8** (so far is was compiled using a OpenJDK version 1.7).

This means a JVM 1.8 **must** now be used to run this version.

Changes
-------

- Removed from the field wizard the confusing 0 order list value that corresponds to the label of the empty field (note that this presentation strategy is to be considered deprecated anyway
  as a placeholder is now configurable at field translation level, which is a far better approach)
- Added optional `MAIL_MAILER` system parameter to set the `X-Mailer` SMTP header with a custom value instead of `Simplicite`
- Count in SOAP/REST webservices now returns actual list length when `getCount` return zero (e.g. useful when list is built dynamically in the `pre/postSearch` hooks)
- Added rights on user parameters to `GRANT_ADMIN` and `USER_ADMIN` profiles
- Added limited document preview features on lists and forms (needs the `USE_DOC_PREVIEW` to be set to `yes`, it defaults to `no`)
- Improved `Tool.readUrl[AsByteArray]` APIs to allow multipart POSTs
- Added new API `ObjectDB.getTableAlias(field)` to get the table alias of an ObjectField, it will return:
	- `t` : alias of the main table
	- `t\_[fk1]\_...\_[fkn]` : alias based on the foreign-key full name when joins are ambiguous (ex: `t\_myGrandParentFK\_myParentFK\_myFieldFK`)
	- `t\_[fkn]` : short name for forward compatibility when the joins are not ambiguous (ex: `t\_myFieldFK`)
- Changed `customAuth` behavior to make authentication provider (and method) available in `pre/postLoafGrant` hooks (also true for OAuth2/SAML)
- Removed legacy ExcelML export format
- Added new object hooks (`getHelp` or `getCtxHelp`) to customize main and contextual helps 
- Search: forced a final sort on the primary key field (to make the pagination ordering predictable)
- Added helper methods for selection in `BusinessObjectTool`
- JVM system properties are now taken into account when setting globals
- `Grant.getParameter` returns `toString()` on non `String` values
- Improved index search for HSQLDB (`and` operator is used by default for multiple words, words can be prefixed by `+` to use `or` operator instead)
- Added case-insensitive search support for PostgreSQL using non SQL99 operator `ilike`
- Added optional `application.url` property to force URL instead of determining it from first request
- Optimized IP/hostname checking at startup (to limit impact of "slow" DNS lookups)
- Added re-evaluation of field's default values and calculated expressions using `[ROWID]` after row ID is actually set
  (this allows for example default value expression like `[EXPR:Tool.format("ABC-%05d", Long.valueOf([ROWID]))]`
  to set the value of the field to `ABC-00123` at creation of  record with row ID `123`)
- Treeviews now use links translation when available

Fixes
-----

- Fixed pivot table URL options that were not taken into account when manually building URL (e.g. as a redirect in an external object or as external object URL or shortcut URL expression)
- Fixed usage of customized `getUserKeyLabel` for links labels on the modeler
- Fixed restore preference
- Fixed agenda actions and duplicated delete button
- Fixed missing update of current list row values after `postSelect` hook call on lists
- Fix obj.getAlert by name without recipients
- Fixed joined document deletion when the document is referenced and the relationship is removed
- Fixed log_user size to 100
- Fix TYPE_INT into database `BIGINT` (driver JDBC long instead integer): designer must update each field to alter the columns
- Fix TYPE_FLOAT into database `DECIMAL`: designer must update each field to alter the columns. Beware: float max scale has been upgraded to 32 but calculations are always made using java `double`. Upgrade to V4 if needs require the new type BIGDECIMAL(100,32).
- Fixed double call to `isUpdateEnable` and `isDeleteEnable`
- Fixed table alias on ambiguous joins when multiple foreign-keys use the same road.
- Fixed missing `try/catch` blocks around some hooks calls
- Fixed search: force a final sort on the primary field (to preserve the pagination ordering)
- Fixed row navigation: re-use the current list of Panel or Home instance when redirecting to the Main form
- Fixed regression on history object's index calculation
- Fixed synchronize documents algorithm
- Fixed SQL injection vulnerability on index searches (for PostgreSQL and databases without fulltext search capability like HSQLDB)
- Fixed confusion between UI grant and API/IO/Git grants when used within the same server session
- Fixed 'Edit/Add list' buttons when configured in 'plus' button
- Fixed `select` object: final sort on `row_id` on specific requests has been removed for backward compatibility reasons
- Fixed navigation issue from index search results
- Fixed autocompletion only fields on legacy UI search and select pages
- Fixed modeler: sometimes wrong object was inserted in models
- Fixed module's ZIP export when documents are stored as BLOB
- Fixed final stream management in case of stream changes in the adapter's implementation
- Fixed modeler: add a workaround for recent Chrome issue: simple links were sometimes invisible
- Fixed date format in vCalendar events
- Fixed TSV (Tabs-separated values) and PSV (Pipe-separated values) imports from I/O
