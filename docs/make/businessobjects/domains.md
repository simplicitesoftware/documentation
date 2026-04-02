---
sidebar_position: 10
title: Domains
---

Domains
=======

Introduction
------------

In Simplicité, a **Domain** represents a menu in the user interface (UI). It structures navigation and provides access to business objects, processes,
and other functionalities within the application.

Domains serve as the primary organizational unit for the application's menu system, allowing administrators to group related functionality and control
user access through permissions. They can be organized hierarchically using parent-child relationships, enabling nested menu structures.

When creating a new [Module](/make/project/module), the Module creation assistant can automatically create a Domain to ensure the module has a visible
entry in the UI menu. Domains can also be created independently and associated with existing modules.

Features
--------

1. **Menu Organization**
   - Structure application navigation into logical groups
   - Create hierarchical menu structures via parent-child relationships
   - Control menu item ordering

2. **Access Control**
   - Visibility controlled through [Permissions](/make/usersrights/permissions)
   - Integration with [Groups](/make/usersrights/groups) for role-based access
   - Domain-level access management

3. **Content Association**
   - Associate multiple object types to a Domain
   - Support for Business objects, Business processes, External objects, and Views
   - Optional Home page association

4. **Customization**
   - Custom icons for visual identification
   - Configurable display order
   - Optional home page hiding

Configuration
-------------

### Configuration Fields

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| **Domain Code** | String | Yes | Functional key (unique identifier) for the Domain |
| **Module name** | Module | Yes | The [module](/make/project/module) to which the Domain belongs |
| **Parent Domain** | Domain | No | Parent Domain for hierarchical menu structures |
| **Icon** | String | No | Icon code to customize the menu's appearance |
| **Order** | Integer | No | Display order of the Domain in the menu |
| **Hide the home page** | Boolean | No | Whether to hide the home page for this Domain |
| **Home page** | View | No | Associated [Home page](/make/userinterface/views/home-page) view |
| **Description** | String | No | Description text for generated documentation |

### Field Details

#### Domain Code

- **Purpose**: Unique functional key that identifies the Domain
- **Format**: Alphanumeric identifier following naming conventions
- **Constraints**: Must be unique across all Domains
- **Example**: `TrnDomain`, `SalesDomain`

#### Module name

- **Purpose**: Associates the Domain with a specific module
- **Behavior**: When created via Module creation assistant, defaults to the module being created

#### Parent Domain

- **Purpose**: Creates hierarchical menu structures
- **Use Case**: Organize related Domains under a parent menu item
- **Behavior**: Child Domains appear nested under the parent in the menu

#### Icon

- **Purpose**: Visual identifier for the Domain in the menu
- **Format**: Icon code (e.g., `fa-home`, `fa-users`)
- **Use Case**: Improve menu navigation and visual organization

#### Order

- **Purpose**: Controls the display sequence of Domains in the menu
- **Behavior**: Lower numbers appear first
- **Use Case**: Organize menu items in a logical sequence

#### Hide the home page

- **Purpose**: Controls whether the Domain's home page is hidden
- **Use Case**: Hide home page when Domain serves only as a container for other menu items

#### Home page

- **Purpose**: Associates a specific [Home page](/make/userinterface/views/home-page) view with the Domain
- **Behavior**: When users navigate to the Domain, they see the associated Home page
- **Use Case**: Provide a landing page or dashboard for the Domain

### Menu Content Types

The following object types can be associated with a Domain and appear in its menu:

| Object Type | Description |
| ----------- | ----------- |
| **Business object** | Standard business objects with CRUD operations |
| **Business process** | Workflow and process management objects |
| **Domain** | Child Domains for hierarchical structures |
| **External object** | Custom external objects and components |
| **Simple view** | Custom views and dashboards |

Behavior
--------

### Menu Display

Domains appear in the application's main menu based on their configuration and user permissions. The menu structure reflects:

- **Hierarchical organization**: Parent Domains contain child Domains
- **Ordering**: Domains are displayed according to their Order field
- **Visibility**: Only Domains with appropriate permissions are visible to users

### Access Control

Domain visibility is controlled through [Permissions](/make/usersrights/permissions). Users must have:

- Appropriate Group membership
- Permissions granted for the Domain
- Access to associated objects within the Domain

Domains without proper permissions are hidden from the user's menu, even if they exist in the configuration.

### Object Association

Objects are associated with Domains through the Main menu configuration. When objects are added to a Domain:

- They appear as menu items under the Domain
- They inherit the Domain's access control context
- They can be organized and ordered within the Domain

### Home Page Behavior

When a Domain has an associated Home page:

- Users navigating to the Domain see the Home page as the default view
- The Home page can be hidden via the "Hide the home page" setting
- Home pages can display dashboards, widgets, and other custom content

Related Objects
---------------

- **[Module](/make/project/module)**: Domains belong to modules and are created as part of module setup
- **[Permissions](/make/usersrights/permissions)**: Control Domain visibility and access
- **[Groups](/make/usersrights/groups)**: User groups determine Domain access
- **[Home page](/make/userinterface/views/home-page)**: Can be associated with a Domain for landing pages
- **[Business objects](/make/businessobjects/business-objects)**: Can be associated with Domains in the menu
- **[Business process](/make/businessprocess/business_process)**: Can be associated with Domains in the menu

Learn More
----------

- [Creating a Module Tutorial](/tutorial/getting-started/module) - Step-by-step guide including Domain creation
- [Permissions Documentation](/make/usersrights/permissions) - Managing Domain access control
- [Home Pages](/make/userinterface/views/home-page) - Configuring Domain landing pages
