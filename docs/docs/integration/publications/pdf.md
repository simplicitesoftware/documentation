---
sidebar_position: 40
title: PDF
---

PDF Publications
====================

PDF publications can be generated in several ways:
- using the HTML->PDF tool based on the [openhtmltopdf](https://github.com/openhtmltopdf/openhtmltopdf) library
- using the included open source [Apache PDFBox library](https://pdfbox.apache.org/)
- using a third-party Java PDF generation library, that might be more advanced than PDFBox, like [iText](https://itextpdf.com/)
- using a third-party HTML->PDF service, that might be more advanced than openhtmltopdf, like the open source [WeasyPrint](https://weasyprint.org)
- using a third-party API-based PDF generation service ([ex](https://stackoverflow.com/questions/5344176/is-there-a-web-service-for-converting-html-to-pdf/5344424#5344424))

## HTML template to PDF

Configure a publication with:
- **Forced MIME type** : PDF
- **Template type** : File
- **File** : simple html file

For images and styles, you can set them as Object resources and add them with the `CSSRESOURCE` and `IMGRESOURCE` expressions.

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title></title>
<style type="text/css">
[CSSRESOURCE:HTP_STYLES]
</style>
</head>
<body class="htp">
	<header class="head">
		<img src="[IMGRESOURCE:HTP_LOGO]" alt="Logo"/>
	</header>
	<section>
	<table>
		<thead>
			<tr>
				<th>Code</th>
				<th>Label</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>[BEGIN]
			<tr>
				<td class="center">[VALUE:htpHtpoCode]</td>
				<td>[VALUE:htpHtpoLabel]</td>
				<td>[VALUE:htpHtpoDescription]</td>
			</tr>
		[END]</tbody>
	</table>
	</section>
</body>
</html>
```

## Binary generation

Configure a publication with:
- **Forced MIME type** : PDF
- **Template type** : method
- **Method** : `pubPdf`

And then implement the method (which must be of type `byte[]`) in the object's code.

Example:

```Java
package com.simplicite.objects.Demo;

import com.simplicite.util.*;
import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.font.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

/**
 * Customer business object
 */
public class DemoClient extends ObjectDB {
	private static final long serialVersionUID = 1L;
	
	//inspiration : https://www.tutorialspoint.com/pdfbox/
	public byte[] pubPdf(){
		ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
		
		try{
			// init
			PDDocument document = new PDDocument();
			PDPage page = new PDPage();
			document.addPage(page);
			
			// content
			PDPageContentStream contentStream = new PDPageContentStream(document, page);
			contentStream.beginText();
			contentStream.setFont(PDType1Font.TIMES_ROMAN, 12);
			contentStream.newLineAtOffset(25, 500);
			contentStream.showText("Hello world");
			contentStream.endText();
			contentStream.close();
			
			// save
			document.save(byteArrayOutputStream);
			document.close();
		}
		catch(IOException e){
			AppLog.error(getClass(), "pubPdf", "Error creating PDF", e, getGrant());
		}
		
		return byteArrayOutputStream.toByteArray();
	}
}
```