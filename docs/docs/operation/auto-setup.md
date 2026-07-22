---
sidebar_position: 12
title: Auto Setup
---

Automated setup
================

The most classic way of installing an app on an instance is to deploy an empty instance and import modules as the designer user,
usually through the UI, the I/O endpoint or using Git pushes/pulls.

However, there are many contexts that call for mechanisms to install or update a fully-functioning app without ever having to connect to it.

This document presents two features that aim at accomplishing just that:

- license packaging
- import spec (module packaging)

Basically, after its usual startup operations, Simplicité will check some special folders that, if containing the appropriate data,
will trigger the associated functionality.

License packaging
-----------------

As of version 5.2.19 it is possible to add a license key file (XML, JSON or YAML) in the `webapps/ROOT/WEB-INF/licenses`,
the name of the file must be `license.<xml|json|yaml>`.
This file will be imported at startup.

Alternatively you can pass the content of the license key (in either XML, JSON or YAML format) in the `LICENSE_KEY` environment variable.

Import spec
-----------

The "Import Specification" allows to **automate app installation and updates on a Simplicité instance**.

When booting, the platform:

1. processes **platform** installation, updates, patches
2. processes **app** installation, updates, patches **as defined in the importspec**

:::info
Most importspec examples in this doc are in yaml format, but JSON _(which yaml is a superset of)_ works just as well.
:::

### Provision

The importspec can be provided in one of two ways:

#### File provision

The file must:

- have a `<appname>-importspec.yml` or `<appname>-importspec.json` filename
- be placed or mounted in the `/usr/local/tomcat/webapps/ROOT/WEB-INF/modules` directory.

:::info
The `/usr/local/tomcat/webapps/ROOT/WEB-INF/modules` directory is called the **importspec dir** in the rest of the doc.
:::

#### Environment variable provision

The import specification can also be passed as an environment variable `MODULES_IMPORT_SPEC`, containing either:

- the import specification itself as JSON or YAML
- a URL to this specification file.

**Docker CLI command examples:**

```shell
docker run (...) -e MODULES_IMPORT_SPEC='{ "modules": [ { "name": "MyModule", "version": "1.2.3", "git": "https://github.com/myorg/mymodule.git" } ] }'
docker run (...) -e MODULES_IMPORT_SPEC="https://somewhere.com/my-importspec.json"
```

**Docker Compose example:**

```yaml
services:
  simplicite:
    image: registry.simplicite.io/platform:<tag>
    environment:
      MODULES_IMPORT_SPEC: |
        title: "MyApp"
        modules:
          - name: "MyModule1"
          - name: "MyModule2"
```

### Structure

The importspec defines an ordered list of modules to import on the instance.

#### Module sourcing

Here follows an example combining all possible module sourcing options:

- **[default]** a zipped/tarballed module in the importspec dir
- a zipped/tarballed module somewhere else on the filesystem
- a zipped/tarballed module online
- a git repository

```yaml
title: "MyApp"
modules:
  # when given a simple module name, a MyModule1.zip|.tar.gz file will be looked for in the importspec dir
  - name: "MyModule1"
  # it is possible to specify a custom location for module files
  - name: "MyModule2"
    file: "/an/absolute/path/to/mymodule.zip"
  # module files can be online
  - name: "MyModule3",
    url: "https://somewhere.com/path/to/mymodule.zip"
  # module can be a module repository (in Simplicité module repository format)
  - name: "Module4",
    git:
      uri: "<a Git URI, e.g. https://somewhere.com/path/to/mymodule.git or someone@somewhere.com:/path/to/module.git, etc.>"
      username: "<an optional username>"
      password: "<an optional password>"
      branch: "<an optional branch>"
```

#### Module version

For faster app startup, we want to avoid re-importing the modules at each restart.
To avoid this, the import spec has an optional module version parameter.
It will compare the **version number in the importspec** to the **version number in the database** (if present), and only import the module if necessary.
If the module already exists in the database in a version which is higher or equals to the specified version, then no import is done.

```yaml
title: "My title"
modules:
  - name: "MyModule1"
    version: "1.4.3"
```

:::warn
If no version is specified, the module will be re-imported at each startup, which is generally bad practice.
:::

#### Module datasets

It is possible to specify to import, either all, or a subet of, the module's datasets:

```yaml
title: "My title"
modules:
  - name: "MyModule1"
    datasets: true ## all the defined module's datasets
  - name: "MyModule2"
    datasets: # some datasets only
      - mydataset1
      - mydataset2
```

#### Module unit tests

It is possible to specify to import, either all, or a subet of, the module's unit test shared codes:

```yaml
title: "My title"
modules:
  - name: "MyModule1"
    unittests: true
  - name: "MyModule2"
    unitttest:
      - MyUnitTest1
      - MyUnitTest2
```

### Use cases

There's a wide variety of use cases for this feature:

- deployement reproductibility
- deployement configuration stability
- unit testing, functional testing, code coverage measurements in cicd context
- app containerisation

#### App containerisation

Simplicité provides you with a docker image, which is incomplete without your modules installed on the platform.
Moreover, the right version of the platform must be deployed with the right version of each module.
This can be messy to explain and deploy, and often unaligned with standard deployement which just expect an image.
The importspec feature allows to build an image on top of the Simplicité image, containing all the necessary modules.
_It is also possible to pre-compile the sources for the production environments where compilation is not possible._

In a cicd pipeline, it is thus possible to automate App image production.
The following example script can be placed in the `others/build` directory of your module to be called by a cicd pipeline.

<details>
<summary>See script</summary>

```shell
#!/bin/bash

# this script is meant to live in the `/others/build` dir of a Simplicité project for execution in a CICD pipleline

if ! command -v jq &> /dev/null
then
    echo "This script requires `jq` and `zip`. Please install and then run this tool again."
    exit
fi

## Extract useful information from the module-info.json file
APP_NAME=$(jq -r '.name' ../../module-info.json)
DOCKER_IMAGE_NAME=$(echo "$APP_NAME" | tr '[:upper:]' '[:lower:]')
APP_VERSION=$(jq -r '.version' ../../module-info.json)
SIMPLICITE_VERSION=$(jq -r '.platform' ../../module-info.json)

## Copy the project to the modules directory
MODULE_ROOT="$(cd ../.. && pwd)"
rm -rf modules/ && mkdir modules
(cd "$MODULE_ROOT" && zip -q -r "$OLDPWD/modules/$APP_NAME.zip" . \
    -x "others/*" -x "target/*" -x ".*" -x ".*/**" -x "*/.*" -x "*/.*/*")

cat > modules/app-importspec.yml <<EOF
title: "App"
modules:
- name: "$APP_NAME"
  version: "$APP_VERSION"
  datasets: true
EOF

docker build -f - -t "$DOCKER_IMAGE_NAME:$APP_VERSION" . <<EOF
FROM registry.simplicite.io/platform:$SIMPLICITE_VERSION
COPY --chown=simplicite:simplicite modules /usr/local/tomcat/webapps/ROOT/WEB-INF/modules
EOF
docker image prune -f
docker save "$DOCKER_IMAGE_NAME:$APP_VERSION" | gzip > "dockerimage-$APP_NAME-$APP_VERSION.tar.gz"
docker rmi "$DOCKER_IMAGE_NAME:$APP_VERSION"

rm -rf modules
```

</details>
