---
sidebar_position: 140
title: UI tools code examples
---

JavaScript UI tools code examples
=================================

The Simplicité UI tools methods are in the `Simplicite.UI` namespace and rely on jQuery&reg;.

> **Note**: `jQuery` is aliased as `$` as of **version 4.0** (in previous versions the alias was `$j`)

All methods are statics, they should be called as `Simplicite.UI.<method>(...)`.
In order to write more compact code the `Simplicite.UI` should be aliased, for instance:

	var $ui = Simplicite.UI;

This `$ui` alias will be used in the above examples.

The following examples are only usage snippets, for details please refer to JSDoc.

Helpers
-------

### Divs

The `$ui.div()` method returns a DOM `<div/>` jQuery object.

Typical usage can be:

```javascript
var d = $ui.div({ id: 'mydiv', style: 'background: lightgray' });
$('#mycontainerdiv').append(d.append("Hello world!"));
```

### Images and icons

The `$ui.image(name)` method returns a DOM `<img/>` jQuery object with source URL built as
standard image location (`Simplicite.ROOT + '/images/image/' + name`) if `name` is not null.

The `$ui.icon(name)` method returns a DOM `<img/>` jQuery object with source URL built as
standard icon location (`Simplicite.ROOT + '/images/icon/' + name`) if `name` is not null.

Typical usage can be:

```javascript
$('#mycontainerdiv').append($ui.image('simplicite.png'));
$('#mycontainerdiv').append($ui.icon('home.gif'));
```

### Static GoogleMaps&reg; image

The `$ui.staticMap(param)` method returns a DOM `<img/>` jQuery object with a source URL on a static GoogleMaps&reg; map.
It takes various types of parameter:

```javascript
var map1 = $ui.staticMap({ coordinates: "48.880370621;2.35282005703" }); // E.g. Simplicite coordinates field value
var map2 = $ui.staticMap({ latitude: 48.880370621, longitude: 2.35282005703, zoom: 13, width: 200, height: 150 });
```

### Buttons

The `$ui.button()` method returns a DOM `<input type="button"/>` jQuery&reg; object.

Typical usage can be:

```javascript
var bt = $('#mycontainerdiv').append($ui.button({ id: 'mybutton', label: 'Click me !', color: 'green'}).click(function() {
	alert('You clicked me!');
}));
```

The `$ui.imageButton()` method is similar except that it returns a DOM `<img/>` jQuery object,
you can specify either an `image`or an `icon`.

Typical usage can be:

```javascript
// Image button
var imbt = $('#mycontainerdiv').append($ui.imageButton({ id: 'myimagebutton', label: 'Click me !', icon: 'home.gif'}).click(function() {
	alert('You clicked me!');
}));
// Icon button
var icbt = $('#mycontainerdiv').append($ui.imageButton({ id: 'myiconbutton', label: 'Click me !', image: 'simplicite.png'}).click(function() {
	alert('You clicked me!');
}));
```

<!--
### Forms

**TO BE COMPLETED**

### iFrames

**TO BE COMPLETED**

Popups
-------

**TO BE COMPLETED**

Dialogs
-------

**TO BE COMPLETED**

Areas
-----

### Simple areas

**TO BE COMPLETED**

### Tabbed areas

**TO BE COMPLETED**

### Gadget areas

**TO BE COMPLETED**

Charts
-----

**TO BE COMPLETED**
-->