---
sidebar_position: 30
title: CSV -> DB
---

# CSV Line-Based Adapter

A line based adapter specialized for CSV data is provided as an abstract class to be overridden: `com.simplicite.util.integration.CSVLineBasedAdapter`. 

The methods to implement are :

```java
public String preProcess() {
	// open the default XML flow
	super.preProcess();
}

public String processLine(long lineNumber, String[] values) {
	// return the converted values to XML data
	// or return null but process values here
}

public String postProcess() {
	// close the default XML flow
	super.postProcess();
	// or inhibit output to avoid useless XML import
	//setOutputStream(null);	
}
```

## Fully functional example

> Please read comments in code with attention in order to properly understand how logging is managed.

```java
package com.simplicite.adapters.DesignerTools;

import java.util.*;
import com.simplicite.util.*;
import com.simplicite.util.integration.*;

import com.simplicite.util.tools.*;

/**
 * Adapter ExampleCsvAdapter
 */
public class ExampleCsvAdapter extends CSVLineBasedAdapter {
	private static final long serialVersionUID = 1L;
	private ObjectDB exampleObject;

	// Good practice : use specific exception class
	private static class ExampleCsvAdapterException extends Exception{
		public ExampleCsvAdapterException(String message){
			super(message);
		}
	}
	
	public String preProcess(){
		// set CSV separator
		setSeparator(','); 
		exampleObject = getGrant().getProcessObject(lgcObject); 

		// to generate a subsequently imported XML, call super.preProcess()
		// doing so will add a starting <simplicite> tag
		return null;
	}
	
	@Override
	public String processValues(long lineNumber, String[] values){	
		// Good practice: handle errors with exceptions		
		try{
			// add some logs to the .log file (added in the imports supervisor object)
			appendLog("=== Processing line #"+lineNumber+" : "+Arrays.toString(values));
			processWithExceptions(lineNumber, values);
		}
		catch(ExampleCsvAdapterException e){
			// add some logs to the .err file (added in the imports supervisor object)
			appendError("=== Error with line #"+lineNumber+" : "+Arrays.toString(values));
			appendError(e);

			// change import status to impact the supervisor object
			setStatus(SystemXML.SUPERVISOR_STATUS_IMPORT_ERROR);
		}

		// returned String gets added to a XML subsequently imported.
		// In this case, nothing is appended to the subsequently imported XML,
		// because the objects are created directly.
		return null; 
	}

	public void postProcess(){
		appendLog("End Process with status "+getStatus());
		// to generate a subsequently imported XML, call super.postProcess()
		// doing so will add a closing <simplicite> tag
	}

	public void processWithExceptions(long lineNumber, String[] values) throws ExampleCsvAdapterException{
		String createMsg;
		synchronized(exampleObject){
			exampleObject.resetValues(true);
			exampleObject.setFieldValue("attr1", values[0]);
			exampleObject.setFieldValue("attr2", values[1]);
			exampleObject.setFieldValue("attr3", values[2]);
			createMsg = exampleObject.create();
		}
		if(!Tool.isEmpty(createMsg)){
			throw new ExampleCsvAdapterException(createMsg);
		}
	}
}

```