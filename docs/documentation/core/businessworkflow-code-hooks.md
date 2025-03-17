---
sidebar_position: 40
title: Businessworkflow code hooks
---

Business workflow hooks
=======================

This document describes the business process hooks that can be implemented to put some **additional** business logic
to your business process.

None of these hooks **needs** to be implemented, simple business process can only rely on configuration.

You **need** to implement one or several of these hooks if you want to apply out some dynamic business logic that goes beyond what can be configured.

Hooks are very powerful as you can write any needed code, but you need to be careful on the choice of the hook to put your logic in.
The choice depends on the nature of the considered business logic.

> **Note**:
>
> Some of the examples below are given using the **Rhino** scripting language.
> In such Rhino scripts the `this` variable correspond to the business process itself,
> it must be **explicitly** used (it can't be implicit like in Java code).

> The **Rhino**-only code examples can easily be transposed to equivalent **Java** code.
> Some examples are provided both in Rhino and Java so as you can see the syntax differences.


Process definition and right-related hooks
-----------------------------------------

### Post instanciate hook

The `postInstanciate` hook is called **once** when the process definition is loaded.  
It can therefore be used to modify the **static** process definition of each instance.

By static we mean the definition settings that will remain the same all along  
the user session (i.e. not the dynamic ones that may be updated in other hooks)  

For instance it can be used to:  

- Change some related object definition: field behaviour (visibility, updatability, ...) depending on user's rights 
- Change some activities definition

Example:
**Java**

```Java
@Override
public void postInstantiate(Grant g) {
	// Get the instance used by the process
	ObjectDB o = g.getProcessObject("MyObject");
	// Extend the form by default
	o.setMoreOnForm(false);

	// Show/Hide some fields
	o.getField("myField").setVisibility(ObjectField.VIS_HIDDEN);
	o.getField("myOtherField").setVisibility(ObjectField.VIS_BOTH);
	
	// Limit the search to employees
	if (g.hasResponsibility("EMPLOYEE"))
		o.setDefaultSearchSpec("(t.amount > 1000 and t.enabled='1')");
	
	super.postInstantiate(g);
}
```

<details>
<summary>Rhino JavaScript equivalent</summary>

```javascript
MyProcess.postInstantiate = function(grant) {  

	// Get the instance used by the process
	var o = grant.getProcessObject("MyObject");
	// Extend the form by default
	o.setMoreOnForm(false);

	// Show/Hide some fields
	o.getField("myField").setVisibility(ObjectField.VIS_HIDDEN);
	o.getField("myOtherField").setVisibility(ObjectField.VIS_BOTH);

	// Limit the search to employees
	if (this.getGrant().hasReponsibility("EMPLOYEE"))
		o.setDefaultSearchSpec("(t.amount > 1000 and t.enabled='1')");
};
```
</details>

### Pre/Post activate hook

The `preActivate`/ `postActivate` hook are called before/after the process is activated.  
Activate a process auto-validate the `BEGIN` activity and returns the first user activity.

Example:
**Java**

```Java
@Override
public Message preActivate() {
	// Activity definition (Data, Translation...)
	Activity a = getActivity("ACTIVITY_CODE");  
	AppLog.info("activity = " + a.toString(),getGrant());
	// Activity instance in this process
	ActivityFile context = getContext(a);
	AppLog.info("context = " + context.toString(),getGrant());
	// Force a filter on a search
	context.setDataFile("Filter", "cliType", "someValue");
	// Force a value on a form
	context.setDataFile("Field", "cliType", "someValue");
	//...
	return super.preActivate();
}
```

<details>
<summary>Rhino JavaScript equivalent</summary>

```javascript
MyProcess.preActivate = function() {  
	// Activity definition (Data, Translation...)
	var a = this.getActivity("ACTIVITY_CODE");  
	console.log("activity = " + a.toString());
	// Activity instance in this process
	var context = getContext(a);
	console.log("context = " + context.toString());
	// Force a filter on a search
	context.setDataFile("Filter", "cliType", "someValue");
	// Force a value on a form
	context.setDataFile("Field", "cliType", "someValue");
	...
};
```
</details>

### Pre/Post lock hook

The `preLock`/`postLock` hook are called before/after one activity is locked.
The lock means that only one user is allowed to validate the activity, the hooks are call before the activity is displayed/validated.

- preLock: can return a Message with error to cancel the lock (specific permission)
- lock: internal lock in memory or in database
- postLock: can change the activity context before UI displaying

Example:
**Java**

```Java
@Override
public Message preLock(ActivityFile context) {
	// Access denied to big amount for simple employee
	String amount = context.getDataValue("Field", "demAmount");
	if (!Tool.isEmpty(amount) && Integer.parseInt(amount)>10000 && getGrant().hasResponsibility("EMPLOYEE")) {
		Message m = new Message();
		m.raiseError("ERR_BIG_AMOUNT_DENIED");
		return m;
	}
	return super.preLock(context);
}
@Override
public void postLock(ActivityFile context) {
	// Force a value
	if (context.getActivity().getStep().equals("STEP-1"))
		context.setDataFile("Field", "cliType", "someValue");
	super.postLock(context);
}
```

<details>
<summary>Rhino JavaScript equivalent</summary>

```javascript
MyProcess.preLock = function(context) {
	// Access denied to big amount for simple employee
	var a = this.getActivity("STEP-DEMAND");
	var amount = this.getContext(a).getDataValue("Field", "demAmount");
	if (amount && parseInt(amount)>10000 && this.getGrant().hasResponsibility("EMPLOYEE")) {
		var m = new Message();
		m.raiseError("ERR_BIG_AMOUNT_DENIED");
		return m;
	}
};
MyProcess.postLock = function(context) {  
	// Force a value
	if (context.getActivity().getStep()=="STEP-1")
		context.setDataFile("Field", "cliType", "someValue");
};
```
</details>

### Pre/Post validate hook

The `preValidate`/ `postValidate` hook are called before/after one activity is validated.  
Allows to add business rules before/after the activity is validated (on UI `next` button is clicked).

- Change the activity result (the return code to be used in transition)
- Check the fields and return errors

Example:

**Java**

```Java
@Override
public Message preValidate(ActivityFile context) {
	// At the client step
	String step = context.getActivity().getStep();  
	if ("STEP-CLIENT".equals(step)) {  
		// Check if the name is set
		String name = context.getDataValue("Field", "cliName");  
		if (Tool.isEmpty(name)) {
			Message m = new Message();
			m.raiseError("ERR_CLIENT_NAME");
			return m;
		}
		// Change the activity result if the address is empty
		String adresseId = context.getDataValue("Field", "cliAdresseFK");  
		if (Tool.isEmpty(adresseId)) {  
			AppLog.info("empty address", getGrant());
			// EmptyAddress is set in a transition condition
			context.setDataFile("Return", "Code", "EmptyAddress");  
		}  
	} 
		return super.preValidate(context);
}
```

<details>
<summary>Rhino JavaScript equivalent</summary>

```javascript
MyProcess.preValidate = function(context) {  
	// At the client step
	var step = context.getActivity().getStep();  
	if (step=="STEP-CLIENT") {  
		// Check if the name is set
		var name = context.getDataValue("Field", "cliName");  
		if (!name) {
			var m = new Message();
			m.raiseError("ERR_CLIENT_NAME");
			return m;
		}
		// Change the activity result if the address is empty
		var adresseId = context.getDataValue("Field", "cliAdresseFK");  
		if (!adresseId || adresseId=="") {  
			console.log("empty address");
			// EmptyAddress is set in a transition condition
			context.setDataFile("Return", "Code", "EmptyAddress");  
		}  
	} 
};
```
</details>

### Pre/Post abandon hook

The `preAbandon` /`postAbandon` hooks are called  when the process is abandoned.  

Allows to add specific business rules (before/after) in the case the process is abandoned.  

<!-- **TO BE COMPLETED** -->

Example:
- Change the forward page
- Delete the created object or return an error
- Cancel the abandon

**Java**

```Java
@Override
public Message preAbandon() {
	// Rewrite the Forward of the last activity
	String url = HTMLTool.getListURL("objDemand", "the_objDemand", null);
	ActivityFile end = getContext(getEnd());
	if (!Tool.isEmpty(end)) end.setDataFile("Forward", "Page", url);
	// Delete the created object during the workflow
	String id = getContext(this.getActivity("MY-STEP-CREATE")).getDataValue("Field", "row_id");
	if (Tool.isEmpty(id) && !id.equals(ObjectField.DEFAULT_ROW_ID)) {
		ObjectDB o = this.getGrant().getTmpObject("objDemand");
		o.resetFilters();
		if (o.select(id)) o.del();
	}
	
	// Return a Message to cancel the abandon ?
	if (someRule) {
		Message m = new Message();
		m.raiseError("MY_ERROR");
		return m;
	}
	return super.preAbandon();// continue
}
```

<details>
<summary>Rhino JavaScript equivalent</summary>

```javascript
MyProcess.preAbandon = function() {

	// Rewrite the Forward of the last activity
	var url = HTMLTool.getListURL("objDemand", "the_objDemand", true);
	var end = this.getContext(this.getEnd());
	if (end) end.setDataFile("Forward", "Page", url);

	// Delete the created object during the workflow
	var id = this.getContext(this.getActivity("MY-STEP-CREATE")).getDataValue("Field", "row_id");
	if (id && id!=ObjectDield.DEFAULT_ROW_ID) {
		var o = this.getGrant().getTmpObject("objDemand");
		o.resetFilters();
		if (o.select(id)) o.del();
	}
	
	// Return a Message to cancel the abandon ?
	if (someRule) {
		var m = new Message();
		m.raiseError("MY_ERROR");
		return m;
	}
	return null; // continue
};
```
</details>

### Pre/Post cancel hook  

The `preCancel`/`postCancel` hook are called  when the activity is canceled.  
Allows to add specific business rules (before/after) in the case the activity is canceled.  

Example:

**Java**

```Java
@Override
public Message preCancel(ActivityFile context) {
	String step = context.getActivity().getStep();  
	// Billing step is canceled ?
	if ("STEP-BILLING".equals(step)) {
		// Force the status of the demand step
		Activity a = getActivity("STEP-DEMAND");
		getContext(a).setDataFile("Field", "demStatus", "UNPAID");
	}
	return super.preCancel(context);
}
```

<details>
<summary>Rhino JavaScript equivalent</summary>

```javascript
MyProcess.preCancel = function(context) {  
	var step = context.getActivity().getStep();  
	// Billing step is canceled ?
	if (step=="STEP-BILLING") {
		// Force the status of the demand step
		var a = this.getActivity("STEP-DEMAND");
		this.getContext(a).setDataFile("Field", "demStatus", "UNPAID");
	}
};
```
</details>

### Pre/Post unlock hook

The `preUnlock`/ `postUnlock` hook is called when the activity is unlocked by user.

Example:
**Java**

```Java
@Override
public Message preUnlock(ActivityFile context) {
	String step = context.getActivity().getStep();  
	if ("STEP-DEMAND".equals(step)) {
		// Reset fields
		context.setDataFile("Field", "demAmount", "");
		context.setDataFile("Field", "demNote", "");
	}
	return super.preUnlock(context);
}

```
<details>
<summary>Rhino JavaScript equivalent</summary>

```javascript
MyProcess.preUnlock = function(context) {  
	var step = context.getActivity().getStep();  
	if (step=="STEP-DEMAND") {
		// Reset fields
		context.setDataFile("Field", "demAmount", "");
		context.setDataFile("Field", "demNote", "");
	}
};
```
</details>

### Pre/Post terminate hook

The `preTerminate`/ `postTerminate` hooks is called when the process is terminated = END activity is reached.

Example:

**Java**

```Java
@Override
public void postTerminate() {
	// Client ID
	Activity a = this.getActivity("STEP-CLIENT");
	String clientId = getContext(a).getDataValue("Field", "row_id");
	ObjectDB cli = this.getGrant().getProcessObject("MyClient");
	if (cli.select(clientId)) {
		// Invoke a scripted action to send email
		try {
			cli.invokeAction("sendEmailToClient");
		} catch (ActionException e) {
			AppLog.error(e, getGrant());
		}
	}
	super.postTerminate();
}
```

<details>
<summary>Rhino JavaScript equivalent</summary>

```javascript
MyProcess.postTerminate = function() {  
	// Client ID
	var a = this.getActivity("STEP-CLIENT");
	var clientId = this.getContext(a).getDataValue("Field", "row_id");
	var cli = this.getGrant().getProcessObject("MyClient");
	if (cli.select(clientId)) {
		// Invoke a scripted action to send email
		cli.invokeAction("sendEmailToClient");
	}
};
```
</details>
