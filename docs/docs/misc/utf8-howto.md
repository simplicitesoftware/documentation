---
sidebar_position: 230
title: UTF-8 howto
---

UTF-8 encoding
==============

Starting with version **3.1**, Simplicité is using by default using the **UTF-8** encoding (previous versions were using by default the ISO-8859-1 encoding).

Depending on your installation, using UTF-8 may require some addition configurations described below.

If you experiment any character encoding issues, you **must** have misconfigured or forgotten something.

JVM
---

It is **required** to set the JVM default encoding to UTF-8.

The **most reliable way** to do it is by adding an explicit `-Dfile.encoding=UTF-8` to the JVM options.

:::note

On Linux it is also possible to set the `LANG` environment variable (e.g. `en_US.UTF-8`) either for the account running Tomcat level or,
preferably, globally.

:::

Application servers
-------------------

### Tomcat

For **Tomcat 6 and 7**, the connectors definitions in `conf/server.xml` needs to be updated to force UTF-8 for URI encoding:

```xml
<Connector URIEncoding="UTF-8" ... />
```

Starting with **Tomcat 8** this is the default, so you only need to change something if you **don't** use UTF-8.

<!--
### WildFly

**TO BE COMPLETED**
-->

Databases
---------

### HSQLDB

Nothing to do!

### MySQL

The default encoding of the database must be set to `utf8` and the default collation to `utf8_unicode_ci`

:::warning

You can use other language-specific unicode collations instead of the `utf8_unicode_ci` if needed
but if you use the `utf8_bin` collation, the columns search will be **case sensitive**

:::

This can be set as server's default in your MySQL config file:

```text
[mysqld]
(...)
collation_server=utf8_unicode_ci
character_set_server=utf8
(...)
```

:::note

When changing these values a database service restart is needed

:::

This can also be set at the database level by:

```sql
CREATE DATABASE <database name> DEFAULT CHARACTER SET utf8 [DEFAULT COLLATE utf8_unicode_ci];
```

This can be also done after creation by:

```sql
ALTER DATABASE <database name> DEFAULT CHARACTER SET utf8 [DEFAULT COLLATE utf8_unicode_ci];
```

In both case defining an explicit collation is not mandatory (the value above is the default value for `uft8` chraracter set).

:::note

For using modern characters such as emoticons, you must use `utf8mb4` character set instead of `uft8`

If the database was loaded before its character set is set to UTF-8 you **must** reload it or convert explicitly all tables (see below)

:::

When using the setup package, the `db-mysql.properties` must be adjusted for setting UTF-8 support in the JDBC URL of the datasource,
this means the JDBC URL must contains the `&amp;characterEncoding=utf8&amp;characterResultSets=utf8` options.

For Tomcat, this results in a datasource descriptor similar to this one:

```xml
<Resource
    name="jdbc/mysqlexample"
    type="javax.sql.DataSource"
    auth="Container"
    username="<username>"
    password="<password>"
    driverClassName="com.mysql.jdbc.Driver"
    url="jdbc:mysql://<host>:<port>/<database name>?autoReconnect=true&amp;characterEncoding=utf8&amp;characterResultSets=utf8"/>
```

To check current charset and collation of existing tables you can use:

```sql
SHOW TABLE STATUS LIKE '<table name>';
```

To convert existing tables to UTF-8 you can use:

```sql
ALTER TABLE <table name> CONVERT TO CHARACTER SET utf8 COLLATE utf8_unicode_ci;
```

### PostgreSQL

The database **must** be created with UTF-8 encoding:

```sql
create database simplicite encoding 'UTF8' lc_ctype 'en_US.UTF-8' lc_collate 'en_US.UTF-8' template <an UTF-8 database template name>;
```

:::note

If you have created a database using another encoding you must drop it and do it again

:::

No additional configuration is then need at the datasource descriptor level.

### Oracle

The unicode support must be present and installed for server. Nothing else is required.

### Microsoft SQLServer

No native UTF-8 support (unless using `nchar` and `nvarchar` types which is not the default).

> **Note**: this constraint does not seem applicable to SQLServer 2017+ on Linux

Custom code
-----------

### Java and server side scripts

Make sure that you use `Globals.getPlatformEncoding()` for designating the platform encoding (instead of hard-coded encoding name)
when you use APIs that have encoding argument(s).

:::note

You shouldn't be using such APIs unless you really need to do explicit encoding conversions (e.g. from a ISO-8859-1 encoded file in an adapter).

:::

### Custom JSP pages and servlets

If you have custom JSP pages (you shouldn't if you use recent versions of the platform for which external objects **must**
be preferred to custom JSP pages and servlets). You need to adjust the following directive if present:

```jsp
<%@ page pageEncoding="UTF-8" %>
```

You should also adjust the following instruction if present in your custom JSP pages and/or servlets:

```java
request.setCharacterEncoding("UTF-8");
```

:::note

If you use the standard API `ServletTool.setHTTPHeaders` method instead of above directive and/or instruction
(which is definitely the right approach) you don''t need to do anything.

:::

Others
------

If you need to convert a text file from `ISO-8859-1` to `UTF-8` you can, for instance, use the Linux `iconv` command line tool:

```shell
iconv -f ISO-8859-1 -t UTF-8 iso.txt > utf.txt
```

Most modern text editors also provide features to convert files from one encoding to another.
