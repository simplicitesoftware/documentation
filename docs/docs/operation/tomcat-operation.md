---
sidebar_position: 100
title: Tomcat operation
---

Operation guidelines
====================

This document applies to a legacy deployment on a Linux OS of the RedHat family Linux distributions (RedHat, CentOS, Fedora, RockyLinux, AlmaLinux, ...) using the Tomcat&reg; application server.
It can easily be transposed to other technical platforms.

> **Note**: Some pieces of information are also applicable - unless otherwise specified - when using our **Docker images**.
> For more details on Docker images-based deployments please refer to [this document](/docs/operation/docker) 

Services restarting
-------------------

> **Note**: this chapter is not applicable when using Docker our images.

When required the involved services may need to be stopped in the following order:

- Stop the **Tomcat** service: `/etc/init.d/tomcat stop`
- Stop the **web server** service (if any used as reverse-proxy):
	* Apache: `systemctl stop httpd.service`
	* NGINX: `systemctl stop nginx.service`
- Stop the database service (not always required, never required when using HSQLDB):
	- **MySQL**: `systemctl stop mysqld.service`
	- **PostgreSQL**: `systemctl stop postgresql.service`

Then clean up the Tomcat work folders (and optionally the technical logs folder):

	rm -fr $TOMCAT_ROOT/work/Catalina $TOMCAT_ROOT/conf/Catalina
	rm -fr $TOMCAT_ROOT/logs/*

Then the services are to be restarted in the following order:

- Start the database service (if stopped):
	- **MySQL**: `systemctl start mysqld.service`
	- **PostgreSQL**: `systemctl start mysqld.service`
- Start the **web server** service (if any used as reverse-proxy):
	* Apache : `systemctl start httpd.service`
	* NGINX: `systemctl start nginx.service`
- Start the **Tomcat** service: `/etc/init.d/tomcat start`

Logs reviewing
--------------

To help with diagnostics, several kind of logs can be usefull:

### Web console logs

In some cases, the web console logs can be usefull. Check your browser's documentation to figure out how to open the web console. Make sure the logs are persisted when you change page, and reproduce the issue. When connected as designer, the Simplicité logs will be displayed in the web console as well.

### HTTP Archive Logs

The http archive file (.har) contains all the HTTP requests made by the application and their results. Check your browser's documentation to figure out how to generate a .har file. Make sure the logs are persisted when you change page, and reproduce the issue.

### Tomcat logs

The Tomcat server technical logs are located in `$TOMCAT_ROOT/logs`.

The content of these logs is managed at Tomcat configuration level, please refer to Tomcat documentation for details (e.g. [this document](https://tomcat.apache.org/tomcat-9.0-doc/logging.html) for Tomcat 9)

### Simplicité logs

The application-specific technical logs are located in `$TOMCAT_ROOT/webapps/ROOT/WEB-INF/log` (template-based packaging) or in custom location depending on your installation.

The content of these logs is managed by **Log4J** and can be customized by overriding the default `log4j2.xml` file provided in `$TOMCAT_ROOT/webapps/ROOT/WEB-INF/classes`.

For each logging event, an event **code** is associated, and depending on the configuration in Operation / Events, the message will be either:
- logged via the Log4J logger
- logged in the database (`m_log` table), and visible in _Operation > Logs_
- logged in both the logger and the  database
- not logged (lost)

- The `DEBUG` log level is convenient for investigating an issue but **must not** be set by default.
- The applicative `ERROR` logs (containing the `SIMPLICITE` keyword) usually correspond to normal application
errors (the only error logs that requires investigation are the one that correspond to a database problem)
- The other error logs needs further investigation in any case.
- Any log at level `FATAL` generally requires services restart with prior technical investigation
(typically if the error correspond to a memory or file system issue requires actions at OS level)

Housekeeping
------------

### Database logs

Some application log events are recording a significant amount of logs entries into the `m_log` table of the default database.

**Make sure to purge this table on a regular basis:**

- through the interface : _Operation_ &gt; _Logs_ &gt; and use the _Delete list_ list action
- through the I/O `PURGELOGS` service (accessible through the `/io` endpoint, cf [IO command-line doc](/docs/integration/webservices/io-commandline))

### Import supervisions

Any file import submitted to an application results in a supervision record.

Each of these supervision records includes several attached documents:

- The original file submitted
- The potential "translated" file (when using an adapter)
- The processing log of the import
- The potential rejected/error file

They are thus consuming a significant amount of storage.

**Make sure to purge these records on a regulrar basis:**

- through the user interface : _Operation_ &gt; _Import supervisor_ and use the _Purge_ list action
- through the I/O `PURGESUPERVISION` service (accessible through the I/O (`/io`) endpoint or the API (`/api`) endpoint, cf [IO command-line doc](/docs/integration/webservices/io-commandline))

### Asynchronous jobs records

Any job launched asynchronously by the internal crontable result in a job supervision record (with a link to associated database logs).

**Make sure to purge these records on a regulrar basis:**

- through the user interface : _Operation_ &gt; _Asynchronous jobs_ and use the _Delete jobs_ list action
- through the I/O `PURGEJOBS` service (accessible through the I/O (`/io`) endpoint or the API (`/api`) endpoint, cf [IO command-line doc](/docs/integration/webservices/io-commandline))

### Temporary and exported files

In your code you may use temporary or export directories/files that you may not delete properly.

**Make sure to empty these directories/files on a regular basis:**

- through the I/O `PURGETEMPFILES` service and the `PURGEEXPORTS` service
  (accessible through the I/O (`/io`) endpoint or the API (`/api`) endpoint, cf [IO command-line doc](/docs/integration/webservices/io-commandline))
- by manual deletion directly on the file system

### Recycle bin

Removed attached document are not physically deleted, they are simply moved to a recycle bin directory.

**Make sure to empty this directory on a regular basis:**

- through the I/O `PURGERECYCLEBIN` service (accessible through the I/O (`/io`) endpoint or the API (`/api`) endpoint, cf [IO command-line doc](/docs/integration/webservices/io-commandline))
- by manual deletion directly on the file system

### Out of sync documents

Some document processing in your code may result in inconsitencies between the document table and the actual documents stored.

**Make sure to resynchronise documents on a regular basis:**

- through the user interface : _Document_ &gt; _Synchronize documents_ list action
- through the I/O `SYNCDOCS` service (accessible through the I/O (`/io`) endpoint or the API (`/api`) endpoint, cf [IO command-line doc](/docs/integration/webservices/io-commandline))

Save and restore
----------------

For a given application a comprehensive save consist in:

- Saving the database content using an usual database dump tool: `mysqldump`for MySQL or `pgdump`for postgreSQL
- Saving the documents data directory content located in `$TOMCAT_ROOT/data/simplicite/<my application>/dbdoc` (classical packaging) or `$TOMCAT_ROOT/webapps/ROOT/WEB-INF/dbdoc` (instances packaging) or in a custom location depending on your installation) using an usual archive tool: `zip` or `tar`

These two operations needs to be done exactly **at the same time** to avoid any data inconsistencies.

To restore the application, the database dump and the archive must be restored in their initial locations.

> **Note**: as of version 3.2 the documents can be stored in the database as BLOBs, in this case saving the database is sufficient (no need to save the document data directory)

Monitoring
----------

All technical components may need to be monitored (especially Tomcat and the database engine) using any convenient tool.

Application-level tools are available (from the UI with an operator profile or from command line) to do basic technical and applicative monitoring. Typically the health check or ping page/service can be called and parsed on a regular basis:
```shell
curl [-b cookies.txt -c cookies.txt] "<base URL>/<health[?format=json]|ping>"
```
> **Note**: the `-b` and `-c` argument are used to reuse the same Tomcat session if possible, especially for version 3.x

The typical output for the ping is:

```json
{ "status": "OK" }
```

The typical output for the health check (in JSON format) is:

```json
[Platform]
Status=OK
Version=<version, e.g. 5.2.19>
BuiltOn=<build date, e.g. 2022-10-14 15:41>
Git=<Git revision, e.g. 5.2/db1244ab262a9dc53ec12746756ae0be43a2ff04>
Encoding=UTF-8
EndpointIP=127.0.0.1
EndpointURL=<instance internal URL>
TimeZone=Europe/Paris
SystemDate=<system date>

[Application]
ApplicationVersion=<application title>
ContextPath=
ContextURL=<instance external URL>
ActiveSessions=1
TotalUsers=10
EnabledUsers=5
LastLoginDate=2022-10-14 21:30:01

[Server]
ServerInfo=Apache Tomcat/9.0.68
ServerType=WEB
ServerActiveSessions=1
ServerSessionTimeout=30

[OS]
Name=Linux
Architecture=amd64
Version=3.10.0-1160.71.1.el7.x86_64
SystemEncoding=UTF-8

[Disk]
DiskFree=32481
DiskUsable=30372
DiskTotal=50286

[JavaVM]
Version=17.0.1
Vendor=Eclipse Adoptium
VMName=OpenJDK 64-Bit Server VM
VMVersion=17.0.1+12
ScriptEngine=rhino
ScriptEngineVersion=Rhino 1.7.13 2020 09 02
HeapFree=192302
HeapSize=450560
HeapMaxSize=524288
TotalFreeSize=266030

[Cache]
ObjectCache=51
ObjectCacheMax=10000
ObjectCacheRatio=0
ProcessCache=0
ProcessCacheMax=10000
ProcessCacheRatio=0
APIGrantCache=0
APIGrantCacheMax=1000
APIGrantRatio=0

[Database]
Vendor=1
ProductName=HSQL Database Engine
ProductVersion=2.6.1
DriverName=HSQL Database Engine Driver
DriverVersion=2.6.1
DBDate=2022-10-17 12:12:31.224000+2:00
DBDateOffset=0
DBPatchLevel=<database Simplicité pach level, e.g. 5;P02;12f7b8670b5a2e056e5d3f191a3b73f3>
UsingBLOBs=false

[Healthcheck]
Date=2022-10-17 12:12:31
ElapsedTime=230
```

If both page/service does not return response or returns a HTTP status different from `200` or if the response value for `status` is not `OK`, something needs to be investigated/fixed.

System updates
--------------

> **Note**: this chapter is not applicable when using our Docker images. When using such images the system is always up-to-date in the latest images.

System updates **must** be applied regularly, especially in case of critical security updates.

On Linux CentOS, you can check if there are pending system upgrades packages by:

	sudo dnfcheck-update

You can then apply the updates by:

	sudo dnf update

You should then clean up update packages by:

	sudo dnf clean all

If there is an **JVM** update you must stop the running Tomcat instances prior to the update and restart them after the update.

If there are other running services impacted by the updates (e.g. database service), you must restart the services.

If there is a **kernel** update you must reboot the server after the update.

To clean up old kernels you can do:

	sudo dnf install yum-utils
	sudo package-cleanup --oldkernels --count=2

Tomcat updates
--------------

> **Note**: this chapter is not applicable when using our Docker images. When using such images Tomcat is always up-to-date in the latest images.

The Tomcat server **must** be updated regularly, depending on the way it has been installed the processus may vary.

Platform updates
----------------

> **Note**: this chapter is not applicable when using our Docker images. When using such images the Simplicité platform is always up-to-date in the latest images.

The Simplicité&reg; platform **must** be updated regularly, at least on its maintenance branch (see [versions](/versions/versioning.md)),
depending on the way it has been installed the processus may vary.
