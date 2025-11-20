---
sidebar_position: 30
title: NodeRED nodes
---

Node-RED tooling
=============

About Node-RED
--------------

[Node-RED](http://nodered.org) is a low-code, flow-based programming tool for wiring together hardware devices, APIs, and online services.

<details>
<summary>Use cases examples for Node-RED</summary>

Good use cases:

- Home automation: Node-RED can be used to easily create flows that connect and control various smart home devices, such as lights,
  thermostats, and security cameras.
- IoT data processing: Node-RED can be used to process and analyze data from IoT devices, such as temperature sensors,
  and trigger actions based on that data.
- Prototyping and experimentation: Node-RED's low-code, flow-based approach makes it an ideal tool for quickly prototyping
  and experimenting with different ideas and workflows.
- Integration of systems and services: Node-RED can be used to integrate different systems and services, such as email, SMS, and social media,
  and automate the flow of data between them.

Bad use cases:

- Large-scale, enterprise applications: Node-RED is not designed to handle the complexity and scalability requirements of large-scale,
  enterprise applications. It is more suited for small to medium-sized projects.
- Real-time systems: While Node-RED can handle real-time data, it is not optimized for it, and other tools might be more
  appropriate for real-time systems with high performance requirements.
- Data-intensive applications: Node-RED is not designed to handle large amounts of data, and other tools might be more appropriate for data-intensive applications.
- Mission-critical systems: Node-RED is not recommended for use in mission-critical systems where high availability and fault-tolerance are required,
  as it is built on top of JavaScript and Node.js, which are not designed for high availability.

</details>

Library
-------

Simplicité's library of nodes is available on [this GitHub repository](https://github.com/simplicitesoftware/nodered-nodes).
It is presently a proof of concept with three nodes:

- **simplicite-config:** configure the connection to the Simplicité instance
- **simplicite-session:** triggers authentication to fetch auth token
- **simplicite-object:** CRUD operations on Simplicité Business Objects

An [basic example project](https://github.com/simplicitesoftware/nodered-demo) is also available on GitHub.
