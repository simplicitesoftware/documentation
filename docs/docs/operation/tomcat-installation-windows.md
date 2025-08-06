---
sidebar_position: 80
title: Tomcat installation on Windows
---

Tomcat installation guidelines for Windows server
=================================================

> **Warning**: before choosing this "traditional" installation procedure you should consider other approaches such as using [Docker containers](/docs/operation/docker).

This document only gives only very **general guidelines**, not a detailed/precise procedure.

If needed refer to the [Linux installation document](/docs/operation/tomcat-installation-linux) for more details.

Databases
---------

Download and install the chosen up-to-date database engine server suitable for your target Simplicité m and suitable for your version of Windows
(see [this document](/docs/compatibility#databases) for databases compliance details):

- MySQL/MariaDB
- PostgreSQL
- SQLServer
- Oracle

There is nothing to do if you use an embedded HSQLDB.

JVM
---

Download and install an up to date Java VM Development Kit (or a Runtime Environment if you don't plan to do debugging) in the appropriate version
for your target Simplicité platform version and suitable for your version of Windows (see [this document](/docs/compatibility#java-vm) for JVM compliance details).

Register the `JAVA_HOME` environment variable as the path of your JVM Installation (e.g. `C:\Program Files\Java\jdk-x.y.z`) and add `%JAVA_HOME%\bin` to the system `PATH`.

Tomcat
------

Clone the pre-configured Tomcat package (which is just an out of the box Tomcat package with administration webapps removed, with some settings fine-tuned and with some additional jars in the `lib` folder) with appropriate credentials:
```shell
git clone https://<username>[:<password>]@platform.git.simplicite.io/tomcat.git
```
Make sure the `tomcat\temp` folder is present and writeable, this is **mandatory** for images thumbnails generation.

Then, make sure the `tomcat\logs` folder is present and writeable, this is **mandatory** for logging.

Register the `TOMCAT_HOME` environment variable as the path of your Tomcat Installation (e.g. `C:\Users\Administrator\tomcat`).

To start with, just change the plain HTTP Tomcat connector port number in `conf/server.xml` from `8080` to `80` and inhibit other connectors
(these other connectors are to be used in more complex situations such as mounting Tomcat behind a reverse proxy or make Tomcat handle SSL etc.
These cases requires additional installation/preparation/configuration steps that are not described here).

Install Tomcat as a service:
```
	cd tomcat\bin
	.\service.bat install
	.\tomcat9.exe //US//Tomcat9 ++JvmOptions -server;-Dserver.vendor=tomcat;-Dserver.version=9;-Dfile.encoding=UTF-8;-Dgit.basedir=C:\Users\Administrator\git;-Dplatform.autoupgrade=true --JvmMs 256 --JvmMx 1024 --Startup auto
```
Note that the `C:\Users\Administrator` base folder, and the above `256` / `1024` Mb values for allocated memory are just given as examples.
Adjust these to match your configuration.

> **Note**: If you don't install the above service make sure your Tomcat startup script defines at least the same JVM options as the one defined for the above service.

Adjust security level and firewall settings to publicly expose the Tomcat corrector's port(s) accordingly to your needs.

Simplicité
----------

Clone the Simplicité webapp instance template of your target platform version:
```
	git clone https://<username>[:<password>]@platform.git.simplicite.io/template-<version>.git
```
Where `<version>` is one of the available versions, e.g. `4.0`

> **Note**: as of version 4.0 there are several branches on the instance template,
> make sure to use **only** the **release** branch in production, see [this document](/versions/versioning.md) for details on versions and branches.
>
> We thus recommend that you only clone the **release** branch by adding `--single-branch --branch release` to the `git clone` instruction above.

### Initial database setup

This is **only** required for the **initial** installation.

Create the database **with UTF-8 encoding** and the database user **with appropriate rights** (create table, alter table, select/insert/update/delete).

Then load the database using the appropriate dump file provided in the instances template.
MySQL/MariaDB and PostgresQL dump files are available by default in the `app/WEB-INF/db` folder, for other databases please contact us to get an up-to-date dump.

> **Note**: This setup **not required** with an embedded HSQLDB database.

### Deploy webapp

Stop the Tomcat service.

Create or replace the webapp from the instance template : copy the `app` folder as the `tomcat/webapps/ROOT`.

Adjust the database connection pool settings accordingly to your database installation in `tomcat/webapps/ROOT/META-INF/context.xml`.

Start the Tomcat service.

Maintenance
-----------

### Simplicité upgrades

The Simplicité platform is regularly updated: the stable (release) versions receive mainly fixes and sometimes minor changes,
the other unstable versions receive fixes and potentially major changes.

To benefit from our support you **must** upgrade the deployed version of the platform **as soon as** the upgrades are made available.

### Base components upgrades

The base components such as the Java JVM and the Tomcat server are also regularly upgraded by their respective vendors.

The Simplicité platform is **only** validated and tested with up-to-date stable versions of these components (the ones that are shipped in our Docker images).
Our support is thus only available if you use these recommended up-to-date components.

- We thus highly recommend that you use and keep upgraded our pre-configured Tomcat package described above. We push the up-to-date version of Tomcat on it as soon as it is released.
- We also recommend that you maintain your JVM up-to-date on a very regular basis (Oracle issues a JVM major version every 6 months).
- And, of course, we recommend that you keep your Windows platform up-to-date.

### Security guidelines

Make sure to review our [security guidelines](/docs/security)
