---
sidebar_position: 50
title: Dashboard
---

Dashboard
=========

Introduction
------------

A dashboard is a visual interface that provides an overview of key data, metrics, and insights
in a structured and interactive way. Dashboards support filtering, drill-down exploration,
dynamic updates, and customization.

Features
--------

1. **Interactive Data Visualization**
   - Pivot tables for data analysis
   - Charts for visual representation
   - Custom widgets via external objects

2. **Filtering and Selection**
   - Filter data by period, category, or other criteria
   - Apply filters across multiple dashboard components
   - Time period filters with optional field filters

3. **Data Exploration**
   - Drill-down capabilities (click elements to see details)
   - Dynamic updates from connected data sources
   - Real-time data connections

4. **Customization**
   - Rearrange components via drag-and-drop
   - Customize display and layout
   - Create personalized reports

5. **Sharing**
   - Share dashboards with groups
   - Control access via DASHBOARD permissions

Access and Creation
-------------------

### Access Requirements

- **DASHBOARD_MAKER rights**: Required to create dashboards
- **Dashboard icon**: Appears in page header when rights are granted
- **ADMIN rights**: Provides additional configuration options

### Dashboard Editor

The Dashboard Editor is accessed via the dashboard icon in the page header. It provides:

- **Component selection**: Choose from available components
- **Layout management**: Drag-and-drop component positioning
- **Preview**: Preview dashboard before saving
- **Auto-arrange**: Automatically arrange components
- **Save/Close**: Save or discard changes

Dashboard Components
--------------------

Dashboards can contain the following component types:

| Component Type | Description | Requirements |
| ---------------- | ------------- | -------------- |
| **Pivot** | Pivot table visualization | Available pivot tables with access rights |
| **Chart** | Chart visualization of pivot data | Pivot table with chart display enabled |
| **Widget** | Custom external object widget | External objects configured as widgets |
| **Filter** | Search bar with time period and field filters | - |
| **List** | Business object list | Object must allow dashboard listing (`Dashboard` configuration field) |

### Component Configuration

#### Pivot Component

- Displays pivot tables available to the user
- Respects user access rights

#### Chart Component

- Visual representation of pivot table data
- Multiple chart types available
- Interactive elements for data exploration

#### Widget Component

- Custom functionality via external objects
- Must be configured as dashboard-compatible widgets
- Supports custom interactions and behaviors

#### Filter Component

- Search bar with optional time period selection
- Can include additional field filters
- Triggers `ui.view.filters` event with filter data: `{ fromDate, toDate, fields... }`
- Filters are automatically applied to:
  - Lists
  - Charts
  - Pivot tables (with date/period or matching filtered fields)

#### List Component

- Business object lists dragged from menu
- Requires object to be configured for dashboard listing
- Respects object access rights and filters

### ADMIN Rights - Additional Components

Users with ADMIN rights have access to additional component types:

| Component | Description |
| ----------- | ------------- |
| **Empty item** | Field area containing options (text, login, date, predefined search, etc.) |
| **Preset search** | Pre-configured list with specific search criteria |
| **Advanced filter** | Enhanced filter configuration with custom handlers |

Configuration
-------------

### Sharing Configuration

Dashboards can be shared with groups that have the `DASHBOARD` right and an active `Dashboards sharing` type :

- **Share button**: Available in Dashboard Editor
- **Group selection**: Select from available dashboard sharing groups
- **Access control**: Shared groups can read (view) the dashboard

Behavior
--------

### Filter Propagation

When a Filter component is configured, it triggers filter events that propagate to other components:

1. **Event Trigger**: `ui.view.filters` event is triggered with filter data
2. **Automatic Application**: Filters are applied to compatible components (lists, charts, pivot tables)
3. **Custom Handlers**: External objects can implement custom filter handlers

### Custom Filter Handler Example

External objects can listen for filter events and apply them programmatically:

```javascript
$("#myWidget").addClass("js-view-filters").on("ui.view.filters", (e, filters) => {
    e.stopPropagation();
    // Apply the filters to widget components
    myobj.applyFilters(filters);
    // Redraw the widget
    myWidget.render();
});
```

### Front-end Helper

A helper function is available to apply view filters to business objects:

```javascript
obj.applyFilters(filters);
```

This applies the filter data (`{ fromDate, toDate, fields... }`) to the specified business object instance.

Related Objects
---------------

- **[External Objects](/make/userinterface/externalobjects/uicomponent)**: Used for custom widgets
- **[Pivot Tables](/make/userinterface/objectsrendering/pivot-table)**: Data source for pivot and chart components
- **[Groups](/make/usersrights/groups)**: Used for dashboard sharing

Learn More
----------

- [Widgets](/docs/misc/widgets) - Creating custom dashboard widgets
