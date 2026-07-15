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
Time taken for each section is written for Claude Code using Sonnet 5 model with Medium effort.

---

1\. Create the application skeleton
------------------------------------

```text
On veut créer une application de gestion d'infrastructure IT appelée InfraTrack sur Simplicité. Elle suit des applications métiers, les serveurs sur lesquels elles tournent, 
et les sauvegardes associées aux applications. Une application peut être déployée sur plusieurs serveurs et un serveur peut avoir plusieurs applications.
Une application a un statut: en développement, en production, en maintenance, arrêtée

Crée aussi un scope InfraAdmin qui porte la responsabilité administrateur.

! Important! Contraintes:
- Format pivot obligatoire
- Pas de templates/aires, pas de traductions d'aires
- Pas de règles métier pour l'instant, seulement le squelette
- Une seule énumération (statut de l'application), pas de modèle d'état
- Grant Admin uniquement (à créer)
- Tout en français (pas besoin de remplir les libellés ENU)
```

⏱ ~2 min

:::tip[Expected result]

The LLM asks questions if necessary, creates and explains the pivot format.
The pivot format is a Markdown which mimicks a module publication. It is the trusted source,
which allows the LLM to plan and check each step of the process when generating.

:::

---

2\. Validate the architecture
------------------------------

```text
J'ai entendu parler de modèles d'urbanisation DSI, comme TOGAF ou Archimate, est-ce que ça fait sens dans notre besoin ?
```

⏱ ~15 sec

:::tip[Expected result]

The LLM explains why these frameworks are not relevant here, consistent answer observed across all runs.

:::

---

3\. Creation
-----

```text
Le pivot me convient, génère le module dans Simplicité.
```

Explication plus en détail du format pivot.

⏱ ~4 min

:::tip[Expected result]

The module is created, objects are fully configured

:::

4\. Add a state model
----------------------

```text
Crée une machine d'état pour le statut d'application. Propose des transitions logiques
```

⏱ ~3 min

---

5\. Improve the form layout
----------------------------

```text
Le formulaire pour une application n'est pas très pratique, les champs sont dans tout les sens. Améliore le, en créant une zone avec les informations générales, et une zone avec la description.
```

⏱ ~3 min

:::tip[Expected result]

Template creation for Application business object

:::

---

6\. Enable change log
----------------------

```text
On veut l'historisation du statut de ces applications
```

⏱ ~2 min

:::tip[Expected result]

Change log on the Application object. State changes are now tracked and visible from the form.

:::

---

7\. Add a business rule constraint
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

8\. Enforce a transition rule in code
--------------------------------------

```text
Empêche de passer une application à "Arrêtée" si elle est encore déployée sur au moins un serveur. Affiche un message d'erreur qui indique le nombre de serveurs concernés.
```

⏱ ~2 min

:::

:::tip[Expected result]

*The Application object's hook blocks the transition to "Arrêtée" when servers are still linked.
The error message includes the number of servers involved.

:::

---

9\. Validate a field value
---------------------------

```text
On peut mettre n'importe quoi dans le champ Adresse IP. Fais en sorte de vérifier cela
```

⏱ ~1 min

:::tip[Expected result]

Validation on the Adresse IP field of the Serveur object. Invalid input is blocked with an error message.

:::

---

10\. Create a pivot table
-------------------------

```text
Crée le tableau croisé Application par Serveur
```

⏱ ~1 min

:::tip[Expected result]

Ask the LLM to create some test data to have some values to look at in the pivot table

:::

---

11\. Create a home page
------------------------

```text
Crée une homepage avec les applications en développements, les sauvegardes des 3 derniers mois, le tableau croisé Application x Serveurs et un compteur avec: app en production, serveurs
```

⏱ ~2 min

---

12\. Answer business questions
-------------------------------

Once the app is built, the MCP server can answer business questions directly from the chat.

```markdown
Quel serveur héberge le plus d'applications en production ?
Quelle application a connu le plus de changements de statut récents ?
 
Parmi nos serveurs, lesquels tournent sur un OS qui arrive en fin de support ?
Y a-t-il des CVE critiques récentes concernant les OS de nos serveurs ?
```

:::tip[Expected result]

The LLM queries the platform data and answers directly, cross-referencing
Simplicité records with its own knowledge (e.g. OS end-of-life dates, recent CVEs).

:::

Next steps
-------------------------------

The capabilities of this application can be further expanded depending on specific infrastructure needs. Potential enhancements include:

- **Infrastructure extension**: Creation of a Host business object to track cloud providers or physical datacenters.

- **Lifecycle management**: Implementation of a Déploiement state model to orchestrate staging, validation, and production environments.

- **Access control**: Integration of custom user groups and specific responsibilities to restrict modifications to infrastructure components.

- **Automation**: Configuration of automated actions to verify server availability or trigger backup routines.
