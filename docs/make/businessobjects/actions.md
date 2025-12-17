---
sidebar_position: 60
title: Actions
---

Actions
=======

What is an Action?
------------------

Actions allow the user to interact with a business object. Some of them are provided by default by the platform (create, copy, edit in bulk, etc.),
but it is often necessary to add business-specific actions.

At the meta-model level, the action is linked to the object by a function, which allows an action to be shared by several objects.

The type of action and the type of action execution allow to distinguish various usage scenarios:

|   | List | Item (Line / form) | Hidden |
|---|------|--------------------|--------|
|Front-end|Run front-end script on a set of elements (e.g. copy a list of user emails to the clipboard)|Run front-end script on a single element (e.g. copy user's email to clipboard)|No use case possible|
|Back-end|Execute a script on a set of elements (e.g. have the platform send an email to a set of users)|Execute a script on a single element (e.g. have the platform send an email to the user)|Provide an action accessible via web service or via code without displaying a button|
|None|Display of a button in the interface for use from front-end scripts|Display of a button in the interface for use from front-end scripts|No use case possible|

Front-end actions
-----------------

Simpler than back actions, clicking on a front action button only triggers the execution of the content of the "URL" field.

- if the field contains an internal URL (such as `[EXPR:HTMLTool.getExternalObjectURL("DemoOrderAgenda")]`) then the platform redirects to that page
- if the field contains the syntax `javascript:` (for example `javascript:alert('Hello World');`) then the platform will execute the javascript code

If this syntax is suitable for the simplest cases, it is often preferred to use a **non-executing** action that allows to provide a button,
whose click will be detected in the front-end scripts. This is discussed in the "Frontend Development" section.

Back-end actions
----------------

Back actions execute a service call to the back end, which will execute a script: either a Simplicité expression or a business object function,
as discussed in the "Back End Development" section.

Some actions may not be visible to users because they are only used by web services or other business objects.

A back action can be executed synchronously (the user waits for the end of the execution), asynchronously
(executes on the calling object instance in an independent thread, without blocking the interface)
or asynchronously independently (executes on an independent object instance in an independent thread, without blocking the interface).
