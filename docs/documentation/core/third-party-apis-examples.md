---
sidebar_position: 160
title: Third party apis examples
---

Third party APIs examples
=========================

These are examples of calls to various third party APIs done on server side. Most examples are using the server-side **Rhino** scripting language.

> **Note**:
>
> The **Rhino**-only code examples can easily be transposed to equivalent **Java** code.
> Some examples are provided both in Rhino and Java so as you can see the syntax differences.
>
> Apart from the variable and methods declarations syntax, the main point of attention is regarding comparisons syntax for **non raw types**:
>
> - Rhino: `a == b`, Java: `a.equals(b)`
> - Rhino: `a != b`, Java: `!a.equals(b)`

Introduction
------------

Simplicité being a Java platform, calling **any** HTTP-based can be done using either:

- Standard low-level HTTP client Java API (`java.net.[http.]*`)
- Included HTTP client libraries such as the Apache HTTP Client library
- Utility classes provided by Simplicité such as `com.simplicite.util.HTTPTool`
  or the very simple `Tool.readUrl(...)`, e.g. calling an REST-like API returning a JSON object:

```javascript
var result = new JSONObject(Tool.readUrl("http(s)://my3rdpartyapi.com/a/b/c?d=e"));
var status = result.getString("myAPIStatus");
(...)
```

The following **non limitative** list of examples are describing some specifc cases for which higher level utility classes exists
(provided by Simplicité and/or by the vendor of the 3rd party API, e.g. Google APIs).
But the same cloud be achieved using one of the low-level above approaches.

Note that some of these 3rd party APIs may need a paying subscription and/or may have a limited free tier.

Calendar
--------

This example is based on the **client side** Google Calendar API.

> **Note**: As of version 4.0 it is also possible to use the **server side** Google calendar API wrapped into the `GoogleAPI` tools class.
> the example below is kept here for historical reasons.

### Google Calendar API

You should have activate Google Oauth2 authentication to use it. See [Tomcat OAuth2 authentification](/docs/documentation/authentication/oauth2)

See [https://developers.google.com/google-apps/calendar](https://developers.google.com/google-apps/calendar/) for details.

#### System parameters

The `OAUTH2_SCOPES` system param has to contain `https://www.googleapis.com/auth/calendar`
You may want to create `GOOGLE_CALENDAR_ID` system param to work on a specific calendar. 

#### Code snippet

Here a generic script to use to create, update or delete an event.

```javascript
Calendar = function(g) {
	var grant = g;
	var calId = grant.getParameter("GOOGLE_CALENDAR_ID","");
	var endpoint = "https://www.googleapis.com/calendar/v3/calendars/";
	// For 3.x versions
	//var token = new JSONObject(grant.getParameter("GOOGLE_TOKEN", "{}")).optString("access_token", "");
	// For version 4.0+
	var token = g.getSessionInfo().getToken();

	function insert(req) {
		var headers = new HashMap();
		headers.put("Authorization", "Bearer " + token);
		headers.put("Content-type", HTTPTool.getMimeTypeWithEncoding(HTTPTool.MIME_TYPE_JSON, "UTF-8")); // Explicitly set content type as UTF-8-encoded application/json (not needed in version 4.0 if req is a JSONObject/JSONArray)

		var url = endpoint + calId + "/events";
		var res = Tool.readUrl(url, null, null, req, headers,"UTF-8"); // Must use UTF-8 encoding
		return new JSONObject(res);
	}

	function update(eventId, req) {
		var headers = new HashMap();
		headers.put("Authorization", "Bearer " + token);
		headers.put("Content-type", HTTPTool.getMimeTypeWithEncoding(HTTPTool.MIME_TYPE_JSON, "UTF-8")); // Explicitly set content type as UTF-8-encoded application/json (not needed in version 4.0 if req is a JSONObject/JSONArray)
		headers.put("X-HTTP-Method-Override","PUT");

		var url = endpoint + calId + "/events/" + eventId;
		var res = Tool.readUrl(url, null, null, req, headers,"UTF-8"); // Must use UTF-8 encoding
		return new JSONObject(res);
	}

	function del(eventId) {
		var headers = new HashMap();
		headers.put("Authorization", "Bearer " + token);
		headers.put("Content-type", HTTPTool.getMimeTypeWithEncoding(HTTPTool.MIME_TYPE_JSON, "UTF-8")); // Explicitly set content type as UTF-8-encoded application/json (not needed in version 4.0 if req is a JSONObject/JSONArray)
		headers.put("X-HTTP-Method-Override","DELETE");

		var url = endpoint + calId + "/events/" + eventId;
		var res = Tool.readUrl(url, null, null, "", headers,"UTF-8"); // Must use UTF-8 encoding
		return new JSONObject(res);
	}
	
	return { insert: insert, update: update, del: del};
};
```
**Java**
```Java
import java.io.IOException;
import java.util.*;
import org.json.JSONObject;
import com.simplicite.util.*;
import com.simplicite.util.tools.*;

public class Calendar implements java.io.Serializable {
	private static final long serialVersionUID = 1L;
	Grant grant;
	String calId;
	String endpoint;
	String token;
	public Calendar(Grant g){
		grant = g;
		calId = grant.getParameter("GOOGLE_CALENDAR_ID","");
		endpoint = "https://www.googleapis.com/calendar/v3/calendars/";
		// For 3.x versions
		//token = new JSONObject(grant.getParameter("GOOGLE_TOKEN", "{}")).optString("access_token", "");
		// For version 4.0+
		token = g.getSessionInfo().getToken();
		return;
	}
	public JSONObject insert(JSONObject data) {
		try {
			HashMap<String,String> headers = new HashMap();
			headers.put("Authorization", "Bearer " + token);
			headers.put("Content-type", HTTPTool.getMimeTypeWithEncoding(HTTPTool.MIME_TYPE_JSON, "UTF-8")); // Explicitly set content type as UTF-8-encoded application/json (not needed in version 4.0 if req is a JSONObject/JSONArray)
			String url = endpoint + calId + "/events";		
			String res = Tool.readUrl(url, null, null, data, headers,"UTF-8");
			return new JSONObject(res);
		} catch (IOException e) {
			AppLog.error(e, grant);
		} // Must use UTF-8 encoding
		return new JSONObject();
		
	}
	public JSONObject update(String eventId, String req) {
		String res="";
		try {
			HashMap<String,String> headers = new HashMap();
			headers.put("Authorization", "Bearer " + token);
			headers.put("Content-type", HTTPTool.getMimeTypeWithEncoding(HTTPTool.MIME_TYPE_JSON, "UTF-8")); // Explicitly set content type as UTF-8-encoded application/json (not needed in version 4.0 if req is a JSONObject/JSONArray)
			headers.put("X-HTTP-Method-Override","PUT");
			String url = endpoint + calId + "/events/" + eventId;
		
			res = Tool.readUrl(url, null, null, req, headers,"UTF-8"); // Must use UTF-8 encoding
		} catch (IOException e) {
			AppLog.error(e, grant);
		}
		return new JSONObject(res);
	}
	public JSONObject del(String eventId) {
		HashMap<String,String> headers = new HashMap();
		headers.put("Authorization", "Bearer " + token);
		headers.put("Content-type", HTTPTool.getMimeTypeWithEncoding(HTTPTool.MIME_TYPE_JSON, "UTF-8")); // Explicitly set content type as UTF-8-encoded application/json (not needed in version 4.0 if req is a JSONObject/JSONArray)
		headers.put("X-HTTP-Method-Override","DELETE");

		String url = endpoint + calId + "/events/" + eventId;
		String res="";
		try {
			res = Tool.readUrl(url, null, null, "", headers,"UTF-8");// Must use UTF-8 encoding
		} catch (IOException e) {
			AppLog.error(e, grant);
		} 
		return new JSONObject(res);
	}
	
}
```
#### Code snippet using a business object

You can now use the previsous script on a business object hook and create an event. See [business object hooks code examples](/docs/documentation/core/objects/businessobject-code-hooks)

Example of a business object where event are created on google calendar. Date has to be on RFC3339 format. Simplicite provide method to change date to this specific format.
**Rhino**
```javascript
MyBusinessObject.preCreate = function() {
	var c = new Calendar(this.getGrant());
	var data = new JSONObject();
	data.put("summary",this.getFieldValue("title"));
	// Format date to RFC3339
	data.put("start", new JSONObject().put("dateTime",Tool.dateTimeToRFC3339(this.getFieldValue("startDatetime"))).put("timeZone","Europe/Paris"));
	data.put("end", new JSONObject().put("dateTime",Tool.dateTimeToRFC3339(this.getFieldValue("endDatetime"))).put("timeZone","Europe/Paris"));
	data.put("guestsCanInviteOthers", false);
	data.put("guestsCanSeeOtherGuests", false);
	var res = c.insert(data);
	var id = res.getString("id");
	// Keep eventId for next call (update or delete)
	this.getField("eventId").setValue(id);
};
```

**Java**
```Java
@Override
public String preCreate() {
	Calendar c = new Calendar(getGrant());
	JSONObject data = new JSONObject();
	data.put("summary",getFieldValue("title"));
	// Format date to RFC3339
	data.put("start", new JSONObject().put("dateTime",Tool.dateTimeToRFC3339(getFieldValue("startDatetime"))).put("timeZone","Europe/Paris"));
	data.put("end", new JSONObject().put("dateTime",Tool.dateTimeToRFC3339(getFieldValue("endDatetime"))).put("timeZone","Europe/Paris"));
	data.put("guestsCanInviteOthers", false);
	data.put("guestsCanSeeOtherGuests", false);
	JSONObject res = c.insert(data);
	String id = res.getString("id");
	// Keep eventId for next call (update or delete)
	getField("eventId").setValue(id);
	return super.preCreate();
}
```

Geocoding
---------

### Google Maps

This example sets a `myCoords` object field (of type geocoordinates) with the coordinates returned by Google Maps geocoding service using the value of the `myAddress` text field.

```javascript
var a = this.getField("myAddress");
if (a.hasChanged())
	this.setFieldValue("myCoords", GMapTool.geocodeOne(a.getValue().replace("\n", ", ")));
```

**Java**
```Java
	ObjectField a = getField("myAddress");
	GMapTool gT=new GMapTool(getGrant());
	if (a.hasChanged())
		setFieldValue("myCoords", gT.geocodeOne(a.getValue().replace("\n", ", ")));
```
> **Note**: to debug response from the API you can use the `DCORESV001` log event code

Translation
-----------

### Google Translate

As of **version 4.0** it is possible to submit translation requests to Google Translate API using the `GoogleAPITool.translate()` method.

```javascript
var l = this.getField("myFrenchLabel");
if (l.hasChanged())
	this.setFieldValue("myEnglishLabel", GoogleAPITool.translate(this.getGrant(), l.getValue(), "fr", "en"));
```
**Java**
```Java
try {
	ObjectField l = getField("myFrenchLabel");
	if (l.hasChanged())
			setFieldValue("myEnglishLabel", GoogleAPITool.translate(getGrant(), l.getValue(), "fr", "en"));
} catch (Exception e) {
	AppLog.error(e, getGrant());
}
```
> **Note**: to debug response from the API you can use the `DCORESV001` log event code

SMS
---

As of **version 4.0** it is possible to use the `SMSTool` helper class for the following providers:

- Twilio
- SMS Envoi

The service configuration and credentials being stored in the `SMS_SERVICE` system parameter.

> **Note**: to debug response from the API you can use the `DCORESV001` log event code

### Custom example

> **Warning**: The following example is only for **versions 3.x**, for version 4.0, see above.

This example uses [SMSEnvoi](http://www.smsenvoi.com/) "premium" SMS service.

```javascript
function sendSMS(phone, message) {
	try {
		var params = new JSONObject(Grant.getSystemAdmin().getParameter("SMSENVOI_CONFIG", "{}"));
		var url = params.getString("url");
		var email = params.getString("email");
		var apikey = params.getString("apikey");

		var res = Tool.readUrl(url, null, null, "email=" + HTTPTool.encode(email) + "&apikey=" + apikey + "&message[type]=sms&message[subtype]=PREMIUM&message[recipients]=" + HTTPTool.encode(phone) + "&message[content]=" + HTTPTool.encode(message), null, Globals.getPlatformEncoding());
		console.log("Response: " + res);
		
		var r = new JSONObject(res);
		var id = r.getInt("message_id");
		console.log("SMS Id:" + id);
	} catch(e) {
		console.error(e.javaException ? e.javaException.getMessage() : e);
	}
};
```
**Java**
```Java
public void sendSMS(Object phone,Object message) {
	try {
		JSONObject params = new JSONObject(Grant.getSystemAdmin().getParameter("SMSENVOI_CONFIG", "{}"));
		String url = params.getString("url");
		String email = params.getString("email");
		String apikey = params.getString("apikey");
		String res;
		res = Tool.readUrl(url, null, null, "email=" + HTTPTool.encode(email) + "&apikey=" + apikey + "&message[type]=sms&message[subtype]=PREMIUM&message[recipients]=" + HTTPTool.encode(phone) + "&message[content]=" + HTTPTool.encode(message), null, Globals.getPlatformEncoding());
		AppLog.info("Response: " + res,grant);
		JSONObject r = new JSONObject(res);
		int id = r.getInt("message_id");
		AppLog.info("SMS Id:" + id,grant);
	} catch (IOException e) {
			AppLog.error(e, grant);
	}
}
```

Where the `SMSENVOI_CONFIG` system parameter has the following JSON value:

```json
{
	"email": "<email>",
	"apikey": "<API key>",
	"url": "http://www.smsenvoi.com/httpapi/sendsms/"
}
```

Emails
------

### SendWithUs

The following example uses [SendWithUs](https://www.sendwithus.com) email templating/formatting service.

```javascript
// data is a JSONObject, files is a JSONArray, returned value is a JSONObject
function(to, template, data, files) {
	try {
		var config = new JSONObject(Grant.getSystemAdmin().getParameter("SENDWITHUS_CONFIG", "{}"));
		var endpoint = config.optString("endpoint");
		var apikey = config.optString("apikey");
		var locale = config.optString("locale");
	
		var req = new JSONObject();
		req.put("recipient", new JSONObject().put("address", to));
		req.put("locale", locale);
		if (data) req.put("template_data", data);
		if (files) req.put("files", files);
			
		var res = Tool.readUrl(endpoint, apikey, "", req, null);
		console.log("Response: " + res);
		return new JSONObject(res);
	} catch (e) {
		console.error(e.javaException ? e.javaException.getMessage() : e);
	}
};
```
**Java**
```Java
public JSONObject sendMail(String to,String template,JSONObject data,JSONArray files) {
	String res="";
	try {
		JSONObject config = new JSONObject(Grant.getSystemAdmin().getParameter("SENDWITHUS_CONFIG", "{}"));
		String endpoint = config.optString("endpoint");
		String apikey = config.optString("apikey");
		String locale = config.optString("locale");
	
		JSONObject req = new JSONObject();
		req.put("recipient", new JSONObject().put("address", to));
		req.put("locale", locale);
		if (!Tool.isEmpty(data)) req.put("template_data", data);
		if (!Tool.isEmpty(files)) req.put("files", files);
		res = Tool.readUrl(endpoint, apikey, "", req, null);
	} catch (IOException e) {
		AppLog.error(e, grant);
	}
	AppLog.info("Response: " + res, grant);
	return new JSONObject(res);
}
```

Where the `SENDWITHUS_CONFIG` system parameter has the following JSON value:

```json
{
	"endpoint": " https://api.sendwithus.com/api/v1/send",
	"apikey": "<API key>",
	"locale": "en-US"
}
```

### MailJet

Here an example to use MailJet external service to send email. See [MailJet Guides](http://dev.mailjet.com/guides/).

#### System parameter 

First create a system param with MailJet api data. You will need your public and private key.

You may want to send transactionnal email. To do so, add your template id.  

```json
{
	"provider": "MailJet",
	"endpoint": " https://api.mailjet.com/v3/send",
	"apipublickey": "<your_public_key>",
	"apiprivatekey": "<your_private_key>",
	"templates": {
		"registration": "13237",
		"thanks": "45675"
	}
}
```

#### Code snippet

Create a script that can be used on different business object or external object. For example : 

```javascript
ExternalEmail = function(g) {
	var grant = g;

	var config = new JSONObject(grant.getParameter("EXTERNAL_EMAIL_CONFIG", "{}"));
	var provider = config.optString("provider");
	var endpoint = config.optString("endpoint");
	var apipublickey = config.optString("apipublickey");
	var apiprivatekey = config.optString("apiprivatekey");
	var templates = config.optJSONObject("templates");

	// Send email using a template created on service side.
	// template is a string and data is a JSONObject
	function send(template, data) {
		var headers = new HashMap();
		headers.put("Content-Type", HTTPTool.getMimeTypeWithEncoding(HTTPTool.MIME_TYPE_JSON, "UTF-8")); // Explicitly set content type as UTF-8-encoded application/json (not needed in version 4.0)

		var tmpl = templates.optString(template);

		var req = data;
		req.put("MJ-TemplateID", tmpl);

		var res = Tool.readUrl(endpoint, apipublickey, apiprivatekey, req, headers, "UTF-8"); // Must use UTF-8 encoding
		return new JSONObject(res);		
	}
	
	return { send: send };
};
```

**Java**
```Java
public class ExternalEmail implements java.io.Serializable {
	private static final long serialVersionUID = 1L;
	Grant grant=new Grant();
	JSONObject config= new JSONObject();
	String provider;
	String endpoint;
	String apipublickey;
	String apiprivatekey;
	JSONObject templates=new JSONObject();
	public ExternalEmail(Grant g){
		grant=g;
		config = new JSONObject(grant.getParameter("EXTERNAL_EMAIL_CONFIG", "{}"));
		provider = config.optString("provider");
		endpoint = config.optString("endpoint");
		apipublickey = config.optString("apipublickey");
		apiprivatekey = config.optString("apiprivatekey");
		templates = config.optJSONObject("templates");

	}
	// Send email using a template created on service side.
	// template is a string and data is a JSONObject
	public JSONObject send(String template,JSONObject data){
		HashMap<String,String> headers = new HashMap<>();
		headers.put("Content-Type", HTTPTool.getMimeTypeWithEncoding(HTTPTool.MIME_TYPE_JSON, "UTF-8")); // Explicitly set content type as UTF-8-encoded application/json (not needed in version 4.0)

		String tmpl = templates.optString(template);

		JSONObject req = data;
		req.put("MJ-TemplateID", tmpl);

		String res="";
		try {
			res = Tool.readUrl(endpoint, apipublickey, apiprivatekey, req, headers, "UTF-8"); // Must use UTF-8 encoding
		} catch (java.io.IOException e) {
			AppLog.error(e, grant);
		}
		return new JSONObject(res);
	}
	
}
```

#### Code snippet using a business Object

You can now use the previsous script on a business object hook and send an email. See [business object hooks code examples](/docs/documentation/core/objects/businessobject-code-hooks)

```javascript
var e = new ExternalEmail(this.getGrant());
var data = new JSONObject();
data.put("FromEmail", "contact@simplicite.fr");
data.put("FromName", "Simplicite Software");
data.put("Subject", "Bonjour");
// To be used with transactionnal email
data.put("MJ-TemplateLanguage", true);

var recipients = new JSONArray();
recipients.put(new JSONObject().put("Email", this.getFieldValue("email")));
data.put("Recipients", recipients);

// Vars define on your template to be replace with
var vars = new JSONObject();
vars.put("firstname", this.getFieldValue("firstname"));
data.put("Vars", vars);

var res = e.send("registration", data);
```
**Java**
```Java
ExternalEmail e = new ExternalEmail(getGrant());
JSONObject data = new JSONObject();
data.put("FromEmail", "contact@simplicite.fr");
data.put("FromName", "Simplicite Software");
data.put("Subject", "Bonjour");

// To be used with transactionnal email
data.put("MJ-TemplateLanguage", true);
JSONArray recipients = new JSONArray();
recipients.put(new JSONObject().put("Email", getFieldValue("email")));
data.put("Recipients", recipients);

// Vars define on your template to be replace with
JSONObject vars = new JSONObject();
vars.put("firstname", getFieldValue("firstname"));
data.put("Vars", vars)
JSONObject res = e.send("registration", data);
```

Currency rates
--------------

### Fixer.io

This example is a `MyCurrency` business object custom method that updates the records with rates values got from the [Fixer.io service](http://www.fixer.io).

```javascript
MyCurrency.getRates = function(base, currencies) {
	try {
		var res = Tool.readUrl("http://api.fixer.io/latest?base=" + base + (currencies ? "&symbols=" + currencies.join() : ""));
		console.log("Response: " + res);

		var rates = new JSONObject(res).getJSONObject("rates");

		var ot = new BusinessObjectTool(this) // or this.getTool() in version 5+
		this.resetFilters();
		this.getField("curCurrency1").setFilter(base);
		var rows = ot.search(false);
		for (var i = 0; i < rows.size(); i++) {
			var row = rows.get(i);
			this.setValues(row, true);
			this.setFieldValue("curRate", rates.optDouble(this.getFieldValue("curCurrency2"), 0))
			ot.validateAndSave();
		}
	} catch (e) {
		console.error(e.javaException ? e.javaException.getMessage() : e);
	}
}
```
**Java**
```Java
public void getRates(String base, String[] currencies) {
	try{
		String res = Tool.readUrl("http://api.fixer.io/latest?base=" + base + (Tool.isEmpty(currencies) ? "": "&symbols=" + String.join("",currencies) ));
		AppLog.info("Response: " + res,getGrant());
		JSONObject rates = new JSONObject(res).getJSONObject("rates");
		BusinessObjectTool ot = new BusinessObjectTool(this); // or getTool() in version 5+
		resetFilters();
		getField("curCurrency1").setFilter(base);
		for (String[]row :ot.search() ) {
			setValues(row, true);
			setFieldValue("curRate", rates.optDouble(this.getFieldValue("curCurrency2"), 0));
			ot.validateAndSave();
		}
	}catch(IOException | ValidateException | SaveException | SearchException e){
		AppLog.error(e, getGrant());
	}
}
```

Typical usage would be `MyCurrency.getRates.call(this, "EUR", ["USD", "GBP"]);`.

<!--

Payment
-------

### Stripe

**To be completed**

-->

Cloud
-----

### Apache JClouds

As of version 4.0 P19 the [Apache JClouds](https://jclouds.apache.org/) Cloud Storage Java libraries are integrated to the standard libs
for use with the following stotages: AWS S3, OpenStack Swift, Google cloud storage and Azure Blob.

The `com.simplicite.util.tools.CloudStorage` class wrapper makes it easy to read/write files
from/to the above cloud storages. Example:
**Java**
```java
// (...)
import java.util.Date;
import com.simplicite.util.*;
import com.simplicite.util.tools.*;
// (...)
CloudStorageTool cst = null;
try {
	cst = new CloudStorageTool(getGrant().getJSONObjectParameter("MY_STORAGE_CONFIG"));
	String encoding = Globals.getPlatformEncoding();

	cst.put(new JSONObject()
		.put("name", "test.html")
		.put("mime", HTTPTool.MIME_TYPE_HTML)
		.put("encoding", encoding)
		.put("content", "<html><body>hello world " + new Date() + "!</body></html>")
	);

	JSONObject file = cst.get("test.html", true);
	AppLog.info(getClass(), "display", new String((byte[])file.get("content"), encoding), getGrant());
} catch (Exception e) {
	AppLog.error(getClass(), "display", null, e, getGrant());
} finally {
	if (cst != null) cst.close();
}
```

> **Note**: This example is given in Java, it can be easily transposed to Rhino script

Where the `MY_STORAGE_CONFIG` system parameter contains:

- for **AWS S3**:

```json
{
	"provider": "aws-s3",
	"accessKeyId": "<your access key ID>",
	"secretAccessKey": "<your access key secret>",
	"bucket": "<your bucket name>"
}
```

- for **OpenStack Swift**:

```json
{
	"provider": "openstack-swift",
	"tenant": "<your tenant name>",
	"username": "<your user name>",
	"password": "<your password>",
	"authUrl": "<your auth enpoint URL>",
	"region": "<your region name>",
	"container": "<your container name>"
}
```

- for **Google Cloud Storage**:

```json
{
	"provider": "google-cloud-storage",
	"accessKeyId": "<your access key ID>",
	"secretAccessKey": "-----BEGIN PRIVATE KEY-----\n<your access key secret>\n-----END PRIVATE KEY-----\n",
	"bucket": "<your bucket name>"
}
```

- for **Azure Blob**:

```json
{
	"provider": "azureblob",
	"accessKeyId": "<your access key ID>",
	"secretAccessKey": "<your access key secret>",
	"bucket": "<your bucket name>",
	"debug": true
}
```
