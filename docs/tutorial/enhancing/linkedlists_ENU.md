---
sidebar_position: 13
title: 3.1. Creating virtual links
---

Linked lists
====================

The linked list object allows to dynamically change the possible values of an enumerated field according to the value of another enumerated field.

Rather than defining several enumeration type fields and making their visibility conditional on the value of another field, we configure a linked list.

This mechanism is present in the Simplicité platform. The fact that it is possible to present different **Search types** for an attribute depending on the **Field type** is made possible by a linked list.

The configuration is done as follows:
- Selection of an enumerated type field carrying the list of conditional values
- Selection of the list code that will trigger the display of a different list
- Selection of the target field that will carry the different lists of values
- Selection of the list of values that will be visible in the target field


Exercise
====================

- Create an enumerated field `Shipping Type` in the `TrnOrder` object with the values `Letter | Parcel`.
- Create an enumerated `Shipping Subtype` field in the `TrnOrder` object with the values `Green Letter | Letter with AC`.
- Create a list of values `TRNORDSHIPPINGSUBTYPE` with the values `Package 24h | Package 1 week`.
- Create the linked list object that displays the list of values `TRNORDSHIPPINGSUBTYPE` in the `Shipment Subtype` field of the `TrnOrder` object if the shipping type is `Package`.
