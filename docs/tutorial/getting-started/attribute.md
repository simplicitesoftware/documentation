---
sidebar_position: 3
title: 1.3. Creating a Field
---

# Building the "Order Management" Training App : Creating a Field

> Prerequisite : [A business object (TrnSupplier) must be created before starting this tutorial](/tutorial/getting-started/object)

## What is a Field ?

In Simplicité, fields are configurable attributes of business objects (mandatory, type, etc.). They have a logical name (used in code) and a physical name (for database columns). When linked to an object, it creates a database column and allows parameter overrides... [Learn more](/make/businessobjects/fields)

## Creating a Field

To create a field, follow the steps below :

1. Click **Edit form** on the Business object's form (this will open the **template editor**)  
    ![](img/attribute/edit-form.png)
	> The template editor is also available via the Modeler, for more information see the [Accessing the template editor via the Modeler](/make/businessobjects/business-objects#creation-assistant-via-the-modeler)
2. Select the first **Template**    
    ![](img/attribute/template.png)
3. Hover over the empty **Field Area** and click on the `+`
    > For more information about Field Areas, see [Field Area](/make/userinterface/templating/fields-areas)

    ![](img/attribute/field-area.png)
    
4. Click **Field**  
    ![](img/attribute/add-field.png)
5. Click **+ Create field**, and select **Short text**  
    ![](img/attribute/short-text.png)
6. Fill in the Field fields like so :
    - Label : **Code**
    - Logical name : **trnSupCode** *should be auto-completed* 
    - Physical name : **trn_sup_code** *should be auto-completed*
    - Functional key : **Toggled**
    - Required : **Toggled**  
        ![](img/attribute/create-field.png)
7. Click **Save**

:::tip[Success]
The <b>trnSupCode</b> Field has been added to the <b>TrnSupplier</b> Business object and the template has a <b>Code</b> input visible on it
    ![](img/attribute/success.png)
:::