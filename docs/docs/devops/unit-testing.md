---
sidebar_position: 200
title: Unit testing
---

Unit testing code
=================

This documents applies to **version 4.0 P22** and more recent and to modules using **Java** as server language.

This document implies that you are exposing your Java-implemented modules on the Git (`/git`) endpoint
or, at least, export them as a structured archive (e.g. ZIP).
When doing so your module is structured as an [Apache Maven projects](https://maven.apache.org/).

Implementing tests
------------------

### Using unit tests classes

A specific type of **shared code** is dedicated to write JUnit unit tests classes.

Most of the code implemented in Simplicité are **hooks** that are dedicated to **extend** the configurable items' behavior.

This is why the unit testing of such hooks have to be done in the context of a running Simplicité platform.

For instance:

```simplicite-java
package com.simplicite.tests.MyModule;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

import org.junit.Test;

import org.json.JSONObject;

import com.simplicite.util.Grant;
import com.simplicite.util.ObjectDB;
import com.simplicite.util.ObjectField;

/**
 * Unit tests example
 */
public class MyTests {

	public Grant getGrant() {
		// Using the system is dangerous
		return Grant.getSystemAdmin();
	}

	@Test
	public void testMyActionOfMyObject() {
		try {
			ObjectDB obj = getGrant().getTmpObject("MyObject");
			obj.setValues(new JSONObject().put("myCode", "MYCODEVALUE"));
			ObjectField f = prd.getField("myOtherField");
			String res = obj.invokeAction("myAction");
			assertEquals(res, "Something");
			assertEquals(f.getValue(), "Something else");
			// Etc.
		}
		catch (Exception e) {
			fail(e.getMessage());
		}
	}
}
```

In such unit tests classes you can use any of the configurable items. By default you can get them by using the
system admin grant singleton (`Grant.getSystemAdmin()`) otherwise you need to instantiate a grant specifically:

```java
private Grant m_grant = null;
public Grant getGrant() {
	// Load grant once
	if (m_grant==null) {
		m_grant = new Grant();
		// the login must be a declared user with responsibilities to access objects used in the test
		m_grant.init("mytestlogin", "myTestSessionId", Globals.ENDPOINT_UI, true, null, Globals.getInterfaceType(), null, null);
	}
	return m_grant;
}
```

Using dedicated datasets ensures reproducible test results.

:::note

For some very "low level" unit tests it is still possible to run the tests outside of Simplicité.

For instance:

```java
package com.simplicite.tests.MyModule;

import static org.junit.Assert.assertEquals;
import org.junit.Test;
/**
 * Local unit tests example
 */
public class MyLocalTests {
	@Test
	public void testSomethingLocally() {
		assertEquals(/* Something got from a "static" method */, /* Some other thing */));
		// Etc.
	}
}
```

Then you can run the tests of this class by:

```bash
mvn test -Dtest="com.simplicite.tests.MyModule.MyLocalTests"
```

Using "mocks" of configurable items is possible but is not relevant as it allows only very limited and unrealistic testing.

:::

### Using legacy methods

You can also implement a `unitTests` methods directly in your configuration items' classes although it is considered a **legacy** approach.
It is applicable to:

- Business objects
- Business workflows
- External objects
- Dispositions
- Adapters
- Grant hooks

A _Run unit tests_ action button is available to run the `unitTests` method (and as this is an action, the call can be automated
using the API or I/O endpoint, see bellow).

It is possible to use these legacy methods to wrap a unit tests shared code class:

```java
@Override
public String unitTests() {
	return new JUnitTool(getGrant()).run("com.simplicite.tests.MyModule.MyServerTest");
}
```

And it is also possible to use a nested static JUnit class:

```java
public static class UnitTest {
	// JUnit test methods
}

@Override
public String unitTests() {
	return new JUnitTool(getGrant()).run(UnitTest.class);
}
```

Run from UI
-----------

To invoke the unit tests from the UI, open the definition of your unit tests shared code, business object, business workflow, external object, etc.
and click on the _Unit tests_ action button.

The result is displayed in a popup.

Run from API
------------

You can also invoke the action from the API endpoint (for instance if you want to automate the tests execution using this endpoint).

### For a unit tests shared code class

```text
curl -s <API credentials> <base URL>/api/rest/Script/<shared code row ID>/action:runUnitTests | jq -r '.result'
```

:::note

You can get the row ID of your unit test shared code from its logical name by:

```text
curl -s <API credentials> <base URL>/api/rest/Script?scr_code=<unit tests shared code logical name> | jq -r '.[].row_id'
```

:::

### For the legacy unit tests methods

- for a business object

```text
curl -s <API credentials> <base URL>/api/rest/ObjectInternal/<business object row ID>/action:runUnitTests | jq -r '.result'
```

:::note

You can get the row ID of your business object from its logical name by:

```text
curl -s <API credentials> <base URL>/api/rest/ObjectInternal?obo_name=<business object logical name> | jq -r '.[].row_id'
```

:::

- for a business workflow

```text
curl -s <API credentials> <base URL>/api/rest/BPMProcess/<business workflow row ID>/action:runUnitTests | jq -r '.result'
```

:::note

You can get the row ID of your business workflow from its name by:

```text
curl -s <API credentials> <base URL>/api/rest/BPMProcess?pcs_name=<business workflow name> | jq -r '.[].row_id'
```

:::

- for an external object

```text
curl -s <API credentials> <base URL>/api/rest/ObjectExternal/<external object row ID>/action:runUnitTests | jq -r '.result'
```

:::note

You can get the row ID of your external object from its name by:

```text
curl -s <API credentials> <base URL>/api/rest/ObjectExternal?obe_name=<external object name> | jq -r '.[].row_id'
```

Etc.

:::

Run from I/O
------------

You can also invoke a shared code unit tests shared code class execution from the I/O services endpoint
(for instance if you want to automate the tests execution using this endpoint).

**Example**:

```text
curl -s -u <I/O credentials> --form service=unittests --form test=<test name> <base URL>/io | jq '.'
```

:::note

If you are using the [instances manager](https:/docs/misc/manager) the above command can be issued as:

```text
sim unittests <unit tests shared code logical name>
```

:::
