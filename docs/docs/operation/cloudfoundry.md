---
sidebar_position: 30
title: CloudFoundry
---

Simplicité on CloudFoundry
==========================

:::warning
This document may be **outdated** and incomplete.
Docker-based deployments (see [this document](/docs/operation/docker)) are to be preferred over deployment on a proprietary PaaS.
Our support capabilities on this PaaS is very limited so before choosing this option make sure you have required up-to-date expertise.
:::

IBM Bluemix
-----------

Simplicité instances can easily be deployed on the CloudFoundry&reg;-based IBM Bluemix PaaS:

<iframe width="450" height="254" src="//www.youtube.com/embed/P8cKAU2VDIg" frameborder="0" allowfullscreen></iframe>

:::note
Note that the following procedure only creates a sandbox instance that use an embedded database.
In CloudFoundry, when stopping and restarting such a sandbox, the embedded database is reset.
In other words, make sure to export all your configurations and data before stopping your sandbox.
A more detailed procedure will soon be available to explain how to use a standard database
service instead of an embedded database.
:::

### Prerequisites

Download the `cf` tool binary package from `https://github.com/cloudfoundry/cli/releases` and install/update it.

Configure the BlueMix CloudFoundry API endpoint using the following command :

- `cf api https://api.ng.bluemix.net` (USA)
- `cf api https://api.eu-gb.bluemix.net` (UK)
- `cf api https://api.eu-de.bluemix.net` (Germany)
- `cf api https://api.au-syd.bluemix.net` (Australia)

Then login to your Bluemix account using the following command:

- `cf login`

### Provision an instance

Get the Simplicité sandbox template from our GIT repository
(see [simplicite.io website](https://www.simplicite.io) for details on how to get access to this repository).

Prepare the `app.war` by:

```bash
cd app
jar cf ../app.war .
cd ..
```

:::note
If you don't have a Java runtime installed (which provides the `jar` tool used in the example above
you can use a standard ZIP tool instead, for instance a command line such as `zip -r ../app.war .` should work the same).
:::

Check and/or change the deployment parameters in the `manifest.yml` file (e.g. the allocated memory).

Create a blank Simplicité instance using the following command
(the instance name is free but must be a URL-friendly string, e.g. `my_simplicite-123`,
you can deploy several instances on your Bluemix account, each one needs a unique instance name):

```text
cf push <instance name>
```

Once deployed the instance UI will be available on `http://<instance name>.mybluemix.net`.
This URL is noted `<instance base URL>` in the commands below.

You can connect using the `designer` user account (default password is `designer` as shown in the commands below).

### Load the demo application

Optionally, the demo application configuration package and the associated test data package can be loaded on your instance.

Import the demo application configuration on the instance using the following commands:

```text
curl -u designer:designer --form service=zipimport --form  url=https://www.simplicite.io/resources/modules/demo-app.zip <instance base URL>/io
```

Then clear the cache using the following command:

```text
curl -u designer:designer --form service=clearcache <instance base URL>/io
```

Then load demo app data using the following command:

```text
curl -u designer:designer --form service=zipimport --form  url=https://www.simplicite.io/resources/modules/demo-data.zip <instance base URL>/io
```

### Unprovision the instance

delete the instance using the following command:

```text
cf delete <instance name>
```

Pivotal
-------

Simplicité instances can easily be deployed on the Pivotal CloudFoundry&reg; PaaS:

<iframe width="450" height="254" src="//www.youtube.com/embed/biIyeTruSf4" frameborder="0" allowfullscreen></iframe>

:::note
Note that the following procedure only creates a sandbox instance that use an embedded database.
In CloudFoundry, when stopping and restarting such a sandbox, the embedded database is reset.
In other words, make sure to export all your configurations and data before stopping your sandbox.
A more detailed procedure will soon be available to explain how to use a standard database
service instead of an embedded database._
:::

### Prerequisites

Download the `cf` tool binary package from `https://github.com/cloudfoundry/cli/releases` and install/update it.

Configure the Pivotal CloudFoundry API endpoint using the following command :

```text
cf api https://api.run.pivotal.io
```

Then login to your Pivotal account using the following command:

```text
cf login
```

### Provision an instance

Get the Simplicité sandbox template from our GIT repository
(see [simplicite.io website](https://www.simplicite.io) for details on how to get access to this repository).

Prepare the `app.war` by:

```bash
cd app
jar cf ../app.war .
cd ..
```

Note: if you don't have a Java runtime installed (which provides the `jar` tool used in the example above
you can use a standard ZIP tool instead, for instance a command line such as `zip -r ../app.war .` should work the same).

Check and/or change the deployment parameters in the `manifest.yml` file (e.g. the allocated memory).

Create a blank Simplicité instance using the following command
(the instance name is free but must be a URL-friendly string, e.g. `my_simplicite-123`,
you can deploy several instances on your Pivotal account, each one needs a unique instance name):

```text
cf push <instance name>
```

Once deployed the instance UI will be available on `http://<instance name>.cfapps.io`.
This URL is noted `<instance base URL>` in the commands below.

You can connect using the `designer` user account (default password is `designer` as shown in the commands below).

### Load the demo application

Optionally, the demo application configuration package and the associated test data package can be loaded on your instance.

Import the demo application configuration on the instance using the following commands:

```text
curl -u designer:designer --form service=zipimport --form  url=https://www.simplicite.io/resources/modules/demo-app.zip <instance base URL>/io
```

Then clear the cache using the following command:

```text
curl -u designer:designer --form service=clearcache <instance base URL>/io
```

Then load demo app data using the following command:

```text
curl -u designer:designer --form service=zipimport --form  url=https://www.simplicite.io/resources/modules/demo-data.zip <instance base URL>/io
```

### Unprovision the instance

delete the instance using the following command:

```text
cf delete <instance name>
```
