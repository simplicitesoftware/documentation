---
sidebar_position: 150
title: Patch level 12
---

Version 3.1 patchlevel 12 release note
======================================

Changes
-------

<!-- ### Configuration objects history

**TO BE COMPLETED** -->

<div id='filediffs'/>

### File diffs

A file diff feature has been integrated, this allows to check differences between versions of a file (server side script or HTML, JS, CSS resources).

<div id='hooks'/>

### canFollowLink & canCreateOnLink

Those 2 hooks have been added to the scripted objects.
Example :
```javascript
Myobject.canFollowLink(field) { return field && field.getName()=="ThisFieldOnly"; }
Myobject.canCreateOnLink(field) { return field && field.getName()=="ThisFieldOnly"; }
```

<div id='index'/>

### Hooks for index search

New hooks `preSearchIndex` and `postSearchIndex` have been added to change the result of full text search. The result is a `Vector` of `SearchItem`.

```javascript
GrantHooks.postSearchIndex = function(g,rows) {
	// Access to items
	for (var i=0; rows && i<rows.size(); i++) {
		var item = rows.get(i);
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

<div id='mainpage'/>

### Refactored main page

The following legacy main page components JSPs have been removed:

- `PUB_head.jsp` and `jsp/SYS_head.jsp`
- `PUB_foot.jsp` and `jsp/SYS_foot.jsp`
- `PUB_left.jsp` and `et jsp/SYS_menu.jsp`
- `PUB_right.jsp` and `jsp/SYS_extra.jsp`
- `PUB_shortcuts.jsp` and `jsp/SYS_shortcuts.jsp`
- `main.jsp` and `jsp/main.jsp`

This has no impact unless you have overridden some of these JSPs (which is certainly for bad reasons ;-).

<div id='fixes'/>

Fixes
-----

- Integration of _Rhino_ script engine libs as JSR223 third party libs + explicit usage of `"rhino"` engine.
- Export POI: option is not proposed when POI is not installed
- Object default SearchSpec: [login] and [userid] substitution have been fixed
