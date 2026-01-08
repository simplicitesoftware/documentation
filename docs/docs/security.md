---
sidebar_position: 110
title: Security guidelines
---

Security guidelines
===================

This document provides guidelines for improving security of applications based on the Simplicité platform.

> **Note**: These recommendations should be evaluated and adapted based on the specific requirements and context of each implementation.

Platform upgrades
-----------------

The platform regularly receives upgrades that potentially include security-related fixes.
The details of the fixes/changes are available in the release notes.

To ensure security, it is thus **mandatory** to keep deployed instances up-to-date.

Securing application endpoints
------------------------------

### Introduction

The Simplicité platform is designed to be secure, with nothing available without being explicitly granted.
However, particular attention must be paid to the following aspects.

There are 4 endpoints available on the Simplicité platform:

- the UI endpoint
- the API endpoint
- the I/O endpoint
- the Git endpoint

All of them are secured either by the standard authentication mechanisms (Java server's auth modules, OAuth2/OpenIDConnect or SAML flows)
that have been configured, except for the public features that are chosen to be exposed on the UI endpoint's public components (see below)

Locally stored passwords must be encrypted/hashed (see the `HASH_PASSWORD` system parameter) according to the local authentication configuration.
A second authentication factor **should** be enabled: standard TOTP via email, SMS or authentication applications is available as of version 5.2.

:::note
When possible, using an external authentication mechanism is always a better and more secure approach than using locally
stored password even with a second authentication factor.
:::

In particular, the `designer` user's password **must** be hard to guess (this is also applicable to any user granted with advanced rights)
and changed regularly.

Enforcing a second authentication factor (2FA) **should** also be considered. Ideally using an authentication application (e.g. Google or Microsoft Authenticator).

Alternatively, the `designer` user can be deactivated (or only some of its rights), at least when not used (but this may complicate delivery processes).

### UI endpoint

The UI endpoint has some public (non authenticated) components that may be used for the purpose of explicitly exposing some features publicly.

Particular attention **must** be paid to what is granted to the `public` user (through its default `PUBLIC` group or any other group that is granted)

### API endpoint

If the API endpoint is not used, it **should** be disabled by setting the private system parameter `USE_API` to `no`.

If it is only used from a limited set of origins, access to this endpoint **should** be filtered (e.g. by using the "whitelist" Docker
configuration or by a reverse proxy-level filtering).

At minimum, the API tester page **should** be disabled by setting the private system parameter `USE_API_TESTER` to `no`.

For more information on default API authentication mechanisms, see [this document](/docs/integration/webservices/services-auth).

### I/O endpoint

Access to the I/O endpoint **must** be secured.

The I/O endpoint is dedicated for batch import/exports, including business modules installations/upgrades and system upgrades and thus should
only be accessed from legitimate origins for these types of processes.

When the I/O endpoint is not used, it **may** be disabled by setting the private system parameter `USE_IO` to `no`.
This change **must** be reversible because this endpoint may be needed for "rescue" system patching.

If it is only used from a limited set of origins, access to this endpoint **should** be filtered (e.g. by using the "whitelist" Docker configuration
or by a reverse proxy-level filtering).

At minimum, the I/O tester page **should** be disabled by setting the private system parameter `USE_IO_TESTER` to `no`.

For more information default on I/O authentication mechanisms, see [this document](/docs/integration/webservices/io-commandline).

:::note
For backward compatibility reasons (and for particular cases) the I/O and Git endpoints **also** use the legacy authentication
method based on private system parameters named `EAI *` or, as of version 5, the `io.password` JVM argument or the `IO_PASSWORD` environment variable
which can contain either a plain text password (not recommended) or a non-salted hashed password using the configured hashing algorithm.
If there is no good reason to keep it all the time, this authentication method **should** be inhibited (at least when not needed)
by removing the corresponding system parameters, JVM argument or environment variable. Note that, as of minor version 5.1, it is not possible
to use the user's password if it is requested to be changed.
:::

:::note
The I/O endpoint is needed for multiple-nodes deployments to allow propagating various application-wide events amongst nodes (e.g. clear cache).
Setting appropriate network filtering and credentials is thus **required** in this particular case.
:::

### SSE endpoint

The `/ui/sse` endpoint provides a UI service to push messages from server to the authentified browser to update UI data (counters, locks...) on the fly.

- The standard SSE protocol uses HTTP GET **asynchronous** so the infrastructure must support this whithout breaking the socket
- Otherwise, the parameter `USE_SSE` must be set to `no` to disbaled this SSE feature: the UI will use polling to refresh some UI data

### Git endpoint

If the Git endpoint is used, its access **must** be secured.

This Git endpoint is only supposed to be used for business modules installation/upgrades and thus should only be accessed
from legitimate origins for these types of processes.

It is a variant of the corresponding module import/export features available on the I/O endpoint.

If the Git endpoint is not used, it **should** be disabled by setting the private system parameter `USE_GIT` to `no`.

If it is only used from a limited set of origins, access to this endpoint **should** be filtered
(e.g. by using the "whitelist" Docker configuration or by a reverse proxy-level filtering)

### Health-check

The `/health` page/service allows obtaining health-check technical information on a running instance.

Access to this URI **should** be secured by restricting access to the only IP in charge of technical monitoring.

This page/service can also be disabled by setting the `USE_HEALTH` system parameter to `no`.
This is relevant to disable it completely if, for instance, the JMX services of the platform (or a third party monitoring toolset)
are used for platform monitoring.

If it is only used from a limited set of origins, access to this endpoint **should** be filtered (e.g. by using the "whitelist" Docker
configuration or by a reverse proxy-level filtering)

### Maven repository

The instance exposes a Maven repository of the 3rd party Java components on the `/maven` URI.
This is only relevant in development.

Access to this URI **should** be secured in production.

This page/service can also be disabled by setting the `USE_MAVEN` system parameter to `no`.
This is relevant on production instances where this development-oriented feature is useless.

If it is only used from a limited set of origins, access to this endpoint **should** be filtered
(e.g. by using the "whitelist" Docker configuration or by a reverse proxy-level filtering)

> **Note**: this 3rd party components list is anyway public on the document website.

Consider disabling the inclusion of the `manifest.json` to the pages of the generic UI using the `USE_MANIFEST` system parameter.
As a matter of fact, due to the absence of the session ID cookie by some web browsers when downloading this manifest file, the session ID is passed
in the URL which makes it more visible than as a cookie (e.g; in an access log).

Securing your application's configuration and custom code
---------------------------------------------------------

### Public rights

Care must be taken regarding what is granted to the `public` user (typically through the `PUBLIC` group or by additional responsibilities
associated to this user) because everything granted to this user is made available on the public UI components

### Private system parameters

Ensure that all system parameters that hold confidential data that should not be available elsewhere than on the server side
(e.g. services credentials, passwords, ...) are configured as _Private_ type

### Secrets

If credentials/secrets need to be managed in system parameters (e.g. username/password of the SMTP server in the `MAIL_SERVICE` system parameter),
they **should** be passed as environment variables and use the environment variables substitutions
`[ENV:<environment variable name>]` in the configured system parameters to avoid storing these credentials/secrets in the database.

### Business object filtering

If there is a business object with dynamic filtering rules (e.g. implemented in the `postLoad` hook based on rules
on user's responsibilities and/or business object instance name), `1=2` **should** be set as the default static filtering rule.

As a matter of fact, if for any reason the code is not working well it will result in giving no access to any data instead of
giving access to all data.

### Forbidden fields

An _invisible_ business object field is still visible if the HTML of the UI is inspected and is still available on the API calls.
To ensure a field is only usable on the server side, it **must** be marked as _Forbidden_.

As above for filtering, if a field's visibility is dynamically set by code, ensure it is configured as _Forbidden_ in the static configuration.
If for any reason the code does not work, the field will remain by default not available.

### Cross site scripting vulnerabilities

If a **custom** page is implemented (e.g. via an external object), ensure to take into account the risk of
cross site scripting vulnerabilities (passing `<script>` or `<svg>` with script in a HTTP parameter).

Basic protection is to systematically display values obtained from HTTP parameters using `Tool.toHTML/toJS`.

The platform code implements such XSS prevention on all pages.

### SQL injection vulnerabilities

If **custom** SQL statements are written, ensure to take into account the risk of SQL injection vulnerabilities.

Basic protection is to systematically use host variables or, at least, protect the values inserted in SQL statements using `Tool.toSQL`.

The platform code implements such SQL injection prevention for all SQL statements.

### Restrict uploadable document or images MIME type

If objects include document or image type fields, a list of allowed MIME types **should** be explicitly added at the associated "book shells" record level.

### Restrict uploadable size for document or images

The maximum upload size of documents or images can be restricted by using the `MAX_UPLOAD_SIZE` system parameter.

Note that it is recommended to set such an upload size limit at Tomcat level and/or at the reverse proxy level.

### CRCF protection

If a **custom** page with a form is implemented, ensure to implement a CRCF protection mechanism.

The platform code implements such CRCF protection in all page with forms.

### Low level tools

System users (such as `designer`) have access by default to low level tools on the generic UI (database and document database browsers).
These tools are standard external objects that **should** be inhibited by removing grants on them if they are not used.

### Data encryption

Built-in (see the Data Encryption part in [code examples](/docs/core/advanced-code-examples)) or third party data encryption should be used,
especially when the database access is not limited to the application.

### Internal authentication

If internal authentication is used, securing it **should** be considered by adding a second authentication factor (2FA) and/or by implementing
custom rules (e.g.: disabling a login after a certain amount of erroneous password entry or enforcing appropriate password validation rules).
See [this document](/docs/authentication/internal-auth) for details.

The appropriate internal password hashing algorithm **should** also be used by setting the `HASH_PASSWORD` system parameter
(note that changing this algorithm will require that all users change their password).

The "salting" of the above hashed internal password **should** also be enabled using the flag system parameter `SALT_PASSWORD=yes`
(note that changing this flag will require that all users
change their password). As of version 6.2, a "pepper" string can also be added to this "salting" by configuring
an environment variable `HASH_PASSWORD_PEPPER` or a JVM property `hash.password.pepper`
(note that adding or changing this pepper string will also require that all users change their password).

Consider implementing an anti-brute policy by using appropriate `PlatformHooks`.
See [this document](/docs/authentication/internal-auth#anti-brute-force-attacks) for a comprehensive example.

Ensure the "god mode" (the ability to log in as any user) is disabled or restricted to the relevant users (e.g. support team).
The principle is to set the private system parameter `GOD_MODE` to `no` and override it by user only for the relevant users.

If all or some users don't always use a strictly personal browser, the ability of the browser to keep track
of the non-expired user tokens **should** also be disabled
(this allows switching between these users). This can be done by setting the private system parameter `USE_CHANGE_USER` to `no`.

### Custom HTTP headers

Although it should rather be done at the reverse proxy level (or at Tomcat level), it is possible to add custom HTTP headers
to all responses by setting the `HTTP_HEADER` system parameter.

The following example, that should be adapted to specific needs, does the following:

- The CSP policy is tailored to Simplicité's working
- STS should be set, 1year is generally considered a good value
- iframes limited to those of same origin
- deactivated XSS protection (a CORS policy is a better approach and **must be implemented**)
- specified Referrer-Policy

```json
{
    "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; font-src 'self' data:",
    "Strict-Transport-Security": "max-age=31536000",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "X-XSS-Protection": "0",
    "Referrer-Policy": "strict-origin-when-cross-origin"
}
```

### Same-site cookies policy

By default Tomcat sets the same-site cookie to `unset` (see [this page](https://tomcat.apache.org/tomcat-9.0-doc/config/cookie-processor.html)).

This can be changed by uncommenting the `CookieProcessor` block in the `META-INF/context.xml` of the webapp and setting the appropriate value.

:::note[Notes]

- The default value of this Tomcat setting is `lax` if you use our Docker images (or at least or pre-configured Tomcat)
- If an external authentication system such as an OAuth2/OpenIDConnect or SAML IdP is used, `lax` **must** be used instead of `strict`

:::

### Object usage

A feature allows users to get information about other users using the same records.

To avoid this usage data being available, it **should** be disabled by setting the private system parameter `USE_OBJECT_USAGE` to `no`.

### Websockets

Some features (including the one above) relies, by default, on a websockets-based communication.
Websockets can be globally inhibited by passing the `server.websocket=false` JVM argument.

### Development tools

Even if they are already restricted to profiles that should not be used in production (see above), some tools that are only relevant
in the context of development/testing **should** be disabled in production, in particular:

- Database access: to do so, the grants on the `DBAccess/DBDocAccess` external objects' function can be deactivated or deleted
- Logs viewer page: to do so, the grants on the `LogAccess` external object's function can be deactivated or deleted
- Logs forwarded to the browser's console, this can be inhibited by setting the `USE_WEBSOCKETS_LOGS` to `no` for all users
  (by default this system parameter is only enabled for the `designer` user)

These external objects can also simply be deleted, but this should not be done if the possibility to use these tools
for punctual maintenance/investigation activities needs to be kept.

Securing your infrastructure
----------------------------

### Introduction

The Simplicité platform runs on a server infrastructure. It **must** be secured properly by:

- configuring firewalls according to the configuration (the rules may be different whether Simplicité is deployed behind a reverse proxy server or directly)
- restricting access to the command line (VPN, SSH keys, ...) and system accounts
- protecting database credentials
Etc.

Simplicité has no particular requirement at this level, all usual good practices in securing server infrastructure apply.

### Use SSL

Application endpoints **should** always be exposed as HTTPS (SSL). This can be achieved directly in the Java application server that runs Simplicité
or at the reverse proxy level (if one has been configured).

### SSH Access

Server infrastructure command line access **should** always use SSH (ideally key-based) authentication (and the keys should be secured by a robust passphrase).

### System updates

- Server infrastructure **must** be kept up-to-date by applying **all** system updates on the fly. Many security vulnerabilities are at OS-level.
- The JVM, database server, JDBC driver and Java application server **must** be kept up-to-date.
- Simplicité updates **must** be applied as soon as they are made available

> **Note**: the warranty is void on a non up-to-date platform, keeping the Simplicité platform up-to-date is not just **recommended** it is **mandatory**.

Securing Docker-based deployments
---------------------------------

If the platform is deployed using Docker images, the security of the deployed container(s) can be strengthened by applying an
[**hardened** deployment configuration](https://github.com/simplicitesoftware/docker/blob/master/examples/docker-compose/docker-compose-secure.yml)

In this example, all useless capabilities of the container are disabled, it runs in read only mode and
all working directories are mounted as temporary filesystems volumes.

This example needs to be adjusted to the particular case (e.g. by using persistent volumes instead of temporary volumes where needed, etc.)

Standard Docker images are rebuilt regularly with an up-to-date system base OS, an up-to-date JVM, an up-to-date
Tomcat server and the latest platform revision. Deployed containers **must** be updated using the latest Docker
images on a regular basis.

And of course, system upgrades **must** also be applied on the host machine on a similar regular basis.

Securing the Simplicité Instance Manager (SIM)
----------------------------------------------

These are specific guidelines for the Simplicité Instances Manager (SIM). See [this document](https:/docs/misc/manager) for details on the SIM.

### SIM credentials

Strong passwords must be used for SIM users passwords (for UI and API access). Better, SSL client certificates should be used for authentication.
When connecting over SSH, only secured SSH keys should be used.

### Web-based terminal access

The web-based terminal access (ShellInABox) should not be enabled unless it is **absolutely** needed
(keep in mind it is a rather insecure feature that only makes sense on a non-production, highly secured infrastructure).
