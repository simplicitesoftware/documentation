---
sidebar_class_name: hidden
sidebar_position: 14
title: Inheritance
---

Inheritance
====================

The concept of inheritance was discussed in the chapter **Links** through the different types of links (links or Inheritance) available in the modeler. 
It is possible to create an object configured as a child object in Simplicité. 

The characteristics of a child are :
- The object is in the same database table as its father (the object it inherits) but does not have the same logical name
- The object inherits all the fields of its father and to which we can add specific fields
- The object inherits the behavior of its father with possible overloading
- The object inherits the same constraints as its father
- The object does not inherit the rights of its father
- The object inherits the state diagram of its father but the state transitions must be enabled on the child object

One of the design patterns commonly used in Simplicité is to create an child object of `SimpleUser` (m_user table).
Thus it will be possible to delegate user management to an application administrator profile, to add fields specific to the user (business unit, department, etc.)

Exercise
====================

- Create a child object `TrnProductlowPrice` of the object `TrnProduct` with a price between 0 and 50 euros
- Add the object in the menu
- Display the list of products with a price lower than 50 euros on the home page `TrnHome`.
 
