---
sidebar_position: 140
title: FAQ
---

Frequently Asked Question
=========================

General / installation / operation
------------------------------

> Is it possible to use the _foo_ database, the _bar_ application server, the _baz_ JVM version, ...?

Please refer to the [compatibility tables](/docs/compatibility).

For details on some specific installation/operation requirements, please refer to the miscellaneous documentation.

Versions
--------

> What is the current maintenance status of version `x.y`?

Please check [this document](/versions/versioning.md) and the latest release notes of considered version.

Usage
-----

> Where can I find general usage documentation for the generic web UI?

You can find such information the the UI documentation.

Design
------

### General

> Where to starts with to build my first business application?

A good start is the [Getting started](/tutorial/welcome.md)

### Business objects

> Is it possible to have a business object search page with a default mode using a "starts with" strategy (as in the selection popups) ?

Not yet, this is in the roadmap for next version. At that stage you still need to type an explicit `*` wildcard.

> How can we set the number of rows in list ?

This is a global setting defined at user level (min and max number of rows per lists) and dynamically configurable at list level.
For business objects with few rows you can inhibit the pagination, then all rows will be displayed

Keep in mind that lists with a high number of rows combined with many fields visible on lists will result in huge page volumes with poor performances (and low useability).

> Is it possible to have &quot;combo&quot; fields with a fixed list of values and the ability to type in another value ?

Yes and no.

There are no combo box fields (this is not a HTML standard anyway). There are at least two approaches:

* You can configure a non mandatory fixed list of values field and an additional text field for the &quot;other&quot; value.
Then with a constraint you can, for instance, make the text field mandatory if the list field is not set.
* You can configure a text field with completion: already typed values will display as you type and you can select them or type a new value.

<!-- 
### Business workflows
-->

Coding
------

### Server side scripts

> Where can I find general documentation and code samples on server side scripting?

You can browse the [core documentations](/category/core) for code examples (general, business objects hooks, business workflows hooks, adapters, publications, dispositions, ...).

> Are there some limitations or usual traps on the server side scripts that I should be aware of?

**Yes!** Please refer to [this documentation](/docs/core/basic-code-examples) for details on things to avoid (to avoid headaches). 

### Integration/APIs

> Where can I find general documentation on integration interfaces, APIs, code samples...?

* Code samples for core configuration items (business objects, workflows, disposition, adapters, ...) in the [core documentation](/category/core)
* Integration interfaces usage (CLI, web services, ...) in the [integration documentation](/category/integration)
* Helper libs (Ajax, ...) in the [APIs documentation](/category/librairies)

Configuration
-------------

>

> How can I configure the logging of the application?

Please refer to [this document](/docs/misc/logging.md)
