---
sidebar_position: 120
title: Compatibility
---

Compatibility tables
====================

This document gives a non exhaustive list of architectures and infrastructure components the Simplicité platform is compliant with.

Containers deployments
----------------------

The **ideal** / **preferred** deployment model is to deploy Simplicité platform as **Docker&reg; container(s)**
from our standard Docker images available (or from custom images that you build to fit your need).

See [this document](/docs/operation/docker) for details.

:::info
Our standard Docker images are built using the **most recent** up-to-date versions of the underlying OS, Java VM and Tomcat server
for considered Simplicité version.
:::

Note that it is also still possible to deploy it as managed application container(s) on a wide range of platforms as a service (**PaaS**) such as
CloudFoundry flavor (see. [this document](/docs/operation/cloudfoundry) for details),
AWS ElasticBeanstalk (see. [this document](/docs/operation/aws-elasticbeanstalk) for details),
Heroku (see. [this document](/docs/operation/heroku) for details),
Openshift (see. [this document](/docs/operation/openshift) for details),
etc.

Custom deployments
------------------

It is still possible, although **discouraged**, to deploy Simplicité manually without using our Docker images.
In such a case you need to verify that your technical platform complies with the following recommendations.

### Introduction

By default, our **recommendation** is that you use only the current **up to date** versions of **all technical components**
(OS, JVM, application server, database server, web servers) unless explicitly stated otherwise.

The versions indicated below are to be considered as **minimal** versions on which Simplicité platform should run.
Some of them are now outdated and **should not** be considered as recommended versions.
Using such old versions is likely to be a source of potentially tricky problems that you would not have with up-to-date components.

The minor version in **bold** are the current and maintained Simplicité minor versions.

### OS

Any OS on which a suitable Java JVM is officially available. This includes:

- all current **Linux distributions** (RedHat&reg;, CentOS&reg;, Fedora&reg;, Debian&reg;, Ubuntu&reg;, etc.) and some proprietary UNIX (e.g. Solaris&reg;),
- all current Microsoft **Windows&reg;** versions,
- all current **MacOS&reg;** versions,
- etc.

Our **recommended** OS family for production is Linux.

:::tip
**Note**: Whichever OS you use, you **MUST** use keep it **up-to-date**.
:::

The OS can run either on **physical** or **virtual** servers or in Docker&reg; **containers**.

### Java VM

The following table only indicates the **LTS (Long Term Support)** JVM versions.

| ![](https://platform.simplicite.io/logos/logo125.png) | JVM 1.8 | JVM 11  | JVM 17  | JVM 21  | JVM 25  |
|:-----------------------------------------------------:|---------|---------|---------|---------|---------|
| Alpha 7.0                                             | no      | no      | yes (1) | yes (1) | **yes** |
| Beta 6.3 and current **6.2**                          | no      | no      | yes (1) | **yes** | yes (1) |
| Legacy 6.x                                            | no      | yes (1) | yes (1) | **yes** | yes (1) |
| Maintained **5.3** and legacy 5.x                     | no      | yes (1) | **yes** | yes (1) | yes (1) |
| Legacy 4.0                                            | no      | yes (1) | **yes** | yes (1) | yes (1) |
| Legacy 3.2                                            | yes (1) | **yes** | yes (1) | yes (1) | yes (1) |
| Legacy 3.1                                            | yes (1) | **yes** | yes (1) | yes (1) | yes (1) |
| Legacy 3.0                                            | **yes** | no      | no      | no      | no      |

1. Not tested and not supported but should work.

The "yes" in **bold** also denotes the JVM version included in our default Docker images.

:::tip
**Note**: Whichever JVM version you use, you **MUST** always use its **up-to-date release**.
Only these up-to-date releases are tested and supported.
:::

### Application servers

| ![](https://platform.simplicite.io/logos/logo125.png) | Web profile (1) | Webapp |
|:-----------------------------------------------------:|-----------------|--------|
| Alpha 7.0                                             | JakartaEE 11    | 6.1    |
| Beta 6.3, current **6.2** and legacy 6.x              | JEE 8           | 4.0    |
| Maintained **5.3** and legacy 5.x                     | JEE 8           | 4.0    |
| Legacy 4.0                                            | JEE 8           | 4.0    |
| Legacy 3.2                                            | JEE 7           | 3.1    |
| Legacy 3.1                                            | JEE 6           | 3.1    |
| Legacy 3.0                                            | J2EE 1.4        | 2.5    |

1. Web profile is supposed to be used by default but full profile is also possible

The webapp implementation we recommend are:

- **Webapp 6.1** (JakartaEE): Apache Tomcat&reg; 11.0.x
- **Webapp 4.0** (JEE): Apache Tomcat&reg; 9.0.x

:::tip
**Note**: Whichever application server version you use, you **MUST** use its  **up-to-date maintenance release**.
Only these up-to-date releases are tested and supported.
:::

Databases
---------

| ![](https://platform.simplicite.io/logos/logo125.png) | PostgreSQL | MySQL | Oracle   | SQLServer |
|:-----------------------------------------------------:|------------|-------|----------|-----------|
| Alpha 7.0                                             | 18+        | 9+    | 23ai+    | 2025+     |
| Beta 6.3, current **6.2** and legacy 6.x              | 13+        | 8+    | 19c+     | 2019+     |
| Maintained **5.3** and legacy 5.x                     | 13+        | 8+    | 19c+     | 2019+     |
| Legacy 4.0                                            | 10+        | 5.5+  | 12c+     | 2016+     |
| Legacy 3.2                                            | 9+         | 5.1+  | 11g+     | 2012+     |
| Legacy 3.1                                            | 9+         | 5.1+  | 11g+     | 2012+     |
| Legacy 3.0                                            | 9+         | 5.1+  | 10g+     | 2008+     |

:::tip
**Note**: The above versions are the **recommended** minimal versions.
Only these versions are tested and supported. Older versions may also work but we don't provide support if you use them.
Whichever database server you use, you **SHOULD** use an **up-to-date release version**.
:::

Web browsers
------------

| ![](https://platform.simplicite.io/logos/logo125.png) | _ECMAScript_    | Edge (1) |Firefox (1) | Chrome (1) | Safari (1) | IE11    |
|:-----------------------------------------------------:|-----------------|----------|------------|------------|------------|---------|
| Alpha 7.0                                             | _ES2024 (ES15)_ | yes      | yes        | yes        | yes        | no      |
| Beta 6.3, current **6.2** and legacy 6.x              | _ES2022 (ES13)_ | yes      | yes        | yes        | yes        | no      |
| Maintained **5.3** and legacy 5.x                     | _ES2020 (ES11)_ | yes      | yes        | yes        | yes        | no      |
| Legacy 4.0                                            | _ES2015 (ES6)_  | yes      | yes        | yes        | yes        | yes (2) |
| Legacy 3.x                                            | _ES2009 (ES5)_  | yes      | yes        | yes        | yes        | yes     |

1. Up to date version only (recent previous versions are not supported but should work, just make sur the version you use is compliant with specified ECMAScript version).
2. Not recommended, not tested and not supported. You may experience poor performances and/or visual/functional issues (note that IE11 is officially retired on June 6th 2022).

:::tip
**Note**: Whichever web browser you use, you **MUST** keep it **up-to-date**.
:::