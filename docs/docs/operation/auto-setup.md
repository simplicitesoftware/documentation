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

As of version 5.1.6 it is possible to add business modules' ZIP files in the `webapps/ROOT/WEB-INF/modules` folder.
These ZIP files will be imported **if required** at startup following an import specification JSON/YAML file located at the same place.

The import procedure decides whether importing the specified module is required based on the specified version:
if the module already exists in the database in a version which is higher or equals to the specified version, then no import is done.

The import specification file must be names `<any thing>-importspec.<json|yaml>` and its format is like:

```yaml
title: "My title"
modules:
  - name: "MyModule1"
    version: "1.4.3"
    datasets: true
    unittests: true
  - name: "MyModule2"
    version: "2.1.2"
    datasets:
      - mydataset1
      - mydataset2
    unitttest:
      - MyUnitTest1
      - MyUnitTest2
      - MyUnitTest3
...
```

<details>
<summary>Click to see JSON example</summary>

```json
{
	"title": "My title",
	"modules": [
		{
			"name": "MyModule1",
			"version": "1.4.3",
			"datasets": true,
			"unittests": true,
		},
		{
			"name": "MyModule2",
			"version": "2.1.2",
			"datasets": [
			  "mydataset1",
			  "mydataset2"
			],
			"unittests": [
			  "MyUnitTest1",
			  "MyUnitTest2",
			  "MyUnitTest3"
			]
		},
		...
	]
}
```

</details>

There are two strategies to add these ZIP files and the import specification:

- Build a custom image adding the files in `/usr/local/tomcat/webapps/ROOT/WEB-INF/modules`
- Mount the import dir on the above location

It is also possible to specify a custom location for ZIP files

E.g.:

```yaml
modules:
  - name: "MyModule",
    version: "1.2.3"
    file: "/an/absolute/path/to/mymodule.zip"
```

or a URL:

E.g.:

```yaml
modules:
  - name: "MyModule",
    version: "1.2.3"
    url: "https://somewhere.com/path/to/mymodule.zip"
```

It is also possible to specify a Git repository:

E.g.:

```yaml
modules:
  - name: "MyModule",
    version: "1.2.3"
    git:
      uri: "<a Git URI, e.g. https://somewhere.com/path/to/mymodule.git or someone@somewhere.com:/path/to/module.git, etc.>"
      username: "<an optional username>"
      password: "<an optional password>"
      branch: "<an optional branch>"
```

And the import specification can also be passed as an environment variable `MODULES_IMPORT_SPEC`, containing either the
import specification itself as JSON or YAML or a URL to this specification file.

E.g. 1: Passing `MODULES_IMPORT_SPEC` to a `docker` CLI command line:
`-e MODULES_IMPORT_SPEC='{ "modules": [ { "name": "MyModule", "version": "1.2.3", "git": "https://github.com/myorg/mymodule.git" } ] }'`

E.g. 2: Setting `MODULES_IMPORT_SPEC` in a `docker-compose.yml` file:

```yaml
services:
  simplicite:
    image: registry.simplicite.io/platform:<tag>
    environment:
      MODULES_IMPORT_SPEC: |
        title: "MyApp"
        modules:
          - name: "MyModule1"
            version: "1.2.3"
            git: "https://github.com/myorg/mymodule1.git"
            datasets: true
            unittests: true
          - name: "MyModule2"
            version: "1.2.3"
            git: "https://github.com/myorg/mymodule2.git"
            datasets: true
(...)
```

E.g. 3: Provided that you have made available both the specification file and the modules' ZIP files somewhere accessible over HTTP you can
pass this environment variable as an URL: `-e MODULES_IMPORT_SPEC="https://somewhere.com/my-importspec.json"` in which the
modules location are also specified as URLs. This approach allows you to deliver subsequent versions of your modules without changing deployment
configuration.
