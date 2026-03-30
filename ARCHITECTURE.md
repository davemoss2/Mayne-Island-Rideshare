# Mayne Island Rideshare — Architecture

This document describes the structure and data flows of the application using flowcharts and schematics. All diagrams use [Mermaid](https://mermaid.js.org/) and render directly in GitHub.

---

## 1. High-Level System Overview

```mermaid
graph TB
    subgraph Browser["Browser (Client-Only)"]
        subgraph Providers["React Context Providers (layout.tsx)"]
            AC["AuthContext\n─────────────\nuser: UserProfile\nisLoading: boolean\nlogin / register\nlogout / updateProfile"]
            DC["DataContext\n─────────────\nrideRequests[ ]\ndriverTrips[ ]\ncreate / confirm\ncancel / delete"]
        end

        subgraph Pages["Pages (Next.js App Router)"]
            P0["/ Landing"]
            P1["/auth/login"]
            P2["/auth/register"]
            P3["/rider"]
            P4["/driver"]
            P5["/board"]
            P6["/map"]
            P7["/profile"]
            P8["/emergency"]
        end

        subgraph Components["Shared Components"]
            H["Header\n(nav + logout)"]
            RRC["RideRequestCard"]
            TC["TripCard\n+ social share"]
            MC["Map\n(Leaflet – lazy)"]
        end

        LS[("localStorage\n──────────\ncurrentUser\nusers[ ]\nrideRequests[ ]\ndriverTrips[ ]")]
    end

    subgraph External["External Services"]
        OSM["OpenStreetMap\n(map tiles)"]
        GM["Google Maps\n(route export)"]
        WZ["Waze\n(route export)"]
        FB["Facebook Share"]
        TW["Twitter / X Share"]
        WA["WhatsApp Share"]
        FB_SDK["Firebase SDK\n(initialized,\nready for prod)"]
    end

    AC <-->|"read / write"| LS
    DC <-->|"read / write\n+ 5 s poll"| LS
    Pages -->|"useAuth()"| AC
    Pages -->|"useData()"| DC
    Pages --> H
    Pages --> RRC
    Pages --> TC
    Pages --> MC
    MC -->|"tiles"| OSM
    MC -->|"deep-link"| GM
    MC -->|"deep-link"| WZ
    TC -->|"share URL"| FB
    TC -->|"share URL"| TW
    TC -->|"share URL"| WA
```

---

## 2. Page & Component Tree

```mermaid
graph TD
    LY["layout.tsx\n AuthProvider + DataProvider"]

    LY --> HOME["/  Landing page"]
    LY --> LOGIN["/auth/login"]
    LY --> REG["/auth/register"]
    LY --> RIDER["/rider  🔒"]
    LY --> DRIVER["/driver  🔒"]
    LY --> BOARD["/board"]
    LY --> MAP["/map"]
    LY --> PROFILE["/profile  🔒"]
    LY --> EMERGENCY["/emergency"]

    RIDER   --> RRC1["RideRequestCard\n(my requests)"]
    RIDER   --> TC1["TripCard\n(available trips)"]
    DRIVER  --> RRC2["RideRequestCard\n(pending requests)"]
    DRIVER  --> TC2["TripCard\n(my posted trips)"]
    BOARD   --> TC3["TripCard\n(all active trips)"]
    MAP     --> MC["Map component\n(Leaflet – dynamic import)"]
    EMERGENCY --> RRC3["Active ride info\n(inline)"]

    style RIDER    fill:#fef3c7,stroke:#d97706
    style DRIVER   fill:#fef3c7,stroke:#d97706
    style PROFILE  fill:#fef3c7,stroke:#d97706

    classDef lock fill:#fef3c7,stroke:#d97706
    class RIDER,DRIVER,PROFILE lock
```

> 🔒 = requires authentication. The page checks `isLoading` before redirecting so localStorage hydration completes first.

---

## 3. Authentication Flow

```mermaid
flowchart TD
    A([User visits any page]) --> B{Authenticated?\ncheck localStorage}
    B -->|"Yes – user in localStorage"| C{Role?}
    B -->|"No"| D[Show public page\nor redirect to /auth/login]

    C -->|rider| E["/rider dashboard"]
    C -->|driver| F["/driver dashboard"]
    C -->|both| G["/rider dashboard\n(can also visit /driver)"]

    D --> H{Register or Login?}
    H -->|Register| I["/auth/register\nfill name, email, phone\npassword, role\nvehicle / rider prefs"]
    H -->|Login| J["/auth/login\nemail + password"]

    I --> K["register()\n→ store user in localStorage\n→ auto-login"]
    J --> L["login()\n→ validate credentials\n→ load user from localStorage"]

    K --> M["Set currentUser\nin localStorage + React state"]
    L --> M
    M --> C

    style I fill:#d1fae5,stroke:#059669
    style J fill:#d1fae5,stroke:#059669
    style K fill:#bfdbfe,stroke:#2563eb
    style L fill:#bfdbfe,stroke:#2563eb
```

---

## 4. Ride Request Lifecycle

```mermaid
sequenceDiagram
    participant R  as Rider (/rider)
    participant DC as DataContext
    participant LS as localStorage
    participant D  as Driver (/driver)
    participant E  as Emergency page

    R->>DC: createRideRequest(pickup, destination, needs)
    DC->>LS: save rideRequests[]   (status = "pending")
    note over DC,LS: DataContext polls every 5 s

    D->>DC: useData() – sees pending requests
    DC-->>D: rideRequests[] (status = "pending")
    D->>DC: confirmRideRequest(requestId, driverId, name, phone, vehicle)
    DC->>LS: update status → "confirmed" + driver info
    DC-->>R: RideRequestCard re-renders\nshows driver name / phone / vehicle

    R->>E: visits /emergency
    E->>DC: finds confirmed ride for user
    DC-->>E: shows driver contact info inline

    note over R,D: Either party can call 911 / RCMP\nfrom the Emergency page at any time
```

---

## 5. Driver Trip (Message Board) Flow

```mermaid
flowchart LR
    subgraph DriverDash["/driver dashboard"]
        FORM["Post Trip form\n─────────────\ndeparture location\ndestination\ntime, seats\nnotes"]
        MYTRIPS["My Posted Trips\n(TripCard × n)"]
    end

    subgraph Board["/board  Community Message Board"]
        ALL["All Active Trips\n(TripCard × n)"]
    end

    subgraph Share["Social Sharing (TripCard)"]
        COPY["📋 Copy link"]
        FB["📘 Facebook"]
        TW["🐦 Twitter / X"]
        WA["💬 WhatsApp"]
    end

    subgraph Map["/map  Route Planner"]
        LEAF["Leaflet map\nMayne Island landmarks"]
        GM["Open in Google Maps"]
        WAZE["Open in Waze"]
    end

    FORM -->|"createDriverTrip()"| DC[(DataContext\nlocalStorage)]
    DC --> MYTRIPS
    DC --> ALL
    ALL --> Share
    MYTRIPS -->|"deleteDriverTrip()"| DC
    Board -->|"deeplink to route"| Map
    LEAF --> GM
    LEAF --> WAZE
```

---

## 6. Data Layer

```mermaid
erDiagram
    UserProfile {
        string uid PK
        string name
        string email
        string phone
        string role "rider | driver | both"
        string vehicleDescription
        string petsAllowed "yes | no | case-by-case"
        int    childSeatsAvailable
        bool   wheelchairAccessible
        string cargoCapacity
        object emergencyContact
        bool   hasPet
        bool   needsChildSeat
        bool   needsWheelchairAccess
        string cargoNeeds
        date   createdAt
    }

    RideRequest {
        string id PK
        string riderId   FK
        string riderName
        string riderPhone
        string destination
        string pickupLocation
        string notes
        bool   hasPet
        bool   needsChildSeat
        bool   needsWheelchairAccess
        string cargoDescription
        string status "pending | confirmed | completed | cancelled"
        string confirmedDriverId
        string confirmedDriverName
        string confirmedDriverPhone
        string confirmedDriverVehicle
        date   createdAt
    }

    DriverTrip {
        string id PK
        string driverId FK
        string driverName
        string driverPhone
        string destination
        string departureTime
        string departureLocation
        int    availableSeats
        bool   petsAllowed
        int    childSeatsAvailable
        bool   wheelchairAccessible
        string notes
        string status "active | full | completed"
        date   createdAt
    }

    UserProfile ||--o{ RideRequest  : "rider submits"
    UserProfile ||--o{ DriverTrip   : "driver posts"
    UserProfile ||--o{ RideRequest  : "driver confirms"
```

---

## 7. Role-Based Access Matrix

```mermaid
graph LR
    subgraph Roles
        RO["🧍 Rider"]
        DR["🚗 Driver"]
        BO["🧍🚗 Both"]
        GU["👤 Guest\n(not logged in)"]
    end

    subgraph Routes
        HOME["/ Landing"]
        LOGIN["/auth/login"]
        REG["/auth/register"]
        RIDER["/rider"]
        DRIVER["/driver"]
        BOARD["/board"]
        MAP["/map"]
        EMER["/emergency"]
        PROF["/profile"]
    end

    RO  -->|"✅ full access"| RIDER
    RO  -->|"❌ redirect /rider"| DRIVER
    DR  -->|"❌ redirect /driver"| RIDER
    DR  -->|"✅ full access"| DRIVER
    BO  -->|"✅ full access"| RIDER
    BO  -->|"✅ full access"| DRIVER
    GU  -->|"❌ redirect /auth/login"| RIDER
    GU  -->|"❌ redirect /auth/login"| DRIVER
    GU  -->|"❌ redirect /auth/login"| PROF

    RO  -->|"✅"| BOARD
    DR  -->|"✅"| BOARD
    BO  -->|"✅"| BOARD
    GU  -->|"✅ read-only"| BOARD

    RO  -->|"✅"| MAP
    DR  -->|"✅"| MAP
    BO  -->|"✅"| MAP
    GU  -->|"✅"| MAP

    RO  -->|"✅"| EMER
    DR  -->|"✅"| EMER
    BO  -->|"✅"| EMER
    GU  -->|"✅"| EMER

    RO  -->|"✅"| PROF
    DR  -->|"✅"| PROF
    BO  -->|"✅"| PROF
```

---

## 8. Production Upgrade Path

The app runs in **demo mode** today (localStorage only). To deploy for real community use:

```mermaid
flowchart LR
    subgraph Now["Demo Mode (current)"]
        LS["localStorage\n(single browser)"]
        MOCK["AuthContext\nlogin / register\n→ localStorage"]
    end

    subgraph Prod["Production Mode"]
        FB_AUTH["Firebase Auth\n(email + OAuth)"]
        FS["Firestore\n(real-time listeners)"]
        FCM["Firebase Cloud\nMessaging\n(push notifications)"]
        ENV[".env.local\nFIREBASE_API_KEY etc."]
    end

    MOCK  -->|"replace with"| FB_AUTH
    LS    -->|"replace with"| FS
    LS    -->|"add"| FCM
    ENV   -->|"configure"| FB_AUTH
    ENV   -->|"configure"| FS

    note1["src/lib/firebase.ts\nalready reads env vars\nand initialises the SDK"]
    ENV --> note1
```

> **Required `.env.local` keys** (see `.env.example`):
> `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`,
> `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`,
> `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`
