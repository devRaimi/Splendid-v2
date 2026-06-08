# Splendid Puff React Project Structure

## 📂 File Organization

```
splendid-puff-react/
│
├── 📄 index.html                 # HTML entry point
├── 📄 main.jsx                   # React app initialization
├── 📄 App.jsx                    # Main app component & routing
├── 📄 styles.css                 # Global styles (responsive)
├── 📄 config.js                  # Configuration & constants
│
├── 📁 context/
│   └── AppContext.jsx            # Global state & shared logic
│
├── 📁 components/
│   ├── index.js                  # Component exports
│   ├── Toast.jsx                 # Toast notifications
│   │
│   ├── CustomerApp.jsx           # Customer mode container
│   ├── OrderForm.jsx             # Multi-step order form (Steps 1-3)
│   ├── TrackOrder.jsx            # Order tracking interface
│   │
│   ├── AdminApp.jsx              # Admin mode container
│   ├── AdminLock.jsx             # PIN-protected lock screen
│   ├── AdminPanel.jsx            # Admin dashboard
│   └── OrderCard.jsx             # Individual order display
│
├── 📄 vite.config.js             # Build configuration
├── 📄 package.json               # Dependencies
├── 📄 .gitignore                 # Git ignore patterns
│
├── 📄 README.md                  # Main documentation
├── 📄 MIGRATION_GUIDE.md         # Vanilla JS → React guide
└── 📄 PROJECT_STRUCTURE.md       # This file

```

## 🔑 Key Files Explained

### Entry Points
- **index.html**: Contains `<div id="root">` and loads React app
- **main.jsx**: Initializes React, wraps app in AppProvider
- **App.jsx**: Root component, manages customer/admin switching

### State Management
- **AppContext.jsx**: Centralized state using React Hooks
  - Orders array
  - Toast notifications
  - Helper functions
  - Google Sheets integration

### Customer Features
- **OrderForm.jsx**: Main customer interface
  - Step 1: Product selection (products, sizes, campus)
  - Step 2: Details & payment (forms, receipt upload)
  - Step 3: Success screen (order reference)
  
- **TrackOrder.jsx**: Look up existing orders by reference

- **CustomerApp.jsx**: Tab-based navigation container

### Admin Features
- **AdminApp.jsx**: Manages lock/unlock states
- **AdminLock.jsx**: PIN authentication screen
- **AdminPanel.jsx**: Dashboard with stats and filters
- **OrderCard.jsx**: Expandable order details with actions

### Styling
- **styles.css**: 600+ lines of responsive CSS
  - CSS variables for theming
  - Mobile-first design
  - Dark/light mode support for admin

### Configuration
- **config.js**: Business settings
  - Products, sizes, flavors
  - Campus locations
  - Bank details
  - Admin PIN
  - Google Sheets webhook

## 🔄 Data Flow

```
User Action
    ↓
Component State Update
    ↓
AppContext (if needed)
    ↓
localStorage / Google Sheets
    ↓
UI Re-render
```

## 🎯 Component Hierarchy

```
App
├── CustomerApp
│   ├── Header (with nav tabs)
│   ├── OrderForm (conditional steps)
│   ├── TrackOrder (conditional)
│   └── Toast
│
└── AdminApp
    ├── AdminLock (conditional)
    └── AdminPanel
        ├── Header
        ├── Stats Cards
        ├── Filter Chips
        └── OrderCard[] (list)
            ├── Order Header
            ├── Order Items
            ├── Detail Grid (expandable)
            └── Action Buttons
```

## 📦 Dependencies

```json
{
  "react": "^18.2.0",           // Core React library
  "react-dom": "^18.2.0",       // DOM rendering
  "react-router-dom": "^6.20.0" // Future routing support
}
```

Dev dependencies:
- `@vitejs/plugin-react`: JSX transformation
- `vite`: Build tool & dev server

## 🚀 Build Artifacts

When running `npm run build`, creates:
```
dist/
├── index.html
├── main.js (minified)
└── styles.css (minified)
```

All assets in single directory, ready for deployment.

## 📊 Component Sizes

| Component | Lines | Responsibility |
|-----------|-------|-----------------|
| App.jsx | 40 | Routing & mode switching |
| AppContext.jsx | 80 | State & helpers |
| CustomerApp.jsx | 35 | Customer layout |
| OrderForm.jsx | 300+ | 3-step form logic |
| TrackOrder.jsx | 100 | Order tracking |
| AdminApp.jsx | 20 | Admin mode switching |
| AdminLock.jsx | 40 | PIN validation |
| AdminPanel.jsx | 120 | Dashboard & stats |
| OrderCard.jsx | 100 | Order display & actions |
| Toast.jsx | 15 | Notifications |

**Total**: ~900 lines of component code (vs 400+ in original spread across files)

## 🎨 CSS Breakdown

| Section | Lines | Purpose |
|---------|-------|---------|
| Variables | 20 | Theme colors & sizes |
| Typography | 30 | Fonts & headers |
| Layout | 40 | Flexbox & grid |
| Forms | 80 | Input styling |
| Components | 300+ | Cards, buttons, etc. |
| Admin | 150+ | Admin-specific styles |
| Responsive | 50+ | Mobile adaptations |

## 🔌 Integration Points

### Google Sheets
- Configure in `config.js`: `SHEET_WEBHOOK_URL`
- Used by: `AppContext.loadOrders()`, `updateStatusInSheet()`
- Optional (set to `""` for offline mode)

### WhatsApp API
- No SDK needed, uses web links
- Numbers in international format (234...)
- Links: `wa.me/{number}?text={message}`

### localStorage
- Fallback when Sheets unavailable
- Key: `sp_orders_v2`
- Format: JSON array of orders

## 🔐 Security Notes

- Admin PIN in config (consider env variables for production)
- No authentication beyond PIN
- Orders in localStorage (client-side only in demo)
- Production should add backend database

## 💾 Deployment Ready

The built `dist/` folder is ready for:
- Static hosting (Vercel, Netlify, GitHub Pages)
- Traditional servers (copy to web root)
- Docker containers (simple HTTP server)

## 🎯 Future Extensions

The structure supports:
- Adding database backend
- Authentication system
- Order notifications (email, SMS)
- Analytics dashboard
- Multi-language support
- Dark mode theme
- PWA capabilities

---

**This structure balances simplicity with scalability!** 🚀
