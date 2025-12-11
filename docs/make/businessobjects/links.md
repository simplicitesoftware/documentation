---
sidebar_position: 70
title: Links
---

# Links

## What is a Link ?

The definition of a 1:N relationship allows two business objects to be linked together.
Taking the example of the supplier and the product, there is 1 supplier for N products.
This section presents what the Simplicité engine does with the configuration of objects, attributes and relationships.

## Foreign key

A link between two objects is defined:

- physically, by **a column in the referencing object's table**, pointing to the `row_id` column of the referenced object
- in terms of configuration, by:
  - an attribute of type Internal ID/Technical Key (created automatically when the relationship is created), 
  - an object field with the following information :
    - the object referenced in "Joined object"
    - empty "referenced field"

## Joined fields

When there is a 1:N relationship between two objects, it becomes possible to add joined fields to the referring object. 
In our example, it is possible to display supplier information on the product form.

There are three ways to join fields:

- when creating the relationship between two objects
- by using template editor
- by manually creating a correctly configured object field

The joined field is defined:

- physically, by the joined object
- in terms of configuration by an object field linking **the joined object's field** to **the referencing object**, and containing:
  - the referenced object in "linked object"
  - the foreign key used in "reference field"

## Virtual link

A virtual link enables you to access a business object's data without having to go though the model.

This works by creating a "virtual" link between two business objects.
This link doesn't come with a physical column, therefore no foreign key is created in the child object's table.
The data is retrieved through an SQL query configured on the link between the two objects.

## Copy cascade

This setting allows you to copy descendant dependencies recursively.

However, there are constraints:

- Objects linked in (0,n) relationships must be identified by their parents: each foreign key must be a functional key;
  otherwise, duplication is impossible without creating a duplicate.
- Only downward (0,n) relationships (tree-like) can be traversed;
  it will stop at the (n,n) relationship in a cascading copy (e.g., copying a user will copy their responsibilities but not their groups).

For other specific copying scenarios, the copy must be performed code-wise in the `postCreate` hook, testing the `isCopied()`.
