---
sidebar_position: 1
title: Standard formats
---

Standard I/O formats
====================

Introduction
------------

All standard I/O formats (XML, ZIP and CSV) are rowID-less formats that allows data exchange between instances.

Each record in these formats **must** have as a minimum the functional keys fields so as the platform can identifify the record to be processed.

All other fields are optional, except for mandatory fields required during record creation.

Standard XML format
-------------------

The standard XML follows these [XSD schemas](https://www.simplicite.io/resources/schemas/). To summarize it consist in a list of `object` blocs with list of  `data` blocs inside.
Each `object` corresponds to one business object, each `data` bloc correspond to one record of the business object.
In a `data` bloc, each tag correspond to one of the objet field, the field tags can be different from on bloc to another.

Example:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<simplicite xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.simplicite.fr/base" xsi:schemaLocation="http://www.simplicite.fr/base https://www.simplicite.io/resources/schemas/base.xsd">
<object>
	<name>DemoSupplier</name>
	<action>upsert</action>
	<data>
		<demoSupCode>BIM</demoSupCode>
		<demoSupName>BIM Computers Ldt</demoSupName>
		<demoSupPhone>+33 1 44 55 66 77</demoSupPhone>
		<demoSupWebsite><![CDATA[http://www.simplicite.fr]]></demoSupWebsite>
		<demoSupEmail>demo@simplicite.fr</demoSupEmail>
	</data>
	<data>
		<demoSupCode>DY</demoSupCode>
		<demoSupDescription><![CDATA[Dyewlett Yackard is a worldwide manufacturer]]></demoSupDescription>
		<demoSupLogo><![CDATA[DATA:dy.png:base64:iVBORw0K(...)]]></demoSupLogo>
	</data>
</object>
</simplicite>
``` 

You can specify the import mode in the `action` attribute of each of the `object` bloc.

- `upsert` = creation or update depending if the record exists or not
- `insert` = creation (if the record exists an error is raised)
- `update` = update (if the record does not exist an error is raised)
- `delete` = delete (if the record does not exist an error is raised)

You can also precise `if="exists"` or `if="not exists"` attribute on the `action`tag of the `object` bloc to avoid potential errors.

The `action` attribute can also be used to call a custom action of the business object by its name.

As explained in the introduction you **must** at least put the functional keys of your record in all your `data` blocs.

In XML format the document fields are inlined in the XML, the content of the document being set in a `CDATA` bloc, either as plain text or as base 64 encoded string (depending on MIME type).

A same XML file can have several `object` blocs corresponding to several different business objects, however to respect relational links these blocs must be put in an appropriate order.

Standard ZIP format
-------------------

The standard ZIP format is an archive file that contains one or several standard XML files in the root folder
and an arbitrary subfolder structure for the documents which are referenced in the XML files as a relative path within the archive.

These XML files are processed in the order of their name.

Standard CSV format
-------------------

The standard CSV format is for one business only.

It consist in a first line with the name of the fields to import separated by a given separator (semicolon `;` by default, it can be a tab).
The next lines **must** have the same number of fields in the same order (lines that does not comply to this constraint are ignored).

Example for the `DemoSupplier` as for the above XML example:

```csv
demoSupCode;demoSupEmail
BIM;demo@simplicite.fr
DY;demo@simplicite.fr
```

Again you **must** at least have the functional keys of your business object on the first line.

The XML action mode for CSV import is `upsert`.

Standard JSON format
--------------------

**to be completed**

Standard YAML format
--------------------

**to be completed**
