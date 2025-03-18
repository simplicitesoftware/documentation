---
sidebar_position: 50
title: Fields
---

# Fields

## What is a Field ?

If the object has a form, the attribute will be a field of this form. The configuration of the attribute allows to determine if it is mandatory or not, its type (text, number, single or multiple enumerated) etc.

Just like a business object, the field has a logical and physical name. The logical name identifies the attribute in the business rules, in the code and will follow the same syntactical conventions as Java variables. The physical name will be used to create a column in the business object's table. A field might not have a physical name, it's the case for non persisted calculated fields.

We will now introduce you to a fundamental aspect of the metamodel: the **object field**. One field can be used on several objects: a "comment" field, for instance, can be used on the 300 objects of the app. If the size of this field needs to be increased, to allow the input of longer comments, it can be done by changing the parameters of one single attribute, instead of changing the 300 comment fields of our 300 business objects. Furthermore, a field doesn't have to be linked to an object (storage field for a planned task, process filed, etc). In the metamodel this concept is represented by a **N/N link between the field and the business object** therefore introducing a link object. In Simplicité, the link object between a business object and a field is called **object field**. The object field object allows to **override** the parameters of the attribute (mandatory, translation, etc).

When a field is linked to an object via an object field, Simplicité will create a column in the business object's table.

## Technical key of the business object

From the definition of the physical object and attribute names, a table and a column are created in the database. In reality, as soon as a business object is created, 5 default columns are created, the **technical fields**. This can be verified by testing an SQL query via the "DB Access" shortcut as seen in the previous chapter:

| row\_id | created\_dt | created\_by | updated\_dt | updated\_by |
|---------|-------------|-------------|-------------|-------------|
|         |             |             |             |             |

The `row_id` column is what we call the **technical key**. It is generated and managed by the base, **so there is no need to create ID attributes** for your objects.

These 5 columns are not intended to be visible to the user.

## Functional key

The functional key is a set of fields defining the **functional** uniqueness of the business object. Thus, if we decide that the functional key of the customer is composed of his name and his first name, then we cannot have two customers with the same name + first name. 

**Every business object must have a functional key**. *If there is no key, Simplicité will only allow the creation of one record, which will have an  "empty" functional key. The second record, also having an "empty" functional key, will trigger an error because the functional key already exists.*

## Foreign key

A link between two objects is defined:
- physically, by **a column in the referencing object's table**, pointing to the `row_id` column of the referenced object
- in terms of configuration, by:
    - an attribute of type Internal ID/Technical Key (created automatically when the relationship is created), 
    - an object field with the following information :
        - the object referenced in "Joined object"
        - empty "referenced field"


## Joined fields

When there is a 1:N relationship between two objects, it becomes possible to add joined fields to the referring object. In our example, it is possible to display supplier information on the product form.

There are three ways to join fields: 
- when creating the relationship between two objects
- by using template editor
- by manually creating a correctly configured object field

The joined field is defined:
- physically, by the joined object
- in terms of configuration by an object field linking **the joined object's field** to **the referencing object**, and containing:
    - the referenced object in "linked object"
    - the foreign key used in "reference field"


## Calculated fields

The simplest type of customization is the calculated field. This is a field whose value will depend **on other fields in the same business object**. In some cases, it may be useful to join fields from related objects just to be used for calculated fields. For example, in the exercise, we will calculate the total price of the order by multiplying the product's price by the number of items ordered. So the product's price will need to be *part of the order for the value to be available*.

### Persistence

A calculated field can be persistent or not, depending on whether the field has a physical name or not. Indeed, if there is no physical name, then there is no associated column in the database, and Simplicité will calculate the value each time it is displayed. If there is a physical name, then Simplicité will store the result of the calculation in the database each time the business object is saved.

The upside of the non-persistent field is that there is no need to worry about keeping it up to date, in our example if the product price is updated, as it is calculated each time it is displayed.

The downside of non-persistent fields is precisely their calculation each display time it is displayed, which can be costly for displaying or exporting a list (especially if it is a complex calculation), but also their unavailability for data aggregation functionalities (sums in a list, group by in a list, cross-tabulations, etc.) because they are done by SQL queries.

### Simplicité Expressions

A certain number of configuration fields, such as the *Calculated Expression* field, are **Executed Fields**. Before using them, it is worth understanding how they work.

The contents of these executed fields are executed on the server side using the Rhino library, which is an implementation of JavaScript (ES6) written in Java. Rhino allows scripts to be executed in a Java application without first compiling them. However, since the scripts are executed on the server, they have access to the entire Simplicité Java API.

Prior to execution by Rhino, Simplicité also pre-processes the executed fields to transcribe Simplicité expressions (bracketed syntax) into JavaScript code.

Some expressions are available in all executed fields, others are only available in specific executed fields.

Be careful to differentiate the following elements:
- **exectured field:** field of some configuration objects that results in a Rhino execution and gives access to the whole Simplicité API
- **expression Simplicité:** Simplicité syntax transformed into javascript code to simplify the content of the executed fields
- **expression calculée:** this is an *executed field* of the "Attribute" configuration object that automatically calculates the value of the field