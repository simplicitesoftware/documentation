---
sidebar_position: 25
title: Patch level 25
---

Version 4.0 patchlevel 25 release note
======================================

> **Warning**: The long term maintenance on this version is now ended.
> The maintenance release P25 is the **FINAL** maintenance release for this version,
> no further maintenance releases are scheduled.

<h2 id="backported">Backported features</h2>

- Search by date on list: date picker and reset button launch a new search
- Title & addon resources for auth pages:
	- `LOGON_PROVIDERS_TITLE` and `LOGON_PROVIDERS_ADDON` for the auth providers selection page
	- `LOGON_TITLE` (and still the existing `LOGON_ADDON`) for the internal auth provider's logon page
- Backported `Tool.getWeekOfYear` and `Tool.getDayOfWeek` with locale
- Backported object hook `canPreview(field, doc)`
- Backported object hook `boolean canPreview(field, doc)` and grant hook `boolean canPreviewDocument(grant, doc)`
- Backported support for calculated fields on pivot tables
- Unauthorized search now returns an empty list instead of a `null`
- Backported`Tool.join` and `Tool.split` methods
- The resources are now excuded from the JAR built from the module's `pom.xml` in an IDE
- Delete jobs with running jobs interruption
- Changed JSR223 Rhino engine (for compliance with JVM 16)
- `$ui.openURL` force now the `rel=opener` to set the window.opener (Chrome 88 has changed to `noopener` by default)
- Added `Tool` methods for date manipulation
- Backported redolog in API REST access
- Backported crosstab chart on TEXT columns
- Backported `CloudStorageTool` using file stream (put with a path and openStream)
- Backported `CloudStorageTool.list` improvements + `CloudStorageTool.delete`
- Moved Object parameters in GrantData to be saved during a garbage collection
- Crosstab chart Yaxis with suggestedMin: 0
- Crosstab chart Yaxis with same CT precision
- Using an older webapp on an upgraded database is now causing a **FATAL** error that prevents platform
  to start up (this is to avoid unexpected side effects in this non supported case)
- New hook `isExportAllowed`

<h2 id="fixes">Fixes</h2>

- Robustness fix on PostgreSQL sequences
- Fixed missing `canCloseContent` call
- Fixed ressource mismatch on providers' page addon
- Increased robustness (and fixed for SAML) on `PlatformHooks.parseAuth` calls
- Added fetch on diagram container
- Limited associate on panel to current foeign keys
- Fixed potential infinite loop in `setRootField` 
- Added missing partial clear cache on print templates and pivot tables
- Disabled constraints on template editor
- Fixed download issues for file names with unusual characters (e.g. `,`)
- Removed, for security reasons, commented stacktrace from the legacy low-level error pages
- Fixed a minor XSS vulnerability on the download/preview file popup's title
- Fixed `ObjectCore.toHTML()`
- Fixed title padding on diagrams
- Fixed module's Git repository deletion when deleting module
- Fixed filter on modeler for non string fields
- Fixed pagination in some cases (e.g; in REST-mapped APIs)
- Fixed enum multiple filter
- Fixed "group-by" list when select row is false
- Fixed image generation on hidden diagram
- Fixed class required on list
- Fixed front constraints pseudo-resource's MIME type
- Fixed disabled buttons on screen resize
- Fixed compatibility with `obo_srh_predef` values in old exports
- Oracle driver workaround: forced `TYPE_SCROLL_INSENSITIVE` in queries
- Fixed big number validation
- Fixed dropdown position of grouped actions on list item
- Fixed list display when pagination=no
- Changed `Mail` SMTP authentication
- Group-by on list: final call to hook `list.onload`
- Fixed empty row actions in case of resize
- Fixed actions indentation on grouped lists
- Fixed help icon on date field
- Fixed Link map and pillbox context
- Fixed modeler data-keys updates
- Performance fix on date picker
- Increased robustness for thumbnail generation for unhandled images types (e.g. TIFF)
- Fixed series label on enum and decimals
- Document icon per mime-type
- Preview document in meta-data
- List add-row shows col-action
- Fixed datetimepicker with date min/max
- Fixed full input substitution in SQL
- Fixed checkbox on search on multiple enumeration field
- Robustness fix on search spec preprocessing
- Fixed getTargetObject in case of copy
- Fixed export in case of multiple pillbox rendering
- Force change password flag is now checked for I/O access, preventing using default `designer`'s password
- Fixed multiple pillboxes context
- Fixed errors on edit list with group-by
- Use metadata.create|del in displayReferencePillbox
- Ignore cross-domain error in `$ui.getTop`
- Fixed validate during a reset of required document
- Fixed errors on list upsert
- Removed Google API key (and associated URLs) by default on public pages
- Fixed inherited clone object
- Backported `USE_API_TESTER` system parameter to enable/disable the API tester page
- Backported `USE_HEALTH` system parameter to enable/disable the health check page/service
- Fixed not deleted token on logout from NPM lib
- Apply linked lists to referenced enum fields
- Auto-save parent form during a save of panel edit list
- Fixed `initRefSelect` and `initDatamapSelect` parent context on edit-list
- Fixed export POI with reflexive links with same objects
- Fixed UI: hide the download button when a doc has been rejected during save
- Backported support usr_login with simple quote
- Backported new business object hook `isExportAllowed` to allow/prevent exporting based on custom business rules
- Reinforced redirect URI checking for OAuth2/OpenIdConnect authentication
- Fixed delete cascade with positive cardinality
- Improved legacy password checking on the API endpoint when calling services with basic auth credentials
- Fixed doc index update
- Backported the new `Tool.toPlainText` method to clean HTML content and decode HTML entities (used in exports)
- Fixed export POI Excel of pivot table with textual content
- SQL script I/O service is now restricted to system admin users and operators
- Fixed issue on API external objects after explicit logout
- Fixed index generation for Oracle
- Fixed unsplit screen with maximized part
- Fixed `initRefSelect` parent context on edit-list
- Fixed referenced object table in other datasource
- Fixed constraint with Create/Update/delete impact on object
- Fix partial clear cache when deleting a user's group
- Fix UI `change` handler on bigdecimal field
- Fixed cron workers to wait for job thread die
- Added context CONTEXT_UPDATE or CONTEXT_SEARCH on `fieldCompletion` hook

coming soon

- Fixed constraints on edit-list add row
- Fixed full XML export with pagination and filters
