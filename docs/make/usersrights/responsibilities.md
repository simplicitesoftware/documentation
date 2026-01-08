---
sidebar_position: 20
title: Responsibilities
---

Responsibilities
================

Introduction
------------

A Responsibility in Simplicité represents the link between Users and Groups, defining the roles and permissions assigned
to each user within an application. This ensures access control and authorization are centralized et the Group level.

Configuration
-------------

| Field          | Description                                                                                                            |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Group Name     | Group's identifier                                                                                                     |
| User login     | User's identifier                                                                                                      |
| Effective date | Start date of user's group membership                                                                                  |
| End date       | Start date of user's group membership (not required)                                                                   |
| Enabled        | Determines whether a user's group membership is active. When Enabled is false, the user loses the rights of this group |
| Module name    | Define the [module](/make/project/module) to which it belongs.                                                         |

Features
--------

### User-Group Association

The Responsibility is a link between Users and Groups, meaning:

- A User can have multiple Responsibilities, linking them to different Groups.
- A Group can include multiple Users via their assigned Responsibilities.

### Access Control and Authorization

By defining Responsibilities, Simplicité ensures that:

- Users automatically inherit the grants and permissions of their assigned Groups.
- Access control is managed centrally at the Group level, simplifying permission management.

### Example use case

- Suppose Group "Managers" has specific permissions for approving requests.
- Barbara Smith is assigned to the "Managers" Group through Responsibility.
- Barbara automatically inherits the Group's permissions without requiring individual access configurations.

Meta-model
----------

The functional key of Responsibility is:

- A Responsibility links to a User through rsp_login_id.
- A Responsibility links to a Group through rsp_group_id.
- Effective date rsp_start_date

This structure ensures that Users inherit permissions from the Groups they belong to, without requiring direct rights assignment.

![](img/responsibilities/meta-model.png)
