---
sidebar_position: 20
title: Upgrading
---

Upgrade from 2.6.2.MAINTENANCE to 2.7.0.MAINTENANCE
===================================================

Introduction
------------

The upgrade from version `2.6.2.MAINTENANCE` to `2.7.0.MAINTENANCE` requires some manual repackaging steps.

Main change is that platform components are now provided as jar files (including core SQL files, core XML modules and system patches).

The only items that must be upgraded manually are `*.properties` and `build*.xml` files.

Some third party libs have also been upgraded/moved.

As for any version upgrade the template for your project package upgrade is the default setup package.

Files to add/remove/move manually
---------------------------------

### Files to add

```plaintext
platform/*Simplicite-2.7.0.jar
Files to remove :
lib/*Simplicite-2.6.2.jar
sql/V2.6.2
xml/V2.6.2
patches/V2.6.2
```

### Changed third party libs

The lib folder should now contain the following libs:

```plaintext
lib/commons-beanutils-1.6.1.jar
lib/commons-codec-1.3.jar
lib/commons-collections-3.1.jar
lib/commons-discovery-0.2.jar
lib/commons-fileupload-1.2.1.jar
lib/commons-httpclient-3.0-rc2.jar
lib/commons-io-1.4.jar
lib/commons-lang-2.4.jar
lib/commons-logging-1.1.1.jar
lib/commons-net-1.0.0-dev.jar
lib/ext/activation.jar
lib/ext/bsf.jar
lib/ext/bsh-core-2.0b4.jar
lib/ext/castor-0.9.5.2.jar
lib/ext/highlighter-dev.jar
lib/ext/httpunit.jar
lib/ext/ibmjsse.jar
lib/ext/jaxrpc.jar
lib/ext/jcalendar-1.3.2.jar
lib/ext/JimiProClasses.jar
lib/ext/junit-3.8.1.jar
lib/ext/log4j-1.2.16.jar
lib/ext/mail.jar
lib/ext/saaj.jar
lib/ext/wsdl4j-1.5.1.jar
lib/iText-2.1.7.jar
lib/iText-rtf-2.1.7.jar
lib/jawk.1_02.jar
lib/jcaptcha-1.0-all.jar
lib/jcommon-1.0.17.jar
lib/jfreechart-1.0.14.jar
lib/joc-v2.1.2-basic.jar
lib/lucene-analyzers-3.3.0.jar
lib/lucene-core-3.3.0.jar
lib/moyocore.jar
lib/poi/dom4j-1.6.1.jar
lib/poi/geronimo-stax-api_1.0_spec-1.0.jar
lib/poi/poi-3.8-beta4-20110826.jar
lib/poi/poi-ooxml-3.8-beta4-20110826.jar
lib/poi/poi-ooxml-schemas-3.8-beta4-20110826.jar
lib/poi/poi-scratchpad-3.8-beta4-20110826.jar
lib/poi/xmlbeans-2.4.0.jar
lib/quartz-1.6.0.jar
lib/tika/apache-mime4j-core-0.7.1.jar
lib/tika/apache-mime4j-dom-0.7.1.jar
lib/tika/asm-3.1.jar
lib/tika/bcmail-jdk15-146.jar
lib/tika/bcprov-jdk15-146.jar
lib/tika/boilerpipe-1.1.0.jar
lib/tika/commons-codec-1.5.jar
lib/tika/commons-compress-1.3.jar
lib/tika/fontbox-1.6.0.jar
lib/tika/jempbox-1.6.0.jar
lib/tika/metadata-extractor-2.4.0-beta-1.jar
lib/tika/pdfbox-1.6.0.jar
lib/tika/rome-0.9.jar
lib/tika/tagsoup-1.2.1.jar
lib/tika/tika-app-1.0.jar
```

### Overridden J2EE descriptors

If your project includes overridden J2EE descriptors you must upgrade them accordingly
to current platform descriptors.

Others
------

### Deprecated APIs

As for any version, it is highly recommended that you change all calls to deprecated APIs to the recommended corresponding new APIs.
In this version some deprecated APIs have been set to final in order to force refactoring.

### Changed packages

Significant changes have been made on `com.simplicite` packages. Alghout these changes are on internal packages
some of them may cause import errors (e.g. com.simplicite.util.GrantWeb which is usually referred in in specific
JSP pages that is now `com.simplicite.webapp.GrantWeb`).

### Final methods

Some APIs have been set to `final` in order to detect inappropriate overrides.

### New features

As for any version, please refer to the release notes to check whether your specific code could not be replaced or
refactored by a usage of new standard platform features.

### Live system upgrade procedure

The default upgrade ANT task should be suitable for upgrading most running systems, however if you have highly customized
stuff in your project you should review and adapt its default behavior to meet your needs.

As for any upgrade, the upgrade procedure itself must be run without any active user session.

In the particular case of the JBoss application server it is recommended to stop the server, cleanup its work and tmp folders
(this can be achieved using the clearservercache ANT task) and restart it (a cleanup of the Simplicité&reg; cache folder may also a good idea,
this can be achieved using the clearcachedir ANT task).