---
sidebar_position: 170
title: System parameters list
---

System Parameters list
======================

**ATTENTION**: This list provide data about **system parameters** available on Simplicité as of **4.0 version**.
Some system parameters might not be available on previous version or their default values might be different.

`ACE_OPTIONS`
-------------

### Default value

```json
{
	"invisibles": false,
	"theme": "eclipse",
	"keybindings": "default",
	"wrap": true
}
```

### Description

Ace editor options:

- `"theme"`: `"eclipse"`, `"github"`, ...
- `"keybindings"`: `"default"`, `"vim"` or `"emacs"`
- `"invisibles"`: `true` or `false`
- `"wrap"`: `true` or `false`

`ACTION_PREFS`
--------------

### Default value

`empty`

### Description

Technical, do not change/remove, needed in user's parameters

`ACTIVE_LISTS`
--------------

### Default value

`cell`

### Description

Allow lists to handle onclick events:

- `no`: no event
- `cell`: simple cells can open the row (exclude foreign fields, document, image...)
- `key`: only functional keys can open the row
- `row`: specific handler, prototype

Function `<object>[_<parentobj>_<ref_field>]_listclicked(obj, rowId, parentobj, parentobj_rowId, ref_field)`

`ADMIN_SYSTEM`
--------------

### Default value

`no`

### Description

Allows ADMIN to change the core-system.

`API_PAGE_THEME`
----------------

### Default value

`default`

### Description

Allows ADMIN to change API Page theme.

`ASYNC_POOL_SIZE`
-----------------

### Default value

`10`

### Description

Max pool size of Asynchronous actions (not used when `<=0`)

`AUDIT_DESIGN`
--------------

### Default value

`yes`

### Description

Enable to audit the design.

`AUDIT_RUNTIME`
---------------

### Default value

`yes`

### Description

Enable to audit the runtime.

`AUTH_PROVIDERS`
----------------

### Default value

```json
[
	{ "name": "simplicite", "type": "internal" }
]
```

### Description

Authentication providers (as JSON array).

Example:

```json
[
	{ "name": "simplicite", "type": "internal", "visible": false },
	{ "name": "google", "type": "oauth2", "label": "Sign in with Google OAuth2 IdP", "sync": false, "client_id": "<client ID>", "client_secret": "<client secret>" },
	{ "name": "google", "type": "saml", "label": "Sign in with Google SAML IdP", "sync": false }, // other SAML parameters are in SAML_* system parameters
	{ "name": "microsoft", "type": "oauth2", "sync": false, "client_id": "<client ID>", "client_secret": "<client secret>" },
	{ "name": "ldap", "type": "ldap", "sync": false }// LDAP settings are in LDAP_AUTH_CONFIG system parameter
]
```

`BIN_DIR`
---------

### Default value

`bin`

### Description

Binary directory. Relative to `PROJECT_DIR` or absolute path.

`BOOTSTRAP_VERSION`
-------------------

### Default value

`5`

### Description

- Bootstrap version 4 is supported in releases 4 and 5
- Bootstrap version 5 is only supported since release 5.3

`BOTTOM_MARGIN`
---------------

### Default value

`0`

### Description

Bottom margin size width (in pixels), this parameter is used by HTML5 layout only

`BPMALERT_FROM`
---------------

### Default value

```text
"Simplicité" <noreply@simplicite.fr>
```

### Description

Default "from" for alerts, "default" means using mail service default

> **deprecated** in version 6.2, the `mail.user` of `MAIL_SERVICE` is preferred

`CACHE_INFO_LIMIT`
------------------

### Default value

`1000`

### Description

Limit the number of objects to display in the Cache info

`CACHE_MAXAGE`
--------------

### Default value

`1296000`

### Description

Static resources HTTP cache max age in seconds

`CAPTCHA_AUDIOS`
----------------

### Default value

```json
[
	{ val:"10", src:"5times2.mp3" },
	{ val:"20", src:"2times10.mp3" },
	{ val:"6", src:"5plus1.mp3" },
	{ val:"5", src:"4plus1.mp3" },
	{ val:"7", src:"4plus3.mp3" },
	{ val:"12", src:"6plus6.mp3" },
	{ val:"24", src:"12times2.mp3" },
	{ val:"100", src:"99plus1.mp3" },
	{ val:"4", src:"add3to1.mp3" },
	{ val:"green", src:"addblueandyellow.mp3" },
	{ val:"3", src:"after2.mp3" },
	{ val:"2", src:"divide4by2.mp3" },
	{ val:"white", src:"milkcolor.mp3" },
	{ val:"blue", src:"skycolor.mp3" },
	{ val:"yes", src:"sunastar.mp3" },
	{ val:"no", src:"yourobot.mp3" },
	{ val:"paris", src:"capitaloffrance.mp3" },
	{ val:"black", src:"skynight.mp3" },
	{ val:"march", src:"thirdmonth.mp3" },
	{ val:"a", src:"firstletteralphabet.mp3" }
]
```

### Description

Internal list of captcha audios

`CAPTCHA_IMAGES`
----------------

### Default value

```json
["airplane","balloons","camera","car","cat","chair","clip","clock","cloud","computer",
"envelope","eye","flag","folder","foot","graph","house","key","leaf","lightbulb",
"lock","magnifyingglass","man","music","pants","pencil","printer","robot",
"scissors","sunglasses","tag","tree","truck","tshirt","umbrella","woman","world"]
```

### Description

Internal list of captcha images

`CHART_PALETTE`
---------------

### Default value

`Sea`

### Description

Pastel, Base, Strong, Light, Bright, Mars, Sea, Berry, Fire, Choco or add values to Simplicite.Chart.PALETTES

`CHARTJS_VERSION`
-----------------

### Default value

`2`

### Description

Supported version 2 or 3.

`CLIENT_ID`
-----------

### Default value

`empty`

### Description

Allows to create users system parameter with sessions data

`COMPACT_HOME`
--------------

### Default value

`empty`

### Description

empty is no by default. Displays the home page in compact mode

`COMPLETION_SENSITIVE`
----------------------

### Default value

`no`

### Description

Case sensitive comparison on field completions

`COMPLETION_SIZE`
-----------------

### Default value

`15`

### Description

Max list size of field auto-completion

`CONTENT_DIR`
-------------

### Default value

`dbdoc/content`

### Description

Content directory. Relative to `PROJECT_DIR` or absolute path.

`CONVERT_WILDCARDS`
-------------------

### Default value

`yes`

### Description

Set to yes to convert OS like wildcards (`*` and `?`) into SQL wildcards (`%` and `_`)

`CRON_LOCK`
-----------

### Description

Internal use to identify the host running Unique cron-jobs. Value is calculated.

`CRON_LOCK_OWNER`
-----------------

### Description

- Optional parameter to force only one host to run Unique cron-jobs (i.e. get the `CRON_LOCK`),
- The value is the endpoint URL of the node/host, when the value is updated the cluster must be restarted,
- When this parameter exists, no ping/failover will be done by the platform to re-affect the `CRON_LOCK`,
- The operator must ensure that this host is always available because no other host will get the `CRON_LOCK` automatically,
- See the log at startup of each host to check that the URL is correctly defined.

`DATETIME_HOUR_STEP`
--------------------

### Default value

`30`

### Description

Step of the timepicker in minutes

`DATETIME_ZERO_HOUR`
--------------------

### Default value

`no`

### Description

If set to yes, presets hour to 00:00:00 in datetime pickers instead of current hour

`DEFAULT_THUMB_SIZE`
--------------------

### Default value

`50`

### Description

- Thumbnail default size of Image field without precision
- 0 = no thumb

`DIRECT_TRANSACTION`
--------------------

### Default value

`no`

### Description

Manage transaction on direct access (tomcat behavior)

`DISPOSITION`
-------------

### Default value

`default`

### Description

Webapp disposition, ex: default, myapp, ...

`DOC_DIR`
---------

### Default value

`dbdoc`

### Description

Documents directory, either:

- A **relative** path from the base directory configured in `PROJECT_DIR` (e.g. `dbdoc`)
- An **absolute** local path (e.g. `/var/dbdoc` on Linux or `D:/dbdoc` on windows)
- `BLOB` to store documents in the database (in this case a local document directory needs to be configured in the `DOC_LOCAL_DIR` for fallback strategy)

[See database how-to to manage DB documents](/docs/misc/databases-howto)

`DOC_LOCAL_DIR`
---------------

### Default value

`dbdoc`

### Description

Local document directory when DOC_DIR = BLOB

`DOCUSIGN_API`
--------------

### Description

Credentials to use DocuSign APIs

`DOCUSIGN_LIBS`
---------------

### Default value

`thirdparty/docusign`

### Description

Define the DocuSign libraries to load:

- relative path of WEB-INF
- or absolute path on a server shared directory
- or explicit json Array of JAR paths

`DOCUSIGN_PRIVATE_KEY`
----------------------

### Description

Docusign private Key to connect API

`DOMAIN_RELAXING`
-----------------

> **Deprecated** as of version 4

### Default value

`none`

### Description

Domain relaxing (useful when integrating other applications from same domain with JavaScript interactions),
setting it to "none" mean no explicit domain relaxing

`EAI designer`
--------------

> **Deprecated** as of version 5 for `designer` credentials, you **should** use
> the `io.password` JVM argument or the `IO_PASSWORD` environment variable instead.

### Default value

`designer:designer`

### Description

EAI (I/O) user and password. Syntax: - code = `EAI <login>` - value = `<login>:<password>`

`EMAIL_DEFAULT_SENDER`
----------------------

### Default value

```text
"Simplicité(R)" <designer@simplicite.fr>
```

### Description

Default email sender

> **deprecated** in version 6.2, the `mail.user` of `MAIL_SERVICE` is preferred

`EMAIL_SEND_ASYNC`
------------------

### Default value

`yes`

### Description

Send emails asynchronously ?

> **deprecated** in version 6.2, asynchronous sending being the default

`EXPORT_DIR`
------------

### Default value

`dbdoc/export`

### Description

Import directory. Relative to `PROJECT_DIR` or absolute path.

`EXPORT_MAX_ROWS`
-----------------

### Default value

`0`

### Description

- Limit the number of rows to export in CSV, Excel or PDF only
- 0 or negative value means no limitation

`EXPORT_MODULE_ARTIFACTS`
-------------------------

### Default value

`yes`

### Description

Generate artifacts (README.md, pom.xml, schemas, ...) in module ZIP exports

`EXPORT_MODULE_EXPLODED`
------------------------

### Default value

`no`

### Description

Exploded files for configuration in ZIP exports

`FEEDBACK_PWD`
--------------

### Description

Feedback user password

`FEEDBACK_URL`
--------------

### Default value

`feedback`

### Description

This can also be an absolute URL (e.g. `https://myapp.com/feedback`). By default post on the instance

`FEEDBACK_USER`
---------------

### Default value

`designer`

### Description

feedback user name

`FIELD_INLINED_HELP`
--------------------

### Default value

`no`

### Description

Show fields help as an explicit help icon ?

`FORCE_CHANGE_PASSWORD`
-----------------------

### Default value

`empty`

### Description

`yes` to force password change (set at user level).

`FORM_INLINED_HELP`
-------------------

### Default value

`no`

### Description

`yes` to display the helps on the object forms, `no` to use tooltips or popups.

`FORM_INLINED_MESSAGE`
----------------------

### Default value

`yes`

### Description

yes/no to show the messages (error, info...) inlined with there related fields.

`FULLCALENDAR_LIBS`
-------------------

### Default value

```json
{
	"5":[
		"/scripts/fullcalendar/v5/common/main.min.css",
		"/scripts/fullcalendar/v5/core/main.global.min.js",
		"/scripts/fullcalendar/v5/daygrid/main.min.css",
		"/scripts/fullcalendar/v5/daygrid/main.global.min.js",
		"/scripts/fullcalendar/v5/timegrid/main.min.css",
		"/scripts/fullcalendar/v5/timegrid/main.global.min.js",
		"/scripts/fullcalendar/v5/list/main.min.css",
		"/scripts/fullcalendar/v5/list/main.global.min.js",
		"/scripts/fullcalendar/v5/interaction/main.global.min.js"
	],
	"4":[
		"/scripts/fullcalendar/v4/core/main.min.css",
		"/scripts/fullcalendar/v4/core/main.min.js",
		"/scripts/fullcalendar/v4/daygrid/main.min.css",
		"/scripts/fullcalendar/v4/daygrid/main.min.js",
		"/scripts/fullcalendar/v4/timegrid/main.min.css",
		"/scripts/fullcalendar/v4/timegrid/main.min.js",
		"/scripts/fullcalendar/v4/list/main.min.css",
		"/scripts/fullcalendar/v4/list/main.min.js",
		"/scripts/fullcalendar/v4/interaction/main.min.js"
	],
	"3":[
		"/scripts/fullcalendar/fullcalendar.min.css",
		"/scripts/fullcalendar/fullcalendar.min.js"
	]
}
```

### Description

- List of plugins per version [FullCalendar](https://fullcalendar.io).
- Add you additional plugins in this parameter.

`FULLCALENDAR_VERSION`
----------------------

### Default value

`5`

### Description

- FullCalendar supported version: `3` (for backward backward compatibility) or `4` or `5`.
- To upgrade your specific calendar from legacy V3 to V4 or V5 see: [the upgrade documentation](https://fullcalendar.io/upgrading-from-v3)

`GIT_FORMAT`
------------

### Default value

`json`

### Description

Git export format:

- `xml`: configuration is exported as XML
- `json`: configuration is exported as JSON

`GIT_GPG_SIGNATURE_KEYID`
-------------------------

### Default value

`none`

### Description

GPG signature ID for Git commits signing.

`GOD_MODE_USER`
---------------

### Default value

`json`

### Description

Allows the user to connect as any people without password

- `true`/`yes`: any user
- `['group1','group2']`: limited to users belonging to groups

`GOOGLE_API_KEY`
----------------

### Default value

`none`

### Description

Google web API key

`GOOGLE_FONT`
-------------

### Default value

`none`

### Description

Google font name, e.g. Roboto, defaults to none which means no Google font

`HASH_PASSWORD`
---------------

### Default value

`MD5:HEX`

### Description

Password hashing algorithm and encoding: `<algorithm>:<encoding>` or `none` for no password hashing.

- Algorithm values: `MD5`, `SHA-1`, `SHA-256`, `SHA-512`
- Encoding values: `HEX` (hexadecimal) or `BASE64` (base 64)

**Warning**: Hashing algorithm and encoding must be consistent with configured authentication module.

`HIST_SIZE`
-----------

### Default value

`20`

### Description

Limit size of recent activities (RedoLog).

`HISTORY`
---------

### Default value

`empty`

### Description

User navigation history

`HOME_TITLE`
------------

### Default value

`yes`

### Description

Display the home title

`HTML_HEADERS`
--------------

### Default value

```json
{}
```

### Description

Example:

```json
{
	"Content-Security-Policy": "...",
	"X-Frame-Options": "..."
	...
}
```

`HTTPCALL_TIMEOUT`
------------------

### Default value

`30`

### Description

Timeout of external http call in seconds (0=infinite)

`IMPORT_DIR`
------------

### Default value

`dbdoc/import`

### Description

Import directory. Relative to `PROJECT_DIR` or absolute path.

`INDEX_DIR`
-----------

### Default value

`dbdoc/index`

### Description

Content directory. Relative to `PROJECT_DIR` or absolute path.

`LAST_CLEAR_CACHE`
------------------

### Default value

`2016-10-07 12:23:37.299;logout`

### Description

Internal use to manage clear-cache distribution

`LEFT_MARGIN`
-------------

### Default value

`0`

### Description

Left margin width (in pixels), this parameter is used by HTML5 layout only

`LICENSE_REMINDER_DELAY`
------------------------

### Default value

`30`

### Description

- Time in days to send reminders of license expiration. 0 to disable.
- You can also set the alert and the cron named LicenseReminder.

`LIST_PAGINEBOTTOM`
-------------------

### Default value

`yes`

### Description

Displays the pagination bar on list footer.

`LIST_PAGINETOP`
----------------

### Default value

`yes`

### Description

Displays the pagination bar on list header.

`LIST_PREFS`
------------

### Default value

`empty`

### Description

Technical, do not change/remove, needed in user's parameters

`LOG_ACTIVITY`
--------------

### Default value

```json
{
	"database": true,
	"prune": 7,
	"unit": "day",
	"logger": false
}
```

### Description

User's activities tracking:

- database: save actions in m_redolog
- prune: integer to define the depth to store in DB
- unit: prune unit (hour, day, month, year)
- logger: true to export data through log4j

`LOG_DEBUG`
-----------

### Default value

`no`

### Description

yes/no to activate the DEBUG level. Log4j must be set to DEBUG first.

`LOG_DIR`
---------

### Default value

`log`

### Description

Log directory. Relative to `PROJECT_DIR` or absolute path.

`LOG_DOCUMENT`
--------------

### Default value

`yes`

### Description

yes/no to trace the documents usage. Log4j must be set to INFO first.

`LOG_ERROR`
-----------

### Default value

`yes`

### Description

yes/no to trace the error level.

`LOG_FATAL`
-----------

### Default value

`yes`

### Description

yes/no to trace the fatal level.

`LOG_INFO`
----------

### Default value

`yes`

### Description

yes/no to trace common information. Log4j must be set to INFO or DEBUG level.

`LOG_MEMORY`
------------

### Default value

`no`

### Description

yes/no to activate memory traces (MEMORY events, CyclicCache size, etc.)

`LOG_OBJECT`
------------

### Default value

`no`

### Description

yes/no to trace object usage in INFO level.

`LOG_SESSION`
-------------

### Default value

```json
{
	"database": true,
	"prune": 7,
	"unit": "day",
	"logger": true
}
```

### Description

User's sessions tracking:

- database: save all sessions in m_session
- prune: integer to define the depth to store in DB
- unit: prune unit (hour, day, month, year)
- logger: true to export data through log4j

`LOG_SQL_SYSTEM`
----------------

### Default value

`no`

### Description

yes/no to trace system SQL statements in INFO level.

`LOG_SQL_USER`
--------------

### Default value

`no`

### Description

yes/no to trace users SQL statements in INFO level.

`LOG_UI`
--------

### Default value

`no`

### Description

yes/no to activate client monitoring.

`LOG_WARN`
----------

### Default value

`yes`

### Description

yes/no to trace the warning level.

`MAIL_SERVICE`
--------------

### Default value

```json
{
	"mail.from": "noreply@simplicite.fr",
	"mail.debug": "false",
	"mail.transport.protocol": "smtp",
	"mail.smtp.host": "localhost",
	"mail.smtp.port": "25"
}
```

### Description

Mail service configuration (JSON or YAML).

It can be overridden by the `MAIL_SERVICE` environment variable.

The key-values pairs are directly used as properties to instantiate the mail session.

> Note: `mail.from` are car be overridden by `EMAIL_DEFAULT_SENDER` and `BPMALERT_FROM`
(for state transition). Both these system parameters are **deprecated** in 6.2.

`MAX_SESSIONS_USER`
-------------------

### Default value

`0`

### Description

Max private sessions per user. 0 means unlimited.

`MAX_UPLOAD_SIZE`
-----------------

### Default value

`100`

### Description

Upload file: transfer size limitation (Mo).

`MODULE_FILTER`
---------------

### Default value

`SHOWALL`

### Description

Default module filter

`MYSQL_ENGINE`
--------------

### Default value

`InnoDB`

### Description

MySQL engine: InnoDB (default) or MyISAM

`OBJECT_CACHE_SIZE`
-------------------

### Default value

`10000`

### Description

Cyclic area to store objects in memory.

`OBJECT_LOCK_DURATION`
----------------------

### Default value

`300`

### Description

Max lock duration in seconds of inactive object with a blocking timestamp. This parameter is required by cron job "deadlockTimestamp"

`OBJECT_MANAGEMENT_USER`
------------------------

### Default value

`User`

### Description

Specify the object of user management  (header user icon access) or none for no access

`PANEL_CHAR_MAX`
----------------

### Default value

`110`

### Description

Panels tab max length in char

`PANEL_FILTER`
--------------

### Default value

`yes`

### Description

Yes/No Show the object filter in panels

`PASSWORD_VALIDATION_REGEXP`
----------------------------

### Default value

```text
^((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$).{8,}|.{20,})$
```

### Description

Password validation regular expression

`PATCH_LEVEL`
-------------

### Default value

`6;P03;51ea53b2c06c532cd795b1e747bc6776`

### Description

Platform patch level

`POPUP_DEFAULT_MARGIN`
----------------------

### Default value

`50`

### Description

Popup default margin.

`POWERED_BY`
------------

### Default value

`<a href="http://www.simplicitesoftware.com" target="_blank">img/system-parameters-list/poweredby.png</a>`

### Description

Powered by credits to display on UIs (HTML syntax can be used).

`PGSQL_TSLANG`
--------------

### Default value

`english`

### Description

PostgreSQL only: Language used by full-text search to clean up irrelevant words.
`english`, `french`, `simple`...

`PGSQL_TSQUERY`
---------------

### Default value

`websearch_to_tsquery`

### Description

PostgreSQL only: parser used by the fulltext search.

Supported values:

- `to_tsquery`: legacy and limited, does not support quoted text and special characters `&|:*()` in query
- `websearch_to_tsquery`: needs PGSQL v11+, it supports more user friendly syntax (quoted text and +/-/or operators)

`PROCESS_CACHE_SIZE`
--------------------

### Default value

`10000`

### Description

`PROCESS_INLINED_HELP`
----------------------

### Default value

`no`

### Description

'yes' to display the helps on the activities, 'no' to use tooltips or popups.

`PROJECT_DIR`
-------------

### Default value

`default`

### Description

Root directory of the project. Relative or absolute path or default to use project name.

`PRUNE_JOBS_DEPTH`
------------------

### Default value

`-30`

### Description

Depth of partial jobs deletion: negative or zero number of days (e.g. -30 = default)

`PRUNE_LOG_DEPTH`
-----------------

### Default value

`-30`

### Description

Depth of crontab PruneLogDB

- negative value: max period in days
- positive value: max rows

`PRUNE_SUPERV_DEPTH`
--------------------

### Default value

`-30`

### Description

Depth of partial import supervisions deletion: negative or zero number of days (e.g. -30 = default)

`PUBLIC_PAGES`
--------------

### Default value

`no`

### Description

Yes/no to authorize public pages

`RAILWAY`
---------

### Default value

`4`

### Description

Size of the navigation bar railway:

- n limited to specified number of items
- 0 no item limit
- lower than 0 no railway

`READONLY_AS_PLAIN_TEXT`
------------------------

### Default value

`no`

### Description

Display readonly items as plain text?

`RIGHT_MARGIN`
--------------

### Default value

`0`

### Description

Right margin width (in pixels), this parameter is used by HTML5 layout only

`SALT_PASSWORD`
---------------

### Default value

`no`

### Description

Salted passwords?

`SAVE_TOAST`
------------

### Default value

`yes`

### Description

Displays the "SAVE_OK" toast

`SCOPE_PREFS`
-------------

### Default value

`empty`

### Description

Technical, do not change/remove, needed in user's parameters

`SCRIPT_DURATION_WARNING`
-------------------------

### Default value

`1000`

### Description

Warning on abnormal script execution (in ms), 0 means no warning

`SEARCH_PREFS`
--------------

### Default value

`empty`

### Description

Technical, do not change/remove, needed in user's parameters

`SESSION_TIMEOUT`
-----------------

### Default value

`30m`

### Description

UI session timeout (by default in minutes, but you can also use 30m or 1h qualified durations, 0 means using the server's default session timeout)

`SHORTCUT_PREFS`
----------------

### Default value

`empty`

### Description

Technical, do not change/remove, needed in user's parameters

`SHOW_NAVIGATOR`
----------------

### Default value

`yes`

### Description

yes/no Flag to show the navigation bar

`SHOW_SEARCHBOX`
----------------

### Default value

`yes`

### Description

yes/no Flag to show the indexed search box

`SLACK_SERVICE`
---------------

### Default value

```json
{
	"enabled": false,
	"applicationId": "_your_applicaton_id_",
	"clientId": "_your_client_id_",
	"clientSecret": "_your_client_secret_",
	"signingSecret": "_your_signing_secret_",
	"defaultChannel": "_a_channel_name_1_"
	"channels": {
		"_a_channel_name_1_": "_a_channel_hook_url_1_",
		"_a_channel_name_2_": "_a_channel_hook_url_2_"
	}
}
```

### Description

Slack service configuration (to be overridden as a disposition parameter)

`SMS_SERVICE`
-------------

### Default value

```json
{
	"provider": "none"
}
```

### Description

SMS service configuration:

- provider: e.g. twilio (set to none if no SMS service is enabled)
- Other setting depends on provider, e.g. for Twilio:
- account_sid: Twilio account SID
- auth_token: Authentication token
- from_number: From phone number

`SOCIAL_POST_DEPTH`
-------------------

### Default value

`365`

`SOCIAL_SHARE`
--------------

### Default value

```json
{
	"enabled": true,
	"exclude": [],
	"include": [],
	"useAndroidChromeShare": true,
	"providers":[
		{ "name": "email", "url": "mailto:?subject=[TITLE]&body=[TEXT]%0D%0A[URL]" },
		{ "name": "twitter", "url": "https://twitter.com/intent/tweet?url=[URL]&text=[TITLE]%20[TEXT]&hashtags=[TITLE]" },
		{ "name": "linkedin", "url": "https://www.linkedin.com/shareArticle?mini=true&url=[URL]&title=[TITLE]&summary=[TEXT]&source=[ROOT]" },
		{ "name": "facebook", "url": "http://www.facebook.com/sharer.php?u=[URL]" },
		{ "name": "pinterest", "url": "http://pinterest.com/pin/create/bookmarklet?url=[URL]&media=[IMAGE]&description=[TITLE]%20[TEXT]" },
		{ "name": "buffer", "url": "https://bufferapp.com/add?url=[URL]&text=[TITLE]%20[TEXT]" },
		{ "name": "digg", "url": "http://www.digg.com/submit?url=[URL]" },
		{ "name": "reddit", "url": "http://reddit.com/submit?url=[URL]" },
		{ "name": "tumblr", "url": "http://www.tumblr.com/share/link?url=[URL]&title=[TITLE]%20[TEXT]" },
		{ "name": "googleplus", "url": "https://plus.google.com/share?url=[URL]" }
	]
}
```

### Description

Share parameters of social objects:

- exclude: optional list of objects to exclude (even if they are social)
- include: optional list of objects to include (even if they are not social)
- list of providers `{name, url, optional icon}` with substitute tokens: URL, TITLE, TEXT, IMAGE, ROOT

`SRC_DIR`
---------

### Default value

`src`

### Description

Sources directory. Relative to PROJECT_DIR or absolute path.

`STORE_SOURCE`
--------------

### Default value

```json
[
	"https://cdn.jsdelivr.net/gh/simplicitesoftware/resources@latest/public/appstore_demo.json",
	"https://cdn.jsdelivr.net/gh/simplicitesoftware/resources@latest/public/appstore_apps.json",
	"https://cdn.jsdelivr.net/gh/simplicitesoftware/resources@latest/public/appstore_tools.json"
]
```

### Description

URL of stores for the app store (JSON array)

`SYNTAX`
--------

### Default value

`yes`

### Description

Check naming conventions?

`THEME`
-------

### Default value

`dark`

### Description

Base theme, e.g. default, sandbox, ... defaults to default

`TMP_DIR`
---------

### Default value

`dbdoc/tmp`

### Description

Temporary work directory. Relative to PROJECT_DIR or absolute path.

`TREEVIEW_PREFS`
----------------

### Default value

`empty`

### Description

Technical parameter

`TRELLO_SERVICE`
----------------

### Default value

```json
{
	"enabled": false,
	"key": "_your_trello_api_key_",
	"token": "_your_trello_access_token_",
	"secret": "_your_trelo_api_secret_",
	"defaultBoard": "_a_board_name_1_"
	"boards": {
		"_a_board_name_1_": {
			"boardId": "_a_target_board_id_1_",
			"listId": "_a_default_list_id_in_the_target_board_1_"
		},
		"_a_board_name_2_": {
			"boardId": "_a_target_board_id_2_",
			"listId": "_a_default_list_id_in_the_target_board_2_"
		}
	}
}
```

### Description

Trello service configuration (to be overridden as a disposition parameter)

`CODE_EDITOR_PREFS`
-------------------

### Default value

`empty`

### Description

Technical for user parameters

`URI_MAPPINGS`
--------------

### Default value

```json
[]
```

### Description

Optional custom URI mappings, e.g.

```json
[
	{ "source": "^/v1(.+)$", "destination": "/api/ext/MyAPIv1$1" },
	{ "source": "^/site$",   "destination": "/ext/MyWebSiteSite" }
]
```

`USE_ABOUT`
-----------

### Default value

`no` (`yes` for `designer`)

### Description

yes/no Flag to display the about-box on objects

`USE_API`
---------

### Default value

`yes`

### Description

Use API interface?

`USE_SSE`
---------

### Default value

`yes`

### Description

Use Server-Side-Event services?

- `yes`: allows to push messages from serveur to browser, HTTP Asynchronous GET must be available on server side.
- `no`: when the infra does not support SSE protocol, it means that the UI will only use polling to refresh some components (badge/counters, usage lock...)

`USE_API_TESTER`
----------------

### Default value

`yes`

### Description

Use API tester page?

`USE_INDEX_SEARCH_SCANNER`
--------------------------

### Default value

`yes`

### Description

Allows the user to scan QRCodes/Barcodes in the index search component

`USE_CHANGE_USER`
-----------------

### Default value

`yes`

### Description

Allows the user to change login between his different connections

`USE_COMPACT`
-------------

### Default value

`yes`

### Description

Allows user to compact the UI content

`USE_COMPLETION`
----------------

### Default value

`yes`

### Description

yes/no Flag to activate the completion feature

`USE_DOC_GRANT`
---------------

### Default value

`yes`

### Description

yes/no Flag to activate the document rights management

`USE_DOC_INDEX`
---------------

### Default value

`no`

### Description

yes/no Flag to activate the document indexation management

`USE_DOC_PREVIEW`
-----------------

### Default value

`yes`

### Description

yes/no Flag to activate document preview

`USE_DOMAIN_HOMES`
------------------

### Default value

`yes`

### Description

Display menu domain homes

`USE_FILEEDITOR`
----------------

### Default value

`yes`

### Description

Use file editor (e.g. for resources or scripts)

`USE_FORGOT_PWD`
----------------

### Default value

`yes`

### Description

- Add "I forgot my password" on logon page (on the internal auth provider only)
- and use alert `UserForgotPassword` to send the change request validation to user

`USE_FULLTEXT_INDEXES`
----------------------

### Default value

`yes`

### Description

Use fulltext indexes for object and document index searches

`USE_GIT`
---------

### Default value

`yes`

### Description

Use GIT endpoint?

`USE_HEALTH`
------------

### Default value

`yes`

### Description

Use health check?

`USE_HTMLEDITOR`
----------------

### Default value

`yes`

### Description

yes/no Flag to activate the HTML editor

`USE_IO`
--------

### Default value

`yes`

### Description

Use I/O endpoint?

`USE_IO_TESTER`
---------------

### Default value

`yes`

### Description

Use I/O tester page?

`USE_LANGS`
-----------

### Default value

`yes`

### Description

yes/no flag to allow user to change language on UI (since 6.1.14)

`USE_MAVEN`
-----------

### Default value

`yes`

### Description

Use Maven registry?

`USE_OBJECT_PREFS`
------------------

### Default value

`yes`

### Description

Allows user to customize objects `LIST_PREFS` and `ACTION_PREFS`

USE_OBJECT_USAGE`
-----------------

### Default value

`yes`

### Description

Notify user when object is currently opened with update rights or deleted by other people

`USE_ORACLE_SEQUENCE`
---------------------

### Default value

`yes`

### Description

- yes: force the insert statements to use Oracle sequences.
- no: evaluate a "max+1" for each row_id Must be in System module (before any XML import)

USE_POSTGRESQL_SEQUENCE`
------------------------

### Default value

`yes`

### Description

- yes: force the insert statements to use PostgreSQL serial/sequences.
- no: evaluate a "max+1" for each row_id Must be in System module (before any XML import)

`USE_ROWID_TABLE`
-----------------

### Default value

`yes`

### Description

- yes: use the mutex m_rowid table to increment row_id by table (faster).
- no: calculate a max+1 for each new row_id (backward compatibility)

`USE_SEARCH_INDEX`
------------------

### Default value

`sql`

### Description

Indexation and global search. Value: no or sql

`USE_SHOW_PWD`
--------------

### Default value

`no`

### Description

Add "Show password" on logon page (on the internal auth provider only)

`USE_MANIFEST`
--------------

### Default value

`yes`

### Description

Generate the `manifest.json` for the generic UI pages

`USE_SOCIAL_ACTIVITIES`
-----------------------

### Default value

`no`

### Description

Use social features for activities

`USE_UNACCENTUATED_INDEX`
-------------------------

### Default value

`no`

### Description

Unaccentuated index search?

`USE_UNDO_REDO`
---------------

### Default value

`yes`

### Description

Manage and display the Undo/Redo behaviors for users

`USE_USERTOKENS`
----------------

### Default value

`yes`

### Description

Use persistent user tokens?

- no: for none of the endpoints
- api (or yes): for the API endpoint only
- ui: for the UI endpoint only
- all: for both API and UI endpoints

`USE_WEBSERVICES_DATACACHE`
---------------------------

### Default value

`no`

### Description

Use data cache for the API endpoint?

`USE_WEBSERVICES_OBJECTPOOL`
----------------------------

### Default value

`no`

### Description

Use business object pool for the API endpoint?

`USE_WEBSOCKET_LOGS`
--------------------

### Default value

`no`

### Description

Use websocket logs (only useful with websocket enabled servers)?

`USE_ZOOM`
----------

### Default value

`yes`

### Description

Allows user to resize the UI content

`USER_RESP_DEFAULTMODULENAME`
-----------------------------

### Default value

`yes`

### Description

Default module name for users and responsibilities

`USERTOKENS_CACHE_SIZE`
-----------------------

### Default value

`1000`

### Description

Size of the usertoken cache (API endpoitn only)

`USERTOKENS_DURATION`
---------------------

### Default value

`24h`

### Description

User tokens duration (by default in hours, but you can also use 24h or 1d qualified durations).

Note: This parameter can be overridden per user.

`USERTOKENS_MODE`
-----------------

### Default value

`jwt`

### Description

User tokens mode: `simple` or `jwt`.

`USERTOKENS_REUSE`
------------------

### Default value

`yes`

### Description

Reuse existing user tokens for same logins?

`USERTOKENS_SIGNATURE_SECRET`
-----------------------------

### Default value

`simplicite`

### Description

User tokens signature secret (only used in jwt mode)

`USERTOKENS_URL_PARAM`
----------------------

### Default value

`_x_simplicite_authorization_`

### Description

User token URL parameter name

`VERSION`
---------

### Default value

`<current major platform version, e.g. 5>`

### Description

Version to display on UIs (HTML syntax can be used).

Note: You can use single or multiple tokens like `[VERSION:<module name>]` to substitute a module's version in this version string.

`WEBSERVICES_DATACACHE_EXPIRY`
------------------------------

### Default value

`60`

### Description

Webservice data cache expiry delay (in seconds)

`WEBSERVICES_DATACACHE_MAXSIZE`
-------------------------------

### Default value

`1000`

### Description

Data cache max size

`WEBSERVICES_EXTOBJECTPOOL_MAXPEROBJECT`
----------------------------------------

### Default value

`-1`

### Description

External objects pool max size per external object (-1 means no limit)

`WEBSERVICES_EXTOBJECTPOOL_MAXTOTAL`
------------------------------------

### Default value

`-1`

### Description

External objects pool total max size (-1 means no limit)

`WEBSERVICES_OBJECTPOOL_MAXPEROBJECT`
-------------------------------------

### Default value

`-1`

### Description

Business objects pool max size per object (-1 means no limit)

`WEBSERVICES_OBJECTPOOL_MAXTOTAL`
---------------------------------

### Default value

`-1`

### Description

Business objects pool total max size (-1 means no limit)

`WINDOW_TITLE`
--------------

### Default value

`Simplicité`

### Description

Webapp title in browser tab
