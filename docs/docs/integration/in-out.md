---
sidebar_position: 5
title: Data in / Data out
---

Data in / Data out
====================

This page serves as a summary of all different methods to :
- import or use external data (**data in**)
- export or expose internal data (**data out**)

```mermaid
flowchart TD
    A[File Upload]
    B[Custom Adapter]:::custom
    K[Default Adapter]:::sim
    C((Simplicité App)):::sim
    D[3rd party API]
    E[API call]:::custom
    F[Service Object]:::sim
    G[3rd party DB]
    H[Select Object]:::sim
    I[3rd party Simplicité]
    J[DataLink]:::sim
    M[Publication]:::custom
    N[File Download]
    O[Default APIs]:::sim
    P[OpenAPI]:::sim
    Q[SOAP]:::sim
    R[Raw]:::sim
    S[Custom API]:::custom
    T[3rd party App]
    U[Remote Object]:::sim
    subgraph Importing
        A-->B
        A-->K
        D-->E
        D-->F
        G-->H
        I-->U
        I-->J
    end
        B-->C
        K-->C
        E-->C
        F-->C
        H-->C
        U-->C
        J-->C
        C-->M
        C-->O
        C-->S
    subgraph Exporting
        M-->N
        O-->P-->T
        O-->Q-->T
        O-->R-->T
        S-->T
    end
    classDef sim fill:#33c86e,stroke-width:0,color:#fff;
    classDef custom fill:#4185de,stroke-width:0,color:#fff;
```

Data in
---------------------------

### Importing data

#### Custom import

In a non-specific manner, it is possible to retrieve a file from an object / action / webservice and use Java's mechanisms to read and import the data.

#### Adapters 

An adapter is a tool that "adapts" the data from a file to the business data model. It typically reads a file (CSV, Excel, etc) line by line to integrate the data, or transform it in Simplicité's formalized XML format. Its advantages compared to a custom import is that Adapter provide additional tools and services : 
- helper Adapter classes for various formats : CSV, JSON, XML, etc 
- pre-built mechanism for line-by-line logging
- import supervision object with logs and stats

There are built-in adapters for standard Simplicité formats, but you'll generally need to build your own adapters for your custom formats. [Read the full adapter documentation here](/make/settings/adapters.md)

### Using data

#### API calls

Data usage is generally done through consuming external APIs. Simplicité integrates several tools to make thoses calls, from basic to advanced:
- [Simplicité RestTool class](https://platform.simplicite.io/current/javadoc/com/simplicite/util/tools/RESTTool.html)
- [Unirest library](https://kong.github.io/unirest-java/#requests)
- [Apache HttpClient library](https://hc.apache.org/httpcomponents-client-4.5.x/index.html)

#### Service Objects

A service object (also known as remote object) draws the data from an API instead of the database. They aim at providing the same UI as normal objects, and must be configured in a similar way: an object with a template and attributes.

At the moment there are 4 built-in service objects that don't require any coding:
- Remote Simplicité Object: based on a Simplicité object in another instance
- LDAP Object
- SalesForce Objects
- OpenDataSoft Objects

As there are limited built-in service objects, developers are often required implement a **Custom Service Object** to code the object's API calls for basic CRUD operations by extending the [ObjectService class](https://platform.simplicite.io/current/javadoc/com/simplicite/util/ObjectService.html)

#### Select Objects (secondary database)

It is possible to declare secondary datasources, and then configure objects that will make requests on those datasources instead of the main one. This will give you full functionality, except that obviously it will be impossible to make relationships between those objects as the platform will be unable to make `JOIN` requests between the datasources.

Data out
---------------------------

### Exporting data

#### Publications

Publications offer a standardized way to export data in any format. 

Please refer to the [publication tutorial](/tutorial/expanding/publication) and the publication examples in the [Tips and Tricks category in the forum](https://community.simplicite.io/t/tips-and-tricks-list/2112#integration-adapters-importing-data-publications-exporting-data-webservices-exposing-data-4)

### Exposing data

There is ample documentation about the different ways of exposing data. 

The built-in webservices are :
- [REST Services](/docs/integration/webservices/rest-services) (described in a Swagger/OpenAPI formal in the module exports)
- [SOAP Services](/docs/integration/webservices/soap-services)
- [Raw Services](/docs/integration/webservices/raw-services)

It is also possible to write your own APIs through dedicated External Objects, as documented in [Custom Services](/docs/integration/webservices/custom-services) and [this tip'n'trick](https://community.simplicite.io/t/custom-webservice-example/1970)




