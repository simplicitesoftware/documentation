---
sidebar_position: 110
title: List Of Values
---

# List Of Values

## What is a List of Values (LOV)?
In **Simplicité**, a **List of Values (LOV)** defines the allowed values for an enumerated field.  
Each LOV is linked to one or more fields and provides a controlled set of codes whose translated labels are displayed to users based on their language.  
LOVs ensure data integrity and provide a standardized input mechanism across the application.  
Only the code is stored in the object’s table, while the corresponding translation is displayed in the UI.

**Example:**  
An LOV can be used to define a dropdown list for selecting:
- A **country**  
- A **status** (e.g., *Active / Inactive*)  
- Any other predefined option set



## How to create a List of Values?

### Creating a List of Values via the UI  
We recommend creating Lists of Values directly in **Simplicité’s template editor**:  

1. Create the enumerated field and save it.  
   ![](img/listofvalue/listofvaluet1.png)  
2. Re-edit the field configuration. An **Edit list** button appears.  
   ![](img/listofvalue/listofvaluet2.png)  
3. Enter codes and values, then reorder the list as needed.  
   ![](img/listofvalue/listofvaluet3.png)  

---

### Creating a List of Values via the "Business objects" menu  

1. Navigate to **Business objects > List of values**.  
2. Click on **Create** to add a new list of values.  
   ![](img/listofvalue/listofvalue1.png)  
3. Fill in the following fields:  
   - **List** – Unique identifier of the list of values.  
   - **Module** – Define the [module](/make/project/module) to which the LOV belongs.  
   - **Fields specific to state diagram display (if applicable)**:  
     - **State model display** – Choose how the state diagram bar will be displayed if the LOV is linked to a state model:  
       - *Breadcrumb*  
       - *Arrows*  
       - *Metro line*  
     - **Navbar options** – Select what is displayed on milestones:  
       - *Counter*: step counter  
       - *History Date*: Last transition date  
       - *History User*: User who performed the last transition  
     - **Optional Model** – (Optional) Link the LOV to an existing state diagram model.  
4. Save your List of Values.  

> **Reminder:** For each LOV, define the **codes** and their **order**. The application will automatically display the **translation of each code value** in the user's language.

![](img/listofvalue/listofvalue2.png)  

## Read more   

- [Creating a Field](/tutorial/getting-started/attribute)
- [Create a state model](/tutorial/expanding/states)
- [State Model](/make/businessprocess/state)
