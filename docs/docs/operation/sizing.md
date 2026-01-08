---
sidebar_position: 27
title: Sizing
---

Infrastructure sizing recommendations
========

:::info

**TL;DR :** Simplicité does not provide fixed sizing recommendations for production apps. Use standard Java webapp practices and adapt to your workloads.

:::

Factors
-------

Sizing an infrastructure—RAM, disk, CPUs, etc.—depends mostly on the application itself rather than the platform.

A number of factors can impact resource requirements:

- Database type and location
- Volume and nature of data
- Backup operations
- Number of simultaneous users (both normal and peak)
- Usage patterns
- Number of business objects managed by the application
- Heavy processing tasks, such as batch loads or large computations
- High API traffic or unusual third-party usage
- High availability requirements
- Other environment-specific constraints

Development and test environments
----------------------------------

:::danger

These are meant for dev/test workloads only and **do not apply to production**, especially where backups and scalability matter.

:::

For small-scale environments with few users and limited datasets, **rough VM sizing guidelines** are:

| VM Size | RAM   | Disk  | vCPU | Approx. # of Dev/Test Instances |
|---------|-------|-------|------|---------------------------------|
| Small   | 4 GB  | 20 GB | 2    | ~5 instances + databases        |
| Medium  | 8 GB  | 40 GB | 4    | ~10 instances + databases       |
| Large   | 16 GB | 80 GB | 8    | ~20 instances + databases       |

Production environments
------------------------

There’s no one-size-fits-all for production, nor is the data we have on our client's sizings sufficient to give recommendations.

Best practices:

1. Reserve dev/test sizing for low-load environments only
2. Use scalable infrastructure
3. Document usage and growth expectations to support future adjustments
4. Proceed with regular & realistic high-load benches (with expected maximal number of concurrent users + representative use case scenarii & think times)
   to define/maintain the appropriate sizing for your application
