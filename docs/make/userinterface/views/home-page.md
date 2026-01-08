---
sidebar_position: 40
title: Home page
---

Home Page
=========

What is a home page?
--------------------

A view is an aggregation of components that can be used:

- a domain home page,
- a group home page,

The main components are:

- predefined searches,
- pivot tables,
- external objects (particular objects allowing, among other things, to create specific components to be inserted in the views)

Scopes
------

When a user has many groups of rights, it is often useful to offer him a way to limit his rights. For example,
an application administrator may want the application to behave as if he were a regular user. This use case is made possible thanks to scopes.

A scope is a group homepage that defines a certain number of active groups. When the user uses this scope, only these groups remain active.

As a designer, it is easy to test this functionality with the scopes already available:

- Application design
- Platform operation
- Rights management
- Simplicité Administrator (wildcard scope where all groups are active)
- etc.

To create a scope and make it available to a user:

1. Create a View (Interface > Views)
2. Add an Active Group ("Active group" tab)
3. Set the View as the Group's Home page
4. Add the user to the Group

How to create a home page?
--------------------------
