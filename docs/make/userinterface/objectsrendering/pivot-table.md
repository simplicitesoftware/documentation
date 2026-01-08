---
sidebar_position: 30
title: Pivot table
---

Pivot table
===========

What is a Pivot table?
----------------------

Pivot tables allow you to cross-reference information object's fields of a given object. The tables are configured by choosing the following axes:

- the fields used as columns
- the fields used as rows
- the fields used as values

Only the object fields of the target business object can be used.

If there is no "value" axis, then the platform performs an enumeration.

Pivot tables offer many options to users:

- display or not the presented axes
- swapping of axes (`rows <-> columns`)
- filtering of the data used (note that the pivot table uses the filters already active on the object if a search has been performed)
- creation of graphs
- CSV, Excel, JSON exports (the latter can also be obtained by web service)
