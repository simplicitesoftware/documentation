---
sidebar_position: 240
title: Patch level 31
---

Version 3.0 maintenance 31 release note
=======================================

Changes
-------

- Optimization: usage of the `Simplicite.Ajax` singleton instead of new instances (and in place of synchronous calls using `services.js` wrappers)

Fixes
-----

- Fixed misinterpretations of `[<field name>]` snytax (instead of `[VALUE:<field name>]`) in complex expressions
- Fixed regression on custom function calls in scripted objects and workflows (due to partial backport of version 3.1's optimizations donc in `MAINTENANCE-30` release)
