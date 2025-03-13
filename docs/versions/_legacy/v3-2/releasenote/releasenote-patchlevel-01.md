---
sidebar_position: 110
title: Patch level 01
---

Version 3.2 patchlevel 01 release note
======================================

Changes
-------

### Mail service settings as system parameter

It is now possible to configure mail service using the `MAIL_SERVICE` system parameter, check [this document](/lesson/docs/misc/email-howto) for details.

_Note: this feature has been back ported to the 3.1 maintenance branch._

### Additional datasources as system parameters

When using Apache Tomcat, it is now possible to configure additional datasource using system parameters, check [this document](/lesson/docs/misc/datasources-howto) for details.

_Note: this feature has been back ported to the 3.1 maintenance branch._

### Added lib and helper class for handling EAN Barcodes

The open source Barcode4J has been included and an associated `com.simplicite.util.tools.BarcodeTool` helper class has been added.

_Note: this feature has been back ported to the 3.1 maintenance branch._

### Online JavaDoc and JSDoc

The JavaDoc and JSDoc buttons of the editor page are now on the [online platform resources](https://platform.simplicite.io).

If you still need local JavaDoc and JSDoc you can set the `JAVADOC_LOCATION` and `JSDOC_LOCATION` to a local URL or relative web path.

If you use default online JavaDoc you benefit from the direct class search feature which is available by clicking on the _JavaDoc_ button
on the script editor page when you have highlighted the name of the class you look for.

_Note: this feature has been back ported to the 3.1 maintenance branch._

### TIKA upgrade

Full libs upgrade to support PPTX indexation and fix some PDF issues :
- TIKA 1.8
- POI 3.12-beta1
- PDFbox 1.8.9

_Note: this feature has been back ported to the 3.1 maintenance branch._

### OAuth2 FranceConnect authentification

In the 3.1 version we added authentification by Google OAuth2 Google. In this new version we have integrated the french administration OAuth2 Authentification known as **FranceConnect**.

To do so, the system param OAUTH2_PROVIDER has to be set to `franceconnect`.

We also provide 2 new system params : 
* OAUTH2_FRONT_PAGE : Url of France Connect service to use after oauth2 login
* OAUTH2_LOGOUT_REDIRECT : Url to logout from FranceConnect provider

For more information, please see [OAuth2 configuration on Apache Tomcat&reg; documentation](/lesson/docs/authentication/tomcat-oauth2) documentation.

Fixes
-----

N/A