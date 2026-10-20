---
sidebar_position: 30
title: Compliance (english)
unlisted: true
---

Criteria details
================

:::warning

**[Version française](/docs/accessibility/compliance)**

This document relates exclusively to version 7.0 of the platform. It does not describe version 6.3.

This is the English translation of a document originally written in **French**, for consistency with the language of the RGAA.
In case of discrepancy, the French version prevails. RGAA criterion titles are translated here for convenience; the official wording is the French one.

This document is a work in progress. As our work on digital accessibility is still
ongoing, this document is subject to change before the release of the "final" version 7.0.

Some of the criteria fall partly (or entirely) under the designer's responsibility; these design
and configuration elements are detailed in a separate document (soon to be finalized).

:::

Nature and scope of this document
---------------------------------

### What this document is

This document sets out **Simplicité Software's position** on the 106 criteria of
[RGAA 4.1.2](https://accessibilite.numerique.gouv.fr/), as applied to the **platform core** in version 7. It is not an audit.

> **Last assessment**: `10/2026` - platform version `7-beta`

### Assessed scope

The positions cover all of the platform's native building blocks:

- authentication pages (login, register, forgot password)
- cross-cutting structural elements (header, footer, and their components)
- menus, navigation bars, sitemap
- the platform's main interface components (lists, forms, business processes)
  - their "sub-components" (action bars, filters, searches, decision modals)
  - native features and some configurable features (which can be disabled when non-compliant)
  - elements common to any business application (toasts, dropdowns, badges, widgets)

### What this document does not cover

The **compliance rate** in the sense of the accessibility statement can only be established application by
application, on a representative sample of pages, and is the responsibility of the organization operating the application.

This document provides a working basis for that exercise; it does not replace it.

Also not covered are content and developments added by designers or end users:
external objects, custom components, bespoke themes, business images and documents.

These cases are identified criterion by criterion in the **Scope** column, and detailed in the section
[Exceptions and out-of-context components](#exceptions-and-out-of-context-components).

Understanding the Simplicité context
------------------------------------

> /!\ This section is intended in particular for external auditors. /!\

The platform's technical context differs significantly from that of a traditional website, the RGAA's main target,
and this difference shapes how several criteria should be read.

### An application-generation platform

The platform lets "designer" users build business applications; interfaces are therefore not
entirely hand-written as they would be for a traditional website.

The main consequence is how responsibility for accessibility is distributed.

Designers are responsible, first, for ensuring that the elements they configure follow
the accessibility guidelines we publish (documentation coming soon),
and second, for configuring those elements correctly (naming, positioning, translations, etc.).

A number of elements also depend solely on end users:

- business images
- untranslated or irrelevant text

### Application overview

Simplicité applications are **single-page applications** (SPA):
navigation does not change the URL and, in most cases, does not reload the document.
The functional equivalent of a page change is the replacement of most of the main content area (the `#work` section).

This behavior is explained for the relevant criteria, notably those related to navigation
(theme 12) and mandatory elements (theme 8).
Navigation actions are carried by links, in order to preserve the semantic distinction between navigation and action.

Moreover, generated applications are **highly interactive**, as they rely on
forms, lists, business processes and exchanges between users.

This density of interaction requires particular attention during audits: a component may behave differently
depending on the calling context, the object's state or the user's rights.

### Distribution of responsibilities

The compliance of a delivered application results from three distinct contributions.

| Actor | Responsibility |
| ----- | -------------- |
| **The platform** | Make as many native components accessible as possible, and provide designers with the mechanisms needed to make their applications compliant. |
| **The designer** | Use these mechanisms correctly: use features declared compliant (or partially compliant, while following the rules and best practices), relevant labels, contrast of custom themes, compliance of external objects. |
| **The end user** | Fill in alternatives for uploaded content (images, documents) when the application allows it, and enter understandable, consistent field values. |

Some elements are structurally beyond any verification by the platform:
external object code, custom HTML, JavaScript addons, bespoke themes, language of an end user's input.
They are listed in the section [Exceptions and out-of-context components](#exceptions-and-out-of-context-components).

Platform accessibility features
-------------------------------

Beyond making components compliant, the platform provides two dedicated mechanisms,
acting at two levels: the end user, and the designer.
Several positions in this document explicitly depend on them. Their implementation is detailed in the designer help.

### Accessibility mode (`a11y-mode`)

This mode can be turned on and off at any time by the end user, from a dedicated button in the application header.
It adapts or disables interface behaviors that may hinder or prevent use of the application with assistive technology,
without unduly degrading the experience of users who do not need it.

Supported behaviors are:

- custom colors of action buttons and states;
- the horizontal menu;
- splitting the work area into resizable panels;
- compact mode;
- mosaic display of lists;
- trays (trello) and metrics of status-based objects;
- predefined searches offered in the search dialog;
- date pickers;
- HTML input fields;
- forced `HighContrast` theme;
- opening a form per table row;
- default display of linked objects.

:::warning

This mode is a safety net. It does not fix components identified as non-compliant: an application subject to a strict
compliance requirement must disable those components at design time, regardless of whether the user activates the mode.

:::

The platform also provides an `ACCESSIBILITY_OVERRIDE` user parameter to fine-tune which features are disabled.

> In the context of an audit, only use of the application with this mode enabled is guaranteed compliant (for core elements).

### Design assistance (`ACCESSIBILITY_DEV`)

This system parameter, intended for designers, displays during design a badge next to
each field's label, indicating by its color (and a label) the RGAA compliance level of the corresponding feature:
not assessed, non-compliant, partially compliant, or compliant.

The absence of a badge indicates a feature to which the criteria of the standard do not apply.

A designer subject to a compliance requirement thus has, while building their screens,
the information needed to rule out non-compliant features and correctly configure those that are only partially compliant.

Once the application has been audited, the designer can record the result in the `ACCESSIBILITY_LEVEL` system parameter.

Methodology and how to read the tables
--------------------------------------

### Statuses

Only the three RGAA statuses are used. A status is a fixed verdict: it says nothing about work in progress.

| Status | Meaning |
| ------ | ------- |
| <rgaa-c>**Compliant**</rgaa-c> | The criterion is met across the entire assessed scope. |
| <rgaa-nc>**Non-Compliant**</rgaa-nc> | At least one case within the assessed scope does not meet the criterion. |
| <rgaa-na>**Not Applicable**</rgaa-na> | The criterion has no subject within the assessed scope. |

### Scopes

The **Scope** column indicates who is responsible for meeting the criterion. It does not change the status:
it specifies what the status covers.

| Scope | Meaning |
| ----- | ------- |
| **Core** | Guaranteed by the platform. |
| **Configured core** | Guaranteed as long as a documented option is enabled. The condition is restated at the start of the justification. |
| **Shared** | The platform provides the mechanism; the designer or user must use it correctly. |
| **Designer** | Beyond the platform's reach: the outcome depends entirely on the designer's developments. |

### Breakdown of positions

Out of the 106 criteria of RGAA 4.1.2: **72 compliant**, **5 non-compliant**, **29 not applicable** to the
core - i.e. **93.5 %** of applicable criteria.

This indicator measures core coverage, not the compliance of a delivered application. The latter also depends
on the designer's design choices and on their adherence to the rules provided: an application built on a compliant core may not itself be compliant.

Themes
------

### 1. Images

| Criterion | Title | Status | Scope | Justification |
| --------- | ----- | ------ | ----- | ------------- |
| 1.1 | Does each informative image have a text alternative? | <rgaa-c>**Compliant**</rgaa-c> | Shared | Images generated by the core are mostly decorative; those that convey information all have an alternative. Business images, uploaded by designers or users, have an `alt` sub-field that the platform makes available to them and that they are responsible for filling in. |
| 1.2 | Is each decorative image correctly ignored by assistive technologies? | <rgaa-c>**Compliant**</rgaa-c> | Core | Decorative images generated by the core have an empty `alt` and no `title`; vector icons and equivalent generated content are neutralized with `aria-hidden="true"`. |
| 1.3 | For each informative image with a text alternative, is that alternative relevant? | <rgaa-c>**Compliant**</rgaa-c> | Shared | Alternatives of core images describe the information conveyed by the image. For business images, the platform has no meta-information about the uploaded content: the relevance of the alternative necessarily lies with whoever uploads the image. |
| 1.4 | For each image used as a CAPTCHA or as a test image, with a text alternative, does that alternative identify the nature and function of the image? | <rgaa-c>**Compliant**</rgaa-c> | Shared | The only CAPTCHA images are those on the _register_ page, and they all have a text alternative such as `Choice N`. |
| 1.5 | For each image used as a CAPTCHA, is an alternative way of accessing the content or function of the CAPTCHA available? | <rgaa-c>**Compliant**</rgaa-c> | Shared | An audio form of CAPTCHA is available. |
| 1.6 | Does each informative image have, if necessary, a detailed description? | <rgaa-c>**Compliant**</rgaa-c> | Shared | As with criterion `1.1`, the platform makes it possible to associate a description via `aria-describedby` regardless of context. |
| 1.7 | For each informative image with a detailed description, is that description relevant? | <rgaa-c>**Compliant**</rgaa-c> | Shared | Since the description is the user's responsibility, it is assumed to be relevant: the platform enables its creation and the association is automatic. |
| 1.8 | Each informative image of text must, where possible and in the absence of a replacement mechanism, be replaced by styled text. Is this rule followed? | <rgaa-c>**Compliant**</rgaa-c> | Shared | The core uses no images of text. An image of text uploaded as a business image has a description attached with `aria-describedby`, displayed next to the image. |
| 1.9 | Is each image caption, if necessary, correctly linked to the corresponding image? | <rgaa-na>**Not Applicable**</rgaa-na> | Shared | The core never associates a visible caption with an image: there is therefore no caption to link. |

:::info

Users and designers may include images in their applications whose content and purpose
are unknown to the platform. Filling in `alt` attributes and descriptions is therefore their responsibility when
the image conveys information; the platform's responsibility covers the images it places in the interface
itself, as well as making the mechanism available.

:::

### 2. Frames

| Criterion | Title | Status | Scope | Justification |
| --------- | ----- | ------ | ----- | ------------- |
| 2.1 | Does each frame have a frame title? | <rgaa-nc>**Non-Compliant**</rgaa-nc> | Core | The core uses a frame to display documents. The systematic presence of a frame title is not guaranteed at this time; the position is taken as a precaution. |
| 2.2 | For each frame with a frame title, is that title relevant? | <rgaa-nc>**Non-Compliant**</rgaa-nc> | Core | Direct consequence of criterion `2.1`. |

### 3. Colors

| Criterion | Title | Status | Scope | Justification |
| --------- | ----- | ------ | ----- | ------------- |
| 3.1 | In each web page, information must not be conveyed by color alone. Is this rule followed? | <rgaa-c>**Compliant**</rgaa-c> | Core | The information carried by an element is always available in text form: visible label, component content, or accessible name. Color always complements one of these vectors, never stands alone. |
| 3.2 | In each web page, is the contrast between the text color and its background color sufficiently high? | <rgaa-c>**Compliant**</rgaa-c> | Configured core | _Provided the `HighContrast` theme is applied._ This theme guarantees compliant contrast ratios across all core elements. For elements whose color remains configurable - states, action buttons - a contrast checker is built into the configuration interface, allowing the designer to validate their choices as they make them. |
| 3.3 | In each web page, are the colors used in user interface components or informative elements sufficiently contrasted? | <rgaa-c>**Compliant**</rgaa-c> | Configured core | _Provided the `HighContrast` theme is applied._ Same provisions as for criterion `3.2`. |

:::info

A custom theme falls outside the scope guaranteed by the platform: since colors are entirely
variable-based and overridable, contrast compliance then lies with the designer. The built-in contrast
checker is available at every customization point to help.

The `HighContrast` theme is the one applied by default when the _accessibility mode_ is used without any override.

:::

### 4. Multimedia <rgaa-na>**Not Applicable**</rgaa-na>

| Criterion | Title | Status | Scope | Justification |
| --------- | ----- | ------ | ----- | ------------- |
| 4.1 | Does each pre-recorded time-based media have, if necessary, a text transcript or an audio description? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | The core includes no time-based or non-time-based media. |
| 4.2 | For each pre-recorded time-based media with a text transcript or audio description, are these relevant? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | Same as `4.1`. |
| 4.3 | Does each pre-recorded synchronized time-based media have, if necessary, synchronized captions? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | Same as `4.1`. |
| 4.4 | For each pre-recorded synchronized time-based media with synchronized captions, are these captions relevant? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | Same as `4.1`. |
| 4.5 | Does each pre-recorded time-based media have, if necessary, a synchronized audio description? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | Same as `4.1`. |
| 4.6 | For each pre-recorded time-based media with a synchronized audio description, is it relevant? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | Same as `4.1`. |
| 4.7 | Is each time-based media clearly identifiable? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | Same as `4.1`. |
| 4.8 | Does each non-time-based media have, if necessary, an alternative? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | Same as `4.1`. |
| 4.9 | For each non-time-based media with an alternative, is that alternative relevant? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | Same as `4.1`. |
| 4.10 | Can each automatically triggered sound be controlled by the user? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | No sound is triggered by the core. |
| 4.11 | Can the playback of each time-based media, if necessary, be controlled by keyboard and any pointing device? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | Same as `4.1`. |
| 4.12 | Can the playback of each non-time-based media be controlled by keyboard and any pointing device? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | Same as `4.1`. |
| 4.13 | Is each time-based and non-time-based media compatible with assistive technologies? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | Same as `4.1`. |

:::info

Media embedded in an application by a designer, through custom HTML content or an external
object, makes this theme applicable to the application concerned. Its compliance then lies
entirely with the designer.

:::

### 5. Tables

| Criterion | Title | Status | Scope | Justification |
| --------- | ----- | ------ | ----- | ------------- |
| 5.1 | Does each complex data table have a summary? | <rgaa-c>**Compliant**</rgaa-c> | Core | Object lists may have header structures that qualify as complex data tables. A visually hidden `caption` element always carries the table summary. |
| 5.2 | For each complex data table with a summary, is that summary relevant? | <rgaa-c>**Compliant**</rgaa-c> | Core | The summary is generated deterministically from the table's actual structure: number and layout of columns and rows, available functions. It therefore describes the table's organization rather than its content, in line with the purpose of the criterion. |
| 5.3 | For each layout table, does the linearized content remain understandable? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | The core uses no tables for layout purposes: all layouts rely on styles. |
| 5.4 | For each data table with a title, is the title correctly associated with the data table? | <rgaa-c>**Compliant**</rgaa-c> | Core | The title is carried by an `aria-label` attribute on the table element, using the name of the listed object. This is one of the methods allowed by test 5.4.1. Title and summary are thus carried by two distinct mechanisms, in line with the distinction the standard makes between criteria `5.1` and `5.4`. |
| 5.5 | For each data table with a title, is that title relevant? | <rgaa-c>**Compliant**</rgaa-c> | Core | The title unambiguously identifies what the table contains: the instances of the business object concerned, whose fields make up the column headers. |
| 5.6 | For each data table, is each column header and each row header correctly declared? | <rgaa-c>**Compliant**</rgaa-c> | Core | Headers are declared using native `th` elements, generated by the list rendering structure. |
| 5.7 | For each data table, is the appropriate technique used to associate each cell with its headers? | <rgaa-c>**Compliant**</rgaa-c> | Core | Headers carry a `scope` attribute (`col` or `row` depending on their scope). WAI-ARIA table attributes are only used for complex data tables, in line with the restriction of test 5.6.4. |
| 5.8 | Is each layout table free of structural markup specific to data tables? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | Direct consequence of criterion `5.3`: in the absence of layout tables, the criterion has no subject. |

### 6. Links

| Criterion | Title | Status | Scope | Justification |
| --------- | ----- | ------ | ----- | ------------- |
| 6.1 | Is each link explicit? | <rgaa-c>**Compliant**</rgaa-c> | Shared | Each link generated by the core has an accessible name that conveys its function and destination, carried by its visible label or, when that is insufficient, by an `aria-label` attribute. The `title` attribute is no longer used for this purpose. Labels coming from configuration - object names, action labels - are defined by the designer, who is responsible for making them explicit. |
| 6.2 | In each web page, does each link have a label? | <rgaa-c>**Compliant**</rgaa-c> | Shared | No link generated by the core lacks an accessible name, including icon-only links. |

### 7. Scripts

| Criterion | Title | Status | Scope | Justification |
| --------- | ----- | ------ | ----- | ------------- |
| 7.1 | Is each script, if necessary, compatible with assistive technologies? | <rgaa-c>**Compliant**</rgaa-c> | Core | ```TODO``` |
| 7.2 | For each script with an alternative, is that alternative relevant? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | No core script has an alternative in the sense of the standard: accessibility is pursued within the component itself rather than through a replacement version. The criterion, which is conditional on an alternative existing, therefore has no subject. |
| 7.3 | Can each script be controlled by keyboard and by any pointing device? | <rgaa-c>**Compliant**</rgaa-c> | Core | All script triggers can be reached and operated by keyboard as well as by pointer: access, activation, validation, cancellation and exit. Navigation components - main menu, secondary menu, dropdown menus - follow the corresponding WAI-ARIA design patterns, with arrow-key navigation and activation via `Enter` or `Space`. All keyboard shortcuts are documented in the designer help. |
| 7.4 | For each script that initiates a change of context, is the user warned or in control? | <rgaa-c>**Compliant**</rgaa-c> | Core | No change of context is triggered by receiving focus or by changing a field's value: typing in a form triggers no application action. Opening modals, switching work areas and navigating all result from an explicit user action. |
| 7.5 | In each web page, are status messages correctly rendered by assistive technologies? | <rgaa-c>**Compliant**</rgaa-c> | Core | Status messages carry roles suited to their nature: `alert` for error messages and warnings requiring immediate attention, `progressbar` for loading indicators, `status` and `log` for non-urgent feedback and successive messages. |

### 8. Mandatory elements

| Criterion | Title | Status | Scope | Justification |
| --------- | ----- | ------ | ----- | ------------- |
| 8.1 | Is each web page defined by a document type? | <rgaa-c>**Compliant**</rgaa-c> | Core | The generated document always includes the `<!DOCTYPE html>` declaration, on the first line and with no preceding comment. |
| 8.2 | For each web page, is the generated source code valid according to the specified document type? | <rgaa-c>**Compliant**</rgaa-c> | Shared | Code produced by native components is valid with respect to the HTML specification. Custom HTML content and external objects, inserted into the document by the designer, fall outside this verification. |
| 8.3 | In each web page, does the source code contain a default language attribute? | <rgaa-c>**Compliant**</rgaa-c> | Core | The document's root element carries a `lang` attribute. |
| 8.4 | For each web page with a default language attribute, is that attribute relevant? | <rgaa-c>**Compliant**</rgaa-c> | Core | The attribute reflects the language actually used by the interface, and is updated when the user changes the application language. |
| 8.5 | Does each web page have a page title? | <rgaa-c>**Compliant**</rgaa-c> | Shared | The document title follows the pattern "application name - current content", and is updated on every change of main content. The application name is defined by the designer. |
| 8.6 | For each web page with a page title, is that title relevant? | <rgaa-c>**Compliant**</rgaa-c> | Shared | The title identifies both the application and the content being viewed, and thus distinguishes the tab among others. Its relevance depends on the application name chosen by the designer. |
| 8.7 | In each web page, is each change of language indicated in the source code? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | The interface is displayed in a single language at a time. The language selector itself is not an exception: the languages offered are named in the interface's current language - a French-speaking user reads "français" and "anglais", an English-speaking user reads "french" and "english". No passage of text is therefore written in a language different from that of the document. |
| 8.8 | In each web page, is the language code of each change of language valid and relevant? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | Direct consequence of criterion `8.7`. |
| 8.9 | In each web page, are tags not used solely for presentation purposes? | <rgaa-c>**Compliant**</rgaa-c> | Shared | Structural tags have been removed from all purely presentational uses in the core. Custom HTML content introduced by designers cannot be verified by the platform. |
| 8.10 | In each web page, are changes in reading direction indicated? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | The core produces no change in reading direction. |

### 9. Information structure

| Criterion | Title | Status | Scope | Justification |
| --------- | ----- | ------ | ----- | ------------- |
| 9.1 | In each web page, is information structured through the appropriate use of headings? | <rgaa-c>**Compliant**</rgaa-c> | Core | The heading hierarchy is deliberately kept to three levels, applied deterministically: `h1` for the main content of the work area, `h2` for secondary content, `h3` for modals and dialogs. This hierarchy skips no levels, and every passage of text that visually functions as a heading is marked up accordingly. |
| 9.2 | In each web page, is the document structure consistent? | <rgaa-c>**Compliant**</rgaa-c> | Core | The header, navigation, main content and footer areas are carried by the `header`, `nav`, `main` and `footer` elements respectively. |
| 9.3 | In each web page, is each list correctly structured? | <rgaa-c>**Compliant**</rgaa-c> | Core | The main menu, the sitemap, dropdown menus and content lists use the appropriate list elements. |
| 9.4 | In each web page, is each quotation correctly indicated? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | The core provides no mechanism for inserting quotations. |

### 10. Presentation of information

| Criterion | Title | Status | Scope | Justification |
| --------- | ----- | ------ | ----- | ------------- |
| 10.1 | In the website, are style sheets used to control the presentation of information? | <rgaa-c>**Compliant**</rgaa-c> | Core | The core uses no presentational tags or attributes: all formatting is carried by external style sheets, with no inline `style` elements. |
| 10.2 | In each web page, does visible informative content remain present when style sheets are disabled? | <rgaa-c>**Compliant**</rgaa-c> | Core | All information is preserved when CSS is removed; icon buttons have `sr-only` text, and more generally no information is conveyed by `::before/::after`. |
| 10.3 | In each web page, does information remain understandable when style sheets are disabled? | <rgaa-c>**Compliant**</rgaa-c> | Core | The application is obviously not efficiently usable without CSS (too many complex elements), but that is not what this criterion checks. Although navigation is more tedious, elements remain grouped by category, still carry their information, and the page structure remains identifiable. This criterion nonetheless remains ambiguous on these points. |
| 10.4 | In each web page, does text remain readable when the font size is increased to at least 200%? | <rgaa-c>**Compliant**</rgaa-c> | Core | Verified according to the protocol described above: no truncation, overlap or loss of functionality at 200%. |
| 10.5 | In each web page, are CSS declarations of element background colors and font colors used correctly? | <rgaa-c>**Compliant**</rgaa-c> | Core | Every background color declaration is accompanied by a text color declaration, and vice versa. |
| 10.6 | In each web page, is each link whose nature is not obvious visible in relation to the surrounding text? | <rgaa-c>**Compliant**</rgaa-c> | Configured core | _Provided the `HighContrast` theme is applied._ Links whose nature is not clear from context - links within lists, redirect actions - receive a visual treatment aligned with that of standard links. A custom theme overriding these styles is the designer's responsibility. |
| 10.7 | In each web page, for each element receiving focus, is the focus visible? | <rgaa-c>**Compliant**</rgaa-c> | Configured core | _Provided the `HighContrast` theme is applied._ This theme defines a focus style for all focusable elements. |
| 10.8 | For each web page, is hidden content meant to be ignored by assistive technologies? | <rgaa-c>**Compliant**</rgaa-c> | Core | Hidden content is neutralized for assistive technologies, and content intended only for those technologies is visually hidden without being removed from the accessibility tree. |
| 10.9 | In each web page, information must not be conveyed by shape, size or position alone. Is this rule followed? | <rgaa-c>**Compliant**</rgaa-c> | Core | No core information is conveyed exclusively by the shape, size or position of an element. |
| 10.10 | In each web page, information must not be conveyed by shape, size or position alone. Is this rule implemented relevantly? | <rgaa-c>**Compliant**</rgaa-c> | Core | Indications of shape, size or position are always paired with textual information or an accessible name. |
| 10.11 | For each web page, can content be presented without loss of information or functionality and without requiring either vertical scrolling for a window 256 px high, or horizontal scrolling for a window 320 px wide? | <rgaa-c>**Compliant**</rgaa-c> | Shared | Core components adapt to small screens - stacking of elements, reorganization of lists, action bars and menus. This criterion also falls partly to the designer: a form layout built without regard for small screens can fail it independently of the core. |
| 10.12 | In each web page, can text spacing properties be redefined by the user without loss of content or functionality? | <rgaa-nc>**Non-Compliant**</rgaa-nc> | Core | Applying the spacing values causes loss of content in some components. |
| 10.13 | In each web page, is additional content appearing on focus or hover of a user interface component controllable by the user? | <rgaa-c>**Compliant**</rgaa-c> | Core | The only content concerned is tooltips in forms and lists. They appear on focus and disappear as soon as focus leaves the triggering element, without obscuring it. |
| 10.14 | In each web page, can additional content appearing via CSS styles only be made visible by keyboard and any pointing device? | <rgaa-c>**Compliant**</rgaa-c> | Core | All additional content (excluding `title`) is triggered both on hover and through keyboard navigation. |

### 11. Forms

| Criterion | Title | Status | Scope | Justification |
| --------- | ----- | ------ | ----- | ------------- |
| 11.1 | Does each form field have a label? | <rgaa-c>**Compliant**</rgaa-c> | Core | All input contexts are covered - object form, search, inline list editing, confirmation modals. The label is carried either by a `label` element associated with the field, or by an equivalent accessible name when the visible label cannot be structurally associated. |
| 11.2 | Is each label associated with a form field relevant? | <rgaa-c>**Compliant**</rgaa-c> | Shared | The label uses the field's title as defined in the data model. Its relevance therefore depends on the quality of the labels chosen by the designer. |
| 11.3 | In each form, is each label associated with a form field that has the same function and is repeated several times on the same page or across a set of pages consistent? | <rgaa-c>**Compliant**</rgaa-c> | Core | Fields with the same function reproduced in several contexts - a list's search field, global search, linked-object selector - receive identical labels, generated by the same mechanism. In inline list editing, each field receives an accessible name referencing the row concerned, which distinguishes it from its counterparts without breaking label consistency. |
| 11.4 | In each form, are each field label and its associated field adjacent? | <rgaa-c>**Compliant**</rgaa-c> | Shared | The default rendering places the label right next to its field. This placement can be undone by a form layout that separates the two; the designer help prohibits this practice. |
| 11.5 | In each form, are fields of the same nature grouped, if necessary? | <rgaa-c>**Compliant**</rgaa-c> | Core | Radio buttons and checkboxes of the same nature are structurally grouped in all input contexts. |
| 11.6 | In each form, does each grouping of fields of the same nature have a legend? | <rgaa-c>**Compliant**</rgaa-c> | Core | The grouping has a legend, carried either by a `legend` element or by the accessible name of the container when it has a group role. |
| 11.7 | In each form, is each legend associated with a grouping of fields of the same nature relevant? | <rgaa-c>**Compliant**</rgaa-c> | Shared | The legend uses the title of the field whose options make up the group. Same caveat as for criterion `11.2`. |
| 11.8 | In each form, are items of the same nature in a choice list grouped relevantly? | <rgaa-c>**Compliant**</rgaa-c> | Core | Choice lists derived from hierarchical enumerations produce the corresponding groupings. |
| 11.9 | In each form, is the label of each button relevant? | <rgaa-c>**Compliant**</rgaa-c> | Shared | Core buttons carry a label describing the action performed. Custom actions are labeled by the designer. |
| 11.10 | In each form, is input validation used relevantly? | <rgaa-c>**Compliant**</rgaa-c> | Core | Input errors are reported in text, the field at fault is identified, and the error message is conveyed to assistive technologies via a status message. |
| 11.11 | In each form, is input validation accompanied, if necessary, by suggestions to help correct input errors? | <rgaa-c>**Compliant**</rgaa-c> | Shared | The platform natively allows associating input help with each field, rendered along with the error message; filling it in is the designer's responsibility. When the accessibility mode replaces a date picker with text input, the expected format is provided automatically. |
| 11.12 | For each form that modifies or deletes data, or submits answers to a test or exam, or whose submission has financial or legal consequences, can the entered data be modified, updated or retrieved by the user? | <rgaa-c>**Compliant**</rgaa-c> | Core | Data saved via a form remains viewable and editable afterwards in that same form, subject to the user's rights. Deletions require prior explicit confirmation. |
| 11.13 | Can the purpose of an input field be inferred to facilitate automatic filling of fields with the user's data? | <rgaa-c>**Compliant**</rgaa-c> | Core | The only fields collecting data about the user themselves are on the authentication screen; their purpose is correctly declared there. Fields in business forms concern third-party data and fall outside the scope of this criterion. |

### 12. Navigation

| Criterion | Title | Status | Scope | Justification |
| --------- | ----- | ------ | ----- | ------------- |
| 12.1 | Does each set of pages have at least two different navigation systems? | <rgaa-c>**Compliant**</rgaa-c> | Core | The platform natively provides a navigation menu and a sitemap, plus global search when enabled. The breadcrumb is not counted among these systems: it works historically rather than hierarchically, and is not one of the systems recognized by the standard. |
| 12.2 | In each set of pages, are the menu and navigation bars always in the same place? | <rgaa-c>**Compliant**</rgaa-c> | Core | The menu and navigation bars are persistent and keep their position regardless of the content displayed in the work area. |
| 12.3 | Is the "sitemap" page relevant? | <rgaa-c>**Compliant**</rgaa-c> | Shared | The sitemap includes all navigation elements and first- and second-level actions accessible from the home page: header actions and shortcuts, menu entries, home page elements, footer links. It is built from what the designer has declared should appear in it: its completeness therefore partly depends on this configuration. |
| 12.4 | In each set of pages, is the "sitemap" page accessible from any page? | <rgaa-c>**Compliant**</rgaa-c> | Core | The sitemap is reachable from the footer, which persists regardless of the content displayed. |
| 12.5 | In each set of pages, is the search engine accessible from any page? | <rgaa-c>**Compliant**</rgaa-c> | Core | When enabled, global search is reachable from the header, which persists regardless of the content displayed. |
| 12.6 | Can content grouping areas present on several web pages (header, main navigation, main content, footer and search engine areas) be reached or skipped? | <rgaa-c>**Compliant**</rgaa-c> | Core | Each area is delimited by the corresponding structural element and reachable via a dedicated skip link. Documented keyboard shortcuts also allow jumping directly to the menu, global search, the first visible list or the next area. |
| 12.7 | In each web page, is a skip link or quick-access link to the main content area present? | <rgaa-c>**Compliant**</rgaa-c> | Core | Skip links are present at the top of the document, pointing to the work area as well as to the header, main menu and footer. |
| 12.8 | In each web page, is the tab order consistent? | <rgaa-c>**Compliant**</rgaa-c> | Core | The tab order follows the document's reading order. Visually moved components are moved without being dissociated from their position in the document tree, and focus is returned to the triggering element when a modal is closed. |
| 12.9 | In each web page, navigation must not contain keyboard traps. Is this rule followed? | <rgaa-c>**Compliant**</rgaa-c> | Configured core | _Provided third-party editors are neutralized._ No core component traps focus. Rich text and code editors, which come from third-party libraries, are the remaining case; they are neutralized by the accessibility mode and the user override, and the designer help recommends excluding them from any application subject to a strict requirement. External objects are not covered. |
| 12.10 | In each web page, are keyboard shortcuts using only a single key (upper- or lower-case letter, punctuation, number or symbol) controllable by the user? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | The platform's shortcuts rely on key combinations. The only keys used on their own - `Esc`, `Enter`, `Tab` and arrow keys - are not printable characters and therefore fall outside the scope of this criterion. |
| 12.11 | In each web page, is additional content appearing on hover, focus or activation of a user interface component reachable by keyboard, if necessary? | <rgaa-c>**Compliant**</rgaa-c> | Core | The only content concerned is tooltips in forms and lists, displayed when their triggering element receives focus. |

### 13. Consultation

| Criterion | Title | Status | Scope | Justification |
| --------- | ----- | ------ | ----- | ------------- |
| 13.1 | For each web page, does the user have control over each time limit that changes content? | <rgaa-nc>**Non-Compliant**</rgaa-nc> | Core | The application session is subject to a time limit. The user is warned of its upcoming expiration, but has no way to extend, disable or adjust it from the interface. Its duration can be configured globally by the administrator and individually in user settings, which does not meet the condition of control by the user themselves. |
| 13.2 | In each web page, opening a new window must not be triggered without user action. Is this rule followed? | <rgaa-c>**Compliant**</rgaa-c> | Core | No window or modal is opened other than through an explicit user action. |
| 13.3 | In each web page, does each downloadable office document have, if necessary, an accessible version? | <rgaa-nc>**Non-Compliant**</rgaa-nc> | Shared | Documents offered for download in an application are either uploaded by users or produced from templates defined by the designer. The platform does not generate accessible versions of these documents and has no means of assessing their accessibility. |
| 13.4 | For each office document with an accessible version, does that version provide the same information? | <rgaa-na>**Not Applicable**</rgaa-na> | Shared | Direct consequence of criterion `13.3`: in the absence of an accessible version, the criterion has no subject. |
| 13.5 | In each web page, does each cryptic content (ASCII art, emoticon, cryptic syntax) have an alternative? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | No content of this kind is produced by native components. |
| 13.6 | In each web page, for each cryptic content (ASCII art, emoticon, cryptic syntax) with an alternative, is that alternative relevant? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | Direct consequence of criterion `13.5`. |
| 13.7 | In each web page, are sudden changes in brightness or flashing effects used correctly? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | No native component produces sudden changes in brightness or flashing effects. |
| 13.8 | In each web page, is each moving or blinking content controllable by the user? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | The only motion produced by the core consists of transitions triggered by a user action and lasting less than five seconds. No blinking content is generated. |
| 13.9 | In each web page, can the content be viewed regardless of screen orientation (portrait or landscape)? | <rgaa-c>**Compliant**</rgaa-c> | Core | No orientation is enforced, and all content and functionality remain accessible in both orientations. |
| 13.10 | In each web page, can features operable or available through a complex gesture also be available through a simple gesture? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | No core feature requires a multipoint or path-based gesture in the sense of the standard. Drag-and-drop features, such as trays, can moreover be neutralized via the accessibility mode and the user override. |
| 13.11 | In each web page, can actions triggered with a pointing device on a single point of the screen be cancelled? | <rgaa-c>**Compliant**</rgaa-c> | Core | Actions are triggered on pointer release rather than on press: a user can therefore abandon an action by moving the pointer off the element before releasing. |
| 13.12 | In each web page, can features that involve device motion or motion towards the device be satisfied in an alternative way? | <rgaa-na>**Not Applicable**</rgaa-na> | Core | No core feature relies on device motion. |

Exceptions and out-of-context components
----------------------------------------

This section details the elements whose compliance structurally cannot be guaranteed by
the platform, as well as the positions taken on criteria made ambiguous by the context of a
single-page application.

### External objects

The platform allows designers to implement **external objects**: fully
custom components, written in free-form code, addressing specific needs and using the Simplicité API
as they see fit.

The markup produced by these objects is entirely outside the core: neither its validity, structure, usage context nor
accessibility attributes can be verified. Their compliance therefore lies entirely with the
designer who writes them.

The only components qualifying as "external objects" that are assessed along with the core are the native widgets.

### Custom HTML content and addons

Beyond external objects, several extension points allow uncontrolled markup to be injected into the
interface: static HTML content, field help containing markup, JavaScript
addons, custom styles, header/footer customization, publication templates.

Purely textual content in the application's language carries no risk; as soon as it contains HTML, its compliance lies with the designer.

### Custom themes

The platform allows the interface's appearance to be customized through the creation of
**themes**. Since themes directly determine element contrast, a contrast
checker is built into every customization point (including outside the _Theme editor_ tool)
so that the designer can validate their choices as they make them.

The platform cannot, however, prevent the definition of an insufficiently contrasted theme.
It provides a high-contrast theme by default (used by default with the _accessibility mode_), which guarantees compliance
with the contrast and focus visibility criteria without any intervention.

Beyond this theme, i.e. for everything related to layouts and display options, color compliance lies with the designer,
within the limits of what is configurable.

### Navigation in a single-page application

In a single-page application, navigation is not accompanied by any URL change. The behavior
closest to a page change is the replacement of most of the main content area, the `#work` section.

The position taken is to carry everything that constitutes a navigation action with **links**,
and everything that constitutes an application action with **buttons**. This semantic distinction
restores the usual landmarks of a website and allows assistive technologies to distinguish
the two kinds of interaction, despite the absence of document reloads.

This has several consequences for how criteria are read, explained in the relevant
justifications: the notion of "set of pages" in theme 12 is understood as the set of states
of the work area, and the document title in theme 8 is updated on every change of
main content rather than on every load.

Resources and references
------------------------

This document is based on version **4.1.2** of the [RGAA](https://accessibilite.numerique.gouv.fr/).
Version 5 of the standard is being drafted, with publication announced for late 2026;
some of the links below may eventually point to this new version.

- [Criteria and tests](https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/) -
  source of the tests used to establish the positions in this document. This is the reference to
  use when comparing audit findings with our positions: each discrepancy should be traceable
  to a specific test.
- [RGAA glossary](https://accessibilite.numerique.gouv.fr/methode/glossaire/) - definitions of
  the notions used in criterion titles (complex data table, change of context,
  additional content, status message…). Several justifications in this document rely on these
  definitions rather than on the everyday meaning of the terms.
- [Conformity assessment](https://accessibilite.numerique.gouv.fr/obligations/evaluation-conformite/)
  and [accessibility statement template](https://accessibilite.numerique.gouv.fr/obligations/declaration-accessibilite/) -
  audit method and reporting obligations of the organization operating the application.
- [Using ARIA](https://www.w3.org/TR/using-aria/), [ARIA in HTML](https://www.w3.org/TR/html-aria/) and
  [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/) - design patterns followed
  by the core's interactive components, notably for menus, modals and lists.
