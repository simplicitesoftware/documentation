---
sidebar_position: 8
title: Patch level 08
---

Version 4.0 patchlevel 08 release note
======================================

Core changes
------------

- Theme: rebuild the CSS during a full clear cache (less compilation)
- Daily crontab `DesignAudit`: generate social posts on configuration issues
- Store recent objects usage per home page in user's parameter `HISTORY <view>` asynchronously every minute
- Send runtime issue in Social Post `AuditTool.runtimeIssue(level, msg, object, id)`
- Added re-evaluation of field's default values and calculated expressions using `[ROWID]` after row ID is actually set
  (this allows for example default value expression like `[EXPR:Tool.format("ABC-%05d", Long.valueOf([ROWID]))]`
  to set the value of the field to `ABC-00123` at creation of  record with row ID `123`)
- Added Java class-level completion feature in script editor (e.g. when you type `Tool.toDate<Ctrl-Space>` in the editor you get the prototypes
  of all public - and non deprecated methods - of the `com.simplicite.util.Tool` class). Note that this feature does not work on class instances variables.
- Parse filter with array of codes for enum field in ajax/json
- Predefined search: use now the JSON format to persist filters (same syntax as ajax/json filters and orders), Note that old URL syntax will be fixed on the fly with an audit post to notify the designers.
- Treeviews now use links translation when available
- Added links only mode on tree views
- Removed the deprecated `$` client JavaScript function in legacy UI, `$` is now the usual alias to `jQuery` (the old `$j` alias is kept for compatibility but it is recommended to change it to `$`)
- Audit to prevent dead `Field style` when field or object is unknown, or both are set to '*'
- Added system scripts execution tools in `SystemTool`
- Added `get/setCurrentTransition` in ObjectDB to determine which transition is currently used on UI during the save process
- Status field: several transitions can coexist with distinct actions/callbacks on same statuses and authorized to a same group

UI changes
----------

- Auto-focus the first field in search dialog and inlined row
- Circular progress bar (see `Simplicite.UI.View.Widget.circularProgressBar`)
- Progress dialog with backend service with progression message `Simplicite.UI.View.showProgress`
- Added `Save & Close` button with canSave|canClose|canSaveClose in metadata
- Added `Save & New` and `Save & Copy` buttons on creation form
- Added the search rendering of enum field: single|multi-select or multi-checkboxes
- Multi-rows selection in modeler import
- Added tooltip on list when field has an icon style
- More intuitive dialog to sort by multi-columns with ascending/descending ability (old signed numbers have been removed from UI)
- Added `predefined search` feature in search dialog
- New toast widget to display quick little message for the user (see `Simplicite.UI.View.Widget.toast`)

Fixes
-----

- Fixed losing generic actions during a partial clear cache of groups
- Fixed wrong navigation after a reference search: only main object will be addded to navigation
- Fixed `Simplicite.UI.View.split` with an iframe content: do not reload script editor when the modeler opens on right side
- Fixed workflow `ModuleDiff` on responsive UI
- Fixed redirect to object list|form within iframe on responsive UI
- Fixed TSV (Tabs-separated values) and PSV (Pipe-separated values) imports from I/O
- Fixed ajax update during status transition: restore previous status on error and send previous status metadata
- Fixed copy of status field on responsive UI (force the initial state)
