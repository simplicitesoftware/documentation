---
sidebar_position: 60
title: Custom services
---

# Custom services

## Introduction

This document describes how to implement custom services (e.g. custom REST APIs) using external objects.

These custom services should only be made available on the **API endpoint**.

The authentication mechanisms available on the API endpoint are described in [this document](/docs/integration/webservices/services-auth)
the credentials that needs to be passed to the calls are noted `<credentials>`.

> **Warning**: never use the **public UI endpoint** instead of the API endpoint: the public UI endpoint
> is a stateful UI endpoint that is **only** supposed to be used by the non authenticated pages of the generic UI.
> It does not have the scalability and performance of the API endpoint.
> In other word using the public UI endpoint for services purposes is an **absolute anti-pattern**.

The calls examples are given using the `curl` command line tool
(that can easily be transposed to any HTTP client tool or API).

> **Note**: in legacy versions 3.x the `-b cookies.txt -c cookies.txt` parameters of the `curl` calls below are **required**
> as they allow to re-use the same server session (identified by the `JSESSIONID` cookie).
> In versions 4.0+ a technical session is used to avoid taking care of the session cookie.

For an application deployed on `myapp` webapp root, the base URL of the custom services is:

```sh
http[s]://<host[:<port>]>/myapp/api/ext
```

For an application deployed on the default webapp root, the base URL of the custom services is :

```
http[s]://<host[:<port>]>/api/ext
```

It will be noted `<base URL>` in the rest of the document.

> **Warning**: In production the services endpoint's URL should be restricted only to allowed origins e.g. using URL filtering based on request's origin IP address or similar approaches.

## Scalability and performances

For optimal performances under high concurrent volume it may be useful to enable the API pooling by setting the `USE_WEBSERVICES_OBJECTPOOL` to `yes`, especially
when using a single user (e.g. calls from a "public" frontend).

This allow calls to the services to be processed by a per-user pool of external objects.
The pool size can be adjusted/limied using the `WEBSERVICES_EXTOBJECTPOOL_MAXPEROBJECT` and `WEBSERVICES_EXTOBJECTPOOL_MAXTOTAL` system parameters.

## Service implementation

A custom service is just a plain external object (check [this document](/docs/core/externalobject-code-examples) for general principles of external objects).

In particular this external object needs to be granted to the user that will be calling it on the API endpoint.

### Java

In **Java** as of version 4.0.P23 you can extends the more convenient `com.simplicite.webapp.services.RESTServiceExternalObject` helper class
dedicated to custom JSON/REST services implementation.

The same example as above would then be something like:

```java
public class MyServiceV1 extends com.simplicite.webapp.services.RESTServiceExternalObject {
	@Override
	public Object get(Parameters params) throws HTTPException {
		return error(400, "Call me in POST please!");
	}

	@Override
	public Object post(Parameters params) throws HTTPException {
		try {
			JSONObject req = params.getJSONObject();
			if (req != null ) {
				return new JSONObject()
					.put("request", req)
					.put("response", "Hello " + req.optString("name", "Unknown"));
			} else {
				return error(400, "Call me with a request please!");
			}
		} catch (Exception e) {
			return error(e);
		}
	}
}
```

> **Note**: by default the non implemented method `get/post/put/del/head` of this helper class return a plain 400 ("Bad request") error.

## Service call

Then the service could be called (using `POST` method in this example) like this:

```shell
curl <credentials> -X POST -H "Content-type:application/json" -d @req.json "<base URL>/MyServiceV1"
```

Where, for instance if `req.json` is:

```json
{
  "name": "Bob"
}
```

The result is then:

```json
{
  "request": {
    "name": "Bob"
  },
  "response": "Hello Bob!"
}
```

## Mapped business object services helper class

As of version 4.0.P23 a high-level helper class `com.simplicite.webapp.services.RESTMappedObjectsExternalObject`
is provided to simply expose Simplicité business object CRUD in a simplified and customized way.

Example:

```java
public class v1 extends com.simplicite.webapp.services.RESTMappedObjectsExternalObject {
	private static final long serialVersionUID = 1L;

	@Override
	public void init(Parameters params) {
		// Map the user business object attributes
		addObject("users", "User");
		addField("users", "login", "usr_login");
		addField("users", "firstname", "usr_first_name");
		addField("users", "lastname", "usr_last_name");
		addField("users", "email", "usr_email");

		// Map the user's responsibility business object attributes
		addObject("user-resps", "Responsibility");
		addField("user-resps", "login", "rsp_login_id.usr_login");
		addField("user-resps", "group", "rsp_group_id.grp_name");
		addField("user-resps", "startDate", "rsp_start_dt");
		addField("user-resps", "endDate", "rsp_end_dt");
		addField("user-resps", "active", "rsp_active");
		// Map the reference from responsibility to user
		addRefField("user-resps", "users", "userId", "rsp_login_id");
	}
}
```

With the above mapping the user and responsibilities standard objects are available on URI such as:

- `/api/v1/users` lists all users (GET) or create a new user (POST)
- `/api/v1/users?login=a*` lists all users whose login starts with a `a`
- `/api/v1/users/1` select (GET) or update (PUT) or delete (DELETE) user with row ID `1`
- `/api/v1/users/1/user-resps` select (GET) the responsibilities of user with row ID `1`

An OpenAPI schema is available on `/api/v1/openapi.yml`
