---
sidebar_position: 10
title: Java project
---

Project package and ANT tasks
=============================

This document describes the typical Simplicité project package derived from the standard setup package.

Project package folders
-----------------------

The project package includes the following folders:

- `auth`: Specific authentication descriptors (e.g. JAAS or Realm) for specific authentication
- `bin`: Compiled specific Java classes
- `build`: Packaged EAR or WARs file (and delivery packages)
- `dbdoc`: **static** documents
- `ejb`: customized EJB descriptors (will override platform descriptors)
- `platform`: Platform libraries
	- `lib`: Third party libraries
- `META-INF`: customized JEE application descriptors (will override platform descriptors)
- `src`: specific Java code (configured scripts should now be preferred), in particular:
	- `com/simplicite/objects/<Module name>`: Objects specific Java sources (`<Object name>.java` for object name `<Object name>`):
	- `com/simplicite/workflows/<Module name>`: Workflows specific Java sources (`<Workflow name>.java` for workflow name `<Workflow name>`):
	- `com/simplicite/adapters/<Module name>` : Adapter Java sources (`<Adapter name>.java` for adapter name `<Adapter name>`)
- `web`: **static** web resources such as JSP, HTML pages, JavaScripts, CSS or JSPs (configured resources and external objects should now be preferred)
	- `WEB-INF`: customized webapp descriptors (will override platform descriptors)
- `ws`: **static** web services gateway resources
	- `WEB-INF`: customized webapp descriptors (will override platform descriptors)
- `xml`: Configuration items (e.g. modules as ZIP or XML files), reference and test data (e.g. as CSV)

Main ANT tasks
--------------

The main ANT tasks provided by the `build.xml` build file are the following:

- `baseinstall`: platorm installation only (no business application)
- `fullinstall`: Global installation (platform + business application) for production (no test data)
- `fullinstalldev`: Global installation (platform + business application) for development (including test data)
- `compile`: Specific Java code compilation (`clean` task removes all previously compiled files and `javadoc`generates Java documentation)
- `(un)deploy`: Application package (un)deployment (EAR for full JEE servers WARs for web containers only deployments)
- `(un)deploydatasource`: Database descriptor (un)deployment (included in `(un)deploy` for web containre only deployments)
- `clearcache`: Clears application cache
- `modulexmlimport`: configuration module file import
- `xmlimport`: XML file imports (e.g. configuration patches or business data)
- `csvimport`: CSV file imports (e.g. business data)
- `release`: Generation of a delivery package
- `applysystempatches`: apply current system patches

Upgrading
---------

At each maintenance release you must synchronize your project with the setup package of your Simplicité(R) version
(check and upgrade **all** properties files build files, libs, ...).

After this synchronization is done, the typical sequence for upgrading your instance is:

1. Make a **full backup** of your instance and of its data (database and documents)
2. Update the technical platform components (JVM, application server, RDBMS, ...) to their appropriate **up-to-date** versions (please refer to [this document](/docs/compatibility) for details on approriate components versions for your Simplicité version
3. Start your application server and apply system patches using `ant apply[current]systempatches`
4. Stop your application server and upgrade the application package using `ant deploy`
5. Restart your application server

This must be adapted to your particular context. Note that this typical sequence applies to the usual upgrades from one maintenance release to the next one.