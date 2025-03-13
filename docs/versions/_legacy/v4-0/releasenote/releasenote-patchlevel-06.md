---
sidebar_position: 6
title: Patch level 06
---

Version 4.0 patchlevel 06 release note
======================================

Changes
-------

- Added count REST/Ajax service
- Custom authentication is now also avialable on the API endpoint
- Static content URL are using relative path syntax `<root>/content/<static file relative path>`
  (the legacy URL syntax `<root>/content?file=<static file relative path>` is kept for backward compatibility but its use is deprecated)
- Added Microsoft Account OAuth2 provider
- The user data is now automatically updated with session info if present (e.g. this is the case when using external OAuth2 authentication for instance)
- Added last login date in health check service
- Added possibility to use `CONTENT` file set resource to configure per-disposition static content files (accessibles in the `/content/<disposition name>` public path)
- Added module import by cloning/pulling from a remote Git repository
- Changed CSS inclusion order so as to include objects' and processes' `STYLES` resource in last position (allowing to override core and disposition styles without the need of `!important`)
- Added business object hook `getMappedFilePath` to get a custom path for files during exports
- Replaced _TxtMark_ markdown Java lib by _CommonMark_, if you only use the `MarkdownTool` wrapper (which you should) this change is transparrent
- Added LESS compilation capability for CSS resources
- Added minifier capability for JS resources
- Added Bootbox&reg; JS lib
- Changed static CSS files to themable LESS files for a modernized and more flexible default disposition. Two themes are provided: `default` and `sandbox`
  The base theme can be chosen using the optional `THEME` system parameter (which can be disposition-specific)
- Added optional `GOOGLE_FONT` system parameter to force usage of a Google font
- Removed from the field wizard the confusing 0 order list value that corresponds to the label of the empty field (note that this presentation strategy is to be considered deprecated anyway
  as a placeholder is now configurable at field translation level, which is a far better approach)
- Added optional `MAIL_MAILER` system parameter to set the `X-Mailer` SMTP header with a custom value instead of `Simplicite`
- I/O endpoint return HTTP status `401`, `400` and `500` in case of authentication error, functional error and technical error
- Count in SOAP/REST webservices now returns actual list length when `getCount` return zero (e.g. useful when list is built dynamically in the `pre/postSearch` hooks)
- The `SocialPosts` external object has been refactored to a Java class (it used to be a scripted external object)
- Added rights on user parameters to `GRANT_ADMIN` and `USER_ADMIN` profiles
- Added document preview features on lists and forms (needs the `USE_DOC_PREVIEW` to be set to `yes` which is the case by default)
- Improved `Tool.readUrl[AsByteArray]` APIs to allow multipart POSTs
- Added Andoid/iOS like slide button for boolean fields (on both legacy and responsive UIs)
- It is possible to define plural value for static text values using the pipe `|` separator (e.g. `Entry|Entries`).
  The `Grant.T()` function has now a variant with  boolean argument if you want to get the plural value
- It is also now possible to set the plural object translation using the pipe `|` separator (e.g. `Order|Orders`). The plural translation defaults to singular translation if absent.
  A new API allows to access to the plural translation `ObjectCore.getPluralDisplay()`. The plural translation is used in the menu entries an on the search and list titles. 
- Added a new `EncryptionTool` class for basic field value encryption (see [this document](/lesson/docs/core/advanced-code-examples) for details)
- Refactored user's initial password and reset password strategy (now an intial password and reset password is a random string that if forced to be changed at next login)
- Added Social+Follower screens on the responsive UI
- Added a constraint `effect` as a multi-valued field:
	- `Static`: the constraint will be executed on object loading (before the postLoad)
	- `Back-end`: default, the constraint will be executed on server-side (as in V3.2 during initUpdate, validate...)
	- `Front-end`: the constraint will be executed (see limitations below) on client-side (on page loaded and change events of conditional/impacted fields)
- Added constraints client-side execution on responsive UI:
	- Dynamically show/hide/enable/disable fields, buttons and views
	- Available on Form and Edit list
	- Force a field value
	- Change a field list of values
- Added minimalistic client-side constraints execution on legacy UI:
	- Dynamically show/hide fields on Form
- Added keys `CRTL-S` (triggers all save actions) and `ESC` (try to close the page) on responsive UI
- Added a new field type `ObjectField.TYPE_BIGDECIMAL` to manage high precision and scale DECIMAL(100,32)
- Added new API `ObjectDB.getTableAlias(field)` to get the table alias of an ObjectField, it will return:
	- `t` : alias of the main table
	- `t\_[fk1]\_...\_[fkn]` : alias based on the foreign-key full name when joins are ambiguous (ex: `t\_myGrandParentFK\_myParentFK\_myFieldFK`)
	- `t\_[fkn]` : short name for forward compatibility when the joins are not ambiguous (ex: `t\_myFieldFK`)
- Changed `customAuth` behavior to make authentication provider (and method) available in `pre/postLoadGrant` hooks (also true for OAuth2/SAML)
- Added `Calculator` rendering on responsive UI, calculation in double precision (BigDecimals are not yet supported on client side)
- Added PlaceMap rendering on responsive UI with new API `Simplicite.UI.PlaceMap`: build static images and dynamic Google maps with markers/shapes
- WebService optimizations: simplify JSON metadata per context (ex: do not send crosstabs definition on CONTEXT\_UPDATE), limit search result to visible fields on CONTEXT_LIST (when param visible=true)
- Removed legacy ExcelML export format
- Improved prune logs and prune jobs actions
- Added standard `Export` on the responsive UI with the API `ui/importexport`
- Added a simple gesture on responsive UI: `jQuery.swipe`
	- to open/close the minified menu
	- to close modal dialog by the left, right or top direction
- Added new object hooks (`getHelp` or `getCtxHelp`) to customize main and contextual helps 
- Responsive UI
	- Added the NOTEPAD rendering on responsive UI: kept for forward compatibility reasons but now users should use the social function
	- Added a badge counter on buttons (i.e. bulk export, update all, delete all) to help user to check the number of selected rows
	- Added linked fields (between ENUMs) on form and edit list
	- Embedded Crosstab on Views
	- Object miniature can be configured in object template
- Search: forced a final sort on the primary key field (to make the pagination ordering predictable)
- Added service for synchronize documents + refactored and fixed algorithm
- Theming:
	- `sandbox` theme has been renamed to `dark`
	- `sandboxlight` theme has been renamed to `light`
	- a theme chooser is now accessible in the user's menu in responsive UI
- Added helper methods for selection in `BusinessObjectTool`
- Changed list of values with unlimited size of translated text `lov_value`
- JVM system properties are now taken into account when setting globals
- `Grant.getParameter` returns `toString()` on non `String` values
- Auto-update feature: at startup the platforms checks its current patch level and automatically applies missing patches
  (this is an **experimental** feature which needs the JVM system parameter `platform.autougrade` to be set to `true` to be activated)

Fixes
-----

- Fixed ZIP export failure when an attached file is missing
- Fixed some servlets `Content-Type` HTTP header not properly set
- Fixed cross domain issue with basic authentication in Ajax lib
- Fixed ZIP import to ignore non XML files in root directory
- Fixed action check in XML imports that was causing some imports to fail in some particular cases
- Fixed regression on split menus
- Fixed remote feedback
- Fixed pivot table URL options that were not taken into account when manually building URL (e.g. as a redirect in an external object or as external object URL or shortcut URL expression)
- Fixed usage of customized `getUserKeyLabel` for links labels on the modeler
- Fixed missing update of current list row values after `postSelect` hook call on lists
- Fixed joined document deletion when the document is referenced and the relationship is removed
- Fixed `log_user` size to 100
- Fixed double call to `isUpdateEnable` and `isDeleteEnable`
- Fixed table alias on ambiguous joins when multiple foreign-keys use the same road.
- Fixed missing `try/catch` blocks around some hooks calls
- Fixed toggle menu on responsive UI
- Fixed bootstrap `Modal` multiple backdrop: dialog will be destroyed when hidden
- Fixed search: force a final sort on the primary field (to preserve the pagination ordering)
- Fixed row navigation: re-use the current list of Panel or Home instance when redirecting to the Main form
- Fixed regression on history object's index calculation
- Fixed SQL injection vulnerability on index searches (for PostgreSQL and databases without fulltext search capability like HSQLDB)
- Fixed confusion between UI grant and API/IO/Git grants when used within the same server session 
- Fixed 'Edit/Add list' buttons when configured in 'plus' button
