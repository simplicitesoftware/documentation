---
sidebar_position: 270
title: Patch level 34
---

Version 3.0 maintenance 34 release note
=======================================

Changes
-------

- Count in SOAP/REST webservices now returns actual list length when `getCount` return zero (e.g. useful when list is built dynamically in the `pre/postSearch` hooks)
- Search: force a final sort on the primary key field (to make the pagination ordering predictable)

Fixes
-----

- Fixed restore preference
- Fixed missing update of current list row values after `postSelect` hook call on lists
- Fixed joined document deletion when the document is referenced and the relationship is removed
- Fixed `log_user` size to `100`
- Fixed double call to `isUpdateEnable` and `isDeleteEnable`
- Fixed method type print template invokation failure in some cases
