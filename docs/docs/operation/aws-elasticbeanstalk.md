---
sidebar_position: 60
title: AWS ElasticBeansTalk
---

Simplicité on AWS elastic Beanstalk&reg;
===============================================

Simplicité instances can easily be deployed on the AWS Elastic Beanstalk&reg; platform.

This document consider you are using a standard **Simplicité cloud instance template** cloned from Git.

> **Warning**: this document may be **outdated** and incomplete.
> Docker-based deployments (see [this document](/docs/operation/docker)) are to be preferred over deployement on a proprietary PaaS.
> Our support capabilities on this PaaS is very limited so before choosing this option make sure you have required up-to-date expertise.


Provision a database
--------------------

It is required that you provision an external database as a service such as a AWS RDS&reg; database instance.

Once provisionned, load the appropriate template database dump into the database.

Then use the configuration items (host, port, database name, username, password) of the database instance to configure the datasource descriptor `META-INF/context.xml` file.

Make sure to use the `org.apache.tomcat.jdbc.pool` connection pool implementation for your datasource by adding this explicit attribute:

	factory="org.apache.tomcat.jdbc.pool.DataSourceFactory"

This is **required** because default Apache DBCP2 connection pool implementation is not deployed by default on AWS Elastic Beanstalk&reg; Tomcat environments.

> **Note**: you can't use an ephemeral instance using an embedded HSQLDB database because it is not compliant with `org.apache.tomcat.jdbc.pool` connection pool implementation.

Provision a Elastic Beanstalk&reg; environment
----------------------------------------------

Using the web console or the `eb` CLI, create a Tomcat environment with a minimum of 512Mb max memory.

Deploy the instance
-------------------

The JDBC driver suitable for your database must be copied in the `WEB-INF/lib` folder.

Then package the WAR file and, using the web console or the `eb` CLI, upload it to your Elastic Beanstalk&reg; environment.

Use BLOBs for documents
-----------------------

The document need to be stored into the database as BLOBs. To do so configure the `DOC_DIR` system parameter as `BLOB` and clear the cache.

Once reconnected force a document synchronize to load all initial documents as BLOBs.