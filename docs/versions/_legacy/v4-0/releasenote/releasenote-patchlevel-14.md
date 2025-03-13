---
sidebar_position: 14
title: Patch level 14
---

Version 4.0 patchlevel 14 release note
======================================

Core changes
------------

- Upgraded 3rd party libs and new 3rd party libs (DocuSign client, Google API client)
- Moved folder of FullCalendar components from `scripts/jquery/fullcalendar/` to `scripts/fullcalendar/` (this has no impact if using `HTMLTool.fullcalendarJS/CSS` methods)
- Made Moment JS lib a common lib located in `scripts/moment/` (previously it was available both as a component of Chart.js and of FullCalendar)
- Dynamic class loader to improve class (re)loading of Java objects
- Constraints inheritance available on Scripted and Java objects

UI changes
----------

- Added field `column` in template editor
- Template editor will assign area to object field when template is empty
- Added simple links on read-only lists for types email, phone number and URL
- Improved configuration object's form templates

Fixes
-----

- Click event on completion of `@user` in social text area
- Hidden lookup on foreign key fields when the referenced object is not granted
- Fixed Firefox issue on target="_blank"
- Fixed SVG modeler to launch workflows on opener window
- Fixed access to transition when status has read-only-fields
- Fixed tooltip to support HTML on action help
- Fixed missing call to `initAssociate` hooks in scripted objects
