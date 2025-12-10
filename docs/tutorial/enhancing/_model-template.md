---
sidebar_class_name: hidden
sidebar_position: 22
title: Model template
---

Template Model
==============

Template models can be configured from the Menu **Modeler/Model template**.
They allow you to create specific templates for a business model use, for example a template allowing you to create orders via the modeler.

The settings consist of designating a Name and a Type of template.

Once the template model has been created, the model objects and links must be set up:

- enter the objects and their type as well as their styles in the modeler
- enter the links between objects and their styles (Line - simple link, Arrow - Reference, etc.), define the origin and target link attributes
For information, virtual links can also be displayed.

The business model uses a particular instance of the object.

The list of hooks is described [in this document](/docs/core/modeler-code-hooks).

Exercise
--------

Make a template to allow orders to be entered via modeler
(An order is a link between a product and a customer)
