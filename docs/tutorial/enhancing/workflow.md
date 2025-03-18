---
sidebar_class_name: hidden
sidebar_position: 25
title: Business process
---

Business processes - workflow
====================

A process (sequence of screens) is a wizard designed to assist the user during a specific process.   
The process can be defined in the **Business Process/Business Process** menu.  
The process is configured by :  
    Type: input sequence or human task  
    Class: any Java class that modifies the default behaviour  
    Module: application module  

A process is made up of activities.  
When the process is created, 2 activities are generated: Begin and End.  
If these two activities did not exist or have been deleted, they must be created manually.  
Activities can be configured in the modeller by creating a specific diagram using the ModelProcess model.  
Activities have data which can be used to customise workflow behaviour.  
## Process permission
A process must be associated with the group in the "Process permission" tab in order to be instancied.
In the process permission, the "Cancel permission" option adds an "Cancel process" button to all the activities in the process.   
Each activity has its own permission, which can be configured in "Activity permission".  
In the permission for an activity, the "Cancel permission" option adds a "Skip" button to the activity screen.  


## Screen workflow
This is used to configure a specific screen sequence for short, complex processes with several actions to be executed sequentially.  
### Exercise
Create a screen sequence for creating a command.
* Name = TrnOrdCreate
* Code = TRNOC
* Module = Training

Enable permission.
Add the process to the domain.

Add 4 activities and link them together:
* Activity for selecting the customer who places the order
* Activity for selecting the supplier
* Activity for selecting the product in stock. Must be filtered by supplier selected before.
* Activity to create the order with predefined options

Enable permissions to activities.

## Human task
It allows to configure a long process wizard like for task tracking. The process may have a limited time to process as well as all activities. For our example, this allows you to add a process for order processing by the supplier with different statuses and processing times to be respected.


# Complex workflow

## Scripting
The default behaviour of the process can be replaced via hooks in the Java script of the business process.

## Conditional link / Routing
You can add a condition on the activity transition to configure conditional behaviour.  
Use `[DEFAULT]` to configure the default link.  

### Exercise
Display a message to the user if the chosen supplier does not have a product in stock using the preValidate hook.  
```java
	@Override
	public Message preValidate(ActivityFile context) {
		Message m = new Message();
		AppLog.info("DEBUG contex:"+context.toJSONObject(), getGrant());
		String step = context.getActivity().getStep();
		if("PRDSEL".equals(step)){
			ObjectDB prd = getGrant().getTmpObject("TrnProduct");
			synchronized(prd.getLock()){
				prd.setFieldFilter("trnProSupId",context.getDataValue("Field", "row_id"));
				prd.setFieldFilter("trnProStock", 0);
				List<String[]> rows = prd.search();
				if (Tool.isEmpty(rows)){
					AppLog.info("DEBUG empty", getGrant());
					m.raiseError("TRN_ERR_QTE_NEG");
					return m; 
				}
			} 
			
		}
		return super.preValidate(context);
	}
```

## Activity transition
You can add transitions between activities with a specific action (button).
For example, add a button to ignore the product selection.  

## Redirection
Using data from the Forward group, you can configure the redirection of the activity.
With a `Forward` `Page` you can, for example, add a redirection in the end activity to the new order you have just created.

Use a data parameter from the `Forward` group to use row_id in the url.

## Alerts
You can set up alerts by email, social, log ... in the Business Process/Alerts menu.
These alerts can be called up from the workflow to alert the user to updates, for example.
(This can also be useful in the status diagram).
Since version 5.3, it is advisable to use the **Notifications** module to alert users to data updates/creations/deletions.


### Exercise
Add a alert of type social,message to all customers whose orders have been cancelled.
