---
sidebar_position: 110
title: Documents code examples
---

Document code examples
======================

General
-------

### Single-document access

`DocumentDB` can access a document field (`obj` is the business object):

```java
// Get document meta-data from DB
DocumentDB doc = obj.getField("myDocField").getDocument(getGrant());
// Absolute path in DOC_DIR + relative path (not available with BLOB)
String path = Platform.getDocDir() + "/" + doc.getPath();
// Or input-stream to read the document
InputStream is = doc.getInputStream();
// Or force a full read in memory
byte[] b = doc.getBytes(true);
```

### Handling document content

It is possible to save a generated document directly into a business object document field:

```java
// With an input stream to preserve memory heap
obj.getField("myDocField").setDocument(obj, "docname.pdf", inputStream);
// Or with a content as bytes in memory
obj.getField("myDocField").setDocument(obj, "docname.pdf", bytesArray);
obj.save();
```

> **Note**: the file name **must** include an appropriate extension vs the content of the stream or byte array.

### Multi-documents access

Since V5 `DocumentDB` can access a multi-documents field:

```java
// This DocumentDB contains many documents
DocumentDB multiDocs = getField("myMultiDocsField").getDocuments(this, getRowId());
// Get the list of documents
List<DocumentDB> docs = multiDocs!=null ? multiDocs.getDocuments() : null;
for (int i=0; docs!=null && i<docs.size(); i++) {
	// Single document
	DocumentDB doc = docs.get(i);
	// Absolute path in DOC_DIR + relative path
	String path = Platform.getDocDir() + "/" + doc.getPath();
	// ...
}
```

or without DB access to retrieve meta-data already selected:

```java
// This DocumentDB contains many documents
DocumentdB multiDocs = getField("myMultiDocsField").getDocument();
// Get the list of documents
List<DocumentDB> docs = multiDocs !=null ? multiDocs.getDocuments() : null;
// ...
```


<h2 id="qrcode">QRCodes images</h2>

As of version 3.0, the standard `QRCodeTool` helper class provides various methods for generating QR codes images as PNG.

Typical usage is to set an image field with a URL QR code:
 
```java
obj.getField("myQRCode").setDocument(obj, "qrcode.png", QRCodeTool.qrCodeImage(Globals.getContextURL()));
```

<h2 id="barcode">Barcodes images</h2>

As of version 3.1, the standard `BarcodeTool` helper class provides various methods for generating EAN13 Barcodes.

### EAN13 checksum

The `BarcodeTool.checkSum` method can be used to calculate the checksum digit of a code. Typical usage is:

```java
code = "123456789012"; // 12 digits code
code += BarcodeTool.checkSum(code); // 13 digits code with checksum
```

### EAN13 barcode image

A EAN13 code (12 digits + 1 checksum digit) can then be used to generate a JPEG image, for instance to set an image field:

```java
obj.getField("myEAN13Barcode").setDocument(obj, code + ".jpg", BarcodeTool.ean13Image(code));
```
<h2 id="pdf">PDF documents using iText&reg; 2.1.7</h2>

This example is given in the server-side **Rhino** scripting language. It can be easily transposed to **Java** language.

To use the **iText&reg;** library classes you need to include the `com.lowagie.text` package explicitly.
For more information on itext 2.1.7 available on <a href="https://coderanch.com/how-to/javadoc/itext-2.1.7" target="_blank">javadoc</a>

**Java**

```java
import com.lowagie.text.*;

(...)

ByteArrayOutputStream bos = new java.io.ByteArrayOutputStream();
	
Document pdf = PDFTool.open(bos);
pdf.add(new Paragraph("Hello world !"));
(...)
PDFTool.close(pdf);

byte[] bytes = bos.toByteArray();
// Do something with document content...
```

<details>
<summary>Rhino JavaScript equivalent</summary>

```javascript
importPackage(Packages.com.lowagie.text);

var bos = new java.io.ByteArrayOutputStream();
	
var pdf = PDFTool.open(bos);
pdf.add(new Paragraph("Hello world !"));
(...)
PDFTool.close(pdf);

var bytes = bos.toByteArray();
// Do something with document content...
```
</details>

Note that it is possible to insert resource images in the PDF document, e.g.:

```javascript
pdf.add(PDFTool.getImageFromResource(obj.getGrant(), "MYIMAGERESOURCECODE"));
```

<h2 id="excel">Excel(R) sheet using Apache POI&reg;</h2>

### Create sheet fron scratch

**Java**

```java
import com.simplicite.util.tools.ExcelPOITool;

(...)

ExcelPOITool xls = new ExcelPOITool(); // or ExcelPOITool(true); as of version 4.0, the true argument means using XLSX format
ExcelSheet s = xls.newSheet("MyNewSheet");
ExcelRow r = xls.newRow(0);
ExcelCell c = xls.newCell(0, "Hello World !");
r.add(c);
s.add(r);
xls.add(s);
bytes[] bytes = xls.generateToByteArray();
// Do something with document content...
```


<details>
<summary>Rhino JavaScript equivalent</summary>

```javascript
var xls = new ExcelPOITool(); // or ExcelPOITool(true); as of version 4.0, the true argument means using XLSX format
var s = xls.newSheet("MyNewSheet");
var r = xls.newRow(0);
var c = xls.newCell(0, "Hello World !");
r.add(c);
s.add(r);
xls.add(s);
var bytes = xls.generateToByteArray();
// Do something with document content...
```
</details>

### Using an existing template sheet

For this advanced usage of the **Apache POI** lib you need to include the `org.apache.poi.hssf.usermodel` package explicitly.

**Java**

```java
import com.simplicite.util.tools.ExcelPOITool;
import org.apache.poi.hssf.usermodel.*;

(...)

ExcelTool xls = new ExcelTool(true);
Sheet sheet = xls.addSheet("Custom");
for (int i = 0; i < rows.size(); i++) {
	ExcelRow r = new ExcelRow(i);
	String[] row = rows.get(i);
	for (int j = 0; j < row.length; j++) {
		r.add(xls.newCell(j, row[j]));
	}
	xls.addRow(sheet, r);
}
```

<details>
<summary>Rhino JavaScript equivalent</summary>

```javascript
importPackage(Packages.org.apache.poi.hssf.usermodel);
(...)
 
var sheet = xls.addSheet("Custom");
for (var i = 0; i < rows.size(); i++) {
	var r = new ExcelRow(i);
	var row = rows.get(i);
	for (var j = 0; j < row.length; j++) {
		r.add(xls.newCell(j, row[j]));
	}
	xls.addRow(sheet, r);
}
```
</details>


In the above example `doc` is a Simplicit&eacute;&reg; document.

For instance you can get it:

- from a business object document field: `doc = obj.getField("myDoc").getDocument()` (`obj` is the business object)
- from a publication template: `doc = pt.getDocument(obj.getGrant())` (`pt` is the publication template)
- Etc.