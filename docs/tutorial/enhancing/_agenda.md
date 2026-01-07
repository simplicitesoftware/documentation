---
sidebar_class_name: hidden
sidebar_position: 17
title: Agenda
---

Agenda
=======

Setting up a calendar view is done via the **Interface/Agenda** V5 menu or **User interface/Objects rendering/Agendas**
or from the **Agendas** tab on a business object form.

Setting up a calendar is possible as soon as the object you want to display in calendar view has one or more dates in its configuration.

Simplicité uses the opensource [FullCalendar component](https://fullcalendar.io) for this calendar view.

For information about the version and libraries used, see the **FULLCALENDAR_LIBS** and **FULLCALENDAR_VERSION** system settings.
V3,V4 and V5 versions of FullCalendar are integrated.

The calendar uses a particular instance of the object.
The **initAgenda** hook is used to override the standard calendar behavior.

Exercise
--------

- Configure a calendar view of all orders.
- Create an external object that displays the calendar in the menu.
