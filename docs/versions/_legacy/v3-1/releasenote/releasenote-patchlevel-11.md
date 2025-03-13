---
sidebar_position: 140
title: Patch level 11
---

Version 3.1 patchlevel 11 release note
======================================

Changes
-------

<div id='pivot'/>

### Improved pivot tables

#### Axis level sub-total and precision

It is now possible to define precision and sub-total for an axis level if needed.  

<!-- **TO BE COMPLETED** -->

#### Formula values

It is now possible to configure formula values (similar to calculated fields in Excel&reg; pivot tables).

Typical use case is when simple aggregates does not make sense (e.g. % rates, ponderate averages, ...).

The formula itself uses the `values` variables. It can be either a simple calculation formula such as:

```javascript
values[1] != 0 ? values[0] / values[1] : 0

```

It can also be a self-calling function if you need some more complex processing (but keep in mind that this is called many times when building the pivot table)

```javascript
(function() {
	var price = values[1] != 0 ? values[0] / values[1] : 0;
	console.log("TOTAL=" + values[0] + ", QUANTITY=" + values[1] + ", AVG. PRICE=" + price);
	return price;
})();

```
 
Fixes
-----

N/A
