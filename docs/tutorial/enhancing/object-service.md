---
sidebar_class_name: hidden
sidebar_position: 24
title: Service Object
---

Service object
====================

A "service" object is a object whose data is based on a service call.   
The name of its table will be **service**.  

It is used to make a service call in order to obtain data without storing it in the database.  
The most common use case is to query the referential database services (country database, municipality database, etc.) without having to duplicate the data.  
As many attributes need to be associated with the service object as are returned by the service call, and the names of the attributes need to be mapped to the names received in the flow.    

The service object is seen by the platform as a business object.  
Its class inherits from **com.simplicite.util.ObjectService**.  

The hooks to be implemented are **loadServiceConfig**,**countService()**, **searchService**, **selectService**, **createService**, **updateService**,**deleteService**.  

<div class="information">The service-opendata, service-salesforce, service-ldap, service-rest and service-servicenow objects are special cases of service objects integrated into the platform (the named hooks have been implemented). All you need to do is set the configuration in the object's filter or implement the loadServiceConfig hook.</div>


Exercise
====================

- Create a service object to display codes and region names using the https://geo.api.gouv.fr/decoupage-administratif/regions#regions-list service.  

The base is a dataset that provides all the codes and region names without pagination.  
Implement the hooks used to list and display the data in a form.  

Take things further : Paginated list
---------------------------
* Make the list paginated.  
* Add a relationship between regions and suppliers to determine the regions supplied by suppliers.
