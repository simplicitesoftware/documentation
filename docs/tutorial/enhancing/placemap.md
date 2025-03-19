---
sidebar_class_name: hidden
sidebar_position: 18
title: Place map
---

Place map
====================
 
Google Map geolocation from an address can be configured from the **Interface/Places maps** menu or in V6 **User interface/Objects rendering/Places map**.  
The business object on which you want to generate a location map must have a **Geographical coordinates** type field in order to store the longitude and lattitude of an address.  
The value of this field is not calculated automatically (in fact it is necessary to specify from which other field(s) the calculation can be done - object fields or external data source).  
It is therefore necessary to calculate this data from an address via the **GMapTool** class in a preSave hook.   

<div class="error">WARNING: we provide a default Google API key in the GOOGLE_API_KEY system parameter it is IMPERATIVE that you replace it with your own key.</div>

Sample code:  

```java
@Override
public String preSave() {
		try {

			ObjectField coords = getField("trnCliCoords");
			ObjectField ad = getField("trnCliAddress");
			ObjectField zc = getField("trnCliZipCode");
			ObjectField ci = getField("trnCliCity");
			ObjectField co = getField("trnCliCountry");
			
			if (coords.isEmpty() || ad.hasChanged() || zc.hasChanged() || ci.hasChanged() || co.hasChanged()) {
				String a = ad.getValue() + (ad.isEmpty() ? "" : ", " + zc.getValue() + ", " + ci.getValue() + ", " + co.getValue();
				Location c = new GMapTool(getGrant()).geocodeOne(a);				
				coords.setValue(c==null ?  "" : c.toString());
			}
		} catch (Exception e) {
			AppLog.error(null, e, getGrant());
		}
		return super.preSave();
}  
```

The placemap uses a particular instance of the object.
The **initPlaceMap** hook is used to override the standard placemap behavior.


Exercise
====================

- Create a **Geographic Data** type field in the `TrnClient` object.  
- Create a location map on the `TrnClient` object.  
- Check that a list action appears
- Click on the icon to the right of the Geographic Data input field


For further training : Creating an action 
---------------------------
- Create an action on the `TrnClient` object to display the location of a client's address on the form.  

