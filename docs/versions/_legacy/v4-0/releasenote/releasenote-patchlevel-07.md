---
sidebar_position: 7
title: Patch level 07
---

Version 4.0 patchlevel 07 release note
======================================

Core changes
------------

- Improved index search for HSQLDB (`and` operator is used by default for multiple words, words can be prefixed by `+` to use `or` operator instead)
- Improved Git repository management tool
- All responsibilities, even the one marked inactive, are taken into account for I/O grants (this prevents side effects of UI scopes on I/O grants)
- Added generic OpenIDConnect OAuth2 provider framework (see [this document](/lesson/docs/authentication/tomcat-oauth2) for details)
- The `com.simplicite.webapp.GrantWeb` class is now deprecated, all implementation have been moved moved to `com.simplicite.util.Grant` class
- Added case-insensitive search support for PostgreSQL using non SQL99 operator `ilike`
- Load `STYLES` and `SCRIPT` resources of inherited objects
- Added 2 accessors in SimpleAdapter: `getOrigin` and `getTrackId` to get the origin of data in the current import tracking
- Modeler: the `add link` mode has been changed to simplify links creation between 2 nodes (drag&drop will detect the link template to apply)
- Model items storage: this allows to list in a new panel the models containing a given object
- Added optional `application.url` property to force URL instead of determining it from first request
- Atlassian Crowd integration to authenticate the user + support for Crowd SSO token
- Improved document preview feature to use Microsoft Office online viewer for Word/Excel/PowerPoint documents
- Module audit has been deleted. Design issues are triggered in social posts for designer's followers on related object
- ViewDesign has been completed with models and design audit
- Optimized IP/hostname checking at startup (to limit impact of "slow" DNS lookups)

UI changes
----------

- Added direct access to models on header when user has responsibility `MODELER`
- ViewOperation has been refactored to display the system informations and to wrap the monitoring into iframe
- Template editor: allows to search/associate existing field to object
- Template editor: generate simple template when area UI is empty but contains fields, and auto-correct fieldarea names
- Added `floating` actions property on list and form: ensure some actions to stay visible during vertical scrolling (default true)
- Added field completion on search form (in dialog or pin/inlined fields)
- Added "Don't ask again" feature on confirm dialog. Example: CONFIRM_LOGOUT.
- ObjectInternal/ObjectFieldSystem/Field templates have been refactored
- Added 3 hooks to override list/form/search rendering (obj.locals.ui.list.display, obj.locals.ui.form.display, obj.locals.ui.search.display)
- Icon picker: added JS resource to ResourcePicker to override the default rendering (list icons instead of datamap list)
- New Color picker based on jQuery plugin `Spectrum`, predefined colors, local storage for custom colors... (see https://github.com/bgrins/spectrum)
- `Theme` definition to customize a scope/home disposition: set of logos, main colors and specific CSS styles
- Set `SHOW_MOBILE` to `always` to use the mobile UI only
- Modeler: preset the container foreign-key in object form during node creation
- Object property `useForm` has been added to the meta-data to disable the open/create/copy rows on list
- Deep link `/ui?deeplink=<uri>` to support object direct access (i.e. `/ui/obj/form/User?row_id=1` or  `/ui/obj/list/User?nav=add`)
- Constraint: new target FieldArea to show/hide field areas dynamically
- Social post optimization during save

Fixes
-----

- Fixed `select` object: final sort on `row_id` on specific requests has been removed for backward compatibility reasons
- Fixed navigation issue from index search results
- Fixed bulk update of foreign keys on responsive UI
- Fixed autocompletion only fields on legacy UI search and select pages
- Fixed modeler: sometimes wrong object was inserted in models
- Fixed module's ZIP export when documents are stored as BLOB
- Fixed final stream management in case of stream changes in the adapter's implementation
- Fixed partial clear cache of referenced object to reset visible panels
- Fixed state transition form and foreign keys metadata
- Fixed modeler: add a workaround for recent Chrome issue: simple links were sometimes invisible
- Fixed infinite loop on responsive UI when clicking the pin search button on panel
- Fixed partial clear cache on states model
- Fixed not visible area in responsive tabs vs. hide an empty tab
- Fixed filters/orders disappearance on response view lists
- Fixed template editor when a row is moved to other area
