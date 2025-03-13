---
sidebar_position: 300
title: Patch level 11
---

Version 3.1 maintenance 11 release note
=======================================

Changes
-------

- Optimization: usage of the `Simplicite.Ajax` singleton instead of new instances
- Static client JavaScript resources are not preprocessed anymore (only CSS are still preprocessed)
- Inclusion of disposition's `SCRIPT` resource if any.
- Expression syntax `[EXPR:...]` can now be used also for business workflow's `Forward` page data
- Updated icons
- Static content URL are using relative path syntax `<root>/content/<static file relative path>`
  (the legacy URL syntax `<root>/content?file=<static file relative path>` is kept for backward compatibility but its use is discouraged)
- Added last login date in health check service

Fixes
-----

- Fixed misinterpretations of `[<field name>]` syntax (instead of `[VALUE:<field name>]`) in complex expressions
- Fixed asynchronous calls to `setParameter`
- Fixed generic UI's asynchronous object deletions when business objet is not using form
- Fixed NPE when grant is null on `JSONServlet`
- Fixed edit list: display error messages on rows and continue saving rows after the first row in error
- Fixed some missing credentials options on some jQuery Ajax calls
- Fixed ZIP export failure when an attached file is missing
- Fixed some servlets `Content-Type` HTTP header not properly set
- Fixed cross domain issue with basic authentication in Ajax lib
- Fixed ZIP import to ignore non XML files in root directory
- Fixed action check in XML imports that was causing some imports to fail in some particular cases
- Fixed View with Predefined search on Enum field
- Fixed Predefined search deletion when user is not granted to Research
