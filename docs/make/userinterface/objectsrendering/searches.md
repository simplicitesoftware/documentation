---
sidebar_position: 10
title: Searches
---

Searches
========

Introduction
------------

Searches in Simplicité allow predefined filters to be saved on object lists.

They provide a quick way to access frequently used filtered views without
redefining criteria each time.

Saved searches can be personal or public, depending on configuration.

A recommended approach is to create public Searches using the **designer**
and associate them with views or dashboard components.

Configuration
-------------

| Field       | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| Object Code | Business object on which the search applies                    |
| User Login  | Owner of the search                                            |
| Name        | Name displayed in the search selector                          |
| Public      | If enabled, the search is visible to other users               |
| Filters     | JSON definition of the applied filters                         |
| Module Name | Defines the [module](/make/project/module) to which it belongs |

### Personal Searches

- Visible only to the user who created them.
- Useful for individual working filters.
- Ideal for temporary or user-specific criteria.

### Public Searches

- Visible to other authorized users.
- Useful for shared in views, dashboards.
  
Filters
-------

Filters are stored in JSON format and represent the applied list criteria.

Example:

```json
{
  "log_event_id__lev_level": ["F", "E", "W"]
}
```

Another example:

```json
{
  "order__job_start_dt": -1
}
```

The JSON structure reflects:

- Field-based filters
- Multi-value selections
- Advanced search conditions

Integration with Views and Dashboards
--------------------------------------

The recommended pattern is:

1. Save the Search using the **designer**.
2. Mark it as Public if it must be shared.
3. Associate the Search with:
   - A View
   - A Dashboard component

This approach ensures:

- Centralized filter configuration
- Reusability across UI components
- Consistent data visualization

Execution Behavior
------------------

When a Search is selected:

- The defined filters are automatically applied.
- The object permissions still apply.
- Only authorized data is displayed.

Searches do not bypass security rules.
They only apply predefined filtering criteria on top of existing permissions.

Learn more
----------

- [Dashboards](/docs/make/userinterface/views/dashboard.md)
- [Views](/docs/make/userinterface/views/home-page.md)
  