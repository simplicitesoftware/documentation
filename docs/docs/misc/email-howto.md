---
sidebar_position: 260
title: Email howto
---

E-mail howto
============

This document shows how to configure application server's e-mail service that is used by Simplicité to send e-mails.

Configuration-level configuration
---------------------------------

As of version 3.1 it is possible to configure the mail service properties as JSON in the `MAIL_SERVICE` system parameter.

As of version 4.0 it is strongly recommended to use this kind of configuration over the legacy context-level configuration (see bellow).

As of version 5.3 it is possible to pass the mail service configuration as the `MAIL_SERVICE` environment variable instead of the system parameter
(if both are present only the environment variable is taken into account). YAML syntax instead of JSON is also possible as of version 5.3.

For instance, to use a simple SMTP server you can set it like this:

```json
{
	"mail.transport.protocol": "smtp",
	"mail.smtp.host": "<SMTP host>",
	"mail.smtp.port": "<SMTP port>",
	"mail.from": "<default sender email address>",
	"mail.debug": "<true|false>"
}
```

When `mail.debug` is set to `"true"`, the output is quite verbose, it is not suitable for production.

### Related system parameters

The `mail.from` can be contextually overridden in 2 other parameters:

- in `EMAIL_DEFAULT_SENDER`: default sender
- and `BPMALERT_FROM`: used by Alert defined in a state transition

### SMTP server with authentication

If your SMTP server requires authentication you need to add these additional items:

```json
{
	(...)
	"mail.smtp.auth": "true",
	"mail.smtp.user": "<your SMTP server username>",
	"password": "<your SMTP server password>"
}
```

### GMail SMTP server

To use GMail as SMTP server you need to configure an existing (and active) GMail account as follows:

1) Log into your Google account (if you have multiple accounts, be sure that you are signed into the account you wish to send emails from).
2) Open the following [link](https://myaccount.google.com/lesssecureapps) and toggle the 'Allow less secure apps' option to ON. This is telling your Gmail server to allow it to be accessed by less secured apps.
3) Set the `MAIL_SERVICE` with SSL or TLS protocol:

Using SSL protocol on port 465:

```json
{
	"mail.from": "<default sender email address>",
	"mail.debug": "<true|false>",
	"mail.transport.protocol": "smtp",
	"mail.smtp.host": "smtp.gmail.com",
	"mail.smtp.port": "465",
	"mail.smtp.auth": "true",
	"mail.smtp.socketFactory.class": "javax.net.ssl.SSLSocketFactory",
	"mail.smtp.user": "<GMail account username>",
	"password": "<GMail account password>"
}
```

Using TLS protocol on port 587:

```json
{
	"mail.from": "<default sender email address>",
	"mail.debug": "<true|false>",
	"mail.transport.protocol": "smtp",
	"mail.smtp.host": "smtp.gmail.com",
	"mail.smtp.port": "587",
	"mail.smtp.auth": "true",
	"mail.smtp.starttls.enable": "true",
	"mail.smtp.user": "<GMail account username>",
	"password": "<GMail account password>"
}
```

Sender email address
--------------------

You can override the sender email address configured above (`mail.from`) by setting the system parameter `EMAIL_DEFAULT_SENDER` (which can be overridden by the `BPMALERT_FROM` system parameter for the particular case of workflow alerts).

When this parameter is not set (or set to `default`), the `mail.from` is used.

Use an external service like Mailchimp, MailJet or Sendwithus
-------------------------------------------------------------

See [Third party apis](/docs/core/third-party-apis-examples) page.

Legacy Tomcat context-level configuration
-----------------------------------------

Until **version 4.0** you can still configure the dedicated `mail/simplicite` context service in the  `META-INF/context.xml`, e.g.

```xml
<Resource
	name="mail/simplicite"
	type="javax.mail.Session"
	auth="Container"
	mail.from="..."
	mail.transport.protocol="smtp"
	mail.smtp.host="..."
	mail.smtp.port="..."
...
/>
```

It is however **strongly recommended** to use configuration-level as described above.

> **WARNING** As of version 5.x this context-level is **not possible anymore** as the `javax.mail.*` package has been replaced by the new `jakarta.mail.*`
> which is not compatible with this legacy approach.
