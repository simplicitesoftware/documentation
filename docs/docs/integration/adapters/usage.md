---
sidebar_position: 50
title: Usage
---

Adapter usage
=============

As a reminder, adapters can be:

- used directly through the **XML imports** page
- called by code typically through and **action** or an **external object**

Custom business object action to submit object data to an adapter
-----------------------------------------------------------------

You can configure a business object custom action that submits some of your text field content to an adapter.

```java
public String myAction() {
	byte[] data = getFieldValue("myTextField").getBytes();
	// Or for a document field:
	// byte[] java = getField("myDocumentField").getDocument().getBytes(true);
	Message res = new Integration().importADP(this.getGrant(), "MyAdapter", new ByteArrayInputStream(data), getName(), null);
	return "<pre>" + res.getResultLog() + "</pre>"
};
```

Custom page (external object) to submit form data to adapter
------------------------------------------------------------

You can configure a simple custom page (external object) that displays an upload form for submitting a file to an adapter:

```Java
public String form(Parameters params){
	String form = "uploadform";
	int tab = 1;
	String h = HTMLTool.openSimpleMultipartForm(form, params.getLocation());
	h += "<table class=\"workform\" style=\"width: 100%;\">";
	h += "<tr><td class=\"workfieldname\"><div class=\"workfieldname\">" + getGrant().T("UPLOAD") + "</div></td>";
	h += "<td class=\"workfield\"><div class=\"workfield\">";
	h += HTMLTool.fileInput(form, "file", 80, tab++) + "&nbsp;";
	h += HTMLTool.submit(form, "ok", getGrant().T("OK"), null, "buttonaction", tab++);
	h += "</div></td></tr></table>";
	h += HTMLTool.closeForm(form);
	return h;
}

@Override
public String display(Parameters params) {
	Grant g = getGrant();
	if (params.getMethod() == "GET") {
		return form(params);
	} else {
		String m = "";
		try {
			DocParam file = params.getDocument("file");
			if (Tool.isEmpty(file.getData())) throw new Exception("No data");
			Message res = new Integration().importADP(g, "MyAdapter", new ByteArrayInputStream(file.getData()), file.getPath(), null);
			m += "<div class=\"workinfo\">Your file has been uploaded!</div>";
			m += "<pre class=\"mono\" style=\"max-height: 300px; overflow: auto;\">" +"\n" + res.getResultLog() + "</pre>";
		} catch(Exception e) {
			m += "<div class=\"workerror\">" + e.getMessage() + "</div>";
		}
		return m + form(params);
	}
}
```

<details>
<summary>Rhino equivalent</summary>

```javascript
MyExternalObject.form = function(params) {
	var form = "uploadform";
	var tab = 1;
	var h = new HTMLTool.openSimpleMultipartForm(form, params.getLocation());
	h += "<table class=\"workform\" style=\"width: 100%;\">";
	h += "<tr><td class=\"workfieldname\"><div class=\"workfieldname\">" + this.getGrant().T("UPLOAD") + "</div></td>";
	h += "<td class=\"workfield\"><div class=\"workfield\">";
	h += HTMLTool.fileInput(form, "file", 80, tab++) + "&nbsp;";
	h += HTMLTool.submit(form, "ok", this.getGrant().T("OK"), null, "buttonaction", tab++);
	h += "</div></td></tr></table>";
	h += HTMLTool.closeForm(form, "file", "ok");
	return h;
};

MyExternalObject.display = function(params) {
	var g = this.getGrant();
	if (params.getMethod() == "GET") {
		return MyExternalObject.form.call(this, params);
	} else {
		var m = "";
		try {
			var file = params.getDocument("file");
			if (Tool.isEmpty(file.data)) throw new Exception("No data");
			var res = new Integration().importADP(g, "MyAdapter", new ByteArrayInputStream(data), file.path, null);
			m += "<div class=\"workinfo\">Your file has been uploaded!</div>";
			m += "<pre class=\"mono\" style=\"max-height: 300px; overflow: auto;\">" + res.getAdapterLog() + "\n" + res.getResultLog() + "</pre>"
		} catch(e) {
			m += "<div class=\"workerror\">" + e.message + "</div>"
		}
		return m + MyExternalObject.form.call(this, params);
	}
};
```

</details>

Instead of a file upload input, you can adapt this example to use a `<textarea>` to provide input data.

:::note

This custom page only offers a subset of the features available out of the box in the more complex _XML import_ page of the generic UI.

:::
