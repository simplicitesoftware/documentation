---
sidebar_position: 15
title: 3.4. Mapping
---

Mapping
=======

A mapping allows to link/copy fields by value (not by reference) from an object A to an object B.

In which case do we use a mapping?

- When the relationship between 2 objects is not possible or does not make sense
- When you want a copy by value
- To display a list of values without having to persist the data of the list in the database (service call for example)

An In mapping is used to filter the mapped object with the value of the source attribute.
An Out mapping is used to value the mapped attribute with the value of the source attribute.
An In/Out mapping should be configured when the incoming filter value is also the value to be copied.

The mapping uses a particular instance of the object.
The hook **initDataMapSelect** allows to override the standard behavior of the Datamap.

Exercise
--------

- Go to the AppStore and install the ISO Countries module and its dataset
- Create a `trnCliCountry` field in the `TrnClient` object
- Create a `TRNCOUNTRYDM` mapping that maps the `trnCliCountry` source field to the `isoCtyName` attribute of the ISOCountry object
