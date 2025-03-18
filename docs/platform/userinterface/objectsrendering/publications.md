---
sidebar_position: 20
title: Publications
---

# Publication

## What is a Publication ?

Simplicité provides exporting by default:
- lists in CSV, Excel and PDF format
- forms in Excel and ZIP format (with attachments)

This is often not enough, and Simplicité has built-in mechanisms for generating specific exports. These are called publications. The result of a publication typically fits into one of the following options:
- HTML page
- Microsoft Office file (Excel, Word)
- raw text file (txt, csv, markdown)
- structured data file (JSON, XML, YAML)

A publication consists in filling a template with data. The template may be **fixed** or **dynamically constructed**. The data can be **focused on a single business object** (including via joined fields), or can be **spread throughout the model**.

Publications can be of three types, depending on the type of template used :
- **a Simplicité template :** a template stored in the "Template" configuration object. *This alternative is deprecated*
- **a template file :** a template stored in a file, and containing **Simplicité expressions**. The template will be parsed, and expressions of type `[VALUE:trnPrdName]` will be replaced. Be aware that these expressions are executed in the context of the calling business object, so it is not possible to use data from other objects. *This solution is suitable for the most basic cases and allows you to avoid writing code*.
- **invoking a method of the object:** the method returns a `String` or a `byte[]` depending on the type of publication. This solution allows an infinite range of publications via the Java API. As a parameter to the method, a `PrintTemplate` object is passed which allows, for example, a dynamic file name to be calculated.

### Multiple records publications

Most of the examples presented here are dummy cases. For your app, you'll need to be aware that the user might have selected a set of rows to export, all the rows, etc, so you might have to load corresponding rows doing the following:

```Java
List<String[]> rows = new ArrayList();
List<String> ids = getSelectedIds();
if (!Tool.isEmpty(ids)) {
	for (int k = 0; k < ids.size(); k++) {
		if (select(ids.get(k))){
			rows.add(getValues());
		}else {
			rows = search(false);
		}
	}
}
```