---
sidebar_position: 40
title: PDF
---

PDF Publications
====================

PDF publications can be generated in several ways:

- using the HTML->PDF tool (based on the [OpenHtmlToPdf](https://github.com/openhtmltopdf/openhtmltopdf) library)
- using the `HTMLToPDFTool` helper class (or directly the included underlying open source [Apache PDFBox library](https://pdfbox.apache.org/))

or for more complex/specific cases:

- using a third-party Java PDF generation library, that might be more advanced than PDFBox, like [iText](https://itextpdf.com/)
- using a third-party HTML->PDF external service, that might be more advanced than OpenHtmlToPdf, like the open source [WeasyPrint](https://weasyprint.org)
- using a third-party API-based PDF generation service ([ex](https://stackoverflow.com/questions/5344176/is-there-a-web-service-for-converting-html-to-pdf/5344424#5344424))
- etc.

HTML template to PDF
--------------------

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

Binary generation
-----------------

Configure a publication with:

- **Forced MIME type** : PDF
- **Template type** : method
- **Method** : `pubPdf`

And then implement the publication method in the object's code.

Example using the `HTMLToPDFTool` wrapper class:

```Java
package com.simplicite.objects.Demo;

import com.simplicite.util.*;
import com.simplicite.util.annotations.BusinessObjectPublication;
import com.simplicite.util.tools.HTMLToPDFTool;

/**
 * Customer business object
 */
public class DemoClient extends ObjectDB {
	public static final long serialVersionUID = 1L;

	@BusinessObjectPublication
	public Object pubPdf(PrintTemplate pt) {
		return HTMLToPDFTool.toPDF("Hello <b>world</b>!"); // HTML
		// return HTMLToPDFTool.markdownToPDF("My PDF", "Hello **world**!"); // Markdown
		// etc.
	}
}
```

Example using directly the lower-level PDFBox lib API:

```Java
package com.simplicite.objects.Demo;

import com.simplicite.util.*;
import com.simplicite.util.annotations.BusinessObjectPublication;

import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.font.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

/**
 * Customer business object
 */
public class DemoClient extends ObjectDB {
	public static final long serialVersionUID = 1L;

	// inspiration : https://www.tutorialspoint.com/pdfbox/
	@BusinessObjectPublication
	public Object pubPdf(PrintTemplate pt) {
		ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

		try {
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
		} catch(IOException e) {
			AppLog.error(getClass(), "pubPdf", "Error creating PDF", e, getGrant());
		}

		return byteArrayOutputStream.toByteArray();
	}
}
```
