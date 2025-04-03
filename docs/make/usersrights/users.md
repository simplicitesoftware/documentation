---
sidebar_position: 10
title: Users
---

# User

## Introduction

In Simplicité, a User represents an individual or system entity that has access to the platform. Users interact with the system based on their responsibilities, which determine their access to business objects and system functionalities.

A user can be:
- A human user (e.g., an employee, administrator, or external partner)
- A system user (e.g., a web service account with API access)
- Etc.

## Features

1. Authentication & Access
    - By default, users log in using a **username and password**
    - Authentication can be enhanced with [multi-factor authentication](/docs/authentication/internal-auth) or [third-party authentication providers](/docs/authentication/oauth2)
    - Access to business objects and functionalities is governed by responsibilities
2. User Status 
    - Enabled: The user can log in and access the platform
    - Disabled: The user exists but cannot log in
    - Web services only: The user cannot log in but can access the platform's data through API calls

## Configuration

| Field | Description |
| ----- | ----------- |
| Login | User's unique identifier | 
| Active language | Language used for the user's UI |
| Preferred language | Language selected by user on first login |
| Min / Max size of lists | Override the list size selector on lists |
| Date format | Override the date format for the user |
| Number format | Override the number format for the user |
| Time zone | Override system timezone for user |
| Home page | User's home page (overridden by the active scope) |
| Menu visible | Display / Hide menu for the user |
| Default opened domain | Default menu opened after connecting |
| Authentication | See [internal authentication](/docs/authentication/internal-auth) |

## Configuration objects linked to a User

- [Dashboards](/make/userinterface/views/dashboard) : List of Dashboards created by the user
- [Responsibilities](/make/usersrights/responsibilities) : List of a user's Responsibilities

## Learn more

- [Internal authentication](/docs/authentication/internal-auth)
- [Authentication providers](/docs/authentication/auth-providers)
- [OAuth2](/docs/authentication/oauth2)
- [Custom user object](/docs/misc/custom-user.md)