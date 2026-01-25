sequenceDiagram
  participant Browser as User (Browser)
  participant App as Client App (SessionProvider)
  participant Provider as OAuth Provider (Google/GitHub)
  participant NextAuth as NextAuth API (/api/auth/[...nextauth])
  participant DB as MongoDB (User collection)

  Browser->>App: Click "Sign in with Provider"
  App->>Provider: Redirect to Provider OAuth URL (signIn)
  Browser->>Provider: Auth request (login/consent)
  Provider-->>Browser: Redirect back to NextAuth callback (code)
  Browser->>NextAuth: /api/auth/callback?code=...
  NextAuth->>Provider: Exchange code for tokens & profile
  Provider-->>NextAuth: Returns profile (email, name, image)
  NextAuth->>DB: getOrCreateUser(email, name, image)
  DB-->>NextAuth: Return DB user document (_id)
  NextAuth->>NextAuth: signIn callback attaches user.id = DB._id
  NextAuth->>NextAuth: jwt callback sets token.uid = user.id
  NextAuth->>App: session callback copies token.uid -> session.user.id
  App->>Browser: SessionProvider exposes session to useSession()
  Browser->>App: UI shows authenticated state (avatar, profile link)