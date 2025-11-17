---
sidebar_position: 210
title: Application servers slimming
---

Application server slimming and tweaks
======================================

Tomcat
------

All web applications can be removed from the `webapps` folder.

A basic `ROOT` webapp must be created as Tomcat will not work without it.

JBoss 4.2
---------

### Useless components

These services may be removed from `<jboss root>/server/default/deploy` to improve JBoss performances :

```text
bsh-deployer.xml
cache-invalidation-service.xml
ejb3.deployer
ejb3-interceptors-aop.xml
http-invoker.sar
jboss-aop-jdk50.deployer
jboss-ha-local-jdbc.rar
jboss-ha-xa-jdbc.rar
jboss-xa-jdbc.rar
jbossws.sar
jms
jmx-console.war
management
monitoring-service.xml
properties-service.xml
quartz-ra.rar
schedule-manager-service.xml
scheduler-service.xml
uuid-key-generator.sar
```

You can also inhibitate `JMSService` and `RMI_IIOPService` in `<jboss root>/server/default/conf/jboss-service.xml`

### JSP compilation

To allow correct compilation of JSP, you must check if:

```xml
<init-param>
	<param-name>compilerSourceVM</param-name>
	<param-value>1.5</param-value>
</init-param>
```

Is present in the `<jboss root>/server/<server>/deploy/jboss-web.deployer/conf/web.xml`
