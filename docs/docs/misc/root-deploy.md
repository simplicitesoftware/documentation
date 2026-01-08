---
sidebar_position: 170
title: Root deploy
---

Deploy as root application
==========================

A Simplicité instance can be deployed as the root application on an application server.

> **Note**: This is the default with the cloud instance templates.

Tomcat
------

When using the Tomcat web container the root application is `webapps/ROOT`.

### Application name property

The `application.name` property `WEB-INF/classes/application.properties` must be changed to an empty value:

```text
application.name=
```

### License key

The license key context path must be `/` or `*`.

### Embedded work and dbdoc folders

When using &quot;exploded&quot; deployment  it is possible to embed the work and dbdoc folders in the `WEB-INF` folder.
This approach is, for instance required, when deployng on CloudFoundry.

To do so the default `dataDir` environment entry if defined in the `WEB-INF/web.xml` file must be changed to:

```xml
<env-entry>
	<env-entry-name>dataDir</env-entry-name>
	<env-entry-type>java.lang.String</env-entry-type>
	<env-entry-value>${catalina.base}/webapps/ROOT/WEB-INF</env-entry-value>
</env-entry>
```

This `dataDir` environment entry can also be defined in the `META-INF/context.xml`file, in this case the change is:

```xml
<Environment
	name="dataDir"
	value="${catalina.base}/webapps/ROOT/WEB-INF"
	type="java.lang.String"
	override="true"/>
```

Note: Alternatively the root data dir can be defined by a JVM argument `-Ddata.dir=...` when launching Tomcat or by setting a `DATA_DIR`environment variable.

And the log file location defined in the `WEB-INF/classes/log4j2.xml` file must also be changed to:

```xml
<appender name="SIMPLICITE-FILE" class="org.apache.log4j.DailyRollingFileAppender">
	<param name="File" value="${catalina.base}/webapps/ROOT/WEB-INF/log/simplicite.log"/>
	<param name="Append" value="false"/>
	<param name="Threshold" value="DEBUG"/>
	<param name="DatePattern" value="'.'yyyy-MM-dd"/>
	<layout class="org.apache.log4j.PatternLayout">
	<param name="ConversionPattern" value="%d %-5p [%c] %m%n"/>
	</layout>
</appender>
```

### Embedded HSQLDB folder

If using HSQLDB and &quot;exploded&quot; deployment, it is also possible to embed the database folder in the `WEB-INF` folder.

To do so the data source JDBC URL defined in the `META-INF/context.xml` file must be changed to:

```xml
<Resource
	type="javax.sql.DataSource"
	name="jdbc/simplicite"
	auth="Container"
	maxActive="100" maxIdle="30" maxWait="10000"
	username="sa" password=""
	driverClassName="org.hsqldb.jdbcDriver"
	url="jdbc:hsqldb:file:${catalina.base}/webapps/ROOT/WEB-INF/db/<database name>;shutdown=true"/>
```

The `<database name>` must match the name of the HSQLDB database (which is also the base file name of the HSQLDB files).
