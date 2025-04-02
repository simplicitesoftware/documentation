---
sidebar_position: 30
title: Form templates
---

Business objects form templates
===============================

This document explains the business object form template configuration capabilities.

Basics
------

A business object has a form template which is a HTML fragment including special tags.

### Field zones

The basic tag is the **field zone** tag `data-area="n"`, this will tell the platform to display all object fields of zone number `n` in this form area.
For instance:

```html
<div>
  <div class="row">  
	<div class="area col-sm-8" data-area="2,3,4"></div>  
	<div class="area col-sm-4" data-area="1:="></div>  
  </div>  
  <div class="area" data-area="5,6"></div>  
</div>  
```

<!-- 
### Panels lists

**TO BE COMPLETED**

### Actions

**TO BE COMPLETED**
-->

Advanced
--------

### Sub-areas

It is possible to embed template fragments within templates:

<!-- 
**TO BE COMPLETED**
-->


### External components

Form templates allow to integrate external web-based components. For instance the following template will display a Google map:

```html
<div>
  <div class="extern" data-embedded="true" data-extern="BpiWebPageExt" data-iframe="true" data-title="false" style="width: 100%; height: 100%;"></div>
  <div>
    <div class="row">
      <div class="col-sm-3">
        <div class="field" data-field="myField"></div>
      </div>
      </div>
    <div class="area" data-area="1"></div>
  </div>
</div>```

### Resources

JavaScript or CSS stylesheets resources can also be attached to a business object.

The javascript resource with the `SCRIPT` code is automatically included in the object form template.

The CSS stylesheet resource with the `STYLES` code is also automatically included in the object form template.

Other resources needs to be explicitly included using HTML include tags like:

```html
<script type="text/javascript" src="[JSRESOURCEURL:<JS resource code>]"></script>
```

or 

```html
<link  type="text/css" rel="stylesheet" href="[CSSRESOURCEURL:<CSS resource code>]"/>
```

