---
sidebar_class_name: hidden
sidebar_position: 21
title: Timesheet
---

Timesheet
====================


Timesheets can be configured from the **Interface/Timesheet** menu in V5, **User Interface/Display Objects/Timesheet**. 
They can be used to enter up to 3 pieces of data (quantity, number of days, etc.) on an object for a given period.  
The parameters are built around a business object, which is an N,N relationship between 2 objects and includes dates.
The use case addressed is the monitoring of workload allocations, resource reservations, etc.

The configuration consists of naming the object, entering the foreign keys of the 2 objects and then defining the date fields for the period, and the input field(s) 1, 2, 3.

Once the parameters have been set, a **Generate** button is used to create the object which will store the data entered.

The timesheet object generated contains :
- tsh_month and tsh_year: the month and year
- tsh_total1, tsh_total2... depending on the number of input attributes in the timesheet  
- tsh_status when you want to add a status diagram to the timesheet  
- tsh_parent_id which identifies the assignment object linked to the timesheet. This enables a join to be made with the assignment resources.


The timesheet uses a particular instance of the object.  
The **initTimesheet**, **pre/postSaveTimesheet** hooks are used to override the standard timesheet behavior.  

<div class="warning">The input fields will only be used for the timesheet. You can add a numeric attribute which does not belong to the N,N relationship object.</div>


Exercise
====================
Once the order is in the Sent state, it is assigned to a user so that they can process the order (prepare the package to be sent, search for the product, send it, etc.). To record the processing time, the user in charge of the order is given the option of entering the processing time for the order.
Create a timesheet to record the time taken over a given period (e.g. a period of 1 week if there is an error in the stock and the product has to be reordered from the supplier).
- Create or use the object that inherits from the system user (SimpleUser)
- Create the `TrnOrderSimpleUser` object representing the assignment of a user to an order, with the following attributes:
	- Start date
	- End date
- Create an integer attribute without associating it with an existing object. Use it only as an input field in the timesheet.  
- Set up your timesheet `TrnTimeSheetAffect` then  
- clear the cache to see the icon appear on the order form or on the user form.
