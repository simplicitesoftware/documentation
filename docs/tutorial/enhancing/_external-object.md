---
sidebar_class_name: hidden
sidebar_position: 240
title: External object
---

# External object

An external object is an external page (specific url) / custom HTML component that can be placed in a domain in the same way as a business object or be completely independent of the Simplicité UI.  
It can also be used to implement a specific JSON/REST service (when it inherits from the **com.simplicite.webapp.services.RESTServiceExternalObject** class).  

An external object is used to :  
- Implement a specific page within the generic UI  
- Implement a specific independent front-end in the public zone (with or without authentication)  
- By extension, deliver specific binary content such as a PDF or image  
- Implement a specific web service  

External objects can be configured from the **Interface/External Objects** menu in V5, **User Interface/External Objects** from V6.  
In V6, they are typed according to their use (Base, Responsive Page, Jquery page..., PDF, etc.).  

## Implement a specific front-end within the generic UI  

The external object is made up of at least 3 resources (HTML, CSS, SCRIPT). The object is parameterised by resources, and the create resources button generates a generic HTML page (HTML/css/JavaScript).  
The class can be placed directly in the source attribute of the object parameterisation.  

- Base: com.simplicite.util.ExternalObject. It is advisable to use the other classes in versions 5 and 6.  
- Responsive page: com.simplicite.webapp.web.ResponsiveExternalObject.  
- Web page: com.simplicite.webapp.web.WebPageExternalObject  
- Jquery page : com.simplicite.webapp.web.JQueryWebPageExternalObject (Web page + jquery)  
- Static website : com.simplicite.webapp.web.StaticSiteExternalObject (Web page + jquery)  


## Exercise
Create a simple external object that lists products on a page with their thumbnails (public without authentication).