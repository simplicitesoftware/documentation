---
sidebar_position: 20
title: Criteria
unlisted: true
slug: /unlisted/criteria
---

Détail des critères
===================

:::info

Afin d'être cohérent avec la langue d'écriture du RGAA, ce document est écrit en **français**.
Mais vous pouvez consulter sa version écrite en **anglais** en [cliquant ici](/unlisted/criteria_en).
Cependant cela reste une traduction, et certaines notions peuvent s'y perdre/confondre due à cela.

:::

Préambule
---------

Simplicité étant un éditeur d'application métiers, il est plus compliqué d'évaluer sa conformité de façon absolue,  
de par la quantité de fonctionnalités et la complexité potentielle des applications, la garantie d'accessibilité ne peut se faire  
que sur les fonctionnalités et combinaisons préconisées [dans ce document](/unlisted/designer).

Qui plus est, les applications Simplicité sont des **applications monopages**, par conséquent ne reposent pas sur  
les mêmes standards que les sites webs (qui sont la cible principale du RGAA).  
Cette distinction nous amène à certains points de flous/incertitude concernant des critères de ce dernier.  
Mais pour chacun d'entre eux nous proposons une explication et une accessibilité cohérente avec le contexte et les critères du référentiel.

Additionnellement, les applications Simplicité étant souvent **hautement intéractive**, avec l'utilisation active de formulaires,  
de listes, de processus métiers, ou d'échanges d'informations/documents entre plusieurs utilisateurs.

Il n'est pas possible pour la plateforme en elle même de contrôler l'entiereté des possibilités  
concernant l'usage qu'en feront les designers et utilisateurs finaux.  
Le postulat est donc de rendre accessible tous les éléments natifs/socles de la plateforme, ainsi que de proposer  
une façon intuitive et accessible de conformiser les contenus/modifications des utilisateurs finaux.

Enfin, certains composants de la plateforme étant "trop" personnalisable ou plus complexes car spécifiques à un contexte de SPA,  
par conséquent ne sont pas conformes aux critères RGAA.
La liste et les explications relatives à ces éléments se trouve [en fin de document](/unlisted/criteria#exceptions-et-composants-hors-contexte)

Thématiques
-----------

:::warning

Actuellement les positionnements doivent être revu en prenant en compte les évaluations, corrections et explorations de la plateforme.  
Ne pas prendre pour argent comptant ni vérité absolue les affirmations faites, ces dernières n'ont pas toutes été scrupuleusement vérifiées.

:::

### 1. Images

| Critère | Intitulé | Positionnement Simplicité |
| ------- | -------- | ------------------------- |
| 1.1 | Chaque image porteuse d'information a-t-elle une alternative textuelle ? | <rgaa-c>**Conforme**</rgaa-c>, (hors objets externes et widgets) pour les images par défaut de la plateforme, peu sont porteuses d'informations, et ces dernières ont toutes une alternative. Pour ce qui est des images "métiers" qui sont ajoutées par les utilisateurs, un sous-champs `alt` est requis pour que ces dernières soient conformes aux normes RGAA. |
| 1.2 | Chaque image de décoration est-elle correctement ignorée par les technologies d'assistance ? | <rgaa-c>**Conforme**</rgaa-c>, toutes les images de décorations ont bien un `alt` vide. |
| 1.3 | Chaque image porteuse d'information ayant une alternative textuelle, cette alternative est-elle pertinente ? | <rgaa-c>**Conforme**</rgaa-c>, comme mentionné dans le 1.1, le alt est à la disponibilité des utilisateurs, il leur incombe donc d'ajouter une alternative pertinente, les images porteuses d'informations présentent par défaut dans la plateforme ont toutes des `alt` pertinent. |
| 1.4 | Pour chaque image utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative permet-elle d'identifier la nature et la fonction de l'image ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, travail en cours (page de login). |
| 1.5 | Pour chaque image utilisée comme CAPTCHA, une solution d'accès alternatif au contenu ou à la fonction du CAPTCHA est-elle présente ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, travail en cours (page de login). |
| 1.6 | Chaque image porteuse d'information a-t-elle, si nécessaire, une description détaillée ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, si un utilisateur décide d'ajouter une image nécessitant une description détaillé, il n'a pas la possibilité de lui attribuer une description détaillée. Travail en cours. |
| 1.7 | Chaque image porteuse d'information ayant une description détaillée, cette description est-elle pertinente ? | <rgaa-na>**Non Applicable**</rgaa-na>, pas de description detaillée possible. |
| 1.8 | Chaque image texte porteuse d'information, en l'absence d'un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, même principe que pour le critère `1.6`. |
| 1.9 | Chaque légende d'image est-elle, si nécessaire, correctement reliée à l'image correspondante ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, même principe que pour le critère `1.6`. |

:::info

Dans les applications Simplicité, les utilisateurs ont la possibilité d'inclure des images personnalisées,  
sur lesquelles la plateforme n'a aucune meta-information, ni conscience du contenu.  

Par conséquent il incombe aux utilisateurs de renseigner eux-même le `alt` dans le cas d'une image porteuse d'information.  
La responsabilité de la plateforme ne porte que sur les images que cette dernière positionne dans l'interface par défaut.  

Néanmoins nous travaillons sur le fait de permettre aux utilisateurs de conformiser simplement tout type d'image.  

:::

### 2. Cadres

| Critère | Intitulé | Positionnement Simplicité |
| ------- | -------- | ------------------------- |
| 2.1 | Chaque cadre a-t-il un titre de cadre ? | <rgaa-na>**Non Applicable**</rgaa-na>, il n'y a aucun `<iframe>` par défaut dans la plateforme. |
| 2.2 | Pour chaque cadre ayant un titre de cadre, ce titre de cadre est-il pertinent ? | <rgaa-na>**Non Applicable**</rgaa-na>, idem. |

### 3. Couleurs

| Critère | Intitulé | Positionnement Simplicité |
| ------- | -------- | ------------------------- |
| 3.1 | Dans chaque page web, l'information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ? | <rgaa-c>**Conforme**</rgaa-c>, chacun des éléments dont la couleur serait susceptible de porter seule l'information possède soit une alternative native, soit une autre version d |
| 3.2 | Dans chaque page web, le contraste entre la couleur du texte et la couleur de son arrière-plan est-il suffisamment élevé ? | <rgaa-c>**Conforme**</rgaa-c>, les couleurs des éléments par défaut sont paramétrables dans les thèmes avec un vérificateur de contraste. De plus il existe un thème DSFR déjà conforme sur ce critère. Pour ce qui est des éléments dont la couleur est paramétrable (états, boutons d'actions) il y a un contrast-checker integré pour permettre aux designer de garantir la conformité de ce critère. |
| 3.3 | Dans chaque page web, les couleurs utilisées dans les composants d'interface ou les éléments porteurs d'informations sont-elles suffisamment contrastées ? | <rgaa-c>**Conforme**</rgaa-c>, mêmes arguments que pour le 3.2. |

### 4. Multimédia

| Critère | Intitulé | Positionnement Simplicité |
| ------- | -------- | ------------------------- |
| 4.1 | Chaque média temporel pré-enregistré a-t-il, si nécessaire, une transcription textuelle ou une audiodescription ? | <rgaa-na>**Non Applicable**</rgaa-na> |
| 4.2 | Pour chaque média temporel pré-enregistré ayant une transcription textuelle ou une audiodescription, celles-ci sont-elles pertinentes ? | <rgaa-na>**Non Applicable**</rgaa-na> |
| 4.3 | Chaque média temporel synchronisé pré-enregistré a-t-il, si nécessaire, des sous-titres synchronisés ? | <rgaa-na>**Non Applicable**</rgaa-na> |
| 4.4 | Pour chaque média temporel synchronisé pré-enregistré ayant des sous-titres synchronisés, ces sous-titres sont-ils pertinents ? | <rgaa-na>**Non Applicable**</rgaa-na> |
| 4.5 | Chaque média temporel pré-enregistré a-t-il, si nécessaire, une audiodescription synchronisée ? | <rgaa-na>**Non Applicable**</rgaa-na> |
| 4.6 | Pour chaque média temporel pré-enregistré ayant une audiodescription synchronisée, celle-ci est-elle pertinente ? | <rgaa-na>**Non Applicable**</rgaa-na> |
| 4.7 | Chaque média temporel est-il clairement identifiable ? | <rgaa-na>**Non Applicable**</rgaa-na> |
| 4.8 | Chaque média non temporel a-t-il, si nécessaire, une alternative ? | <rgaa-na>**Non Applicable**</rgaa-na> |
| 4.9 | Pour chaque média non temporel ayant une alternative, cette alternative est-elle pertinente ? | <rgaa-na>**Non Applicable**</rgaa-na> |
| 4.10 | Chaque son déclenché automatiquement est-il contrôlable par l'utilisateur ? | <rgaa-na>**Non Applicable**</rgaa-na> |
| 4.11 | La consultation de chaque média temporel est-elle, si nécessaire, contrôlable par le clavier et tout dispositif de pointage ? | <rgaa-na>**Non Applicable**</rgaa-na> |
| 4.12 | La consultation de chaque média non temporel est-elle contrôlable par le clavier et tout dispositif de pointage ? | <rgaa-na>**Non Applicable**</rgaa-na> |
| 4.13 | Chaque média temporel et non temporel est-il compatible avec les technologies d'assistance ? | <rgaa-na>**Non Applicable**</rgaa-na> |

### 5. Tableaux

| Critère | Intitulé | Positionnement Simplicité |
| ------- | -------- | ------------------------- |
| 5.1 | Chaque tableau de données complexe a-t-il un résumé ? | <rgaa-c>**Conforme**</rgaa-c> |
| 5.2 | Pour chaque tableau de données complexe ayant un résumé, ce résumé est-il pertinent ? | <rgaa-c>**Conforme**</rgaa-c> |
| 5.3 | Pour chaque tableau de mise en forme, le contenu linéarisé reste-t-il compréhensible ? | <rgaa-nc>**Non Conforme**</rgaa-nc> |
| 5.4 | Pour chaque tableau de données ayant un titre, le titre est-il correctement associé au tableau de données ? | <rgaa-c>**Conforme**</rgaa-c> |
| 5.5 | Pour chaque tableau de données ayant un titre, ce titre est-il pertinent ? | <rgaa-c>**Conforme**</rgaa-c> |
| 5.6 | Pour chaque tableau de données, chaque en-tête de colonnes et chaque en-tête de lignes sont-ils correctement déclarés ? | <rgaa-c>**Conforme**</rgaa-c> |
| 5.7 | Pour chaque tableau de données, la technique appropriée permettant d'associer chaque cellule avec ses en-têtes est-elle utilisée ? | <rgaa-c>**Conforme**</rgaa-c> |
| 5.8 | Chaque tableau de mise en forme est-il dépourvu de balises de structuration propres aux tableaux de données ? | <rgaa-c>**Conforme**</rgaa-c> |

### 6. Liens

| Critère | Intitulé | Positionnement Simplicité |
| ------- | -------- | ------------------------- |
| 6.1 | Chaque lien est-il explicite ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, travail en cours. |
| 6.2 | Dans chaque page web, chaque lien a-t-il un intitulé ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, travail en cours. |

### 7. Scripts

| Critère | Intitulé | Positionnement Simplicité |
| ------- | -------- | ------------------------- |
| 7.1 | Chaque script est-il, si nécessaire, compatible avec les technologies d'assistance ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, travail en cours. |
| 7.2 | Pour chaque script ayant une alternative, cette alternative est-elle pertinente ? | <rgaa-na>**Non Applicable**</rgaa-na>, les scripts n'ont pas d'alternatives en l'état. |
| 7.3 | Chaque script est-il contrôlable par le clavier et par tout dispositif de pointage ? | <rgaa-c>**Conforme**</rgaa-c>, les scripts des menus principal et secondaire, ainsi que ceux des menus déroulants, sont tous contrôlables au clavier par l'utilisateur. Et leur utilisation respecte la norme WAI-ARIA "flèches directionnelles pour naviguer, touche espace pour activer". |
| 7.4 | Pour chaque script qui initie un changement de contexte, l'utilisateur est-il averti ou en a-t-il le contrôle ? | <rgaa-na>**Non Applicable**</rgaa-na>, aucun changement de contexte fait par script, uniquement des actions de navigations. |
| 7.5 | Dans chaque page web, les messages de statut sont-ils correctement restitués par les technologies d'assistance ? | <rgaa-nc>**Non Conforme**</rgaa-nc> |

### 8. Éléments obligatoires

| Critère | Intitulé | Positionnement Simplicité |
| ------- | -------- | ------------------------- |
| 8.1 | Chaque page web est-elle définie par un type de document ? | <rgaa-c>**Conforme**</rgaa-c>, le DOM des applications générées est toujours pourvu de `<!DOCTYPE html>`. |
| 8.2 | Pour chaque page web, le code source généré est-il valide selon le type de document spécifié ? | <rgaa-c>**Conforme**</rgaa-c>, le code source généré par les fonctionnalités native est valide pour html (hors objets externes). |
| 8.3 | Dans chaque page web, le code source contient-il un attribut de langue par défaut ? | <rgaa-c>**Conforme**</rgaa-c>, il y a bien un attribut `lang=*` pour le document. |
| 8.4 | Pour chaque page web ayant un attribut de langue par défaut, cet attribut est-il pertinent ? | <rgaa-c>**Conforme**</rgaa-c>, lorsque l'utilisateur change la langue de la page alors cet attribut est modifié en conséquence. |
| 8.5 | Chaque page web a-t-elle un titre de page ? | <rgaa-c>**Conforme**</rgaa-c>, le titre de la page est généré comme : "Titre de l'application - nom du contenu courant". |
| 8.6 | Pour chaque page web ayant un titre de page, ce titre est-il pertinent ? | <rgaa-c>**Conforme**</rgaa-c>, le titre de la page permet bien d'identifier qu'est ce qui est actuellement ouvert ainsi que différencier l'application des autres. |
| 8.7 | Dans chaque page web, chaque changement de langue est-il indiqué dans le code source ? | <rgaa-na>**Non Applicable**</rgaa-na>, aucun changement de langue n'est prévu par défaut. |
| 8.8 | Dans chaque page web, le code de langue de chaque changement de langue est-il valide et pertinent ? | <rgaa-na>**Non Applicable**</rgaa-na>, même argument que pour le critère `8.7`. |
| 8.9 | Dans chaque page web, des balises ne sont-elles pas utilisées uniquement à des fins de présentation ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, travail en cours. |
| 8.10 | Dans chaque page web, les changements du sens de lecture sont-ils signalés ? | <rgaa-na>**Non Applicable**</rgaa-na>, aucun changement de sens de lecture n'est prévu par défaut. |

### 9. Structuration de l'information

| Critère | Intitulé | Positionnement Simplicité |
| ------- | -------- | ------------------------- |
| 9.1 | Dans chaque page web, l'information est-elle structurée par l'utilisation appropriée de titres ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, travail en cours. |
| 9.2 | Dans chaque page web, la structure du document est-elle cohérente ? | <rgaa-c>**Conforme**</rgaa-c> : les zones d'en-tête, de navigation, de contenu principal et de pied-de-page ont bien les balises respectives `<header>`, `<nav>`, `<main>`, `<footer>`. |
| 9.3 | Dans chaque page web, chaque liste est-elle correctement structurée ? | <rgaa-c>**Conforme**</rgaa-c>, les menus déroulants ainsi que le menu principal et le plan du site sont des listes correctement structurées. |
| 9.4 | Dans chaque page web, chaque citation est-elle correctement indiquée ? | <rgaa-na>**Non Applicable**</rgaa-na>, aucune possibilité native d'ajout de citation. |

### 10. Présentation de l'information

| Critère | Intitulé | Positionnement Simplicité |
| ------- | -------- | ------------------------- |
| 10.1 | Dans le site web, des feuilles de styles sont-elles utilisées pour contrôler la présentation de l'information ? | <rgaa-c>**Conforme**</rgaa-c>, aucune information n'est ajoutée par les styles, et ces derniers sont exclusivement déclarés dans des feuilles séparées et non dans des balises `<style>`. |
| 10.2 | Dans chaque page web, le contenu visible porteur d’information reste-t-il présent lorsque les feuilles de styles sont désactivées ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, travail en cours. |
| 10.3 | Dans chaque page web, l'information reste-t-elle compréhensible lorsque les feuilles de styles sont désactivées ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, travail en cours. |
| 10.4 | Dans chaque page web, le texte reste-t-il lisible lorsque la taille des caractères est augmentée jusqu'à 200% au moins ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, travail en cours. |
| 10.5 | Dans chaque page web, les déclarations CSS de couleurs de fond d’élément et de police sont-elles correctement utilisées ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, travail en cours. |
| 10.6 | Dans chaque page web, chaque lien dont la nature n’est pas évidente est-il visible par rapport au texte environnant ? | <rgaa-c>**Conforme**</rgaa-c>, avec le thème dédié (dsfr) les liens n'ayant pas une nature évidente (liens en liste, actions de redirection flaggées en `button`) ont des styles alignés avec ceux des liens par défaut. |
| 10.7 | Dans chaque page web, pour chaque élément recevant le focus, la prise de focus est-elle visible ? | <rgaa-c>**Conforme**</rgaa-c>, avec le thème dédié assure la conformité de ce critère par sa définition des styles de la prise de focus sur tous les éléments possibles. |
| 10.8 | Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, travail en cours. |
| 10.9 | Dans chaque page web, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle respectée ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, travail en cours (fil d'arianne). |
| 10.10 | Dans chaque page web, l’information ne doit pas être donnée par la forme, taille ou position uniquement. Cette règle est-elle implémentée de façon pertinente ? | <rgaa-na>**Non Applicable**</rgaa-na>, par défaut aucun composant de la plateforme ne possède d'informations données par la taille/forme/position. |
| 10.11 | Pour chaque page web, les contenus peuvent-ils être présentés sans perte d’information ou de fonctionnalité et sans avoir recours soit à un défilement vertical pour une fenêtre ayant une hauteur de 256 px, soit à un défilement horizontal pour une fenêtre ayant une largeur de 320 px ? | <rgaa-c>**Conforme**</rgaa-c>, sur petit écran les éléments s'empilent et donc respecte le besoin d'accessibilité et de scroll vertical uniquement. De plus les comportements de certains composants sont adapté correctement au responsive (listes, barres d'actions, menus). |
| 10.12 | Dans chaque page web, les propriétés d’espacement du texte peuvent-elles être redéfinies par l’utilisateur sans perte de contenu ou de fonctionnalité ? | <rgaa-c>**Conforme**</rgaa-c>, possibilité d'utiliser le zoom interne (pas celui du navigateur), qui déclenche les mêmes comportements que le responsive évoqué dans le critère `10.12`. |
| 10.13 | Dans chaque page web, les contenus additionnels apparaissant à la prise de focus ou au survol d’un composant d’interface sont-ils contrôlables par l’utilisateur ? | <rgaa-c>**Conforme**</rgaa-c>, les éléments comme les tooltips sont les seuls de ce genre, et ces derniers peuvent être fermer en tabulant en dehors de leur élément déclencheur. |
| 10.14 | Dans chaque page web, les contenus additionnels apparaissant via les styles CSS uniquement peuvent-ils être rendus visibles au clavier et par tout dispositif de pointage ? | <rgaa-na>**Non Conforme**</rgaa-na>, travail en cours. |

### 11. Formulaires

| Critère | Intitulé | Positionnement Simplicité |
| ------- | -------- | ------------------------- |
| 11.1 | Chaque champ de formulaire a-t-il une étiquette ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, travail en cours. |
| 11.2 | Chaque étiquette associée à un champ de formulaire est-elle pertinente ? | <rgaa-nc>**Non Conforme**</rgaa-nc> |
| 11.3 | Dans chaque formulaire, chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée plusieurs fois dans une même page ou dans un ensemble de pages est-elle cohérente ? | <rgaa-na>**Non Applicable**</rgaa-na> |
| 11.4 | Dans chaque formulaire, chaque étiquette de champ et son champ associé sont-ils accolés ? | <rgaa-c>**Conforme**</rgaa-c> |
| 11.5 | Dans chaque formulaire, les champs de même nature sont-ils regroupés, si nécessaire ? | <rgaa-nc>**Non Conforme**</rgaa-nc> |
| 11.6 | Dans chaque formulaire, chaque regroupement de champs de même nature a-t-il une légende ? | <rgaa-na>**Non Applicable**</rgaa-na> |
| 11.7 | Dans chaque formulaire, chaque légende associée à un regroupement de champs de même nature est-elle pertinente ? | <rgaa-na>**Non Applicable**</rgaa-na> |
| 11.8 | Dans chaque formulaire, les items de même nature d'une liste de choix sont-ils regroupés de manière pertinente ? | <rgaa-c>**Conforme**</rgaa-c> |
| 11.9 | Dans chaque formulaire, l'intitulé de chaque bouton est-il pertinent ? | <rgaa-c>**Conforme**</rgaa-c> |
| 11.10 | Dans chaque formulaire, le contrôle de saisie est-il utilisé de manière pertinente ? | <rgaa-c>**Conforme**</rgaa-c> |
| 11.11 | Dans chaque formulaire, le contrôle de saisie est-il accompagné, si nécessaire, de suggestions facilitant la correction des erreurs de saisie ? | <rgaa-nc>**Non Conforme**</rgaa-nc> |
| 11.12 | Pour chaque formulaire qui modifie ou supprime des données, ou qui transmet des réponses à un test ou à un examen, ou dont la validation a des conséquences financières ou juridiques, les données saisies peuvent-elles être modifiées, mises à jour ou récupérées par l'utilisateur ? | <rgaa-na>**Non Applicable**</rgaa-na> |
| 11.13 | La finalité d'un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l'utilisateur ? | <rgaa-na>**Non Applicable**</rgaa-na> |

### 12. Navigation

| Critère | Intitulé | Positionnement Simplicité |
| ------- | -------- | ------------------------- |
| 12.1 | Chaque ensemble de pages dispose-t-il de deux systèmes de navigation différents, au moins ? | <rgaa-c>**Conforme**</rgaa-c>, nativement Simplicité possède un menu, un plan de site, ainsi qu'un fil d'arianne (ce dernier ayant un fonctionnement spécifique potentiellement Non Conforme). |
| 12.2 | Dans chaque ensemble de pages, le menu et les barres de navigation sont-ils toujours à la même place ? | <rgaa-c>**Conforme**</rgaa-c>, les menus sont persistent peu importe la page courante, il en est de même pour le plan de site ainsi que le fil d'arianne (lorsque ce dernier est pertinent). |
| 12.3 | La page « plan du site » est-elle pertinente ? | <rgaa-c>**Conforme**</rgaa-c>, le plan de site reprend tous les éléments de navigation et actions de premier et second niveau depuis la page d'accueil : actions et raccourcis de l'en-tête, éléments des menus vertical et horizontal, éléments placés en page d'accueil, liens du pied-de-page. |
| 12.4 | Dans chaque ensemble de pages, la page « plan du site » est-elle accessible à partir de n'importe quelle page ? | <rgaa-c>**Conforme**</rgaa-c>, le plan du site est accessible peu importe la page courante via le pied-de-page persistent. |
| 12.5 | Dans chaque ensemble de pages, le moteur de recherche est-il accessible à partir de n'importe quelle page ? | <rgaa-c>**Conforme**</rgaa-c>, la recherche globale (lorsqu'activée) est accessible peu importe la page courante via l'en-tête persistente. |
| 12.6 | Les zones de regroupement de contenus présentes dans plusieurs pages web (zones d'en-tête, de navigation principale, de contenu principal, de pied de page et de moteur de recherche) peuvent-elles être atteintes ou évitées ? | <rgaa-c>**Conforme**</rgaa-c>, ces zones peuvent-être atteintes par tabulation ou par lien d'évitement, et peuvent aussi être sautée en utilisant certains raccourcis claviers (et les liens d'évitements). |
| 12.7 | Dans chaque page web, un lien d'évitement ou d'accès rapide à la zone de contenu principal est-il présent ? | <rgaa-c>**Conforme**</rgaa-c>, présence de liens d'évitements vers la zone de contenu (zone de travail) et vers les zones principales d'intéractions (en-tête, menu principal, pied-de-page). |
| 12.8 | Dans chaque page web, l'ordre de tabulation est-il cohérent ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, travail en cours. |
| 12.9 | Dans chaque page web, la navigation ne doit pas contenir de piège au clavier. Cette règle est-elle respectée ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, Travail en cours (hors objets externes). |
| 12.10 | Dans chaque page web, les raccourcis clavier n'utilisant qu'une seule touche (lettre minuscule ou majuscule, ponctuation, chiffre ou symbole) sont-ils contrôlables par l'utilisateur ? | <rgaa-na>**Non Applicable**</rgaa-na>, tous les raccourcis de Simplicité utilisent au moins deux touches. |
| 12.11 | Dans chaque page web, les contenus additionnels apparaissant au survol, à la prise de focus ou à l'activation d'un composant d'interface sont-ils si nécessaire atteignables au clavier ? | <rgaa-c>**Conforme**</rgaa-c>, les seuls éléments concernés sont les tooltips d'aide (en formulaire et en liste), ces derniers s'affichent automatiquement au focus, et disparaissent une fois le focus hors de l'élément déclencheur. |

### 13. Consultation

| Critère | Intitulé | Positionnement Simplicité |
| ------- | -------- | ------------------------- |
| 13.1 | Pour chaque page web, l’utilisateur a-t-il le contrôle de chaque limite de temps modifiant le contenu ? | <rgaa-na>**Non Applicable ??**</rgaa-na> |
| 13.2 | Dans chaque page web, l’ouverture d’une nouvelle fenêtre ne doit pas être déclenchée sans action de l’utilisateur. Cette règle est-elle respectée ? | <rgaa-c>**Conforme**</rgaa-c>, toutes les ouvertures de fenêtres ou modales ne sont déclenchées que sur action de l'utilisateur. |
| 13.3 | Dans chaque page web, chaque document bureautique en téléchargement possède-t-il, si nécessaire, une version accessible ? | <rgaa-nc>**Non Conforme**</rgaa-nc>, travail en cours. |
| 13.4 | Pour chaque document bureautique ayant une version accessible, cette version offre-t-elle la même information ? | <rgaa-na>**Non Applicable**</rgaa-na>, pas de document bureautique avec une version accessible. |
| 13.5 | Dans chaque page web, chaque contenu cryptique (art ASCII, émoticône, syntaxe cryptique) a-t-il une alternative ? | <rgaa-na>**Non Applicable**</rgaa-na>, aucun contenu de ce type dans les composants natifs et leurs fonctionnalitées. |
| 13.6 | Dans chaque page web, pour chaque contenu cryptique (art ASCII, émoticône, syntaxe cryptique) ayant une alternative, cette alternative est-elle pertinente ? | <rgaa-na>**Non Applicable**</rgaa-na>, aucun contenu de ce type dans les composants natifs et leurs fonctionnalitées. |
| 13.7 | Dans chaque page web, les changements brusques de luminosité ou les effets de flash sont-ils correctement utilisés ? | <rgaa-na>**Non Applicable**</rgaa-na>, aucun composant natif ne fait l'objet de changement brusque de luminosité ou d'effet de flash qui ne soit pas déclenché uniquement par action de l'utilisateur. |
| 13.8 | Dans chaque page web, chaque contenu en mouvement ou clignotant est-il contrôlable par l’utilisateur ? | <rgaa-na>**Non Applicable**</rgaa-na>, aucun composant natif ne fait l'objet de clignotements ou mouvement qui ne soit pas déclenchés uniquement par action de l'utilisateur. |
| 13.9 | Dans chaque page web, le contenu proposé est-il consultable quelle que soit l’orientation de l’écran (portrait ou paysage) ? | <rgaa-c>**Conforme**</rgaa-c>, l'orientation de l'écran n'empêche nullement l'accès et la consultation à tous les contenus. |
| 13.10 | Dans chaque page web, les fonctionnalités utilisables ou disponibles au moyen d’un geste complexe peuvent-elles être également disponibles au moyen d’un geste simple ? | <rgaa-na>**Non Applicable**</rgaa-na>, aucune utilisation de composant/fonctionnalité n'implique de geste complexe. |
| 13.11 | Dans chaque page web, les actions déclenchées au moyen d’un dispositif de pointage sur un point unique de l’écran peuvent-elles faire l’objet d’une annulation ? | Conforme, toutes les actions déclenchées par un clic peuvent être annulées en glissant/déposant l'élements. Et les actions de glissé/déposé peuvent être annulées en relachant l'élément à son emplacement initial. |
| 13.12 | Dans chaque page web, les fonctionnalités qui impliquent un mouvement de l'appareil ou vers l'appareil peuvent-elles être satisfaites de manière alternative ? | <rgaa-na>**Non Applicable**</rgaa-na>, aucune utilisation de composant/fonctionnalité n'implique de mouvement de l'appareil. |

Exceptions et composants hors-contexte
--------------------------------------

### Objets externes et Thèmes

La plateforme Simplicité propose ce que l'ont nomme des **Objets Externes**, qui ont pour but de permettre aux designers  
d'implémenter des objets personnalisés afin de répondre à des besoins très spécifique, et d'utiliser l'API Simplicité comme bon leur semble.  

Or de tels objets étant codés librement par les designers, la plateforme n'a pas moyen de garantir leur conformité,  
il incombe donc aux designers de rendre leurs objets externes conforme par eux-même.  

La plateforme propose aussi aux utilisateurs de personnaliser l'apparence de leur interface par la création de **Thèmes**,  
ces derniers impactant directement les contrastes des éléments, un comparateur est disponible pour permettre aux designers  
de s'assurer de la conformité de leurs choix (ce même comparateur est disponible lors du choix de l'apparence d'un bouton).  

Néanmoins si le contraste n'est pas suffisant alors la plateforme ne peut rien faire de plus.  
Mais propose un thème _HighContrast_ qui assure la conformité des couleurs et contrastes pour les applications l'appliquant.

Au delà de ce thème, il incombe aux designers d'assurer la conformité de leurs thèmes  
(dans la mesure de ce qui est variabilisé et surchargeable, donc normalement tout).

### Navigation dans une application monopage

Etant donné que le contexte d'une application monopage, aucun changement d'url n'est fait, le comportement qui se rapproche le plus  
d'une navigation entre pages est le changement d'une majorité du contenu principal (dans Simplicité la section `#work`).

Par conséquent, des liens sont présents pour représenter sémantiquement tout ce qui consiste en une action de navigation,  
l'objectif est de rappeler les comportements récurrents dans les sites webs, et permettre une différenciation claire avec les boutons.

### PDF et autres documents

> TODO
> _investigate current RGAA-compliancy_

Mode accessible
---------------

Un mode accessible est accessible en runtime pour n'importe quelle application le permettant, afin d'inhiber certains  
comportements UX/UI (ainsi que certaines fonctionnalités) non structurant pour l'utilisation d'une application,  
mais qui limiteraient ou même bloqueraient des utilisateurs se servant de technologies d'assistances.

Les comportements inhibés sont :

- En-tête de liste et de formulaires "flottant/sticky"
- Couleurs personnalisées de boutons d'actions/états (pourrait être laissé tel quel à charge des designers ?)
- Zones de travails multiples
- Possibilité de fermer/ouvrir le menu
- Fil d'arianne (?)
- Layout Masonry des listes
- Préférences de liste
- Mode compacte
- Recherche prédéfinie (depuis la fenêtre de recherche d'une liste)

:::warning

Cela n'a aucun effet sur les fonctionnalités indiquées comme _Non Conforme_ [dans ce tableau](/unlisted/designer#features-compliance).  

Il n'a pour vocation que d'inhiber des comportements socles/natifs non paramétrables ou trop spécifiques, afin de permettre  
aux utilisateurs en situation de handicap une utilisation normale et adaptée de l'application.  

:::

Resources et références
-----------------------

Cette documentation se base pour l'instant sur la version 4.1.2 du [RGAA](https://accessibilite.numerique.gouv.fr/), il se peut que
les liens ci-dessous fassent références à la version 5 du RGAA (prévue fin 2026).

- [Détail des critères et tests](https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/)
- [Glossaire spécifique du RGAA](https://accessibilite.numerique.gouv.fr/methode/glossaire/)
- [Aide aux designers Simplicité](/unlisted/designer)
