---
sidebar_position: 95
title: MCP Tutorial
---

MCP Server Demo — Building InfraTrack
======================================

:::note[Prerequisite]

[The MCP server is enabled **AND** the `McpServer` module is installed and configured](./Installation.md)

:::

This tutorial walks through a live demo of the Simplicité MCP server. Using only natural-language prompts sent to Claude in your IDE,
you will build **InfraTrack**, an IT infrastructure management app that tracks business applications, the servers they run on, and associated backups.

Each section gives the exact prompt to use and the expected outcome.
Constraints are kept minimal to reduce the number of tool calls and keep the demo fast.
Time taken for each section is written for Claude Desktop Sonnet 5 Medium effort Thinking disallowed.

---

Create the application skeleton
------------------------------------

```text
Je veux créer une application de gestion d'infrastructure IT appelée InfraTrack sur Simplicité. Elle suit des applications métiers, les serveurs sur lesquels elles tournent, 
et les sauvegardes associées au applications. Une application peut être déployées sur plusieurs serveurs et un serveur peut avoir plusieurs applications.

! Important! Contraintes:
- Pas de templates/aires, pas de traductions d'aires
- Une seule énumération: décrivant un état, seulement les traductions françaises
- Grant Admin uniquement (à créer)
- Tout en français
```

⏱ ~2 min

:::tip[Expected result]

The LLM asks questions if necessary, creates and explains the pivot format.
The pivot format is a Markdown which mimicks a module publication. It is the trusted source,
which allows the LLM to plan and check each step of the process when generating.

:::

---

Validate the architecture
------------------------------

```text
J'ai entendu parler de modèles d'urbanisation DSI, comme TOGAF ou Archimate, est-ce que ça fait sens dans notre besoin ?
```

⏱ ~1 min

:::tip[Expected result]

The LLM explains why these frameworks are not relevant here, consistent answer observed across all runs.

:::

---

Creation
-----

```text
Le pivot me convient, génère le module dans Simplicité.
```

⏱ ~7 min

:::tip[Expected result]

The module is created, objects are fully configured

:::

Add a state model
----------------------

```text
Crée une machine d'état pour le statut d'application. Propose des transitions logiques
```

⏱ ~3 min

---

Improve the form layout
----------------------------

```text
Le formulaire pour une application n'est pas très pratique, les champs sont dans tout les sens. Améliore le
```

⏱ ~2 min

:::tip[Expected result]

Template creation for Application business object

:::

---

Enable change log
----------------------

```text
On veut l'historisation du statut de ces applications
```

⏱ ~2 min

:::tip[Expected result]

Change log on the Application object. State changes are now tracked and visible from the form.

:::

---

Add a business rule constraint
------------------------------------

```text
Sur le formulaire, quand une application est en production, rends le champ Description obligatoire.
```

⏱ ~1 min

:::tip[Expected result]

Constraint on the Application object: the Description field becomes mandatory when the status is "En production".
The state transition is blocked if the field is empty.

:::

---

Enforce a transition rule in code
--------------------------------------

```text
Empêche de passer une application à "Arrêtée" si elle est encore déployée sur au moins un serveur. Affiche un message d'erreur qui indique le nombre de serveurs concernés.
```

⏱ ~3 min

:::note

A bug causing a very long wait has been observed twice during testing. If Claude appears stuck, resend the prompt.

:::

:::tip[Expected result]

*The Application object's hook blocks the transition to "Arrêtée" when servers are still linked.
The error message includes the number of servers involved.

:::

---

Validate a field value
---------------------------

```text
On peut mettre n'importe quoi dans le champ Adresse IP. Fais en sorte de vérifier cela
```

⏱ ~2 min

:::tip[Expected result]

Validation on the Adresse IP field of the Serveur object. Invalid input is blocked with an error message.

:::

---

Create a pivot table
-------------------------

```text
Crée le tableau croisé Application par Serveur
```

---

Create a home page
------------------------

```text
Crée une homepage avec les applications en développements, les sauvegardes des 3 derniers mois, le tableau croisé Application x Serveurs et un compteur avec: app en production, serveurs
```

---

Answer business questions
-------------------------------

Once the app is built, the MCP server can answer business questions directly from the IDE.

```text
Quel serveur héberge le plus d'applications en production ?
Quelle application a connu le plus de changements de statut récents ?
Parmi nos serveurs, lesquels tournent sur un OS qui arrive en fin de support ?
Y a-t-il des CVE critiques récentes concernant les OS de nos serveurs ?
```

:::tip[Expected result]

The LLM queries the platform data and answers directly, cross-referencing
Simplicité records with its own knowledge (e.g. OS end-of-life dates, recent CVEs).

:::

The rest is up to you
-------------------------------

You can now expand the capabilities of this application. Here are few examples:

- Custom action: **Ping server**
- Create a **Host** business object
- **Deploiement** state model
- Group and reponsibilities handling
- ...
