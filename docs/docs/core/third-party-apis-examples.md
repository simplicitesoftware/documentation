---
sidebar_position: 160
title: Third party apis examples
---

Third party APIs examples
=========================

These are examples of calls to various third party APIs done on server side.

Introduction
------------

Simplicité being a Java platform, calling **any** HTTP-based resource (file, API, ...) can be done using either:

- Standard low-level HTTP client Java API (`java.net.[http.]*`)
- Included HTTP client libraries such as the Apache HTTP Client library or the Unirest client library for APIs
- Utility classes provided by Simplicité such as `com.simplicite.util.HTTPTool`
  or the very simple `Tool.readUrl(...)`, e.g. calling an REST-like API returning a JSON object:

```java
JSONObject result = new JSONObject(Tool.readUrl("http(s)://my3rdpartyapi.com/a/b/c?d=e"));
String status = result.getString("myAPIStatus");
(...)
```

The following **non limitative** list of examples are describing some specific cases for which higher level utility classes exists
(provided by Simplicité and/or by the vendor of the 3rd party API, e.g. Google APIs).

But the same could be achieved using one of the low-level above approaches.

Note that some of these 3rd party APIs may need a paying subscription and/or may have a limited free tier.

Calendar
--------

This example is based on the **client side** Google Calendar API.

> **Note**: As of version 4.0 it is also possible to use the **server side** Google calendar API wrapped into the `GoogleAPI` tools class.
> the example below is kept here for historical reasons.

### Google Calendar API

You should have activate Google OAuth2 authentication to use it. See [Tomcat OAuth2 authentication](/docs/authentication/oauth2)

See [https://developers.google.com/google-apps/calendar](https://developers.google.com/google-apps/calendar/) for details.

#### System parameters

The `OAUTH2_SCOPES` system param has to contain `https://www.googleapis.com/auth/calendar`
You may want to create `GOOGLE_CALENDAR_ID` system param to work on a specific calendar.

#### Code snippet

Here a generic script to use to create, update or delete an event.

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

You can now use the previous script on a business object hook and create an event. See [business object hooks code examples](/docs/core/objects/businessobject-code-hooks)

Example of a business object where event are created on google calendar. Date has to be on RFC3339 format. Simplicite provide method to change date to this specific format.
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

This example sets a `myCoords` object field (of type geographical coordinates) with the coordinates
returned by Google Maps geocoding service using the value of the `myAddress` text field.

```Java
	ObjectField a = getField("myAddress");
	GMapTool gT=new GMapTool(getGrant());
	if (a.hasChanged())
		setFieldValue("myCoords", gT.geocodeOne(a.getValue().replace("\n", ", ")));
```
> **Note**: to debug response from the API you can use the `DCORESV001` log event code

### Nominatim

**Nominatim** is OpenStreetMap's geocoding service. Please read the [usage policy](https://operations.osmfoundation.org/policies/nominatim/) as it may not be suitable for you case.

```java
private static String geoCode(String address, String zipCode, String city, String country) throws IOException,JSONException{
	// PLEASE READ NOMINATIM USAGE POLICY
	// https://operations.osmfoundation.org/policies/nominatim/
	final String GEOCODE_SERVICE_URL = "https://nominatim.openstreetmap.org/search?format=jsonv2&q=";
	JSONObject o = new JSONArray(Tool.readUrl(GEOCODE_SERVICE_URL+HTTPTool.encode(
		address
		+","+zipCode
		+","+city
		+","+country
	))).getJSONObject(0);
	return o.getString("lat")+","+o.getString("lon");
}
```

Translation
-----------

### Google Translate

As of **version 4.0** it is possible to submit translation requests to Google Translate API using the `GoogleAPITool.translate()` method.

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

You may want to send transactional email. To do so, add your template id.

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

You can now use the previous script on a business object hook and send an email. See [business object hooks code examples](/docs/core/objects/businessobject-code-hooks)

```Java
ExternalEmail e = new ExternalEmail(getGrant());
JSONObject data = new JSONObject();
data.put("FromEmail", "contact@simplicite.fr");
data.put("FromName", "Simplicite Software");
data.put("Subject", "Bonjour");

// To be used with transactional email
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

The [Apache JClouds](https://jclouds.apache.org/) Cloud Storage Java libraries are integrated to the platform's standard libs
for use with the following cloud storages: AWS S3, OpenStack Swift, Google cloud storage and Azure Blob.

You can use either the JClouds API or the `com.simplicite.util.tools.CloudStorage` class wrapper which makes it easy to read/write files
from/to the cloud storages.

Example:

**Java**
```java
// (...)
import com.simplicite.util.tools.CloudStorageTool;
// (...)
try (CloudStorageTool cst = new CloudStorageTool(getGrant(), getGrant().getJSONObjectParameter("MY_STORAGE_CONFIG")) {
	cst.put(new JSONObject()
		.put("name", "test.html")
		.put("mime", HTTPTool.MIME_TYPE_HTML)
		.put("content", "<html><body>hello world " + new java.util.Date() + "!</body></html>")
	);

	JSONObject file = cst.get("test.html", true);
	AppLog.info(new String((byte[])file.get("content")), getGrant());
} catch (Exception e) {
	AppLog.error(null, e, getGrant());
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
	"authUrl": "<your auth endpoint URL>",
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

Note that the implicit encoding in the above example is the platform's encoding (which is UTF-8 by default).
