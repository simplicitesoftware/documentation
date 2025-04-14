---
sidebar_class_name: hidden
sidebar_position: 2
title: Module import
---

Module export and import
====================

To deploy an application, the necessary module(s) must be exported from the development instance and installed on the target instance. This is what the module exports and imports are for. The export consists of an XML export of the Simplicité configuration and the example resource files associated with the configuration (logo, java, CSS, JavaScript, dataset, etc.).

The export can be done :
- by generating a zip file on the platform for download
- by using the GIT mechanisms
- by calling the io layer (in command line with `curl`), to download the same zip file

The import can be done :
- by uploading the zip file via the module form
- by using the GIT mechanisms
- by calling the io layer (in command line with `curl`), to upload the same zip file
- by filling in the import specification file in json or yaml format (for specific docker images).

If it is not a module creation, but an update (a v2 for example), it is possible that *configuration elements have been deleted*. This is why the platform performs a comparison (diff) between the existing and the imported to remove these ghost objects.

<div class="warning">Beware, the diff is <strong>only</strong> done if you use the module import feature and not the more basic classic XML import feature.</div>

Exercise
====================

Classic method
---------------------------

- [instance A] export the module in zip format
- [instance B] import the module in zip format (the first time, the diff is useless, you can use the classic XML import)
- [instance B] Check the import supervision to make sure the import went well
- [instance B] Clear the cache and test the import
- [instance B] Delete the module

Git method
---------------------------

- test the import of the Demo module via the app store
- clear the cache
- observe the module configuration and the reference to the GitHub repository
