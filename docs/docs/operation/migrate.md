---
sidebar_position: 28
title: Migrate
draft: true
---

This is a general guide on upgrading your Simplicité instance. 

# Backup your app

Upgrading is a process that, despite all precautions, requires the ability to perform a rollback. Therefore, ensure that you:

1. make a backup
2. test the backup

:::info

A history of published Docker images is maintained, allowing retrieval of the specific version used by a backup from the registry. However, it is strongly recommended to ensure access to the exact Docker image or Java server version corresponding to the backup.

:::