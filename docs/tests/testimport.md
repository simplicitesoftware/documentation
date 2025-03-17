---
sidebar_position: 30
title: Test import
---

Test leçon
====================

```xml
<?xml version="1.0" encoding="UTF-8"?>
<simplicite xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.simplicite.fr/base" xsi:schemaLocation="http://www.simplicite.fr/base https://www.simplicite.io/resources/schemas/base.xsd">
<object>
	<name>TrnLesson</name>
	<action>upsert</action>
	<data>
		<trnLsnCatId.trnCatPath>/testsplateformetraining</trnLsnCatId.trnCatPath>
		<trnLsnPath>/testsplateformetraining/testimport</trnLsnPath>
		<trnLsnOrder>30</trnLsnOrder>	
	</data>
</object>
<object>
	<name>TrnLsnTranslate</name>
	<action>upsert</action>
	<data>
		<trnLsnPath>/testsplateformetraining/testimport</trnLsnPath>
		<trnLtrLan>*</trnLtrLan>	
		<trnLtrDescription>Description</trnLtrDescription>
		<trnLtrTitle>Titre</trnLtrTitle>
		<trnLtrContent>### Contenu</trnLtrContent>
		<trnLtrVideo>create_object.webm</trnLtrVideo>
	</data>
</object>
<object>
	<name>TrnPicture</name>
	<action>upsert</action>
	<data>
		<trnPicLsnId.trnLsnPath>/testsplateformetraining/testimport</trnPicLsnId.trnLsnPath>
		<trnPicLang>*</trnPicLang>
		<trnPicImage>formation_021.png</trnPicImage>
	</data>
	<data>
		<trnPicLsnId.trnLsnPath>/testsplateformetraining/testimport</trnPicLsnId.trnLsnPath>
		<trnPicLang>*</trnPicLang>
		<trnPicImage>formation_023.png</trnPicImage>
	</data>
</object>
</simplicite>
```