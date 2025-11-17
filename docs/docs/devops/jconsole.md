---
sidebar_position: 300
title: JConsole
---

JConsole
========

Tomcat (for Simplicité version 4+)
----------------------------------

To allow JConsole to connect to Tomcat add these VM arguments :

```text
-Dcom.sun.management.jmxremote
-Dcom.sun.management.jmxremote.port=58585
-Dcom.sun.management.jmxremote.ssl=false
-Dcom.sun.management.jmxremote.authenticate=false
```

Then launch JConsole and connect to `localhost:58585`

JBoss (for legacy Simplicité version 3-)
----------------------------------------

To allow JConsole to connect to JBoss add these VM arguments :

```text
-Dcom.sun.management.jmxremote
-Dcom.sun.management.jmxremote.port=58585
-Dcom.sun.management.jmxremote.ssl=false
-Dcom.sun.management.jmxremote.authenticate=false
```

Then launch JConsole and connect to `localhost:58085`

To allow JBoss MBeans to be used in JConsole add these VM arguments :

```text
-Djboss.platform.mbeanserver
-Djavax.management.builder.initial=org.jboss.system.server.jmx.MBeanServerBuilderImpl
```
