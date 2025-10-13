---
sidebar_position: 130
title: JavaScript code examples
---

Core JavaScript code examples
=============================

This document describes the core **client-side JavaScript** API to be used within the generic UI pages

It applies to either:

- the additional client-side behavior you may want to add to the generic pages as object search pages, object list, object forms, ...
- your custom pages that uses the standard UI page framework (please refer to [this document](/docs/core/externalobject-code-examples) for details on how to develop such custom pages).

Note that you can use in either case the other JavaScript APIs such as:

- The [Ajax API](/docs/integration/libraries/ajax-api) using the `Simplicite.Application` singleton which is available in all standard pages.
- The [JavaScript UI tools](/docs/core/ui-tools-code-examples)

Page events
-----------

### Page loading

A JavaScript function can be bind to the page `load` event (it uses jQuery's `bind()` on the `"load"`" event
and the added functions are called **after** the standard load event functions of the generic UI):

Example 1 (using a constant):

```javascript
onload_functions.push(function() {
	console.log("Welcome to Simplicite version " + Simplicite.VERSION);
});
```
Example 1 (using the Ajax API singleton):

```javascript
onload_functions.push(function() {
	Simplicite.Application.getGrant(function(g) {
		console.log("Welcome " + g.login + "!");
	});
});
```

> **Note**: You can also use jQuery `$(document).ready()` but the functions will be called **before** the ones added as above and therefore **before** the standard
> load event functions, some standard stuff may not be initialized at that stage. The use of `ready`is thus **not recommended** unless you know what you do.
_
### Page before unloading

A JavaScript function can be bind to the page `beforeunload` event (it uses jQuery's `bind()` on the `"beforeunload"`" event and the added functions are called **after** the standard beforeunload event functions of the generic UI):

Example:

```javascript
onbeforeunload_functions.push(function() {
	return "Are you sure ?";
});
```

### Page unloading

A JavaScript function can be bind to the page `unload` event (it uses jQuery's `bind()` on the `"unload"`" event and the added functions are called **after** the standard unload event functions of the generic UI):

Example:

```javascript
onunload_functions.push(function() {
	console.log("Goodbye !");
});
```

<!-- 
### Main _Enter_ key press event

**TO BE COMPLETED**
-->

<!--
### Main _Esc_ key press event

**TO BE COMPLETED**
-->

<!-- Object form events
------------------

**TO BE COMPLETED**
-->

Custom JavaScript patterns
--------------------------

It is **highly recommended** to write your client JavaScript code in unique namespaces.

For instance you can use the object name `MyObject` as namespace (among advantages of this pattern you have private functions, per-business object naming unicity, etc.): 

E.g.:

```javascript
var MyObject = (function() {
    function myPublicFunction() {
        // Here I can use $ for jQuery
    }
    function myPrivateFunction() {
        // Here also
    }
    //...
    return { myFunction: myPublicFunction };
})();
```

Then tou can use calls like `MyObject.myFunction()`.
