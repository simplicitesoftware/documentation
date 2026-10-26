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

Accessible PDF
--------------

When the publication is set as accessible, the platform tags the generated PDF and embeds its fonts to
meet the **PDF/UA-1** standard. The structure of the PDF is derived from your HTML template: a template
that follows the rules below produces a compliant PDF.

This only applies to PDF generated from an HTML template. [Binary generation](#binary-generation) and
other output types are not affected.

### Settings

| Setting | Value |
| --- | --- |
| Forced MIME type (`prt_mimetype`) | PDF |
| Template | HTML, as a file or inline |
| Accessible (`prt_accessible`) | Ticked. Otherwise the PDF is generated untagged, with non-embedded fonts |
| Language (`prt_lang`) | The language of the template. Avoid `ANY` when the template is written in one language |

The language of the PDF is taken, in order, from the `lang` attribute of `<html>`, then from `prt_lang`,
then from the user's language when `prt_lang` is `ANY`.

### Template skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Order [VALUE:demoOrdNumber]</title>
<style type="text/css">
[CSSRESOURCE:HTP_STYLES]
</style>
</head>
<body>
	<h1>Order [VALUE:demoOrdNumber]</h1>
	<!-- content, in reading order -->
</body>
</html>
```

- `lang` is the language of the content, and `<title>` becomes the title of the PDF.
- The reading order is the HTML order: what comes first on the page must come first in the HTML.

### Content rules

| Element | Do | Don't |
| --- | --- | --- |
| Headings | One `h1` per document, no skipped level (`h1` then `h2`, never `h1` then `h3`). Add `page-break-after: avoid` so a heading is not left alone at the bottom of a page | Bold text as a fake heading, empty headings |
| Text | `p` for paragraphs and CSS margins for spacing. `lang` on a phrase in another language (`<span lang="fr">…</span>`) | `<br/>` or empty paragraphs for spacing |
| Lists | `ul`, `ol`, and `dl` / `dt` / `dd` for label / value pairs | `-` or `1.` typed by hand |
| Tables | A header row in `thead` with `th scope="col"`, row headers with `th scope="row"`. For long tables, `table { -fs-table-paginate: paginate; }` repeats the header row on each page | Tables for layout, rows taller than a page |
| Images | Informative image: a meaningful `alt` (the encoded value for a barcode or QR code, the message for a chart with its data nearby as text). Decorative image: `alt=""` | No `alt` attribute (it is never generated), text inside an image |
| Links | Text that makes sense out of context ("Download the invoice") | "Click here" |
| Numbers and units | The unit or currency as text next to the value ("850.00 EUR") | A unit only in the column header, or drawn by CSS |
| Style | Information given by text, a symbol or a pattern, color only as a complement. Sufficient contrast and text size | Information in CSS `content:` or in `@page` margin boxes (running headers and footers, page numbers are not read). `display: flex`, grids or floats to reorder content |

The renderer does not support `display: flex` anyway, and the reading order always follows the HTML.

### Values coming from objects

- An HTML field inserted with `[VALUE:…]` brings its own markup (headings, images, tables) into the
  document: that content must follow the same rules. Prefer plain-text fields.
- Keep each label with its value: `dt` / `dd`, or `<strong>Label</strong>: value` in the same paragraph.
- An empty dynamic image is removed from the PDF. For a field of a referenced object, use the full path
  in the placeholder (`demoOrdPrdId.demoPrdPicture`), not the short name.

### What the platform does for you

- Sets the `lang` of `<html>` when missing, in the order given in [Settings](#settings), and fills the
  `<title>` and the subject (`<meta name="subject">`) from the object's display when missing.
- Tags the PDF: headings, lists, tables with their scopes, links, and figures with their `alt`.
- Adds `scope="col"` to the `th` of a `thead` that has none.
- Removes empty image placeholders, turns decorative images (`alt=""`) into artifacts, and uses the
  visible text of links as their alternative.
- Logs the problems found in the template as warnings named `Accessible PDF <Object>/<Template>`:
  missing `lang` or `title` (and the value applied instead), images without `alt`, empty or skipped
  headings, tables without `th`.

The platform never invents alternative texts, header cells or heading levels: a defect in the template is neither hidden nor repaired.

<details>
<summary>How it works</summary>

With `prt_accessible` unticked, the HTML produced by the template engine is converted with the
renderer's default settings, which gives an untagged PDF. With it ticked:

1. The HTML is parsed with [jsoup](https://jsoup.org/) and normalized as described above. Decorative
   images are replaced by an element of the same size with the image as background, which makes them
   artifacts.
2. The document is rendered by [OpenHtmlToPdf](https://github.com/openhtmltopdf/openhtmltopdf) in
   PDF/UA mode. It produces a tagged PDF (structure tree), with `/Lang`, `MarkInfo`, `DisplayDocTitle`
   and an XMP metadata stream declaring `pdfuaid:part 1`.

</details>

### What remains your responsibility

The platform checks that the structure exists, not that it makes sense. Only you can make sure that:

- **Alternative text**: an `alt` says what the image conveys here, not "image" or a file name.
- **Reading order**: the HTML order, read aloud, makes sense without the layout.
- **Headings and labels**: headings describe the section that follows, table headers describe their
  column or row, and the same word is used for the same thing.
- **Contrast and size**: the text is readable, and color is never the only carrier of information.
- **Language**: the real language of the text matches `lang`.
- **Link purpose**: each link is understandable out of context.

### Known limitations

- A table `caption` can be placed after the table in the tag tree, and an empty table footer may appear.
- PDF forms, scripts, signatures and attachments are not covered.

### Before releasing a publication

- `prt_accessible` is ticked, and `prt_lang` is set.
- The template has a `lang`, a `title`, one `h1` and no skipped heading level.
- Every data table has `th` headers, every informative image has an `alt`.

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
