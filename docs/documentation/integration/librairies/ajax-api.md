---
sidebar_position: 10
title: Ajax API
---

Ajax API
========

Introduction
------------

The JavaScript files to include to use the Simplicité&reg Ajax API are:

- `scripts/ajax/appsession.js` (required) for application level services
- `scripts/ajax/grant.js` (required) for grant data manipulation (as of version 4.0)
- `scripts/ajax/businessobject.js` (optional) for business object level services
- `scripts/ajax/objectfield.js` (required with above) for object fields manipulations (as of version 4.0)
- `scripts/ajax/businessprocess.js` (optional) for business processes level services (as of version 3.1)
- `scripts/ajax/externalobject.js` (optional) for external objects level services (as of version 3.1)

As of **version 4.0.P19** a bundle of the above file is also available as `scripts/ajax/bundle.js` to ease inclusions.

> **Note**: in **versions 3.x** for backward compatibility reasons the Simplicit&eacute&reg; Ajax API described in this document is also
> available as a wrapped **synchronous** API for simplified usage within the generic web UI (`scripts/services.js`).
> This synchronous API is not described here and must be considered as a **deprecated** legacy API,
> it should not be used anymore and any existing code using it should be refactored to use the standard
> asynchronous Ajax API described here.

Some examples below uses jQuery snippets (where `$` is the alias for `jQuery` like in `$("<div/>").text("Hello world")`).
To get them working you need to include `jquery.js`.

### Application parameters

The initial step is to instantiate a new `Simplicite.Ajax` pointing to your Simplicité application
using appropriate parameters:

```javascript
var app = new Simplicite.Ajax("<root>", "<gateway>"[, "<login>", "<password>"]);
```

Where `<root>` can be either:

- a simple application root (e.g. `myapp`) in that case the base URL is considered to be the same as the
current application base URL (this is typically what to do in case of custom page managed within
a Simplicité&reg application, for instance as a configured external object)
- an absolute application URL (e.g. `http://myserver:8080/myapp` or `http://myserver:8080/appws`)

And where `<gateway>` is:

- `ui` for usage in an authenticated custom page of the generic Simplicité web UI
(no need to indicate user and password in that case as the current authenticated session is used)
- `uipublic` for usage in a custom public page of the generic Simplicité web UI
(no need to indicate user and password in that case as the public session is used)
- `api` (as of version 3.0 MAINTENANCE 20) for usage in an external custom page using the endpoints of the
generic Simplicité API (in that case a user and password **must** be provided)
- `ws` for usage in an external custom page using the endpoints of the generic Simplicité
webservices gateway (in that case a user and password **must** be provided, and if the `<root>` parameter is a simple
application root, a trailing `"ws"`is appended to it to build the base URL)

> **Note**: Instanciating a `Simplicite.Ajax` does not actually connect to the application (it does not initiate a user session).
> The connection actually occurs when calling a first service.

### General principles

The services functions (the ones that do HTTP calls to JSON services on server side) all take a callback function as **first** argument
and an optional parameters object as **last** argument (except the `login` and `logout` application level services, see below):

A typical usage is as follows:

```javascript
<service>(function(result) {
	// do something with result
}, ...[, params]);
```

The content of the optional `params` parameter object depends on the service but there are 2 parameters that apply to all services:

- `async` to indicate if the service is called asynchronously or not (defaults to `true`). This can also be done globally using the `setAsync(true|false)` function.
- `error` as a local error handler (no default, if not specified the global error handler is used, see below).

Example:

```javascript
app.getGrant(function(res) {
	console.log("Hello " + res.firstname + "!");
}, {
	error: function(err) {
		console.error(app.getErrorMessage(err));
	}
});
```
You can also set a global request timeout by using the `app.setTimeout(<timeout in milliseconds>)` function, in case of timeout a standard error is generated.

### Custom error, warning, info and debug global handlers

The default global handlers just log messages to the browser's console. You can override them by:

```javascript
app.setErrorHandler(function(err) {
	var msg = app.getErrorMessage(err); // to extract the actual message as the argument can be an exception or a error block from server
	// Do something
});
app.setWarningHandler(function(msg) {
	// Do something
});
app.setInfoHandler(function(msg) {
	// Do something
});
app.setDebugHandler(function(msg) {
	// Do something
});
```

And you can set handlers active or inactive by:

```javascript
app.setErrorHandlerActive(true or false);
app.setWarningHandlerActive(true or false);
app.setInfoHandlerActive(true or false);
app.setDebugHandlerActive(true or false);
```

Note that the debug handler is inactive by default.

You can explicitely call handlers in your code by:

```javascript
app.error("Error message");
app.error(exception);
app.warning("Warning message");
app.info("Info message");
app.debug("Debug message");
```

Application-level services
--------------------------

### Login

The `login` service initiates a server session and returns the created session ID. It takes two callbacks as arguments,
the first one is call upon successful session creation, the second in case of failure.

Sample usage is:

```javascript
app.login(function(sessionId) {
	console.log("Your session ID is " + sessionId);
}, function(err) {
	// Do something with error, calling app.error as above is what happens if this callback is ommitted
	app.error(err);
});
```

### Logout

The `logout` service terminates a server sessin. It only makes sense when using the webservice gateway (the session
lifecycle of UI public or authenticated gateways is managed by the UI). As the `login` service it takes two callbacks
as arguments, the first one is call upon successful session termination, the second in case of failure

Sample usage is:

```javascript
app.logout(function() {
	console.log("Your session is terminated";
}, function(err) {
	// Do something with error, calling app.error as above is what happens if this callback is ommitted
	app.error(err);
});
```

### Grant data

The `getGrant` service loads comprehensive data about the session user profile and rights.

Sample usage is:

```javascript
app.getGrant(function(grant) {
	console.log(grant);
	$("body").append($("<div/>").text("Hello " + grant.getFirstName() + " " + grant.getLastName()));
	if (grant.hasResponsibility("ADMIN"))
		$("body").append($("<div/>").text("Be careful, you are system administrator !"));
});
```

Note that once called the `getGrant` service, the grant data remains available in the `app.grant` variable.

You can call the `getGrant` service with the `inlinePicture` to get the user profile picture content locally:

```javascript
app.getGrant(function(grant) {
	// Do something...
}, { inlinePicture: true });
```

Then you can then display the user profile picture using a local data URL scheme (not suitable for old web browsers):

```javascript
$("body").append($("<img/>", { src: app.grant.picture.getDataURL() }));
```

You can also display the user profile picture (and its thumbnail) using document URLs without setting `inlinePicture`:

```javascript
$("body").append($("<img/>", { src: app.grant.picture.getURL() }));
$("body").append($("<img/>", { src: app.grant.picture.getThumbnailURL() }));
```

However this approach only makes sense from a custom page managed within the generic UI.
From an external page using the webservices gateway each displayed image as `<img/>` tag is likely to initiate a separate session.

### Application information

The `getAppInfo` service loads general information about the application (name, version, platform version, encoding, ...).

Sample usage is:

```javascript
app.getAppInfo(function(appinfo) {
	console.log(appinfo);
});
```

Note that once called the `getAppInfo` service, the application information remains available in the `app.appinfo` variable.

### System information

The `getSysInfo` service loads current system health data of the application (memory, disk, cache, ... usage).

Sample usage is:

```javascript
app.getSysInfo(function(sysinfo) {
	console.log(sysinfo);
});
```

Note that once called the `getSysInfo` service, the system health data remains available in the `app.sysinfo` variable.

### System parameters

The `getSysParams` service loads **all** current session's parameters.

Sample usage is:

```javascript
app.getSysParams(function(sysparams) {
	console.log(sysparams);
	$("body").append($("<div/>").text("Version " + sysparams["VERSION"]));
});
```

Note that once called the `getSysParams` service, the application system parameters remains available in the `app.sysparams` variable.

The `getSysParam` service gets a single system parameter.

Sample usage:

```javascript
app.getSysParam(function(value) {
	$("body").append($("<div/>").text("MYPARAM = " + value));
}, "MYPARAM");
```

> **Note**: As of **version 4.0** `app.grant.getParameter` is an alias to `app.getSysParam`.

The `setSysParam` service sets a single system parameter (and optionaly saves it as a user-overridden system parameter for current
user when setting the last argument to `true`, note that this only applies if a corresponding global system parameter exists).

Sample usage is:

```javascript
app.setSysParam(function(value) {
	$("body").append($("<div/>").text("MYPARAM = " + value));
}, "MYPARAM", "myvalue", true);
```

If the value is set to `undefined`, the system parameter is removed.

> **Note**: As of **version 4.0** `app.grant.setParameter` is an alias to `app.setSysParam` without the `save` argument which is **forced to `false`** in this case.

### Texts

The `getTexts` service loads texts of the application.

Sample usage is:

```javascript
app.getTexts(function(texts) {
	console.log(texts);
	$("body").append($("<div/>").text("LOADING text is " + texts["LOADING"]));
});
```

Note that once called the `getTexts` service, the system health data remains available in the `app.texts` variable.

The `getText` just returns the text for specified code from local `app.texts` variable.

### News

The `getNews` service loads current news.

Sample usage is:

```javascript
app.getNews(function(news) {
	console.log(news);
	for (var i = 0; i < news.length; i++) {
		$("body")
			.append($("<h4/>").text(news.getTitle(i)))
			.append($("<small/>").text(news.getDate(i)))
			.append($("<div/>").text(news.getContent(i)));
	}
});
```

Note that once called the `getNews` service, the news remain available in the `app.news` variable.

You can call the `getNews` service with the `inlineImages` to get the news images content locally:

```javascript
app.getNews(function(news) {
	// Do something...
}, { inlineImages: true });
```

Then you can then display a news image using a local data URL scheme (not suitable for old web browsers):

```javascript
$("body").append($("<img/>", { src: news.getImageDataURL(i) }));
```

You can also display a news image (and its thumbnail) using document URLs without setting `inlineImages`:

```javascript
$("body").append($("<img/>", { src: news.getImageURL(i) }));
$("body").append($("<img/>", { src: news.getImageThumbnailURL(i) }));
```

However this approach only makes sense from a custom page managed within the generic UI.
From an external page using the webservices gateway each displayed image as `<img/>` tag is likely to initiate a separate session.

Business objects services
-------------------------

### Get business object instance

To get a business object instance:

```javascript
var obj = app.getBusinessObject("<object name>"[, "<object instance name>"[, <autoRefreshMetaData>]]);
```

The instance name is optional, by default the instance name is `ajax_<object name>`.

The `autoRefreshMetaData` parameter forces a meta data refresh afetr every service call. It defaults to `false`.

### Get meta data

The `getMetaData` service gets object meta data (an optional context can be specified).

```javascript
obj.getMetaData(function(metadata) {
	console.log(metadata);
	$("body").append($("<div/>").text(obj.getName() + " = " + obj.getLabel()));
}[, { context: <context> }]);
```

Note that once called the `getMetaData` service, the object metadata remains available in the `obj.metadata` variable.

### Search records

The `search` service searches records according to specified filters (if no filters argument is set no search filters are applied).

```javascript
obj.search(function(list) {
	console.log(list);
	$("body").append($("<div/>").text("Found " + list.length + " records"));
}[, { <field1>: <filter1>, ..., <fieldN>: <filterN> }]);
```

Note that once called the `search` service, the search result list remains available in the `obj.list` variable
and the current filters remains available in the `obj.filters` variable.

The `obj.count` returns the total number of records that matches the search filters
(if no pagination is applied this equals the `obj.list.length`).

You can specifiy a `page` parameter to activate pagination on search, the `obj.maxpage`
gives you the number of pages (that are between `0` and `obj.maxpage - 1`) e.g.:

```javascript
obj.search(function(list) {
	console.log(list);
	$("body").append($("<div/>").text("Found " + obj.count + " records, out of which " + obj.list.length + " have been returned for parge " + obj.page + "/" + obj.maxpage));
}, undefined, { page: 0 });
```

You can specify a `inlineDocs` option to get document and image content fields inlined in the list. Each returned document have:

- an `id` attribute that gives the document ID (which is the value of the document field if `inlineDocs`is not specified) 
- a `mime` attribute that gives the document MIME type
- a `content` attribute that contains the document content as Base64-encoded string

The `inlineThumbs` option includes image thumbnails with the same principle, the `thumbnail` attribute contains the thumbnail content as base64-encoded string.

You can use both `inlineDocs` and `inlineThumbs`

If the inlined document field is an image you can display it using:

```javascript
$("body").append($("<img/>", { src: app.dataURL(obj.list[i].<field name>) }));
```

If the document/image field is not inlined you can get the download URL of the document/image using:

```javascript
app.documentURL(obj.metadata.name, "<field name>", (obj.list[i])[obj.getRowIdFieldName()], obj.list[i].<field name>);
```

The following example is the equivalent of the application-level news service example above
but using directly the `WebNews` object:

```javascript
var obj = app.getBusinessObject("WebNews");
obj.search(function(list) {
	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		$("body")
			.append($("<h4/>").text(item.nws_title))
			.append($("<small/>").text(item.nws_date))
			.append($("<div/>").text(item.nws_description));
		$("body").append($("<img/>", { src: app.dataURL(item.nws_image) }));
	}
}, undefined, { inlineDocs: true });
```

### Count records

As of **version 3.2 MAINTENANCE 05**, the `getCount` service counts records according to specified filters (if no filters argument is set no search filters are applied).

```javascript
obj.getCount(function(c) {
	console.log(c);
	$("body").append($("<div/>").text("There are " + c.count + " records = " + (c.maxpage+1) + " pages of " + c.pagesize + " records)"));
}[, { <field1>: <filter1>, ..., <fieldN>: <filterN> }]);
```

### Search records from index

As of **version 3.1 MAINTENANCE 07**, the `indexsearch` service searches records matching the specified index request (if the object is indexed).

```javascript
var request = "hello world"
obj.indexsearch(function(result) {
	console.log(result);
	$("body").append($("<div/>").text("Found " + result.length + " index records matching " + request));
}, request);
```

The result includes the index-related information (keys, index value, score) and the record item.

The object `list` variable is also set with the list of returned records.

### Get current filters

The `getFilters` service gets current filters.

```javascript
obj.getFilters(function(filters) {
	console.log(filters);
});
```

Note that once called the `getFilters` service, the object filters remains available in the `obj.filters` variable.

### Get single record

The `get` service gets one single record from specified row ID.

```javascript
obj.get(function(item) {
	console.log(item);
}, rowId);
```

Note that once called the `get` service, the object item remmains available in the `obj.item` variable.

As for the `search` service you can specify a `inlineDocs` parameter to get document and image fields inlined in the item.

If the inlined document field is an image you can display it using:

```javascript
$("body").append($("<img/>", { src: app.dataURL(obj.item.<field name>) }));
```

If the document/image field is not inlined you can get the download URL of the document/image using:

```javascript
app.documentURL(obj.metadata.name, "<field name>", obj.item[obj.getRowIdFieldName()], obj.item.<field name>);
```

There are variants of the `get` service for getting a reccord in particular cases:

- `getForCreate` which initialize a record for creation (with default values processed),
this is the equivalent as calling the `get` service with `"0"` as row ID
- `getForUpdate` which initialize a record for update
- `getForCopy` which initialize a record for copy (the row ID used for getting the record
is set to `"0"` in the returened record)
- `getForDelete` which initialize a record for deletion

### Create record

The `create` service sends a record for creation.

```javascript
obj.create(function(item) {
	console.log(item);
}[, item]);
```

If no explicit `item` is passed as argument the current `obj.item` is used.

Except for simple cases, the record to create should be got by the `getForCreate` service.

```javascript
obj.getForCreate(function(item) {
	console.log(item); // initialized record for creation
	obj.create(function(item) {
		// set some fields...
		console.log(item); // created record (with created row ID)
	}[, item]);
});
```

A typical way to set a document field from a HTML form text input or textarea
would be to do as follows:

```javascript
obj.item.<document field> = { id: "0", name: "myfile.txt", mime: "text:plain", content: app.base64Encode($("#mytextinputortextarea").val()) };
```

A typical way to set a document field from a HTML form file input for upload
would be to do as follows (only works for modern browsers that provides `FileReader` implementation):

```javascript
var r = new FileReader();
r.onloadend = function(e) {
	obj.item.<document field> = { id: "0", name: f.name, mime: f.type, content: app.base64EncodeArrayBuffer(e.target.result) };
});
r.readAsArrayBuffer($("#myfileinput")[0].files[0]);
```

Here is a comprehensive example on the `WebNews` object:

```javascript
$("#ok").click(function() {
	var f = $("#image")[0].files[0];
	var r = new FileReader();
	r.onloadend = function(e) {
		var c = app.base64EncodeArrayBuffer(e.target.result);
		var obj = app.getBusinessObject("WebNews");
		obj.getForCreate(function() {
			console.log(obj.item);
			obj.item.nws_title = $("#title").val();
			obj.item.nws_description = $("#desc").val();
			obj.item.nws_image = { id: "0", name: f.name, mime: f.type, content: c };
			obj.create(function() {
				alert("News created !");
				$("#title").val("");
				$("#desc").val("");
				$("#image").val("");
			});
		});
	};
	r.readAsArrayBuffer(f);
});
```

Where the corresponding HTML form components are:

```html
&lt;input type="text" id="title" placeholder="Title"/&gt;&lt;br/&gt;
&lt;textarea id="desc" placeholder="Description"&gt;&lt;/textarea&gt;&lt;br/&gt;
&lt;input type="file" id="image" placeholder="Image"&gt;&lt;br/&gt;
&lt;input type="button" id="ok" value="OK"/&gt;
```

### Update record

The `update` service sends a record for update.

```javascript
obj.update(function(item) {
	console.log(item);
}[, item]);
```

If no explicit `item` is passed as argument the current `obj.item` is used.

The record to create should typically be got by the `getForUpdate` service.

```javascript
obj.getForUpdate(function(item) {
	console.log(item); // initialized record for update
	obj.update(function(item) {
		// update some fields...
		console.log(item); // updated record
	}[, item]);
});
```

> **Warning**: The principles for setting a document for update is as above except that the `id` should be left as is so as the document is just updated.

### Copy record

A copy is a creation where the record to create is got by the `getForCopy` service.

```javascript
obj.getForCopy(function(item) {
	console.log(item); // initialized record for copy
	obj.update(function(item) {
		// update some fields...
		console.log(item); // created record (with created row ID)
	}[, item]);
});
```

### Delete record

The `del` service deletes the record that corresponds to specified row ID.

```javascript
obj.del(function() {
	console.log("Deleted !");
}, rowID);
```

### Object parameters

The `setParameter` service sets a single object parameter.

Sample usage is:

```javascript
obj.setParameter(function(value) {
	$("body").append($("<div/>").text("MYOBJPARAM = " + value));
}, "MYOBJPARAM", "myvalue");
```

If the value is set to `undefined`, the object parameter is removed.

The `getParameter` service gets a single object parameter.

Sample usage is:

```javascript
obj.getParameter(function(value) {
	$("body").append($("<div/>").text("MYOBJPARAM = " + value));
}, "MYOBJPARAM");
```

### Call action

The `action` service runs a specified action.

Sample usage is:

```javascript
obj.action(function(result) {
	$("body").append($("<div/>").append("myAction result = " + result);
}, "myAction");
```

### Apply publication template

The `print` service applies a specified publication template.

Sample usage is:

```javascript
obj.print(function(result) {
	$("body").append($("<div/>").append("MyPublicationTemplate result = " + result);
}, "MyPublicationTemplate");
```

### Get pivot table data

The `crosstab` service processes a specified pivot table.

Sample usage is:

```javascript
obj.crosstab(function(table) {
	console.log(table);
}, "MyPivotTable");
```

### Thread safe considerations

Due to the way Simplicité handles its business object instances,
calling several APIs in paralel on the same business object instance is not thread safe.

For instance, if you need to iterate on API calls, dont do it inside a `for` or a `while` loop
(except if you set the `async` parameter to `false` which is not always a good approach),
but (for instance) do it like this:
 
```javascript
function myloop(i, n, callback) {
	if (i == n) { // Loop end
		callback && callback.call(this);
	} else {
		obj.<api>(function(<result>) {
			// Do something with the result...
			myloop(i+1, n, callback); // Next loop iteration
		}, <params>);
	}
}
// Start the loop
myloop(0, 10, function() {
	// Do something after the loop...
});
```

Business processes services
---------------------------

### Get a business process

To get an existing business process :

```javascript
var pcs = app.getBusinessProcess("<process name>");
```

### Get meta data

The `getMetaData` service gets process meta data.

```javascript
pcs.getMetaData(function (metadata) {
	console.log(metadata);
});
```

Note that once called the `getMetaData` service, the process meta data remains available in the `pcs.metadata` variable.

<!-- 
External objects services
-------------------------

### Get external object

**TO BE COMPLETED**

### Get meta data

**TO BE COMPLETED**
-->

Custom usage
------------

Example in plain HTML, see [this GitHub repository](https://github.com/simplicitesoftware/ajax-demo/blob/master/basic-ajaxlib-example.html)
