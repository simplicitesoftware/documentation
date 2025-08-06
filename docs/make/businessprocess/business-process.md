---
sidebar_position: 10
title: Business process
---

Business process 
=====================

## What is a Business process ?

This document describes the business process configuration to create a business process "Screen workflow".

Note that simple business process can only rely on configuration.

You **need** to implement one or several hooks if you want to apply out some dynamic business logic that goes beyond what can be configured.

## How to create a Business process "Screen workflow" ?

### Create a business process 

- Name: unique name required  
- Code: internal code required  
- Type: Screen workflow  
- Source code: any java class which modify default behavior  
- Module: application module  

When the process is created 2 activities are generated: Begin and End.
If these two activities did not exist or were removed, they must be created manually.
Save without exit.

> **Note**:
>
> The other fields are only for long processes.

### Add process permission 

Go to Permission process tab to add rights to the process:

Read only: ability to view activities  
Instantiation: possibility to start the process  
Cancel process: possibility to stop the process  


### Put a process in a domain

Check that you can select your process in a domain form.

### Translate the business process 

Add translations to your business process.  
This translation will appear on all the activities in your process.

### Create activities

An activity wizard exists to create activities:

- By Create activity button on the business process form
- Either by right-clicking on the model diagram

To create an activity, enter the following information:

- A step code: usually prefixed by the code process
- A name: a label that describes the activity for the modeler
- One type of activity: New, Update, Delete, Search, Select single, Select multiple,Service call or a External page (others are for Human tasks process)
- Reversibility: to block or not a step backwards in the process
- User dialog: yes/no if it is set to no, invoke methods of the process
- A module

Other time related properties are used to alert if the activity is longer (/shorter).

###  Translate activity 

This step is to give a label in each language installed and a short help to the activity.  
In addition, the translations appear on the left-hand side of the screen, enabling the user to track the progress of their process and view past and current activities.  

### Grant activity to workflow group

This step will define the access rights to the activity:

- Read only
- Write permission: In a wizard, this means to enter and click Next to confirm the activity
- Cancel permission: In a wizard, this means click Skip without validation

### Create transitions

This step allows you to create all possible transitions to and from the activity.

### Activity data

This last step of the wizard allows you to define properties for this activity:

Those who are checked will be kept, others are optional and can be removed
If you do not use the wizard, click on build activities button to generate optional and mandatory activity data.

Everything between "_" must be changed. 
Everything between _required_ must be entered.

- Check and enter the line: Object | Name | MyObject
Other data will not be used and can stay unchecked
> **Note**:
>
> a "New" type activity, "update", "search" … still needs to know which object you are working on

- Object.Name: name of business object For information, other parameters are:
- Next.Step: the following activity name to force the routing
- Return.Code: return value of the activity in case of routing between different transitions.
- Field : value of the object field
Activity data are accessible by code or syntax [Step.Group.Data]

Explanation of others data in a "Select single" type:

- Constraint | Mandatory | false. If we want to force the user to select at least one value must be “true”
- Field.row_id: contains the list of row_id that have been selected by the user.
- Filter.`<objfield>`. This allows you to filter a displayed selection list
- Search.Spec: Allows to add a SQL filter to the list

Specific data for "Service call" activity: 
- Service.Mode = Synch or Asynch
- Service.Name = name of the service to call (java method of the process)

### Activity link

To create a link between two activities:

- By the Business Process menu / Activity link / Create button
- Or via the process diagram, drawing an arrow between the two considered activities (which pre-populates the form of creation).

An activity link is made of different properties:

- Process
- From Step : source activity
- To Step : target activity
- Optional name
- Action: you can add an action button on the activity by combining a transition to Action
- Condition optional if there is only one way to get out of the original activity. Required to perform routing between multiple paths, the value of the condition must be equal to the given “Return.Code” of the source activity, the [DEFAULT] can be used to define a default path if no other conditions are valid.
- Callback method : callback during the transition (java script method in the process)
- Alert name : to add an alert (a server trace or email a user) on transition
- Module
