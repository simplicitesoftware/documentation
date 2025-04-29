---
sidebar_position: 320
title: Projects Git repositories
---

Simplicité platform Git Repositories
=====================================

This document describe how to use **platform** Git repositories.

> **Note**: starting with version 3.2 the configuration modules can be exposed as Git repositories (managed by the Simplicité instance itself).
> This document **does not** deal of this feature. Please refer to [this document](/docs/integration/webservices/git-repositories) instead.

Prerequisites
-------------

Have a recent [Git](http://git-scm.com/) version installed.

Turn off SSL verification (our Git repositories are accessible over HTTPS with certificates signed by our own certification authority):

```bash
git config --global http.sslVerify false
```

Platform repositories
---------------------

The Simplicité platform is provided in the `platform` domain in two packaging:

- **Instance template** packages (versions 3.0 an above)
- Legacy **setup** packages (for versions 2.x and 3.x only)

All platform packages repositories are **read-only**.

### Instance template packages usage

The instances templates packages usage is straightforward: it contains a preinstalled Tomcat&reg; webapp (using, by default, and embedded HSQLDB&reg; database) that can be deployed as-is.

You just need to clone the desired **instance template** package from `https://<username>[:<password>]@platform.git.simplicite.io/template-<x.y>.git`,
copy the content of the `app` in your Tomcat's `webapps` folder and start Tomcat.

> **Note**: the instance templates are used by our [instance manager](https:/docs/misc/manager) and by our [Docker container](/docs/operation/docker)
> and other PaaS containers ([Bluemix](/docs/operation/cloudfoundry), [Pivotal](/docs/operation/cloudfoundry), [Heroku](/docs/operation/heroku), [OpenShift](/docs/operation/openshift), ...)

### Setup package usages

1. Clone the desired **setup** package from `https://<username>[:<password>]@platform.git.simplicite.io/setup-<x.y>.git`
2. Copy the content of the setup to a new Java project (avoid working with the setup repository itself unless you are a Git advanced user and are able to configure dedicated custom branches and remotes)
4. Setup the project using `ant setup` ANT task
3. If needed adjust manually the resulting build and properties files in your project

See [project package and ANT tasks document](/docs/misc/java-project) for details on how to proceed with installation/deployment of your project.

