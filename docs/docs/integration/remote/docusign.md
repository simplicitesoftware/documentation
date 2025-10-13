---
sidebar_position: 60
title: DocuSign
---

Docusign integration
========================

This document applies to version 5.0 MAINTENANCE and above.

It describes how to configure [DocuSign](https://www.docusign.com/) in your business application.


Configuring credentials and libraries  
----------------------------------------

4 system parameters must be configured to enable API calls to the DocuSign service.  

- DOCUSIGN_API : Credential to use DocuSign APIs  

```json
{
	"doc": "https://developers.docusign.com/esign-rest-api/guides/authentication/oauth2-jsonwebtoken",
	"config": "test",
	"test": {
	  "userId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
	  "integratorKey": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
	  "webhookUrl": "https://xxx/docusign",
	  "baseUrl": "https://demo.docusign.net/restapi",
	  "oAuthBaseUrl": "account-d.docusign.com",
	  "replyToEmail": "xxx@xxx.xx",
	  "replyToName": "xxx"
	},
	"prod": {
	  "userId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
	  "integratorKey": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
	  "webhookUrl": "https://xxx/docusign",
	  "baseUrl": "https://eu.docusign.net/restapi",
	  "oAuthBaseUrl": "account.docusign.com",
	  "replyToEmail": "xxx@xxx.xx",
	  "replyToName": "xxx"
	}
}
```
- DOCUSIGN_LIBS : Define the DocuSign libraries to load if you want to change the default version.  
To find out which version Simplicité uses please refer to [this](https://platform.simplicite.io/6.0/site/dependencies.html)

- DOCUSIGN_PRIVATE_KEY : Docusign private Key to connect API.  
  
- DOCUSIGN_PUBLIC_KEY : Docusign public Key to connect API.      

  
Configuring DocLegal 
----------------------------------------

The Simplicité business object that manages DocuSign service calls for documents to be signed is **DocLegal** (Document menu/Legal documents).

You can either give rights on the "DocLegal" system object  to end users to give access to legal documents or create an inheritor of "DocLegal" (inheritors if needed).   
See [Inheritance documentation](/tutorial/enhancing/inheritance). You can then override the business object by creating new attributes, linking it with business objects, etc.  
> **Important**: Don't forget to also grant DocLegal's actions to your inheritor.


