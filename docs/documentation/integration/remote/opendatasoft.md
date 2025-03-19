---
sidebar_position: 40
title: OpenDataSoft
---

OpenDataSoft integration
========================

This document applies to version 3.0 MAINTENANCE 20 and above.

It describes how to configure [OpenDataSoft&reg;](http://www.opendatasoft.com/) (ODS) datasets as Simplicité business objects.

It also describe how to publish an ODS dataset from a Simplicité business object REST API.

ODS dataset as a service business object
----------------------------------------

To configure a remote ODS dataset the _Table_ field value must be `service-opendatasoft`.

The configuration (including dataset URL and optional credentials) of the dataset is then provided in the _Filter_ field as JSON:

```json
{
	"name": "<dataset name (required unless if you use explicit 'dataset_url' and 'search_url')>",
	"base_url": "<custom base URL, used to build both datase URL and search URL using 'name' (optional, defaults to root OpenDataSoft URL)>",
	"dataset_url": "<custom dataset metadata URL (optional, useful only if URLs based on 'base_url' and 'name' are not the right ones)>",
	"search_url": "<custom dataset search URL (optional, useful only if URLs based on 'base_url' and 'name' are not the right ones)>",
	"username": "<user name (optional, exclusive with 'apikey', only required for authenticated datasets)>",
	"password": "<user password (optional, exclusive with 'apikey', only required for authenticated datasets)>",
	"apikey": "<API key (optional, exclusive with 'username' and 'password', only required for authenticated datasets)>",
	"encoding": "<encoding (optional) defaults to UTF-8>",
	"http_timeout": "<HTTP requests timeout in milliseconds (optional, defaults to 30000)>"
}
```

Nothing else needs to be configured, except rights, as the remote dataset metadata is dynamically processed to build the local logical business object.

Remember that ODS datasets are read only data sources, configuring write access function does not make sense.

Typical usage of such service read only objects is in custom code to populate locally stored data.

<!--

ODS dataset adapter to load custom business object
--------------------------------------------------

**to be completed**

-->