---
sidebar_position: 110
title: Security guidelines
---

Security guidelines
===================

This document give some guidelines on how to improve security of your applications based on the Simplicité platform.

> **Note**: Some recommendations are not necessarily applicable/relevant in every particular cases, you must adapt them to your context.

Platform upgrades
-----------------

The platform regularly receive upgrades that potentially include security related fixes.
The details of the fixes/changes are available in the release notes.

To ensure security it is thus **mandatory** to keep your deployed instances up-to-date.

Securing application endpoints
------------------------------

### Introduction

The Simplicité platform is designed to be secure, nothing is available without being explicitly granted.
However a particular attention must be put on the following aspects.

There are 4 endpoints available on Simplicité platform:

- the UI endpoint
- the API endpoint
- the I/O endpoint
- the Git endpoint

All of them are secured either by the standard authentication mechanisms (Java server's auth modules, OAuth2/OpenIDConnect or SAML flows) you have configured
except the public features that you choose to expose on the UI endpoint's public components (see below)

Locally stored password must be encrypted/hashed (see the  `HASH_PASSWORD` system parameter) accordingly to your local authentication configuration.
And a second authentication factor **should** be enabled: standard TOTP via email, SMS or authentication applications is available as of version 5.2.

> **Note**: When possible, using an external authentication mechanism is always a better and more secure approach than using locally stored password even with a second authentication factor.

In particular the `designer` user's password **must** be hard to guess (this is also applicable to any user granted with advanced rights) and changed regularly.
Enforcing a second authentication factor (2FA) **should** also be considered. Ideally using an authentication application (e.g. Google or Microsoft Authenticator)
Alternatively the `designer` user can be deactivated (or only some of its rights), at least when not used (but this may complexify delivery processes).

### UI endpoint

The UI endpoint has some public (non authenticated) components that may be used for the purpose of explicitly exposing some features publicly.

A particular attention **must** be put on what is granted to the `public` user (through its default `PUBLIC` group or any other group that you grant him)

### API endpoint

If you don't use the API endpoint you **should** disable it by setting the private system parameter `USE_API` to `no`.

If you only use it from a limited set of origins you **should** filter the access to this endpoint (e.g. by using the "whitelist" Docker configuration or
by a reverse proxy-level filtering)

At least you **should** disable the API tester page by setting the private system parameter `USE_API_TESTER` to `no`.

For more information on default API authentication mechanisms, see [this document](/docs/integration/webservices/services-auth).

### I/O endpoint

You **must** secure access to the I/O endpoint.

The I/O endpoint is dedicated for batch import/exports, including business modules installations/upgrades
and system upgrades and thus should only be accessed from legitimate origins for these kind of processes.

When you don't use the I/O endpoint you **may** disable it by setting the private system parameter `USE_IO` to `no`.
This change **must** be reversible because you may need this endpoint for "rescue" system patching.

If you only use it from a limited set of origins you **should** filter the access to this endpoint
(e.g. by using the "whitelist" Docker configuration or by a reverse proxy-level filtering)

At least you **should** disable the I/O tester page by setting the private system parameter `USE_IO_TESTER` to `no`.

For more information default on I/O authentication mechanisms, see [this document](/docs/integration/webservices/io-commandline).

> **Note 1**: for backward compatibility reasons (and for particular cases) the I/O and Git endpoints **also** use the legacy authentication
> method bases on private system parameters names `EAI *` or, as of version 5, the `io.password` JVM argument or the `IO_PASSWORD` environment variable
> which can contain either a plain text password (not recommended) or a non salted hashed password using the configured hashing algorithm.
> If you have no good reason to keep it all the time, this authentication method **should** be inhibited (at least when you don't need it)
> by removing the corresponding system parameters, JVM argument or environment variable. Note that, as of minor version 5.1, it is not be possible
> to use the user's password if it is requested to be changed.

> **Note 2** the I/O endpoint is needed for multiple-nodes deployments to allow propagating various application-wide events amongst nodes (e.g. clear cache).
> Setting appropriate network filtering and credentials is thus **required** in this particular case.

### Git endpoint

If you use the Git endpoint you **must** secure its access.

This Git endpoint is only supposed to be used for business modules installation/upgrades and thus should only be accessed
from legitimate origins for these kind of processes.

It is a variant of the corresponding module import/export features available on the I/O endpoint.

If you don't use the Git endpoint you **should** disable it by setting the private system parameter `USE_GIT` to `no`.

If you only use it from a limited set of origins you **should** filter the access to this endpoint
(e.g. by using the "whitelist" Docker configuration or by a reverse proxy-level filtering)

### Health-check

The `/health` page/service allow you to get health-check technical information on a running instance.

You **should** secure the access to this URI by restricting access to the only IP in charge of technical monitoring.

You can also disable this page/service by setting the `USE_HEALTH` system parameter to `no`.
This is relevant to disable it completely if, for instance, you use the JMX services of the platform (or a third party monitoring toolset) for the platform monitoring.

If you only use it from a limited set of origins you **should** filter the access to this endpoint
(e.g. by using the "whitelist" Docker configuration or by a reverse proxy-level filtering)

### Maven repository

The instance exposes a Maven repository of the 3rd party Java components on the `/maven ` URI.
This is only relevant in development.

You **should** secure the access to this URI in production.

You can also disable this page/service by setting the `USE_MAVEN` system parameter to `no`.
This is relevant on production instance on which this development-oriented feature is useless.

If you only use it from a limited set of origins you **should** filter the access to this endpoint
(e.g. by using the "whitelist" Docker configuration or by a reverse proxy-level filtering)

> **Note**: this 3rd party components list is anyway public on the document website.

You **may** also consider disabling the inclusion of the `manifest.json` to the pages of the generic UI using the `USE_MANIFEST` system parameter.
As a matter of fact, due to the absence of the session ID cookie by some web browser when downloading this manifest file, the session ID is passed
in the URL which makes it more visible than as a cookie (e.g; in an access log).

Securing your application's configuration and custom code
---------------------------------------------------------

### Public rights

Be careful on what you grant to the `public` user (typically through the `PUBLIC` group or by additional responsibilities associated to this user)
because everything granted to this user is made available on the public UI components

### Private system parameters

Be sure to configure as _Private_ type all system parameters that holds confidential data that you don't want to be available elsewhere
than on the server side (e.g. services credentials, passwords, ...)

### Secrets

If you have to manage credentials/secrets in your system parameters (e.g. username/password of your SMTP server in the `MAIL_SERVICE` system parameter) you
**should**  pass them as environment variables and use the environment variables substitutions `[ENV:<environment variable name>]` in the configured system
parameters to avoid storing these credentials/secrets in the database.

### Business object filtering

If you have a business object with dynamic filtering rules (e.g. implemented in the `postLoad` hook based on rules on user's responsibilities and/or business object instance name),
you **should** set `1=2` as default static filtering rule. As a matter of fact, if for any reason you code is not working well it will result in giving no access to any data instead of
giving access to all data.

### Forbidden fields

A _invisible_ business object field is still visible if you inspect the HTML of the UI and is still available on the API calls. To be sure a field is only usable on the
server side you **must** mark it _Forbidden_.

As above for filtering, if a field's visibility is dynamically set by code, be sure to configure it as _Forbidden_ in your static configuration. If for any reason your code
does not work the field will remain by default not available.

### Cross site scripting vulnerabilities

If you implement a **custom** page (e.g. via an external object), make sure to take into account the risk of cross site scripting vulnerabilities (passing `<script>` or `<svg>` with script
in a HTTP parameter). Basic protection is to systematically display values got from HTTP parameters using `Tool.toHTML/toJS`.

The platform code implements such XSS prevention on all pages.

### SQL injection vulnerabilities

If you write **custom** SQL statements make sure to take into account the risk of SQL injection vulnerabilities. Basic protection is to systematically use host variables or, at least, protect the values inserted in your SQL statements using `Tool.toSQL`.

The platform code implements such SQL injection prevention for all SQL statements.

### Restrict uploadable document or images MIME type

If your objects include document or image type filed you **should** explicitly add a list of allowed MIME types at the associated "book shells" record level.

### Restrict uploadable size for document or images

It is possible to restrict the maximum upload size of document or images by using the `MAX_UPLOAD_SIZE` system parameter.

Note that it is recommended to set such an upload size limit at Tomcat level and/or at the reverse proxy level.

### CRCF protection

If you implement a **custom** page with a form, make ur to implement a CRCF protection mechanism.

The platform code implements such CRCF protection in all page with forms.

### Low level tools

System users (such as `designer`) have access by default to low level tools on the generic UI (database and document database browsers). These tools are standard external objects
they **should** be inhibited by removing grants on them if you don't use them.

### Data encryption

Use built-in (see the Data Encryption part in [code examples](/docs/core/advanced-code-examples)) or third party data encryption especially when the database access is not limited to the application.

### Internal authentication

If you use the internal authentication you **should** consider securing it by adding a second authentication factor (2FA) and/or by implementing custom rules (e.g.: disabling a login
after a certain amount of erroneous password entry or enforcing appropriate password validation rules). See [this document](/docs/authentication/internal-auth) for details.

You **should** also use the appropriate internal password hashing algorithm by setting the `HASH_PASSWORD` system parameter (note that changing this algorithm will require that all your users
change their password).

You **should** also enable the "salting" of the above hashed internal password using the flag system parameter `SALT_PASSWORD=yes` (note that changing this flag will require that all your users
change their password). As of version 6.2 you can also add a "pepper" string to this "salting" by configuring an environment variable `HASH_PASSWORD_PEPPER` or a JVM property `hash.password.pepper`
(note that adding or changing this pepper string will also require that all your users change their password).

You **may** also consider implementing an anti-brute policy by using appropriate `PlatformHooks`. See [this document](/docs/authentication/internal-auth#anti-brute-force-attacks) for a comprehensive example.

You **should** also make sure the "god mode" (the ability to log in as any user) is disabled or restricted to the relevant users (e.g. support team).
The principle is to set the private system parameter `GOD_MODE` to `no` and override it by user only for the relevant users.

If all or some your users don't always use a strictly personal browser you **should** also disable the ability of the browser to keep track of the non expired user tokens
(this allows to switch between these users). You can do so by setting the private system parameter `USE_CHANGE_USER` to `no`.

### Custom HTTP headers

Although it should rather be done at the reverse proxy level (or at Tomcat level), it is possible to add custom HTTP headers to all responses by setting the `HTTP_HEADER` system parameter.

The following example, that should be adapted be adapted to your own needs, does the following:
- The CSP policy is tailored to Simplicité's working
- STS should be set, 1year is generally considered a good value
- iframes limited to those of same origin
- deactivated XSS protection (a CORS policy is a better approach and **must be implemented**)
- specified Referrer-Policy
- force cache to verify content (no-cache does **not** mean absence of cache, but forces the browser to verify that cached files were not tampered)

```json
{
    "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; font-src 'self' data:",
    "Strict-Transport-Security": "max-age=31536000",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "X-XSS-Protection": "0",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Cache-Control": "no-cache"
}
```

### Same-site cookies policy

By default Tomcat sets the same-site cookie to `unset` (see [this page](https://tomcat.apache.org/tomcat-9.0-doc/config/cookie-processor.html)).

This can be changed by uncommenting the `CookieProcessor` block in the `META-INF/context.xml` of the webapp and setting the appropriate value in your case.

**Note**: If you use an external authentication system such as an OAuth2/OpenIDConnect or SAML IdP you must  use `lax` instead or `strict`

### Object usage

A feature allows users to get information about other users using the same records.

To avoid this usage data to be available **should**  disable the by setting the private system parameter `USE_OBJECT_USAGE` to `no`.

### Websockets

Some features (including the one above) relies, by default, on a websockets-based communication.
Websockets can be globally inhibited by passing the `server.websocket=false` JVM argument.

### Development tools

Even if they are already restricted to profiles that should not be used in production (see above), some tools that are only relevant in the context of development/testing **should** be disabled in production,
in particular:

- Database access: to do so you can deactivate or delete the grants on the `DBAccess/DBDocAccess` external objects' function
- Logs viewer page: to do so you can deactivate or delete the grants on the `LogAccess` external object's function
- Logs forwarded to the browser's console, this can be inhibited by setting the `USE_WEBSOCKETS_LOGS` to '`no`for all users
  (by default this system parameter is only enabled for the `designer` user)

You can also simply delete these external objects, but don't do it if you want to keep the possibility to use these tools for punctual maintenance/investigation activities.

Securing your infrastructure
----------------------------

### Introduction

Simplicité platform run on a server infrastructure. You **must** secure it properly by:

- configuring firewalls accordingly to your configuration (the rules may be different whether you deploy Simplicité behind a reverse proxy server or directly)
- restricting access to the command line (VPN, SSH keys, ...) and system accounts
- protecting database credentials
Etc.

Simplicité has no particular requirement at this level, all usual good practices in securing server infrastructure applies.

### Use SSL

Your application endpoints **should** always be exposed as HTTPS (SSL). This can be achieved directly in the Java application server that runs Simplicité
or at the reverse proxy level (if you have configured one).

### SSH Access

The server infrastructure command line access **should** always use SSH (ideally key-based) authentication (and the keys should be secured by a robust passphrase).

### System updates

- Your server infrastructure **must** be kept up-to-date by applying **all** system updates on the fly. Many security vulnerabilities are at OS-level.
- The JVM, database server, JDBC driver and Java application server **must** be kept up-to-date.
- The Simplicité updates **must** be applied as soon as they are made available

> **Note**: the warranty is void on a non up-to-date platform, keeping your Simplicité platform up-to-date is not just **recommended** it is **mandatory**.

Securing Docker-based deployments
---------------------------------

If you deploy the platform using Docker images you can strengthen the security of the deployed container(s) by applying an
[**hardened** deployment configuration](https://github.com/simplicitesoftware/docker/blob/master/examples/docker-compose/docker-compose-secure.yml)

In this example all useless capabilities of the container are disabled, it runs in read only mode and all working directories are mounted as temporary filesystems volumes.
You need to adjust this example to your particular case (e.g. by using persistent volumes instead of temporary volumes where needed, etc.)

Our standard Docker images are rebuilt regularly with an up-to-date system base OS, an up-to-date JVM, an up-to-date Tomcat server and the latest platform revision.
You **must** update the deployed containers using the latest Docker images on a regular basis.

And of course, you **must** also apply the system upgrades on your host machine on similar a regular basis.

Securing the Simplicité Instance Manager (SIM)
----------------------------------------------

These are specific guidelines for the Simplicité Instances Manager (SIM). See [this document](https:/docs/misc/manager) for details on the SIM.

#### SIM credentials

You must use strong password for your SIM users passwords (for UI and API access). Better, use SSL client certificates for authentication.
When connecting over SSH, use only secured SSH keys.

#### Web-based terminal access

Don't enable the web-based terminal access (ShellInABox) unless you **absolutely** need it (keep in mind it is a rather insecure feature
that only makes sense on a non-production, highly secured infrastructure).

