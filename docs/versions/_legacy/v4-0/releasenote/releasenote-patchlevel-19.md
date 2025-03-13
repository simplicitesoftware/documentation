---
sidebar_position: 19
title: Patch level 19
---

Version 4.0 patchlevel 19 release note
======================================

Core changes
------------

- Added Apache JClouds libs (limited to cloud storages: AWS S3, AzureBlob, Google cloud storage, and OpenStack swift)
  and wrapper tool class `CloudStorageTool`
- Updated 3rd party libs
- Ajax libs bundle made available in `scripts/ajax/bundle.js` for easier inclusion in frontend pages

UI changes
----------

- External object with extra CSS/JS
- Associate with final reload and toast message
- Link template to separate parent/child/options
- Link property `Inline fields` is not implemented on responsive UI

Fixes
-----

- Fixed double call of state transition configured callback in some cases
- Fixed total columns style on textual crosstab
- Fixed new icon/image in scope dropdown
- Fixed bad classname value for Java external objets on startup
- Fixed Java dispositions serialization
