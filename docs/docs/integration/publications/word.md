---
sidebar_position: 50
title: Word
---

Microsoft Word
==============

> For **binary** contents the return type of method **must** be `byte[]`

```Java
public byte[] myPublicationMethod (PrintTemplate pt) {
	ByteArrayOutputStream res = new java.io.ByteArrayOutputStream();
	try {
		WordprocessingMLPackage pkg = WordprocessingMLPackage.createPackage();
		MainDocumentPart doc = pkg.getMainDocumentPart();
		doc.addStyledParagraphOfText("Title", getDisplay());
		doc.addParagraphOfText(getFieldValue("myTextField"));
		pkg.save(res);
	}catch(Docx4JException e){
		AppLog.error(e, getGrant());
	}
	return res.toByteArray();
}
```

<details>
<summary>Rhino equivalent</summary>

```javascript
importPackage(Packages.org.docx4j.openpackaging.packages);
importPackage(Packages.org.docx4j.openpackaging.parts.WordprocessingML);

MyObject.myPublicationMethod = function(pt) {
	try {
		var pkg = WordprocessingMLPackage.createPackage();
		var doc = pkg.getMainDocumentPart();
		doc.addStyledParagraphOfText("Title", this.getDisplay());
		doc.addParagraphOfText(this.getFieldValue("myTextField"));
		var res = new java.io.ByteArrayOutputStream();
		pkg.save(res);
		return res.toByteArray()
	} catch(e) {
		console.error(e);
	}
};
```

</details>
