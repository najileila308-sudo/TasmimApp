# CHAPITRE 4 : RÉALISATION, DÉVELOPPEMENT ET TESTS

## 4.1 Introduction du chapitre
La phase de conception ayant permis de modéliser l'architecture et les données de l'application, ce chapitre est consacré à la réalisation matérielle et logicielle de **Tasmim App**. Nous y détaillerons l'environnement de développement, la structure finale du projet, la présentation des interfaces utilisateurs et les choix d'implémentation du code source. Enfin, nous décrirons la phase de validation à travers des scénarios de test rigoureux ainsi que la procédure de compilation pour générer le fichier d'installation APK sur Android.

---

## 4.2 Environnement de développement et technologies
Le développement d'une application mobile moderne nécessite des outils robustes garantissant la productivité des développeurs et les performances de l'application finale. Cette section décrit les outils logiciels et le matériel informatique mis en œuvre.

### 4.2.1 Outils et technologies logiciels
* **Visual Studio Code (VS Code)** : Éditeur de code source principal retenu pour ce projet. Apprécié pour sa légèreté et son écosystème d'extensions, il a été configuré avec les modules *ESLint* (analyse de code statique), *Prettier* (formatage automatique du code) et les outils de débogage pour React Native.
* **React Native (v0.81.5)** : Framework open-source développé par Meta permettant de concevoir des applications mobiles multiplateformes (Android et iOS) à partir d'une base de code unique. Il compile le code en composants graphiques natifs, garantissant une fluidité identique à celle d'une application développée en langage natif.
* **Expo (v54.0.34)** : Ensemble d'outils et de services entourant React Native. Expo permet d'accélérer le développement grâce à l'application **Expo Go**, qui permet de tester l'application en temps réel sur un smartphone physique en scannant simplement un code QR. De plus, il gère la navigation par fichiers et simplifie le processus de build final.
* **TypeScript (v5.9.2)** : Langage de programmation basé sur JavaScript auquel ont été ajoutés le typage statique et la programmation orientée objet. Son utilisation prévient l'apparition d'erreurs d'exécution lors des interactions de données complexes avec la base de données.
* **Supabase (@supabase/supabase-js v2.103.3)** : Solution Backend-as-a-Service (BaaS) hébergeant une base de données relationnelle PostgreSQL. Supabase prend en charge l'authentification sécurisée des utilisateurs, le stockage persistant des données et l'accès sécurisé aux données grâce au système de sécurité au niveau des lignes (**Row Level Security - RLS**).

### 4.2.2 Matériel informatique (Ordinateur de développement)
La phase de programmation, d'exécution des serveurs locaux et de modélisation a été réalisée sur un ordinateur portable d'ingénierie présentant les spécifications suivantes :
* **Système d'exploitation** : Microsoft Windows 11 Professionnel (64 bits).
* **Processeur** : Intel(R) Core(TM) i7 de 12ème génération (fréquence de base de 2.70 GHz avec Turbo Boost).
* **Mémoire vive (RAM)** : 16 Go DDR4 cadencée à 3200 MHz, permettant d'exécuter simultanément l'environnement de développement VS Code, le serveur Expo CLI, l'application de test API Postman et les navigateurs Web sans perte de performance.
* **Stockage** : SSD NVMe de 512 Go pour garantir un accès en lecture/écriture rapide aux dépendances Node.js (dossier `node_modules`).

---

## 4.3 Structure du projet
L'application **Tasmim App** adopte une structure de dossiers modulaire et standardisée, facilitant la séparation de la logique métier, des interfaces visuelles et de la configuration de la base de données.

### 4.3.1 Organisation des composants et répertoires de la solution
Pour structurer notre application de manière professionnelle, les répertoires et fichiers clés ont été organisés selon une architecture modulaire. Le tableau ci-dessous présente la répartition des responsabilités au sein des différents répertoires du projet.

##### Tableau 6 : Architecture physique et organisation des répertoires
| Répertoire / Fichier | Rôle dans l'architecture | Description et contenu fonctionnel |
| :--- | :--- | :--- |
| **`/app`** | Couche de Présentation & Navigation | Contient l'ensemble des écrans (views) et gère le routage par fichiers (*Expo Router*). |
| **`/app/(tabs)`** | Navigation principale de l'application | Regroupe les écrans du menu bas (Accueil, Services, Projets, Agence, Contact, Admin). |
| **`/components`** | Composants d'interface (UI) | Héberge les composants graphiques autonomes et réutilisables (cartes, animations). |
| **`/constants`** | Configuration globale visuelle | Centralise les constantes de style, notamment la palette graphique thématique. |
| **`/lib`** | Services et connecteurs externes | Contient le client de communication API de Supabase et les requêtes asynchrones. |
| **`/supabase`** | Persistance SQL & Politiques de sécurité | Stocke les scripts d'initialisation des tables PostgreSQL et les règles de sécurité RLS. |

### 4.3.2 Rôle et fonctionnement des fichiers clés
* **`app/_layout.tsx`** : Layout racine de l'application. Il initialise le thème visuel, charge les polices de caractères et surveille l'état d'authentification utilisateur.
* **`app/auth.tsx`** : Écran gérant la connexion et l'inscription des utilisateurs via des formulaires sécurisés ou via les protocoles OAuth Google et Facebook.
* **`app/(tabs)/index.tsx`** : Écran d'accueil présentant l'identité de l'agence, sa proposition de valeur et des boutons d'accès rapide.
* **`app/(tabs)/services.tsx`** : Liste dynamique des prestations offertes par l'agence, instanciée via des cartes graphiques structurées.
* **`app/(tabs)/projects.tsx`** : Galerie portfolio présentant les réalisations antérieures de Tasmim Web.
* **`app/(tabs)/contact.tsx`** : Formulaire interactif d'envoi de messages de contact avec sélecteur de prestation et accès aux réseaux sociaux.
* **`app/(tabs)/admin.tsx`** : Espace sécurisé réservé au responsable pour consulter, marquer comme lus ou supprimer les messages reçus.
* **`components/animated-reveal.tsx`** : Composant technique encapsulant la logique d'animation dynamique pour une apparition fluide des sections à l'écran.
* **`lib/supabase.ts`** : Module d'interaction réseau gérant les requêtes de données et la synchronisation de l'authentification avec le backend.
* **`supabase/contact_messages.sql`** : Schéma physique SQL de la table de messages, incluant les contraintes d'intégrité et les politiques RLS.

### 4.3.3 Structure physique de la base de données (Supabase)
Pour stocker de manière persistante les informations de l'application (profils des utilisateurs connectés et messages envoyés via le formulaire de contact), nous utilisons la base de données relationnelle **PostgreSQL** fournie par la plateforme **Supabase**. Deux tables clés composent le schéma de données physique de notre système :

1. **La table `profiles`** :
   Cette table sert à stocker les données de profil des utilisateurs s'étant connectés via l'application. Elle est reliée directement à la table interne d'authentification de Supabase (`auth.users`) par une contrainte d'intégrité de clé étrangère sur le champ `id`.
   * **Champs et types de données** : Le champ `id` (clé primaire, type `UUID`), `email` (type `TEXT`), `auth_provider` (type `TEXT`, identifie la provenance du compte : email, google, facebook), `provider_user_id` (type `TEXT`), `full_name` (type `TEXT`, nom complet de l'utilisateur), `avatar_url` (type `TEXT`, lien vers la photo de profil externe) et `created_at` (type `TIMESTAMPTZ`, date de création automatique).
   * `[Insérer ici la Capture d'écran 19 : Structure de la table profiles dans le Table Editor de Supabase]`

2. **La table `contact_messages`** :
   Cette table centralise toutes les soumissions de prospects via le formulaire de contact de l'application.
   * **Champs et types de données** : Le champ `id` (clé primaire auto-incrémentée, type `BIGINT`), `name` (type `TEXT`, nom du contact), `email` (type `TEXT`, email du contact), `phone` (type `TEXT`, numéro de téléphone), `service_type` (type `TEXT`, type de prestation sélectionnée), `message` (type `TEXT`, corps du message contenant le besoin), `is_read` (type `BOOLEAN`, initialisé par défaut à `false` pour la gestion des nouveaux messages) et `created_at` (type `TIMESTAMPTZ`, horodatage automatique de réception).
   * `[Insérer ici la Capture d'écran 20 : Structure de la table contact_messages dans le Table Editor de Supabase]`

### 4.3.4 Récapitulatif des opérations et accès à la base de données (Supabase)
Pour interagir avec les tables de données tout en garantissant la sécurité et le respect des droits définis par les politiques RLS (Row Level Security), l'application mobile exécute des requêtes spécifiques. Le tableau ci-dessous récapitule les opérations CRUD, les méthodes du SDK Supabase utilisées, les filtres appliqués et les rôles de sécurité requis.

##### Tableau 7 : Récapitulatif des opérations Supabase
| Table cible | Méthode Supabase | Condition / Filtre | Rôle autorisé | Description fonctionnelle |
| :--- | :--- | :--- | :--- | :--- |
| **`profiles`** | `select()` | `.eq('id', auth.uid())` | Utilisateur authentifié | Lecture automatique des informations du profil de l'utilisateur connecté pour initialiser la session mobile. |
| **`profiles`** | `upsert()` | `.eq('id', auth.uid())` | Utilisateur authentifié ou via le système | Création ou mise à jour du profil utilisateur suite à une connexion par mot de passe ou via OAuth (Google/Facebook). |
| **`contact_messages`** | `insert()` | Aucun filtre (insertion libre) | Tout visiteur (Anonyme / `anon` ou Authentifié) | Envoi d'une demande de devis ou de contact depuis le formulaire de l'application mobile. |
| **`contact_messages`** | `select()` | Trié par `created_at` (décroissant) | Administrateur uniquement (`najileila308@gmail.com`) | Récupération de tous les messages reçus pour les afficher dans la boîte de réception de l'espace modérateur. |
| **`contact_messages`** | `update()` | `.eq('id', id)` | Administrateur uniquement (`najileila308@gmail.com`) | Modification de la colonne `is_read` à `true` pour marquer un message comme traité. |
| **`contact_messages`** | `delete()` | `.eq('id', id)` | Administrateur uniquement (`najileila308@gmail.com`) | Suppression définitive d'un message de contact de la base de données. |

---

## 4.4 Présentation des interfaces de l'application
Cette section décrit le parcours utilisateur et présente les principaux écrans de l'application mobile **Tasmim App**, accompagnés d'explications sur leur fonctionnement et leur rôle technique.

### 4.4.1 Écran de Bienvenue (Landing Page / Splash Screen)
Cet écran constitue le premier contact visuel de l'utilisateur avec l'application. Conçu avec une esthétique moderne en mode sombre, il affiche le logo de l'agence **Tasmim Web**, son nom, son slogan (« Design digital, web et mobile dans une seule expérience »), ainsi qu'un badge d'accueil dynamique. Un bouton bleu saillant intitulé **« Commencer »** permet d'initier le parcours. Lors d'un appui sur ce bouton, une animation d'échelle et d'opacité se déclenche pour offrir une transition fluide et rediriger l'utilisateur vers l'écran d'authentification.
`[Insérer ici la Capture d'écran 1 : Écran de Bienvenue / Landing Page]`

### 4.4.2 Écran d'Authentification (Mon Compte - Connexion et Inscription)
Dès que l'utilisateur clique sur **« Commencer »**, il est dirigé vers cet écran d'authentification. Il offre une interface moderne et sécurisée structurée autour de plusieurs options d'accès :
1. **Authentification classique** : Un onglet à double état permet de basculer instantanément entre la **Connexion** (saisie de l'adresse e-mail et du mot de passe existant) et l'**Inscription** (création d'un nouveau compte si l'utilisateur n'en possède pas encore).
2. **Authentification rapide et tierce (OAuth)** : Deux boutons spécifiques en bas d'écran permettent de s'authentifier directement et sans mot de passe en utilisant un compte **Google** ou **Facebook**. Le flux OAuth externe est géré de façon transparente en redirigeant l'utilisateur sur le navigateur système avant de le ramener sur l'application avec sa session active.
`[Insérer ici la Capture d'écran 2 : Écran d'Authentification - Connexion et Inscription]`

### 4.4.3 Écran d'Accueil principal (Dashboard)
Une fois connecté, l'utilisateur accède au tableau de bord principal. Cet écran présente l'agence, met en valeur une bannière dynamique, et contient des raccourcis vers les sections phares de l'application.
`[Insérer ici la Capture d'écran 3 : Écran d'Accueil principal (Dashboard)]`

### 4.4.4 Écran des Services (Catalogue des prestations)
Cet écran présente le catalogue complet des compétences de Tasmim Web. Les six pôles majeurs de l'agence (Création de sites internet, Applications mobiles, Design UI/UX, e-commerce, Branding et Maintenance) y sont listés de façon claire. Chaque prestation est encapsulée dans une carte visuelle interactive comprenant une icône, un titre et un résumé explicatif.
`[Insérer ici la Capture d'écran 4 : Écran des Services]`

### 4.4.5 Écran des Projets (Portfolio)
Le portfolio regroupe sous forme de grille interactive les réalisations passées de l'agence. L'utilisateur peut y voir des exemples concrets de projets finalisés (sites web, chartes graphiques, applications Django/React), ce qui valide le savoir-faire technique et l'expérience de Tasmim Web.
`[Insérer ici la Capture d'écran 5 : Écran du Portfolio des projets]`

### 4.4.6 Écran de l'Agence (Présentation & Méthodologie)
Cet écran présente l'agence, ses valeurs fondamentales et détaille sa méthodologie projet structurée en quatre grandes phases (Planification, Conception, Développement, Lancement). Ce parcours didactique informe le client sur le déroulement de sa collaboration avec l'agence.
`[Insérer ici la Capture d'écran 6 : Écran de présentation de l'Agence]`

### 4.4.7 Écran de Contact (Formulaire interactif)
Cette interface regroupe toutes les coordonnées physiques et numériques de l'agence (téléphone, e-mail, réseaux sociaux LinkedIn et Instagram). Elle intègre un formulaire interactif où le prospect saisit ses coordonnées, choisit le type de service via des jetons interactifs ("chips"), décrit son besoin et transmet instantanément sa demande au backend Supabase.
`[Insérer ici la Capture d'écran 7 : Écran du Formulaire de contact]`

### 4.4.8 Écran de l'Espace Responsable (Administration des messages)
Cet écran de gestion est réservé exclusivement au responsable de l'agence (`najileila308@gmail.com`). Il affiche le tableau de bord de modération avec le décompte des nouveaux messages reçus. Le responsable peut actualiser la liste, marquer un message comme "Lu" d'un appui, ou supprimer définitivement une soumission après validation de sécurité.
`[Insérer ici la Capture d'écran 8 : Écran de l'Espace Responsable / Administration]`

---

## 4.5 Extraits de code significatifs
Cette section présente de courts extraits ciblés illustrant les mécanismes de communication de l'application mobile.

### 4.5.1 Initialisation du client de données (`lib/supabase.ts`)
L'extrait suivant montre la configuration du client Supabase pour sécuriser les flux mobiles via le protocole d'authentification PKCE.

```typescript
export const supabase = (supabaseUrl && supabasePublishableKey)
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
        detectSessionInUrl: false,
        flowType: 'pkce', // Protocole sécurisé pour mobile
      },
    })
  : null;
```
* **Explication** : Le client est instancié avec le type de flux `pkce` (Proof Key for Code Exchange), une norme recommandée sur mobile pour prévenir l'interception des jetons d'authentification lors des redirections.

---

### 4.5.2 Connexion rapide par redirection OAuth (`lib/supabase.ts`)
Cet extrait montre l'appel asynchrone ouvrant le navigateur sécurisé pour une connexion Google ou Facebook.

```typescript
const redirectTo = Linking.createURL('/auth', { scheme: 'tasmimapp' });
const { data, error } = await supabase.auth.signInWithOAuth({
  provider,
  options: { redirectTo, skipBrowserRedirect: true },
});
const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
```
* **Explication** : Le module génère une URL de redirection personnalisée (`tasmimapp://auth`) et sollicite le navigateur système sécurisé via `WebBrowser.openAuthSessionAsync` pour s'identifier sans exposer les mots de passe à l'application.

---

### 4.5.3 Contrôle de saisie du formulaire (`app/(tabs)/contact.tsx`)
Cet extrait montre la validation des champs obligatoires avant l'envoi de données.

```typescript
if (!name.trim() || !email.trim() || !message.trim()) {
  showFeedback('error', 'Merci de remplir votre nom, email et la description de votre besoin.');
  return;
}
```
* **Explication** : La méthode `.trim()` supprime les espaces vides. Si l'un des trois champs obligatoires est vide, le script interrompt immédiatement l'exécution et renvoie un message d'erreur à l'utilisateur, évitant d'envoyer des requêtes inutiles au serveur.

---

### 4.5.4 Insertion asynchrone des messages (`app/(tabs)/contact.tsx`)
Cet extrait illustre l'appel API permettant de sauvegarder le message de contact dans la base de données PostgreSQL de Supabase.

```typescript
await saveContactMessage({
  name: name.trim(),
  email: email.trim(),
  phone: phone.trim() || null,
  service_type: service,
  message: message.trim(),
});
```
* **Explication** : La fonction appelle la méthode d'insertion de la couche domaine. Les données validées sont enregistrées en temps réel sous forme d'une nouvelle ligne sécurisée dans la table PostgreSQL distante.

---

## 4.6 Tests et validation de l'application
Pour garantir le bon fonctionnement opérationnel de **Tasmim App**, nous avons procédé à une série de tests fonctionnels et d'intégration. Cette phase consiste à dérouler des scénarios d'utilisation réels, à observer le comportement des interfaces et à vérifier la bonne persistance et modification des données au sein de la base de données PostgreSQL de Supabase.

### 4.6.1 Tests du module d'authentification et de connexion
Ce test valide la sécurité d'accès et la gestion des comptes utilisateurs.
* **Scénario de connexion administrative** : Nous avons testé la connexion avec l'adresse email réservée au responsable (`najileila308@gmail.com`). Lorsque le mot de passe saisi est correct, la session est ouverte avec succès et l'utilisateur est immédiatement redirigé vers l'espace de modération des messages.
* **Scénario d'échec de connexion** : En cas de saisie d'un mot de passe incorrect ou d'un email non enregistré, le module de sécurité de Supabase Auth bloque la requête. L'application intercepte l'erreur et affiche une boîte de dialogue d'avertissement indiquant que les identifiants sont invalides.
  `[Insérer ici la Capture d'écran 9 : Écran de connexion mobile affichant l'alerte d'erreur d'authentification]`
* **Scénario d'authentification rapide (OAuth Google/Facebook)** : L'utilisateur appuie sur l'un des boutons sociaux. L'application ouvre une session Web sécurisée. Une fois connecté, le déclencheur SQL (Trigger) de Supabase crée ou met à jour la ligne correspondante dans la table `public.profiles` de la base de données.
  `[Insérer ici la Capture d'écran 10 : Console Supabase - Visualisation des comptes créés dans la section Authentication]`
  `[Insérer ici la Capture d'écran 11 : Console Supabase - Lignes correspondantes ajoutées dans la table profiles de la base de données]`

---

### 4.6.2 Tests du formulaire de contact (Saisie et persistance)
Ce test valide le fonctionnement du formulaire de contact, de la validation des données côté client à l'insertion physique dans la base de données.
* **Validation des champs obligatoires et du format d'email** : Si l'utilisateur tente d'envoyer le formulaire en laissant les champs obligatoires (nom, email ou message) vides, ou s'il saisit une adresse email au format incorrect (sans le symbole "@" ou sans nom de domaine), le script interrompt l'envoi. Un message d'erreur rouge s'affiche sous le formulaire pour guider l'utilisateur.
  `[Insérer ici la Capture d'écran 12 : Formulaire de contact affichant le message d'erreur de validation des champs]`
* **Soumission réussie et enregistrement** : Lorsque des données valides sont saisies, l'application exécute la fonction asynchrone `saveContactMessage()`. Les champs du formulaire sont réinitialisés (vidés) et un bandeau vert animé confirme à l'utilisateur que son message a bien été envoyé.
  `[Insérer ici la Capture d'écran 13 : Formulaire de contact affichant le message de confirmation d'envoi réussi]`
* **Vérification au niveau de la base de données** : Pour confirmer que le message a bien été persisté, nous nous connectons à la console d'administration de Supabase. Dans l'explorateur de base de données, nous constatons l'insertion d'une nouvelle ligne dans la table `contact_messages` contenant exactement les données transmises depuis l'application mobile (nom, email, téléphone, type de service, texte du message et statut `is_read = false`).
  `[Insérer ici la Capture d'écran 14 : Console Supabase - Table contact_messages affichant la ligne du message reçu]`

---

### 4.6.3 Tests de l'espace de modération (Espace Responsable)
Ce test valide les fonctionnalités d'administration des messages réservées au responsable de l'agence.
* **Contrôle d'accès et affichage** : L'accès à cette interface est restreint au compte administrateur. Lors de l'ouverture de la page, la liste des messages est récupérée par une requête asynchrone. Les messages non traités affichent un badge vert « Nouveau ».
* **Marquage d'un message comme lu** : Lorsque le responsable clique sur la carte d'un message non lu, l'application exécute une requête de mise à jour pour modifier la colonne `is_read` à `true`. L'interface réagit instantanément en changeant le badge vert « Nouveau » en un badge bleu « Lu ».
  `[Insérer ici la Capture d'écran 15 : Écran de l'Espace Responsable montrant le changement d'état visuel d'un message (Nouveau à Lu)]`
  `[Insérer ici la Capture d'écran 16 : Console Supabase - Table contact_messages montrant le passage de la colonne is_read de false à true pour le message traité]`
* **Suppression définitive d'un message** : Si le responsable clique sur le bouton de suppression, une boîte de dialogue demande confirmation. Après validation, une requête SQL de type `DELETE` est transmise. Le message est supprimé de la table PostgreSQL et disparaît immédiatement de l'affichage mobile.
  `[Insérer ici la Capture d'écran 17 : Boîte de dialogue de confirmation de suppression sur l'application mobile]`
  `[Insérer ici la Capture d'écran 18 : Console Supabase - Table contact_messages après la suppression du message]`

---

## 4.7 Génération du fichier APK
Pour compiler et déployer l'application mobile sur des appareils Android physiques, nous avons utilisé les services cloud **EAS Build** d'Expo. Cette approche évite d'avoir à installer l'intégralité d'Android Studio et du SDK Android localement.

### 4.7.1 Processus de configuration et compilation
1. **Installation de l'interface de ligne de commande EAS** :
   ```bash
   npm install -g eas-cli
   ```
2. **Connexion au compte développeur Expo** :
   ```bash
   eas login
   ```
3. **Configuration du fichier `eas.json`** :
   Le fichier `eas.json` à la racine du projet spécifie les profils de build. Nous y avons configuré un profil `preview` pour générer un fichier d'installation APK standard (plutôt qu'un bundle `.aab` destiné au Google Play Store) :
   ```json
   {
     "build": {
       "preview": {
         "android": {
           "buildType": "apk"
         }
       }
     }
   }
   ```
4. **Lancement de la compilation dans le Cloud** :
   La commande suivante envoie le code source de l'application vers les serveurs sécurisés d'Expo pour compilation :
   ```bash
   eas build --platform android --profile preview
   ```
5. **Récupération et installation de l'APK** :
   Une fois la compilation cloud terminée (généralement en 5 à 10 minutes), l'outil CLI fournit un lien direct de téléchargement ainsi qu'un **code QR**. En scannant ce code QR avec l'appareil photo du smartphone Android, le fichier d'installation APK est téléchargé, puis installé après avoir activé l'option "Autoriser l'installation depuis des sources inconnues" dans les paramètres de sécurité du téléphone.

---

## 4.8 Conclusion du chapitre
Le présent chapitre a permis de concrétiser la conception théorique de **Tasmim App** sous forme d'une application mobile moderne, stable et entièrement fonctionnelle. L'utilisation combinée du framework React Native, des outils de la suite Expo et des services asynchrones de Supabase nous a permis de livrer une application fluide dotée d'une interface utilisateur en mode sombre haut de gamme. De plus, la mise en œuvre de tests fonctionnels rigoureux garantit la fiabilité du formulaire de contact et la sécurité de l'espace de modération administrative. La génération réussie de l'APK finalise cette phase technique et ouvre la voie aux phases de déploiement et de tests utilisateurs finaux.
