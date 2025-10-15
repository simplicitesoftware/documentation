---
sidebar_position: 140
title: Constraints
---

# Constraints 

**Constraints** are configuration elements that apply to a business object and allow the execution of business rules of limited complexity. They can be expressed schematically in pseudo-code as `If execution conditions are met THEN execute the impacts`.

Configuration
---------------------------

The conditions of execution can be of several types:
- **field:** a field of the business object __of boolean type__ must be true
- **expression:** an executed field "expression" of the constraint must return "true"
- **method:** a method in the business object script must return "true"

In addition to the execution condition, a constraint can also be granted to be executed only for certain user groups.

The impacts override the properties:
- of the object (copy, create, modify, etc.),
- of an attribute of the object ( editable, visible, mandatory, etc.),
- visibility of certain elements of the object (field area, view, action)

The value of the property affected by the impact will be the result of the "Expression" executed field. Generally, it will return a boolean (for visible, copyable, modifiable, etc. properties), but it can also be a value (for the default value of the attribute for example).


The order of the constraints and impacts is important: being executed in the configured order, one impact may overwrite another.

How it works : Back vs Front
---------------------------

Constraints, impacts and their executed fields are transformed into JavaScript code that will be executed:
- on the server in the case of a **back-end constraint**, by the Rhino runtime engine, just like the calculated fields
- on the browser in the case of a **front-end constraint**, by the user's browser JavaScript engine

A front-end constraint is **dynamic**, i.e. the user sees the impact on the form directly (a field that disappears/appears for example). However, it will only run **only** on the browser, it's all about user experience. For example, if you make a field mandatory via a front-end only constraint, a user could bypass the constraint by using the API layer or by disabling the constraint via the browser console.

A back-end constraint is a genuine business rule, it is executed on the server during the preparation of the form, but also during the validation of the data sent by the user. The user will have no way of bypassing the rule. A back-end constraint, however, is not dynamic.

That being said, the great advantage of constraints over business rules via code is that you can make them **both front and back**, to ensure secure business rules AND a dynamic user interface, without having to code these rules on both front and back-end scripts.

## Read more   

- [Creating a permission to override a property](/make/usersrights/permissions)
