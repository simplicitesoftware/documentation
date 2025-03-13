---
sidebar_position: 120
title: Patch level 19
---

Version 3.0 maintenance 19 release note
=======================================

Changes
-------

### Password encoding defaults to MD5/HEX for Tomcat

It is highly recommended to have passwords encoded as MD5/HEX when using Tomcat.

This is still an manual configuration but this will become the default shortly.

### Enhanced meta object data in JSON webservices

The meta object fields data have now two extra attributes (in addition to the existing `object` and `row_id`) :

- `label` which contains the referenced object label
- `userkeylabel` which contains the user key label of the referenced record

In addition you can now precise that you want the full referenced record data to be inlined.
To do so you can :

- add the `inlineObjs` option to the AJAX lib `get`, `populate` and `search` methods
- add the `_inline_objects` URL parameter to the GET REST webservices

When this inline option is set the meta oject field will have an additional `item` attribute with the full referenced record data in it.

_Note that if documents and images are inlined at the top level this will also be the case for these referenced data,
and at the potential sub-level referenced data (for which the inline option will be also active)._

### Additional publication template MIME types

The following forced MIME types are now available for print templates:

- Markdown `md`
- ZIP archive `zip`

### Test case pubication as markdown archive

A new publication template has been added on ALM test case so as to publish the test case as a Markdown archive.

The publicattion result is a ZIP archive containing a main `index.md` file referencing screen shots images files of the test case steps.

### Enhanced Bootstrap&reg; web page template

The `com.simplicite.webapp.web.BootstrapWebPage` has been enhanced (DOM IDs on main area `bs-main`, ans main menu `bs-menu`, side menu zone, ...).

Check the associated Java doc for details.

### Support for HTTP method override for REST services

REST services using HTTP `PUT` (update) and `DELETE` (delete) methods can now use HTTP `POST` and the
standard `X-HTTP-Method-Override` HTTP header (in addition to legacy `_method` HTTP parameter approach).

### Refactored mobile web UI

The old jQueryMobile-based mobile web UI has been refactored as a Bootstrap&reg; responsive UI.

![Mobile UI snapshot](mobile.png)

It is still a very light subset of the desktop web UI dedicated to be used in mobility situations where only basic features are required.

### Timeout on AJAX API

It is now possible to set a global timeout on Ajax API calls using the `setTimeout` function.

### Login size

It is now allowed to increase the login size (field `usr_login`).

- this action will automatically update the fields `created_by` and `updated_by`
- and will alter all the related DB columns

Fixes
-----

- Fix UI sessions list
- Fix modeler new popup
- Fix applet recorder
- Fix object garbage collection during edition
- Fix menu domain ordering
- Fix invadiate session on Tomcat
- Fix predefined search with simple quote

