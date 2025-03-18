---
sidebar_position: 20
title: Upgrading
---

Upgrade from 2.6.1.MAINTENANCE to 2.6.2.MAINTENANCE
===================================================

Introduction
------------

The upgrade from version `2.6.1.MAINTENANCE` to `2.6.2.MAINTENANCE` requires some manual packaging changes.

As a matter of fact some very significant changes have been done on the packaging
(allowing direct support for target specific parameters, simplifying the usage of other
application servers, ...) and on the way standard Java clients are called
(in particular using standard ANT tasks).

The consequence is that the upgrades requires to update manually all existing
`*.properties` and `build*.xml` files (plus some other configuration files to be added or moved).

Some significant changes are also required among the third party libs to reflect new lib organisation
in the application package (and allowing finer features selection).

As for any version upgrade the model for your project package upgrade is the default setup package.

Files to add manually
---------------------

### Platform components

```plaintext
sql/V2.6.2/*
xml/V2.6.2/*
patches/V2.6.2/*
lib/*Simplicite-2.6.2.jar
doc/javadocSimplicite-2.6.2.zip
```

NB1 : The `MAINTENANCE-02-Misc` patch includes a rebuild of all platform indexes, depending on
your particular configuration and the specific indexes that you may have added this rebuild
procedure must be reviewed and adapted to your case.

NB2 : The new `dbdocSimplicite-2.6.2.jar` platform lib includes the default `dbdoc` folder.
Only project-specifc elements are now to be left in the project's `dbdoc` folder.

### Added or moved third party libs

```plaintext
lib/poi-3.7.jar
lib/ext/bsh-core-2.0b4.jar
lib/ext/log4j.jar
lib/ext/stubWAS_2.5.5.jar
lib/libSimplicite-2.6.2.jar
lib/poi/dom4j-1.6.1.jar
lib/poi/geronimo-stax-api_1.0_spec-1.0.jar
lib/poi/poi-ooxml-3.7.jar
lib/poi/poi-ooxml-schemas-3.7.jar
lib/poi/poi-scratchpad-3.7.jar
lib/poi/xmlbeans-2.4.0.jar
```

### Packaging refactoring

```plaintext
project.properties
server-jboss.properties
server-jonas.properties
```

### Application server specific configuration files

```plaintext
conf/jboss/*
conf/jonas/*
```

NB: this includes templates for the standard `jndi.properties` file now used
by the client (which is dynamically generated into the conf folder).

### Other files

```plaintext
conf/java.policy
```

Files to remove manually
------------------------

### Platform components

```plaintext
sql/V2.6.1/*
xml/V2.6.1/*
patches/V2.6.1/*
lib/*Simplicite-2.6.1.jar
doc/javadocSimplicite-2.6.1.zip
```

NB : It is also highly recommended to remove all non default files in the
project's `dbdoc` folder. Only added or customised files are to be left in this folder.

### Removed or moved third party libs

```plaintext
lib/axis-ant.jar
lib/axis.jar
lib/bsh-core-2.0b4.jar
lib/stubWAS_2.5.5.jar
lib/tika/dom4j-1.6.1.jar
lib/tika/geronimo-stax-api_1.0_spec-1.0.jar
lib/tika/ooxml-schemas-1.0.jar
lib/tika/poi-3.5-beta6-20090622.jar
lib/tika/poi-ooxml-3.5-beta6-20090622.jar
lib/tika/poi-scratchpad-3.5-beta6-20090622.jar
lib/tika/xmlbeans-2.4.0.jar
```

### Application server specific configuration files

```plaintext
conf/<database vendor>-ds.xml
```

Files to update manually
------------------------

### Packaging refactoring

```plaintext
build-app.xml
build-core.properties
build-core.xml
build.properties
build.readme
build.xml
db-hsqldb.properties
db-oracle.properties
```

### Other files

```plaintext
.classpath
```

### Overridden J2EE descriptors

If your project includes overridden J2EE descriptors you may want to move
them into appropriate sub folders reflecting the new file organisation in
corresponding platform libs.

Others
------

### Deprecated APIs

As for any version, it is highly recommended that you change all calls to
deprecated APIs to the recommended corresponding new APIs.

Among these, it is **highly recommended** to replace all your business object `load`
method overrides by a `postLoad` hook implementation.

Typical `load` override used to look like this:

```java
@Override
public void load(Grant grant) {
	super.load(grant);
	// my specifc code
	(...)
}
```

This should now be refactored to:

```java
@Override
public void postLoad() {
	super.postLoad();
	// my specifc code
	(...)
}
```

### Project target

Legacy property `simplicite.license` is now replaced by a more general `project.target` property
(to be set in the new project.properties file).

All properties files can have partial overrides in a corresponding target-specific property file.

```plaintext
build-core.properties
build-core-<target>.properties

build-core.properties
build-core-<target>.properties

db-<database vendor>.properties
db-<database vendor>-<target>.properties

server-<server name>.properties
server-<server name>-<target>.properties
```

NB: it is not required to override all properties in target properties files, only the one that differs from default ones.

### Disposition specific components

Favicon and mobile CSS and header are now disposition-specifc, if you have such specifc components you should consider moving them 

```plaintext
web/images/image/favicon.ico to web/images/image/<disposition>/favicon.ico
web/images/image/header_mobile.jpg to web/images/image/<disposition>/header_mobile.jpg

```
And you can now add a web/images/image/<disposition>/disposition_mobile.css

### Simplicit&eacute;&reg; XML schemas

You should consider adding references to the standard Simplcit&eacute;&reg; XSD schema to all your specific XML files

```xml
<?xml version="1.0" encoding="ISO-8859-1" ?>
<simplicite xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.simplicite.fr/base" xsi:schemaLocation="http://www.simplicite.fr/base http://www.simplicite.fr/schemas/base.xsd">
(...)
</simplicite>
```

### New features

As for any version, please refer to the release notes to check whether your specific code could not be replaced
or refactored by a usage of new standard platform features.

### Live system upgrade procedure

The default upgrade ANT task should be suitable for upgrading most running systems, however if you have highly
customized stuff in your project you should review and adapt its default behavior to meet your needs.

As for any upgrade, the upgrade procedure itself must be run without any active user session.

In the particular case of the JBoss application server it is recommended to stop the server,
cleanup its work and tmp folders (this can be acheived using the clearservercache ANT task) and
restart it (a cleanup of the Simplicit&eacute;&reg; cache dir may also a good idea, this can be acheived using the
clearcachedir ANT task).
