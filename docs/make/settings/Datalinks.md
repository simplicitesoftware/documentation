---
sidebar_position: 80
title: Data links and Data Hosts
---

# Data Links and Data Hosts

## Introduction

Available as of **Simplicité® version 5.3**, the **Data Link** feature allows automatic synchronization of object data (tables) between multiple Simplicité® instances. Once linked, these remote objects behave as **local business objects**, supporting features like:

- Searches  
- Object links  
- `row_id` foreign-key joins  

## Design

### Module Setup

- **Shared module**: Objects to be synchronized must reside in a **shared functional module**, installed on all participating instances.  
- **Identical metadata**: Objects must have the **same metadata** definition to ensure data consistency across systems.  
- **Timestamps required**: Objects must use the **timestamp option** to enable differential sync. Without it, full scans will occur and degrade performance.

### Local Inheritance

Each instance can locally **extend** the shared objects in another module:
- Add custom fields (non-synchronized)
- Define local rules or behaviors
- Enhance display settings

### Hosts Configuration

All application instances must be declared as **Hosts**, each with:

| Field               | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| Host Name       | Required to distinguish **primary** vs **secondary** roles                  |
| URL            | Full REST API endpoint of the remote application                            |
| REST Credentials    | Must have **CRUD** access on synchronized objects                           |

Host identity can be set via:

- JVM property: `-Dapplication.name=MyAppName1`  
- API Hook: `Globals.setApplicationName("MyAppName1")`  
- URL override: `-Dapplication.url=https://appli1.mydomain.io` or hook `Globals.setApplicationURL(...)`  
- Fallback: system parameters `SERVER_URL`, `DIRECT_URL`, or default webapp context path
---

```java
// Example: Force an application name and URL from a startup hook
@Override
public void postPlatformInit(Grant g) {
  Globals.setApplicationName("MyAppName1");
  Globals.setApplicationURL("https://appli1.mydomain.io");
}
```
### Defining DataLinks

Each DataLink defines:

- A **relationship between hosts** (one or more **primaries**, and **secondaries**)  
- A list of **business objects to sync**, in a defined order (to respect dependencies and relations)

> ⚠️ Each network must include at least one **primary**. There can be multiple.

## Runtime

- DataLinks are loaded on **startup** or when the **cache is cleared**
- On UI-side update of an object, the **primary** synchronizes the object to all known **secondaries** **synchronously** (to maintain order)
- The synchronization uses the **standard REST API** and enforces `row_id` equality — **no data mapping needed**

### Error Recovery & Cron Job

- If a secondary is **offline** or a **network error** occurs:
  - A built-in **cron job `DataLink`** checks and resyncs data using the **last known timestamp** (`_SYNC_MASTER_<object>`)
- To force a **full resync**, delete all `_SYNC_MASTER_<object>` parameters
- In extreme scenarios (e.g. broken DB or external SQL access corruption), disable the cron and **manually copy the data** between databases using direct SQL — ensure column integrity and `row_id` consistency

## Limitations

- You **cannot choose specific fields** to sync — the entire object is always synchronized
- **Last-write-wins** model: conflicts from concurrent primaries are not handled with locks
- No cross-instance **locking** is implemented: local concurrency is still managed by `m_object_usage`

## Best Practices

- Use **inheritance** to add local, non-synced logic or fields  
- Ensure **timestamp tracking** is enabled on all synced objects  
- **Avoid hooks or rules** in synchronized objects to keep updates lightweight and fast  
- **Monitor cron jobs** and `_SYNC_MASTER_` parameters regularly  
- Define a clear **primary-secondary topology** to avoid race conditions and sync loops  
- For bulk initial loads, prefer **direct DB copy** with matching schemas and data integrity


