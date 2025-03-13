---
sidebar_position: 30
title: Upgrading
---

Upgrade from version 3.1 to version 3.2
=======================================

Introduction
------------

The version 3.2 is an evolution of previous version 3.1. It deos not include major non backward-compatible changes.

However, like for each version you should take a look at deprecated API usage and refactor them. 

This is particularly important to do so as many features marked deprecated in this version or in previous versions,
have been be removed in next version (4.0).

You should also review your configuration items in details, especially the UI-related items (such as your custom dispositions or JS and CSS resources)
to be compliant with version 3.2's base components (the core stylesheets, for instance, have have been significantly refactored
in version 3.2 if compared to version 3.1).

Upgrade procedure
-----------------

### Prerequisites

The update **MUST** be done on an up-to-date 3.1 version.

This means that **all maintenance releases patches** of version 3.1 have been sucessfully applied and verified.

### Procedure

#### Managed instances

The following upgrade procedure is only applicable to instances managed on an instance manager (SIM), it **MUST** be done using command line.

1. Connect on your instance's account: `sudo su - myinstance`
2. Make a final update of your instance: `sim upgrade`
3. Make a backup of your instance: `sim save`
4. Make a complete backup of the instance's `tomcat` folder (in order to be able to revert manually to previous version if needed): `cp -r tomcat tomcat-fefore.version.upgrade`
5. Change your instance's version in the manager's database: `sqlite3 /var/simplicite/data/apps.db "update instances set version = '3.2' where name = 'myinstance'"`
6. Apply **all** database-level patches: `sim ant-upgrade-configuration-db-only`
7. Stop your instance: `sim stop`
8. Manually check and update if needed your instances's deployment descriptors `META-INF/context.xml` and `WEB-INF/web.xml` by comparing them to the default ones of version 3.2 (that you can find in `/var/simplicite/template-3.2`)
9. Upgrade tour instance's webapp: `sim ant-upgrade-war`
10. Restart your instance: `sim start`
11. Remove the patch level property file `rm tomcat/webapps/ROOT/WEB-INF/patches/V3.2/patches.properties`
12. Apply **all** configuration-level patches: `sim ant-upgrade-configuration-xml-only`

It is recommended to do a manual global clear cache using the generic web UI at the end of the process.

> **Note**: If you are using the instance template packages without the SIM the procedure
> (e.g. if you are running your instance on a PaaS application container or in a Docker container
> or even in a standalone application server) is the same as above except that the equivalent of the above
> commands have to be run manually (ex: `ant upgrade-configuration-db-only` instead of `sim ant-upgrade-configuration-db-only`
> or `sudo systemctl stop tomcat` instead of `sim stop` etc.)

#### Legacy setup packaging

If you are still using the logacy "setup" packaging you should consider migrating, at least, to the instance template packaging.

However, the equivalent of the steps described above are possible as either system-level command lines or `ant` tasks (see the `build*.xml` of the setup package for details)

> **Note**: The setup package can now be considered as a deprecated packaging (it has been definitely abandonned in version 4.0).
