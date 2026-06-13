# CHAPITRE 3 : Conception de l'application (Suite)

Voici la suite rédigée pour le Chapitre 3 de votre rapport de PFE, à partir de la section **3.6**. Vous pouvez copier-coller ce contenu directement dans votre document Word.

---

### 3.6 Modèle logique de données (MLD)

Le Modèle Logique de Données (MLD) représente la structure des données sous forme de tables relationnelles. Il découle directement du Modèle Conceptuel de Données (MCD) présenté précédemment, en appliquant les règles de passage classiques du modèle entité-association au modèle relationnel :
1. Chaque entité du MCD devient une table du MLD.
2. Les identifiants des entités deviennent des clés primaires (indiquées en gras et soulignées).
3. Les relations de type (0,1) ou (1,1) vers (0,N) se traduisent par la migration de la clé primaire de la table côté "1" comme clé étrangère (précédée de `#`) dans la table côté "N".

Dans notre système, le MLD se présente comme suit :

* **PROFILES** (<u>**id**</u> : UUID, email : Chaîne, auth_provider : Chaîne, provider_user_id : Chaîne [Null], full_name : Chaîne [Null], avatar_url : Chaîne [Null], created_at : Date/Heure)
  * *Note : `id` est une clé primaire et fait également référence à la clé primaire `id` de la table d'authentification interne de Supabase (`auth.users`).*

* **CONTACT_MESSAGES** (<u>**id**</u> : Entier, name : Chaîne, email : Chaîne, phone : Chaîne [Null], service_type : Chaîne, message : Texte, is_read : Booléen, created_at : Date/Heure, #user_id : UUID [Null], #read_by : UUID [Null])
  * *`user_id` est une clé étrangère faisant référence à `auth.users(id)`, représentant l'utilisateur ayant envoyé le message s'il était authentifié.*
  * *`read_by` est une clé étrangère faisant référence à `auth.users(id)`, représentant le responsable/administrateur qui a lu ou traité le message.*

---

### 3.7 Modèle physique de données (MPD) et Dictionnaire de données

Le Modèle Physique de Données (MPD) correspond à l'implémentation concrète des tables dans le système de gestion de base de données PostgreSQL de Supabase.

#### 3.7.1 Dictionnaire de données

Le tableau ci-dessous détaille les caractéristiques physiques de chaque champ utilisé dans nos tables.

##### Tableau 1 : Dictionnaire de données de la table `profiles`
| Nom du champ | Type de données | Contraintes | Description |
| :--- | :--- | :--- | :--- |
| **id** | UUID | PK, FK (`auth.users.id`) | Identifiant unique de l'utilisateur (lié à l'authentification) |
| **email** | TEXT | Unique, Nullable | Adresse email de l'utilisateur |
| **auth_provider** | TEXT | Not Null (Default: 'email') | Fournisseur d'accès ('email', 'google', 'facebook', 'unknown') |
| **provider_user_id**| TEXT | Nullable | Identifiant unique chez le fournisseur tiers (ex. Google/Facebook) |
| **full_name** | TEXT | Nullable | Nom complet de l'utilisateur |
| **avatar_url** | TEXT | Nullable | URL de l'image de profil |
| **created_at** | TIMESTAMPTZ | Not Null (Default: `now()`) | Date et heure de création du profil |

##### Tableau 2 : Dictionnaire de données de la table `contact_messages`
| Nom du champ | Type de données | Contraintes | Description |
| :--- | :--- | :--- | :--- |
| **id** | BIGINT | PK, Auto-incrémenté | Identifiant unique du message de contact |
| **name** | TEXT | Not Null | Nom ou prénom du visiteur |
| **email** | TEXT | Not Null | Adresse email de contact du visiteur |
| **phone** | TEXT | Nullable | Numéro de téléphone du visiteur |
| **service_type** | TEXT | Not Null | Type de service demandé (ex: Création Web, Mobile, SEO...) |
| **message** | TEXT | Not Null | Contenu textuel de la demande |
| **is_read** | BOOLEAN | Not Null (Default: `false`) | Statut du message (lu/non lu par le responsable) |
| **created_at** | TIMESTAMPTZ | Not Null (Default: `now()`) | Date et heure d'envoi du message |

---

### 3.8 Sécurité et Intégrité des données (Row Level Security & Triggers)

L'utilisation d'un backend-as-a-service (BaaS) comme Supabase implique d'intégrer les règles de sécurité et de synchronisation directement au niveau de la base de données PostgreSQL. Deux mécanismes clés ont été mis en œuvre :

#### 3.8.1 Synchronisation automatique par Trigger SQL
Afin de maintenir la cohérence des données, nous avons configuré un déclencheur (**Trigger**) sur la table interne d'authentification `auth.users`. À chaque fois qu'un utilisateur s'inscrit sur l'application (via adresse email ou via un fournisseur tiers comme Google/Facebook), le déclencheur exécute automatiquement une fonction SQL (`handle_new_user()`) qui insère ou met à jour les données publiques dans la table `public.profiles`.

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, auth_provider, provider_user_id, full_name, avatar_url)
  values (
    new.id,
    nullif(new.email, ''),
    coalesce(new.raw_app_meta_data->>'provider', 'email'),
    coalesce(new.raw_user_meta_data->>'provider_id', new.raw_user_meta_data->>'sub'),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email = coalesce(excluded.email, public.profiles.email),
    auth_provider = coalesce(excluded.auth_provider, public.profiles.auth_provider),
    full_name = coalesce(excluded.full_name, public.profiles.full_name);
  return new;
end;
$$;
```

#### 3.8.2 Sécurité des données : Row Level Security (RLS)
Pour empêcher les accès non autorisés et garantir la confidentialité des messages et des profils, la sécurité au niveau des lignes (**Row Level Security - RLS**) a été activée sur toutes les tables.

1. **Table `profiles`** :
   Chaque utilisateur authentifié ne peut lire et modifier que son propre profil.
   * *Politique de lecture/mise à jour* : `auth.uid() = id`.

2. **Table `contact_messages`** :
   * **Insertion** : Tout visiteur (qu'il soit connecté ou anonyme) est autorisé à insérer un nouveau message via le formulaire de contact.
     * *Politique d'insertion* : Autorisé pour les rôles `anon` et `authenticated`.
   * **Administration** : Seul le responsable de l'agence (identifié par son adresse email spécifique) possède les droits de lecture, modification (marquer comme lu) et suppression des messages reçus.
     * *Politique de lecture et de modification* : `auth.email() = 'najileila308@gmail.com'`.

---

### 3.9 Conclusion du chapitre

Ce chapitre de conception a permis de jeter les bases architecturales et logiques de l'application **Tasmim App**. À travers les différents diagrammes UML (classes, séquences) et les modèles de données (MCD, MLD, MPD), nous avons structuré la solution technique et défini le modèle relationnel sous PostgreSQL. De plus, l'intégration des politiques RLS et des triggers SQL au sein de Supabase assure une sécurité rigoureuse et une intégrité optimale des données. 

Ces étapes indispensables de conception nous permettent d'aborder sereinement la phase suivante : la réalisation et l'implémentation de la solution mobile.
