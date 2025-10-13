---
sidebar_position: 140
title: FAQ
---

Frequently Asked Question
=========================

General / Installation / Operation
----------------------------------

> Is it possible to use the _foo_ database, the _bar_ application server, the _baz_ JVM version, etc.?

Please consult the [compatibility tables](/docs/compatibility) for supported platforms and configurations.

For details on some specific installation/operation requirements, please refer to the miscellaneous documentation.

Versions
--------

> What is the current maintenance status of version `x.y`?

Please review [this document](/versions/versioning.md) as well as the latest release notes for the version in question.

Usage
-----

> Where can I find general usage documentation for the generic web user interface?

Comprehensive information is available in the user interface documentation.

Design
------

### General

> Where should I begin when building my first business application?

It is recommended to start with the [Getting Started guide](/tutorial/welcome.md).

### Business Objects

> Is it possible to have a business object search page with a default "starts with" search mode (as in the selection popups)?

This feature is not yet available, but it is planned for a future release. Currently, it is necessary to use an explicit `*` wildcard.

> How can I configure the number of rows displayed in a list?

This is a global setting defined at the user level (minimum and maximum number of rows per list) and can also be configured dynamically at the list level. For business objects with a small number of rows, pagination can be disabled so that all rows are displayed.

Please note that displaying lists with a large number of rows and many visible fields may result in significant page sizes, which can negatively impact performance and usability.

> Is it possible to have "combo" fields with a fixed list of values and the ability to enter a custom value?

Partially. While HTML does not natively support combo box fields, there are two recommended approaches:

* Configure a non-mandatory fixed list of values field with an additional text field for custom values. Using constraints, the text field can be set as mandatory when no list value is selected.
* Configure a text field with auto-completion: the field will suggest previously entered values and allow selection of existing values or entry of new values.

<!-- 
### Business workflows
-->

Coding
------

### Server-Side Scripts

> Where can I find general documentation and code samples for server-side scripting?

The [core documentation](/category/core) provides code examples covering general usage, business object hooks, business workflow hooks, adapters, publications, and dispositions.

> Are there any limitations or common pitfalls in server-side scripts that I should be aware of?

**Yes.** Please refer to [this documentation](/docs/core/basic-code-examples) for important information on best practices and potential issues to avoid.

### Integration / APIs

> Where can I find general documentation on integration interfaces, APIs, and code samples?

* Code samples for core configuration items (business objects, workflows, dispositions, adapters, etc.) are available in the [core documentation](/category/core).
* Information on integration interfaces (CLI, web services, etc.) can be found in the [integration documentation](/category/integration).
* Documentation for helper libraries (Ajax, etc.) is available in the [APIs documentation](/category/libraries).

Configuration
-------------

> How can I configure application logging?

Please refer to [this document](/docs/misc/logging.md) for details.
