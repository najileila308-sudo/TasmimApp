# CHAPITRE 4 : Réalisation, développement et tests (Introduction technique)

Voici les sections rédigées pour votre **Chapitre 4**, à insérer juste après l'introduction du chapitre (4.1) et avant la présentation des captures d'écran de l'application.

> [!WARNING]
> **ATTENTION :** Le texte de vos collègues faisait référence à un projet nommé *"RAM Lost & Found"* avec *"Firebase"* et une *"API Flask de Machine Learning"*. Votre application **Tasmim App** utilise **Supabase** et n'a pas de module de Machine Learning. Le texte ci-dessous a été entièrement réécrit et personnalisé pour correspondre exactement à **Tasmim App** et à vos technologies réelles.

---

### 4.2 Architecture logicielle de la solution (Architecture en couches avec BaaS)

Le développement de l'application **Tasmim App** s'appuie sur une architecture en couches combinée à un modèle de services de type **Backend-as-a-Service (BaaS)** via la plateforme **Supabase**. Cette approche permet de séparer les responsabilités au sein du code pour en faciliter la maintenance, l'évolution et les phases de tests.

#### 4.2.1 Présentation des couches logicielles

L'application est découpée en trois couches logicielles distinctes :

1. **La couche de Présentation (Front-end mobile)** : Elle est chargée de gérer l'interface utilisateur, d'afficher les informations visuelles et de capter les interactions de l'utilisateur. Elle est développée avec **React Native** et **Expo** sous forme de composants réutilisables.
2. **La couche Domaine / Logique Métier** : Elle contient les règles de gestion de l'application, telles que la validation des champs du formulaire de contact, la gestion de l'état de la session de connexion, et les redirections de navigation gérées par **Expo Router**.
3. **La couche de Données (Back-end et Service BaaS)** : Elle assure la persistance et la sécurité des données. Plutôt que de développer un serveur personnalisé complet (en Node.js ou Django), cette couche s'appuie directement sur les services de **Supabase** pour communiquer avec la base de données **PostgreSQL**.

##### Tableau 4 : Architecture en couches appliquée à Tasmim App
| Caractéristique | Couche de Présentation | Couche Domaine / Logique Métier | Couche de Données (BaaS) |
| :--- | :--- | :--- | :--- |
| **Responsabilité principale** | Gérer l'interaction avec l'utilisateur et l'affichage des écrans. | Traiter les règles de l'application et la logique de navigation. | Gérer l'accès aux données (lecture/écriture) et la sécurité. |
| **Éléments techniques** | Écrans Expo (`app/`), composants (`components/`), styles et animations. | Services d'API locaux (`lib/supabase.ts`), validation des formulaires. | Base de données PostgreSQL, Stockage Supabase, RLS. |
| **Interaction** | Transmet les actions de l'utilisateur à la couche Domaine. | Appelle la couche de Données pour lire ou écrire des informations. | Interagit directement avec la base de données physique. |

---

### 4.3 Choix technologiques de la solution

Le choix des technologies s'est porté sur des outils modernes, robustes et largement adoptés par l'industrie logicielle pour garantir la rapidité de développement et la fluidité de l'application.

#### 4.3.1 Le Front-end mobile : React Native et Expo

Le développement de l'application mobile repose sur le framework **React Native** (développé par Meta) combiné à la plateforme **Expo**. Ce choix se justifie par la possibilité de générer une application native performante pour Android (et potentiellement iOS) à partir d'une base de code unique en **TypeScript**.

L'intégration d'**Expo** simplifie grandement le cycle de vie du projet en évitant la configuration complexe des environnements natifs (Android Studio et Xcode) pendant la phase de code, tout en automatisant la génération finale du fichier d'installation APK.

##### Tableau 5 : Comparaison entre React Native pur et avec la surcouche Expo
| Critère | React Native (pur) | React Native + Expo (Choix retenu) |
| :--- | :--- | :--- |
| **Installation et démarrage** | Complexe (nécessite l'installation d'Android Studio, de SDKs natifs, etc.) | Simple et rapide (l'outil Expo CLI suffit pour démarrer) |
| **Accès aux APIs natives** | Nécessite l'écriture ou l'installation manuelle de modules natifs | Grande variété d'APIs prêtes à l'emploi (caméra, fichiers, stockage local) |
| **Tests en direct** | Nécessite obligatoirement un émulateur lourd ou un câble USB | Test instantané sur smartphone physique via l'application **Expo Go** |
| **Génération du fichier (Build)** | Manuelle et gourmande en ressources locales | Automatisée dans le cloud via les services de build d'Expo (EAS Build) |

#### 4.3.2 Le Back-end : Plateforme BaaS Supabase

Pour la gestion du serveur, des comptes et des données, le choix s'est porté sur la solution **Supabase**. Contrairement aux serveurs traditionnels, Supabase fournit un ensemble de services prêts à l'emploi qui accélèrent le développement :

* **Base de données PostgreSQL** : Un système de gestion de base de données relationnelle puissant et standardisé, utilisé pour stocker les profils utilisateurs et les messages envoyés depuis le formulaire de contact.
* **Module d'Authentification (Supabase Auth)** : Gère de manière sécurisée l'inscription des utilisateurs, la connexion par mot de passe et l'intégration des fournisseurs d'accès tiers (Google, Facebook).
* **Sécurité RLS (Row Level Security)** : Permet de sécuriser directement l'accès aux tables au niveau de la base de données PostgreSQL, garantissant que les messages ne sont consultables que par le responsable autorisé.

---

### 4.4 Outils de développement et de gestion de projet

La réalisation de l'application a nécessité l'utilisation de plusieurs outils complémentaires pour l'écriture du code, le versionnage et la planification :

1. **Visual Studio Code** : Éditeur de code principal utilisé pour développer l'application en TypeScript, apprécié pour sa légèreté et ses extensions facilitant le développement sous React Native.
2. **Expo Go** : Application installée sur smartphone Android permettant de visualiser et de tester en temps réel les interfaces développées sans avoir besoin de compiler l'application à chaque modification.
3. **Postman** : Outil utilisé pour tester les requêtes HTTP et vérifier le bon fonctionnement de l'API REST générée par Supabase lors de la soumission du formulaire de contact.
4. **Git et GitHub** : Utilisés pour le suivi des versions du code source, la sauvegarde du projet en ligne et le contrôle de l'historique des modifications.
5. **Lucidchart / Draw.io** : Outils de conception graphique exploités pour élaborer les diagrammes UML (classes, séquences, cas d'utilisation) ainsi que le schéma de la base de données.
6. **Figma** : Logiciel de conception d'interfaces utilisateur utilisé en amont pour créer les maquettes graphiques et définir la charte visuelle (couleurs, polices, composants).
