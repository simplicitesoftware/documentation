---
sidebar_position: 10
title: Basic code examples
---

Basic code examples
===================

These basic guidelines and examples show how to implement business logic within business objects, workflows, or external objects using Java.
Rhino-based scripting is deprecated. Business logic must now be written in Java, which ensures strong typing, compilation,
and compatibility with development tools such as IDEs, debuggers, and SonarQube®.

Naming conventions
------------------

Recommended naming conventions are:

- Name modules, business objects, business workflows, external objects, adapters, ... as you would name a Java
  class (put a capital letter at the beginning of each word, e.g. `MyBusinessObject`)
- Name field as you would name a Java variable (do not start by a capital letter, but afterwards put a capital
  letter at the beginning of each word, e.g. `myFirstName`)

Since version 4, the platform includes automatic naming convention validation (activated by a SYNTAX system parameter whose value is yes by default).
This is available for objects, functions, groups, domains and actions.

Packages inclusions
-------------------

All scripts are processed with the following packages included **by default** (no need to import them explicitly):

```text
java.lang
java.util
org.json
com.simplicite.util.exceptions
com.simplicite.util.tools
com.simplicite.util
com.simplicite.bpm
com.simplicite.webapp
com.simplicite.webapp.tools
```

It is possible to include a whole additional packages by:

```text
import <java class name (e.g. org.apache.commons.lang3)>.*;
```

or a single additional class by:

```text
import <java class name (e.g. org.apache.commons.lang3.StringUtils)>;
```

Example:

```java
import org.apache.commons.lang3.StringUtils;
AppLog.info(StringUtils.isNumeric("hello world"),getGrant()); // false
AppLog.info(StringUtils.isNumeric("123"),getGrant()); // true
```

Logging
-------

### Console logging

It is possible to log messages using:

```simplicite-java
AppLog.debug("Hello world !",getGrant());   // Debug level message
AppLog.info("Hello world !",getGrant());    // Info level message
// e is type java.lang.Throwable
AppLog.warning(e,getGrant()); // Warning level message
AppLog.error(e,getGrant());   // Error level message
AppLog.fatal(e,getGrant());   // Fatal level message
```

It is also possible to link a message to an explicit log code:

```simplicite-java
AppLog.log("MYLOGCODE_001","Hello world !",getGrant());
```

Note that if the log code is omitted the `log` method is the equivalent to the default `info`method.

The messages are actually displayed depending on the log appenders configuration and on the log code associated configuration.

Designers can [activate the hooks tracer](/docs/core/objects/businessobject-code-hooks#trace-hooks) during development phase for easier debugging or understanding.

Business objects manipulation
-----------------------------

### Selecting

Selecting a **single record** from its row ID.

```simplicite-java
ObjectDB o = getGrant().getTmpObject("myObject");
synchronized (o.getLock()) {
	o.resetFilters();
	// Same as above regarding filters
	if (o.select(rowId)) {
		String val = o.getFieldValue("myField1");
		// etc.
	}
}
```

### Searching

Search **multiple records** with filters and ordering.

Without pagination:

```simplicite-java
ObjectDB o = getGrant().getTmpObject("myObject");
synchronized (o.getLock()) {

	// Place filters if needed
	o.resetFilters(); // remove all previous filters
	o.setFieldFilter("myFkField", this.getRowId()); // Foreign key
	o.setFieldFilter("myField1", "ABC"); // simple text
	o.setFieldFilter("myField2", "is not null"); // or "is null"
	o.setFieldFilter("myField3", "in (1,5,8)"); // or "not in"
	o.setFieldFilter("myField4", "ABC%"); // starts with
	o.setFieldFilter("myField4", "%ABC"); // ends with
	o.setFieldFilter("myField4", "%ABC%"); // contains
	o.setFieldFilter("myField4", "A_B%C"); // like 'A_B%C'
	o.setFieldFilter("myField4", "like 'ABC%'"); // or "not like"
	o.getField("myDate1").setFilterDateMin(Tool.getCurrentDate());
	o.getField("myDatetime1").setFilterDateMax("2013-06-26 23:45:23");
	o.getField("myBoolean1").setFilter(true); // or false
	o.getField("myInteger1").setFilter(">100 and <200");
	o.getField("myString1").setFilter("='abc' or ='def'");

	// Place orders if needed
	o.resetOrders();
	o.getField("myField1").setOrder(1); // order by myField1 ascendant
	o.getField("myField2").setOrder(-2); // then order by myField2 descendant

	// A non-paginated search can consume a lot of memory
	// The designer must ensure that the search is limited/filtered
	for (String[] row : o.search()) {
		o.setValues(row, true);
		String val = o.getFieldValue("myField1");
		// etc
	}
}
```

With pagination to limit memory usage, you have to implement a callback for each page:

- V6 supports a `pageNum` parameter to calculate a global rowNum in search:

```simplicite-java
final int maxRowsPerPage = 50;
obj.search(true, maxRowsPerPage, (rows, pageNum) -> {
	int rowNum = maxRowsPerPage * pageNum;
	for (String[] row : rows) {
		o.setValues(row, true);
		// ...
		rowNum++;
	}
});
```

- V5 previous syntax without `pageNum`:

```java
int maxRowsPerPage = 50;
obj.search(true, maxRowsPerPage, (rows) -> {
	for (String[] row : rows) {
		o.setValues(row, true);
		// ...
	}
});
```

### Using enumerations fields' code/values

Enumeration fields are particular because they refer a list of value which consist of a list of **code** and **value**.

- The **code** is the actual value of the field (the one to manipulate with `set/getValues`, `set/getFilter`, etc).
- The **value** is only the displayable label translated in the language of the current user

You should thus never use the **values** but only the **codes** in your code.

Example: iterate on the codes of a field's list of values:

```java
for (EnumItem item : o.getField("myField").getList().getAllItems()) {
	String code = item.getCode();
	// ...
}
```

### Filtering

The setSearchSpec is a method that allows you to set an SQL where clause on your business object.

For example , users can only read, update the data they have created
users can only view or modify the data to which they are assigned...etc

If it's a static filter that never changes, use the postLoad hook to define your search spec.
The object's table alias is t.
The alias of the related object table is t_logical name technical key.

```simplicite-java
@Override
public void postLoad() {
	if (getGrant().hasResponsibility("USER_GROUP"))
		setSearchSpec("t.column1='abc' or t.column2>123");
}

@Override
public void postLoad() {
	if (getGrant().hasResponsibility("USER_GROUP"))
		setSearchSpec(getSearchSpec() + " and exists(select 1 FROM table1 where t_userAssignedId.row_id=" + getGrant().getUserId());
}
```

Others
------

### Sending emails

```simplicite-java
ObjectDB obj = getGrant().getTmpObject("myObject");
ObjectField myObjectFile = obj.getField("myObjFile"); // must be of type file

// https://platform.simplicite.io/current/javadoc/com/simplicite/util/tools/MailTool.html
MailTool mail = new MailTool(getGrant());
mail.addRcpt("contact@null.fr");
mail.setSubject("Test Mail");
mail.addAttach(obj, myObjectFile);
mail.setBody("<p>Hello</p>");
mail.send();
```

### ZIP files

#### Read ZIP file

This simple example unzips a ZIP file read from a public URL and unzip it to a temporary folder for processing files:

```simplicite-java
public void readZip(File zipFile){
	File destDir = new File(this.getGrant().getTmpDir() + "/mydata." + System.currentTimeMillis());
	try {
		ZIPTool.extract(zipFile, destDir);
		// Do something with files of file contents located in destDir, e.g. using FileTool methods
	} catch (IOException e) {
		AppLog.error(e, getGrant());
	} finally {
		FileTool.deleteFileOrDir(destDir);
	}
}
```

#### Write ZIP file

This simple example zips a list of text files and return the ZIP file as a byte array:

```java
public byte[] writeZip() {
	try {
		Map<String,byte[]>  files = new HashMap<>();
		String data = "Hello world";
		files.put("test1.txt", (data + " 1").getBytes());
		files.put("test2.txt", (data + " 2").getBytes());
		files.put("testN.txt", (data + " N").getBytes());
		return ZIPTool.build(files);
	} catch (IOException e) {
		AppLog.error(e,getGrant());
		return new byte[0];
	}
}
```

Example to export a ZIP with documents from object fields using a temporary directory:

```simplicite-java
String tmpdir = FileTool.getRandomDirname(Platform.getTmpDir(), "myArchive");
try {
	File tmp = new File(tmpdir);
	tmp.mkdirs();
	List<String> files = new ArrayList<>();

	// Copy files into temp
	DocumentDB doc = obj.getField("myDocField").getDocument(getGrant());
	String file = doc.getName();
	try (FileOutputStream fos = new FileOutputStream(tmpdir+"/"+file)) {
		// Do not use File ou bytes-array, only buffered stream
		Tool.copy(doc.getInputStream(), fos);
	}
	files.add(file);
	// other docs...

	// Build ZIP
	File fz = ZIPTool.build(tmpdir, "archive.zip", files);

	// Copy in your output and discard the ZIP file from temp
	try (DeleteOnCloseInputStream in = new DeleteOnCloseInputStream(fz)) {
		Tool.copy(in, myOutputStream);
	}
}
catch (Exception e) {
	AppLog.error(e, getGrant());
}
finally {
	// delete temporary directory
	File tmp = new File(tmpdir);
	if (tmp.isDirectory())
		FileTool.deleteFileOrDir(tmp, true);
}
```

:::note
There are several other methods and variants in `Tool`, `ZIPTool` and `FileTool` that you can use to manipulate URLs and files
:::
