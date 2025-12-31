---
sidebar_class_name: hidden
sidebar_position: 19
title: Treeviews
---

Tree views
==========

A tree is [a classic way to organize data](https://en.wikipedia.org/wiki/Tree_(data_structure)), which is visual
and a widely used paradigm, both in algorithmic and in UI. In data models, it is very common to have a series of
linked objects that you want to visualize in such way. Simplicité offers a **Treeview** component to make
it quick and easy to implement and visualize such structures.

The tree is defined by configuring:

- what kind of nodes it has
- how the connection between nodes is made

There are 3 ways of configuring the nodes:

| **Manual** | **Automatic (links only)** | **Automatic (all)** |
| ---------- | -------------------------- | ------------------- |
| The possible nodes and how they connect (through direct 1/N, N/N, **or indirect** relationships), is explicitly configured | The only configured node type is the root type. The platform will calculate connected nodes based on the data model relationships (1/N, N/N) | This mode operates like the previous one, but it additionally shows available actions, external objects, shortcuts, processes, and subtrees |

:::warning

Reflexive relationships are also traversed, but it is sometimes advisable to create objects dedicated to a given level:
objects without a parent first, then their children, otherwise all objects end up on the top object.

Recursive traversal can be expensive in performance when there are many levels and many branches (if the lists are paginated or not).

:::

Configure an automatic tree
---------------------------

- open the **Interface / Treeview**(V5) or **User interface/Tree views**(V6) menu
- create a new treeview
  - give it a name
  - set "Search child objects automatically" to `All` of `Links only`
  - save
- create a root node
  - level : `1`
  - parent node : none
  - business object : chose your root object
  - save
- clear the cache

To try the tree view, open the form for a root object, you'll find the tree view listed with the other actions.

Configure a manual tree
-----------------------

- create a tree view set to manual
- create a root node, like explained for the automatic tree (order `1`)
- create a connected node:
  - level : `1-1`
  - parent node : root node (level 1)
  - business object : chose connected object
  - joined field : chose the foreign key (on either one of the root object or the target object, depending on the direction of the relationship)

About levels
------------

The level of a child node should be either a single number for the root node, or `<level_of_parent_node>-<level_between_sibbling_nodes>`
for any other node. For complex trees, the idea is to end up with such structure:

- `1` : root node
  - `1-1` : first child object
    - `1-1-1` : first grand-child object
    - `1-1-2` : second grand-child object
  - `1-2` : second child object
- etc.

:::note

You cannot have more than one root node

:::

Exercise
--------

Create a **Manual** tree allowing to see the following:

- The root being a determinate order
  - the client being a child
    - all the client's orders being grand-children
  - the product being a child
    - the supplier being a grand-child
    - all the product's orders being grand-children
