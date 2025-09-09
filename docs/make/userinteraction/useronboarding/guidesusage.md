---
sidebar_position: 30
title: Guides Usage
---

# Guides Usage

## What is Guides Usage?

In Simplicité [version 6.3](/versions/release-notes/v6-3), **Guides Usage** provides visibility into how onboarding guides are actually used by end-users.  

It tracks **who played a guide, when, and how far they went**, and aggregates this data into **[pivot tables](/make/userinterface/objectsrendering/pivot-table)** for managers or administrators.  

With Guides Usage, you can:
- Measure **adoption of guides** after a release.  
- Track **completion rates**.  
- Identify **inactive users**.  
- Compare usage across **dates, users, and guides**.  


## How to Access Guides Usage?

Access to **Guides Usage** is restricted:  

- Users must have the `GUIDE_MAKER` responsibility.  
- They must also have read access to the **DomainSocialUser** domain.  

Without this domain access, the usage data (user names, logins, history) will not be visible, even if the user has the `GUIDE_MAKER` responsibility.  
 
The menu is available from **User interaction > User onboarding** in the application navigation.  


## Guides Usage List

The list displays **tracking events** for each guide launch:

- **Date** – when the guide was played.  
- **Guide Name** – identifier of the guide.  
- **Guide Target Object** – the context where the guide was launched (e.g. a business object, dashboard...etc.).  
- **User Login / User Name** – the user who played the guide.  
- **Last Step** – last step reached (completed or interrupted).  


## Guides Usage pivot tables 

Beyond the list, **pivot table** summarize adoption.
By monitoring Guides Usage, administrators and project managers can:
- Ensure onboarding content is actually used.  
- Validate whether guides **help reduce support requests**.  
- Plan **updates to guides** if adoption is low.  

### Metrics by User
A **pivot table (User × Guide)** displays how many times each user played each guide.

### Metrics by Date
A **time-based pivot table** highlights period of activity, showing how often guides were used within a given timeframe (day, week, month).  





