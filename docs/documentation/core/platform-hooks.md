---
sidebar_position: 50
title: Platform Hooks
---

Platform hooks
==============

This document describes the hooks that can be implemented to put some **additional** business logic at user session level.

> **Important**: As of version 5.0, static grant hooks are **deprecated**, they are replaced by the platform hooks singleton with same methods.  
>**Rhino** scripting language is no longer supported in Simplicité version 6.0+.

> This document describes `PlatformHooks` implementation examples but it can be directly transposed to legacy `GrantHooks`.

>None of these hooks **needs** to be implemented. You can implement one or several of these hooks if you want to apply out some dynamic business logic that goes beyond what can be configured.

>These hooks are located in the singleton shared code named `PlatformHooks`.

<h2 id="authhooks">Authentication hooks</h2>

The `customAuth` (version 3.2+), `parseAuth` (version 3.0+) and `postAuth` (version 4.0+) can be used to implement/customize authentication flows.

```mermaid
flowchart TD
    A0-->H 
    H -- Yes -->B
    H -- No -->A
    B-->D
    D-->A
    A-->E
    E-->F 
    F-->G1
    G1-->G
    A0(customAuth) 
    A("parseAuth (extract login)")
    B(preAuth)
    D("postAuth")
    E("preLoadGrant")
    F("postLoadGrant")
    G("postLoadHome")
    H{internal auth?}
    G1(preLoadHome)
```

Check:

- [JavaDoc](https://platform.simplicite.io/current/javadoc/com/simplicite/util/PlatformHooks.html)
- [this document about custom authentication](/docs/documentation/authentication/customauth), 
- [this document about OAuth2 authentication](/docs/documentation/authentication/oauth2)
- [this document about SAML authentication](/docs/documentation/authentication/saml) for details.

<h2 id="startpagehook">Custom start page hook</h2>

As of version 5.0 `customStartPage` platform hooks allows to implement a custom low-level start page `/` instead of the default start page that only redirects to `/ui/`.  

Note that similar start page customization can also be achieved at a higher level by implementing the `displayPublic` hook of a disposition associated to the `public` user.

<h2 id="startpagehook">Custom authentication page hook</h2>

As of version 5.0, the `customAuthPage` platform hooks allows to implement a custom authentication/page.

For more details  [refer to this documentation](/docs/documentation/authentication/custom-page)

<h2 id="startpagehook">Custom health check hook</h2>

As of version 6.2 the `customHealthCheck` platform hook allows to implement e custom health check, e.g.:

```java
@Override
public void customHealthCheck(HttpServletRequest request, HttpServletResponse response, boolean minimal) throws Exception {
	AppLog.info("Custom health check called from " + request.getRemoteAddr());

	ServletTool.success(request, response, new JSONObject()
		.put("status", "OK")
		.put("date", Tool.toDatetime(new Date())));
}
```
<h2 id="rightshooks">User rights hooks</h2>

### `preLoadGrant` &amp; `postLoadGrant`

Two hooks can be used to dynamically customize the user rights.
 
The `preLoadGrant` is called **before** actually loading the user rights (at that stage the user is authenticated and the platform only knows its login).

Example:

**Java**

```Java
@Override
public void preLoadGrant(Grant g) {
	String login = g.getLogin();
	// e.g. load custom responsibilities and user profile
	super.preLoadGrant(g);
}
```

<details>
<summary>Rhino JavaScript equivalent</summary>

```javascript
PlatformHooks.preLoadGrant(g) {
	var login = g.getLogin();
	// e.g. load custom responsibilities and user profile
}
```
</details>

The `postLoadGrant` is called **after** the user rights are loaded (responsibilities, system parameters...).

Example:

**Java**

```Java
@Override
public void postLoadGrant(Grant g) {
	AppLog.info("Hello " + g.getFirstName() + "!",g);
	// e.g. add custom rights...
	super.postLoadGrant(g);
}
```

<details>
<summary>Rhino JavaScript equivalent</summary>

```javascript
PlatformHooks.postLoadGrant(g) {
	console.log("Hello " + g.getFirstName() + "!");
	// e.g. add custom rights...
}
```
</details>

<h2 id="menuhooks">Menu hooks</h2>

### `isMenuEnable`

This hook can be used to dynamically disable a menu item.

It is called for each granted menu item for considered user.

Example:

**Java**

```Java
@Override
public boolean isMenuEnable(Grant g, String domain, String item) {
	// Example to hide to group SIMPLE_USER the Product in the Marketing domain.
	return !(g.hasResponsibility("SIMPLE_USER") && "DomainMarketing".equals(domain) && "Product".equals(item));
}
```

<details>
<summary>Rhino JavaScript equivalent</summary>

```javascript
PlatformHooks.isMenuEnable(g, domain, item) {
	// Example to hide to group SIMPLE_USER the Product in the Marketing domain.
	if (g.hasResponsibility("SIMPLE_USER") && domain=="DomainMarketing" && item=="Product")
		return false;
	return true;
}
```
</details>

<h2 id="searchhooks">Fulltext search hooks</h2>

### `preSearchIndex` &amp; `postSearchIndex`

These hooks change the result of a fulltext search. The `rows` argument is a `Vector` of `SearchItem`.

Example:

**Java**

```Java
@Override
public List<SearchItem> postSearchIndex(Grant g, List<SearchItem> rows) {
	// Access to the default result
	for (SearchItem item : rows) {
		// Change anything to display here...
		AppLog.info("score "+item.score,g);   // Optional scoring
		AppLog.info("object "+item.object,g); // Optional object name
		AppLog.info("row_id "+item.row_id,g); // Optional row_id
		AppLog.info("key "+item.key,g);   // Item unique key
		AppLog.info("ukey "+item.ukey,g); // Default user key to display
		AppLog.info("data "+item.data,g); // Default payload or summary to display
		if (!Tool.isEmpty(item.values)) {
			// Optional object values as a List of String
		}	
	}

	// Sample to add an item on top
	SearchItem item = new SearchItem();
	item.score = "1000";
	item.ukey = "The best item";
	item.data = "This item is always returned...";
	if (!Tool.isEmpty(rows)) rows.add(0,item);
	return rows;
}
```

<details>
<summary>Rhino JavaScript equivalent</summary>

```javascript
PlatformHooks.postSearchIndex = function(g, rows) {
	// Access to the default result
	for (var i=0; rows && i<rows.size(); i++) {
		var item = rows.get(i);

		// Change anything to display here...
		console.log("score "+item.score);   // Optional scoring
		console.log("object "+item.object); // Optional object name
		console.log("row_id "+item.row_id); // Optional row_id
		console.log("key "+item.key);   // Item unique key
		console.log("ukey "+item.ukey); // Default user key to display
		console.log("data "+item.data); // Default payload or summary to display
		if (item.values) {
			//... Optional object values as a List of String
		}	
	}
	
	// Sample to add an item on top
	var item = new SearchItem();
	item.score = "1000";
	item.ukey = "The best item";
	item.data = "This item is always returned...";
	if (rows) rows.add(0,item);
	
	return rows;
}
```
</details>

<h2 id="otherhooks">Other hooks</h2>

### `validatePassword`

This hook is called when a password change is attempted, it can be used to implement custom rules for password fomat validation:


**Java**

```Java
@Override
public List<String> validatePassword(Grant g, String pwd) {
	List<String> msgs = super.validatePassword(g, pwd);
	if (msgs==null) msgs = new ArrayList<String>();
	if (pwd.indexOf("_") < 0)
		msgs.add(Message.formatError("ERR_SYN_CASE_SUGGESTION", "A good password must include an underscore!", null));
	return msgs;
}
```

<details>
<summary>Rhino JavaScript equivalent</summary>

```javascript
PlatformHooks.validatePassword = function(g, pwd) {
	if (pwd.indexOf("_") < 0)
		return "A good password must include an underscore!";
};
```
</details>

It can returns either a single error message (like in the example above) or an array of error messages.
An error message can either be a hard-coded label (like in the example above)
or, better, the code of a configured static text (so as it is displayed in the user's language).
Otherwise, it must either return nothing (like in the example above) or an explicit `null` value to indicate that the password is accepted. 

The default system-level implementation for password validation is that a password must have at least 8 digits.
The error(s) returned by the above hooks are **added** to the default error message returned when password length is less than 8 digits.

### `logout`

This hook is called when an explicit or implicit logout occurs (it is called just before the session is dropped)

**Java**

```Java
@Override
public void logout(Grant g) {
	AppLog.info("Bye bye " + g.getLogin() + "!", g);
	super.logout(g);
}
```
<details>
<summary>Rhino JavaScript equivalent</summary>

```javascript
PlatformHooks.logout = function(g) {
	console.log("Bye bye " + g.getLogin() + "!");
};
```
</details>

### `downloadDocument`

This hook is called when a document download has been requested and has been successfully checked (versions 3.2+):

**Java**

```Java
@Override
public void downloadDocument(Grant g, DocumentDB doc) {
	if ("MyObject".equals(doc.getObjectRef()))
		AppLog.info("The doc " + doc.getId() + " from object " + doc.getObjectRef() + " has been downloaded by " + g.getLogin(), g);
	super.downloadDocument(g, doc);
}
```

<details>
<summary>Rhino JavaScript equivalent</summary>

```javascript
PlatformHooks.downloadDocument = function(g, doc) {
	if (doc.getObjectRef() == "MyObject")
		console.log("The doc " + doc.getId() + " from object " + doc.getObjectRef() + " has been downloaded by " + g.getLogin());
};
```
</details>
