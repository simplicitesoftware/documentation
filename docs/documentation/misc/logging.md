---
sidebar_position: 240
title: Logging
---

Logging
========

Introduction
------------

In Simplicité, the logging mechanisms are based on configurable **log events** (cf. the `LogEvent` business object).

Each log event:

* defines which type(s) of logging is done (non exclusive):
	- **Technical logging** using Log4J which allows flexible logging strategies including appending the logs to the application server's logger(s)
	- **Business logging** stored as a business records in the database, this is thus to be considered as audit trail more than logging, cf. the `AppLog` business object
* can be dynamically associated to a logging level:
	- Debug
	- Info
	- Warning
	- Error
	- Fatal
* can be dynamically enabled/disabled

Technical logging
-----------------

### Log4J&reg; logging

The technical logging is based on Log4J&reg; and can be configured using a standard Log4J&reg; configuration file.

A default `log4j2.xml` configuration file is provided including several samples of appenders, two of them are active and have a specific behavior:

* `SIMPLICITE-CONSOLE` is configured to push logs to the standard output (in default Tomcat's logging configuration, this output is appended to the `catalina.out` log file)
* `SIMPLICITE-FILE` is configured to push logs in dedicated daily log files

The configurable log event levels matches the Log4J&reg; log levels.

> **Notes**:
>
> * If you modify the default Log4J&reg; configuration, the `SIMPLICITE-FILE` appender must be kept with this name and
>   must remain a file-based appender as it is used by the system log viewer of the generic UI.
> * Unless you do custom logging configuration at your application's server level, it is not recommended to keep the
>  `SIMPLICITE-CONSOLE` appender active in production

Some very verbose log events are also conditioned the value of some system parameters (e.g. `LOG_SQL_USER` and `LOG_SQL_SYSTEM`
which enables/disables the logging of all user-level or system level SQL requests, these very low level logging **must be disabled by default**
in production). This is also the case of all log events associated to platform monitoring.

### Websocket logging

As of version 3.0, all technical logs are also pushed on a websocket push event channel
(on application servers that provides websocket implementation like Tomcat 8+) available when connected on the generic web UI.

It pushes log events to the browser's console when the system parameter `USE_WEBSOCKET_LOGS` is set to `yes` (which is, by
default, globally set to `no` and may be overridden on a per-user basis).

The log events can be filtered based on their log level, the threshold level can be configured in the operation dashboard.

Business logging
----------------

The logs associated to a log event marked as recorded in the database are available as buisness data using the `AppLog` business object.

Such log events correspond to something worth auditing from a business point of view (login/logout, business events, ...). The associated log records
are to be considered as business data more than pure logging. Typical business usage is for audit trails.

By default, a subset of theses audit logs are used by:

* The login/logout audit statistics
* The platform monitoring dashboards when started

The business logs that have been triggered by a scheduled job are linked to the execution record of the job (cf. business object `AsyncJob`).