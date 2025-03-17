---
sidebar_position: 250
title: Patch level 05
---

Version 3.2 maintenance 05 release note
=======================================

Changes
-------

- Add a boolean `mdl_autoupd` field on Module object. Add a cron job to update module with an URL and `mdl_autoupd` set to true
- Updated jQuery, Bootstrap, AceEditor and FullCalendar
- Column and table names are now checked against a list of SQL reserved words
- Added simplified date interval search filters syntax for REST/JSON services e.g. `"myDateField": "2016-01-01,2016-12-31"`
- Added new grant hook `GrantHooks.customAuth(request, response)` that can be used to handle a custom authentication mechanism (custom SSO, ...)
  see. [this document](/lesson/docs/authentication/tomcat-customauth) for details
- Flash&reg; charts marked as deprecated and outdate, this means this feature will be fully removed in next version
- Light and dark background-friendly loading GIFs
- Added new grant hook `downloadDocument` called after document download checks are done (either using generic UI document URL or raw document service URL,
  Note that this hook is not called when an object document field is inlined in a data webservice call)
- Public agenda and public print pages and print gadget marked outdated deprecated (will be removed in next version)
- Added `GOOGLE_API_KEY` system parameter for Google APIs key
- Upgraded TinyMCE to latest version (4.4.3)
- Scope request: force a valid scope when the requested scope is not granted
- Optimization: usage of the `Simplicite.Ajax` singleton instead of new instances
- Add static text for common error on `ServletTool`
- Static client JavaScript resources are not preprocessed anymore (only CSS are still preprocessed)
- XML Import of object with a state-model: do not force the initial state and import the requested state
- Inclusion of disposition's `SCRIPT` resource if any.
- Expression syntax `[EXPR:...]` can now be used also for business workflow's `Forward` page data
- Updated icons
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
- Added Bootbox&reg; JS lib
- Added optional caption on Crosstab
- Export Crosstab with auto sizing columns on Excel POI (binary)

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
- Synchronize XML import per UI session
- Fixed handling of advanced `[EXPR:(...)]` actions' and external objects' URL
- Fixed misinterpretations of `[<field name>]` syntax (instead of `[VALUE:<field name>]`) in complex expressions
- Fixed asynchronous calls to `setParameter`
- Fixed generic UI's asynchronous object deletions when business objet is not using form
- Fixed NPE when grant is null on `JSONServlet`
- Fixed edit list: display error messages on rows and continue saving rows after the first row in error
- Fixed some missing credentials options on some jQuery Ajax calls
- Fixed ZIP export failure when an attached file is missing
- Fixed ZIP import to ignore non XML files in root directory
- Fixed action check in XML imports that was causing some imports to fail in some particular cases
- Fixed View with Predefined search on Enum field
- Fixed Predefined search deletion when user is not granted to Research
- Fixed regression on split menus
- Fixed remote feedback

