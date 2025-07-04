---
sidebar_position: 120
title: Compatibility
---

Compatibility tables
=================

This document gives a non exhaustive list of architectures and infrastructure components the Simplicité platform is compliant with.

Containers deployments (Docker and PaaS)
----------------------------------------

The **ideal** / **preferred** deployment model is to deploy Simplicité platform as **Docker&reg; container(s)**
from our standard pre-built images available on [DockerHub](https://hub.docker.com/r/simplicite/) or from custom images that you build to fit your needs.
See [this document](/docs/operation/docker) for details.

It is also possible to deploy it as managed application container(s) on a wide range of platforms as a service (**PaaS**) such as:

- Any CloudFoundry flavor (see. [this document](/docs/operation/cloudfoundry) for details))
- AWS ElasticBeanstalk (see. [this document](/docs/operation/aws-elasticbeanstalk) for details))
- Heroku (see. [this document](/docs/operation/heroku) for details))
- Openshift (see. [this document](/docs/operation/openshift) for details))
Etc.

In both cases you will need an external database service - custom or as a service (DBaaS).
See the "Databases" section for details on Simplicité database compliances.

Custom deployments
------------------

It is still possible, although highly **discouraged**, to deploy Simplicité on custom IaaS infrastructures or even on premises servers.
In such a case you need to verify that your technical platform complies with the following recommendations.

### Introduction

By default, our **recommendation** is that you use only the current **up to date** versions of **all technical components**
(OS, JVM, application server, database server, web servers) unless explicitly stated otherwise.

The versions indicated below are to be considered as **minimal** versions on which Simplicité platform should run.
Some of them are now outdated and **should not** be considered as recommended versions.
Using such old versions is likely to be a source of potentially tricky problems that you would not have with up-to-date components.

### OS

Any OS on which a suitable Java JVM is officially available. This includes:

- all current **Linux distributions** (RedHat&reg;, CentOS&reg;, Fedora&reg;, Debian&reg;, Ubuntu&reg;, etc.) and some proprietary UNIX (Solaris&reg;, etc.),
- all current Microsoft **Windows&reg;** versions,
- all current **MacOS&reg;** versions,
- etc.

Our **recommended** OS family for production is Linux.

> **Note**: Whichever OS you use, you **MUST** use keep it **up-to-date**.

The OS can run either on **physical** or **virtual** servers or in Docker&reg; **containers**.

It is also possible to deploy Simplicité platform on **PaaS** buildpacks CloudFoundry&reg;, Heroku&reg;, OpenShift&reg;, etc.

### Java VM

The following table only indicates the **LTS (Long Term Support)** JVM versions.

| ![](https://platform.simplicite.io/logos/logo125.png) | JVM 1.8 | JVM 11  | JVM 17  | JVM 21  |
|:-----------------------------------------------------:|---------|---------|---------|---------|
| **6.2** and alpha 6.3                                 | no      | no      | yes (1) | **yes** |
| Legacy 6.0 and 6.1                                    | no      | yes (1) | yes (1) | **yes** |
| **5.x**                                               | no      | yes (1) | **yes** | yes (1) |
| Legacy 4.0                                            | no      | yes (1) | **yes** | yes (1) |
| Legacy 3.2                                            | yes (1) | **yes** | yes (1) | yes (1) |
| Legacy 3.1                                            | yes (1) | **yes** | yes (1) | yes (1) |
| Legacy 3.0                                            | **yes** | no      | no      | no      |

1. Not tested and not supported but should work.

In **bold** the recommended choice for considered Simplicité version.

> **Note**: Whichever JVM version you use, you **MUST** use its **up-to-date release**.
> Only these up-to-date releases are tested and supported.

### Application servers

| ![](https://platform.simplicite.io/logos/logo125.png) | Web profile (1) | Webapp  |
|:-----------------------------------------------------:|-----------------|---------|
| **6.x**                                               | JEE 8 (2)       | 4.0 (2) |
| **5.x**                                               | JEE 8           | 4.0     |
| Legacy 4.0                                            | JEE 8           | 4.0     |
| Legacy 3.2                                            | JEE 7           | 3.1     |
| Legacy 3.1                                            | JEE 6           | 3.1     |
| Legacy 3.0                                            | J2EE 1.4        | 2.5     |

1. Web profile is supposed to be used by default but full profile is also possible
2. Compliance with JakartaEE (an thus Webapp version 6.0+) was the target when for versions 6.x.
However, at the time of the first minor version 6.x release, some third party libs are still not yet compliant.
Compliance with JakartaEE is thus postponed to a future major version.

The webapp implementation we recommend are:

* **Webapp 4.0** (JEE): Apache Tomcat&reg; 9.0.x
* **Webapp 6.1** (JakartaEE): Apache Tomcat&reg; 11.0.x (will be supported in a future major version)

> **Note**: Whichever application server version you use, you **MUST** use its  **up-to-date maintenance release**.
> Only these up-to-date releases are tested and supported.

Databases
---------

| ![](https://platform.simplicite.io/logos/logo125.png) | PostgreSQL | MySQL | Oracle   | SQLServer |
|:-----------------------------------------------------:|------------|-------|----------|-----------|
| **6.x**                                               | 13+        | 8+    | 19c+     | 2019+     |
| **5.x**                                               | 13+        | 8+    | 19c+     | 2019+     |
| Legacy 4.0                                            | 10+        | 5.5+  | 12c+     | 2016+     |
| Legacy 3.2                                            | 9+         | 5.1+  | 11g+     | 2012+     |
| Legacy 3.1                                            | 9+         | 5.1+  | 11g+     | 2012+     |
| Legacy 3.0                                            | 9+         | 5.1+  | 10g+     | 2008+     |

> **Note**: The above versions are not the **recommended** version but the **minimal** versions on which the platform is supposed to run.
> Whichever database server you use, you **SHOULD** use an **up-to-date release version** instead of the above minimal versions.
> Only the specified release versions are tested and supported (older versions than specified may work in some cases but we don't provide support if you use them).

Web browsers
------------

| ![](https://platform.simplicite.io/logos/logo125.png) | Edge (1) |Firefox (1) | Chrome (1) | Safari (1) | IE11    |
|:-----------------------------------------------------:|----------|------------|------------|------------|---------|
| **6.x**                                               | yes      | yes        | yes        | yes        | no      |
| **5.x**                                               | yes      | yes        | yes        | yes        | no      |
| Legacy 4.0                                            | yes      | yes        | yes        | yes        | yes (2) |
| Legacy 3.x                                            | yes      | yes        | yes        | yes        | yes     |

1. Up to date version only (recent previous versions are not supported but should work)
2. Not recommended, not tested and not supported. You may experience poor performances and/or visual/functional issues, IE11 is officially retired on June 6th 2022.
