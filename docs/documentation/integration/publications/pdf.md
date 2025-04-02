---
sidebar_position: 40
title: PDF
---

PDF Publications
====================

> There are many ways of generating PDFs, please [read this post for an overview](https://community.simplicite.io/t/pdf-publication/2159/3)

The example below is for a simple PDF content using the iText&reg; library and its wrapper tool (publication template MIME type must be set to PDF):

> For **binary** contents the return type of method **must** be `byte[]`

```Java
public byte[] myPublicationMethod (PrintTemplate pt) {
	ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
	try {
		Document pdf = PDFTool.open(out);
		pdf.add(new Phrase(getFieldValue("myTextContentField")));
		PDFTool.close(pdf);
	} catch (DocumentException e) {
		AppLog.error(e, getGrant());
	}
	return out.toByteArray();
	
}
```

<details>
<summary>Rhino equivalent</summary>

```javascript
importPackage(Packages.com.lowagie.text);

MyObject.myPublicationMethod = function(pt) {
	try {
		var out = new java.io.ByteArrayOutputStream();
		var pdf = PDFTool.open(out);
		pdf.add(new Phrase(this.getFieldValue("myTextContentField")));
		PDFTool.close(pdf);
		return out.toByteArray();
	} catch(e) {
		console.error(e);
	}
};
```

</details>