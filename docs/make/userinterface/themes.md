---
sidebar_position: 100
title: Themes
---

Themes
======

Introduction
------------

A Theme defines the visual styles of a Simplicité native interface — colors, typography, spacing, borders,
and interactive states. Themes are created and edited through the built-in **Theme Editor**, and can be extended
with a custom `addons.less` stylesheet for styles the editor doesn't expose.

A theme must be associated to a [scope](/make/userinterface/views/home-page#scopes) to take effect.

Configuration
-------------

| Field             | Description                                                                                                 |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| Name              | Unique name for the Theme, which helps in identifying it & hinting its usage/purpose.                       |
| Base theme        | The fallback tone/palette for the theme, between light/dark & default.                                      |
| Constants         | LESS variables that were set from the Theme-Editor.                                                         |
| Addon styles      | Custom file of your choice that is gonna be merged to "constants" to define the final theme.                |
| Compact           | Defines if by default the UI appears as compacted or not. Doesn't prevent the user from switching manually. |
| Logo scope        | Image file, it's the logo displayed in the "scope" dropdown menu in the header.                             |
| Favicon           | Image file, it's the one displayed as page's favicon.                                                       |
| Header logo       | Image file (**.svg** recommended), displayed in the header's left-side.                                     |
| Code editor theme | Theme to use for the code-editor (designer & embedded), ensure it's in the list below (*).                  |
| HTML editor theme | Theme to use for the Quill HTML editor (longstring typed fields with HTML rendering), "Snow" / "Bubble".    |
| Module Name       | Define the [module](/make/project/module) to which the theme belongs.                                       |

:::note[(*)]

**Light:**
chrome, clouds, crimson_editor, dawn, dreamwaver, eclipse, github, iplastic, katzenmilch,
kuroir, solarized_light, sqlserver, textmate, tomorrow, xcode.

**Dark:**
ambiance, chaos, clouds_midnight, cobalt, dracula,gob, gruvbox,idle_fingers, kr_theme, merbivore, merbivore_soft,
mono_industrial, monokai, pastel_on_dark, solarized_dark, terminal, tomorrow_night, tomorrow_night_blue,
tomorrow_night_bright, tomorrow_night_eighties, twilight, vibrant_ink.

:::

Theme Editor
------------

The Theme Editor is accessible from the theme's form via the **Preview** button.
It provides a live preview of the interface with three working areas:

| Section | Role |
| ------- | ---- |
| **Editing Area** | Live preview of the interface, organized by tabs (Home, Buttons, Panels, Form, List, Dialog). Click any customizable element to load its properties in the Theme Palette. Hover elements to reveal their DOM path in the Class Path |
| **Theme Palette** | Controls for the selected element — color pickers, sliders. Changes are reflected immediately in the Editing Area. Organized by style groups |
| **Class Path** | Displays the DOM path of the currently hovered element in Less format, useful for writing targeted overrides in `addons.less` |

### Style areas

The Theme Palette covers the following interface areas:

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

Extending with custom styles
----------------------------

For styles not covered by the Theme Editor, use the `addons.less` file attached to the theme.
This stylesheet is applied on top of the generated theme CSS and accepts standard Less or CSS syntax.

See [Complementary Styles](/docs/front/styles) for usage patterns and examples.

Applying a theme
----------------

Themes are applied at the view level. A theme can be assigned to any
[Home Page](/make/userinterface/views/home-page) view via the view's **Theme Name** field.

Related
-------

- [Home Pages](/make/userinterface/views/home-page)
- [Complementary Styles](/docs/front/styles)
- [Theme Editor](/docs/front/theme)
