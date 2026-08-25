---
sidebar_position: 20
title: Compliance
unlisted: true
slug: /unlisted/compliance
---

Détail des critères
===================

:::info

Afin d'être cohérent avec la langue de rédaction du RGAA, ce document est écrit en **français**.
Une version **anglaise** est disponible [en cliquant ici](/unlisted/compliance_en) ; il s'agit d'une traduction,
certaines notions du référentiel peuvent y perdre en précision.

:::

Nature et périmètre de ce document
----------------------------------

### Ce que ce document est

Ce document expose le **positionnement de Simplicité Software** sur les 106 critères du
[RGAA 4.1.2](https://accessibilite.numerique.gouv.fr/), appliqués au **socle de la plateforme** en version 7.

Il ne s'agit pas d'un audit : il ne porte pas sur un échantillon de pages d'une application donnée,
mais sur les composants, écrans et comportements fournis nativement par la plateforme, tels qu'ils sont
générés indépendamment de toute configuration métier.

L'accessibilité numérique fait l'objet d'un travail continu de notre R&D. Ce positionnement reflète
l'état de la plateforme à la date indiquée ci-dessous et est réévalué à chaque version majeure.

> **Dernière évaluation** : `08/2026` — plateforme version `7-alpha`

### Périmètre évalué

Les positionnements portent sur l'ensemble des briques natives de la plateforme :

- l'authentification et les écrans associés ;
- la page d'accueil et le plan du site ;
- les menus, barres de navigation et fil d'Ariane ;
- les listes et tableaux d'objets, ainsi que leurs barres d'actions et de filtres ;
- les formulaires, les champs et leurs sous-champs ;
- les modales, boîtes de dialogue et messages système ;
- la recherche globale et les recherches contextuelles ;
- les paramètres et préférences utilisateur.

### Ce que ce document ne couvre pas

Le **taux de conformité** au sens de la déclaration d'accessibilité ne peut être établi qu'application par
application, sur un échantillon de pages représentatif, et relève de l'organisme qui exploite l'application.
Le présent document constitue une base de travail pour cet exercice, il ne s'y substitue pas.

Ne sont pas couverts non plus les contenus et développements ajoutés par les designers ou les utilisateurs
finaux : objets externes, HTML personnalisé, thèmes sur mesure, images et documents métier.
Ces cas sont identifiés critère par critère via la colonne **Périmètre**, et détaillés dans la section
[Exceptions et composants hors-contexte](#exceptions-et-composants-hors-contexte).

Comprendre le contexte Simplicité
---------------------------------

Cette section s'adresse en particulier aux auditeurs externes. Le contexte technique de la plateforme
diffère nettement de celui d'un site web classique, cible principale du RGAA, et cette différence
conditionne la lecture de plusieurs critères.

### Une plateforme de génération d'applications

Simplicité est un éditeur de logiciel : la plateforme ne produit pas un site, elle produit un **socle**
à partir duquel des **designers** (les développeurs et concepteurs d'applications, côté client ou côté
intégrateur) construisent des applications métier. Les écrans ne sont pas écrits à la main mais **générés**
à partir d'un modèle de données et d'un paramétrage.

Deux conséquences directes :

1. Un même composant natif est réutilisé dans des centaines de contextes différents. Une correction
   d'accessibilité sur ce composant bénéficie à toutes les applications ; à l'inverse, un défaut s'y
   propage tout aussi largement.
2. La plateforme ne maîtrise pas le contenu injecté dans ces composants. Un libellé de champ, une image
   métier ou un intitulé d'action sont définis par le designer, et leur pertinence lui incombe.

### Une application monopage

Les applications Simplicité sont des **applications monopages** (SPA) : la navigation ne provoque pas de
changement d'URL ni de rechargement du document. L'équivalent fonctionnel d'un changement de page est le
remplacement de la majeure partie de la zone de contenu principal (la section `#work`).

Ce fonctionnement est explicité pour les critères concernés, notamment ceux relatifs à la navigation
(thématique 12) et aux éléments obligatoires (thématique 8). Les actions de navigation sont
systématiquement portées par des liens, afin de conserver la distinction sémantique entre navigation et
action, et de retrouver les repères habituels d'un site web.

### Des applications hautement interactives

Les applications générées reposent massivement sur des formulaires, des listes, des processus métier et
des échanges de documents entre utilisateurs. Cette densité d'interaction demande un effort de R&D
supérieur à celui d'un site de contenu, et une attention particulière lors des audits : un composant
peut se comporter différemment selon le contexte d'appel, l'état de l'objet ou les droits de
l'utilisateur.

### Répartition des responsabilités

La conformité d'une application livrée résulte de trois contributions distinctes.

| Acteur | Responsabilité |
| ------ | -------------- |
| **La plateforme** | Rendre accessibles tous les composants natifs et fournir aux designers les mécanismes permettant de conformer leurs contenus. |
| **Le designer** | Utiliser ces mécanismes correctement : libellés pertinents, alternatives textuelles des images métier, contrastes des thèmes personnalisés, conformité des objets externes. Les règles et bonnes pratiques sont détaillées dans [l'aide aux designers](/unlisted/designer). |
| **L'utilisateur final** | Renseigner les alternatives des contenus qu'il dépose (images, documents) lorsque l'application le lui permet. |

Certains éléments échappent structurellement à toute vérification par la plateforme : code des objets
externes, HTML personnalisé, addons JavaScript, thèmes sur mesure. Ils sont listés dans la section
[Exceptions et composants hors-contexte](#exceptions-et-composants-hors-contexte).

Fonctionnalités d'accessibilité de la plateforme
-----------------------------------------------

Au-delà de la mise en conformité des composants, la plateforme fournit quatre dispositifs dédiés,
agissant à trois niveaux : l'utilisateur final, l'administrateur et le designer. Plusieurs
positionnements du présent document en dépendent explicitement. Leur mise en œuvre est détaillée dans
[l'aide aux designers](/unlisted/designer).

### Le mode d'accessibilité (`a11y-mode`)

Ce mode est activable et désactivable à tout moment par l'utilisateur final, depuis un bouton dédié de
l'en-tête de l'application. Il adapte ou inhibe les comportements d'interface susceptibles de gêner ou
d'empêcher l'usage de l'application via une technologie d'assistance, sans dégrader l'expérience des
utilisateurs qui n'en ont pas besoin.

Les comportements pris en charge sont :

- les en-têtes flottants des formulaires et des listes ;
- les couleurs personnalisées des boutons d'action et des états ;
- le découpage de la zone de travail en panneaux redimensionnables ;
- le mode compact ;
- le repli du menu ;
- l'affichage des listes en mosaïque ;
- les tiroirs et indicateurs issus des objets à statut ;
- les recherches prédéfinies proposées depuis la boîte de dialogue de recherche ;
- le menu horizontal.

:::warning

Ce mode est un filet de sécurité sur des fonctionnalités non structurantes. Il ne corrige pas les
composants identifiés comme non conformes dans [l'aide aux designers](/unlisted/designer) : une
application soumise à une exigence stricte de conformité doit désactiver ces composants à la
conception, indépendamment de l'activation du mode par l'utilisateur.

:::

### La surcharge par utilisateur (`A11Y_OVERRIDE`)

Ce paramètre utilisateur constitue un niveau intermédiaire : il permet de neutraliser au cas par cas,
pour un utilisateur donné et à sa demande, des composants qui n'ont pas pu être rendus conformes en
raison de leur complexité ou de leurs dépendances tierces.

Les composants concernés sont :

- les sélecteurs de date, remplacés par une saisie textuelle accompagnée d'une indication de format ;
- l'éditeur HTML enrichi ;
- les éditeurs de code ;
- les tiroirs, dont l'usage repose exclusivement sur le glisser-déposer ;
- le menu horizontal, dont les menus surgissants enchaînés posent des difficultés de navigation au
  clavier et de restitution vocale ;
- les couleurs personnalisées, en filet de sécurité sur les contrastes des actions et des énumérations ;
- les guides utilisateur, dont le déroulement par fenêtres surgissantes pose les mêmes difficultés.

### Le thème `HighContrast`

Ce thème, décliné en versions claire et sombre, n'utilise que des nuances de la palette Simplicité
présentant des contrastes élevés, et augmente les espacements afin de faciliter la lecture visuelle
des éléments. Il garantit la conformité des critères de contraste et de visibilité de la prise de focus
sans intervention du designer.

### L'aide à la conception (`A11Y_DEV`)

Ce paramètre système, destiné aux designers, affiche pendant la conception une pastille à côté de
l'intitulé de chaque champ, indiquant par sa couleur le niveau de conformité RGAA de la fonctionnalité
correspondante : non évaluée, non conforme, partiellement conforme, ou conforme. L'absence de pastille
signale une fonctionnalité que les critères du référentiel ne concernent pas.

Un designer soumis à une exigence de conformité dispose ainsi, au moment où il construit ses écrans,
de l'information nécessaire pour écarter les fonctionnalités non conformes et paramétrer correctement
celles qui ne le sont que partiellement.

Méthodologie et lecture des tableaux
------------------------------------

### Base de référence

Les vérifications ont été menées avec l'environnement suivant :
`[à compléter : navigateurs et lecteurs d'écran utilisés, ex. Firefox + NVDA, Safari + VoiceOver]`

Les écarts constatés lors d'un audit mené sur une base de référence différente peuvent être discutés
à partir de cette déclaration.

### Protocoles particuliers

Certains critères sont vérifiés selon un protocole explicite, rappelé ici plutôt que répété dans chaque
justification :

- **Agrandissement du texte (10.4)** : fenêtre de 1280 px de large, zoom navigateur à 200 %, vérification
  de l'absence de troncature, de chevauchement et de perte de fonctionnalité.
- **Redimensionnement du contenu (10.11)** : contenu présenté sans défilement bidirectionnel dans une
  fenêtre de 320 px de large et de 256 px de haut.
- **Espacement du texte (10.12)** : application via feuille de styles utilisateur d'un interlignage de
  1,5, d'un espacement des lettres de 0,12 em, d'un espacement des mots de 0,16 em et d'une marge de
  paragraphe de 2 em, puis vérification de l'absence de perte de contenu ou de fonctionnalité.

### Statuts

Seuls les trois statuts du RGAA sont employés. Un statut est un verdict figé : il ne renseigne pas sur
les travaux en cours.

| Statut | Signification |
| ------ | ------------- |
| <rgaa-c>**Conforme**</rgaa-c> | Le critère est respecté sur l'ensemble du périmètre évalué. |
| <rgaa-nc>**Non Conforme**</rgaa-nc> | Au moins un cas relevant du périmètre évalué ne respecte pas le critère. |
| <rgaa-na>**Non Applicable**</rgaa-na> | Le critère ne trouve pas d'objet dans le périmètre évalué. |

### Périmètres

La colonne **Périmètre** indique qui porte la conformité du critère. Elle ne modifie pas le statut :
elle précise ce que le statut recouvre.

| Périmètre | Signification |
| --------- | ------------- |
| **Socle** | Garanti par la plateforme, sans condition. |
| **Socle configuré** | Garanti dès lors qu'une option documentée est active (thème `HighContrast`, `a11y-mode`). La condition est rappelée en tête de justification. |
| **Partagé** | La plateforme fournit le mécanisme, le designer ou l'utilisateur doit l'utiliser correctement. |
| **Designer** | Hors de portée de la plateforme : le résultat dépend entièrement des développements du designer. |

### Répartition des positionnements

Sur les 106 critères du RGAA 4.1.2 : **61 conformes**, **15 non conformes**, **30 non applicables** au
socle — soit **80,3 %** des critères applicables.

Cet indicateur mesure la couverture du socle, et non la conformité d'une application livrée. Cette
dernière dépend également des choix de conception du designer et de son respect des règles fournies
dans [l'aide aux designers](/unlisted/designer) : une application construite sur un socle conforme peut
ne pas l'être, et l'écart se situe alors dans les critères de périmètre **Partagé** ou **Designer**.

Thématiques
-----------

### 1. Images

| Critère | Intitulé | Statut | Périmètre | Justification |
| ------- | -------- | ------ | --------- | ------------- |
| 1.1 | Chaque image porteuse d'information a-t-elle une alternative textuelle ? | <rgaa-c>**Conforme**</rgaa-c> | Partagé | Les images générées par le socle sont majoritairement décoratives ; celles qui portent une information disposent toutes d'une alternative. Les images métier, déposées par les designers ou les utilisateurs, disposent d'un sous-champ `alt` que la plateforme met à leur disposition et dont le renseignement leur incombe. |
| 1.2 | Chaque image de décoration est-elle correctement ignorée par les technologies d'assistance ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Les images décoratives générées par le socle sont pourvues d'un `alt` vide et dépourvues de `title` ; les icônes vectorielles et le contenu généré équivalent sont neutralisés par `aria-hidden="true"`. |
| 1.3 | Chaque image porteuse d'information ayant une alternative textuelle, cette alternative est-elle pertinente ? | <rgaa-c>**Conforme**</rgaa-c> | Partagé | Les alternatives des images du socle décrivent l'information portée par l'image. Pour les images métier, la plateforme ne dispose d'aucune méta-information sur le contenu déposé : la pertinence de l'alternative relève nécessairement de celui qui dépose l'image. |
| 1.4 | Pour chaque image utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative permet-elle d'identifier la nature et la fonction de l'image ? | <rgaa-nc>**Non Conforme**</rgaa-nc> | Partagé | Un CAPTCHA peut être activé sur l'écran d'authentification, au choix du designer. Lorsqu'il l'est, l'alternative textuelle ne permet pas d'en identifier la nature et la fonction. Lorsqu'il ne l'est pas, le critère est non applicable à l'application concernée. |
| 1.5 | Pour chaque image utilisée comme CAPTCHA, une solution d'accès alternatif au contenu ou à la fonction du CAPTCHA est-elle présente ? | <rgaa-nc>**Non Conforme**</rgaa-nc> | Partagé | Aucun mécanisme d'accès alternatif n'est proposé lorsque le CAPTCHA est activé. Même remarque que pour le critère `1.4` concernant les applications ne l'activant pas. |
| 1.6 | Chaque image porteuse d'information a-t-elle, si nécessaire, une description détaillée ? | <rgaa-nc>**Non Conforme**</rgaa-nc> | Partagé | Aucune image du socle ne nécessite de description détaillée. En revanche, une image métier qui en nécessiterait une ne peut pas s'en voir attribuer : le mécanisme n'existe pas à ce jour. |
| 1.7 | Chaque image porteuse d'information ayant une description détaillée, cette description est-elle pertinente ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Aucune description détaillée ne peut être associée à une image, la question de sa pertinence est donc sans objet. |
| 1.8 | Chaque image texte porteuse d'information, en l'absence d'un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée ? | <rgaa-nc>**Non Conforme**</rgaa-nc> | Partagé | Le socle n'utilise aucune image texte. Une image texte déposée comme image métier ne dispose d'aucun mécanisme de remplacement au-delà de son attribut `alt`. |
| 1.9 | Chaque légende d'image est-elle, si nécessaire, correctement reliée à l'image correspondante ? | <rgaa-na>**Non Applicable**</rgaa-na> | Partagé | Le socle n'associe jamais de légende visible à une image : il n'existe donc aucune légende à relier. Le critère redevient applicable dès qu'un designer place un texte de légende à proximité d'une image dans un contenu HTML personnalisé ; le couple `<figure>` / `<figcaption>` doit alors être utilisé. |

:::info

Les utilisateurs et les designers peuvent inclure dans leurs applications des images dont la plateforme
ne connaît ni le contenu ni la finalité. Le renseignement de l'attribut `alt` leur revient donc lorsque
l'image est porteuse d'information ; la responsabilité de la plateforme porte sur les images qu'elle
place elle-même dans l'interface, ainsi que sur la mise à disposition du mécanisme.

:::

### 2. Cadres

| Critère | Intitulé | Statut | Périmètre | Justification |
| ------- | -------- | ------ | --------- | ------------- |
| 2.1 | Chaque cadre a-t-il un titre de cadre ? | <rgaa-nc>**Non Conforme**</rgaa-nc> | Socle | Le socle emploie un cadre pour la visualisation des documents. La présence systématique d'un titre de cadre n'est pas garantie à ce jour ; le positionnement est établi par précaution. |
| 2.2 | Pour chaque cadre ayant un titre de cadre, ce titre de cadre est-il pertinent ? | <rgaa-nc>**Non Conforme**</rgaa-nc> | Socle | Conséquence directe du critère `2.1`. |

### 3. Couleurs

| Critère | Intitulé | Statut | Périmètre | Justification |
| ------- | -------- | ------ | --------- | ------------- |
| 3.1 | Dans chaque page web, l'information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | L'information portée par un élément est systématiquement disponible sous forme textuelle : intitulé visible, contenu du composant, ou nom accessible. La couleur intervient toujours en complément d'un de ces vecteurs, jamais seule. |
| 3.2 | Dans chaque page web, le contraste entre la couleur du texte et la couleur de son arrière-plan est-il suffisamment élevé ? | <rgaa-c>**Conforme**</rgaa-c> | Socle configuré | _Sous réserve de l'application du thème `HighContrast`._ Ce thème garantit des rapports de contraste conformes sur l'ensemble des éléments du socle. Pour les éléments dont la couleur reste paramétrable — états, boutons d'action — un vérificateur de contraste est intégré à l'interface de paramétrage, permettant au designer de valider ses choix au moment où il les fait. |
| 3.3 | Dans chaque page web, les couleurs utilisées dans les composants d'interface ou les éléments porteurs d'informations sont-elles suffisamment contrastées ? | <rgaa-c>**Conforme**</rgaa-c> | Socle configuré | _Sous réserve de l'application du thème `HighContrast`._ Mêmes dispositions que pour le critère `3.2`. |

:::info

Un thème personnalisé sort du périmètre garanti par la plateforme : les couleurs étant entièrement
variabilisées et surchargeables, la conformité des contrastes relève alors du designer. Le vérificateur
de contraste intégré est disponible à chaque point de personnalisation pour l'y aider.

:::

### 4. Multimédia

| Critère | Intitulé | Statut | Périmètre | Justification |
| ------- | -------- | ------ | --------- | ------------- |
| 4.1 | Chaque média temporel pré-enregistré a-t-il, si nécessaire, une transcription textuelle ou une audiodescription ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Le socle n'intègre aucun média temporel ni non temporel. |
| 4.2 | Pour chaque média temporel pré-enregistré ayant une transcription textuelle ou une audiodescription, celles-ci sont-elles pertinentes ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Idem `4.1`. |
| 4.3 | Chaque média temporel synchronisé pré-enregistré a-t-il, si nécessaire, des sous-titres synchronisés ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Idem `4.1`. |
| 4.4 | Pour chaque média temporel synchronisé pré-enregistré ayant des sous-titres synchronisés, ces sous-titres sont-ils pertinents ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Idem `4.1`. |
| 4.5 | Chaque média temporel pré-enregistré a-t-il, si nécessaire, une audiodescription synchronisée ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Idem `4.1`. |
| 4.6 | Pour chaque média temporel pré-enregistré ayant une audiodescription synchronisée, celle-ci est-elle pertinente ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Idem `4.1`. |
| 4.7 | Chaque média temporel est-il clairement identifiable ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Idem `4.1`. |
| 4.8 | Chaque média non temporel a-t-il, si nécessaire, une alternative ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Idem `4.1`. |
| 4.9 | Pour chaque média non temporel ayant une alternative, cette alternative est-elle pertinente ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Idem `4.1`. |
| 4.10 | Chaque son déclenché automatiquement est-il contrôlable par l'utilisateur ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Aucun son n'est déclenché par le socle. |
| 4.11 | La consultation de chaque média temporel est-elle, si nécessaire, contrôlable par le clavier et tout dispositif de pointage ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Idem `4.1`. |
| 4.12 | La consultation de chaque média non temporel est-elle contrôlable par le clavier et tout dispositif de pointage ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Idem `4.1`. |
| 4.13 | Chaque média temporel et non temporel est-il compatible avec les technologies d'assistance ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Idem `4.1`. |

:::info

Un média intégré à une application par un designer, via un contenu HTML personnalisé ou un objet
externe, rend cette thématique applicable à l'application concernée. Sa conformité relève alors
entièrement du designer.

:::

### 5. Tableaux

| Critère | Intitulé | Statut | Périmètre | Justification |
| ------- | -------- | ------ | --------- | ------------- |
| 5.1 | Chaque tableau de données complexe a-t-il un résumé ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Les listes d'objets peuvent présenter des structures d'en-têtes relevant du tableau de données complexe. Un élément `caption`, masqué visuellement, porte systématiquement le résumé du tableau. |
| 5.2 | Pour chaque tableau de données complexe ayant un résumé, ce résumé est-il pertinent ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Le résumé est généré de façon déterministe à partir de la structure réelle du tableau : nombre et répartition des colonnes et des lignes, fonctions disponibles. Il décrit donc l'organisation du tableau, et non son contenu, conformément à l'objet du critère. |
| 5.3 | Pour chaque tableau de mise en forme, le contenu linéarisé reste-t-il compréhensible ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Le socle n'emploie aucun tableau à des fins de mise en forme : toutes les mises en page reposent sur des styles. |
| 5.4 | Pour chaque tableau de données ayant un titre, le titre est-il correctement associé au tableau de données ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Le titre est porté par un attribut `aria-label` sur l'élément de tableau, reprenant le nom de l'objet listé. Cette méthode est l'une de celles admises par le test 5.4.1. Le titre et le résumé sont ainsi portés par deux mécanismes distincts, conformément à la distinction faite par le référentiel entre les critères `5.1` et `5.4`. |
| 5.5 | Pour chaque tableau de données ayant un titre, ce titre est-il pertinent ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Le titre identifie sans ambiguïté ce que contient le tableau : les instances de l'objet métier concerné, dont les champs constituent les en-têtes de colonnes. |
| 5.6 | Pour chaque tableau de données, chaque en-tête de colonnes et chaque en-tête de lignes sont-ils correctement déclarés ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Les en-têtes sont déclarés au moyen d'éléments `th` natifs, générés par la structure de rendu des listes. |
| 5.7 | Pour chaque tableau de données, la technique appropriée permettant d'associer chaque cellule avec ses en-têtes est-elle utilisée ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Les en-têtes portent un attribut `scope` (`col` ou `row` selon leur portée). Les attributs WAI-ARIA de tableau ne sont employés que dans les cas relevant du tableau de données complexe, conformément à la restriction du test 5.6.4. |
| 5.8 | Chaque tableau de mise en forme est-il dépourvu de balises de structuration propres aux tableaux de données ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Conséquence directe du critère `5.3` : en l'absence de tableau de mise en forme, le critère est sans objet. |

### 6. Liens

| Critère | Intitulé | Statut | Périmètre | Justification |
| ------- | -------- | ------ | --------- | ------------- |
| 6.1 | Chaque lien est-il explicite ? | <rgaa-c>**Conforme**</rgaa-c> | Partagé | Chaque lien généré par le socle dispose d'un nom accessible permettant d'en comprendre la fonction et la destination, porté par son intitulé visible ou, lorsque celui-ci est insuffisant, par un attribut `aria-label`. L'attribut `title` n'est plus employé à cette fin. Les libellés issus du paramétrage — noms d'objets, intitulés d'actions — sont définis par le designer, à qui incombe leur caractère explicite. |
| 6.2 | Dans chaque page web, chaque lien a-t-il un intitulé ? | <rgaa-c>**Conforme**</rgaa-c> | Partagé | Aucun lien généré par le socle n'est dépourvu de nom accessible, y compris les liens réduits à une icône. |

### 7. Scripts

| Critère | Intitulé | Statut | Périmètre | Justification |
| ------- | -------- | ------ | --------- | ------------- |
| 7.1 | Chaque script est-il, si nécessaire, compatible avec les technologies d'assistance ? | <rgaa-nc>**Non Conforme**</rgaa-nc> | Socle | Ce critère est transversal à l'ensemble de l'interface : dans une application monopage, la quasi-totalité des composants est produite ou pilotée par des scripts. Les composants du socle ont fait l'objet d'un travail systématique sur les rôles, états et propriétés WAI-ARIA, et la majorité d'entre eux satisfait le critère. Certains composants complexes ou reposant sur des bibliothèques tierces — éditeurs de texte enrichi, éditeurs de code, sélecteurs de date — ne peuvent en revanche pas être déclarés compatibles en l'état. Le critère étant global, la présence de ces composants suffit à le placer en non-conformité. Les dispositifs `a11y-mode` et `A11Y_OVERRIDE` permettent de les neutraliser, et [l'aide aux designers](/unlisted/designer) précise, composant par composant, ceux qu'une application soumise à une exigence stricte doit écarter. |
| 7.2 | Pour chaque script ayant une alternative, cette alternative est-elle pertinente ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Aucun script du socle ne dispose d'une alternative au sens du référentiel : l'accessibilité est recherchée dans le composant lui-même plutôt que par une version de remplacement. Le critère, conditionné à l'existence d'une alternative, est donc sans objet. |
| 7.3 | Chaque script est-il contrôlable par le clavier et par tout dispositif de pointage ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Tous les déclencheurs de script sont atteignables et actionnables au clavier comme au pointeur : accès, déclenchement, validation, annulation et sortie. Les composants de navigation — menu principal, menu secondaire, menus déroulants — suivent les modèles de conception WAI-ARIA correspondants, avec navigation aux flèches directionnelles et activation par `Entrée` ou `Espace`. L'ensemble des raccourcis clavier est documenté dans [l'aide aux designers](/unlisted/designer). |
| 7.4 | Pour chaque script qui initie un changement de contexte, l'utilisateur est-il averti ou en a-t-il le contrôle ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Aucun changement de contexte n'est déclenché par la prise de focus ni par la modification de la valeur d'un champ : la saisie dans un formulaire ne provoque aucune action applicative. Les ouvertures de modales, les changements de zone de travail et les navigations résultent tous d'une action explicite de l'utilisateur. |
| 7.5 | Dans chaque page web, les messages de statut sont-ils correctement restitués par les technologies d'assistance ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Les messages de statut sont porteurs de rôles adaptés à leur nature : `alert` pour les messages d'erreur et les avertissements requérant une attention immédiate, `progressbar` pour les indicateurs de chargement, `status` et `log` pour les retours d'information non urgents et les messages successifs. |

### 8. Éléments obligatoires

| Critère | Intitulé | Statut | Périmètre | Justification |
| ------- | -------- | ------ | --------- | ------------- |
| 8.1 | Chaque page web est-elle définie par un type de document ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Le document généré comporte systématiquement la déclaration `<!DOCTYPE html>`, en première ligne et sans commentaire la précédant. |
| 8.2 | Pour chaque page web, le code source généré est-il valide selon le type de document spécifié ? | <rgaa-c>**Conforme**</rgaa-c> | Partagé | Le code produit par les composants natifs est valide au regard de la spécification HTML. Les contenus HTML personnalisés et les objets externes, insérés dans le document par le designer, échappent à cette vérification. |
| 8.3 | Dans chaque page web, le code source contient-il un attribut de langue par défaut ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | L'élément racine du document porte un attribut `lang`. |
| 8.4 | Pour chaque page web ayant un attribut de langue par défaut, cet attribut est-il pertinent ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | L'attribut reflète la langue effectivement utilisée par l'interface, et il est mis à jour lorsque l'utilisateur change la langue de l'application. |
| 8.5 | Chaque page web a-t-elle un titre de page ? | <rgaa-c>**Conforme**</rgaa-c> | Partagé | Le titre du document est construit selon le motif « nom de l'application — contenu courant », et actualisé à chaque changement de contenu principal. Le nom de l'application est défini par le designer. |
| 8.6 | Pour chaque page web ayant un titre de page, ce titre est-il pertinent ? | <rgaa-c>**Conforme**</rgaa-c> | Partagé | Le titre permet d'identifier à la fois l'application et le contenu consulté, et donc de distinguer l'onglet parmi d'autres. Sa pertinence dépend du nom d'application retenu par le designer. |
| 8.7 | Dans chaque page web, chaque changement de langue est-il indiqué dans le code source ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | L'interface est affichée dans une seule langue à la fois. Le sélecteur de langue lui-même ne constitue pas une exception : les langues proposées y sont désignées dans la langue courante de l'interface — un utilisateur en français lit « français » et « anglais », un utilisateur en anglais lit « french » et « english ». Aucun passage de texte n'est donc rédigé dans une langue différente de celle du document. |
| 8.8 | Dans chaque page web, le code de langue de chaque changement de langue est-il valide et pertinent ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Conséquence directe du critère `8.7`. |
| 8.9 | Dans chaque page web, des balises ne sont-elles pas utilisées uniquement à des fins de présentation ? | <rgaa-c>**Conforme**</rgaa-c> | Partagé | Les balises de structuration ont été retirées de tous les usages purement présentationnels du socle. Les contenus HTML personnalisés introduits par les designers ne sont pas vérifiables par la plateforme. |
| 8.10 | Dans chaque page web, les changements du sens de lecture sont-ils signalés ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Le socle ne produit aucun changement de sens de lecture. |

### 9. Structuration de l'information

| Critère | Intitulé | Statut | Périmètre | Justification |
| ------- | -------- | ------ | --------- | ------------- |
| 9.1 | Dans chaque page web, l'information est-elle structurée par l'utilisation appropriée de titres ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | La hiérarchie de titres est volontairement resserrée sur trois niveaux, appliqués de façon déterministe : `h1` pour le contenu principal de la zone de travail, `h2` pour les contenus secondaires, `h3` pour les modales et boîtes de dialogue. Cette hiérarchie ne comporte aucun saut de niveau, et chaque passage de texte fonctionnant visuellement comme un titre est balisé en conséquence. |
| 9.2 | Dans chaque page web, la structure du document est-elle cohérente ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Les zones d'en-tête, de navigation, de contenu principal et de pied de page sont respectivement portées par les éléments `header`, `nav`, `main` et `footer`. |
| 9.3 | Dans chaque page web, chaque liste est-elle correctement structurée ? | <rgaa-nc>**Non Conforme**</rgaa-nc> | Socle | Le menu principal, le plan du site et les listes de contenu emploient les éléments de liste appropriés. Les menus déroulants, en revanche, ne sont pas tous structurés correctement à ce jour. |
| 9.4 | Dans chaque page web, chaque citation est-elle correctement indiquée ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Le socle ne propose aucun mécanisme d'insertion de citation. |

### 10. Présentation de l'information

| Critère | Intitulé | Statut | Périmètre | Justification |
| ------- | -------- | ------ | --------- | ------------- |
| 10.1 | Dans le site web, des feuilles de styles sont-elles utilisées pour contrôler la présentation de l'information ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Le socle n'emploie ni balise ni attribut de présentation : la totalité de la mise en forme est portée par des feuilles de styles externes, à l'exclusion de tout élément `style` en ligne. |
| 10.2 | Dans chaque page web, le contenu visible porteur d'information reste-t-il présent lorsque les feuilles de styles sont désactivées ? | <rgaa-nc>**Non Conforme**</rgaa-nc> | Socle | Certaines icônes et certains compteurs sont portés par du contenu généré en CSS, et disparaissent donc lorsque les feuilles de styles sont désactivées. |
| 10.3 | Dans chaque page web, l'information reste-t-elle compréhensible lorsque les feuilles de styles sont désactivées ? | <rgaa-nc>**Non Conforme**</rgaa-nc> | Socle | Conséquence du critère `10.2`. Le besoin utilisateur visé par ce critère — que l'information et les relations soient portées par le balisage plutôt que par la présentation — est couvert par ailleurs, aux critères `1.1`, `7.5`, `9.1`, `9.3` et `10.9`, et vérifié via l'arbre d'accessibilité, qui ne dépend pas des feuilles de styles. Aucune information nécessaire à la réalisation d'une tâche ne repose exclusivement sur ce mécanisme. La correction consiste à doubler le contenu généré par un équivalent textuel masqué visuellement. |
| 10.4 | Dans chaque page web, le texte reste-t-il lisible lorsque la taille des caractères est augmentée jusqu'à 200% au moins ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Vérifié selon le protocole décrit plus haut : aucune troncature, aucun chevauchement ni perte de fonctionnalité à 200 %. |
| 10.5 | Dans chaque page web, les déclarations CSS de couleurs de fond d'élément et de police sont-elles correctement utilisées ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Toute déclaration de couleur d'arrière-plan est accompagnée d'une déclaration de couleur de texte, et réciproquement. |
| 10.6 | Dans chaque page web, chaque lien dont la nature n'est pas évidente est-il visible par rapport au texte environnant ? | <rgaa-c>**Conforme**</rgaa-c> | Socle configuré | _Sous réserve de l'application du thème `HighContrast`._ Les liens dont la nature ne ressort pas du contexte — liens au sein des listes, actions de redirection — reçoivent un traitement visuel aligné sur celui des liens courants. Un thème personnalisé qui surchargerait ces styles relève du designer. |
| 10.7 | Dans chaque page web, pour chaque élément recevant le focus, la prise de focus est-elle visible ? | <rgaa-c>**Conforme**</rgaa-c> | Socle configuré | _Sous réserve de l'application du thème `HighContrast`._ Ce thème définit un style de prise de focus pour l'ensemble des éléments focusables. |
| 10.8 | Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d'assistance ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Les contenus masqués sont neutralisés pour les technologies d'assistance, et les contenus destinés à ces seules technologies sont masqués visuellement sans être retirés de l'arbre d'accessibilité. |
| 10.9 | Dans chaque page web, l'information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle respectée ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Aucune information du socle n'est portée exclusivement par la forme, la taille ou la position d'un élément. |
| 10.10 | Dans chaque page web, l'information ne doit pas être donnée par la forme, taille ou position uniquement. Cette règle est-elle implémentée de façon pertinente ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Les indications de forme, taille ou position sont systématiquement doublées d'une information textuelle ou d'un nom accessible. |
| 10.11 | Pour chaque page web, les contenus peuvent-ils être présentés sans perte d'information ou de fonctionnalité et sans avoir recours soit à un défilement vertical pour une fenêtre ayant une hauteur de 256 px, soit à un défilement horizontal pour une fenêtre ayant une largeur de 320 px ? | <rgaa-nc>**Non Conforme**</rgaa-nc> | Partagé | Les composants du socle adoptent un comportement adapté aux petites surfaces — empilement des éléments, réorganisation des listes, des barres d'actions et des menus — mais la couverture de tous les cas n'a pas été établie à ce jour. Ce critère relève par ailleurs pour partie du designer : une mise en page de formulaire construite sans considération pour les petites surfaces peut le mettre en défaut indépendamment du socle. |
| 10.12 | Dans chaque page web, les propriétés d'espacement du texte peuvent-elles être redéfinies par l'utilisateur sans perte de contenu ou de fonctionnalité ? | <rgaa-nc>**Non Conforme**</rgaa-nc> | Socle | Vérifié selon le protocole décrit plus haut : l'application des valeurs d'espacement entraîne des pertes de contenu sur certains composants. |
| 10.13 | Dans chaque page web, les contenus additionnels apparaissant à la prise de focus ou au survol d'un composant d'interface sont-ils contrôlables par l'utilisateur ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Les seuls contenus concernés sont les bulles d'aide des formulaires et des listes. Elles apparaissent à la prise de focus et disparaissent dès que le focus quitte l'élément déclencheur, sans masquer ce dernier. |
| 10.14 | Dans chaque page web, les contenus additionnels apparaissant via les styles CSS uniquement peuvent-ils être rendus visibles au clavier et par tout dispositif de pointage ? | <rgaa-nc>**Non Conforme**</rgaa-nc> | Socle | Certains contenus additionnels dépendent encore d'un état CSS déclenché au seul survol, sans équivalent à la prise de focus. |

### 11. Formulaires

| Critère | Intitulé | Statut | Périmètre | Justification |
| ------- | -------- | ------ | --------- | ------------- |
| 11.1 | Chaque champ de formulaire a-t-il une étiquette ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Tous les contextes de saisie sont couverts — formulaire d'objet, recherche, saisie en liste, modales de confirmation. L'étiquette est portée soit par un élément `label` associé au champ, soit par un nom accessible équivalent lorsque l'intitulé visible ne peut pas être associé structurellement. |
| 11.2 | Chaque étiquette associée à un champ de formulaire est-elle pertinente ? | <rgaa-c>**Conforme**</rgaa-c> | Partagé | L'étiquette reprend l'intitulé du champ tel que défini dans le modèle de données. Sa pertinence dépend donc de la qualité des libellés retenus par le designer. |
| 11.3 | Dans chaque formulaire, chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée plusieurs fois dans une même page ou dans un ensemble de pages est-elle cohérente ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Les champs de même fonction reproduits dans plusieurs contextes — champ de recherche d'une liste, recherche globale, sélecteur d'objet lié — reçoivent des étiquettes identiques, générées par le même mécanisme. En saisie sur liste, chaque champ reçoit un nom accessible reprenant la ligne concernée, ce qui le distingue de ses homologues sans rompre la cohérence des intitulés. |
| 11.4 | Dans chaque formulaire, chaque étiquette de champ et son champ associé sont-ils accolés ? | <rgaa-c>**Conforme**</rgaa-c> | Partagé | Le rendu par défaut place l'étiquette au contact de son champ. Ce placement peut être défaits par une mise en page de formulaire qui dissocierait les deux ; [l'aide aux designers](/unlisted/designer) proscrit cette pratique. |
| 11.5 | Dans chaque formulaire, les champs de même nature sont-ils regroupés, si nécessaire ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Les boutons radio et les cases à cocher de même nature sont regroupés structurellement dans l'ensemble des contextes de saisie. |
| 11.6 | Dans chaque formulaire, chaque regroupement de champs de même nature a-t-il une légende ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Le regroupement est doté d'une légende, portée soit par un élément `legend`, soit par le nom accessible du conteneur lorsque celui-ci porte un rôle de groupe. |
| 11.7 | Dans chaque formulaire, chaque légende associée à un regroupement de champs de même nature est-elle pertinente ? | <rgaa-c>**Conforme**</rgaa-c> | Partagé | La légende reprend l'intitulé du champ dont les options constituent le groupe. Même réserve que pour le critère `11.2`. |
| 11.8 | Dans chaque formulaire, les items de même nature d'une liste de choix sont-ils regroupés de manière pertinente ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Les listes de choix issues d'énumérations hiérarchisées produisent les regroupements correspondants. |
| 11.9 | Dans chaque formulaire, l'intitulé de chaque bouton est-il pertinent ? | <rgaa-c>**Conforme**</rgaa-c> | Partagé | Les boutons du socle portent un intitulé décrivant l'action réalisée. Les actions personnalisées sont intitulées par le designer. |
| 11.10 | Dans chaque formulaire, le contrôle de saisie est-il utilisé de manière pertinente ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Les erreurs de saisie sont signalées textuellement, le champ en cause est identifié, et le message d'erreur est restitué aux technologies d'assistance via un message de statut. |
| 11.11 | Dans chaque formulaire, le contrôle de saisie est-il accompagné, si nécessaire, de suggestions facilitant la correction des erreurs de saisie ? | <rgaa-c>**Conforme**</rgaa-c> | Partagé | La plateforme permet d'associer nativement une aide à la saisie à chaque champ, restituée avec le message d'erreur ; son renseignement relève du designer. Lorsque le mode d'accessibilité remplace un sélecteur de date par une saisie textuelle, l'indication du format attendu est fournie automatiquement. |
| 11.12 | Pour chaque formulaire qui modifie ou supprime des données, ou qui transmet des réponses à un test ou à un examen, ou dont la validation a des conséquences financières ou juridiques, les données saisies peuvent-elles être modifiées, mises à jour ou récupérées par l'utilisateur ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Les données enregistrées via un formulaire restent consultables et modifiables par la suite dans ce même formulaire, sous réserve des droits de l'utilisateur. Les suppressions font l'objet d'une confirmation explicite préalable. |
| 11.13 | La finalité d'un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l'utilisateur ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Les seuls champs collectant des données relatives à l'utilisateur lui-même se trouvent sur l'écran d'authentification ; leur finalité y est correctement déclarée. Les champs des formulaires métier portent sur des données de tiers et n'entrent pas dans le champ de ce critère. |

### 12. Navigation

| Critère | Intitulé | Statut | Périmètre | Justification |
| ------- | -------- | ------ | --------- | ------------- |
| 12.1 | Chaque ensemble de pages dispose-t-il de deux systèmes de navigation différents, au moins ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | La plateforme fournit nativement un menu de navigation et un plan du site, auxquels s'ajoute la recherche globale lorsqu'elle est activée. Le fil d'Ariane n'est pas compté parmi ces systèmes : son fonctionnement est historique plutôt que hiérarchique, et il ne relève pas des systèmes reconnus par le référentiel. |
| 12.2 | Dans chaque ensemble de pages, le menu et les barres de navigation sont-ils toujours à la même place ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Le menu et les barres de navigation sont persistants et conservent leur position quel que soit le contenu affiché dans la zone de travail. |
| 12.3 | La page « plan du site » est-elle pertinente ? | <rgaa-c>**Conforme**</rgaa-c> | Partagé | Le plan du site reprend l'ensemble des éléments de navigation et des actions de premier et de second niveau accessibles depuis la page d'accueil : actions et raccourcis de l'en-tête, entrées des menus, éléments de la page d'accueil, liens du pied de page. Il est construit à partir de ce que le designer a déclaré comme devant y figurer : son exhaustivité dépend donc en partie de ce paramétrage. |
| 12.4 | Dans chaque ensemble de pages, la page « plan du site » est-elle accessible à partir de n'importe quelle page ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Le plan du site est atteignable depuis le pied de page, persistant quel que soit le contenu affiché. |
| 12.5 | Dans chaque ensemble de pages, le moteur de recherche est-il accessible à partir de n'importe quelle page ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Lorsqu'elle est activée, la recherche globale est atteignable depuis l'en-tête, persistant quel que soit le contenu affiché. |
| 12.6 | Les zones de regroupement de contenus présentes dans plusieurs pages web (zones d'en-tête, de navigation principale, de contenu principal, de pied de page et de moteur de recherche) peuvent-elles être atteintes ou évitées ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Chaque zone est délimitée par l'élément de structure correspondant et atteignable par un lien d'évitement dédié. Des raccourcis clavier documentés permettent en outre de rejoindre directement le menu, la recherche globale, la première liste visible ou la zone suivante. |
| 12.7 | Dans chaque page web, un lien d'évitement ou d'accès rapide à la zone de contenu principal est-il présent ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Des liens d'évitement sont présents en tête de document vers la zone de travail ainsi que vers l'en-tête, le menu principal et le pied de page. |
| 12.8 | Dans chaque page web, l'ordre de tabulation est-il cohérent ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | L'ordre de tabulation suit l'ordre de lecture du document. Les composants déplacés visuellement le sont sans dissociation de leur position dans l'arbre du document, et la restitution du focus après fermeture d'une modale ramène sur l'élément déclencheur. |
| 12.9 | Dans chaque page web, la navigation ne doit pas contenir de piège au clavier. Cette règle est-elle respectée ? | <rgaa-c>**Conforme**</rgaa-c> | Socle configuré | _Sous réserve de la neutralisation des éditeurs tiers._ Aucun composant du socle ne retient le focus. Les éditeurs de texte enrichi et de code, issus de bibliothèques tierces, constituent le cas résiduel ; ils sont neutralisés par le mode d'accessibilité et par la surcharge utilisateur, et [l'aide aux designers](/unlisted/designer) recommande de les écarter dans une application soumise à une exigence stricte. Les objets externes ne sont pas couverts. |
| 12.10 | Dans chaque page web, les raccourcis clavier n'utilisant qu'une seule touche (lettre minuscule ou majuscule, ponctuation, chiffre ou symbole) sont-ils contrôlables par l'utilisateur ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Les raccourcis de la plateforme reposent sur une combinaison de touches. Les seules touches utilisées isolément — `Échap`, `Entrée`, `Tab` et les flèches directionnelles — ne sont pas des touches imprimables et n'entrent donc pas dans le champ de ce critère. |
| 12.11 | Dans chaque page web, les contenus additionnels apparaissant au survol, à la prise de focus ou à l'activation d'un composant d'interface sont-ils si nécessaire atteignables au clavier ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Les seuls contenus concernés sont les bulles d'aide des formulaires et des listes, affichées à la prise de focus de leur élément déclencheur. |

### 13. Consultation

| Critère | Intitulé | Statut | Périmètre | Justification |
| ------- | -------- | ------ | --------- | ------------- |
| 13.1 | Pour chaque page web, l'utilisateur a-t-il le contrôle de chaque limite de temps modifiant le contenu ? | <rgaa-nc>**Non Conforme**</rgaa-nc> | Socle | La session applicative fait l'objet d'une limite de temps. L'utilisateur est averti de son expiration prochaine, mais ne dispose pas d'un moyen de la prolonger, de la désactiver ou de l'ajuster depuis l'interface. Sa durée est paramétrable globalement par l'administrateur, et au cas par cas dans les paramètres utilisateur, ce qui ne satisfait pas la condition d'un contrôle par l'utilisateur lui-même. |
| 13.2 | Dans chaque page web, l'ouverture d'une nouvelle fenêtre ne doit pas être déclenchée sans action de l'utilisateur. Cette règle est-elle respectée ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Aucune fenêtre ni modale n'est ouverte en dehors d'une action explicite de l'utilisateur. |
| 13.3 | Dans chaque page web, chaque document bureautique en téléchargement possède-t-il, si nécessaire, une version accessible ? | <rgaa-nc>**Non Conforme**</rgaa-nc> | Partagé | Les documents proposés au téléchargement dans une application sont soit déposés par les utilisateurs, soit produits par des modèles définis par le designer. La plateforme ne génère pas de version accessible de ces documents et ne dispose d'aucun moyen d'en évaluer l'accessibilité. |
| 13.4 | Pour chaque document bureautique ayant une version accessible, cette version offre-t-elle la même information ? | <rgaa-na>**Non Applicable**</rgaa-na> | Partagé | Conséquence directe du critère `13.3` : en l'absence de version accessible, le critère est sans objet. |
| 13.5 | Dans chaque page web, chaque contenu cryptique (art ASCII, émoticône, syntaxe cryptique) a-t-il une alternative ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Aucun contenu de cette nature n'est produit par les composants natifs. |
| 13.6 | Dans chaque page web, pour chaque contenu cryptique (art ASCII, émoticône, syntaxe cryptique) ayant une alternative, cette alternative est-elle pertinente ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Conséquence directe du critère `13.5`. |
| 13.7 | Dans chaque page web, les changements brusques de luminosité ou les effets de flash sont-ils correctement utilisés ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Aucun composant natif ne produit de changement brusque de luminosité ni d'effet de flash. |
| 13.8 | Dans chaque page web, chaque contenu en mouvement ou clignotant est-il contrôlable par l'utilisateur ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Les seuls mouvements produits par le socle sont des transitions déclenchées par une action de l'utilisateur et d'une durée inférieure à cinq secondes. Aucun contenu clignotant n'est généré. |
| 13.9 | Dans chaque page web, le contenu proposé est-il consultable quelle que soit l'orientation de l'écran (portrait ou paysage) ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Aucune orientation n'est imposée, et l'ensemble des contenus et fonctionnalités reste accessible dans les deux orientations. |
| 13.10 | Dans chaque page web, les fonctionnalités utilisables ou disponibles au moyen d'un geste complexe peuvent-elles être également disponibles au moyen d'un geste simple ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Aucune fonctionnalité du socle ne requiert de geste multipoint ou de geste basé sur un tracé au sens du référentiel. Les fonctionnalités reposant sur le glisser-déposer, tels que les tiroirs, sont par ailleurs neutralisables via le mode d'accessibilité et la surcharge utilisateur. |
| 13.11 | Dans chaque page web, les actions déclenchées au moyen d'un dispositif de pointage sur un point unique de l'écran peuvent-elles faire l'objet d'une annulation ? | <rgaa-c>**Conforme**</rgaa-c> | Socle | Les actions sont déclenchées à la levée du pointeur et non à l'appui : un utilisateur peut donc abandonner une action en déplaçant le pointeur hors de l'élément avant de relâcher. |
| 13.12 | Dans chaque page web, les fonctionnalités qui impliquent un mouvement de l'appareil ou vers l'appareil peuvent-elles être satisfaites de manière alternative ? | <rgaa-na>**Non Applicable**</rgaa-na> | Socle | Aucune fonctionnalité du socle ne repose sur un mouvement de l'appareil. |

Exceptions et composants hors-contexte
--------------------------------------

Cette section détaille les éléments dont la conformité ne peut structurellement pas être garantie par
la plateforme, ainsi que les partis pris retenus pour les critères que le contexte d'une application
monopage rend ambigus.

### Objets externes

La plateforme permet aux designers d'implémenter des **objets externes** : des composants entièrement
personnalisés, écrits en code libre, répondant à des besoins spécifiques et utilisant l'API Simplicité
à leur convenance.

Le balisage produit par ces objets échappe totalement au socle : ni sa validité, ni sa structure, ni
ses attributs d'accessibilité ne peuvent être vérifiés. Leur conformité relève donc entièrement du
designer qui les écrit. Cette réserve concerne au premier chef les critères des thématiques 1, 6, 7, 8,
9 et 11, et elle est rappelée dans les justifications concernées.

Les composants embarqués fournis avec le socle ne relèvent pas de cette exception : ils sont évalués
comme le reste de la plateforme.

### Contenus HTML et addons personnalisés

Au-delà des objets externes, plusieurs points d'extension permettent d'injecter du balisage non
contrôlé dans l'interface : contenus statiques HTML, aides de champ contenant du balisage, addons
JavaScript, modèles de publication. Un contenu purement textuel y est sans risque ; dès lors qu'il
contient du HTML, sa conformité incombe au designer.

[L'aide aux designers](/unlisted/designer) recense ces points d'extension et précise, pour chacun, les
conditions d'un usage conforme.

### Thèmes personnalisés

La plateforme permet de personnaliser entièrement l'apparence de l'interface par la création de
**thèmes**. Ces derniers déterminant directement les contrastes des éléments, un vérificateur de
contraste est intégré à chaque point de personnalisation — y compris lors du choix de l'apparence d'un
bouton ou d'un état — afin que le designer puisse valider ses choix au moment où il les fait.

La plateforme ne peut cependant pas empêcher la définition d'un thème insuffisamment contrasté. Elle
fournit à cette fin le thème `HighContrast`, qui garantit la conformité des critères de contraste et
de visibilité de la prise de focus sans intervention. Au-delà de ce thème, la conformité des couleurs
relève du designer, dans la limite de ce qui est variabilisable — soit, en pratique, la totalité de
l'interface.

### Navigation dans une application monopage

Dans une application monopage, aucun changement d'URL n'accompagne la navigation. Le comportement le
plus proche d'un changement de page est le remplacement de la majeure partie de la zone de contenu
principal, la section `#work`.

Le parti pris retenu est de porter par des **liens** tout ce qui constitue une action de navigation,
et par des **boutons** tout ce qui constitue une action applicative. Cette distinction sémantique
restitue les repères habituels d'un site web et permet aux technologies d'assistance de différencier
les deux natures d'interaction, malgré l'absence de rechargement de document.

Il en découle plusieurs conséquences sur la lecture des critères, explicitées dans les justifications
concernées : la notion d'« ensemble de pages » de la thématique 12 s'entend comme l'ensemble des états
de la zone de travail, et le titre de document de la thématique 8 est actualisé à chaque changement de
contenu principal plutôt qu'à chaque chargement.

Ressources et références
------------------------

Ce document se fonde sur la version **4.1.2** du [RGAA](https://accessibilite.numerique.gouv.fr/).
La version 5 du référentiel est en cours de rédaction, pour une publication annoncée fin 2026 ;
certains liens ci-dessous pourront à terme pointer vers cette nouvelle version.

- [Détail des critères et tests](https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/) —
  source des tests employés pour établir les positionnements de ce document. C'est la référence à
  utiliser pour confronter un relevé d'audit à notre positionnement : chaque divergence devrait pouvoir
  être rapportée à un test précis.
- [Glossaire du RGAA](https://accessibilite.numerique.gouv.fr/methode/glossaire/) — définitions des
  notions employées dans les intitulés de critères (tableau de données complexe, changement de contexte,
  contenu additionnel, message de statut…). Plusieurs justifications de ce document s'appuient sur ces
  définitions plutôt que sur l'acception courante des termes.
- [Évaluation de la conformité](https://accessibilite.numerique.gouv.fr/obligations/evaluation-conformite/)
  et [modèle de déclaration d'accessibilité](https://accessibilite.numerique.gouv.fr/obligations/declaration-accessibilite/) —
  méthode d'audit et obligations déclaratives incombant à l'organisme qui exploite l'application.
- [Aide aux designers Simplicité](/unlisted/designer) — conformité détaillée fonctionnalité par
  fonctionnalité, règles de paramétrage à respecter et raccourcis clavier. C'est le document de
  référence pour construire une application soumise à une exigence de conformité.
- [Using ARIA](https://www.w3.org/TR/using-aria/), [ARIA in HTML](https://www.w3.org/TR/html-aria/) et
  [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/) — modèles de conception suivis
  par les composants interactifs du socle, notamment pour les menus, les modales et les listes.
