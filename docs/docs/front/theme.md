---
sidebar_position: 10
title: Theme Editor
---

Theme Editor Overview
===================

:::warning
This documentation is part of the **Frontend Development** category, designed to guide you through frontend customization within Simplicité.
:::

The **Theme Editor** enables visual customization of your Simplicité instance for both designer and user interfaces.

![](img/theme/simplicite-mazette-form.png)

## Accessing the Theme Editor

1. Navigate to **User Interface > Themes**
2. Select a theme
3. Click the **Preview** button

![](img/theme/theme-editor-overview.png)

## Default Themes

Simplicité includes several predefined themes:

**ThemeAdmin**: Dark mode for administrators
<details>
<summary>Preview</summary>

![](img/theme/theme-admin-overview.png)
</details>

**ThemeDesign**: Light mode alternative
<details>
<summary>Preview</summary>

![](img/theme/theme-design-overview.png)
</details>

**ThemeEtat**: DSFR (French government) compliant
<details>
<summary>Preview</summary>

![](img/theme/theme-etat-overview.png)
</details>

## Creating a Theme

1. Click **Create** in **User Interface > Themes**
2. Select a base theme:
   - **Dark Base**: Minimal dark foundation
   - **Light Base**: Minimal light foundation
   - **Default Base**: Refined light foundation
3. Choose name and module

:::warning
Base themes are building blocks, not for direct use. Create custom themes extending them.
:::

## Theme Files

After creation, three files are generated:

1. **constants.less**: Theme Editor values as Less constants
2. **addons.less**: Custom style overrides
3. **themeName_gen.css**: Compiled final stylesheet

## Theme Editor Interface

![](img/theme/theme-editor-parts.png)

The editor has three sections:

1. **Interface Preview**: Live visualization
2. **Values Menu**: Style controls
3. **DOM Path**: Structural element view

### 1. Interface Preview

Navigate through tabs to preview different UI elements:

**Home**: Header and menu elements
<details>
<summary>Preview</summary>

![](img/theme/theme-editor-preview-home.png)
</details>

**Buttons**: All button types with customizable properties
<details>
<summary>Preview</summary>

![](img/theme/theme-editor-preview-buttons.png)
</details>

**Panels**: Structural elements (Panels, Sub-Panels, Tabs)
<details>
<summary>Preview</summary>

![](img/theme/theme-editor-preview-panels.png)
</details>

**Form**: Field types and inputs
<details>
<summary>Preview</summary>

![](img/theme/theme-editor-preview-form.png)
</details>

**List**: Table-format data display
<details>
<summary>Preview</summary>

![](img/theme/theme-editor-preview-list.png)
</details>

**Dialog**: Pop-up interfaces
<details>
<summary>Preview</summary>

![](img/theme/theme-editor-preview-dialog.png)
</details>

### 2. Style Values Menu

Organized by Preview tabs, the menu controls:

1. **Background**: Color and opacity
2. **Text**: Font size, color, weight
3. **Border**: Color, opacity, radius, width
4. **Hover**: Interactive element states

#### Base Settings

![](img/theme/theme-editor-style-base.png)

Controls fundamental styles: background color, fonts, spacing.

#### Main Elements

![](img/theme/theme-editor-style-main.png)

Configures header, footer, and navigation breadcrumb.

#### Menu

![](img/theme/theme-editor-style-menu.png)

Styles main menu, including active/inactive states.

#### Panel

![](img/theme/theme-editor-style-panel.png)

Top-level panel styles (container, header, footer).

#### Sub-panel

![](img/theme/theme-editor-style-subpanel.png)

Nested panel styles within main panels.

#### Tabs

![](img/theme/theme-editor-style-tabs.png)

Tab organization and navigation styles.

#### Field

![](img/theme/theme-editor-style-field.png)

Input field styles (labels, inputs, readonly, references).

#### List

![](img/theme/theme-editor-style-list.png)

Table component customization (headers, rows, filters).

#### Dialog

![](img/theme/theme-editor-style-dialog.png)

Modal dialog styles (container, header, footer).

### 3. DOM Path Viewer

Displays element structure for:
- Understanding layouts
- Defining custom styles
- Ensuring consistency

**Usage**: Hover over Preview elements to see their DOM path in Less format.

**Common paths**:
- Home: `div.main > div.simplicite.wrapper > ... > element.class`
- Form: `div.objform > div.card > ... > element.class`
- List: `div.objlist > div.card.panel-list > ... > element.class`