---
sidebar_position: 5
title: Patch level 05
---

Version 4.0 patchlevel 05 release note
======================================

Changes
-------

- Add a boolean `mdl_autoupd` field on Module object. Add a cron job to update module with an URL and `mdl_autoupd` set to true
- Updated jQuery, Bootstrap, AceEditor and FullCalendar
- Column and table names are now checked against a list of SQL reserved words
- Added simplified date interval search filters syntax for REST/JSON services e.g. `"myDateField": "2016-01-01,2016-12-31"`
- Added new grant hook `GrantHooks.customAuth(request, response)` that can be used to handle a custom authentication mechanism (custom SSO, ...)
  see. [this document](/lesson/docs/authentication/tomcat-customauth) for details
- Removed Flash&reg; charts (system parameter `FLASH_CHARTS` is removed)
- Refactored URL schemes for main page components, business objects pages and workflows pages (see [this document](/lesson/docs/versions/upgrading) for details)
- Light and dark background-friendly loading GIFs
- Added new grant hook `downloadDocument` called after document download checks are done (either using generic UI document URL or raw document service URL,
  Note that this hook is not called when an object document field is inlined in a data webservice call) 
- Removed deprecated public agenda and public print pages and print gadget
- Added `GOOGLE_API_KEY` system parameter for Google APIs key
- Upgraded TinyMCE to latest version (4.4.3)
- Chat gadget is now a scripted external object
- Scope request: force a valid scope when the requested scope is not granted
- Refactored module's publications/exports (PDF doc, API doc as markdown, API doc as HTML, OpenAPI/Swagger schema, UML/XMI, ...)
- Removed legacy synchronous services (the JS file `service.js` has been removed)
- Optimization: usage of the `Simplicite.Ajax` singleton instead of new instances
- Add static text for common error on `ServletTool`
- Removed window popup selections (and associated `USE_SELECT_POPUP_WINDOW` system parameter)
- Static client JavaScript resources are not preprocessed anymore (only CSS are still preprocessed)
- Removed static `application.js` include and inclusion of disposition's `SCRIPT` resource if any.
- Removed static `application.css` include (the disposition's `STYLES` resource, if any, was already included)
- Expression syntax `[EXPR:...]` can now be used also for business workflow's `Forward` page data
- Updated icons

Fixes
-----

- Ajax lib methods `documentURL`, `imageURL`, ... fixed to include user token and fixed grant issue on raw document services
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
- Fixed handling of advanced `[EXPR:(...)]` actions' and external objects' URL
- Fixed misinterpretations of `[<field name>]` syntax (instead of `[VALUE:<field name>]`) in complex expressions
- Fixed asynchronous calls to `setParameter`
- Fixed generic UI's asynchronous object deletions when business objet is not using form
- Fixed NPE when grant is null on `JSONServlet`
- Fixed edit list: display error messages on rows and continue saving rows after the first row in error
- Fixed some missing credentials options on some jQuery Ajax calls