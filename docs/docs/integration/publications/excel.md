---
sidebar_position: 20
title: Excel
---

Microsoft Excel
===============

This methods are written in the object's code and called by a publication object, which MIME type must be set to XLS.

It generates simple Microsoft Excel&reg; content using the Apache POI&reg; library and its wrapper tool.

Simplest example
----------------

```java
public byte[] pubExcel(PrintTemplate pt){
	pt.setFilename(pt.getFilename().replace("[attr]", getFieldValue("attr")));
	try{
		ExcelPOITool xls = new ExcelPOITool(true);
		ExcelPOITool.ExcelSheet sheet = xls.newSheet("Feuille 1");
		sheet.addFullRow(0, new String[]{"A", "B", "C"}); // at line 0
		xls.add(sheet);
		return xls.generateToByteArray();
	}
	catch(Exception e){
		AppLog.error(getClass(), "pubExcel", "Excel generation error", e, getGrant());
		return null;
	}
}
```

SQL-query based example
-----------------------

```java
public byte[] pubExcel(PrintTemplate pt){
	//Simple Example of SQL query
	String sqlQuery = "select prd_code, prd_name, prd_stock, prd_unitprice from demo_product where prd_sup_id="+getRowId();
	int line = 0;

	pt.setFilename(pt.getFilename().replace("[attr]", getFieldValue("attr")));
	try{
		ExcelPOITool xls = new ExcelPOITool(true);
		ExcelPOITool.ExcelSheet sheet = xls.newSheet("Simple sheet");
		for(String[] row : getGrant().query(sqlQuery))
			sheet.addFullRow(line++, row);
		xls.add(sheet);
		return xls.generateToByteArray();
	}
	catch(Exception e){
		AppLog.error(getClass(), "pubExcel", "Excel generation error", e, getGrant());
		return null;
	}
}
```
