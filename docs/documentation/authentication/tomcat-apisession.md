---
sidebar_position: 70
title: Tomcat API session
---

Tomcat API session management
=============================

An optional valve is provided to avoid API callers to take care of server session.

> **Warning**: this applies only to versions 5.0 and 5.1

Webapp settings
---------------

The changes to be done are :

- Add the `simplicite-valves.jar` to `<tomcat root>/lib` folder
- Add add the following valve declaration in `META-INF/context.xml`

```xml
<Valve className="com.simplicite.tomcat.valves.APISessionValve"/>
```

You can customize the default session timeout by adding `timeout="<timeout in seconds, defaults to 60>"` to the valve declaration.

You can enable the debug traces by adding a `debug="<true|false, defaults to false>"` to the valve declaration.