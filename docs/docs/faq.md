---
sidebar_position: 140
title: FAQ
---

Getting Help  - FAQ
============

General support
---------------

Having trouble using Simplicité or getting started?

- Join our community forum at [community.simplicite.io](https://community.simplicite.io) to get help from the Simplicité team.
- See the [tutorial](/tutorial/welcome) for a step-by-step guide to get started.
- Search the following FAQ for answers to frequently asked questions.

Frequently Asked Questions
--------------------------

This FAQ consolidates commonly recurring questions from community threads and documentation.

Versions
--------

### Which version should I use?

If you start a **new project** make sure to **always** use the [current version](/versions/),
avoid using any legacy major or minor versions even if it is still in its long term maintenance (LTS).

If you plan to work on an **existing project** using a legacy major version make sure to upgrade
to the current maintenance revision of its latest minor version (and if the considered major version is not maintained anymore
make sure to upgrade to a maintained major version). Anyway you should also consider upgrading to the current
major version.

### What is the current maintenance status of major version `x` or minor version `x.y`?

Please review [this document](/versions/versioning.md) as well as the [release notes](/versions/) for the considered version.

Installation / Operation
------------------------

### Is it possible to use the _foo_ database, the _bar_ application server, the _baz_ JVM version, etc.?

Please consult the [compatibility tables](/docs/compatibility) for supported platforms and configurations.

For details on some specific installation/operation requirements, please refer to the miscellaneous documentation.

Usage
-----

### Where can I find general usage documentation for the generic web user interface?

Comprehensive information is available in the user interface documentation.
Starting with [this document](/docs/ui/basic-usage.md).

Design
------

### Where should I begin when building my first business application?

It is recommended to start with the [Getting Started guide](/tutorial/welcome.md).

### Is it possible to have a business object search page with a default "starts with" search mode (as in the selection popups)?

This feature is not yet available, but it is planned for a future release. Currently, it is necessary to use an explicit `*` wildcard.

### How can I configure the number of rows displayed in a list?

This is a global setting defined at the user level (minimum and maximum number of rows per list) and can also be configured dynamically at the list level.
For business objects with a small number of rows, pagination can be disabled so that all rows are displayed.

Please note that displaying lists with a large number of rows and many visible fields may result in significant page sizes, which can
negatively impact performance and usability.

> Is it possible to have "combo" fields with a fixed list of values and the ability to enter a custom value?

Partially. While HTML does not natively support combo box fields, there are two recommended approaches:

- Configure a non-mandatory fixed list of values field with an additional text field for custom values. Using constraints,
  the text field can be set as mandatory when no list value is selected.
- Configure a text field with auto-completion: the field will suggest previously entered values and allow selection
  of existing values or entry of new values.

UI / lists / forms
------------------

### How can I distinguish **list** vs **form** context (and avoid code running “too often”)?

Many “strange” behaviors come from the fact that the same business object can be instantiated
in multiple UI contexts (main list, panel/child list, treeview, etc.).
Avoid heavy logic in overly generic hooks, and apply configuration conditionally based on
instance/context (e.g. `initList` vs `initForm`, main instance vs panel vs treeview) to avoid
paying the cost (queries, computations) where it is not needed.

- **See also**:
  - [Business object code hooks](/docs/core/objects/businessobject-code-hooks)
  - [Platform hooks](/docs/core/platform-hooks)

### How do I hide the **Create** button in a list (often a **child list**) without breaking other buttons/actions?

If you disable creation with a global rule, you can inadvertently affect expected UI behaviors
(standard navigation, “Associate…”, etc.).
Prefer a targeted approach per instance (e.g. main list allowed, child list forbidden) rather
than a blanket disablement.

### How can I dynamically filter/hide values in a **list of values (LOV)** / **enum**?

The simplest pattern is often to **switch** the LOV (change which list is used) based on a
condition (e.g. via a constraint), rather than trying to hide codes one by one.
For very fine-grained cases (hide only a few codes), you may need to redesign the LOVs or use
code.

- **See also**:
  - [List of values](/make/businessobjects/Listofvalues)
  - [Impacts](/make/businessobjects/impacts)

Actions / constraints / hooks
-----------------------------

### How can I show an **action** only for a group, or for the current “owner/manager” (or both)?

Clearly separate:

- **security** (who can execute) via permissions/authorizations
- **UI convenience** (show/enable) via a visibility/enabling constraint

Then combine conditions (often an OR between “current user = owner” and “user has
group/responsibility X”) to match the requirement.

- **See also**:
  - [Permissions](/docs/core/permissions)
  - [Expressions](/docs/core/expressions)
  - [Custom actions examples](/docs/core/custom-actions-examples)

### Why don’t some `initXXX` hooks run through the REST API (RESTMappedObject)?

Depending on the entry point (UI vs REST, mapped REST, etc.), the platform may not follow
exactly the same execution paths.
Avoid putting essential business rules only in very UI-contextual hooks
(e.g. `initCreate`, `initUpdate`), and prefer validation/save-level hooks or shared methods
invoked from multiple channels.

- **See also**:
  - [REST services](/docs/integration/webservices/rest-services)
  - [Platform hooks](/docs/core/platform-hooks)
  - [Business object code hooks](/docs/core/objects/businessobject-code-hooks)

Documents / email
-----------------

### Why does a document work in the UI but fail in async hooks or as an email attachment?

Two common causes:

- **Async execution**: nothing guarantees that UI-provided data (including an upload) is still
  available when the job runs.
  For actions with uploads, the file is stored temporarily server-side: retrieve the temporary
  upload (e.g. via `doc.getUploadFile()`), then process asynchronously from that file/stream.
  Avoid relying on `getBytes()` unless the file is guaranteed to be in memory.
- **Record selection/permissions**: the record that carries the document may not be correctly
  **selected/loaded** when the mail API attempts to read the document field, or the grant may
  lack read rights.
  Verify `select(rowId)` (or the equivalent in your flow) before attaching the document, and
  check permissions.

- **See also**:
  - [Documents code examples](/docs/core/documents-code-examples)
  - [Email how-to](/docs/misc/email-howto)
  - [Logging](/docs/misc/logging)
  - [PDF publications](/docs/integration/publications/pdf)

### Why do I get a 404 when downloading a document (document exists but is inaccessible)?

A 404 can be caused not by the file itself but by access checks on the **supporting business
record** (rights, filters, search-spec, etc.).
If the user cannot “see” the record that carries the document, the document service may refuse
to serve the file.

- **See also**:
  - [Security](/docs/security)
  - [Documents code examples](/docs/core/documents-code-examples)
  - [External objects](/tutorial/enhancing/external-object)

SSO / OpenID Connect / Azure AD
-------------------------------

### OpenID Connect: what URIs should I use for **redirect** and **logout**?

- **Redirect URI** (application side): typically `<base URL>/oauth2callback` (see docs).
- **Logout**: there are two URLs depending on the chosen flow:
  - the logout URL to configure in Simplicité is your IdP’s logout URL
  - the logout URL to configure in the IdP to return to the app is typically `<base URL>/logout`

- **See also**:
  - [OAuth2 / OpenID Connect](/docs/authentication/oauth2)
  - [Keycloak](/docs/authentication/keycloak)
  - [Microsoft Entra ID (Azure AD)](/docs/misc/entraid)

### Azure AD / OIDC: why can it “loop” between user creation and update on login?

When sessions and rights are (re)loaded, an inconsistent scope/home configuration
(or inconsistent mapping between login/UPN/email) can trigger reloads and look like repeated
create/update loops.
Verify the chosen technical login, profile attributes/scope (e.g. home) assigned to the user,
and how they align with responsibilities.

- **See also**:
  - [Microsoft Entra ID (Azure AD)](/docs/misc/entraid)
  - [Security](/docs/security)
  - [Authentication providers](/docs/authentication/auth-providers)

Git / DevOps
------------

### A Git push from Simplicité reports “success” but nothing arrives on the remote. How do I diagnose?

The platform push corresponds to a standard `git push` executed in the module’s server-side
Git repository.
If your remote enforces non-standard mechanisms (e.g. automatic MR/PR creation, server rules,
branch protections), Simplicité may consider the operation “OK” while the remote behaves
differently than expected.
The most reliable diagnosis is to clone the module’s Git repository locally (from the
instance), fetch the commits, then push to the remote from an environment where you can clearly
see server responses.

- **See also**:
  - [Git repositories](/docs/integration/webservices/git-repositories)
  - [Collaborative coding](/docs/devops/collaborative-coding)

Cache / performance / migration
-------------------------------

### Should I automate a daily “clear cache”? (and what about clusters)

In general, no: a scheduled cache clear is not needed outside deployments, unless it is
masking an underlying problem (memory, context, etc.).
In a cluster, the internal task `CheckClearCache` is mainly used to propagate invalidation if
a node missed the notification.
If you must trigger a reset from code, a dedicated action can call `SystemTool.resetCache(...)`
(admin grant), acknowledging the impact (sessions, temporary unavailability, etc.).

- **See also**:
  - [System parameters list](/docs/core/system-parameters-list)
  - [Platform hooks](/docs/core/platform-hooks)
  - [Docker operation](/docs/operation/docker)

### Performance: why can large/bulk PDF exports saturate CPU/heap, and what safeguards should I apply?

PDF export is often more expensive than other formats (generation, memory buffers, libraries).
Avoid launching “export everything” from the UI; prefer batch/offline exports, limits
(row count), confirmations, and/or permission-based restrictions.
For large volumes, prefer streaming/batching approaches and functional guardrails.

- **See also**:
  - [Exporting (tutorial)](/tutorial/getting-started/exporting)
  - [PDF publications](/docs/integration/publications/pdf)
  - [Sizing](/docs/operation/sizing)

### Migration/upgrade (e.g. v5 → v6): what typical breaking changes can block a migration?

Blocks often come from dependency/API changes (e.g. PDF libraries) or hooks/extension points
that were modified/removed between versions.
The most robust approach is to compile/validate modules against the target toolchain
(BOM/dependencies), fix compilation errors, and only then import/validate on the migrated
instance.

- **See also**:
  - [Versioning policy](/versions/versioning.md)
  - [Versions index](/versions/versions.md)
  - [Release notes](/versions/release-notes/v7-0)

Coding
------

### Server-Side Scripts

> Where can I find general documentation and code samples for server-side scripting?

The [core documentation](/category/core) provides code examples covering general usage, business object hooks,
business workflow hooks, adapters, publications, and dispositions.

> Are there any limitations or common pitfalls in server-side scripts that I should be aware of?

**Yes.** Please refer to [this documentation](/docs/core/basic-code-examples) for important information on best practices and potential issues to avoid.

### Integration / APIs

> Where can I find general documentation on integration interfaces, APIs, and code samples?

- Code samples for core configuration items (business objects, workflows, dispositions, adapters, etc.) are available in the [core documentation](/category/core).
- Information on integration interfaces (CLI, web services, etc.) can be found in the [integration documentation](/category/integration).
- Documentation for helper libraries (Ajax, etc.) is available in the [APIs documentation](/category/libraries).

Logs
----

### Can I change log retention/rotation (Tomcat / Log4J) safely?

Yes, but verify the impact on tools/screens that read specific files (e.g. reading
`simplicite.log`).
Adjusting rotation/retention is generally fine (especially if you externalize logs to an
observability solution), but keep in mind legacy usages based on local files.

- **See also**:
  - [Logging](/docs/misc/logging)
  - [Log viewing](/docs/misc/log-viewing)
  - [Tomcat operation](/docs/operation/tomcat-operation)
