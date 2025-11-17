---
sidebar_position: 200
title: Load balancing
---

Load balancing
==============

This document applies to Simplicité version 4.0 and above using internal OAuth2 authentication.

Apache + Tomcat
---------------

Configure the Apache virtual host like this:

```apache
<VirtualHost *:<port>>
	ServerName "<host>"
	ProxyPass "/" "balancer://<balancer name>/"
	ProxyPassReverse "/" "http(s)://<host>:<port>/"
	<Proxy "balancer://<balancer name>">
		BalancerMember "ajp://<node 1 host>:<node 1 AJP port>" [secret=<AJP secret if applicable>] route=<node 1 name> keepalive=On ttl=60 retry=0
		BalancerMember "ajp://<node 2 host>:<node 2 AJP port>" [secret=<AJP secret if applicable>] route=<node 2 name> keepalive=On ttl=60 retry=0
		(...)
		BalancerMember "ajp://<node N host>:<node N AJP port>" [secret=<AJP secret if applicable>] route=<node N name> keepalive=On ttl=60 retry=0
		ProxySet lbmethod=bytraffic
		ProxySet stickysession=JSESSIONID
	</Proxy>
</VirtualHost>
```

And configure each Tomcat node's `conf/server.xml` like this:

```xml
(...)
<Connector port="<node K AJP port>" protocol="AJP/1.3" proxyName="<host>" proxyPort="<port>" connectionTimeout="60000"/>
(...)
<Engine name="Catalina" defaultHost="localhost" jvmRoute="<node K name>">
(...)
```

:::note
This configuration correspond to **root** deployed Simplicité instances.
When transposing this to your particular case pay a great attention to the trailing slashes which are **mandatory**
for the load balancing to run properly.
:::
