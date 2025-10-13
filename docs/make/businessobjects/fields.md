---
sidebar_position: 50
title: Fields
---

# Fields

## What is a Field ?

If the object has a form, the attribute will be a field of this form. The configuration of the attribute allows to determine if it is mandatory or not, its type (text, number, single or multiple enumerated) etc.

Just like a business object, the field has a logical and physical name. The logical name identifies the attribute in the business rules, in the code and will follow the same syntactical conventions as Java variables. The physical name will be used to create a column in the business object's table. A field might not have a physical name, it's the case for non persisted calculated fields.

A fundamental aspect of the metamodel is the **object field**. One field can be used on several objects: a "comment" field, for instance, can be used on the 300 objects of the app. If the size of this field needs to be increased, to allow the input of longer comments, it can be done by changing the parameters of one single attribute, instead of changing the 300 comment fields of the 300 business objects. Furthermore, a field doesn't have to be linked to an object (storage field for a planned task, process filed, etc). In the metamodel this concept is represented by a **N/N link between the field and the business object** therefore introducing a link object. In Simplicité, the link object between a business object and a field is called **object field**. The object field object allows to **override** the parameters of the attribute (mandatory, translation, etc).

When a field is linked to an object via an object field, Simplicité will create a column in the business object's table.

## Field types

| Type | Description |
|------|-------------|
| Short text | A short text field allows the user to enter a text value < 4000 characters |
| Long text | A long text field allows the user to enter a text value. |
| Integer | A integer field allows the user to enter a numeric value. |
| Decimal (double) | A decimal field allows the user to enter a numeric value with a decimal part. |
| BigDecimal (100,32) | A big decimal field allows the user to enter a numeric value with a decimal part and a high precision. |
| Date | A date field allows the user to enter a date value. Displays a date picker. |
| Date and time | A date and time field is a field that allows the user to enter a date and time value. Displays a date and time picker. |
| Time | A time field is a field that allows the user to enter a time value. Displays a time picker. |
| Enumeration | An enumeration field is a field that allows the user to select a value from a predefined list. |
| Multiple enumeration | A multiple enumeration field is a field that allows the user to select multiple values from a predefined list. |
| Boolean | A boolean field allows the user to select a value between true and false. |
| URL | A URL field is a field that allows the user to enter a URL value. The content must be a valid URL |
| HTML content | A HTML content field allows the user to input styled text. |
| Email | An email field allows the user to input an email address. |
| Validated text | A validated text field allows the user to input a text value. The text is validated by a regular expression. |
| Document | A document field allows the user to upload a file. |
| Internal ID | An internal ID field is used to create a link with another object. |
| Object | An object field allows the user to select a record from another object. |
| Password | A password field allows the user to enter a password. |
| Image | A image field allows the user to upload an image. |
| Notepad | A notepad field displays a text area that saves previous values. |
| Phone number | A phone number field allows the user to input a phone number. |
| Color | A color field allows the user to select a color. Displays a color picker. |
| Geographical coordinates | A geographical coordinates field allows the user to input a latitude and longitude. Displays a map when a map provider is configured. |

## Field rendering options

The following rendering modes are available per field type. Use these to control how inputs are displayed in forms and lists.

### Boolean

| Label | Description |
|-------|-------------|
| Two radio buttons | Render as radio buttons (Yes/No) |
| Single checkbox | Render as a single checkbox |
| Combobox | Render as a dropdown list |
| Slide button | Render as a toggle switch |

### Color

| Label | Description |
|-------|-------------|
| #RRGGBB | Hexadecimal color input |
| rgb | RGB color input |
| rgba | RGBA color input with alpha channel |

### Date

| Label | Description |
|-------|-------------|
| To year | Year-only selector |
| To month | Month-only selector |
| To day | Day-only selector |

### Date and time

| Label | Description |
|-------|-------------|
| To year | Year part selector |
| To month | Month part selector |
| To day | Day part selector |
| To hour | Hour part selector |
| To minute | Minute part selector |
| To second | Second part selector |

### Document

| Label | Description |
|-------|-------------|
| Single document with icon on list | Display a single document as an icon |
| Single document name | Display a single document as a filename |
| Multi-documents boxes | Display multiple documents as boxes |
| Multi-documents list | Display multiple documents as a list |

### Enumeration

| Label | Description |
|-------|-------------|
| Single or multiple selection list | Default list; supports single or multiple selection depending on field |
| Horizontal | Horizontal layout of checkboxes/radio buttons |
| Vertical | Vertical layout of checkboxes/radio buttons |
| Select with search / Pill box | Pill-style selector |

### Foreign key (Object/Internal ID selector)

| Label | Description |
|-------|-------------|
| Popup picker | Select via a popup dialog |
| Select dropdown | Select via a dropdown list |
| Popup and select | Offer both popup and dropdown selection |

### Decimal (double)

| Label | Description |
|-------|-------------|
| Simple number | Numeric input with decimals |
| Monetary | Decimal input with currency formatting |
| Percentage | Decimal input formatted as percent |
| With calculator | Numeric input with a calculator UI |
| Progress bar | Display value as a progress bar |
| € | Euro currency formatting |
| K€ | Thousands of Euros formatting |
| M€ | Millions of Euros formatting |
| $ | US Dollar currency formatting |
| K$ | Thousands of US Dollars formatting |
| M$ | Millions of US Dollars formatting |
| £ | British Pound currency formatting |
| K£ | Thousands of British Pounds formatting |
| M£ | Millions of British Pounds formatting |
| ¥ | Japanese Yen currency formatting |
| K¥ | Thousands of Yen formatting |
| M¥ | Millions of Yen formatting |
| CHF | Swiss Franc currency formatting |

### Image

| Label | Description |
|-------|-------------|
| Take a selfie | Capture image using front camera |
| Take a picture | Capture image using rear camera |
| Signature pad | Capture a signature in a popup |
| Signature pad inlined | Capture a signature inline in the form |
| Scratch pad | Freehand drawing area in a popup |
| Scratch pad inlined | Inline freehand drawing area |

### Integer

| Label | Description |
|-------|-------------|
| Simple number | Integer input |
| Monetary | Integer input with currency formatting |
| Progress bar | Display value as a progress bar |
| Percentage | Integer input formatted as percent |
| Stars | Star rating widget |
| Slider | Slider control |
| € | Euro currency formatting |
| K€ | Thousands of Euros formatting |
| M€ | Millions of Euros formatting |
| $ | US Dollar currency formatting |
| K$ | Thousands of US Dollars formatting |
| M$ | Millions of US Dollars formatting |
| ¥ | Japanese Yen currency formatting |
| K¥ | Thousands of Yen formatting |
| M¥ | Millions of Yen formatting |
| CHF | Swiss Franc currency formatting |

### Link

| Label | Description |
|-------|-------------|
| Icon on list | Display as an icon |
| Value | Display as a clickable value |
| QRCode/barcode scanner | Provide a QR code / barcode scanner action |

### Long text

| Label | Description |
|-------|-------------|
| Expression | Expression editor style |
| Fixed font | Monospaced text editor |
| HTML | HTML editor for fragments |
| SQL | SQL editor style |
| Markdown | Markdown editor |
| JSON | JSON editor with syntax highlighting |
| Text editor | Rich text editor |
| Grid | Grid editor for 2D array JSON |
| Count characters | Textarea with live character count |

### Notepad

| Label | Description |
|-------|-------------|
| Text scratch pad | Text-based running notes |
| Users activities | Activity-styled running log |

### Short text

| Label | Description |
|-------|-------------|
| QRCode/barcode scanner | Input with QR code / barcode scanner |
| Icon picker | Icon picker |

### Time

| Label | Description |
|-------|-------------|
| To hour | Hour selector |
| To minute | Minute selector |
| To second | Second selector |

### Link rendering (for linked objects)

| Label | Description |
|-------|-------------|
| Child list | Display linked items as a list |
| Pillbox | Display linked items as pills |
| Pillbox with creation | Pills with inline create action |

## Technical key of the business object

From the definition of the physical object and attribute names, a table and a column are created in the database. In reality, as soon as a business object is created, 5 default columns are created, the **technical fields**. This can be verified by testing an SQL query via the "DB Access" shortcut as seen in the previous chapter:

| row\_id | created\_dt | created\_by | updated\_dt | updated\_by |
|---------|-------------|-------------|-------------|-------------|
|         |             |             |             |             |

The `row_id` column is called the **technical key**. It is generated and managed by the base, **so there is no need to create ID attributes** for your objects.

These 5 columns are not intended to be visible to the user.

## Functional key

The functional key is a set of fields defining the **functional** uniqueness of the business object. Thus, if it is decided that the functional key of the customer is composed of his name and his first name, then two customers with the same name + first name cannot exist. 

**Every business object must have a functional key**. *If there is no key, Simplicité will only allow the creation of one record, which will have an  "empty" functional key. The second record, also having an "empty" functional key, will trigger an error because the functional key already exists.*

## Foreign key

A link between two objects is defined:
- physically, by **a column in the referencing object's table**, pointing to the `row_id` column of the referenced object
- in terms of configuration, by:
    - an attribute of type Internal ID/Technical Key (created automatically when the relationship is created), 
    - an object field with the following information :
        - the object referenced in "Joined object"
        - empty "referenced field"


## Joined fields

When there is a 1:N relationship between two objects, it becomes possible to add joined fields to the referring object. In our example, it is possible to display supplier information on the product form.

There are three ways to join fields: 
- when creating the relationship between two objects
- by using template editor
- by manually creating a correctly configured object field

The joined field is defined:
- physically, by the joined object
- in terms of configuration by an object field linking **the joined object's field** to **the referencing object**, and containing:
    - the referenced object in "linked object"
    - the foreign key used in "reference field"


## Calculated fields

The simplest type of customization is the calculated field. This is a field whose value will depend **on other fields in the same business object**. In some cases, it may be useful to join fields from related objects just to be used for calculated fields. For example, in the exercise, the total price of the order will be calculated by multiplying the product's price by the number of items ordered. So the product's price will need to be *part of the order for the value to be available*.

### Persistence

A calculated field can be persistent or not, depending on whether the field has a physical name or not. Indeed, if there is no physical name, then there is no associated column in the database, and Simplicité will calculate the value each time it is displayed. If there is a physical name, then Simplicité will store the result of the calculation in the database each time the business object is saved.

The upside of the non-persistent field is that there is no need to worry about keeping it up to date, in our example if the product price is updated, as it is calculated each time it is displayed.

The downside of non-persistent fields is precisely their calculation each display time it is displayed, which can be costly for displaying or exporting a list (especially if it is a complex calculation), but also their unavailability for data aggregation functionalities (sums in a list, group by in a list, cross-tabulations, etc.) because they are done by SQL queries.

### Simplicité Expressions

A certain number of configuration fields, such as the *Calculated Expression* field, are **Executed Fields**. Before using them, it is worth understanding how they work.

The contents of these executed fields are executed on the server side using the Rhino library, which is an implementation of JavaScript (ES6) written in Java. Rhino allows scripts to be executed in a Java application without first compiling them. However, since the scripts are executed on the server, they have access to the entire Simplicité Java API.

Prior to execution by Rhino, Simplicité also pre-processes the executed fields to transcribe Simplicité expressions (bracketed syntax) into JavaScript code.

Some expressions are available in all executed fields, others are only available in specific executed fields.

Be careful to differentiate the following elements:
- **executed field:** field of some configuration objects that results in a Rhino execution and gives access to the whole Simplicité API
- **expression Simplicité:** Simplicité syntax transformed into javascript code to simplify the content of the executed fields
- **calculated expression:** this is an *executed field* of the "Attribute" configuration object that automatically calculates the value of the field