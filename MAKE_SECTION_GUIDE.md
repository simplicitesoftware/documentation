# Guide: Converting Make Section to Reference Documentation

## Overview

The **Make** section should serve as **reference documentation** for configuration objects, not step-by-step tutorials. It should explain **what** each object is, **how it works**, and **how to configure it**, without walking through the UI step-by-step.

---

## Current Issues

Some files in the make section currently contain tutorial-style content:
- Step-by-step UI navigation ("Click Create", "Fill in fields", "Click Next")
- Screenshot-heavy walkthroughs
- Sequential instructions that assume a specific workflow

---

## Recommended Structure for Reference Documentation

### 1. **Introduction Section**
- What the object is
- When/why to use it
- Key concepts

### 2. **Features/Capabilities Section**
- What the object can do
- Key capabilities listed clearly

### 3. **Configuration Section**
- **Configuration Fields Table** - All configurable fields with descriptions
- **Field Properties** - What each field does, valid values, constraints
- **Configuration Options** - Available options, modes, types

### 4. **Usage/Behavior Section**
- How the object behaves once configured
- How it interacts with other objects
- Runtime behavior

### 5. **Related Objects Section**
- Links to related configuration objects
- Dependencies
- Objects that use or are used by this object

### 6. **Learn More Section**
- Links to related documentation
- Tutorial references (if applicable)
- Advanced topics

---

## Template for Reference Documentation

```markdown
---
sidebar_position: X
title: [Object Name]
---

[Object Name]
=============

Introduction
------------

[2-3 paragraphs explaining what the object is, its purpose, and when to use it]

Key Concepts
------------

- **Concept 1**: Brief explanation
- **Concept 2**: Brief explanation
- **Concept 3**: Brief explanation

Features
--------

1. **Feature Name**
   - Description of what this feature does
   - Use cases

2. **Feature Name**
   - Description
   - Use cases

Configuration
-------------

### Configuration Fields

| Field | Type | Required | Description | Default Value |
|-------|------|----------|-------------|---------------|
| Field Name | Type | Yes/No | What this field does | Default |

### Field Details

#### Field Name

- **Purpose**: What this field controls
- **Valid Values**: List of valid options
- **Constraints**: Any limitations or requirements
- **Example**: Example value

### Configuration Options

#### Option Type 1

| Option | Description | Use Case |
|--------|-------------|----------|
| Value 1 | What it does | When to use it |
| Value 2 | What it does | When to use it |

Behavior
--------

[Explain how the object behaves once configured]
- How it appears in the UI
- How users interact with it
- How it processes data
- Any automatic behaviors

Related Objects
---------------

- **[Related Object 1](/make/path/to/object)**: How they relate
- **[Related Object 2](/make/path/to/object)**: How they relate

Learn More
----------

- [Related Tutorial](/tutorial/path) - Step-by-step guide
- [Advanced Topic](/docs/path) - Deep dive
- [API Reference](/docs/api/path) - Technical details
```

---

## Conversion Examples

### ❌ Tutorial Style (Current - Dashboard.md)

```markdown
How to create a Dashboard?
--------------------------

To create a dashboard, follow the steps below:

1. If you have DASHBOARD_MAKER rights and not have ADMIN rights (like designer), 
   a dashboard icon will appear in the page header.
   It allows you to create your dashboard. Click on create.
   ![](img/dashboard/dashboard1.png)
2. Give a label. The dashboard editor is open.
   ![](img/dashboard/dashboard2.png)
   You have different choices :
   - Pivot : this will give you access to all the pivot tables available to you
    ![](img/dashboard/dashboard3.png)
   ...
```

### ✅ Reference Style (Recommended)

```markdown
Creating Dashboards
-------------------

Dashboards are created through the **Dashboard Editor**, accessible via the dashboard icon 
in the page header (requires `DASHBOARD_MAKER` rights).

### Dashboard Components

A dashboard can contain the following component types:

| Component Type | Description | Use Case |
|----------------|-------------|----------|
| **Pivot** | Pivot table visualization | Data analysis and cross-tabulation |
| **Chart** | Chart visualization of pivot data | Visual data representation |
| **Widget** | Custom external object widgets | Custom functionality |
| **Filter** | Search bar with optional time period and fields | Filtering dashboard data |
| **List** | Business object list (if enabled) | Displaying object records |

### Dashboard Configuration

| Field | Description | Required |
|-------|-------------|----------|
| **Label** | Dashboard display name | Yes |
| **Sharing Groups** | Groups with DASHBOARD right that can access this dashboard | No |

### Dashboard Editor Features

- **Preview**: Preview dashboard before saving
- **Auto-arrange**: Automatically arrange components
- **Save**: Save dashboard configuration
- **Share**: Share dashboard with groups (requires DASHBOARD_MAKER rights)

### Special Features for ADMIN Rights

Users with ADMIN rights have access to additional options:
- Empty items (field areas with options)
- Preset searches
- Advanced filter configuration
```

---

## Key Principles

### 1. **Remove Step-by-Step UI Navigation**
- ❌ "Click Create in Business objects > Business objects"
- ✅ "Create a Business object via Business objects > Business objects"

### 2. **Focus on Configuration, Not Process**
- ❌ "1. Fill in the Object information, 2. Click Next, 3. Fill in Translation..."
- ✅ "Configure the Object information fields, then set Translations..."

### 3. **Use Tables for Configuration Options**
Instead of listing options in paragraphs, use tables:

```markdown
### Action Types

| Type | Execution Location | Use Case |
|------|-------------------|----------|
| Front-end | Browser | Client-side interactions |
| Back-end | Server | Server-side processing |
| None | N/A | Button display only |
```

### 4. **Explain "What" and "Why", Not "How to Click"**
- ❌ "Click on the Create button"
- ✅ "Create a new [object] using the Create action"

### 5. **Reference Tutorials Instead of Including Steps**
- ❌ Include full step-by-step instructions
- ✅ Link to tutorial: "For a step-by-step guide, see [Creating a Module Tutorial](/tutorial/getting-started/module)"

### 6. **Use Configuration Tables**
Always include a comprehensive configuration fields table:

```markdown
Configuration Fields
--------------------

| Field | Type | Required | Description | Default |
|-------|------|----------|-------------|---------|
| Code | String | Yes | Unique identifier | - |
| Table | String | Yes | Database table name | - |
| Module | Module | Yes | Parent module | - |
```

---

## Specific Conversion Guidelines

### For "How to Create" Sections

**Before:**
```markdown
How to create a Business object?
--------------------------------

1. Access the list of Business objects
2. Click Creation assistant
3. Fill in the Object information
4. Click Next
...
```

**After:**
```markdown
Creating Business Objects
-------------------------

Business objects are created using the **Creation Assistant**, which can be accessed via:

- **Business objects > Business objects > Creation assistant**
- **Modeler**: Right-click on a model > Add > Create Business object

The creation assistant guides you through:
1. Object information (Code, Table, Module, Prefix)
2. Translations (display labels)
3. Function grants (access rights for groups)
4. Domain assignment (menu placement)

:::tip[Quick Start]
For a step-by-step walkthrough, see the [Creating a Business Object Tutorial](/tutorial/getting-started/object).
:::
```

### For Configuration Sections

**Before:**
```markdown
Configuration
-------------

| Field | Description |
| ----- | ----------- |
| Code | Object's unique identifier |
| Table | Table name |
```

**After:**
```markdown
Configuration Fields
--------------------

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| **Code** | String | Yes | Unique identifier for the object | Must be unique, alphanumeric |
| **Table** | String | Yes | Database table name or `service`/`select` for special objects | Must be valid table name |
| **Extend of Logical name** | Object | No | Parent object for inheritance | Must reference existing object |
| **Icon code** | String | No | Icon identifier for UI display | Valid icon code |

### Field Details

#### Code
- **Purpose**: Logical identifier used in code and configuration
- **Format**: Alphanumeric, typically PascalCase (e.g., `TrnProduct`)
- **Uniqueness**: Must be unique across all business objects

#### Table
- **Purpose**: Physical database table name or special type indicator
- **Values**:
  - Standard: Database table name (e.g., `trn_product`)
  - `service`: For [Service objects](/docs/core/objects/service-objects)
  - `select`: For [Select objects](/docs/core/objects/select-objects)
```

### For Action/Behavior Sections

**Before:**
```markdown
Module actions
--------------

| Action name | Description |
| -----------| ----------- |
| Import module | Import module stored in the File field |
```

**After:**
```markdown
Available Actions
-----------------

Business objects support the following actions:

| Action | Description | Requirements |
|--------|-------------|--------------|
| **Import module** | Import a module from the File field or Settings field | Module file or URL configured |
| **Documentation** | Generate PDF documentation for the module | - |
| **Git repository** | Open GIT view for version control | Git repository configured |
| **Export data** | Generate dataset export | - |
| **Export to XML** | Generate Module XML file | - |
| **Export to JSON** | Generate Module JSON file | - |

### Action Behavior

- **Import module**: Validates and imports configuration from file or URL
- **Documentation**: Generates comprehensive PDF with all configuration objects
- **Export actions**: Create portable module files for deployment or backup
```

---

## Checklist for Reference Documentation

- [ ] Introduction explains what the object is and when to use it
- [ ] Features/capabilities are clearly listed
- [ ] Configuration fields are in a comprehensive table
- [ ] Field details explain purpose, valid values, and constraints
- [ ] Behavior is explained (how it works, not how to click)
- [ ] Related objects are linked
- [ ] Tutorial links are provided for step-by-step guides
- [ ] No step-by-step UI navigation ("Click here, then click there")
- [ ] Screenshots are used for reference, not for navigation
- [ ] Tables are used for options, types, and configuration

---

## Files That Need Conversion

Based on the analysis, these files contain tutorial-style content:

1. **dashboard.md** - Has step-by-step creation instructions
2. **shared-code.md** - Has "How to create" section with steps
3. **themes.md** - Has step-by-step creation and usage instructions
4. **module.md** - Has step-by-step creation instructions
5. **business-objects.md** - Has "How to create" with step-by-step instructions

---

## Quick Reference: Tutorial vs Reference

| Aspect | Tutorial Style | Reference Style |
|--------|---------------|-----------------|
| **Purpose** | Teach how to do something | Explain what something is and how to configure it |
| **Structure** | Sequential steps | Organized by topic |
| **Language** | "Click here, then do that" | "Configure this field to set that behavior" |
| **Screenshots** | Navigation guide | Visual reference |
| **Examples** | Step-by-step walkthrough | Configuration examples |
| **Links** | None needed | Links to tutorials for step-by-step |

---

## Example: Complete Conversion

See the attached example files for complete before/after conversions of specific documentation pages.
