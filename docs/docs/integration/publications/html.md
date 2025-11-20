---
sidebar_position: 60
title: HTML
---

HTML publication
================

> For **text** contents the return type of method **must** be `String`

```Java
public String myPublicationMethod (PrintTemplate pt) {
	String t = getFieldValue("myTitleField");
	String out = HTMLTool.openSimplePage(t, null, null);
	out += HTMLTool.cssBlock("@media print { @page { size: portrait A4; margin: 0; }");
	out += "<h1>" + pt.getLabel() + ": " + t + "</h1>";
	out += "<p>" + getFieldValue("myHTMLContentField") + "</p>";
	out += HTMLTool.closePage();
	return out;

}
```

<details>
<summary>Click to open</summary>

```javascript
MyObject.myPublicationMethod = function(pt) {
	try {
		var t = this.getFieldValue("myTitleField");
		var out = HTMLTool.openSimplePage(t, null, null);
		out += HTMLTool.cssBlock("@media print { @page { size: portrait A4; margin: 0; }");
		out += "<h1>" + pt.getLabel() + ": " + t + "</h1>";
		out += "<p>" + this.getFieldValue("myHTMLContentField") + "</p>";
		out += HTMLTool.closePage();
		return out;
	} catch(e) {
		console.error(e);
	}
};
```

</details>
