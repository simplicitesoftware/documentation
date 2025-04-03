---
sidebar_position: 3
title: 2.3. Structuring forms
---

# Building the "Order Management" Training App : Structuring Forms - Field Areas

> Prerequisite : [The Supplier, Product, Client and Order objects are linked together](/tutorial/expanding/relations)

## What is a Field Area ?

A Field Area groups related fields in forms and lists for better organization... [Learn more](/make/userinterface/templating/fields-areas)

## Customizing the Order Business object form

### Creating a Field Area
To create a Field Area on the **Order** Business object, follow the steps below :

1. In the **Business objects > Business objects** menu, open **TrnOrder**
2. Click **Edit form** on the Business object's form (this will open the **template editor**)  
    ![](img/fieldarea/edit-form.png)
4. Hover over the template and click on the `+`  
    ![](img/fieldarea/field-area.png)
5. Click **Fields Area**

A **Field Area** is added to the object's template


### Adding a label and icon to the Field Area 

To add a label and icon to the **Field Area**, follow the steps below :

1. Hover over the previously created Field Area, click the *Edit* icon    
    ![](img/fieldarea/edit-field-area.png)
2. Fill in the Field Area information like so :
    - Label : **Product**
    - Icon code : **products** (*you can also use the icon picker to select an icon*)  
    ![](img/fieldarea/field-area-info.png)
3. Click **Save**

Rename the **TrnOrder-1** Field Area : 
- Label : **Order**
- Icon code : **box**

### Adding the Product fields to the "Product" Field Area

To add the Product fields to the "Product" **Field Area**, follow the steps below :

1. Hover over the **Product** id field
2. Click and hold the *move* icon   
    ![](img/fieldarea/move-id.png)
3. Drag & Drop the **Field** into the target **Product Field Area**

Repeat these steps for the remaining **Product** fields :  
    ![](img/fieldarea/product.png)


### Adding the Client fields to the "Client" Field Area

To add the Client fields to the "Client" **Field Area**, follow the steps below :

1. Add a new **Field Area** on the **Order** template
2. Fill in the Field Area information like so :
     - Label : **Client**
     - Icon code : **user**
3. Click **Save**
4. Move the **Client** fields into the target **Client Field Area**  
    ![](img/fieldarea/client.png)


### Structuring the Order Template

To structure to Order form, follow the steps below :

1. Hover over an empty area of the template
2. Click the `+` icon, and select **2 cols**   
    ![](img/fieldarea/empty.png)
3. Move the **Client** Field Area into the right column   
    ![](img/fieldarea/move-fieldarea.png)

Repeat these steps for the **Product** and **Order** Field Areas :  
    ![](img/fieldarea/order.png)