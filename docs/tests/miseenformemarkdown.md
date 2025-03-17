---
sidebar_position: 10
title: Mise en forme markdown
---

Ceci est un test des différents éléments qu'il faut pouvoir mettre en forme:

Hello world


Inline
====================
*italique*

**gras**

[Lien](#ancre)

`inline code` 

Listes
====================
- non numérotées
- non numérotées

1. numérotées
1. numérotées

Titres (niv 1)
====================
## Titre 2
### Titre 3
#### Titre 4

Séparateur
====================

---

Image (à tester avec image jointe)
====================

![alt text](https://simplicite.fr/wp-content/uploads/img/Logo_Simplicite_Website.svg)


Table
====================

| Syntax | Description |
| ----------- | ----------- |
| Header | Title |
| Paragraph | Text | 

Java code syntax highlighting
====================

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

HTML code
====================
```html
<div class='alert alert-success'>Webpage publication pattern example</div>
<div class="container">
    <table class="table table-striped table-hover">
		{{#rows}}
		<tr>
			<td>{{fieldName}}</td>
		</tr>
		{{/rows}}
	</table>
</div>
```

Blockquotes
====================

> Dorothy followed her through many of the beautiful rooms in her castle.
>
>> The Witch bade her clean the pots and kettles and sweep the floor and keep the fire fed with wood.

The rendered ou

<h3 id="ancre">Titre avec ancre (#ancre)</h3>

test

Special blocks
====================

> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.

Collapsable
====================

<details>
<summary>Click to see</summary>

```javascript
console.log('nice code')
```

</details>


iluwsdgkf
Carousel control
====================

[Clicking this link will change image in carousel](#IMG_CLICK_formation_021.png)

[Scrolling until this link will change image in carousel](#IMG_SCROLL_formation_021.png) ([see POC here](https://jsfiddle.net/scampano/f9atmsrn/51))


