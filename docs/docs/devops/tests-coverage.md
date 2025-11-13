---
sidebar_position: 310
title: Tests coverage
---

Unit tests coverage
===================

This document explains how to measure your server-side (Java) unit tests coverage using the JaCoCo tool.

Enable the JaCoCo agent for a specified module
----------------------------------------------

### Using Docker images

Our standard images already contains the up-to-date JaCoCo tool by default in the `/usr/local/jacoco` folder.

To enable coverage measurement of unit tests execution just pass the `JACOCO_MODULES` environment variable to the
container with a space-separated list of modules (e.g. `-e JACOCO_MODULES="MyModule MyOtherModule"`).

The JaCoCo agent exec file is generated at the location denoted by the `JACOCO_DESTFILE` environment variable which
defaults to `/usr/local/tomcat/webapps/ROOT/WEB-INF/dbdoc/content/jacoco/jacoco.exec`.
You must ensure persistence for the above `jacoco` folder (which is the case if you already ensure the persistence of the `dbdoc` folder),
for instance by mounting a dedicated volume. This is also useful for report generation as this default folder
is also the default location for report files, see bellow.

To be able to generate a human-readable report (see bellow) you must also mount the `src` and `bin` folders
located in the `/usr/local/tomcat/webapps/ROOT/WEB-INF` folder because both of them are used by the report generation process.

By default, the exec file is appended when restarting the container, but you can change this
by setting the `JACOCO_DESTFILE_APPEND` environment variable to `false`
(e.g. `-e JACOCO_DESTFILE_APPEND="false"`), in this case the exec file is reset each time the container is restarted.

:::note
You can use the import specification mechanism to automate the modules import and unit tests execution.
:::

### Manually

You can do the same manually for "traditional" Tomcat deployments.

Download the [JaCoCo tool](https://repo1.maven.org/maven2/org/jacoco/jacoco/0.8.12/jacoco-0.8.12.zip)
and unzip it somewhere accessible to Tomcat (noted `<path>` bellow).

Add following option to JVM arguments when starting Tomcat (in the example bellow only one module is monitored noted `<module>`):

```text
-javaagent:<path>/jacoco-0.8.12/lib/jacocoagent.jar=destfile=<path>/jacoco.exec,includes=com.simplicite.*.<module>.*
```

Generate a human-readable report
--------------------------------

Note that **in all cases** (Docker ou manual) the above agent's `jacococ.exec` exec file is generated only **when the JVM is shut down**.

This means you **must** stop the JVM **before** generating the report as explained bellow.

### Using Docker images

You just have to stop and restart the container for the human-readable HTML report to be generated in the folder
location denoted by the `JACOCO_REPORTDIR` environment variable which defaults to `/usr/local/tomcat/webapps/ROOT/WEB-INF/dbdoc/content/jacoco`
(in order to be available as the static webapp `https://<base url>/content/jacoco/`).

:::note
As said above you should you can make the report folder available outside of the container ensuring its persistence by the appropriate volume.
:::

### Manually

You can manually generate a human-readable HTML report from the JaCoCo agent exec file using the following command:

```text
java -jar <path>/jacoco-0.8.12/lib/jacococli.jar \
  report <path>/jacoco.exec \
  --html <path>/jacoco \
  --sourcefiles <tomcat root>/webapps/ROOT/WEB-INF/src \
  --classfiles <tomcat root>/webapps/ROOT/WEB-INF/bin
```
