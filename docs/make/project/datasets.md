---
sidebar_position: 30
title: Datasets
---

# Datasets

## What are Datasets ?

When installing a module, it is often useful to provide a test data set

To transfer data from one instance to another, the first method that comes to mind is to export the database or a sub-part of the database. This is **technical export**. The problem that can arise in **partial** technical exports is the following
- if an exported object A refers to a non-exported object B
- the SQL export of the table of object A will therefore contain the technical key of object B
- when importing on another instance, this technical key may not correspond at all to what object B was in the original instance.

This is why there is a **functional export**, which is an export that contains **only functional data**, not technical data such as IDs. When it is imported, Simplicité will *fetch the ID of the linked object from its functional key*, and make the link. For this to work, object A must of course contain all the fields of the functional key of object B to which it is linked, otherwise object B cannot be found to make the link.

An export per object is available on the lists as a designer (menu plus > export > export Simplicité), but to create a real dataset, the platform offers the possibility to generate them automatically. To do this, it is important to understand that the order of import is crucial. It is impossible to import products before suppliers. In cases of complex models (circular relationships), it is complicated for the platform to determine the import order. Some objects may not make sense in a dataset (for example, one may decide not to include historical data). It is for these reasons that it is necessary to configure this order manually.  

## How to create a Dataset ?

To create a dataset, follow the steps below: 

1. Go to the module you want to create a Dataset for, and navigate to the **Datasets** tab. Then click **Create**
![](img/datasets/dataset0.png)

1. Select a name for your dataset, and click **Save**
![](img/datasets/dataset1.png)

1. Now you can add your *Data Export Specifications*
   - Select the format to create your dataset file in using the **Export Format** and **Data Zip** fields (`xml` & `zip` by default)
    ![](img/datasets/dataset2.png)

   - You can use the **From/To** fields (available in extended section) to restrict your data export to a specific time-frame (created date of the records)
    ![](img/datasets/dataset3.png)

   - Use the **Objects (export order)** list to specify what objects you wanna export, and specify their order
    ![](img/datasets/dataset4.png)

     - Click the **Create on list** button
     - Select the object.s you want to export records from
     - Reorder them using either the handles or the **Reorder rows** option.
    ![](img/datasets/dataset5.png)
    
2. Now you can generate your dataset's file (using the export specifications) by clicking the **Generate Data** action.

### Using 6.2 or earlier

:::warning
From v6.3.0, datasets have been reworked to contain their declaration (not on objects anymore), if your dataset existed before, you can migrate the declared order by using the **Migrate export Order** action. This action is usable only if the *current dataset's object list is empty*
:::

![](img/datasets/dataset6.png)

Below is the way to declare your dataset if you have a version that preceeds the v6.3 (although we strongly advise you to stay up-to-date):

1. Add the order of export of each objects of your module.  
In case your application depends on different modules make sure that the global export order is consistent, as datasets relate to one module only.   
![](img/datasets/dataset7.png)   
1. Once all the export orders have been completed, you can generate your dataset.   
Go to the Project menu and click on Modules (you can use the menu's search bar), open your module and click on Export data.   
![](img/datasets/dataset8.png)   
