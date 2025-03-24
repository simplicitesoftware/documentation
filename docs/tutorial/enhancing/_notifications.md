---
sidebar_class_name: hidden
sidebar_position: 23
title: Notifications
---

Notifications
====================

Notifications allow to alert users when an event occurs and are configured in :
- `v5` **Social/Notifications/Configuration** 
- `v6` **Interaction utilisateur/Notifications/Configuration** 

## Notifications

They :
- are linked to a business object, 
- are triggered by an action (create, update, delete) 
- can optionally have an execution condition in the form of an [expression](/docs/documentation/core/expressions).
- can be sent :
    - through multiple broadcast channels 
    - to multiple recipients
- its content is defined by language and can be overridden for a particular channel and/or recipient. 

Recipients can be concerned by all of the notification's channels or be set up individually for a more precise configuration per recipient. 

## Recepients

They can be:
- User : a named user of the platform
- Group : a group of users
- SQL : the result of an SQL query

If the notification is not mandatory, recipients have the option to **subscribe** or **unsubscribe** from the notifications they receive (via the *Subscriptions* button on their notification list).

## Channels

The following channels are available:
- **Internal** : The counter of a bell icon visible in the platform's header is updated with each new notification. Notifications are stored in a system table
- **Mail** : An email is sent to the recipients of the notification
- **Specific** : Invokes a method of the business object linked to the notification
- **Web Push** *(Simplicité v6.0+)*: Sends a push notification to the user's browser. 

> *By default, notifications are sent through all configured channels to all configured recepients, but optionally, a channel can be limited to some of the configured recipients.*

### Web push

Read more about the Push API on [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) and the [VAPID RFC](https://datatracker.ietf.org/doc/rfc8292/)

Web push notification require a set of system parameters :
- `WEBPUSH` : `yes`
- `WEBPUSH_VAPID_KEY` : generated VAPID public key
- `WEBPUSH_VAPID_PRIVATE_KEY` : generated VAPID private key
- `WEBPUSH_VAPID_MAILTO` : `mailto:<contact-email>`

To generate VAPID keys, you can use the [web-push tool](https://www.npmjs.com/package/web-push) or an [online generator](https://www.attheminute.com/vapid-key-generator)

```bash
npx web-push generate-vapid-keys
```

Exercise
====================

Create an **internal notification** that alerts users in the `TRN_ADMIN` group when an order is validated :
1. Configure the notification :
    * Name : **TrnOrderValidated**
    * Action : **Update**
    * Module : **Training**
    * Object : **TrnOrder**
    * Expression: `[OLDVALUE:trnOrdStatus] == 'P' && [VALUE:trnOrdStatus] == 'V'` *warning: the codes corresponding to the status may be different depending on your configuration* 
2. Configuration of the broadcast channels:
    * Associate the channel **Internal**
3. Content configuration:
    * Language : **English**
    * Module : **Training**
    * Subject : *empty* (corresponds to the subject of an email or the title of a Web Push notification)
    * Content: `The [VALUE:trnOrdNumber] order has been validated`.
4. Configuration of the recipients : 
    * Order: **10**
    * Type: **Group**
    * Group: **TRN_ADMIN**
5. Synchronise notification recipients
    * Click on the **Synchronise Recipients** action available on the list of notifications. This action allows to generate a subscription for each one of the Notification's recipients.
6. Add the **NOTI_READER** group to the **TRN_ADMIN** Profile
7. Clear the cache

Exercise (autonomous)
====================

* Create a notification that alerts users in the **TRN_READONLY** group when the **stock of a product** becomes **lower than 10**. Users should receive an **mail** and an **internal** notification. 
**The content of the email must be different from the content of the internal notification.