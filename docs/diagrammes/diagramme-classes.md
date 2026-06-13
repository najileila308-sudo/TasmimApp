# Diagramme de classes - TasmimApp

Ce diagramme represente les principales classes metier de l'application TasmimApp : authentification, profil utilisateur, messages de contact, espace administrateur, services et projets affiches dans l'application.

```mermaid
classDiagram
    direction LR

    class User {
        +string id
        +string email
        +signIn()
        +signUp()
        +signOut()
        +resetPassword()
    }

    class Profile {
        +string id
        +string|null email
        +AuthProvider authProvider
        +string|null providerUserId
        +string|null fullName
        +string|null avatarUrl
        +Date createdAt
    }

    class Admin {
        +string email
        +signInAdmin()
        +signOutAdmin()
        +viewMessages()
        +markMessageAsRead()
        +deleteMessage()
    }

    class ContactMessage {
        +number id
        +string name
        +string email
        +string|null phone
        +string serviceType
        +string message
        +boolean isRead
        +Date createdAt
    }

    class ServiceItem {
        +string id
        +string title
        +string subtitle
        +string description
        +string[] highlights
        +string icon
        +AccentTone accent
        +string image
    }

    class ProjectItem {
        +string id
        +string title
        +string category
        +string summary
        +string[] tags
        +AccentTone accent
        +string image
    }

    class ContactDetails {
        +string phone
        +string email
        +string address
        +string hours
    }

    class AuthService {
        +signInUser(email, password)
        +signUpUser(email, password)
        +signInWithOAuthProvider(provider)
        +sendPasswordResetEmail(email)
        +updateUserPassword(password)
        +getCurrentSession()
        +getCurrentUserProfile()
    }

    class ContactService {
        +saveContactMessage(payload)
    }

    class AdminService {
        +fetchContactMessages()
        +markContactMessageAsRead(id)
        +deleteContactMessage(id)
        +isAllowedAdminSession(session)
    }

    class SupabaseClient {
        +auth
        +from(table)
    }

    class AuthProvider {
        <<enumeration>>
        email
        google
        facebook
        unknown
    }

    class AccentTone {
        <<enumeration>>
        accent
        blue
        amber
    }

    User "1" --> "0..1" Profile : possede
    User ..> AuthService : utilise
    Profile --> AuthProvider : type
    Admin ..> User : session utilisateur autorisee
    Admin ..> AdminService : gere
    AdminService ..> ContactMessage : consulte/modifie/supprime
    ContactService ..> ContactMessage : cree
    AuthService ..> SupabaseClient : utilise
    ContactService ..> SupabaseClient : utilise
    AdminService ..> SupabaseClient : utilise
    ServiceItem --> AccentTone : utilise
    ProjectItem --> AccentTone : utilise
    ContactDetails ..> ContactMessage : fournit les coordonnees
```

## Description courte

- `User` represente l'utilisateur authentifie via email, Google ou Facebook.
- `Profile` stocke les informations complementaires de l'utilisateur dans Supabase.
- `Admin` represente le responsable autorise par email a consulter et gerer les messages.
- `ContactMessage` represente les messages envoyes depuis le formulaire de contact.
- `ServiceItem` et `ProjectItem` representent les services et projets affiches dans l'application.
- `AuthService`, `ContactService` et `AdminService` regroupent les operations principales avec Supabase.
