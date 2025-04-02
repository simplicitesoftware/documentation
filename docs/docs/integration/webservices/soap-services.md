---
sidebar_position: 40
title: SOAP services
---

SOAP services
=============

Introduction
------------

This document describes how the generic SOAP services are working.

These generic SOAP services should only be used on the **API endpoint**.

The authentication mechanisms available on this API endpoint are described in [this document](/docs/integration/webservices/services-auth)
the credentials that needs to be passed to the calls are noted `<credentials>`.

> **Warning**: never use the **public UI endpoint** instead of the API endpoint: the public UI endpoint
> is a statefull UI endpoint that is **only** supposed to be used by the non authenticated pages of the generic UI.
> It does not have the scalability and performance of the API enpoint.
> In other word using the public UI endpoint for services purposes is an **absolute anti-pattern**.

The calls examples are given using the `curl` command line tool
(that can easily be transposed to any HTTP client tool or API).

> **Note**: in legacy versions 3.x the `-b cookies.txt -c cookies.txt` parameters of the `curl` calls below are **required**
> as they allow to re-use the same server session (identified by the `JSESSIONID` cookie).
> In versions 4.0+ a technical session is used to avoid taking care of the session cookie.

For an application named `myapp`, the base URL of the SOAP services is:
```
http[s]://<host[:<port>]>/myappws/soap
```
As of version 3.0 MAINTENANCE 20, the API endpoint is also available in the main webapp `/myapp` (this allows to avoid deploying the webservice gateway webapp `/myappws`):_
```
http[s]://<host[:<port>]>/myapp/api/soap
```
if you are using this API endpoint please refer to [this document](/docs/integration/webservices/services-auth) for details on the authentication mechanisms.

It will be noted `<base URL>` in the rest of the document.

> **Note**: In production the services endpoint's URL should be restricted only to allowed origins e.g. using URL filtering based on request's origin IP address or similar approaches.

Scalability and performances
----------------------------

For optimal performances under high concurrent volume it may be useful to enable the API pooling by setting the `USE_WEBSERVICES_OBJECTPOOL` to `yes`, especially
when using a single user (e.g. calls from a "public" frontend).

This allow calls to the services to be processed by a per-user pool of business objects.
The pool size can be adjusted/limied using the `WEBSERVICES_OBJECTPOOL_MAXPEROBJECT`  and `WEBSERVICES_OBJECTPOOL_MAXTOTAL` system parameters.

Business object services
------------------------

The URL of the SOAP services endpoint for the `SystemParam` business object is:
```
	<base URL>?object=SystemParam
```
It will be noted `<object endpoint URL>` in the rest of this section.

### WSDL contract

The WSDL for the `SystemParam`object can be displayed using the `wsdl`parameter to the object base URL:
```
	curl -u <login>[:<password>] "<object endpoint URL>&wsdl=true"
```
### Example service call

For instance to do a simple search on the `SystemParam` business object, you can call:
```
	curl -u <login>[:<password>] -X POST -H "Content-Type: text/xml" [-H "SOAPAction: search"] -d @request.xml "<object endpoint URL>"
```
> **Note**: the `SOAPAction` header is not mandatory (but this is part of the SOAP protocol, no harm adding it).

Where `request.xml` has the following content:

```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://myapp/SystemParam">
	<soap:Body>
		<ns1:search/>
	</soap:Body>
</soap:Envelope>
```

Please check the WSDL for details on all other business object's services.
