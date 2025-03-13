---
sidebar_position: 30
title: Upgrading
---

Upgrade from 3.0.MAINTENANCE to 3.1.MAINTENANCE
===============================================

### Backup the platform and DB

- Save the Java project
- Save the deployed war / ear / datasource
- Save the dbdoc file system containing document
- Save the database

### Change project libs

1. Copy all platform libraries and tools
	
```plaintext
/tools/ant-contrib-1.0b3.jar
/platform/**
```

2. Removed libs

```plaintext
platform/lib/lucene-analyzers-3.3.0.jar
platform/lib/lucene-core-3.3.0.jar
```

3. Added libs

```plaintext
platform/lib/js-engine.jar
platform/lib/js.jar
```

### Upgrade specific code

- Pure Java : see the [JavaDoc](https://platform.simplicite.io/3.1/javadoc/) to update deprecated APIs / compile your project
- Java scripted : nothing to do yet, deprecated calls will appear in logs during runtime

### Change build files

1. Copy all build and property files:

```plaintext
/build-core.xml 
/*.properties
```

2. Set the property files with server and DB configuration

```plaintext
build.property
project.property
db-<database>.property
server-<engine>.property
```

### Install

1. First install patches to alter DB and add new XML components

```plaintext
ant applysystempatches
```

Read server logs and re-apply system patches when error occurs.
**Do not redeploy** your application (with the new runtime) until database patches are not well imported.

2. Undeploy the application, stop the server and clear cache directories (simplicite and server)  
With tomcat server :  

```plaintext
ant undeploy
sudo systemctl stop tomcat
rm -rf <tomcat_root>/data/simplicite/<project_name>/cache
rm -rf <tomcat_root>/work
rm -rf <tomcat_root>/temp
```

3. Finally redeploy the application with the new runtime  
With tomcat server :  

```plaintext
sudo systemctl start tomcat
ant deploy
```

### Test

- Test UI access
- clear all caches thru UI

Note:

- The serialized cache is not used anymore.
- To clear the cache you can also restart the JVM
- The cache is now faster and in memory
