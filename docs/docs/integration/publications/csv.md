---
sidebar_position: 30
title: CSV
---

CSV
===

This example produces a dummy CSV:

```java
public String info(PrintTemplate pt) {
	try {
		//configure publication
		pt.setMIMEType(HTTPTool.MIME_TYPE_CSV);
		pt.setFilename("filename.csv");

		//csv building tools
		CSVTool csvt = new CSVTool(';', '"');
		StringBuilder csv = new StringBuilder();

		//add one example row
		csv.append(csvt.serialize(new String[]{"A", "B", "C"})).append("\n");

		return csv.toString();
	} catch (Exception e) {
		pt.setMIMEType(HTTPTool.MIME_TYPE_TXT);
		return e.getMessage();
	}
}
```
