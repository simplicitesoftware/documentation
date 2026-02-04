---
sidebar_position: 70
title: WCAG 2.1 / RGAA
---

WCAG 2.1 / RGAA
===============

This document explains the Web Content Accessibility Guidelines (applicable to version 5.3 and above).

UI Regions
----------

The core UI supports common accessibility with 4 regions:

- Header and Footer
- One main menu on the left side
- One main area (work zone)

### One-page site

Global page settings:

- user's language to choose the related voice of page reader
- `viewport` can scale to 500%: zoom the full window with finger pinch
- `font-size` style can scale all `rem` components: inbound zoom from 50% to 200%

```html
<html lang="fr" style="font-size: 120%">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes">
...
```

### Header

The `header` region contains several permanent actions:

- The menu toggle to reduce the main menu on the left side and give 100% width to the main area
- The application logo to return to the home page
- The fulltext search bar, with buttons access to search page and users's bookmarks
- Icon buttons to access granted actions (user's filters, diagrams, module filtering, notifications...)
- Undo/Redo buttons
- Dropdown button with the current application scope
- Dropdown button of User profile, current language, and zoom preference (`rem` from 50% to 200%)
- Shortcuts as plain buttons or in a dropdown menu

### Footer

The `footer` region contains legal information and news by default:

- without action accept opening dialogs with information
- hidden on small device (mobile)

### Main menu

The main menu allows the user to access application entities:

- domain, objects, process, status, metrics, kanban...
- with accordion style: only one top domain is opened at a time, the current selected item is highlighted
- Role `menu` is displayed with closable sub-menu with children roles `menuitem`.

### Work area

The main region contains the current activity (list, form, pivot table, screen-flows...):

- can be splitted in sub-regions to display a treeview, a search panel docked on list, a diagram editor...

### Excluded regions

Complex widgets are not accessible because of massive mouse usage through drag&drop:

- the SVG diagram to edit business models
- the template editor to design object form/area/fields

They are optional and dedicated to designers.

Basics
------

### Aria-label, title and tooltip

Each unreadable action or feature (icon, image, div...) have an explicit description:

- in a simple `title` (ex: "home" on the logo image)
- or a bootstrap `tooltip` for rich HTML help (ex: field help)
- or a `aria-label` (ex: close icon without explicit title)

### Clickable and focusable elements

Elements with user interaction are mostly:

- focusable by design: `<a href>` and `<button type="button">`: for use in all component designs
- or with an explicit `tabindex="0"` and a handler on the keydown `ENTER` (ex: to open the `<tr>` in a `<table>`)

Example:

```javascript
$('.my-element-class').attr({
	tabindex: 0,
	role: "button",
	"aria-label": "description"
})
.on("click", function(e) {
	e.stopPropagation();
	// do something...
})
.on("keydown", function(e) {
	if (e.which==$ui.KEYS.ENTER) {
		e.preventDefault();
		$(this).trigger("click");
	}
});
```

Primary focusable elements are identified with the class `.js-focusable`, the first visible one is focused by default on page landing:

- form-control such as input, select, textarea...
- list rows and search-by filters

CSS styles by default:

- `:focus`: outline the element when focused, not required for all elements (ex: button prefers `:hover` to be highlighted)
- `:focus-visible`: outline the element when focused through keyboard, required for accessibility to identify the focus (no hover, no pointer)

Example:

```css
.my-element-class {
	cursor: pointer;
}
/* hover = mouse usage */
.my-element-class:hover {
	outline: solid .0625rem #fff;
}
/* tab key = mouse free usage */
.my-element-class:focus-visible {
	outline: solid .0625rem #fff;
}
```

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

Documentation
-------------

- [WCAG21 from w3c.org](https://www.w3.org/TR/WCAG21)
- [French WCAG 2.1](https://www.w3.org/Translations/WCAG21-fr)
- [French RGAA 4 from DINUM](https://accessibilite.numerique.gouv.fr)

Web accessibility testing
-------------------------

- W3C evaluating
  [w3c.org test-evaluate](https://www.w3.org/WAI/test-evaluate)

- Chrome plugin to inspect pages
  - [AXE devtools](https://www.deque.com/axe/devtools)
  - [AXE devtools chrome plugin](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)

- Audit kit for French requirements
  [kit-audit](https://accessibilite.numerique.gouv.fr/ressources/kit-audit)

- ARA checks from 25 to 106 rules
  [ARA testing](https://ara.numerique.gouv.fr)
