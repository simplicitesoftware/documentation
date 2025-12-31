---
sidebar_position: 5
title: Auth providers
---

Authentication providers
=================================

> This document applies to version **4.0 P23** and above.

Simplicité offers a wide array of authentication solutions with the following ones working out-of-the-box, with no coding involved:

- **internal:** this is the default classic Simplicité mechanism that store user's passwords in the database
- **OAuth2**
- **SAML**
- **LDAP**
- **Crowd** _(external Atlassian Crowd authentication)_

There can be as many providers as necessary.

Configuration
-------------

The authentication providers are to be configured with the `AUTH_PROVIDERS` system parameter, e.g.

```json
[
	{
		"type": "internal",
		"name": "simplicite",
		"visible": false
	},
	{
		"type": "oauth2",
		"name": "google",
		"label": "Sign in with Google OAuth2 IdP",
		"sync": true,
		"client_id": "<my client ID>",
		"client_secret": "<my client secret>"
	},
	{
		"type": "saml",
		"name": "google",
		"label": "Sign in with Google SAML IdP",
		"sync": true
	},
	{
		"type": "ldap",
		"name": "openldap",
		"visible": [ "http://localhost:8080"]
	}
]
```

### Common settings

The JSON settings include the common attributes:

| Setting   | Supported values                              | Required     | Comment                                                        |
|-----------|-----------------------------------------------|--------------|----------------------------------------------------------------|
| `type`    | `internal`, `oauth2`, `saml`, `ldap`, `crowd` | **Required** |                                                                |
| `name`    | String                                        | **Required** | provider name (must be unique per type)                        |
| `visible` | `true` (default) / `false` / Array            | optional     | can be an array of base URLs for which the provider is visible |
| `label`   | String                                        | optional     | label on the provider choice page                              |
| `sync`    | `true` / `false`                              | optional     |                                                                |
| `image`   | String                                        | optional     | disposition resource name                                      |

:::warning
For historical reasons the names `google`, `microsoft`, `linkedin` and `franceconnect` are **reserved** as they correspond to dedicated connectors.
:::

If the provider is configured as **not visible**, it is still accessible by appending `?_provider=<type>:<name>`
(e.g.: `?_provider=internal:simplicite`) to the base URL.

### Specific settings

Extra mandatory settings might exist depending on the provider's type, please refer to the corresponding authentication documentation for details.

### Deprecated syntax

Before Simplicité v4, providers were configured in individual system parameters instead of one single JSON. PEM certificates
are embeddable in the JSON as base64 starting of v5.3.39.

|                                                                  | Setting specification                                             | Example                   |
| ---------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------- |
| In `AUTH_PROVIDERS` as JSON                                      | `<setting (lowercase)>`                                           | `"client_id"`             |
| **Deprecated in v4** Individual system parameters                | `<type (uppercase)>_<setting (uppercase)> <provider (lowercase)>` | `OAUTH2_CLIENT_ID google` |
| **Deprecated in v5** Image as implicitly specified resource name | `<type (uppercase)>_SIGNIN_<provider (uppercase)>`                | `LDAP_SIGNIN_MYOPENLDAP`  |

:::warning
Some of the provider settings are still documented with the deprecated syntax.
:::

Troubleshooting
---------------

To investigate authentication issues, one useful tool is the `DAUTHCS001` [log event](/make/settings/log-event).
By default, it is configured as a _Debug_ (`D`) event because the output is verbose and can leak secrets,
so it has to be activated when necessary by setting it to an _Information_ (`I`) event.

:::warning

Make sure to deactivate it as it produces **very verbose** output. Whatever method you chose, you'll have to set the level back to the _Debug_ value (`D`)

:::

### UI activation

The value is only updatable by users with the `ADMIN_SYSTEM` user parameter set to `yes`.

![dauthcs001.png](img/auth-providers/dauthcs001.png)

:::info

Before Simplicité v6, this menu item used to be in the "Operation" domain, in the extended view.

:::

### IO activation

When deali!ng with authentication problems, it is sometimes impossible to access the UI, and you might defer to the [I/O services](/docs/integration/webservices/io-commandline/)

```shell
curl -u designer:$IO_PASSWORD --form service=jsonimport --form "file=@-" $INSTANCE_URL/io <<'EOF'
[{"name":"LogEvent","action":"update","data":[{"lev_code":"DAUTHCS001","lev_level":"I"}]}]
EOF
curl -u designer:$IO_PASSWORD --form service=clearcache $INSTANCE_URL/io
```

### Database activation

As a last resort, that's how the change can be made at database level

```sql
UPDATE m_log_event SET lev_level='I' WHERE lev_code='DAUTHCS001';
```
