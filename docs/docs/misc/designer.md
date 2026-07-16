---
sidebar_position: 30
title: A11y development
unlisted: true
slug: /unlisted/designer
---

Create conform applications with Simplicité
===========================================

:::warning

Digital accessibility is a continuous work in our R&D, yet not all of our features are conform to RGAA standards, but we're working on it continuously.

Please refer to [this document](/unlisted/criteria) to know more about our position on each criteria, and check the list of most impacted components.

:::

Introduction
------------

Simplicité allows the creation of business application which 100% conform to the RGAA standards, but yet this requires to stick to a certain set of features.

While some features are completely usable in such context, others require to stick to specific settings/usages,  
and others are just not RGAA-conformant for now.

A11y Flags
---------

Simplicité embedds 2 different flags related to web-accessibility and RGAA-compliance :

### User-level `a11y-mode`

### Designer `A11Y_MODE` sysparam

Guide per component
-------------------

### Links

### Lists

> TODO
> _Proper version incoming after looking up all "base" features & components_

**Raw hints** (while no proper guide is possible)

- Disable docked search
- Disable the list mosaic
- Disable preferences
- Disable some actions on list (create, edit)
- Disable bulk update

### Forms

> TODO
> _Proper version incoming after looking up all "base" features & components_

**Raw hints** (while no proper guide is possible)

- When creating a form, never split "label" and "input"
  - stick to the "label + input" rendering when setting this in the template-editor
- When using longstring fields, stick to regular rendering
- Disable form's search
- Instead of a date/time type, use a simple text with a date formating

### Business Process

> TODO
> _Proper version incoming after looking up all "base" features & components_

Features' Compliance
--------------------

:::warning

This part is based on Simplicité's [Feature Map](/docs/features), more precisely narrowed to the **Web App (use)** branch of features.  

:::

### Menu

> TODO
> _Proper version incoming after looking up all "base" features & components_

**Raw hints** (while no proper guide is possible)

- Set `left.collapse: "none"` in the sysparam `MENU_SETTINGS`
- If you have Business Objects with a status, make sure you disable both the metrics and trays.

### Main components & first-depth features

There are 3 possibilities for each feature's RGAA-compliance:

- **Compliant <rgaa-c>(C)</rgaa-c>**, the feature can be activated/used in any application and respect the WAI/ARIA norms as much as the RGAA tests.
- **Partially Compliant <rgaa-pc>(PC)</rgaa-pc>**, the feature can be activated/used but needs to follow some rules/restrictions in
  its settings/integration into the app in order to respect the WAI/ARIA norms and RGAA tests.
- **Non-compliant <rgaa-nc>(NC)</rgaa-nc>**, the feature cannot be activated in apps while respecting the WAI/ARIA norms and RGAA tests.

:::info

If one application's requirements regarding RGAA compliance are strict, it is highly recommended its designers to stick to "simpler" features  
that are enlisted below as **C**, or to make sure the **PC** features that are used do follow the mentionned requirements.

:::

#### Lists

- <rgaa-c>**Multi-column ordering** : C</rgaa-c>
- <rgaa-c>**Pagination** : C</rgaa-c>
- <rgaa-nc>**List Search (*)** : NC</rgaa-nc>
- <rgaa-nc>**List Preferences** : NC</rgaa-nc>
- **List Exports** : _to evaluate_
- <rgaa-nc>**Bulk Actions** : NC</rgaa-nc>
- <rgaa-c>**Group-by** : C</rgaa-c>
- <rgaa-nc>**Cards Mosaic** : NC</rgaa-nc>
- **Create on list** : _to evaluate_
- **Update on list** : _to evaluate_

#### Forms

- <rgaa-pc>**Fields (*)** : PC</rgaa-pc>
  - Most of regular typed fields and the shared structure of those we generate are compliant. But some specific types (ace, gridtext, quill, etc) aren't.
  - The addons available for regular typed fields (string, int, longstring, boolean, enum, etc) are all compliant.
- **Templates** : _to evaluate_
- **Permalinks** : _to evaluate_
- <rgaa-pc>**Child lists (*)** : PC</rgaa-pc>
- **Custom action with confirm fields** : _to evaluate_
- **Publications HTML to PDF** : _to evaluate_

#### Search

- **Global Search** : _to evaluate_
- **Object Search (*)** : _to evaluate_
- <rgaa-c>**Menu Search** : C</rgaa-c>
- <rgaa-nc>**Form Search** : NC</rgaa-nc>
- **Modeler Search** : _to evaluate_
- **User Filters** : _to evaluate_

#### Business Processes

<rgaa-pc>Partially Compliant</rgaa-pc>

- The specific actions and DOM elements for the business process are all implemented as RGAA-compliant.
- As a Businesses Process are just a specific usage of the **Form** and **List** components,
  as long as those use only _compliant_ features then the Process is compliant too.

#### Adaptable UI

- <rgaa-pc>**Themes** : PC</rgaa-pc>
- <rgaa-pc>**Internationalization** : PC</rgaa-pc>
- <rgaa-nc>**Compact mode** : NC</rgaa-nc>
- <rgaa-c>**Zoom** : C</rgaa-c>

### Embedded components & second-depth features (*)

#### List Search

- <rgaa-nc>**Search dialog** : NC</rgaa-nc>
- <rgaa-nc>**Predefined Search** : NC</rgaa-nc>
- <rgaa-nc>**Global Search** : NC</rgaa-nc>
- **Search Form** : _to evaluate_

#### Fields

- <rgaa-c>**Text fields** : C</rgaa-c>
- <rgaa-pc>**LongText fields** : PC</rgaa-pc>
  - This type of fields have many possible _renderings_, including some that are not compliant because of their advanced complexity ;  
    None / Expression / Fixed font / HTML / CSS / SQL / Markdown / JSON / Text editor / Grid / Count characters / Javascript
- <rgaa-c>**Number fields** : C</rgaa-c>
- <rgaa-nc>**Date/Time fields** : NC</rgaa-nc>
- <rgaa-c>**Enum fields** : C</rgaa-c>
- **File fields** : _to evaluate_
- <rgaa-nc>**Special fields** : NC</rgaa-nc>
  - Here are the fields' types that we include in this category : URL / Email / Phone / Color / Coordinates / Password / Notepad
  - In this list, only the types `URL`, `Email`, `Phone` and `Password` are RGAA-compliant.
- <rgaa-pc>**Image fields** : PC</rgaa-pc>
  - The component is conformant since alt is exposed and editable per image;
    real-world compliance still depends on end users providing accurate alt text
    (or explicitly marking decorative images),which falls outside what the platform can guarantee
    Complex images (charts, diagrams, infographics) can't be made compliant through alt text alone.  
  — make sure your application has no need for them, or plan a separate accessible alternative if it does.
- **Referenced Object** : _to evaluate_

#### Fields related features

- <rgaa-c>**Copy to clipboard** : C</rgaa-c>
- <rgaa-pc>**Simple help** : PC</rgaa-pc>
  - As the help content for a field is fully customizable, only the text-only content are compliant,
    if you insert code or HTML sections then you expose those to possible incohenrency with RGAA-criteria.
  - Both "label + input + help" and "label + input" displays have compliant helps.
- <rgaa-c>**List Filtering** : PC</rgaa-c>

#### Child Lists

- <rgaa-c>**Panel** : C</rgaa-c>
  - By nature Simplicité's panel & sub-panels are compliant
- **Virtual link** : _to evaluate_
- **Association** : _to evaluate_
- **Pillbox** : _to evaluate_
- **Inlined object** : _to evaluate_

#### Bulk Actions

- **Bulk Edit** : _to evaluate_
- **Bulk Delete** : _to evaluate_
- **Bulk Delete** : _to evaluate_
- **Merge** : _to evaluate_
- **Custom List Actions** : _to evaluate_

#### Object Search

- **Advanced query search** : _to evaluate_
- **Date/Period search** : _to evaluate_
- **Date/Period search** : _to evaluate_
- <rgaa-nc>**Geographical search** : NC</rgaa-nc>
- <rgaa-pc>**Predefined Search** : PC</rgaa-pc>
  - Predefined searches are basically lists available mostly from homepages, specific because they  
    use a predefined set of filters. But their behavior/features are the same as a regular list.
  - Thus they have to follow the rules & settings associated with their "" object.
- **Saved Search** : _to evaluate_

### Meta Model compliance

Below are detailed some of the features that aren't visual components, but that results in specific usages for components that are mentionned above.  
The aim is to tackle down few specific features that needs to pay more attention regarding the components they use (lists, forms, modals/dialogs).

- <rgaa-pc>**Links** : PC</rgaa-pc>
  - The feature itself is compliant, but the embedded lists have few flaws that prevent their usage in apps that should be compliant.
  - If you disable the filters in those lists, then it's RGAA-compliant.
  - If you enable them, then you're gonna have non-compliances on the filters (focus-restitution, dialog opening etc).
- <rgaa-c>**List of values : C</rgaa-c>
- <rgaa-pc>**Static text : PC</rgaa-pc>
  - If the content is purely textual then the usage of this component is RGAA-compliant
  - If you use it with custom HTML, you have to ensure by yourself that it follows WAI-ARIA rules
- <rgaa-pc>**Actions : PC</rgaa-pc>
  - If you want to customize your action (background, color, icon), you have to use contrasted enough colors.  
    For such thing you can refer to Simplicité's inner contrast tool, and ensure you stick to monochrome icons.

Keyboard accessibility
----------------------

### Access keys

#### Globals

- `TAB` focus the next element in the DOM order
- `SHIFT` + `TAB` focus the previous element in the DOM order
- `ESC` to close by priority:
  - focused field or rich editor
  - all modal dialogs
  - the current form
  - and go back in navigation when nothing is focused

- `ALT-H` : displays the **Home** page
- `ALT-M` : focus the main **Menu** last selection or first item
- `ALT-W` : **Wide** screen by toggling the menu
- `ALT-B` : opens the **Bookmarks** dialog
- `ALT-F` : focus the **Finder**, global search in header
- `ALT-L` : focus the first visible **List**
- `ALT-N` : focus the **Next** visible area/list (first `.js-focusable` of area)

#### Menu accessibility

- `ALT-M` : focus the main **Menu** last selection or first item
- `RIGHT` and `LEFT`: open/close a domain or a sub-menu
- `UP` and `DOWN`: previous/next menu item (same as `TAB` or `SHIFT` + `TAB`)
- `ENTER` : to execute/open the item, list or view, launch one business process...

#### Lists and forms

Horizontal navigation after a search:

- `SHIFT-LEFT` : goto previous record (on object form) or page (on object list)
- `SHIFT-RIGHT` : goto next record (on object form) or page (on object list)
- `CTRL-SHIFT-LEFT` : goto first record (on object form) or page (on object list)
- `CTRL-SHIFT-RIGHT` : goto last record (on object form) or page (on object list)

Vertical navigation in a page of list:

- `UP` / `DOWN` on list: focus table rows
  - header to focus columns and sort fields
  - search by column to change list filtering
  - records of current page
- `TAB` to visit focusable cells of rows: long text, markdown content, textarea... are focusable to be scrollable with arrow keys
- `ENTER` : to open the record (only if the form access is permitted for this line)

### Widgets

`select2`:

- extends the common `<select>` with icons and colored contents
- uses common `TAB` `ENTER` and `UP` `DOWN` to choose a value
- uses `DEL` to clean the value, also improved with `ENTER` on the remove icon

### Shortcuts

Shortcuts can define more access-keys.

Some designer access:

- `ALT-I` : XML import page
- `ALT-C` + `C` : clear all caches
- `ALT-X` : open the script/code editor

Useful Resources
----------------

- [Using ARIA](https://www.w3.org/TR/using-aria/)
- [ARIA in HTML](https://www.w3.org/TR/html-aria/)
- [APG Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
