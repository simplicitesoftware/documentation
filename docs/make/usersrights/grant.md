---
sidebar_position: 60
title: Grant
---

# Grant

## Introduction 

In Simplicité, a Grant defines the association between a Group and a Function, determining the rights assigned to a Group. These rights are then inherited by all Users linked to that Group. Managing access at the Group level ensures a structured and scalable permission system.

Since Simplicité version 6, Function-based rights (Grants) apply to business objects for CRUD operations and actions. Many others configuration objects now rely on [permissions](/make/usersrights/permissions) instead of Functions. This evolution improves the security model by allowing more granular control over access to different types of objects. 

## Configuration

| Field | Description |
| ----- | ----------- |
| Group name | The Group receiving the Grant. |
| Function name | The Function defining access rights to objects. |
| Enabled | Determines whether the function is linked to the group. When Enabled is false, the group no longer has this function.  |
| Module name | Define the [module](/make/project/module) to which it belongs.   |  

## Features 

### Group-Function Association
A Grant acts as a link between a Group and a Function, allowing:  

- A Group to have multiple Grants, each providing access to different objects (business or others configuration objects).  
- A Function to be granted to multiple Groups, ensuring controlled access across different roles.  
    
### Role-Based Permission Management

By assigning Grants, Simplicité enables:

- Centralized access control: Users inherit rights and permissions of their assigned Group.
- Flexible and scalable authorization management: Access can be adjusted by modifying Group Grants and permissions instead of updating individual user rights.

Example use case :
The "DEMO_ADMIN" Group needs access to:  
- CRUD operations on the "DemoOrder" business object.
- A Grant links the "DEMO_ADMIN" Group to the "DEMO_ORD_CRUD" function.

All users in the "DEMO_ADMIN" Group inherit access to the "DemoOrder" object.

### Difference Between Grant and Responsibility

- A Grant defines what a Group can access (business objects or actions).  
- A Responsibility defines who belongs to a Group (User-Group association).  

## Meta-model
The functional key of Responsibility is:  
- A Grant links to a Group via grt_group_id.  
- A Grant links to a Function via grt_function_id.  
![](img/grant/meta-model.png)