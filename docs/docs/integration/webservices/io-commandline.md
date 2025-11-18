---
sidebar_position: 10
title: I/O services
---

I/O services for command line interface
=======================================

The `/io` endpoint is designed to execute usual operation tasks in a CLI, without using the UI.

:::warning
In production the I/O endpoint should be restricted only to allowed origins (e.g. using filtering on request's origin IP address or similar approaches).
:::

I/O URL
-------

The `<I/O URL>` used in `curl` commands below is the one available on the I/O endpoint: `http[s]://<host[:port]>[/<app root>]/io`.

As of **version 4.0.P22** it can also be one available on the API endpoint `http[s]://<host[:port]>[/<app root>]/api/io`

:::note
All requests to these URL **must** use the `POST` method with multipart for data
(this is what does the `--form` arguments passed to the `curl` commands)
:::

Authentication
--------------

Access to the `/io` endpoint is granted by passing credentials the endpoint, which will be referred
to with the `<credentials>` placeholder in the rest of this document. Those credentials can be of different types:

- standard access:
  - `-u <login>:<password>`
  - a simple login and password of an active user in the platform
  - the user must not have a `FORCE_CHANGE_PASSWORD` flag (as it is the case for designer on a fresh install)
- a dedicated I/O password
  - `-u designer:<password>` (works only for the **designer** user)
  - passed as
    - a JVM argument `io.password`
    - an environment variable `IO_PASSWORD`
    - [legacy/unsafe] a system parameter `EAI <login>`
  - either in plain text, or hashed with the algorithm specified in `HASH_PASSWORD`
- API access
  - `-H "X-Simplicite-Authorization: Bearer $TOKEN"`, cf [API auth](/docs/integration/webservices/services-auth) first
  - on the `/api/io` endpoint

You can test it by using the following command:

```text
curl <credentials> --form "file=" <I/O URL>
```

Rights
------

The I/O interface uses, by default, the `system` pseudo user which is only granted the `ADMIN` group,
and thus only the groups being part of the `ADMIN` group's profile.

If you get "Object ... not granted" messages, make sure the considered object is allowed to
at least one of the groups of the `ADMIN` group profile.

Standard formats
----------------

The standard formats used by the standard I/O imports/exports are described in [this document](/docs/integration/webservices/standard-formats)

Imports
-------

To import data from a file `<file>` the command is:

```text
curl <credentials> --form service=<import command> --form file=@<file> [<extra parameters>] <I/O URL>
```

:::note

- The data to import can also be retrieved on the server side from an URL passed like this `--form url=<url>`.
- The data to import can also be submitted as raw data using `--form data=<raw data>`

:::

Where `<import command>` is one of :

- `xmlimport`: import a **standard XML** file
- `jsonimport`: import a **standard JSON** file
- `zipimport`: import a **standard ZIP** file
- `csvimport`: import a single object's **standard CSV** file with mandatory `<extra parameters>` = `--form object=<object name>`
- `adpimport`: import a custom file using an adapter with mandatory `<extra parameters>` = `--form adapter=<adapter name>`

And for the users having a responsibility on the `ADMIN` group:

- `moduleimport`: import a **standard XML/JSON or ZIP/tar.gz** using module strategy file
  with mandatory `<extra parameters>` = `--form module=<module name> --form version=<module version> --form zip=<true|false>`
  - an optional extra parameter can be set to use the diff mode import: `--form diff=<true|false>` (defaults to `true`)
- `modulesimport` (note the `modules` with an `s`): import a set of modules described by an **import specification**,
  the `file` parameter is here a JSON or YAML file using the same syntax as the one used during the startup's import specification phase,
  see [this document](/docs/operation/auto-setup/#import-spec) for details on the import specification syntax.
- `sqlscript`: execute a SQL script

- An optional extra parameter can be set to get processing logs or not: `--form log=<true|false>` (defaults to `false`)
- An optional extra parameter can be set to indicate processing logs output format: `--form output=<plain|xml>` (defaults to `plain`)

:::note
The standard formats are described [in this document](/docs/integration/webservices/standard-formats).
:::

Exports
-------

To export data in a file `<file>` the command is:

```text
curl <credentials> --form service=<export command> -o <file> [<extra parameters>] <I/O URL>
```

Where `<export command>` is one of :

- `xmlexport`: export an object data to a **standard XML** file with `<extra parameters>` = `--form object=<object name>`
  - an optional  extra parameter can be set to inline documents and images as Base64 strings
    in the XML file: `--form inlinedocs=<true|false>` (default is `false`)
- `jsonexport`: export an object data to a **standard JSON** file with `<extra parameters>` = `--form object=<object name>`
  - an optional  extra parameter can be set to inline documents and images as Base64 strings
    in the JSON file: `--form inlinedocs=<true|false>` (default is `false`)
- `zipexport`: export an object data to a **standard ZIP** file with `<extra parameters>` = `--form object=<object name>`
- `csvexport`: export an object data to a **standard CSV** file with `<extra parameters>` = `--form object=<object name>`

And for the users having a responsibility on the `ADMIN` group:

- `moduleexport`: export module configuration to a standard XML file with `<extra parameters>` = `--form module=<module name>`
  (restricted to users who have a responsibility on the `ADMIN` group)
  - an optional extra parameter can be set to indicate the output format: `--form zip=<true|false>` (defaults to `false`)
  - an optional extra parameter can be set to inline documents and images as Base64 strings in the XML file: `--form inlinedocs=<true|false>`
    (default is `false`, `true` does not make sense in case of ZIP export)
- `moduleexportdata` (as of **version 4.0**): export data of all module business objects marked with an export
  order in **standard XML** format (restricted to users who have a responsibility on the `ADMIN` group)
  Note that this service is primarily dedicated to export small amounts of reference and/or dev/test data as a complement to the module configuration.

:::note
The standard formats are described [in this document](/docs/integration/webservices/standard-formats).
:::

Git
---

As of **version 3.2**, to do a Git commit on a module, the command is:

```text
curl <credentials> --form service=modulecommit --form module=<module name> --form message="<commit message>" <I/O URL>
```

Others
------

### Clear cache

To flush server-side cache, the command is:

```text
curl <credentials> --form service=clearcache <I/O URL>
```

### Purge tasks

Various purge tasks can be processed using following commands:

```text
curl <credentials> --form service=<purge command> <I/O URL>
```

Where `<purge command>` is one of:

- `purgelogs`: purge logs
- `purgejobs`: purge cron jobs
- `purgesupervisions`: purge import supervisions entries
- `purgerecyclebin`: purge documents recycle bin
- `purgeexports`: purge exports
- `purgetempfiles`: purge temporary files
- `purgenodes`: purge nodes (as of version 6.3)

For `purgelogs`, `purgejobs`and `purgesupervisions` an additional parameter `depth` allows to preserve the latest records:

- If `depth` is **negative** it gives the number of days of records to keep (e.g. `depth=-7`: delete all except last week's records)
- If `depth` is **positive** it gives the number of records to keep (e.g. `depth=100`: delete all except the last 100 records)

### Indexation

To force indexation to be (re)built, the command is:

```text
curl <credentials> --form service=buildindex <I/O URL>
```

### Unit tests

To run all tests from a **test shared code**, the command is:

```text
curl <credentials> --form service=unittests --form test=<test shared code name> <I/O URL>
```

To run all unit tests shared codes of a **module**, the command is:

```text
curl <credentials> --form service=unittests --form module=<module name> <I/O URL>
```

To run all unit tests shared codes defined using an **import specification** file
(where only `module` and `unittests` must be defined), the command is:

```text
curl <credentials> --form service=unittests --form file=<import spec file> <I/O URL>
```

:::note
Some deprecated unit testing mechanisms can still be run although they **should**
be refactored as **test shared code**.

To run a **deprecated** business object's unit tests, the command is:

```bash
curl <credentials> --form service=unittests --form object=<business object name> <I/O URL>
```

To run a **deprecated** external object's unit tests, the command is:

```bash
curl <credentials> --form service=unittests --form extobject=<external object name> <I/O URL>
```

To run a **deprecated** business process's unit tests, the command is:

```bash
curl <credentials> --form service=unittests --form process=<business process name> <I/O URL>
```

:::

### Logs

To retrieve the server logs, the command is:

```bash
curl <credentials> --form service=logs <I/O URL>
```
