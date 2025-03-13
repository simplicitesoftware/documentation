---
sidebar_position: 40
title: Upgrading
---

Upgrade from version 3.2 to version 4.0
=======================================

> **Note**: This document is evolving with every 4.0 release

Introduction
------------

The version 4.0 have some significant changes if compared to version 3.x that requires some attention if you are considering a migration from such a previous version.

Removed features
----------------

* Removed support for old technical platforms (e.g. J2EE 1.4), replaced by support for new technical platforms
* Removed features and APIs marked as **outdated** deprecated in previous version(s), see below
* Changed URL patterns (with some backward compatibility however) and removed the legacy web services gateway webapp (replaced by the `/api` endpoint introduced in version 3.1), seebeloww
* Removed naming flexibility for grant hooks shared script (the previously allowed `GRANTHOOKS` name is now forbidden, it **must** now be `GrantHooks`)

> **Warning**: The old legacy JSPs pages are scheduled to be removed in release **P24**. Seebeloww to refactor any hard-coded URL involving these JSPs.

> **Warning**: The legacy UI is scheduled to be fully removed in release **P25**, you now need to consider refactoring **all** code/components dedicated to this legacy UI

Outdated implementation patterns to refactor
--------------------------------------------

These implementation patterns that used to be possible, **but already strongly discouraged**, in previous versions **must be** now refactored:

* Any usage of any hard coded URLs (seebeloww) in your code or configured items (e.g. shortcuts, UI zones, actions, ...) **must** be avoided,
  you must use the `HTMLTool` methods instead (directly in your code or using `[EXPR:(...)] in configuration items).
* Specific JSP pages are not supported anymore. You **must** now rewrite them as external objects
* As for any previous version making DOM structure assumptions in generic web pages (e.g. using custom low-level JavaScript/jQuery statements to dynamically change
  inputs, buttons, etc... using their generated DOM Id) is a very bad approach, you should use the client JavaScript APIs instead. If you have any legacy code making
  such assumptions you **must** refactor it as many web components have been completely refactored at DOM level.
* Legacy synchronous JavaScript services have been removed (these functions used to be defined in the `service.js` script and were only versions 2.x's backward-compatibility
  synchronous wrappers of `Simplicite.Ajax`, this script does not exist anymore)
* Adding custom global styles using the static `application.css` file is not possible anymore, this is replaced by the disposition-level `STYLES` resource
* Adding custom global JS scripts using the static `application.js` file is not possible, this is replaced by the disposition-level `SCRIPT` resource
* When using external authentication (e.g. OAuth2) the user data is now updated automatically, you don't need to handle the `SESSION_INFO` parameter anymore
  (except if you have something more specific to do with it) 
* The deprecated `$` client JavaScript function in legacy UI, `$` is now the usual alias to `jQuery` (the old `$j` alias is kept for compatibility but it is recomended to change it to `$`),
  if you have some legacy JavaScript code using the deprecated `$` instead of the `$` jQuery alias you **must** refactor them (e.g. `$("myid")` must be rewritten as `$("#myid")[0]`)
* In scripted expressions, the deprecated syntax `[<field name>]` is not longer supported, you **must** use the syntax `[VALUE:<field name>]` instead
* The legacy UI platform components (e.g. `ObjectList`) have been removed from **default** packages imported in Rhino scripts (if you use some of them you need to add an explicit
  package import statement `importPackage(Packages.com.simplicite.webapp)` or an individual class import statement (e.g. `importClass(Packages.com.simplicite.webapp.ObjectList`)

Deprecated implementation patterns
----------------------------------

These implementation patterns are to be considered **deprecated**, their usage is to be **avoided** (and any existing usage is to be refactored) as they **will be removed** in next version:

* Using any of the legacy JavaScript functions and variables not in the `Simplicite` namespace is strongly discouraged
* Developping custom pages/components with the legacy UI patterns: the responsive UI pattern for developping custom page/components is very different from the legacy UI patterns,
  the legacy UI will be removed in the future, so a refactoring of such custom components is **strongly encouraged**,
  see [this document](/lesson/docs/core/externalobject-code-examples#responsive) for details.

> **Warning**: The legacy UI is scheduled to be removed in release **P25**, you now need to consider refactoring **all** code/components dedicated to this legacy UI

<h2 id="urls">URL patterns</h2>

The version 4.0 includes a complete refactoring of the legacy UI URL patterns.

> **Note**: With the responsive UI manipulating URLs does not make sense anymore, you need to use the client-side UI APIs,
> see [this document](/lesson/docs/ui/responsive) for details.

### Prerequisites

If you are using traditional realm-based or JAAS authentication, make sure to update your `web.xml` accordingly to the one provided.

In particular make sure to have **both** `/ui/*` and `/jsp/*` as protected URL pattern in the `<security-constraint/>` bloc:

```xml
<url-pattern>/ui/*</url-pattern>
<url-pattern>/jsp/*</url-pattern>
```

And if you are using a form-based authentication make sure your `web.xml` has the following login page declaration in the `<login-config/>` bloc:

```xml
<form-login-page>/login</form-login-page>
<form-error-page>/login?error=true</form-error-page>
```

You will also need to make sure you have the following error mappings in your `web.xml`:

```xml
<error-page>
	<error-code>404</error-code>
	<location>/error?code=ERR_HTTP404&amp;status=404</location>
</error-page>

<error-page>
	<error-code>500</error-code>
	<location>/error?code=ERR_HTTP500&amp;status=500</location>
</error-page>
```

### Custom code impacts

If you are already using the `HTMLTool` methods (which you should), the changes are transparent.

If you have any hardcoded URL (which you should not), you **must** now use the `HTMLTool` methods instead.

### URL pattern changes

The changes are describedbeloww (the new URL patterns are given for information and **must not** be hardcored but designated using the available `HTMLTool` methods):

| Old URL pattern                                               | New URL pattern                         | `HTMLTool` method(s) to use    |
|---------------------------------------------------------------|-----------------------------------------|--------------------------------|
| /index.jsp                                                    | / or /main                              | `getPublicMainURL`             |
| /init.jsp                                                     | n/a (cf. `ServletTool` class)           | n/a                            |
| /logon.jsp                                                    | /signin or /login                       | `getLoginURL`                  |
| /logout.jsp                                                   | /signout or /logout                     | `getLogoutURL`                 |
| /PUB_work.jsp                                                 | /home                                   | `getPublicHomeURL`             |
| /PUB_content.jsp and /jsp/ALL_content.jsp                     | /content                                | `getStaticContentURL`          |
| /PUB_resource.jsp                                             | /resource                               | `getResourceURL` and variants  |
| /PUB_document.jsp                                             | /document or /dbdoc                     | `getPublicDocumentURL`         |
| /PUB_extobject.jsp?extobject=&lt;external object name&gt;     | /ext/&lt;external object name&gt;       | `getPublicExternalObjectURL`   |
| /PUB_zone.jsp                                                 | /zone                                   | n/a                            |
| /PUB_gcalendar.jsp                                            | /googlecalendar                         | `getGoogleCalendarURL`         |
| /PUB_gmap.jsp                                                 | /googlemap                              | `getGoogleMapURL`              |
| /PUB_agenda.jsp                                               | n/a (removed)                           | n/a                            |
| /PUB_print.jsp                                                | n/a (removed)                           | n/a                            |
| /PUB_data.jsp                                                 | /raw/data                               | n/a                            |
| /PUB_json_app.jsp                                             | /json/app                               | n/a                            |
| /PUB_json_obj.jsp                                             | /json/obj                               | n/a                            |
| /PUB_json_pcs.jsp                                             | /json/pcs                               | n/a                            |
| /PUB_error.jsp and /jsp/SYS_error.jsp                         | /error                                  | `getErrorURL`                  |
| /GDG_logon.jsp                                                | /connect                                | n/a                            |
| /GDG_gmap.jsp                                                 | /map                                    | `getMapURL`                    |
| /GDG_news.jsp                                                 | /news                                   | `getPublicNewsURL`             |
| /GDG_rss.jsp                                                  | /rss                                    | `getRSSURL`                    |
| /GDG_media.jsp                                                | /media                                  | `getMediaURL`                  |
| /webContent.jsp                                               | /web/                                   | n/a                            |
| /webContentPage.jsp                                           | /web/page                               | n/a                            |
| /rss.jsp                                                      | /web/rss                                | n/a                            |
| /io.jsp                                                       | /io                                     | n/a                            |
| /health.jsp                                                   | /health                                 | n/a                            |
| /blank.html                                                   | /blank                                  | n/a                            |
| /scripts/core.js (static)                                     | /scripts/core.js (dynamic)              | n/a                            |
| /scripts/common.js.jsp                                        | /scripts/common.js                      | n/a                            |
| /images/main.css.jsp                                          | /images/main.css                        | n/a                            |
| /images/work.css.jsp                                          | /images/work.css                        | n/a                            |
| /jsp/index.jsp                                                | /ui/ or /ui/main                        | `getMainURL`                   |
| /jsp/init.jsp                                                 | n/a (cf. `ServletTool` class)           | n/a                            |
| /jsp/index.jsp?_header=true                                   | /ui/header                              | `getHeaderURL`                 |
| /jsp/index.jsp?_shortcut=true                                 | /ui/shortcuts                           | `getShortcutsURL`              |
| /jsp/SYS_mdlchooser.jsp                                       | /ui/modulechooser                       | `getModuleChooserURL`          |
| /jsp/SYS_subhead.jsp                                          | /ui/subhead                             | `getSubHeaderURL`              |
| /jsp/index.jsp?_footer=true                                   | /ui/footer                              | `getFooterURL`                 |
| /jsp/SYS_scope.jsp                                            | /ui/scopes                              | `gestScopesURL`                |
| /jsp/SYS_work.jsp                                             | /ui/home                                | `getHomeURL`                   |
| /jsp/SYS_work.jsp?view=&lt;view name&gt;                      | /ui/home?view=&lt;view name&gt;         | `getViewURL`                   |
| n/a                                                           | /ui/menu                                | `getMenuURL`                   |
| /jsp/index.jsp?_extra=true                                    | /ui/extra                               | `getExtraURL`                  |
| /jsp/SYS_extrapref.jsp                                        | /ui/extrapreferences                    | `getExtraPreferencesURL`       |
| /jsp/ALL_view.jsp                                             | /ui/view                                | `getSimpleViewURL`             |
| /jsp/ALL_export.jsp                                           | /ui/importexport                        | `getImportExportURL`           |
| /jsp/ALL_doc_edit.jsp                                         | /ui/editor                              | `getEditorURL`                 |
| /jsp/ALL_index.jsp                                            | /ui/indexsearch                         | `getIndexSearchURL`            |
| /jsp/SYS_log.jsp                                              | /ui/logs                                | `getLogsURL`                   |
| /jsp/GDG_treeview.jsp                                         | /ui/treeview                            | `getTreeviewURL`               |
| /jsp/GDG_print.jsp                                            | n/a (removed)                           | n/a                            |
| /jsp/GDG_chat.jsp                                             | n/a (now an external object)            | n/a                            |
| /jsp/patch.jsp                                                | /ui/undoredo                            | `getUndoRedoURL`               |
| /jsp/GDG_news.jsp                                             | /ui/news                                | `getNewsURL`                   |
| /jsp/SYS_zone.jsp                                             | /ui/zone                                | n/a                            |
| /jsp/SYS_about.jsp                                            | /ui/about                               | n/a                            |
| /jsp/SYS_calculator.jsp                                       | /ui/caclulator                          | n/a                            |
| /jsp/ALL_docblob.jsp                                          | /ui/document                            | `getDocumentURL`               |
| /jsp/ALL_extobject.jsp?extobject=&lt;external object name&gt; | /ui/ext/&lt;external object name&gt;    | `getExternalObjectURL`         |
| /jsp/ALL_search.jsp?object=&lt;object name&gt;                | /ui/obj/search/&lt;object name&gt;      | `getSearchURL`                 |
| /jsp/ALL_list.jsp?object=&lt;object name&gt;                  | /ui/obj/list/&lt;object name&gt;        | `getListURL`                   |
| /jsp/ALL_form.jsp?object=&lt;object name&gt;                  | /ui/obj/form/&lt;object name&gt;        | `getFormURL`                   |
| /jsp/ALL_panel.jsp?object=&lt;object name&gt;                 | /ui/obj/panel/&lt;object name&gt;       | `getPanelURL`                  |
| /jsp/ALL_select.jsp?object=&lt;object name&gt;&amp;type=R     | /ui/obj/reference/&lt;object name&gt;   | `getReferenceSelectURL`        |
| /jsp/ALL_select.jsp?object=&lt;object name&gt;&amp;type=O     | /ui/obj/objectref/&lt;object name&gt;   | `getObjectRefSelectURL`        |
| /jsp/ALL_select.jsp?object=&lt;object name&gt;&amp;type=M     | /ui/obj/datamap/&lt;object name&gt;     | `getDatamapSelectURL`          |
| /jsp/ALL_help.jsp?object=&lt;object name&gt;                  | /ui/obj/help/&lt;object name&gt;        | `getHelpURL`                   |
| /jsp/ALL_update.jsp?object=&lt;object name&gt;                | /ui/obj/updateall/&lt;object name&gt;   | `getUpdateAllURL`              |
| /jsp/ALL_merge.jsp?object=&lt;object name&gt;                 | /ui/obj/merge/&lt;object name&gt;       | `getMergeURL`                  |
| /jsp/ALL_chart.jsp?object=&lt;object name&gt;                 | /ui/obj/chart/&lt;object name&gt;       | `getChartURL`                  |
| /jsp/ALL_crosstab.jsp?object=&lt;object name&gt;              | /ui/obj/crosstab/&lt;object name&gt;    | `getCrosstabURL`               |
| /jsp/ALL_graph.jsp?object=&lt;object name&gt;                 | /ui/obj/graph/&lt;object name&gt;       | `getGraphURL`                  |
| /jsp/ALL_print.jsp?object=&lt;object name&gt;                 | /ui/obj/print/&lt;object name&gt;       | `getPrintTemplateURL`          |
| /jsp/ALL_agenda.jsp?object=&lt;object name&gt;                | /ui/obj/agenda/&lt;object name&gt;      | `getAgendaURL`                 |
| /jsp/ALL_placemap.jsp?object=&lt;object name&gt;              | /ui/obj/placemap/&lt;object name&gt;    | `getPlaceMapURL`               |
| /jsp/ALL_timesheet.jsp?object=&lt;object name&gt;             | /ui/obj/timesheet/&lt;object name&gt;   | `getTimesheetURL`              |
| /jsp/SYS_template.jsp?object=&lt;object name&gt;              | /ui/obj/formpreview/&lt;object name&gt; | `getFormPreviewURL`            |
| n/a                                                           | /ui/obj/docpreview/&lt;object name&gt;  | `getDocPreviewURL`             |
| /jsp/SYS_objpref.jsp?object=&lt;object name&gt;               | /ui/obj/preferences/&lt;object name&gt; | `getObjectPreferencesURL`      |
| /jsp/PCS_start.jsp?pcs=&lt;workflow name&gt;                  | /ui/pcs/start/&lt;workflow name&gt;     | `getProcessStartURL`           |
| /jsp/PCS_search.jsp?pcs=&lt;workflow name&gt;                 | /ui/pcs/search/&lt;workflow name&gt;    | `getProcessURL`                |
| /jsp/PCS_list.jsp?pcs=&lt;workflow name&gt;                   | /ui/pcs/list/&lt;workflow name&gt;      | `getProcessURL`                |
| /jsp/PCS_form.jsp?pcs=&lt;workflow name&gt;                   | /ui/pcs/form/&lt;workflow name&gt;      | `getProcessURL`                |
| /jsp/PCS_help.jsp?pcs=&lt;workflow name&gt;                   | /ui/pcs/help/&lt;workflow name&gt;      | `getProcessURL`                |
| /jsp/SYS_json.jsp                                             | /ui/json/app                            | n/a                            |
| /jsp/ALL_json.jsp                                             | /ui/json/obj                            | n/a                            |
| /jsp/PCS_json.jsp                                             | /ui/json/pcs                            | n/a                            |
| /jsp/ALL_soap.jsp                                             | /ui/soap                                | n/a                            |
| /jsp/ALL_wsdl.jsp                                             | /ui/soap?wsdl=true                      | n/a                            |
| /jsp/ALL_xsd.jsp                                              | /ui/soap?xsd=true                       | n/a                            |
| Legacy webservices gateway webapp URLs                        | /api/\*                                 | n/a                            |

> **Note**: Some of theses changes were already done in previous versions (typically 3.1 and 3.2) and the main `HTMLTool` methods already exists
> in these previous versions. You can start anticipating these changes even if you are using a previous version.

> **Note**: Any relative reference to a old JSP page located in the `/jsp/` folder **must** now be done using an absolute reference (e.g. `/jsp/SYS_work.jsp`)
> but, better, should be refactored using the `HTMLTool` class methods decribed above

Dispositions
------------

### Responsive UI

In then version 4.0 responsive UI the former "disposition" concept has been split into 2 distinct concepts:

- `Disposition`: that now corresponds **only** to the page **layout** (and which uses dedicated HTML resources for that)
- `Theme`: that corresponds to the page's **styles** (CSS, logos, ...)

In the responsive UI it it thus absolutely not required to create a custom disposition if you just want to change some styles.
Doing this, as you would have done in versions 3.x, is an anti-pattern that **must** be avoided (unless you actually want to change the page layout).

### Legacy UI

The version 4.0 legacy UI pages structures and CSS styles have been deeply refactored, if you had a 3.x custom disposition
with custom styles chances are it will no render the same in 4.0. You **should** reset to `default` disposition and create
new CSS styles overrides.

> **Warning**: the legacy UI is scheduled to be removed in release **P25**, you now need to consider refactoring **all** code/components dedicated to this legacy UI

Upgrade procedure
-----------------

### Prerequisites

The update **MUST** be done on an up-to-date 3.2 version.

This means that **all maintenance releases patches** of version 3.2 have been sucessfully applied and verified.

To avoid issues the following system parameters must be reset to their suitable values for 4.0:

- `DISPOSITION` **must** be set to `default`
- `DISPOSITION_RESOURCES` **must** be set to `yes`
- `PUBLIC_PAGES` **must** be set to `no`
- `SHOW_MOBILE` **must** be set to either `yes` (once migrated you will be able to change it to `default`, `always` or `no` if you want **but not before migration**)

### Procedure

The following upgrade procedure is only applicable to instances managed on an instance manager (SIM), it **MUST** be done using command line.

1. Connect on your instance's account: `sudo su - myinstance`
2. Make a final update of your instance: `sim upgrade`
3. Make a backup of your instance: `sim save`
4. Make a complete backup of the instance's `tomcat` folder (in order to be able to revert manually to previous version if needed): `cp -r tomcat tomcat-fefore.version.upgrade`
5. Change your instance's version in the manager's database: `sqlite3 /var/simplicite/data/apps.db "update instances set version = '4.0' where name = 'myinstance'"`
6. Apply **all** database-level patches: `sim ant-upgrade-configuration-db-only`
7. Stop your instance: `sim stop`
8. Manually check and update if needed your instances's deployment descriptors `META-INF/context.xml` and `WEB-INF/web.xml` by comparing them to the default ones of version 4.0 (that you can find in `/var/simplicite/template-4.0`)
9. Upgrade tour instance's webapp: `sim ant-upgrade-war`
10. Restart your instance: `sim start`
11. Remove the patch level property file `rm tomcat/webapps/ROOT/WEB-INF/patches/V4.0/patches.properties`
12. Apply **all** configuration-level patches: `sim ant-upgrade-configuration-xml-only`

It is recommended to do a manual global clear cache using the generic web UI at the end of the process.
