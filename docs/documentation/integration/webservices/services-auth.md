---
sidebar_position: 2
title: Services auth
---

Services authentication
=======================

This document applies **only** to the API endpoint.

> **Note**: This document does not apply to legacy webservices endpoint (that uses authentication methods configured at the server configuration level) nor to the I/O and Git endpoints.

For an application named `myapp` the base URL of the API endpoint, noted `<base URL>` in the rest of the document, is:
```
http[s]://<host[:<port>]>/myapp/api
```
For a root deployment this base URL is:
```
http[s]://<host[:<port>]>/api
```
The calls examples are given using the `curl` command line tool (that can easily be transposed to any other HTTP client tool or API).

> **Note**: in version 3.x adding `-b cookies.txt -c cookies.txt` as arguments of the `curl` calls is **required**
> as they allow to re-use the same server session (identified by the `JSESSIONID` cookie).
> In versions 4.0+ a technical session is used to avoid taking care of the session cookie.

<h2 id="login">Login</h2>

A first call to the login service is needed to get an access token:
```
	<base URL>/login[<optional parameter(s)>]
```
The default response is the access token as plain text.

If the optional parameter `redirect_uri=<redirect URI>` is set, the access token `<token>` is added to this URI as the `access_token` GET parameter
and the response is an HTTP redirect to this URI.

As of version 3.1 MAINTENANCE 01 it is possible to get a JSON formatted response by setting the optional parameter `?_json=true` (or `_output=json`) or `?format=json`.
As of version 5.2.39 the same is obtained by setting the `Accept` header to `application/json`:

```json
{
	"authtoken": "<auth token, e.g. eVXGhFz5ovn1yCRU9N2U4rO7Chv9aiphSjUK5njA4clCSHXy5t>",
	"sessionid": "<server session ID, e.g. FD22A705AE469A414333BD0DE6A0222D>",
	"login": "<user login>",
	"firstname": "<user first name>",
	"lastname": "<user last name>",
	"lang": <user language code, e.g. ENU>"
}
```

As of version 3.1 MAINTENANCE 07 it is also possible to get a OAuth2 style response by setting the optional parameter `?_oauth2=true` (or `_output=oauth2`).
Note that in this case you **must** use HTTPS.

```json
{
	"access_token": "<auth token, e.g. eVXGhFz5ovn1yCRU9N2U4rO7Chv9aiphSjUK5njA4clCSHXy5t>",
	"token_type": "bearer",
	"expires_in": <server session timeout, e.g. 300>,
	"scope": null
}
```


In any cases the access token`<token>` is to be used for subsequent calls (see below).

The credentials (login and password) can be passed either:

As a HTTP basic authentication header (the `curl` call below uses the standard header but the custom header can also be used):
```
	curl -u <login>[:<password>] "<base URL>/login"
```
Or as plain URL parameters of a GET request (not recommended):
```
	curl "<base URL>/login?username=<login>&password=<password>"
```
Or as plain URL parameters of a POST request (not recommended):
```
	curl --form "username=<login>" --form "password=<password>" "<base URL>/login"
```
As this login service is only dedicated to webservices, no interactive login/password entry mechanisms is available.

> **Note**: If the credentials are incomplete or not accepted for any reason the response will be an HTTP code `401`.

<h2 id="call">Use access token in service calls</h2>

All subsequent calls **must** pass the access token in the custom `X-Simplicite-Authorization` header:
```
	curl -H "X-Simplicite-Authorization: Bearer <token>" "<base URL>/..."
```
> **Note 1**: After the server session times out the response will be an HTTP code `401`.

> **Note 2**: If for som odd reason you can't set the `X-Simplicite-Authorization` header you have two other options:
>
> - Use the default `Authorization` header with the same content (`Bearer <token>`)
>   but in some contexts (like in a web browser) this can be in conflict with other mechanisms using this header
> - Add `_x_simplicite_autorization_=<token>` as URL parameter.
>   As of **version 5.1** (and backported in version 4.0) it is possible to customize the name of this URL
>   parameter using the `USERTOKENS_URL_PARAM` system parameter.

<h2 id="logout">Logout</h2>

To explicitly log out (before the server session times out) the logout service can be called:
```
	<base URL>/logout
```
A typical call is:
```
	curl  -H "X-Simplicite-Authorization: Bearer <token>" "<base URL>/logout"
```
