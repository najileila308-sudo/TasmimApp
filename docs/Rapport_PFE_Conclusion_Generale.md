# CONCLUSION GÉNÉRALE

La réalisation de ce projet de Fin d'Études (PFE) marque l'aboutissement d'un processus complet d'analyse, de conception et de développement logiciel appliqué à la transformation mobile de l'agence digitale **Tasmim Web**. Ce projet s'inscrit dans un contexte où la présence sur les terminaux mobiles est devenue un impératif stratégique pour toute entreprise souhaitant pérenniser et étendre son réseau commercial.

---

## 1. Rappel de la problématique

La problématique initiale de ce travail consistait à répondre au besoin d'extension numérique de l'agence **Tasmim Web**. Bien que l'agence dispose d'une vitrine web établie, l'absence d'un canal mobile dédié limitait son interaction avec les prospects et clients utilisant majoritairement des smartphones. 

L'enjeu principal était donc de concevoir et de développer une application mobile multiplateforme répondant à un triple défi :
1. **Visibilité et Identité** : Valoriser l'identité de l'agence, son savoir-faire et ses réalisations passées à travers une interface mobile soignée et immersive.
2. **Accessibilité Client** : Faciliter la prise de contact pour les prospects grâce à un formulaire fluide avec choix dynamique de prestations de services.
3. **Gestion Interne Centralisée** : Fournir au responsable de l'agence une interface d'administration mobile sécurisée et en temps réel pour consulter, modérer et traiter les demandes clients sur le terrain, sans dépendre d'outils tiers lourds.

---

## 2. Synthèse des livrables

Au terme de ce projet, l'ensemble des objectifs fixés par le cahier des charges a été atteint à travers la livraison de plusieurs livrables majeurs :

* **Maquettes et Prototypage (Figma)** : Une conception visuelle complète en mode sombre premium (Dark Mode), respectant l'identité visuelle de Tasmim Web, avec une charte graphique associant des tons bleu nuit et des accents bleus électriques et ambrés.
* **Base de données relationnelle sécurisée (Supabase/PostgreSQL)** : 
  * Structure physique sous PostgreSQL incluant les tables `profiles` (gestion des utilisateurs) et `contact_messages` (gestion des demandes de contact).
  * Politiques de sécurité au niveau des lignes (**Row Level Security - RLS**) assurant l'étanchéité des données et limitant l'accès d'administration au seul email du responsable (`najileila308@gmail.com`).
  * Déclencheurs SQL (**Triggers**) assurant la synchronisation instantanée des profils lors de l'authentification.
* **Application Mobile Multiplateforme (React Native & Expo)** :
  * Une base de code unique écrite en **TypeScript** structurée de manière modulaire (dossiers `app/`, `components/`, `lib/`, `constants/`).
  * Navigation moderne basée sur les fichiers (*Expo Router*) avec menu par onglets (*Bottom Tabs*).
  * Formulaire de contact dynamique avec validation de surface (côté client).
  * Espace de modération sécurisé permettant au responsable de marquer des messages comme lus ou de les supprimer.
* **Application Compilée (Fichier d'installation APK)** : Un package d'installation pour terminaux Android généré avec succès via les services cloud **EAS Build** et validé sur appareil physique.

---

## 3. Valeur ajoutée pour Tasmim Web

L'introduction de **Tasmim App** apporte une forte valeur ajoutée à l'agence sur plusieurs plans :

* **Amélioration de l'Expérience Client (UX)** : L'application offre une navigation fluide, rapide et des animations soignées (opacités, zooms) qui reflètent l'expertise technique de l'agence auprès de ses clients potentiels.
* **Réactivité et Taux de Conversion** : L'espace responsable intégré permet un suivi en temps réel des messages. La possibilité de traiter instantanément les demandes de devis depuis un mobile augmente la réactivité commerciale de l'agence, un facteur clé pour convertir un prospect en client.
* **Modernisation de l'Image de Marque** : En disposant de sa propre application sur les stores mobiles, Tasmim Web se positionne comme un acteur technologique de premier plan, capable de maîtriser les technologies hybrides de pointe.
* **Optimisation des Coûts d'Infrastructure** : L'architecture « Serverless » reposant sur le Backend-as-a-Service (BaaS) de Supabase élimine le besoin d'héberger et de maintenir un serveur web dédié (Node.js ou Django), ce qui réduit à zéro les coûts opérationnels de départ tout en assurant une montée en charge (scalability) automatique.

---

## 4. Perspectives d'évolution

Bien que l'application actuelle soit pleinement opérationnelle, plusieurs axes d'amélioration peuvent être envisagés pour accompagner la croissance future de l'agence :

1. **Intégration des Notifications Push** : Implémenter le service d'Expo Push Notifications ou Firebase Cloud Messaging (FCM) afin d'alerter instantanément le responsable sur son smartphone lors de la réception d'un nouveau message, évitant ainsi d'avoir à rafraîchir manuellement la liste.
2. **Espace Client Collaboratif (Suivi de Projet)** : Faire évoluer l'application vers une plateforme client-agence où chaque client connecté peut suivre l'état d'avancement de son projet (maquettes validées, étapes de développement, factures, retours de tests).
3. **Support Multilingue (Internationalisation)** : Intégrer la bibliothèque `i18next` ou `expo-localization` pour proposer l'application en plusieurs langues (notamment en Arabe et en Anglais) pour cibler des marchés internationaux.
4. **Publication sur l'App Store d'Apple** : Mettre à profit la nature multiplateforme de React Native pour compiler et déployer la version iOS sur l'App Store, élargissant ainsi la portée auprès des utilisateurs d'iPhone.
5. **Intégration CRM et Automatisation** : Connecter Supabase à des outils de gestion de la relation client (CRM) comme HubSpot ou Salesforce via des Webhooks, afin de créer automatiquement un lead commercial à chaque soumission de formulaire.

En conclusion, ce projet a représenté une opportunité enrichissante de mettre en pratique des technologies modernes de développement mobile et de base de données relationnelle. Il démontre comment les architectures hybrides et le modèle serverless permettent de concevoir des solutions robustes, hautement sécurisées et prêtes à l'emploi dans un contexte professionnel.

---
---

# BIBLIOGRAPHIE ET SITOGRAPHIE

## I. Références Académiques et Scientifiques

1. **Eisenman, B. (2017).** *Learning React Native: Building Native Mobile Apps with JavaScript*. 2e édition, O'Reilly Media. 
   *(Ce livre détaille le fonctionnement interne du framework React Native, l'interaction avec le thread de rendu natif et les mécaniques de performance).*

2. **Bierman, G., Abadi, M., & Torgersen, M. (2014).** "Understanding TypeScript". In *European Conference on Object-Oriented Programming (ECOOP)*, Springer, LNCS 8586, pp. 257-281.
   *(Cette publication scientifique analyse le système de types de TypeScript et démontre sa contribution à la réduction d'erreurs d'exécution dans les applications JavaScript d'envergure).*

3. **Stonebraker, M., & Rowe, L. A. (1986).** "The design of POSTGRES". In *Proceedings of the 1986 ACM SIGMOD international conference on Management of data*, pp. 340-355.
   *(Article fondateur décrivant la conception d'un système de gestion de base de données relationnelle extensible, qui est à l'origine du moteur PostgreSQL utilisé par Supabase).*

4. **Castro, P., Ishakian, V., Muthusamy, V., & Slominski, A. (2019).** "The Rise of Serverless Computing". *Communications of the ACM*, Vol. 62, No. 12, pp. 44-54.
   *(Cette recherche académique explore l'évolution des architectures applicatives vers le paradigme serverless, mettant en avant les gains d'agilité, de coût et de déploiement).*

5. **Harrison, R., Flood, D., & Duce, D. (2013).** "Usability of mobile applications: literature review and rationale for a new usability model". *Journal of Interaction Science*, Vol. 1, No. 1, pp. 1-16.
   *(Une étude approfondie des critères d'ergonomie et d'expérience utilisateur spécifiques aux interfaces mobiles, étayant les choix ergonomiques effectués lors du prototypage Figma).*

6. **Bradley, J., Lodderstedt, T., & Jones, M. (2015).** "Proof Key for Code Exchange by OAuth Public Clients". *IETF RFC 7636*.
   *(Spécification officielle de l'IETF introduisant le protocole d'authentification sécurisé PKCE, mis en œuvre dans Supabase Auth pour prémunir les applications mobiles contre l'interception de jetons d'accès).*

7. **Ournani, Z., Belkadi, M. C., & Bouras, A. (2021).** "A Comparative Study of Backend-as-a-Service (BaaS) Platforms for Mobile Applications". *Journal of Software Engineering and Applications*, Vol. 14, No. 3, pp. 95-108.
   *(Une analyse comparative des différentes plateformes BaaS, soulignant l'efficacité de l'accès direct aux données sécurisé par des politiques au niveau des tables).*

8. **Fowler, M. (2004).** *UML Distilled: A Brief Guide to the Standard Object Modeling Language*. 3e édition, Addison-Wesley.
   *(Ouvrage de référence sur la modélisation logicielle à l'aide des diagrammes UML de cas d'utilisation, de classes et de séquences adoptés dans la phase de conception).*

---

## II. Documentations et Références Techniques (Sitographie)

9. **React Native Core Team. (2026).** *React Native Official Documentation*. 
   URL : [https://reactnative.dev/docs/getting-started](https://reactnative.dev/docs/getting-started)
   *(Documentation de référence pour l'utilisation des composants graphiques fondamentaux et la gestion des cycles de vie des composants sur iOS et Android).*

10. **Expo Developer Platform. (2026).** *Expo Documentation & EAS Build Guides*.
    URL : [https://docs.expo.dev/](https://docs.expo.dev/)
    *(Guide officiel couvrant l'utilisation du routeur par fichiers Expo Router, la configuration des services EAS Build et la génération des paquets APK).*

11. **Supabase PBC. (2026).** *Supabase Reference Documentation - JavaScript Client & Database Security*.
    URL : [https://supabase.com/docs](https://supabase.com/docs)
    *(Documentation technique pour l'initialisation du client JavaScript, la mise en place de l'authentification sociale OAuth et l'implémentation de la sécurité Row Level Security).*

12. **PostgreSQL Global Development Group. (2026).** *PostgreSQL 16.0 Documentation - Row-Level Security Policies*.
    URL : [https://www.postgresql.org/docs/current/ddl-rowsecurity.html](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
    *(Manuel de référence de PostgreSQL détaillant la syntaxe SQL, la performance et l'application des règles de filtrage de sécurité RLS au niveau du noyau de la base de données).*
