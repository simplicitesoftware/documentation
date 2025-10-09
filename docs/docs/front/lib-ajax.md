---
sidebar_position: 35
title: Ajax Library
---

Ajax Library
============

<div class="warning">
    This lesson is a part of the <b>Frontend Development</b> category, which is meant to guide you through the frontend development within Simplicité. Thus it might be a bit longer and more verbosed than other lessons you will find in the <b>Simplicité Configuration Object</b> category.
</div>

This document provides an overview of the Ajax Library, detailing its core methods and functions, while also explaining how the Simplicité solution is structured and operates within the Model-View-Controller (MVC) architecture.

# Overview

## MVC architecture

Simplicité uses the **Model-View-Controller** (MVC) architecture, which organizes an application into three interconnected components: the **Model** (handles data and business logic), the **View** (manages the user interface), and the **Controller** (coordinates interactions between the Model and View). This separation of concerns enhances modularity, simplifies maintenance, and makes the application more flexible for updates and scaling.

Within your Simplicité's instances and applications, the MVC components are referenced as:
- **Controller** `$ui`: Represents the front-end engine instance, `Simplicité.UI.Engine`. This acts as the *primary Controller* in the MVC architecture, orchestrating interactions between the *Model* and *View*, loading components, and handling the application's core logic.
- **Model** `$ui.getApp()` (or `$app`): Used to access the *backend data handler*. This is the part of the architecture responsible for managing *data retrieval* and *interaction* through the `Simplicité.Ajax` class.
- **View** `$ui.view.*` (or `$view`): Provides access to and control over the *UI components* and *rendering logic*. This layer is responsible for what the user *sees and interacts with*, utilizing classes under `Simplicité.UI.View.*` to define and manipulate the user interface.

### Model

The **Model** in the Simplicité solution is responsible for *handling the data and business logic* of the application. It serves as the backbone of the system, managing interactions with the database and ensuring the integrity of the data. In Simplicité's case, the Model is implemented through the `Simplicité.Ajax` library, which acts as the *bridge* between the *backend* and the *front-end*. This component ensures that data is retrieved, processed, and delivered in a structured way, providing a consistent foundation for the application’s operations. By centralizing data handling, the Model enables smooth integration with the other layers, fostering a reliable and scalable system.

### View

The **View** is the part of the architecture that *manages the user interface* and *presentation layer*. It is implemented using the `Simplicité.UI.View.*` classes, which handle the rendering and display of UI components. The View *translates* the data provided by the *Model* into a *user-friendly format*, allowing users to interact with the application effortlessly. In Simplicité, this layer is designed to be **highly customizable**, enabling developers to modify styles and scripts to match specific requirements. By focusing solely on presentation, the View ensures a clear separation of concerns, making it easier to adapt and enhance the user experience.

### Controller

The **Controller** is the *central orchestrator* of the Simplicité solution, managing the interaction between the Model and the View. It is implemented through the `Simplicité.UI.Engine`, which acts as the primary UI controller. The Controller *loads components*, *calls the Ajax services* to fetch or update data, and ensures that the View *accurately reflects* the *current state* of the *application*. Additionally, it manages navigation, workflows, and other application-specific interactions. This layer provides flexibility and control, allowing developers to implement hooks, override default behaviors, and integrate custom libraries. The Controller’s role is essential for maintaining responsiveness and ensuring smooth communication between the system's layers.

## Global

Simplicité allows you to also communicate only with specific parts of it --some like `$ui`, `$app` or `$view` have been quickly explained before-- but there are other that are important to be aware of in order to enhance your capacities with Simplicité's development.

* [`$ui`](https://platform.simplicite.io/current/jsdoc/global.html#$ui) represents the **UI Singleton** --of type `Simplicite.UI.Engine`-- that basically is the *Main UI Controller* with an abstract view to display components.

* [`$app`](https://platform.simplicite.io/current/jsdoc/global.html#$app) represents the **Ajax Service** --of type `Simplicite.Application`-- that behaves like the *Main Model* for your current Simplicité instance/session.

* [`$view`](https://platform.simplicite.io/current/jsdoc/global.html#$view) represents the **View Engine** --of type `Simplicite.UI.View`-- which is the *Main View* that must be loaded by the *Model* in order to access and use display controls. It implements the UI interfaces, and interacts with the *Controller* to access data.

* [`$grant`](https://platform.simplicite.io/current/jsdoc/global.html#$grant) represent the **User Rights** --of type `Simplicite.Ajax.Grant`-- and allows to access and possibly manipulate the instance through the rights of the current user.

* [`$nav`](https://platform.simplicite.io/current/jsdoc/global.html#$nav) represents the **Navigation Controller** --of type `Simplicite.UI.Navigator`-- thanks to which you can possibly navigate through your Simplicité application through the *Navigation* tool.

* [`$root`](https://platform.simplicite.io/current/jsdoc/global.html#$root) represents the **Server Root URL** --of type `String`-- through which you can get and access the static resources of your Simplicité instance/session.

* [`$tools`](https://platform.simplicite.io/current/jsdoc/global.html#$tools) represents the **Bootstrap Tools** --of type `Simplicite.UI.View`-- that allows you to use a bunch of Bootstrap specific methods and workflows (for example BootstrapWebPages for external pages, or bootstrap's specific widgets).

*[`$T`](https://platform.simplicite.io/current/jsdoc/global.html#$T) represents the **Translated text Shorthand** --method taking `TEXT <string>` and `plural <boolean>` as parameters-- that allows to quickly translate any given code.

Most of those are also accessible directly from the each other, even tho it is mainly from `$ui` as it acts as the **Controller**:

| Shortcut | Access through `$ui`            |
|----------|---------------------------------|
| $app     | $ui.app                         |
| $view    | $ui.view                        |
| $grant   | $ui.grant (or $app.grant)       |
| $nav     | $ui.nav                         |
| $tools   | $ui.view.tools (or $view.tools) |

# Accessing Simplicité's session

Through the **javascript** resource of your external objects, you can easily access every variable and component from your Simplicité's application. Below is a breakdown of some important functions to do so:

| Command                         | Returns                      | Description                                                                                                |
|---------------------------------|------------------------------|------------------------------------------------------------------------------------------------------------|
| getApp()                        | Simplicite.Ajax instance     | Returns the current Simplicite session (Ajax).                                                             |
| getView(cbk, name, params)      | Promise - Result: Object     | Loads the view's definition from its **name**.                                                             |
| getGrant()                      | Simplicite.Ajax.Grant        | Returns the current user's rights & other infos.                                                           |
| getUserInfo(cbk, login, params) | Promise - Result: Object     | Returns fewer data about the current user (login, name, email, picture) from his **login**.                |
| getBusinessObject(obj, inst)    | Simplicite.UI.BusinessObject | Gets a new business object, from the name of the object **obj** and (optional) the instance name **inst**. |

# Manipulating Business Objects

As they are a core feature of Simplicité, it is important to understand some of the ways to manipulate them (getting, creating, etc) within your javascript code, for that you can use many methods on the `Simplicite.Ajax.BusinessObject` class, but below are the most useful ones to acknowledge:

| Command                             | Returns                              | Description                                                                                                |
|-------------------------------------|--------------------------------------|------------------------------------------------------------------------------------------------------------|
| create(cbk, items, params)          | void                                 | Creates and loads a new item that can be customized with **params**.                                       |
| getFields()                         | Array of Simplicite.Ajax.ObjectField | Returns an array of all the object's *fields*                                                              |
| getField(name, id)                  | Simplicite.Ajax.ObjectField          | Returns the field with **name** and **id** from the *fields array* in the *meta-data*.                     |
| getCount(cbk, filters, params)      | integer                              | Returns the count of *rows* with the **filters** to be applied (current ones if absent).                   |
| crosstab(cbk, cbt, filters, params) | void                                 | Loads cross table data from the **cbt** crosstab, for the given **filters**.                               |
| getForCreate(cbk, params)           | void                                 | Loads default item (`BusinessObject.item`) for creation with optional **params** to adress specific needs. |

> ***Note:*** Getting a new Business Object in your javascript should be done directly using the `Simplicite.Ajax.getBusinessObject()` function instead of the constructor.

The following outlines the standard structure of *Business Objects* and summarizes their key members:

| Attribute | Description                                                                                                                                |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------|
| count     | Current search result count, indicates how much instances of your object are contained in the search.                                      |
| filters   | Current search filters, `filters["filterName"]` or `filters.filterName` to access a specific filter's value.                               |
| item      | Currently loaded item, this is often used to refer a specific instance of your Business Object, either for creation or any update actions. |
| list      | Current search result array of items, usually contains all the instances of your object.                                                   |
| metadata  | Current meta data: *name* is the object name, *instance* is the object instance name, *fields* is the fields' definition array, ...        |

> ***Reminder:*** Always perform manipulations of your *Business Objects* within a `search()` method in order to ensure you correctyl are accessing and manipulating your objects with all the needed data.

When using any instance of your Business Object, note that you can access the value of any field simply calling the name of it, indeed as instances are typed as `[object Object]`, if you want to access a field labeled `fieldName` from your *Business Object instance* named `obj`, then you just have to use `let objfField = obj.fieldName` and thus objField won't be of type `ObjectField` but of the actual value type (`string`, `int`, ...).

# Displaying Specific Elements

Within the `WORK` part of SImplicité's UI are displayable mutliple items when navigating the solution, below is a list of functions that can be used to display specific elements in the area

| Command                             | Returns                      | Description                                                                                                              |
|-------------------------------------|------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| displayForm(ctn, obj, p, cbk)       | void                         | Front hook displaying the **form** of the `obj` with specified `p` parameters, optional callback  `cbk` and container `ctn`. |
| displayList(ctn, obj, p, cbk)       | void                         | Front hook displaying the **list** of the `obj` with specified `p` parameters, optional callback  `cbk` and container `ctn`. |
| displaySearch(ctn, obj, p, cbk)     | void                         | Front hook displaying the **search form** of the `obj` with specified `p` parameters, optional callback  `cbk` and container `ctn`. |

