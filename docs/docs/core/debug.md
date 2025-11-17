---
sidebar_position: 240
title: Debug
---

Software quality, tests, logs, debug
====================================

Code quality
------------

**Unit testing** with JUnit and **code quality analysis** with Sonar is can be found in the documentation.

Functional testing
------------------

The functional tests can be done manually as in the previous chapter and this will be the preferred method throughout the tutorial as it is the most direct.
It is however possible to automate these tests:

- by testing the UI with tools like Selenium
- by testing the API

:::tip[Success]
It is recommended to perform manual tests in a private browser window to avoid crossover between the test user session and the designer session.
:::

Application logs
----------------

Application logs are both a quality assurance tool (it is advisable to monitor the logs and process all warnings and errors) and a debugging tool.

They are available:

- in the browser's JS console if the logged in user is a designer
- via the URL `/ui/logs` which can be opened in another tab

Debug
-----

To diagnose a bug, the two main strategies are:

- observing the logs when reproducing the bug
- step by step debugging, which is considered as advanced usage of the platform

Wether it's due to a problem with the configuration, specific queries or other reasons, one may suspect an error in the construction of the SQL queries.
To test the queries:

- if an SQL query fails it will most likely be in the logs
- if it is not a failure but a poorly constructed query that returns no results, it may be useful to enable the `LOG_SQL_USER` system parameter
  (Configuration > System Parameter) to force all queries to be written to the logs. Be sure to disable this option once the query is retrieved,
  as this mode is very verbose and will quickly saturate the space dedicated to logs
- test the query via the DBAccess tool (scope "Platform operation" > Home > Actions > Database Access or direct access via the URL '/ui/ext/DBAccess')

Support
-------

As a reminder, if you have any difficulties you can post support requests on the [Simplicité design community forum](http://community.simplicite.io)
