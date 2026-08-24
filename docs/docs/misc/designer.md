---
sidebar_position: 30
title: A11y development
unlisted: true
slug: /unlisted/designer
---

Create conform applications with Simplicité
===========================================

Introduction
------------

Simplicité can be used to build business applications that fully conform to the RGAA, but this
requires sticking to a defined set of features and settings. Some features are usable as is, some
require specific settings, and some cannot be used at all in a strictly compliant application.

This document tells you which is which, and what to do about it. It is written for **designers**
building an application under strict compliance requirements.

:::warning

Digital accessibility is a continuous effort in our R&D: not every feature conforms to the RGAA yet.
Our position on each of the 106 criteria is documented in [the compliance document](/unlisted/compliance).

:::

### How to use this document

1. Read **[Cross-cutting concerns](#cross-cutting-concerns)** first. These rules apply everywhere and
   constrain everything the component guides describe.
2. Set the `A11Y_DEV` system parameter to `yes` for the whole design phase. Every field then carries a
   compliance icon in the field form, so you get the verdict where you work rather than here.
3. Open the relevant **[component guide](#component-guides)** when you configure a business object, a
   list, a form or a menu. Each one lists the settings to apply and the features to avoid.
4. Check your work with `a11y-mode` enabled — but read [what it does not do](#the-limits-of-these-features)
   before relying on it.

Platform features
-----------------

Simplicité ships three accessibility features. Two act at runtime for end users, one assists you at
design time.

### Runtime `a11y-mode`

End users toggle **Accessibility Mode** from the `.btn-a11y-mode` button in the application header.

![Toggle accessibility mode - disabled](img/a11y/toggle-off.png)
![Toggle accessibility mode - enabled](img/a11y/toggle-on.png)

It disables or adapts interface behaviors and optional features that can block or hinder users relying
on assistive technologies. It is absolute: when on, it applies to every affected feature at once.

Handled features:

- Form and list floating/sticky headers
- Customized colors for action and state buttons
- Splittable work areas
- Compact mode
- Collapse menu toggle
- Masonry layout for lists
- Menu trays and metrics from Status Objects
- Preset search from the search dialog
- Top menu
- Datetime pickers, replaced by a plain input with a format hint
- Ace editor inputs, replaced by plain textareas

### User `A11Y_OVERRIDE` parameter

Where `a11y-mode` is all-or-nothing, `A11Y_OVERRIDE` is a per-user parameter: each user records their
own preferences, component by component, according to their needs and habits.

It covers components that could not be made compliant because of their complexity or their third-party
dependencies:

| Component | Why |
| --- | --- |
| Date pickers | `flatpickr` is not compliant |
| HTML editor | `quill` is not compliant |
| Code editors | `ace` is not compliant |
| Trays | Drag-and-drop only |
| Top menu | Chained popups break keyboard navigation and screen reader output |
| Custom colors | Safety net for action and enum contrast |
| User guides | Popup-driven flows break keyboard navigation and screen reader output |

![A11Y_OVERRIDE user parameter](img/a11y/user.png)

### Designer `A11Y_DEV` sysparam

Set the `A11Y_DEV` system parameter to `yes` to turn on the development helper.

![A11Y_DEV system parameter](img/a11y/dev.png)

Every field then carries a `universal-access-circle` icon next to its label in the field form, reporting
the compliance of the underlying feature, along with the settings required to keep it compliant.

![A11Y_DEV icons meaning](img/a11y/icons.png)

Keep it on for the whole design phase: it gives you the verdict at the moment you make the choice,
which is cheaper than auditing afterwards.

### Compliance statuses

The same vocabulary is used by the `A11Y_DEV` icons, by the `fld_compliance` field and by every table
in this document.

| Status | Icon color | Meaning |
| --- | --- | --- |
| **Compliant** <rgaa-c>(C)</rgaa-c> | success | Use freely. The feature meets the RGAA tests and WAI-ARIA rules. |
| **Partially Compliant** <rgaa-pc>(PC)</rgaa-pc> | warning | Usable, but only with the settings listed in this document and in `fld_compliancehint`. |
| **Non-Compliant** <rgaa-nc>(NC)</rgaa-nc> | danger | Do not use under strict compliance requirements. |
| **Not Applicable** | none | The feature has no bearing on RGAA compliance. |
| **Not Evaluated** | text | Not assessed yet. Avoid under strict requirements. |

Features that have not been evaluated are not listed in this document. Their absence from a table is
not a verdict.

### The limits of these features

`a11y-mode` and `A11Y_OVERRIDE` are safety nets, not fixes. They neutralize behaviors that get in the
way; they do not make a **Non-Compliant** feature compliant.

Two consequences. First, you must still disable the features listed as NC below, whether or not the
mode is on. Second, do not rely on the mode during design: disable those features properly in your
configuration, and use the mode only to verify the result.

Cross-cutting concerns
----------------------

These rules apply across the whole application, independently of any component.

### Themes and contrast

Colors are fully variabilized, which means a custom theme can break contrast compliance everywhere at
once. Two options:

- Use the **HighContrast** theme, shipped with the platform in light and dark variants. It guarantees
  contrast and focus visibility with no further work.
- Build your own theme, and validate every color with the built-in contrast checker, available at each
  customization point.

<!-- TODO: mini-guide — creating a theme and associating it with the right scope -->

The `USE_COMPACT` system parameter must be set to `no`: compact mode is <rgaa-nc>NC</rgaa-nc>.

### Custom HTML

Several extension points let you inject markup the platform does not control: static texts, field help
content, publication templates, JavaScript addons and external objects. Plain text is always safe. As
soon as you write HTML, its compliance is entirely yours — see the [resources](#resources) for the
WAI-ARIA rules to follow.

External objects are the extreme case: their markup is written in free code and cannot be checked at
all by the platform.

### Complex images

Charts, diagrams and infographics cannot be made compliant through alternative text alone. Either make
sure your application does not need them, or plan an accessible alternative — a data table, a textual
summary — alongside the image.

For regular images, the `alt` attribute is exposed and editable per image. Real-world compliance then
depends on end users writing accurate alternatives, or explicitly marking images as decorative, which
falls outside what the platform can guarantee. Say so in your application's own user documentation.

### Internationalization

<rgaa-pc>Partially Compliant</rgaa-pc>. Translated content is your responsibility: a label left
untranslated produces a language change the platform cannot declare in the markup.

Component guides
----------------

### Business Objects

Settings that apply to the object as a whole, whatever its views.

| Feature | Status | Context | Setting | Notes |
| --- | --- | --- | --- | --- |
| Visible identifier field | — | Field | `obf_order` | Put the visible identifier field first in the order |
| Bookmarks | <rgaa-nc>NC</rgaa-nc> | Business Object | `obo_btn_bookmark = no` | |
| Historics | <rgaa-nc>NC</rgaa-nc> | Business Object | `obo_historic = no` | |
| Prints | <rgaa-nc>NC</rgaa-nc> | Business Object | `obo_printable = no` | |
| Social posts | <rgaa-nc>NC</rgaa-nc> | Business Object | `obo_social = no` | |
| Constraints | <rgaa-pc>PC</rgaa-pc> | Business Object | — | |
| Contextual help | <rgaa-c>C</rgaa-c> | Business Object | — | |
| Copy | <rgaa-c>C</rgaa-c> | Business Object | — | `obo_copy` |
| Export | <rgaa-c>C</rgaa-c> | Business Object | — | `obo_export` |

Alternative views are all <rgaa-nc>Non-Compliant</rgaa-nc> and must not be enabled: pivot tables,
agendas, place maps, time sheets and tree views.

<!-- TODO: In practice — screenshots of the object settings, OK/NOK -->

### Lists

Set in the **List** section of the business object settings.

| Feature | Status | Context | Setting | Notes |
| --- | --- | --- | --- | --- |
| Multi-column ordering | <rgaa-c>C</rgaa-c> | — | — | |
| Pagination | <rgaa-c>C</rgaa-c> | — | — | |
| Group-by | <rgaa-c>C</rgaa-c> | — | — | |
| List preferences | <rgaa-c>C</rgaa-c> | — | — | |
| List of values | <rgaa-c>C</rgaa-c> | — | — | |
| List filtering | <rgaa-c>C</rgaa-c> | — | — | |
| Docked search | <rgaa-nc>NC</rgaa-nc> | Business Object | `obo_search_docked = no` | |
| Cards mosaic | <rgaa-nc>NC</rgaa-nc> | Business Object | `obo_minifiable = no` | |
| Create on list | <rgaa-pc>PC</rgaa-pc> | Business Object | `obo_list_edit`, `obo_btn_listedit` | |
| Update on list | <rgaa-nc>NC</rgaa-nc> | Business Object | `obo_list_edit = no` | |
| Bulk edit | <rgaa-nc>NC</rgaa-nc> | Business Object | `obo_btn_updall = no`, `obo_list_edit = no` | |
| Bulk delete | <rgaa-c>C</rgaa-c> | — | — | |
| Custom list actions | <rgaa-pc>PC</rgaa-pc> | Action | — | See [Actions](#actions) |
| List search | <rgaa-pc>PC</rgaa-pc> | — | — | See [Search](#search) |

<!-- TODO: In practice — screenshots of the List section, OK/NOK -->

### Forms

Set in the **Form** section of the business object settings. The layout itself is defined in the
**Template Editor**, reachable from that same section.

| Feature | Status | Context | Setting | Notes |
| --- | --- | --- | --- | --- |
| Field areas | <rgaa-c>C</rgaa-c> | Template Editor | — | |
| Columns | <rgaa-c>C</rgaa-c> | Template Editor | — | |
| Tabs | <rgaa-c>C</rgaa-c> | Template Editor | — | |
| Label and input layout | <rgaa-pc>PC</rgaa-pc> | Template Editor | "label + input" display | Never split a label from its input |
| Custom action with confirm fields | <rgaa-c>C</rgaa-c> | Action | — | |
| Fields | <rgaa-pc>PC</rgaa-pc> | Field | `fld_rendering` | See [Fields](#fields) |
| Child lists | <rgaa-pc>PC</rgaa-pc> | Link | — | See below |

#### Child lists

| Feature | Status | Context | Setting | Notes |
| --- | --- | --- | --- | --- |
| Panel | <rgaa-c>C</rgaa-c> | Link | — | Panels and sub-panels are compliant by design |
| Virtual link | <rgaa-c>C</rgaa-c> | Link | — | Rendered as an embedded list — follow the [Lists](#lists) rules |
| Inlined object | <rgaa-c>C</rgaa-c> | Link | — | Rendered as form elements — follow the Forms rules |
| Pillbox | <rgaa-nc>NC</rgaa-nc> | Link | — | |

<!-- TODO: In practice — screenshots of the Template Editor, OK/NOK -->

### Fields

The shared structure the platform generates around fields is compliant. Compliance depends on the
type and, above all, on the **rendering** you pick — the `fld_rendering` field, labelled _Display_ in
the field form.

| Type | Status | Context | Setting | Notes |
| --- | --- | --- | --- | --- |
| Text | <rgaa-pc>PC</rgaa-pc> | Field | `fld_rendering` | QRCode and Icon picker renderings are NC |
| Validated text | <rgaa-nc>NC</rgaa-nc> | Field | — | Validation is not announced and no suggestion is offered |
| Boolean | <rgaa-c>C</rgaa-c> | Field | — | Every rendering is compliant |
| Long text | <rgaa-pc>PC</rgaa-pc> | Field | `fld_rendering` | Stick to the regular rendering. Expression, Fixed font, HTML, CSS, SQL, Markdown, JSON, Text editor, Grid, Count characters and Javascript are NC |
| Number | <rgaa-pc>PC</rgaa-pc> | Field | `fld_rendering` | Progress bars, Stars and With calculator are NC |
| Date / Time | <rgaa-pc>PC</rgaa-pc> | Field | — | Use a plain text field with a date format instead. `a11y-mode` replaces the picker with a plain input and a format hint |
| Enum | <rgaa-c>C</rgaa-c> | Field | — | |
| File | <rgaa-c>C</rgaa-c> | Field | — | |
| Image | <rgaa-pc>PC</rgaa-pc> | Field | — | `alt` is exposed per image. See [Complex images](#complex-images) |
| Referenced object | <rgaa-c>C</rgaa-c> | Field | — | |
| Special | <rgaa-nc>NC</rgaa-nc> | Field | — | Only URL, Email, Phone and Password are compliant. Color, Coordinates and Notepad are NC |

All addons available on regular typed fields — string, int, longstring, boolean, enum — are compliant.

#### Field-related features

| Feature | Status | Context | Setting | Notes |
| --- | --- | --- | --- | --- |
| Copy to clipboard | <rgaa-c>C</rgaa-c> | Field | — | |
| Simple help | <rgaa-pc>PC</rgaa-pc> | Field | — | Text-only content is compliant. See [Custom HTML](#custom-html) |

Both the "label + input + help" and "label + input" displays render help compliantly.

<!-- TODO: In practice — screenshots of the field form, rendering choices OK/NOK -->

### Search

| Feature | Status | Context | Setting | Notes |
| --- | --- | --- | --- | --- |
| Search dialog | <rgaa-c>C</rgaa-c> | — | — | |
| Sort order | <rgaa-c>C</rgaa-c> | — | — | |
| Global search | <rgaa-c>C</rgaa-c> | — | — | |
| Menu search | <rgaa-c>C</rgaa-c> | — | — | |
| Search form | <rgaa-pc>PC</rgaa-pc> | Business Object | `obo_tpl_search_pos = top` | Only the top position is compliant, and only with `a11y-mode` |
| Preset search | <rgaa-nc>NC</rgaa-nc> | — | — | From the search dialog |
| Predefined search | <rgaa-pc>PC</rgaa-pc> | — | — | Rendered as a list — follow the [Lists](#lists) rules for the underlying object |
| Form search | <rgaa-nc>NC</rgaa-nc> | — | — | |
| Date / Period search | <rgaa-nc>NC</rgaa-nc> | — | — | Uses datetime fields, which behave differently in search than in a form |
| Geographical search | <rgaa-nc>NC</rgaa-nc> | — | — | |

<!-- TODO: In practice — screenshots of the search dialog and search form positions -->

### Actions

| Feature | Status | Context | Setting | Notes |
| --- | --- | --- | --- | --- |
| Action icon | <rgaa-pc>PC</rgaa-pc> | Action | `act_image` | Prefer no icon. If you set one, use a monochrome icon |
| Action colors | <rgaa-pc>PC</rgaa-pc> | Action | `act_color_bg`, `act_color` | Check both against each other and against the header background |

Use the built-in contrast checker rather than eyeballing it: an action placed in the header must
contrast with the header background, not only with its own label.

<!-- TODO: In practice — screenshots of a compliant and a non-compliant action -->

### Menu

| Feature | Status | Context | Setting | Notes |
| --- | --- | --- | --- | --- |
| Left menu | <rgaa-c>C</rgaa-c> | System parameter | `MENU_SETTINGS` — `left.collapse: "none"` | |
| Top menu | <rgaa-nc>NC</rgaa-nc> | System parameter | `MENU_SETTINGS` — `top.active = false` | Chained popups break keyboard navigation |
| Trays | <rgaa-nc>NC</rgaa-nc> | Business Object | `obo_tray = no` | Drag-and-drop only. Applies to every object with a status |
| Metrics | <rgaa-nc>NC</rgaa-nc> | Business Object | `obo_dashboard = none` | Applies to every object with a status |

`a11y-mode` forces the left-only menu at runtime, but disable the top menu properly in your
configuration rather than relying on it.

<!-- TODO: In practice — screenshots of MENU_SETTINGS, OK/NOK -->

### Business Process

<rgaa-pc>Partially Compliant</rgaa-pc>. The actions and DOM elements specific to business processes
are compliant. A process being a particular use of the Form and List components, it is compliant as
long as those only use compliant features.

| Feature | Status | Context | Setting | Notes |
| --- | --- | --- | --- | --- |
| Road rendering | <rgaa-pc>PC</rgaa-pc> | Business Process | `pcs_road_render = VM` or `HM` | Only the minimal versions — vertical or horizontal — are compliant |

<!-- TODO: In practice — screenshots of the four road renderings -->

### Links

<rgaa-pc>Partially Compliant</rgaa-pc>. The feature itself is compliant, but the lists it embeds carry
flaws that rule them out of a compliant application.

| Feature | Status | Context | Setting | Notes |
| --- | --- | --- | --- | --- |
| Embedded list filters | <rgaa-nc>NC</rgaa-nc> | Link | — | Focus is not restored after the filter dialog closes. Disable the filters and the link becomes compliant |

### Static texts

<rgaa-pc>Partially Compliant</rgaa-pc>. Plain textual content is compliant. HTML content is your
responsibility — see [Custom HTML](#custom-html).

### Domains

<!-- TODO: raw hints and settings -->

### Widgets

<!-- TODO: quick explanation on ExternalObject usage & exception for those -->

#### Counters

<rgaa-nc>Not Compliant</rgaa-nc>
<!-- TODO: hints and settings -->

#### Carousel

<rgaa-nc>Not Compliant</rgaa-nc>
<!-- TODO: hints and settings -->

#### Cards

<rgaa-nc>Not Compliant</rgaa-nc>
<!-- TODO: hints and settings -->

Appendix: keyboard accessibility
--------------------------------

This reference is worth copying into your own application's user documentation: end users have no
other way of discovering these shortcuts.

### Global

| Keys | Action |
| --- | --- |
| `TAB` | Focus the next element in DOM order |
| `SHIFT` + `TAB` | Focus the previous element in DOM order |
| `ESC` | Close, by priority: the focused field or rich editor, then all modal dialogs, then the current form. Navigates back when nothing is focused |
| `ALT` + `H` | Display the **Home** page |
| `ALT` + `M` | Focus the main **Menu**, on the last selection or the first item |
| `ALT` + `W` | **Wide** screen, toggling the menu |
| `ALT` + `B` | Open the **Bookmarks** dialog |
| `ALT` + `F` | Focus the **Finder**, the global search in the header |
| `ALT` + `L` | Focus the first visible **List** |
| `ALT` + `N` | Focus the **Next** visible area or list, on the first `.js-focusable` element |

### Menu

| Keys | Action |
| --- | --- |
| `ALT` + `M` | Focus the main menu, on the last selection or the first item |
| `RIGHT` / `LEFT` | Open / close a domain or a sub-menu |
| `UP` / `DOWN` | Previous / next menu item |
| `ENTER` | Open the item, list or view, or launch a business process |

### Lists and forms

Horizontal navigation, after a search:

| Keys | Action |
| --- | --- |
| `SHIFT` + `LEFT` | Previous record on a form, previous page on a list |
| `SHIFT` + `RIGHT` | Next record on a form, next page on a list |
| `CTRL` + `SHIFT` + `LEFT` | First record on a form, first page on a list |
| `CTRL` + `SHIFT` + `RIGHT` | Last record on a form, last page on a list |

Vertical navigation within a page of a list:

| Keys | Action |
| --- | --- |
| `UP` / `DOWN` | Move across table rows: header row to focus columns and sort fields, search row to filter, then the records of the current page |
| `TAB` | Visit the focusable cells of a row. Long texts, markdown content and textareas are focusable so they can be scrolled with the arrow keys |
| `ENTER` | Open the record, when form access is granted for that row |

### Designer shortcuts

Shortcuts can define further access keys.

| Keys | Action |
| --- | --- |
| `ALT` + `I` | XML import page |
| `ALT` + `C`, then `C` | Clear all caches |
| `ALT` + `X` | Open the script / code editor |

Resources
---------

- [Our position on the RGAA criteria](/unlisted/compliance) — the platform's verdict on each of the
  106 criteria, and what is expected of you as a designer.
- [Using ARIA](https://www.w3.org/TR/using-aria/)
- [ARIA in HTML](https://www.w3.org/TR/html-aria/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/)
