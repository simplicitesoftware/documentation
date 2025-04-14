---
sidebar_position: 180
title: GDPR guidelines
---

GDPR guidelines
===============

Introduction
------------

Out of the box, the Simplicité platform **software** (refered as "the platform" in the rest of this document) does not manage any private data.

The only out of the box business object which has some potentially private data fields is the `User` business object level (see below),
but out of the box the platform is only configured with anonymous technical users.

The platform is designed to process the data you configure in it which may include some private data. It is your sole responsibility to comply
with <abbr title="General Data Protection Regulation ">GDPR</abbr> (<abbr title="Règlement Général sur la Protection des Données">RGPD</abbr> in french) regarding this potential private data you have decided to manage with Simplicité. The following guidelines are dedicated to help
you in this task.

> **Note**: all data configured in the platform is physically stored in the database(s) you have configured for it.
> These databases are **external software components** from the point of view of the the platform.
> In other words the platform itself does not store any data.

Business data
-------------

When you configure business data (typically business objects and associated buisness fields) you should trace
whether this data is a private data. E.g. by indicating it explicitly in the description of the business object, business
process, field etc.

Another approach is to extend the configuration of the system objects (e.g. the `Field` business object) to add some
structured information to classify the type of managed data (e.g. mark each field as `Personal`, `Private` or `Intimate`).
One this coofiguration extension is done, and the corresponding classification data is entered on your field, you can easily
build exports/reports on this information.

> **Edit**: As of platform version **4.0 release 21** such a basic classification has been added to the `Field` object.
> It allows you to tell if a given field holds:
>
> - _Personal_ data (e.g. name, date of birth, ...),
> - _Confidential_ data (e.g. bank account number, password, ...)
> - _Intimate_ data (e.g. political prefrences, ...)
>
> The `User` fields indicated below have been classified as an example.
>
> You are still free to extend this basic classification to your needs as this field is not used in the platform's core engine.

Users
-----

### User data

The `User` business object has several fields that can be considered as private data:

- login (field `usr_login`) - **required**
- firstname (field `usr_first_name`) - optional
- lastname (field `usr_last_name`) - optional
- picture (field `usr_iamge_id`) - optional
- email (field `usr_email`) - optional
- work phone number (field `usr_work_num`) - optional
- mobile/cellular phone number (field `usr_cell_num`) - optional
- home phone number (field `usr_home_num`) - optional
- address (fields `usr_address1`, `usr_address2`, `usr_zipcode`, `usr_city`, `usr_state` nd `usr_country`) - optional

> **Note**: out of the box the platform is only configured with 2 anonymous technical users (`designer` and `public`)
> the other users are business data as any other business data.

### Business data user-timestamping

Timestamped business objects have two technical fields (`created by` and `updated by`) which holds
the login of the user who has created/updated the considered record.

You can implement specific business logic to erase/anonymize this timestamping data if required.

Social posts
------------

The social posts (globals or associated to business object records) are linked to the `User` business object
by the `pstUserId` reference field.

Social posts can be globally inhibited or at a business object per business object level.

You can also implement specific business logic to erase/anonymize this social post data if required.

Logging
-------

### Database logs

The platform's logging mechnisms are configured by default to use the login as string identifier
of the user who is attached to the log entry.

In the log business object `AppLogger` records there is a text field that holds the login `log_user`.

#### Technical logs

In the technical logs the login is present as plain text on each line. Ex (in this example the login is `designer`)

```plaintext
2018-08-28 15:35:00,479 INFO [com.simplicite.util.CronJob] SIMPLICITE|http://dev.simplicite.io:10278||ICORECM005|designer|com.simplicite.util.CronJob|run||Job processed
```

You can configure the default `log4j2.xml` file to change this behavior.
