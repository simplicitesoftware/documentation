---
sidebar_class_name: hidden
sidebar_position: 40
title: Instances
---

Instances and object cache
====================

In order to manipulate business objects correctly via the Java API, it is necessary to understand the notion of object instance, and by extension to have a schematic idea of how the caching system works in Simplicité. It also helps to understand what the different cache flush actions are and when they are needed.

To determine the behavior of an object, unlike a traditional Java application where all the behavior is coded and compiled in bytecode, Simplicité interprets the configuration that is stored in a database. The construction of an object (object load) involves complex mechanisms: inheritance, recursion, attribute definitions, numerous SQL calls, templates, etc. Since objects are stable in production, Simplicité builds them only once and stores the result of this construction in the core cache (=server cache). **The core cache therefore stores in memory the definition part of the object (fields, template, table name), it is a snapshot version of the configuration.**

Each time a user manipulates an object, he will need to instantiate it, and load the necessary information into it, in the same way that a java class is loaded with specific data. To do this, a clone of the object loaded in the core cache is positioned in the user's session, this is called an instance of the object. The instance is persistent in the user's session, which is why, for example, if you do a search on an object, navigate elsewhere in the application and return to the list, the search is still active. **The session therefore stores instances of the object's definition, cloned, and the dynamic part of the object (data, search, current parameters, etc.).**

When the object, inheriting from `ObjectDB` is manipulated in the code as in the previous lesson, one of these instances is used. Beware, if only one instance of the object was used, this would mean that when searching for the object in the code (see below) to programmatically modify a set of objects, the user browsing the object would see this search positioned without having done it himself!

```java
this.setFieldFilter("trnPrdName", "Supercomputer");
List<String[]> results = this.search();
```

To avoid this problem, the session loads not one, but many instances of the object, each with a name relevant to its use:
- **the_ajax_ObjectName:** main instance, used for the main list
- **ref_ajax_ObjectName:** instance dedicated to the selection of objects on links (for example the selection of the product for the order)
- **panel_ajax_ObjectName:** instance dedicated to panels (for example the panel of orders under a product)
- **bpm_ajax_ObjectName:** process instance (e.g. during the module creation process)
- **tmp_ObjectName:** "temporary" instance dedicated to use in server side code
- etc.

There are many instance names used by the platform, we won't list them all, but let's remember:
- that each instance has a name (accessible via `ObjectDB.getInstanceName()`) which depends on the context of use
- that each instance keeps in memory the searches, loaded values, etc.

Therefore, when using an instance in scripts, it should be kept in mind:
- that it may be necessary to flush loaded filters and values (via `ObjectDB.resetFilters()` and `ObjectDB.resetValues()`)
- to avoid concurrent use of the same instance by several threads, it is essential to use a synchronization block (see commented example below)

```java
// loading a temporary instance
ObjectDB product = getGrant().getTmpObject("TrnProduct");
// block synchronized to prevent concurrent use of this instance by another thread
synchronized(product.getLock()){
    // resetting potential searches already set on the instance
    product.resetFilters();
    // positioning of a filter
    product.setFieldFilter("trnPrdName", "Supercomputer");
    // database query
    List<String[]> results = product.search();
    // iteration over results
    for(String[] row : product.search()){
        // load of a result line into the object's instance
        product.setValues(row);
        // instance operations
    }
}
```

Exercise
====================

### Implement the code for `IncreaseStock` action

- Change the action so that it calls a method of the object rather than the previously set javascript
- Add a Java script to the Product object
- Implement the method for increasing the value of the product by 10

<div class="info">NB: in the following codes, the "this" has been added to make it clear that it is on the current instance that the method is called, but it is usually omitted as it is optional</div>

```java
public void increaseStock(){
    ObjectField prdStock = this.getField("prdStock");
    prdStock.setValue(prdStock.getInt(0)+10);
    save();
}
```

### When validating the order, impact the stock

- On the order script, implement the `postUpdate` hook
- when the sate changes, load the ordered product and reduce its stock by the order quantity

<div class="info">NB: on the slide corresponding to this exercise, another approach is used</div>

```java
@Override
public String postUpdate() {
	Grant g = getGrant();
	String objname="TrnProduct";
	boolean[] oldcrud = g.changeAccess(objname, true, true, true, false);
	ObjectDB prd = g.getTmpObject(objname);
	if("PROCESSING".equals(getOldStatus()) && "VALIDATED".equals(getStatus())){
		try{	        
			synchronized(prd.getLock()){
				// select = load into the instance the values in the database corresponding to a technical key (id)
				prd.select(getFieldValue("trnOrdPrdId"));
				// read the quantity ordered on the current instance and the stock of the product on the loaded instance
				int orderedQuantity = getField("trnOrdQuantity").getInt(0);
				int stock = prd.getField("trnPrdStock").getInt(0);
				// change the stock quantity of the loaded instance
				prd.getField("trnPrdStock").setValue(stock-orderedQuantity);
				// write the instances data into the database
				prd.getTool().validateAndSave();
			}
		} catch (Exception e) {
			AppLog.error(e.getMessage(), e, g);
		} finally {
			g.changeAccess(objname, oldcrud); 
		}   
	}
	return super.postUpdate();
}
```

### Check

Clear the cache and test the implemented features

### To go further

- When an order in "Validated" state is cancelled, the product stock must return to its quantity before the order was validated.

- A product can be "In stock" or "Out of stock" add a state model to the Product object and implement the appropriate hook to set a Product to the "Out of stock" state when the stock is equal to 0.
