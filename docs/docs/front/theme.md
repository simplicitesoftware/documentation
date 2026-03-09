---
sidebar_position: 10
title: Theme Editor
---

Theme Editor
============

Introduction
------------

The Theme Editor is the built-in tool for customizing the visual appearance of a Simplicité instance.
It controls colors, typography, spacing, borders, and interactive states across all interface elements.
Changes made in the editor are compiled into a CSS stylesheet applied to the entire interface.

Theme files
-----------

Each theme is backed by three files:

| File | Role |
| ---- | ---- |
| `constants.less` | Theme variables as Less constants — values set in the editor are written here |
| `addons.less` | Custom style overrides — edit this file to extend beyond what the editor exposes |
| `theme_gen.css` | Compiled final stylesheet — do not edit directly |

To customize beyond what the Theme Editor exposes, use `addons.less`.
See [Complementary Styles](/docs/front/styles) for details.

Creating a theme
----------------

1. Navigate to **User Interface > Themes** and click **Create**
2. Select a base theme: **Dark**, **Light**, or **Default**
3. Set a name and assign to a module

:::warning

Base themes are building blocks, not intended for direct use. Always create a custom theme that extends one of them.

:::

Using the Theme Editor
----------------------

1. Navigate to **User Interface > Themes**
2. Open a theme and click **Preview**

The editor has three sections:

| Section | Role |
| ------- | ---- |
| **Interface Preview** | Live visualization. Navigate tabs (Home, Buttons, Panels, Form, List, Dialog) to preview different elements |
| **Values Menu** | Style controls organized by interface area. Adjust background, text, border, and hover states per element |
| **DOM Path Viewer** | Displays the DOM path of the element hovered in the Preview, in Less format — useful for targeting elements in `addons.less` |

### Style areas

The Values Menu covers the following interface areas:

| Area | Controls |
| ---- | -------- |
| Base | Background color, fonts, spacing fundamentals |
| Main | Header, footer, navigation breadcrumb |
| Menu | Main navigation menu, active/inactive states |
| Panel | Top-level panel container, header, footer |
| Sub-panel | Nested panels within main panels |
| Tabs | Tab navigation and active states |
| Field | Input labels, inputs, readonly states, foreign key references |
| List | Table headers, rows, filter bar |
| Dialog | Modal container, header, footer |

Applying a theme
----------------

Themes are applied at the view level:

1. Navigate to **User Interface > Views > Home Pages**
2. Open the target view
3. Set your custom theme in the view configuration
4. Clear the cache to apply changes

Related
-------

- [Complementary Styles](/docs/front/styles) — extending themes via `addons.less`
- [Themes configuration](/make/userinterface/themes)
