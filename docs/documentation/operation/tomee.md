---
sidebar_position: 90
title: Tomee
---

TomEE&reg; deployment
=====================

Simplicit&eacute;&reg; 3.1 (and above) instances can be deployed on the <a href="http://tomee.apache.org" target="_blank">TomEE&reg; JEE webprofile application server</a>.

Webapp deployment
----------------

The TomEE&reg; application server is based on Tomcat&reg; web container, it is possible to straightforward deploy Simplicit&eacute;&reg; as a Tomcat webapp package.

Just make sure the `<TomEE root>/webapps/<webapp, e.g. "ROOT">/WEB-INF/classes/application.properties` matches the same Tomcat&reg; version as the one used by TomEE&reg;.

E.g. for TomEE&reg; version 7.0.* which is based on Tomcat&reg; 8.5.*

```
(...)
server.vendor=tomcat
server.version=8
(...)
```

Specific configuration to use EJB interface type
------------------------------------------------

In order to benefit from EJB-wrapped engine interface type there are some additional configurations to do:

Modify the `<TomEE root>/webapps/<app, e.g. ROOT>/WEB-INF/classes/application.properties` to indicate that the server is TomEE&reg;:

```
(...)
server.vendor=tomee
(...)
```

> **Note**: A better approach, if possible, is to run your application server with a `-Dserver.vendor=tomee`