---
sidebar_position: 28
title: Migrate
draft: true
---

This is a general guide on upgrading your Simplicité instance. 

# Backup your app

An upgrade, even with all the measures we take to ensure it goes smoothly, is an operation that requires the ability to do a rollback, so make sure to:

1. make a backup
2. test the backup

:::info

We keep a history of our published docker images, so you should be able to find the exact version your backup was using in our registry, but as a general rule, you should make sure to have access to the exact docker image / java server 

:::