---
sidebar_position: 3
title: REST services
---

REST services
=============

Introduction
------------

This document describes how the generic REST API services are working.

:::warning

Before considering using these **low level** generic REST services directly,
please consider using the various **wrappers** provided on top of these services:

- The [standard Ajax API](/docs/integration/libraries/ajax-api) for use within the generic web UI and/or using the generic UI's libs as custom UI framework
- The [Node.js and browser JavaScript API](/docs/integration/libraries/nodejs-api) for any external used based on the JavaScript language
  or any JavaScript-based frameworks (Angular, React, Vue, ...)
- Etc.

:::

These generic REST API services should only be used on the **API endpoint**.

The authentication mechanisms available on the API endpoint are described in [this document](/docs/integration/webservices/services-auth)
the credentials that needs to be passed to the calls are noted `<credentials>`.

:::warning
Never use the **public UI endpoint** instead of the API endpoint: the public UI endpoint
is a stateful UI endpoint that is **only** supposed to be used by the non authenticated pages of the generic UI.
It does not have the scalability and performance of the API endpoint.
In other word using the public UI endpoint for services purposes is an **absolute anti-pattern**.
:::

The calls examples are given using the `curl` command line tool
(that can easily be transposed to any HTTP client tool or API).

:::note
In legacy versions 3.x the `-b cookies.txt -c cookies.txt` parameters of the `curl` calls below are **required**
as they allow to re-use the same server session (identified by the `JSESSIONID` cookie).
In versions 4.0+ a technical session is used to avoid taking care of the session cookie.
:::

For an application deployed on `/myapp`, the base URL of the REST services is:

```text
http[s]://<host[:<port>]>/myapp/api/rest
```

Please refer to [this document](/docs/integration/webservices/services-auth) for details on the authentication mechanisms.

It will be noted `<base URL>` in the rest of the document.

The credentials that needs to be passed to the calls are noted `<credentials>`. This correspond either
to a simple basic authentication `-u <login>[:<password>]` or to the authentication headers of the API endpoint.

The examples are done on the system parameter object `SystemParam` for a business

> **Note**: In production the services endpoint's URL should be restricted only to allowed origins
e.g. using URL filtering based on request's origin IP address or similar approaches.

Scalability and performances
----------------------------

For optimal performances under high concurrent volume it may be useful to enable
the API pooling by setting the `USE_WEBSERVICES_OBJECTPOOL` to `yes`, especially
when using a single user (e.g. calls from a "public" frontend).

This allow calls to the services to be processed by a per-user pool of business objects.
The pool size can be adjusted/limied using the `WEBSERVICES_OBJECTPOOL_MAXPEROBJECT`
and `WEBSERVICES_OBJECTPOOL_MAXTOTAL` system parameters.

Application info
----------------

Calling `<base URL>` returns information on application and user:

```text
curl <credentials> "<base URL>"
```

Appending `?session=true` to this URL only returns minimalistic information on the server session.
For instance, calling this basic session information is an efficient way to keep the session alive with a minimal system consumption.

Create
------

To create a new system parameter `TEST` with value `foo`, the required JSON data is as follows
(it obviously **must** include all required fields of the considered business object):

```json
{
	"sys_code":"TEST",
	"sys_value": "foo"
}
```

In the example this JSON data is stored in a `test.json` file.

The **create** call in REST uses the HTTP `POST` method.

```text
curl <credentials> -X POST -H "Content-type:application/json" -d @test.json "<base URL>/SystemParam/[0]"
```

_NB1: the `-H "Content-type:application/json"` is **mandatory** for the JSON data of the posted body to be taken into account._

_NB2: The `0` at the end of the URL is optional._

The response of the call is a complete JSON data as follows:

```json
{
	"row_id":"<row ID>",
	"sys_code":"TEST",
	"sys_value":"foo",
	"sys_type":"",
	"sys_desc":"",
	"row_module_id":"29",
	"row_module_id__mdl_name":"Test"
}
```

Note that the `row_id` field value returned (noted `<row ID>` in the example) that will be used for the other REST calls.

Get
---

Once you know the row ID of a record you can get it (go to "Search" paragraph for search principles based on other fields than the row ID).

The **get** call in REST uses the HTTP `GET` method.

```text
curl <credentials> "<base URL>/SystemParam/<row ID>"
```

The response is the same as the one you got from creation call:

```json
{
	"row_id":"<row ID>",
	"sys_code":"TEST",
	"sys_value":"foo",
	"sys_type":"",
	"sys_desc":"",
	"row_module_id":"29",
	"row_module_id__mdl_name":"Test"
}
```

By default you get the document ID of all document and image fields.
If you want to get the content of the document and image fields you need to append `_inline_documents=true` to the URL.
If you want to get the thumbnail content of the image fields you need to append `_inline_thumbnails=true` to the URL.

Update
------

Once you know the row ID of a record you can update it.

Lets say you want to change the system parameter value to `bar`, the required JSON data is as follows:

```json
{
	"sys_value":"bar"
}
```

The **update** call in REST uses the HTTP `PUT` method (or, alternatively, `POST` method with
the URL parameter `_method=PUT` if your URL client does not implement `PUT` method).

```text
curl <credentials> -X PUT -H "Content-type:application/json" -d @test.json "<base URL>/SystemParam/<row ID>"
```

The response is the same as the one you got from creation and get calls, except that the value has changed:

```json
{
	"row_id":"<row ID>",
	"sys_code":"TEST",
	"sys_value":"bar",
	"sys_type":"",
	"sys_desc":"",
	"row_module_id":"29",
	"row_module_id__mdl_name":"Test"
}
```

Delete
------

Once you know the row ID of a record you can delete it.

The **delete** call in REST uses the HTTP `DELETE` method (or, alternatively, `POST` method with
the URL parameter `_method=DELETE` if your URL client does not implement `DELETE` method).

```text
curl <credentials> -X DELETE "<base URL>/SystemParam/<row ID>"
```

The response only indicates the row ID that has been deleted:

```json
{
	"row_id":"<row ID>"
}
```

Search
------

Search is as get but without a row ID.

The **search** call in REST uses the HTTP `GET` method with optional URL-encoded parameters (`%25` being the URL-encoded wildcard for "any string"):

```text
curl <credentials> "<base URL>/SystemParam/?sys_code=TES%25"
```

The response is an array of matching records (in the example only one matches):

```json
[
	{
		"row_id":"219",
		"sys_code":"TEST",
		"sys_value":"bar",
		"sys_type":"",
		"sys_desc":"",
		"row_module_id":"29",
		"row_module_id__mdl_name":"Test"
	}
]
```

By default you get the document ID of all document and image fields.

- If you want to get the content of the document and image fields you need to append `_inline_documents=true` to the URL.
- If you want to get the thumbnail content of the image fields you need to append `_inline_thumbnails=true` to the URL.
- If you just want to count records you need to append `_count=true` to the URL
- If you want to paginate the search results you need to append `_page=<number of page, starting with 0>`
  (the number of page  being given by the above count request)

It is also possible to do search on the object index (if the considered object is indexed):

```text
curl <credentials> "<base URL>/<indexed object name>/?_indexsearch=<index search request>"
```

The result provides an array of matching indexed records (each of them including the standard data record):

```json
[
	{
		"object": "<object name>",
		"row_id": "<indexed record's row ID>",
		"key": "<indexed record's functional keys string>",
		"value": "<indexed record's index string>",
		"data": {
			<indexed record's data>
		}
	},
	(...)
]
```

The options described above applies for this search also.

Meta-data
---------

You can get the business object meta-data with a get call with the optional URL parameter `_metadata`:

```text
curl <credentials> "<base URL>/SystemParam/?_metadata=true"
```

An optional `_metadacontext` allows to specify object context.

Run custom action
-----------------

You can run a custom action on the business object with a get call with the optional URL parameter `_action`:

```text
curl <credentials> "<base URL>/SystemParam/[<row ID>]?_action=<action name>"
```

or:

```text
curl <credentials> "<base URL>/SystemParam/[<row ID>]/action:<action name>"
```

The row ID is to be set for record level custom actions. On global custom actions the search capabilities applies.

Apply publication template
--------------------------

You can apply a publication template on the business object with a get call with the optional URL parameter `_printtemplate`:

```text
curl <credentials> "<base URL>/SystemParam/[<row ID>]?_printtemplate=<print template name>"
```

or:

```text
curl <credentials> "<base URL>/SystemParam/[<row ID>]/publication:<print template name>"
```

The row ID is to be set for record level publication templates. On global publication templates the search capabilities applies.

Get pivot table data
--------------------

You can get a pivot table result on the business object with a get call with the optional URL parameter `_crosstab`:

```text
curl <credentials> "<base URL>/SystemParam/?_crosstab=<pivot table name>"
```

The search capabilities applies.

Service documentation
---------------------

As of **version 3.1** you can get the business object service documentation with a get call with the optional URL parameter `_doc`: `<base URL>/SystemParam/?_doc=true`

The default documentation format is _Markdown_ but you can format it as HTML using the optional `&_output=html`
or, as of version 4.0, as an OpenAPI/Swagger schema using `_output=openapi`.

Usage example using HTML/Ajax
-----------------------------

[This Github repository](https://github.com/simplicitesoftware/ajax-demo) is a very basic example of usage of REST services from an HTML page.

API tester page
---------------

A web page is available to build and test requests to these generic REST API:

```text
http[s]://<host[:<port>]>/myapp/api/tester
```

:::info
This page can be inhibited in production by using the `USE_API_TESTER` system parameter to `no`.
:::
