---
sidebar_position: 8
title: 2.8. Creating a home page
---

# Building the "Order Management" Training App : Creating a Home page

> Prerequisite : [The designer user has the TRN_SUPERADMIN responsibility](/tutorial/getting-started/user#designer-superadmin), the Order has [state model](/tutorial/expanding/states) and a [pivot table](/tutorial/expanding/pivot-table).

## What is a Home page ?

A View is a structured collection of components that define user interfaces, such as domain or group homepages. It can include predefined searches, crosstabs, custom UI components... [Learn more](/make/userinterface/views/home-page)

## Creating a Home page for the TRN_SUPERADMIN Group

To create a home page for the TRN_SUPERADMIN Group, follow the steps below :

1. In the **User interface > Views > Home page** menu, open **TrainingScope**
    > This home page was automatically created during the [Create module](/tutorial/getting-started/module) process.   

    ![](img/views/home-page-form.png)
2. Click ![](img/views/edit-view-btn.png)
3. Select the second template on the first row  
    ![](img/views/select-template.png)

### Adding the list of Pending Orders 

1. Click the *edit* icon on the first View area  
    ![](img/views/view-area-edit.png)
2. Fill in the View area information like so :
    - Type : **Preset search**
    - Title enabled : **Toggled**
    - Preset search name : **TrnOrder-Pending**
    - Object to search : **TrnOrder**
    - Additive SQL Filter : `trn_ord_state = 'P'`  
    ![](img/views/view-area-search.png)
3. Click **Save**

### Adding the "Orders per state" Pivot table

1. Click the *edit* icon on the second View area  
    ![](img/views/second-view-area-edit.png)
2. Fill in the View area information like so : 
    - Type : **Crosstable**
    - Title enabled : **Toggled**
    - Pivot table Name : **TrnOrderPt**  
    - Table : **Toggled**   
    ![](img/views/view-area-tc.png)
3. Click **Save**
4. Click **Close**

### Setting titles for the View areas

1. In the **View areas** panel linked to the View, open the Preset search  
    ![](img/views/open-preset-search.png)
2. In the **View area translate** list linked to the View area, click **Create**  
    ![](img/views/create-translate.png)
3. Fill in the View area translate fields like so :
    - Language : **English**
    - Translation : **Pending orders**
    ![](img/views/translate.png)
4. Click **Save & Close**

## Test the Home page with the usertest User

1. Clear the platform's cache and log in using *usertest*
    > For a detailed step-by-step, see : [Testing the User](/tutorial/getting-started/user#activating-and-testing-the-user)

:::tip[Success]
The Home page displays the "Pending orders" view and the "Orders per state" pivot table
    ![](img/views/success.png)
:::
